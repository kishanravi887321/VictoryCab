import { ObjectId } from 'mongodb';
import { getDb } from '../db/connectDb.js';
import { httpError } from '../utils/httpError.js';

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);
const USER_OWNED_RESOURCES = new Set(['bookings', 'favorites', 'reviews', 'trips', 'search-history', 'notifications']);

function publicRecord(record) {
  if (!record) return record;
  const { _id, passwordHash, ...safeRecord } = record;
  return { id: String(_id), ...safeRecord };
}

function isAdmin(user) {
  return user && ADMIN_ROLES.has(user.role);
}

function idQuery(id) {
  if (ObjectId.isValid(id)) return { _id: new ObjectId(id) };
  return { id };
}

function scopedIdQuery(resource, id, user) {
  const query = idQuery(id);
  if (!user || isAdmin(user)) return query;
  if (USER_OWNED_RESOURCES.has(resource)) return { ...query, user_id: user.id };
  if (resource === 'businesses') return { ...query, owner_id: user.id };
  return query;
}

function parseSort(value) {
  if (value === 'rating') return { rating: -1 };
  if (value === 'popular') return { popular: -1, rating: -1 };
  if (value === 'name') return { name: 1 };
  if (value?.startsWith('-')) return { [value.slice(1)]: -1 };
  if (value) return { [value]: 1 };
  return { createdAt: -1 };
}

function coerceFilterValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

function queryFilters(request, allowedFilters, resource) {
  const filters = Object.fromEntries(
    allowedFilters
      .filter((key) => request.query[key] !== undefined && request.query[key] !== '')
      .map((key) => [key, coerceFilterValue(request.query[key])])
  );

  if (USER_OWNED_RESOURCES.has(resource) && request.user?.id && !isAdmin(request.user)) filters.user_id = request.user.id;
  if (resource === 'businesses' && request.query.mine === 'true' && request.user?.id && !isAdmin(request.user)) filters.owner_id = request.user.id;
  return filters;
}

function bodyWithOwner(resource, request) {
  const body = { ...request.body };
  if (!request.user?.id || isAdmin(request.user)) return body;
  if (USER_OWNED_RESOURCES.has(resource)) body.user_id = request.user.id;
  if (resource === 'businesses') body.owner_id = request.user.id;
  return body;
}

export function resourceController(resource, schema, options = {}) {
  const collection = () => getDb().collection(options.collection || resource);

  return {
    async list(request, response, next) {
      try {
        if (request.query.id) {
          const record = await collection().findOne(scopedIdQuery(resource, request.query.id, request.user));
          if (!record) return next(httpError(404, `${resource} not found`));
          return response.json(publicRecord(record));
        }

        const filters = queryFilters(request, options.filters || ['destination_id', 'city', 'business_type', 'type', 'category', 'verificationStatus', 'status', 'user_id', 'owner_id', 'target_type', 'target_id', 'reported'], resource);
        const limit = Math.min(Number(request.query.limit) || 50, 100);
        const skip = Number(request.query.offset) || 0;
        const [records, total] = await Promise.all([
          collection().find(filters).sort(parseSort(request.query.sort)).skip(skip).limit(limit).toArray(),
          collection().countDocuments(filters)
        ]);
        response.json({ success: true, data: records.map(publicRecord), total });
      } catch (error) {
        next(error);
      }
    },

    async get(request, response, next) {
      try {
        const record = await collection().findOne(scopedIdQuery(resource, request.params.id, request.user));
        if (!record) return next(httpError(404, `${resource} not found`));
        response.json({ success: true, data: publicRecord(record) });
      } catch (error) {
        next(error);
      }
    },

    async create(request, response, next) {
      try {
        const now = new Date();
        const document = { ...schema(bodyWithOwner(resource, request)), createdAt: now, updatedAt: now };
        const result = await collection().insertOne(document);
        response.status(201).json({ success: true, data: publicRecord({ _id: result.insertedId, ...document }) });
      } catch (error) {
        next(error);
      }
    },

    async update(request, response, next) {
      try {
        const id = request.params.id || request.body.id;
        if (!id) throw httpError(400, 'id is required');
        const query = scopedIdQuery(resource, id, request.user);
        const existing = await collection().findOne(query);
        if (!existing) return next(httpError(404, `${resource} not found`));
        const updates = { ...schema({ ...existing, ...bodyWithOwner(resource, request) }), updatedAt: new Date() };
        const result = await collection().findOneAndUpdate(query, { $set: updates }, { returnDocument: 'after' });
        response.json({ success: true, data: publicRecord(result) });
      } catch (error) {
        next(error);
      }
    },

    async remove(request, response, next) {
      try {
        const id = request.params.id || request.body.id || request.query.id;
        if (!id) throw httpError(400, 'id is required');
        const result = await collection().deleteOne(scopedIdQuery(resource, id, request.user));
        if (!result.deletedCount) return next(httpError(404, `${resource} not found`));
        response.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  };
}

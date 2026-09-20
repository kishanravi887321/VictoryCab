import { ObjectId } from 'mongodb';
import { getDb } from '../db/connectDb.js';
import { httpError } from '../utils/httpError.js';

const USER_OWNED_RESOURCES = new Set(['bookings', 'favorites', 'reviews', 'trips', 'search-history', 'notifications']);

function publicRecord(record) {
  if (!record) return record;
  const { _id, passwordHash, ...safeRecord } = record;
  return { id: String(_id), ...safeRecord };
}

function idQuery(id) {
  if (ObjectId.isValid(id)) return { _id: new ObjectId(id) };
  return { id };
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

  if (USER_OWNED_RESOURCES.has(resource) && request.user?.id && !filters.user_id) filters.user_id = request.user.id;
  return filters;
}

export function resourceController(resource, schema, options = {}) {
  const collection = () => getDb().collection(options.collection || resource);

  return {
    async list(request, response, next) {
      try {
        if (request.query.id) {
          const record = await collection().findOne(idQuery(request.query.id));
          if (!record) return next(httpError(404, `${resource} not found`));
          return response.json(publicRecord(record));
        }

        const filters = queryFilters(request, options.filters || ['destination_id', 'city', 'business_type', 'type', 'category', 'verificationStatus', 'status', 'user_id', 'target_type', 'target_id', 'reported'], resource);
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
        const record = await collection().findOne(idQuery(request.params.id));
        if (!record) return next(httpError(404, `${resource} not found`));
        response.json({ success: true, data: publicRecord(record) });
      } catch (error) {
        next(error);
      }
    },

    async create(request, response, next) {
      try {
        const now = new Date();
        const body = USER_OWNED_RESOURCES.has(resource) && request.user?.id && !request.body.user_id ? { ...request.body, user_id: request.user.id } : request.body;
        const document = { ...schema(body), createdAt: now, updatedAt: now };
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
        const existing = await collection().findOne(idQuery(id));
        if (!existing) return next(httpError(404, `${resource} not found`));
        const body = USER_OWNED_RESOURCES.has(resource) && request.user?.id && !request.body.user_id ? { ...request.body, user_id: request.user.id } : request.body;
        const updates = { ...schema({ ...existing, ...body }), updatedAt: new Date() };
        const result = await collection().findOneAndUpdate(idQuery(id), { $set: updates }, { returnDocument: 'after' });
        response.json({ success: true, data: publicRecord(result) });
      } catch (error) {
        next(error);
      }
    },

    async remove(request, response, next) {
      try {
        const id = request.params.id || request.body.id || request.query.id;
        if (!id) throw httpError(400, 'id is required');
        const result = await collection().deleteOne(idQuery(id));
        if (!result.deletedCount) return next(httpError(404, `${resource} not found`));
        response.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  };
}

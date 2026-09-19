import { createRecord, deleteRecord, findRecord, listRecords, updateRecord } from '../data/store.js';
import { httpError } from '../utils/httpError.js';

function publicRecord(record) {
  if (!record) return record;
  const { passwordHash, ...safeRecord } = record;
  return safeRecord;
}

export function resourceController(resource, schema, options = {}) {
  return {
    list(request, response) {
      const filters = options.filters || ['destination', 'business', 'type', 'category', 'verificationStatus'];
      const query = Object.fromEntries(filters.filter((key) => request.query[key]).map((key) => [key, request.query[key]]));
      response.json({ success: true, data: listRecords(resource, query).map(publicRecord) });
    },
    get(request, response, next) {
      const record = findRecord(resource, request.params.id);
      if (!record) return next(httpError(404, `${resource} not found`));
      response.json({ success: true, data: publicRecord(record) });
    },
    create(request, response, next) {
      try {
        const record = createRecord(resource, schema(request.body));
        response.status(201).json({ success: true, data: publicRecord(record) });
      } catch (error) { next(error); }
    },
    update(request, response, next) {
      try {
        const existing = findRecord(resource, request.params.id);
        if (!existing) return next(httpError(404, `${resource} not found`));
        const record = updateRecord(resource, request.params.id, schema({ ...existing, ...request.body }));
        response.json({ success: true, data: publicRecord(record) });
      } catch (error) { next(error); }
    },
    remove(request, response, next) {
      if (!deleteRecord(resource, request.params.id)) return next(httpError(404, `${resource} not found`));
      response.status(204).send();
    }
  };
}
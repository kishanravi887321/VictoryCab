import { randomUUID } from 'node:crypto';

const collections = new Map();

export function collection(name) {
  if (!collections.has(name)) collections.set(name, []);
  return collections.get(name);
}

export function createRecord(name, data) {
  const record = {
    id: randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  collection(name).push(record);
  return record;
}

export function listRecords(name, filters = {}) {
  return collection(name).filter((record) =>
    Object.entries(filters).every(([key, value]) => !value || String(record[key]) === String(value))
  );
}

export function findRecord(name, id) {
  return collection(name).find((record) => record.id === id);
}

export function updateRecord(name, id, data) {
  const record = findRecord(name, id);
  if (!record) return null;
  Object.assign(record, data, { updatedAt: new Date().toISOString() });
  return record;
}

export function deleteRecord(name, id) {
  const records = collection(name);
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return false;
  records.splice(index, 1);
  return true;
}
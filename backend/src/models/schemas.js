import { createHash } from 'node:crypto';
import {
  ATTRACTION_CATEGORIES,
  BUSINESS_TYPES,
  ROLES,
  VERIFICATION_STATUSES
} from '../config/constants.js';
import { httpError } from '../utils/httpError.js';

function required(data, fields) {
  const missing = fields.filter((field) => data[field] === undefined || data[field] === '');
  if (missing.length) throw httpError(400, 'Missing required fields', missing);
}

function oneOf(value, values, field) {
  if (value !== undefined && !values.includes(value)) {
    throw httpError(400, `${field} must be one of: ${values.join(', ')}`);
  }
}

function text(value, field) {
  if (value !== undefined && typeof value !== 'string') throw httpError(400, `${field} must be a string`);
  return value?.trim();
}

export function userSchema(data) {
  required(data, ['name', 'email']);
  if (!data.password && !data.passwordHash) throw httpError(400, 'Missing required fields', ['password']);
  oneOf(data.role, ROLES, 'role');
  const passwordHash = data.passwordHash || createHash('sha256').update(data.password).digest('hex');
  return {
    name: text(data.name, 'name'), email: text(data.email, 'email').toLowerCase(),
    passwordHash, phone: text(data.phone, 'phone'), profileImage: data.profileImage,
    preferences: data.preferences || {}, role: data.role || 'TOURIST', location: data.location
  };
}

export function businessSchema(data) {
  required(data, ['businessName', 'owner', 'type']);
  oneOf(data.type, BUSINESS_TYPES, 'type');
  oneOf(data.verificationStatus, VERIFICATION_STATUSES, 'verificationStatus');
  return { ...data, businessName: text(data.businessName, 'businessName'), verificationStatus: data.verificationStatus || 'PENDING' };
}

export function destinationSchema(data) {
  required(data, ['name', 'country']);
  return { ...data, name: text(data.name, 'name'), attractions: data.attractions || [], hotels: data.hotels || [], restaurants: data.restaurants || [], activities: data.activities || [] };
}

export function attractionSchema(data) {
  required(data, ['name', 'destination', 'category']);
  oneOf(data.category, ATTRACTION_CATEGORIES, 'category');
  return { ...data, name: text(data.name, 'name'), facilities: data.facilities || [], images: data.images || [] };
}

export function hotelSchema(data) {
  required(data, ['business', 'name', 'destination']);
  return { ...data, images: data.images || [], amenities: data.amenities || [] };
}

export function restaurantSchema(data) {
  required(data, ['business', 'name', 'cuisine', 'location']);
  return { ...data, images: data.images || [], menu: data.menu || [] };
}

export function tourGuideSchema(data) {
  required(data, ['user', 'languages', 'expertise', 'location']);
  return { ...data, languages: data.languages || [], expertise: data.expertise || [], verification: data.verification || 'PENDING', availability: data.availability || [] };
}
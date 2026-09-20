import { createHash } from 'node:crypto';
import { httpError } from '../utils/httpError.js';

const ROLES = new Set(['TRAVELLER', 'BUSINESS', 'BUSINESS_OWNER', 'TOUR_GUIDE', 'TRAVEL_AGENT', 'ADMIN', 'SUPER_ADMIN']);
const BUSINESS_STATUSES = new Set(['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED']);
const BOOKING_STATUSES = new Set(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']);

function cleanString(value) {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text || undefined;
}

function requiredString(input, field) {
  const value = cleanString(input[field]);
  if (!value) throw httpError(400, `${field} is required`);
  return value;
}

function optionalNumber(value, fallback = undefined) {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  if (Number.isNaN(number)) return fallback;
  return number;
}

function stringArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(cleanString).filter(Boolean);
  return String(value).split(',').map(cleanString).filter(Boolean);
}

function normalizeEmail(value) {
  const email = cleanString(value)?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw httpError(400, 'A valid email is required');
  return email;
}

function hashPassword(password) {
  if (!password) return undefined;
  return createHash('sha256').update(String(password)).digest('hex');
}

export function userSchema(input = {}) {
  const role = cleanString(input.role)?.toUpperCase() || 'TRAVELLER';
  if (!ROLES.has(role)) throw httpError(400, 'Invalid user role');

  const user = {
    email: normalizeEmail(input.email),
    full_name: requiredString(input, 'full_name'),
    phone: cleanString(input.phone),
    role,
    blocked: Boolean(input.blocked),
    preferences: {
      interests: stringArray(input.preferences?.interests ?? input.interests),
      travel_type: cleanString(input.preferences?.travel_type ?? input.travel_type),
      budget: cleanString(input.preferences?.budget ?? input.budget)
    }
  };

  const passwordHash = input.passwordHash || hashPassword(input.password);
  if (passwordHash) user.passwordHash = passwordHash;
  return user;
}

export function destinationSchema(input = {}) {
  return {
    name: requiredString(input, 'name'),
    state: cleanString(input.state),
    country: cleanString(input.country) || 'India',
    description: cleanString(input.description),
    image_url: cleanString(input.image_url),
    rating: optionalNumber(input.rating, 0),
    tags: stringArray(input.tags),
    popular: Boolean(input.popular)
  };
}

export function hotelSchema(input = {}) {
  return {
    name: requiredString(input, 'name'),
    city: cleanString(input.city || input.destination),
    destination_id: cleanString(input.destination_id),
    description: cleanString(input.description),
    image_url: cleanString(input.image_url),
    rating: optionalNumber(input.rating, 0),
    price_per_night: optionalNumber(input.price_per_night, 0),
    amenities: stringArray(input.amenities),
    reviews: Array.isArray(input.reviews) ? input.reviews : []
  };
}

export function attractionSchema(input = {}) {
  return {
    name: requiredString(input, 'name'),
    destination_id: cleanString(input.destination_id),
    city: cleanString(input.city || input.destination),
    category: cleanString(input.category),
    description: cleanString(input.description),
    image_url: cleanString(input.image_url),
    rating: optionalNumber(input.rating, 0),
    price: optionalNumber(input.price, 0),
    tags: stringArray(input.tags),
    reviews: Array.isArray(input.reviews) ? input.reviews : []
  };
}

export function restaurantSchema(input = {}) {
  return {
    name: requiredString(input, 'name'),
    destination_id: cleanString(input.destination_id),
    city: cleanString(input.city || input.destination),
    cuisine: cleanString(input.cuisine),
    description: cleanString(input.description),
    image_url: cleanString(input.image_url),
    rating: optionalNumber(input.rating, 0),
    price_for_two: optionalNumber(input.price_for_two, 0),
    reviews: Array.isArray(input.reviews) ? input.reviews : []
  };
}

export function tourGuideSchema(input = {}) {
  return {
    name: requiredString(input, 'name'),
    destination_id: cleanString(input.destination_id),
    city: cleanString(input.city || input.destination),
    languages: stringArray(input.languages),
    specialties: stringArray(input.specialties || input.tags),
    description: cleanString(input.description),
    image_url: cleanString(input.image_url),
    rating: optionalNumber(input.rating, 0),
    price_per_day: optionalNumber(input.price_per_day || input.price, 0),
    reviews: Array.isArray(input.reviews) ? input.reviews : []
  };
}

export function activitySchema(input = {}) {
  return {
    name: requiredString(input, 'name'),
    destination_id: cleanString(input.destination_id),
    destination: input.destination,
    city: cleanString(input.city || input.destination?.name),
    category: cleanString(input.category),
    description: cleanString(input.description),
    image_url: cleanString(input.image_url),
    rating: optionalNumber(input.rating, 0),
    price: optionalNumber(input.price, 0),
    duration_hours: optionalNumber(input.duration_hours),
    tags: stringArray(input.tags),
    reviews: Array.isArray(input.reviews) ? input.reviews : []
  };
}

export function businessSchema(input = {}) {
  const status = cleanString(input.status || input.verificationStatus)?.toUpperCase() || 'PENDING';
  if (!BUSINESS_STATUSES.has(status)) throw httpError(400, 'Invalid business status');
  return {
    business_type: cleanString(input.business_type || input.type) || 'other',
    name: requiredString(input, 'name'),
    description: cleanString(input.description),
    address: cleanString(input.address),
    phone: cleanString(input.phone),
    website: cleanString(input.website),
    owner_id: cleanString(input.owner_id || input.user_id),
    status,
    verificationStatus: status
  };
}

export function bookingSchema(input = {}) {
  const status = cleanString(input.status)?.toUpperCase() || 'CONFIRMED';
  if (!BOOKING_STATUSES.has(status)) throw httpError(400, 'Invalid booking status');
  return {
    user_id: cleanString(input.user_id),
    target_type: requiredString(input, 'target_type'),
    target_id: input.target_id,
    check_in: cleanString(input.check_in),
    check_out: cleanString(input.check_out),
    guests: optionalNumber(input.guests, 1),
    status
  };
}

export function reviewSchema(input = {}) {
  const rating = optionalNumber(input.rating);
  if (!rating || rating < 1 || rating > 5) throw httpError(400, 'rating must be between 1 and 5');
  return {
    user_id: cleanString(input.user_id),
    target_type: requiredString(input, 'target_type'),
    target_id: input.target_id,
    rating,
    comment: cleanString(input.comment),
    reported: Boolean(input.reported),
    status: cleanString(input.status) || 'PUBLISHED'
  };
}

export function favoriteSchema(input = {}) {
  return {
    user_id: cleanString(input.user_id),
    target_type: requiredString(input, 'target_type'),
    target_id: input.target_id
  };
}

export function tripSchema(input = {}) {
  return {
    user_id: cleanString(input.user_id),
    title: requiredString(input, 'title'),
    destination_id: cleanString(input.destination_id),
    start_date: cleanString(input.start_date),
    days: optionalNumber(input.days, 1),
    budget: optionalNumber(input.budget),
    travellers: optionalNumber(input.travellers, 1),
    interests: stringArray(input.interests),
    itinerary: Array.isArray(input.itinerary) ? input.itinerary : []
  };
}



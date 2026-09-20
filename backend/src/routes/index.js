import { randomUUID } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { Router } from 'express';
import { resourceController } from '../controllers/resourceController.js';
import {
  activitySchema,
  attractionSchema,
  bookingSchema,
  businessSchema,
  destinationSchema,
  favoriteSchema,
  hotelSchema,
  restaurantSchema,
  reviewSchema,
  tourGuideSchema,
  tripSchema,
  userSchema
} from '../models/schemas.js';
import { resourceRoutes } from './resourceRoutes.js';
import { getDb } from '../db/connectDb.js';
import { httpError } from '../utils/httpError.js';

const router = Router();
const v1 = Router();

function publicDocument(document) {
  if (!document) return document;
  const { _id, passwordHash, ...safeDocument } = document;
  return { id: String(_id), ...safeDocument };
}

function idFilter(id) {
  if (ObjectId.isValid(id)) return { _id: new ObjectId(id) };
  return { id };
}

function controllerFor(resource, schema) {
  return resourceController(resource, schema);
}

const resources = [
  ['users', userSchema],
  ['businesses', businessSchema],
  ['destinations', destinationSchema],
  ['attractions', attractionSchema],
  ['activities', activitySchema],
  ['hotels', hotelSchema],
  ['restaurants', restaurantSchema],
  ['tour-guides', tourGuideSchema],
  ['bookings', bookingSchema],
  ['reviews', reviewSchema],
  ['favorites', favoriteSchema],
  ['trips', tripSchema]
];

for (const [name, schema] of resources) v1.use(`/${name}`, resourceRoutes(controllerFor(name, schema)));

v1.get('/profile', async (request, response) => {
  const email = request.query.email;
  const id = request.query.id;
  const query = id ? idFilter(id) : email ? { email: String(email).toLowerCase() } : {};
  const profile = await getDb().collection('users').findOne(query);
  response.json(profile ? publicDocument(profile) : null);
});

v1.put('/profile', async (request, response, next) => {
  try {
    const id = request.body.id || request.query.id;
    if (!id) throw httpError(400, 'id is required');
    const users = getDb().collection('users');
    const existing = await users.findOne(idFilter(id));
    if (!existing) throw httpError(404, 'profile not found');
    const updates = userSchema({ ...existing, ...request.body });
    const profile = await users.findOneAndUpdate(idFilter(id), { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' });
    response.json({ success: true, data: publicDocument(profile) });
  } catch (error) {
    next(error);
  }
});

v1.get('/notifications', async (request, response) => {
  const filter = request.query.user_id ? { user_id: request.query.user_id } : {};
  const items = await getDb().collection('notifications').find(filter).sort({ createdAt: -1 }).limit(50).toArray();
  response.json(items.map(publicDocument));
});

v1.put('/notifications', async (request, response) => {
  const filter = request.body.all ? (request.body.user_id ? { user_id: request.body.user_id } : {}) : idFilter(request.body.id);
  await getDb().collection('notifications').updateMany(filter, { $set: { read: true, updatedAt: new Date() } });
  response.json({ success: true });
});

v1.get('/search-history', async (request, response) => {
  const filter = request.query.user_id ? { user_id: request.query.user_id } : {};
  const items = await getDb().collection('search-history').find(filter).sort({ createdAt: -1 }).limit(50).toArray();
  response.json(items.map(publicDocument));
});

v1.get('/business-analytics', async (request, response) => {
  const db = getDb();
  const [totalBookings, activeBusinesses, reviews] = await Promise.all([
    db.collection('bookings').countDocuments({}),
    db.collection('businesses').countDocuments({ status: 'VERIFIED' }),
    db.collection('reviews').countDocuments({})
  ]);
  response.json({ metrics: { total_bookings: totalBookings, active_businesses: activeBusinesses, reviews } });
});

v1.get('/admin/users', controllerFor('users', userSchema).list);
v1.put('/admin/users', controllerFor('users', userSchema).update);

v1.get('/admin/stats', async (request, response) => {
  const db = getDb();
  const [total_users, total_bookings, total_businesses, total_reviews, pending_businesses, reported_reviews] = await Promise.all([
    db.collection('users').countDocuments({}),
    db.collection('bookings').countDocuments({}),
    db.collection('businesses').countDocuments({}),
    db.collection('reviews').countDocuments({}),
    db.collection('businesses').countDocuments({ status: 'PENDING' }),
    db.collection('reviews').countDocuments({ reported: true })
  ]);
  response.json({ total_users, total_bookings, total_businesses, total_reviews, pending_businesses, reported_reviews });
});

v1.get('/admin/audit', async (request, response) => {
  const data = await getDb().collection('audit').find({}).sort({ createdAt: -1 }).limit(100).toArray();
  response.json({ data: data.map(publicDocument) });
});

v1.post('/ai/recommend', async (request, response) => {
  const tags = Array.isArray(request.body.interests) ? request.body.interests : [];
  const query = tags.length ? { tags: { $in: tags } } : {};
  const data = await getDb().collection('destinations').find(query).sort({ rating: -1 }).limit(6).toArray();
  response.json({ data: data.map(publicDocument) });
});

v1.post('/ai/plan', async (request, response) => {
  const days = Number(request.body.days) || 1;
  const trip = {
    title: request.body.title || 'Saved trip',
    destination_id: String(request.body.destination_id || ''),
    days,
    budget: Number(request.body.budget) || 0,
    travellers: Number(request.body.travellers) || 1,
    interests: Array.isArray(request.body.interests) ? request.body.interests : [],
    start_date: request.body.start_date,
    itinerary: Array.from({ length: days }, (_, index) => ({ day: index + 1, title: `Day ${index + 1}`, items: [] })),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  if (request.body.save) {
    const result = await getDb().collection('trips').insertOne(trip);
    return response.status(201).json({ id: String(result.insertedId), ...trip });
  }
  response.json(trip);
});

v1.get('/ai/chat', async (request, response) => {
  const db = getDb();
  if (request.query.conversation_id) {
    const convo = await db.collection('conversations').findOne({ id: request.query.conversation_id });
    return response.json(convo ? publicDocument(convo) : { id: request.query.conversation_id, messages: [] });
  }
  const data = await db.collection('conversations').find({}).sort({ updatedAt: -1 }).limit(30).toArray();
  response.json(data.map(publicDocument));
});

v1.post('/ai/chat', async (request, response) => {
  const db = getDb();
  const id = request.body.conversation_id || randomUUID();
  const userMessage = { role: 'user', content: request.body.message, createdAt: new Date() };
  const assistantMessage = { role: 'assistant', content: 'Message saved. Connect an AI provider to generate live travel answers.', createdAt: new Date() };
  await db.collection('conversations').updateOne(
    { id },
    { $setOnInsert: { id, createdAt: new Date() }, $push: { messages: { $each: [userMessage, assistantMessage] } }, $set: { updatedAt: new Date() } },
    { upsert: true }
  );
  response.json({ conversation_id: id, message: assistantMessage, messages: [userMessage, assistantMessage] });
});

v1.delete('/ai/chat', async (request, response) => {
  await getDb().collection('conversations').deleteOne({ id: request.body.id || request.query.id });
  response.status(204).send();
});

router.use('/v1', v1);
router.use('/', v1);

export default router;

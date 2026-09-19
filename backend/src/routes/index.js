import { Router } from 'express';
import { resourceController } from '../controllers/resourceController.js';
import { attractionSchema, businessSchema, destinationSchema, hotelSchema, restaurantSchema, tourGuideSchema, userSchema } from '../models/schemas.js';
import { resourceRoutes } from './resourceRoutes.js';

const router = Router();
const resources = [
  ['users', userSchema], ['businesses', businessSchema], ['destinations', destinationSchema],
  ['attractions', attractionSchema], ['hotels', hotelSchema], ['restaurants', restaurantSchema],
  ['tour-guides', tourGuideSchema]
];

for (const [name, schema] of resources) router.use(`/${name}`, resourceRoutes(resourceController(name, schema)));

export default router;
import { Router } from 'express';

export function resourceRoutes(controller) {
  const router = Router();
  router.route('/').get(controller.list).post(controller.create);
  router.route('/:id').get(controller.get).patch(controller.update).delete(controller.remove);
  return router;
}
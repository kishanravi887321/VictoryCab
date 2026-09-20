import { Router } from 'express';

export function resourceRoutes(controller) {
  const router = Router();
  router.route('/').get(controller.list).post(controller.create).put(controller.update).delete(controller.remove);
  router.route('/:id').get(controller.get).patch(controller.update).put(controller.update).delete(controller.remove);
  return router;
}

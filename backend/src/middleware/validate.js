import { httpError } from '../utils/httpError.js';

export function validate(schema) {
  return (request, response, next) => {
    try {
      request.body = schema(request.body || {});
      next();
    } catch (error) {
      next(error.status ? error : httpError(400, error.message));
    }
  };
}
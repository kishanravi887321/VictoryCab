import { getUserById, loginUser, registerUser } from '../services/authService.js';

export async function register(request, response, next) {
  try {
    const data = await registerUser(request.body || {});
    response.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const data = await loginUser(request.body || {});
    response.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function me(request, response) {
  const user = request.user?.id ? await getUserById(request.user.id) : null;
  response.json({ success: true, data: { user } });
}

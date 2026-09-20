import { ObjectId } from 'mongodb';
import { getDb } from '../db/connectDb.js';
import { verifyToken } from '../utils/token.js';

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);

function publicUser(user) {
  if (!user) return null;
  const { _id, passwordHash, ...safeUser } = user;
  return { id: String(_id), ...safeUser };
}

export async function attachUser(request, response, next) {
  try {
    const header = request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const payload = verifyToken(token);
    if (!payload?.sub) return next();

    const user = await getDb().collection('users').findOne({ _id: new ObjectId(payload.sub) });
    request.user = publicUser(user);
    next();
  } catch {
    next();
  }
}

export function requireAuth(request, response, next) {
  if (!request.user) return response.status(401).json({ success: false, message: 'Authentication required' });
  next();
}

export function requireAdmin(request, response, next) {
  if (!request.user) return response.status(401).json({ success: false, message: 'Authentication required' });
  if (!ADMIN_ROLES.has(request.user.role)) return response.status(403).json({ success: false, message: 'Admin access required' });
  next();
}

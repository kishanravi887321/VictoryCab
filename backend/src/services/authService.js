import { ObjectId } from 'mongodb';
import { getDb } from '../db/connectDb.js';
import { userSchema } from '../models/schemas.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';
import { httpError } from '../utils/httpError.js';

function publicUser(user) {
  if (!user) return null;
  const { _id, passwordHash, ...safeUser } = user;
  return { id: String(_id), ...safeUser };
}

function authResponse(user) {
  const safeUser = publicUser(user);
  return {
    token: signToken({ sub: safeUser.id, email: safeUser.email, role: safeUser.role }),
    user: safeUser
  };
}

export async function registerUser(payload) {
  if (!payload.password || String(payload.password).length < 6) throw httpError(400, 'Password must be at least 6 characters');

  const users = getDb().collection('users');
  const user = userSchema({ ...payload, passwordHash: hashPassword(payload.password) });
  const existing = await users.findOne({ email: user.email });
  if (existing) throw httpError(409, 'An account with this email already exists');

  const now = new Date();
  const document = { ...user, createdAt: now, updatedAt: now };
  const result = await users.insertOne(document);
  return authResponse({ _id: result.insertedId, ...document });
}

export async function loginUser({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) throw httpError(400, 'Email and password are required');

  const user = await getDb().collection('users').findOne({ email: normalizedEmail });
  if (!user || !verifyPassword(password, user.passwordHash)) throw httpError(401, 'Invalid email or password');
  if (user.blocked) throw httpError(403, 'This account has been blocked');

  return authResponse(user);
}

export async function getUserById(id) {
  if (!ObjectId.isValid(id)) return null;
  const user = await getDb().collection('users').findOne({ _id: new ObjectId(id) });
  return publicUser(user);
}


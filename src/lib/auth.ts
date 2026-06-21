import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

console.log('[Auth] JWT_SECRET:', JWT_SECRET ? `Set (length: ${JWT_SECRET.length})` : 'NOT SET');

// パスワード検証関数
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 最小文字数（8文字以上）
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }

  // 大文字（A-Z）を含むかチェック
  if (!/[A-Z]/.test(password)) {
    errors.push('大文字（A-Z）を含む必要があります');
  }

  // 小文字（a-z）を含むかチェック
  if (!/[a-z]/.test(password)) {
    errors.push('小文字（a-z）を含む必要があります');
  }

  // 数字（0-9）を含むかチェック
  if (!/[0-9]/.test(password)) {
    errors.push('数字（0-9）を含む必要があります');
  }

  // 記号を含むかチェック
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push('記号（!@#$%^&*など）を含む必要があります');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const hashPassword = async (password: string) => {
  return bcryptjs.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcryptjs.compare(password, hash);
};

export const generateToken = (userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  console.log('[Auth] generateToken:', { userId, tokenLength: token.length, secret: JWT_SECRET });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    console.log('[Auth] verifyToken:', { tokenLength: token.length, secret: JWT_SECRET });
    const result = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('[Auth] verifyToken SUCCESS:', result);
    return result;
  } catch (error) {
    console.log('[Auth] verifyToken FAILED:', error instanceof Error ? error.message : String(error));
    return null;
  }
};
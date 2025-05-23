import { SessionOptions } from 'iron-session';

export interface AppSession {
  isLoggedIn: boolean;
  etsyAccessToken?: string;
  etsyRefreshToken?: string;
  etsyTokenExpiresAt?: number;
  etsyUserId?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'dolphin-manage-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}; 
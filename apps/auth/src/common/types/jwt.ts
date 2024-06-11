export type TJwtPayload = {
  id: string;
  username: string;
  email: string;
  picture: string | null;
  fingerprint?: string;
  exp?: number;
};

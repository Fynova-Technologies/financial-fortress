import type { Request } from "express";

export interface Auth0RequestBody {
  username: string;
  email: string;
}

export interface Auth0Request extends Request<{}, {}, Auth0RequestBody> {
  auth?: {
    sub: string;
    email_verified?: boolean;
    [key: string]: any;
  };
}
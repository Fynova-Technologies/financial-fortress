// Use express-jwt + jwks-rsa to verify JWT access tokens and attach req.user.

import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { RequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config();

export const checkJwt: RequestHandler = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true, rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

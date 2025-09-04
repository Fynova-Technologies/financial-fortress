// Use express-jwt + jwks-rsa to verify JWT access tokens and attach req.user.

import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

console.log("cwd:", process.cwd());
console.log("AUTH0_AUDIENCE:", JSON.stringify(process.env.AUTH0_AUDIENCE));

export const checkJwt = expressjwt({

  // Dynamically provide a signing key based on the kid in the header
  requestProperty: "auth",
  secret: jwksRsa.expressJwtSecret({
    cache: true, rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
  
});

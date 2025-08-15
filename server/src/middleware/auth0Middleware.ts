// Use express-jwt + jwks-rsa to verify JWT access tokens and attach req.user.

import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

console.log("cwd:", process.cwd());
console.log("VITE_AUTH0_AUDIENCE:", JSON.stringify(process.env.VITE_AUTH0_AUDIENCE));
console.log("AUTH0_AUDIENCE:", JSON.stringify(process.env.AUTH0_AUDIENCE));

export const checkJwt = expressjwt({
  // Dynamically provide a signing key based on the kid in the header
  requestProperty: "auth",
  secret: jwksRsa.expressJwtSecret({
    cache: true, rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-l0cnkmnrn4reomjc.us.auth0.com/.well-known/jwks.json`
  }),
  // Validate the audience and the issuer
  // audience: process.env.VITE_AUTH0_AUDIENCE || "https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/",
  audience: "https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/",
  issuer: `https://dev-l0cnkmnrn4reomjc.us.auth0.com/`,
  algorithms: ["RS256"]
});

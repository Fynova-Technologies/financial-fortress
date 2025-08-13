import { Router, Request, Response, NextFunction } from "express";
import { checkJwt } from "../middleware/auth0Middleware";
import { checkEmailVerified } from "../middleware/checkEmailVerified";

// Define the interface locally in this file
interface AuthRequest extends Request {
  auth?: {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    [key: string]: any;
  };
}

const router = Router();

router.get("/protected", checkJwt, checkEmailVerified, (req: AuthRequest, res: Response) => {
  res.json({ message: "You are verified!", user: req.auth });
});

export default router;

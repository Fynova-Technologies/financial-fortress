import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  auth?: {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    [key: string]: any;
  };
}

export function checkEmailVerified(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.auth?.email_verified) {
    return res.status(403).json({
      error: "Email not verified. Please check your inbox."
    });
  }
  next();
}

import { NextFunction, Request, Response } from "express";

export const loginRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: "You must be logged in" });
};

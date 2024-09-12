import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("Authorization");
  if (!authorization)
    return res.status(401).json({ error: "No token provided" });
  if (!authorization.startsWith("Bearer "))
    return res.status(401).json({ error: "Invalid Bearer token" });

  const token = authorization.split(" ").at(1) || "";

  // todo:
    jwt.verify(token, process.env.SECRET!, (err, decoded) => {
    if (err) return res.status(401).json(err.message);
    req.body.user = decoded;
    next();
  });

};

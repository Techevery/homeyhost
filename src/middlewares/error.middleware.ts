import {Request, Response, NextFunction} from "express";
import HttpStatusCode from "../helpers/httpResponse";

const notFound = (req:Request, res:Response, next:NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HttpStatusCode.HTTP_NOT_FOUND);
  next(error)
}

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode); // Set status code if not already set

  res.json({
    success: false,
    message: err.message || 'Internal Server Error', // Default message if err.message is missing
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Hide stack trace in production
  });
};

export { notFound, errorHandler };
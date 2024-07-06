import { ValidationError } from "sequelize";
import boom from "@hapi/boom";

export function logErrors(err: any, req: any, res: any, next: any) {
  console.error(err);
  next(err);
}

export function errorHandler(err: any, req: any, res: any, next: any) {
  if (!err.isBoom) {
    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
}

export function boomErrorHandler(err: any, req: any, res: any, next: any) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

export function ormErrorHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  }
  next(err);
}

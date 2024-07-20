import boom from "@hapi/boom";

export function validatorHandler(schema: any, property: any) {
  return function (req: any, res: any, next: any) {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next(boom.badRequest(error));
    }
    next();
  };
}

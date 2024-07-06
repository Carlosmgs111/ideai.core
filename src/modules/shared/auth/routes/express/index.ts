export const expressHandlerAdapter = (handler: any) => {
  return async (req: any, res: any, next: any) => {
    const { body, params, query, user, token } = req;
    try {
      let code = 200;
      let result = await handler({
        ...body,
        ...params,
        ...query,
        user,
        token,
      });

      return res.send(result).status(code);
    } catch (e: any) {
      next(e);
    }
  };
};

import { ZodError } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
      });
      req.validated = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          details: err.issues
        });
      }
      next(err);
    }
  };
}


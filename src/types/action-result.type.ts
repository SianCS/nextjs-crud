export type SuccessActionResult<T = unknown> = {
  success: true;
  data?: T;
  message?: string;
};

export type ErrorActionResult<D = unknown> = {
  success: false;
  message: string;
  details?: D;
};

export type ActionResult<T = unknown, D = unknown> =
  | SuccessActionResult<T>
  | ErrorActionResult<D>;

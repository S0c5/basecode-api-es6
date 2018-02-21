import { middleware } from 'express-decorators';

export function policy(fn) {
  return middleware(fn);
}


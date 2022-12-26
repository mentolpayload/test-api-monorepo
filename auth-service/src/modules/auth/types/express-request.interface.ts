import { Request } from 'express';
import { JwtData } from '../strategies';

export interface ExpressRequestInterface extends Request {
  user?: JwtData;
}

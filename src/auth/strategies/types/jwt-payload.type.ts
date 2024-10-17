import { User } from 'codely/codely.entities/data-models';

export type JwtPayloadType = Pick<User, 'id'> & {
  iat: number;
  exp: number;
  role: string;
};

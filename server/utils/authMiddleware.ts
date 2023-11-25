import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

class Authenticate {
  authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): any => {
    const authHeader = req.headers.authorization;

    if (authHeader == null) return console.log('unauthorized request');

    jwt.verify(authHeader as string, '0000', (err, user) => {
      if (err) return res.sendStatus(403);
      req.body.user = user;

      return next();
    });
  };

  // build a middleware to check if user is admin
  checkAdmin = (req: Request, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;
    if (authHeader == null)
      return res.status(403).json({ message: 'no auth set. login first' }); //console.log(authHeader, 'unauthorized reques');

    jwt.verify(authHeader as string, '0000', (err, user) => {
      if (err) return res.sendStatus(404).json({ message: 'not admin 1' });
      if (typeof user !== 'string' && (user as JwtPayload).level) {
        if ((user as JwtPayload).level == 2) {
          console.log((user as JwtPayload).level, user as JwtPayload);

          req.body.user = user;
          return next();
        } else {
          return res
            .status(403)
            .json({ message: 'You are not admin, respect yourself pls' });
        }
      }
    });
  };

  // build a middleware to check if user is an accountant
  checkAccountant = (req: Request, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;
    if (authHeader == null)
      return res.status(403).json({ message: 'no auth set. login first' }); //console.log(authHeader, 'unauthorized reques');

    jwt.verify(authHeader as string, '0000', (err, user) => {
      if (err) return res.sendStatus(404).json({ message: 'not accountant 1' });
      if (typeof user !== 'string' && (user as JwtPayload).level) {
        if ((user as JwtPayload).level > 0) {
          req.body.user = user;
          return next();
        } else {
          console.log('error');

          return res
            .status(403)
            .json({ message: 'You are not accountant, respect yourself pls' });
        }
      }
    });
  };
}

export const authenticate = new Authenticate();

// export default authenticateToken;

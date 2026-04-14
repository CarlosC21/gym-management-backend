import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // If there is an error or no user was found in the token
    if (err || !user) {
      throw err || new UnauthorizedException('Please log in to access this resource.');
    }
    return user;
  }
}

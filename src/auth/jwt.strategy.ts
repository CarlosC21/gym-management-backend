import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_CHOOSE_BETTER_ONE_LATER', // Move to .env later
    });
  }

  async validate(payload: any) {
    // This object gets attached to Request.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

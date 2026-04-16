import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_CHOOSE_BETTER_ONE_LATER', // Ensure this matches your AuthService
    });
  }

  async validate(payload: any) {
    // This object is what 'req.user' becomes in your Controllers and Guards.
    // We MUST explicitly map 'status' here so the RolesGuard can see it.
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status, // <--- THE FIX: Passing the "Paid/Unpaid" status through
    };
  }
}

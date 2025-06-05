import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../users/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const jwtCanActivate = super.canActivate(context);
    
    if (jwtCanActivate instanceof Promise) {
      return jwtCanActivate.then(result => {
        if (!result) return false;
        return this.checkRoles(context);
      });
    }
    
    if (!jwtCanActivate) return false;
    
    return this.checkRoles(context);
  }

  private checkRoles(context: ExecutionContext): boolean {
    const reflector = new Reflector();
    const requiredRoles = reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
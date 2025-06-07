import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaslAbilityFactory } from './casl-ability.factory';

@Injectable()
export class AbilitiesInterceptor implements NestInterceptor {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return next.handle();
    }

    const ability = this.caslAbilityFactory.createForUser(user);
    request.ability = ability;

    return next.handle().pipe(
      map((data) => ({
        ...data,
        meta: {
          ...(data.meta || {}),
          ability: ability.rules,
        },
      })),
    );
  }
}
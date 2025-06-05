import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
  ForbiddenError
} from '@casl/ability';
import { User, UserRole } from '../users/user.entity';

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role === UserRole.ADMIN) {
      can('manage', 'all');
    } else if (user.role === UserRole.MANAGER) {
      can(['read', 'update'], User);
      cannot(['delete', 'create'], User);
    } else {
      can(['read', 'update'], User, { id: { $eq: user.id } });
      cannot(['delete', 'create'], User);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
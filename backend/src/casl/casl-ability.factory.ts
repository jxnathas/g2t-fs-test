import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  createMongoAbility,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { User, UserRole } from '../users/user.entity';
import { Action } from 'src/enums/action.enum';

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'all');
      return build({
        detectSubjectType: (item) =>
          item.constructor as ExtractSubjectType<Subjects>,
      });
    }

    if (user.role === UserRole.MANAGER) {
      can(Action.Read, User);

      can(Action.Update, User, ['name', 'email', 'password']);
      cannot(Action.Update, User, ['role']).because(
        'Only admin can change roles',
      );
      cannot(Action.Delete, User).because('Only admin can delete users');
    }

    if (user.role === UserRole.USER) {
      can(Action.Read, User, { id: user.id });
      can(Action.Update, User, ['name', 'email', 'password'], {
        id: user.id,
      });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
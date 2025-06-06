import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { UserRole } from '../users/user.entity';
import { Action } from '../enums/action.enum';
import { User } from '../users/user.entity';

type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

export function defineAbilitiesFor(user: User): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
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
      'Only admin can change roles'
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
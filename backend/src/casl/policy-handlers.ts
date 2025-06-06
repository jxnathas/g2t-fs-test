import { PolicyHandler } from './check-policies.decorator';
import { Action } from '../enums/action.enum';
import { User } from '../users/user.entity';

export class ReadUserPolicyHandler implements PolicyHandler {
  constructor(private user: User) {}

  handle(ability) {
    return ability.can(Action.Read, this.user);
  }
}

export class UpdateUserPolicyHandler implements PolicyHandler {
  constructor(private user: User, private fields?: string[]) {
    this.fields = fields || [];
  }

  handle(ability) {
    return (this.fields ?? []).every((field) =>
      ability.can(Action.Update, this.user, field),
    );
  }
}

export class DeleteUserPolicyHandler implements PolicyHandler {
  constructor(private user: User) {}

  handle(ability) {
    return ability.can(Action.Delete, this.user);
  }
}
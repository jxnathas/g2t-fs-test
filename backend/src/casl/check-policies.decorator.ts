import { SetMetadata } from '@nestjs/common';
import { Action } from '../enums/action.enum';

export interface PolicyHandler {
  handle(ability: any): boolean;
}

export type PolicyHandlerCallback = (ability: any) => boolean;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
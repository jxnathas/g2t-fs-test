import { SetMetadata } from '@nestjs/common';
import { Action } from '../enums/action.enum';
import { ReadUserPolicyHandler } from './policy-handlers';

export interface PolicyHandler {
  handle(ability: any): boolean;
}

export type PolicyHandlerCallback = (ability: any) => boolean;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (p0: ReadUserPolicyHandler, ...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
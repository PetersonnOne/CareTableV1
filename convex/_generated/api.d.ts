/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as administration from "../administration.js";
import type * as aiUsage from "../aiUsage.js";
import type * as appearance from "../appearance.js";
import type * as auth from "../auth.js";
import type * as demo from "../demo.js";
import type * as evaluation from "../evaluation.js";
import type * as households from "../households.js";
import type * as http from "../http.js";
import type * as identity from "../identity.js";
import type * as model_access from "../model/access.js";
import type * as model_audit from "../model/audit.js";
import type * as onboarding from "../onboarding.js";
import type * as planWorker from "../planWorker.js";
import type * as plans from "../plans.js";
import type * as plansStore from "../plansStore.js";
import type * as services_email from "../services/email.js";
import type * as services_planner from "../services/planner.js";
import type * as services_taste from "../services/taste.js";
import type * as validators from "../validators.js";
import type * as voice from "../voice.js";
import type * as voiceActions from "../voiceActions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  administration: typeof administration;
  aiUsage: typeof aiUsage;
  appearance: typeof appearance;
  auth: typeof auth;
  demo: typeof demo;
  evaluation: typeof evaluation;
  households: typeof households;
  http: typeof http;
  identity: typeof identity;
  "model/access": typeof model_access;
  "model/audit": typeof model_audit;
  onboarding: typeof onboarding;
  planWorker: typeof planWorker;
  plans: typeof plans;
  plansStore: typeof plansStore;
  "services/email": typeof services_email;
  "services/planner": typeof services_planner;
  "services/taste": typeof services_taste;
  validators: typeof validators;
  voice: typeof voice;
  voiceActions: typeof voiceActions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

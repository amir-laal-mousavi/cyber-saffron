/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academy from "../academy.js";
import type * as admin from "../admin.js";
import type * as adminAuthAction from "../adminAuthAction.js";
import type * as adminAuthMutation from "../adminAuthMutation.js";
import type * as agents from "../agents.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth_password from "../auth/password.js";
import type * as auth_passwordReset from "../auth/passwordReset.js";
import type * as cart from "../cart.js";
import type * as debug_auth from "../debug_auth.js";
import type * as fixAdmin from "../fixAdmin.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as products_extended from "../products_extended.js";
import type * as resetPasswordAction from "../resetPasswordAction.js";
import type * as sendPasswordReset from "../sendPasswordReset.js";
import type * as setAdmin from "../setAdmin.js";
import type * as support from "../support.js";
import type * as testing from "../testing.js";
import type * as users from "../users.js";
import type * as verifyAdmin from "../verifyAdmin.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academy: typeof academy;
  admin: typeof admin;
  adminAuthAction: typeof adminAuthAction;
  adminAuthMutation: typeof adminAuthMutation;
  agents: typeof agents;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  "auth/password": typeof auth_password;
  "auth/passwordReset": typeof auth_passwordReset;
  cart: typeof cart;
  debug_auth: typeof debug_auth;
  fixAdmin: typeof fixAdmin;
  http: typeof http;
  migrations: typeof migrations;
  orders: typeof orders;
  products: typeof products;
  products_extended: typeof products_extended;
  resetPasswordAction: typeof resetPasswordAction;
  sendPasswordReset: typeof sendPasswordReset;
  setAdmin: typeof setAdmin;
  support: typeof support;
  testing: typeof testing;
  users: typeof users;
  verifyAdmin: typeof verifyAdmin;
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

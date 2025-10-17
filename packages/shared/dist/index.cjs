"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  API_ENDPOINTS: () => API_ENDPOINTS,
  HTTP_STATUS: () => HTTP_STATUS,
  PLATFORM_VERSION: () => PLATFORM_VERSION,
  cn: () => cn,
  formatCurrency: () => formatCurrency,
  formatDate: () => formatDate
});
module.exports = __toCommonJS(index_exports);
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}
var PLATFORM_VERSION = "0.1.0";
var API_ENDPOINTS = {
  AUTH: "/api/auth",
  USERS: "/api/users",
  ACCOUNTS: "/api/accounts",
  CONTACTS: "/api/contacts",
  OPPORTUNITIES: "/api/opportunities"
};
var HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}
function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  API_ENDPOINTS,
  HTTP_STATUS,
  PLATFORM_VERSION,
  cn,
  formatCurrency,
  formatDate
});
//# sourceMappingURL=index.cjs.map
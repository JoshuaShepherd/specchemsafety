// src/index.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
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
export {
  API_ENDPOINTS,
  HTTP_STATUS,
  PLATFORM_VERSION,
  cn,
  formatCurrency,
  formatDate
};
//# sourceMappingURL=index.js.map
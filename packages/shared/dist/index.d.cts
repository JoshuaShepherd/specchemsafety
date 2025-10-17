import { ClassValue } from 'clsx';

declare function cn(...inputs: ClassValue[]): string;
declare const PLATFORM_VERSION = "0.1.0";
declare const API_ENDPOINTS: {
    readonly AUTH: "/api/auth";
    readonly USERS: "/api/users";
    readonly ACCOUNTS: "/api/accounts";
    readonly CONTACTS: "/api/contacts";
    readonly OPPORTUNITIES: "/api/opportunities";
};
declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_SERVER_ERROR: 500;
};
declare function formatCurrency(amount: number): string;
declare function formatDate(date: Date): string;

export { API_ENDPOINTS, HTTP_STATUS, PLATFORM_VERSION, cn, formatCurrency, formatDate };

"use strict";
// export const RoleHierarchy: Record<string, string[]> = {
//     super_admin: ['admin'],
//     admin: ['manager'],
//     manager: ['proof_reader', 'editor', 'sales_manager'], // added sales_manager for manager role and higher roles
//     sales_manager: ['user'], // added sales_manager role
//     proof_reader: ['user'],
//     editor: ['user'],
//     premium_user: ['user'],
//     user: [],
// } as const;
//
// export const RoleBasedPermissions: Record<string, string[]> = {
//     super_admin: [],
//     admin: ['product:delete', 'user:delete'], // [product:create, product:update, product:review, product:read], [user:create, user:update, user:delete, user:delete]
//     manager: ['user:create', 'user:update'], // [product:create, product:update, product:review, product:read], [user:create, user:update]
//     proof_reader: [], // // [product:create, product:update, product:review, product:read]
//     editor: ['product:create', 'product:update'], // [product:create, product:update, product:review, product:read]
//     premium_user: ['product:review'], // [product:read, product:review]
//     user: ['product:read'],
// } as const;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleBasedPermissions = exports.RoleHierarchy = exports.Permission = exports.Role = void 0;
// Updated Version
// Define roles as an enum for better type safety
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "super_admin";
    Role["ADMIN"] = "admin";
    Role["MANAGER"] = "manager";
    Role["PREMIUM_USER"] = "premium_user";
    Role["USER"] = "user";
})(Role || (exports.Role = Role = {}));
// Define permissions as an enum
var Permission;
(function (Permission) {
    // Product permissions
    Permission["PRODUCT_CREATE"] = "product:create";
    Permission["PRODUCT_READ"] = "product:read";
    Permission["PRODUCT_UPDATE"] = "product:update";
    Permission["PRODUCT_DELETE"] = "product:delete";
    Permission["PRODUCT_REVIEW"] = "product:review";
    // User permissions
    Permission["USER_CREATE"] = "user:create";
    Permission["USER_READ"] = "user:read";
    Permission["USER_UPDATE"] = "user:update";
    Permission["USER_DELETE"] = "user:delete";
})(Permission || (exports.Permission = Permission = {}));
// Role hierarchy definition
exports.RoleHierarchy = {
    [Role.SUPER_ADMIN]: [Role.ADMIN],
    [Role.ADMIN]: [Role.MANAGER],
    [Role.MANAGER]: [Role.PREMIUM_USER],
    [Role.PREMIUM_USER]: [Role.USER],
    [Role.USER]: [],
};
// Role-based permissions definition
exports.RoleBasedPermissions = {
    [Role.SUPER_ADMIN]: [],
    [Role.ADMIN]: [
        Permission.PRODUCT_DELETE,
        Permission.USER_DELETE,
    ],
    [Role.MANAGER]: [
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_UPDATE,
        Permission.USER_CREATE,
        Permission.USER_UPDATE,
        Permission.USER_READ,
    ],
    [Role.PREMIUM_USER]: [
        Permission.PRODUCT_REVIEW,
    ],
    [Role.USER]: [
        Permission.PRODUCT_READ,
    ],
};
//# sourceMappingURL=config.js.map
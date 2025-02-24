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

// Updated Version
// Define roles as an enum for better type safety
export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    PREMIUM_USER = 'premium_user',
    USER = 'user',
}

// Define permissions as an enum
export enum Permission {
    // Product permissions
    PRODUCT_CREATE = 'product:create',
    PRODUCT_READ = 'product:read',
    PRODUCT_UPDATE = 'product:update',
    PRODUCT_DELETE = 'product:delete',
    PRODUCT_REVIEW = 'product:review',

    // User permissions
    USER_CREATE = 'user:create',
    USER_READ = 'user:read',
    USER_UPDATE = 'user:update',
    USER_DELETE = 'user:delete',
}

// Role hierarchy definition
export const RoleHierarchy: Record<Role, Role[]> = {
    [Role.SUPER_ADMIN]: [Role.ADMIN],
    [Role.ADMIN]: [Role.MANAGER],
    [Role.MANAGER]: [Role.PREMIUM_USER],
    [Role.PREMIUM_USER]: [Role.USER],
    [Role.USER]: [],
} as const;

// Role-based permissions definition
export const RoleBasedPermissions: Record<Role, Permission[]> = {
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
} as const;

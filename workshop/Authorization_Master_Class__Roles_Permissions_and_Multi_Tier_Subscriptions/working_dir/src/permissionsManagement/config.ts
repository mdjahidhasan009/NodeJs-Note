export const RoleHierarchy: Record<string, string[]> = {
    superAdmin: ['admin'],
    admin: ['manager'],
    manager: ['proof_reader', 'editor', 'sales_manager'], // added sales_manager for manager role and higher roles
    sales_manager: ['user'], // added sales_manager role
    proof_reader: ['user'],
    editor: ['user'],
    premium_user: ['user'],
    user: [],
} as const;

export const RoleBasedPermission: Record<string, string[]> = {
    super_admin: [],
    admin: ['product:delete', 'user:delete'], // [product:create, product:update, product:review, product:read], [user:create, user:update, user:delete, user:delete]
    manager: ['user:create', 'user:update'], // [product:create, product:update, product:review, product:read], [user:create, user:update]
    proof_reader: [], // // [product:create, product:update, product:review, product:read]
    editor: ['product:create', 'product:update'], // [product:create, product:update, product:review, product:read]
    premium_user: ['product:review'], // [product:read, product:review]
    user: ['product:read'],
} as const;

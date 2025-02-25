export const RoleHierarchy: Record<string, string[]> = {
	admin: ['user'],
	user: [],
} as const;

export const RoleBasedPermissions: Record<string, string[]> = {
	admin: ['product:delete', 'product:create', 'product:update'],
	user: ['product:read'],
} as const;

export const RoleHierarchy: Record<string, string[]> = {
	admin: ['user'],

	// Users
	tier3: ['tier2'],
	tier2: ['tier1'],
	tier1: ['user'],
	user: [],
} as const;

export const RoleBasedPermissions: Record<string, string[]> = {
	admin: ['product:delete', 'product:create', 'product:update'],
	user: ['product:read'],
} as const;

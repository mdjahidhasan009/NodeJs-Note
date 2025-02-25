import { RoleBasedPermissions, RoleHierarchy } from './config';

interface PermissionContext {
	roles: string[];
	permissions: string[];
}

export class PermissionManager {
	private readonly cachedRoleHierarchy: Map<string, Set<string>> = new Map();
	private readonly cachedRolePermissions: Map<string, Set<string>> = new Map();

	constructor(private readonly context: PermissionContext) {
		// Flatten the role hierarchy and cache it
		Object.keys(RoleHierarchy).forEach((role) => {
			this.cachedRoleHierarchy.set(role, this.computeRoleHierarchy(role));
		});

		// Flatten the role permissions and cache it
		Object.keys(RoleBasedPermissions).forEach((role) => {
			this.cachedRolePermissions.set(role, this.computeRolePermissions(role));
		});
	}

	hasPermission(requiredPermission: string) {
		if (this.context.permissions.includes(requiredPermission)) {
			return true;
		}

		return this.hasPermissionThroughRole(
			this.context.roles,
			requiredPermission
		);
	}

	hasPermissions(requiredPermissions: string[]) {
		return requiredPermissions.every((permission) =>
			this.hasPermission(permission)
		);
	}

	hasAnyPermission(requiredPermissions: string[]) {
		return requiredPermissions.some((permission) =>
			this.hasPermission(permission)
		);
	}

	hasRole(requiredRole: string) {
		return this.context.roles.some((role) => {
			const hierarchySet = this.cachedRoleHierarchy.get(role);
			return hierarchySet?.has(requiredRole) || role === requiredRole;
		});
	}

	getMaxRole() {
		return this.context.roles.reduce((maxRole, currentRole) => {
			return this.cachedRoleHierarchy.get(maxRole)?.has(currentRole)
				? maxRole
				: currentRole;
		}, this.context.roles[0]);
	}

	// Private Methods
	private computeRoleHierarchy(role: string, visited: Set<string> = new Set()) {
		const result = new Set<string>();

		if (visited.has(role)) {
			return result;
		}

		visited.add(role);

		const inheritedRoles = RoleHierarchy[role] || [];
		inheritedRoles.forEach((inheritedRole) => {
			result.add(inheritedRole);

			const inheritedHierarchy = this.computeRoleHierarchy(
				inheritedRole,
				visited
			);
			inheritedHierarchy.forEach((r) => result.add(r));
		});

		return result;
	}

	private computeRolePermissions(
		role: string,
		visited: Set<string> = new Set()
	) {
		const result = new Set<string>();

		if (visited.has(role)) {
			return result;
		}

		visited.add(role);

		RoleBasedPermissions[role].forEach((permission) => result.add(permission));

		const hierarchySet = this.cachedRoleHierarchy.get(role);

		// Could be replaced using a recursive function
		hierarchySet?.forEach((inheritedRole) => {
			RoleBasedPermissions[inheritedRole]?.forEach((permission) =>
				result.add(permission)
			);
		});

		return result;
	}

	private hasPermissionThroughRole(roles: string[], permission: string) {
		return roles.some((role) =>
			this.cachedRolePermissions.get(role)?.has(permission)
		);
	}
}

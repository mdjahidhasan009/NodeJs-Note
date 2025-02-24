# Database Design
We need two separate tables to store roles and permissions. These are the global roles and permissions.
* Role
  * id
  * name
  * description
  * inherit
* Permissionid
  * role id
  * name

For every user we can manager additional tables to manage user specific roles and permissions.

# Understand Role Hierarchy
```ts
export const RoleHierarchy: Record<string, string[]> = {
	super_admin: ['admin'],
	admin: ['manager'],
	manager: ['premium_user'],
	premium_user: ['user'],
	user: [],
} as const;

export const RoleBasedPermissions: Record<string, string[]> = {
	super_admin: [],
	admin: ['product:delete', 'user:delete'],
	manager: [
		'product:create',
		'product:update',
		'user:create',
		'user:update',
		'user:read',
	],
	premium_user: ['product:review'],
	user: ['product:read'],
} as const;
```

This setup can be stored in database or direct inside the codebase. Because we need the hierarchy during the runtime.

Type Safe and Improved Version
```ts
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
```

## Permission Manager
```ts
import { RoleBasedPermissions, RoleHierarchy } from './config/permissions';

interface PermissionContext {
	roles: string[];
	permissions: string[];
}

export class PermissionManager {
	private readonly cachedRoleHierarchy: Map<string, Set<string>> = new Map();
	private readonly cachedRolePermissions: Map<string, Set<string>> = new Map();

	constructor(private readonly context: PermissionContext) {
		Object.keys(RoleHierarchy).forEach((role) => {
			this.cachedRoleHierarchy.set(role, this.computeRoleHierarchy(role));
		});

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

	private computeRoleHierarchy(
		role: string,
		visited: Set<string> = new Set()
	): Set<string> {
		const result = new Set<string>();

		if (visited.has(role)) return result;

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

		if (visited.has(role)) return result;

		visited.add(role);

		RoleBasedPermissions[role].forEach((permission) => result.add(permission));

		const hierarchySet = this.cachedRoleHierarchy.get(role);
		hierarchySet?.forEach((inheritedRole) => {
			RoleBasedPermissions[inheritedRole].forEach((permission) =>
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
```

### Explain `computeRoleHierarchy` Algorithm.:

The algorithm uses a depth-first search (DFS) approach to traverse the role hierarchy tree and handles cyclic
dependencies using a visited set. Here's how it works:

Input:
* **role**: The starting role we want to compute the hierarchy for
* **visited**: A Set to keep track of already processed roles

Steps:
```
For role "ADMIN" that inherits from ["MODERATOR", "USER"]:
   ADMIN
   ├── MODERATOR
   │   └── USER
   └── USER
```

* Create an empty result Set to store all inherited roles
* If the current role was already visited, return empty set (cycle detection)
* Mark current role as visited
* Get all directly inherited roles from RoleHierarchy[role]
* For each directly inherited role:
  * Add it to the result set
  * Recursively compute that role's hierarchy
  * Add all roles from recursive call to result set

Example:

```
RoleHierarchy = {
    ADMIN: ["MODERATOR", "USER"],
    MODERATOR: ["USER"],
    USER: []
  }
```

Calling computeRoleHierarchy("ADMIN") would:
* Add "MODERATOR" to result
* Recursively process "MODERATOR"
* Add "USER" to result
* Add "USER" to result (direct inheritance)

Final result: Set {"MODERATOR", "USER"}
### Explain `computeRolePermissions` Algorithm.:
The above function computes the complete set of permissions for a given role, including both its direct permissions and those inherited from its subordinate roles.

Input:
* **role**: The role we want to compute permissions for
* **visited**: A Set to prevent infinite loops in case of cyclic dependencies

Steps:
* a. Create an empty result Set to store all permissions
* b. Check for cycles using the visited Set
* c. Add direct permissions from RoleBasedPermissions
* d. Add inherited permissions from all subordinate roles (using cachedRoleHierarchy)

Example:
```
admin
├── Direct permissions: ['product:delete', 'user:delete']
└── Inherits from:
    └── manager
        ├── Direct: ['product:create', 'product:update', 'user:create', 'user:update', 'user:read']
        └── Inherits from:
            └── premium_user
                ├── Direct: ['product:review']
                └── Inherits from:
                    └── user
                        └── Direct: ['product:read']
```

So calling `computeRolePermissions("admin")` would return a Set containing:
```
{
  'product:delete',   // from admin
  'user:delete',      // from admin
  'product:create',   // from manager
  'product:update',   // from manager
  'user:create',      // from manager
  'user:update',      // from manager
  'user:read',        // from manager
  'product:review',   // from premium_user
  'product:read'      // from user
}
```
The key difference between this and the previous `computeRoleHierarchy` is that this algorithm:

* Uses the pre-computed hierarchy (stored in `cachedRoleHierarchy`)
* Focuses on collecting permissions rather than roles
* Doesn't need to recurse because the hierarchy is already flattened

This makes the permission computation more efficient as it avoids recomputing the role hierarchy every time permissions
need to be checked.

## Policy Builder
```ts
export interface PolicyResult {
	allowed: boolean;
	name: string;
	reason?: string;
}

export interface PolicyContext extends Record<string, unknown> {
	userId?: string | number;
	roles?: string[];
	permissions?: string[];
	featureFlags?: Record<string, boolean>;
}
```
```ts
export abstract class Policy {
	constructor(
		public readonly name: string,
		public readonly description: string
	) {}

	abstract can(context: PolicyContext): Promise<PolicyResult>;

	protected allowed(): PolicyResult {
		return { allowed: true, name: this.name };
	}

	protected denied(reason?: string): PolicyResult {
		return { allowed: false, name: this.name, reason };
	}
}
```
```ts
export class PolicyGroup {
	constructor(private readonly policies: Policy[]) {}

	async can(context: PolicyContext): Promise<PolicyResult> {
		for (const policy of this.policies) {
			const result = await policy.can(context);
			if (!result.allowed) {
				return result;
			}
		}
		return { allowed: true, name: 'PolicyGroup' };
	}

	async canAny(context: PolicyContext): Promise<PolicyResult> {
		for (const policy of this.policies) {
			const result = await policy.can(context);
			if (result.allowed) {
				return result;
			}
		}
		return { allowed: false, name: 'PolicyGroup' };
	}

	async evaluateAll(context: PolicyContext): Promise<PolicyResult[]> {
		return Promise.all(this.policies.map((policy) => policy.can(context)));
	}
}
```
```ts
export class PolicyBuilder {
	private policies: Policy[] = [];

	private constructor() {}

	static create(): PolicyBuilder {
		return new PolicyBuilder();
	}

	addPolicy(policy: Policy): PolicyBuilder {
		this.policies.push(policy);
		return this;
	}

	addManyPolicies(policies: Policy[]): PolicyBuilder {
		this.policies.push(...policies);
		return this;
	}

	build(): PolicyGroup {
		return new PolicyGroup(this.policies);
	}
}
```
Examples
```ts
class EnrollmentPolicy extends Policy {
	constructor(name: string, description: string) {
		super(name, description);
	}

	async can(context: PolicyContext): Promise<PolicyResult> {
		// Do some logic to check if the user is enrolled in the policy
		return this.allowed();
	}
}

class UserRolePolicy extends Policy {
	constructor(name: string, description: string) {
		super(name, description);
	}

	async can(context: PolicyContext): Promise<PolicyResult> {
		// Do some logic to check if the user has the role
		return this.allowed();
	}
}

const policyGroup = PolicyBuilder.create()
	.addPolicy(
		new EnrollmentPolicy(
			'EnrollmentPolicy',
			'Check if the user is enrolled in the policy'
		)
	)
	.addPolicy(
		new UserRolePolicy('UserRolePolicy', 'Check if the user has the role')
	)
	.build();
```

## Resources
* [Authorization Master Class - Roles, Permissions & Multi Tier Subscriptions](https://www.stacklearner.com/my/workshops/authorization-master-class-roles-permissions-and-multi-tier-subscriptions)

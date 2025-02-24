import {RoleHierarchy} from "@/permissionsManagement/config";

interface PermissionContext {
    roles: string[];
    permissions: string[];
}

export class PermissionManager {
    constructor(private readonly context: PermissionContext) {}
    // Flatten the role hierarchy and cache it

    // Flatten the role permissions and cache it

    private completeRoleHierarchy(role: string, visited: Set<string> = new Set()) {
        const result = new Set<string>();

        if(visited.has(role)) {
            return result;
        }

        visited.add(role);

        const inheritedRoles = RoleHierarchy[role] || [];
        inheritedRoles.forEach((inheritedRole) => {
            result.add(inheritedRole);

            const inheritedRoleResult = this.completeRoleHierarchy(inheritedRole, visited);
        });
    }
}

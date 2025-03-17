"use strict";
// import {RoleBasedPermissions, RoleHierarchy} from "./config";
//
// interface PermissionContext {
//     roles: string[];
//     permissions: string[];
// }
//
// export class PermissionManager {
//     private readonly cachedRoleHierarchy: Map<string, Set<string>> = new Map();
//     private readonly cachedRolePermissions: Map<string, Set<string>> = new Map();
//
//     constructor(private readonly context: PermissionContext) {
//         // Flatten the role hierarchy and cache it
//         Object.keys(RoleHierarchy).forEach((role) => {
//             this.cachedRoleHierarchy.set(role, this.completeRoleHierarchy(role));
//         });
//
//         // Flatten the role permissions and cache it
//         Object.keys(RoleBasedPermissions).forEach((role) => {
//             this.cachedRolePermissions.set(
//                 role,
//                 this.computeRolePermissions(role)
//             );
//         });
//
//         console.log(this.cachedRolePermissions);
//     }
//
//     hasPermission(requiredPermission: string) {
//         return this.hasPermissionThroughRole(
//             this.context.roles,
//             requiredPermission
//         );
//     }
//
//     hasPermissions(requiredPermissions: string[]) {
//         return requiredPermissions.every((permission) =>
//             this.hasPermission(permission)
//         );
//     }
//
//     private completeRoleHierarchy(role: string, visited: Set<string> = new Set()) {
//         const result = new Set<string>();
//
//         if(visited.has(role)) {
//             return result;
//         }
//
//         visited.add(role);
//
//         const inheritedRoles = RoleHierarchy[role] || [];
//         inheritedRoles.forEach((inheritedRole) => {
//             result.add(inheritedRole);
//
//             const inheritedHierarchy = this.completeRoleHierarchy(
//                 inheritedRole,
//                 visited
//             );
//             inheritedHierarchy.forEach((inheritedRole) => result.add(inheritedRole));
//         });
//
//         return result;
//     }
//
//     private computeRolePermissions(role: string, visited: Set<string> = new Set()) {
//         const result = new Set<string>();
//
//         if(visited.has(role)) {
//             return result;
//         }
//
//         visited.add(role);
//
//         RoleBasedPermissions[role].forEach((permission) => result.add(permission));
//         const hierarchySet = this.cachedRoleHierarchy.get(role);
//
//         // Could be replaced using a recursive function
//         hierarchySet?.forEach((inheritedRole) => {
//             RoleBasedPermissions[inheritedRole]?.forEach((permission) => result.add(permission));
//         });
//
//         return result;
//     }
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionManager = void 0;
// Updated Version
const config_1 = require("./config");
class PermissionManager {
    context;
    cachedRoleHierarchy = new Map();
    cachedRolePermissions = new Map();
    constructor(context) {
        this.context = context;
        Object.keys(config_1.RoleHierarchy).forEach((role) => {
            const typedRole = role; ////TODO: have to see if i can done this without type assertion
            this.cachedRoleHierarchy.set(role, this.computeRoleHierarchy(typedRole));
        });
        Object.keys(config_1.RoleBasedPermissions).forEach((role) => {
            const typedRole = role; ////TODO: have to see if i can done this without type assertion
            this.cachedRolePermissions.set(role, this.computeRolePermissions(typedRole));
        });
    }
    hasPermission(requiredPermission) {
        if (this.context.permissions.includes(requiredPermission)) {
            return true;
        }
        return this.hasPermissionThroughRole(this.context.roles, requiredPermission);
    }
    hasPermissions(requiredPermissions) {
        return requiredPermissions.every((permission) => this.hasPermission(permission));
    }
    hasAnyPermission(requiredPermissions) {
        return requiredPermissions.some((permission) => this.hasPermission(permission));
    }
    hasRole(requiredRole) {
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
    computeRoleHierarchy(
    // role: string,
    role, 
    // visited: Set<string> = new Set()
    visited = new Set()
    // ): Set<string> {
    ) {
        // const result = new Set<string>();
        const result = new Set();
        if (visited.has(role))
            return result;
        visited.add(role);
        const inheritedRoles = config_1.RoleHierarchy[role] || [];
        inheritedRoles.forEach((inheritedRole) => {
            result.add(inheritedRole);
            const inheritedHierarchy = this.computeRoleHierarchy(inheritedRole, visited);
            inheritedHierarchy.forEach((r) => result.add(r));
        });
        return result;
    }
    computeRolePermissions(
    // role: string,
    role, 
    // visited: Set<string> = new Set()
    visited = new Set()) {
        // const result = new Set<string>();
        const result = new Set();
        if (visited.has(role))
            return result;
        visited.add(role);
        config_1.RoleBasedPermissions[role].forEach((permission) => result.add(permission));
        const hierarchySet = this.cachedRoleHierarchy.get(role);
        hierarchySet?.forEach((inheritedRole) => {
            config_1.RoleBasedPermissions[inheritedRole].forEach((permission) => result.add(permission));
        });
        return result;
    }
    hasPermissionThroughRole(roles, permission) {
        return roles.some((role) => this.cachedRolePermissions.get(role)?.has(permission));
    }
}
exports.PermissionManager = PermissionManager;
//# sourceMappingURL=PermissionManager.js.map
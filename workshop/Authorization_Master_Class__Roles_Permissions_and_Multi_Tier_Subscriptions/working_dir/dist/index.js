"use strict";
// enum Role {
//     Admin = 'Admin',
//     Manager = 'Manager',
//     User = 'User'
// }
Object.defineProperty(exports, "__esModule", { value: true });
// enum Role {
//     User = 1,
//     Manager = 2,
//     Admin = 3,
// }
// const roleHierarchy = {
//     superAdmin: ['create', 'read', 'update', 'delete'],
// }
const PermissionManager_1 = require("./permissionsManagement/PermissionManager");
const roleHierarchy = {
    superAdmin: ['admin'],
    admin: ['manager'],
    manager: ['proof_reader', 'editor'],
    proof_reader: ['user'],
    editor: ['user'],
    user: [],
};
// not recommended
const simpleRoleHierarchy = {
    superAdmin: ['admin', 'manager', 'proof_reader', 'editor', 'user'],
    admin: ['manager', 'proof_reader', 'editor', 'user'],
    manager: ['proof_reader', 'editor', 'user'],
    proof_reader: ['user'],
    editor: ['user'],
    user: [],
};
// now we need to add new role 'sales_manager'
//Recommended way maintaining role hierarchy as adding new role easily
const roleHierarchy2 = {
    superAdmin: ['admin'],
    admin: ['manager'],
    manager: ['proof_reader', 'editor', 'sales_manager'], // added sales_manager for manager role and higher roles
    sales_manager: ['user'], // added sales_manager role
    proof_reader: ['user'],
    editor: ['user'],
    premium_user: ['user'],
    user: [],
};
// not recommended as we need to add new role 'sales_manager' in all roles in higher hierarchy
const simpleRoleHierarchy2 = {
    superAdmin: ['admin', 'manager', 'sales_manager', 'proof_reader', 'editor', 'user'],
    admin: ['manager', 'sales_manager', 'proof_reader', 'editor', 'user'],
    manager: ['sales_manager', 'proof_reader', 'editor', 'user'],
    sales_manager: ['user'],
    proof_reader: ['user'],
    editor: ['user'],
    premium_user: ['user'],
    user: [],
};
const permissions = {
    super_admin: [],
    admin: ['product:delete', 'user:delete'], // [product:create, product:update, product:review, product:read], [user:create, user:update, user:delete, user:delete]
    manager: ['user:create', 'user:update'], // [product:create, product:update, product:review, product:read], [user:create, user:update]
    proof_reader: [], // // [product:create, product:update, product:review, product:read]
    editor: ['product:create', 'product:update'], // [product:create, product:update, product:review, product:read]
    premium_user: ['product:review'], // [product:read, product:review]
    user: ['product:read'],
};
const user = {
    id: '123',
    name: 'John Doe',
    roles: ['super_admin'],
    permissions: ['product:read']
};
const pm = new PermissionManager_1.PermissionManager({
    roles: user.roles,
    permissions: user.permissions
});
console.log(pm.hasPermission('product:delete')); // false
console.log(pm.hasPermission('user:delete')); // false
console.log(pm.hasPermission('product:update')); // false
console.log(pm.hasPermission('product:create')); // false
console.log(pm.hasPermission('user:create')); // false
//# sourceMappingURL=index.js.map
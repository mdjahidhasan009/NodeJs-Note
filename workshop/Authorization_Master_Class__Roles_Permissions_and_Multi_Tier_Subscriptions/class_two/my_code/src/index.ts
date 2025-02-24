// enum Role {
//     Admin = 'Admin',
//     Manager = 'Manager',
//     User = 'User'
// }

// enum Role {
//     User = 1,
//     Manager = 2,
//     Admin = 3,
// }

// const roleHierarchy = {
//     superAdmin: ['create', 'read', 'update', 'delete'],
// }

import {PermissionManager} from "./permissionsManagement/PermissionManager";
import {PolicyBuilder} from "./policy/policy";
import {RegistrationPolicy} from "./policy/policies/RegistrationPolicy";
import {FreeTrailPolicy} from "./policy/policies/FreeTrailPolicy";

const roleHierarchy = {
    superAdmin: ['admin'],
    admin: ['manager'],
    manager: ['proof_reader', 'editor'],
    proof_reader: ['user'],
    editor: ['user'],
    user: [],
}

// not recommended
const simpleRoleHierarchy = {
    superAdmin: ['admin', 'manager', 'proof_reader', 'editor', 'user'],
    admin: ['manager', 'proof_reader', 'editor', 'user'],
    manager: ['proof_reader', 'editor', 'user'],
    proof_reader: ['user'],
    editor: ['user'],
    user: [],
}

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
}

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
}

const permissions = {
    super_admin: [],
    admin: ['product:delete', 'user:delete'], // [product:create, product:update, product:review, product:read], [user:create, user:update, user:delete, user:delete]
    manager: ['user:create', 'user:update'], // [product:create, product:update, product:review, product:read], [user:create, user:update]
    proof_reader: [], // // [product:create, product:update, product:review, product:read]
    editor: ['product:create', 'product:update'], // [product:create, product:update, product:review, product:read]
    premium_user: ['product:review'], // [product:read, product:review]
    user: ['product:read'],
}

const user = {
    id: '123',
    name: 'John Doe',
    roles: ['super_admin'],
    permissions: ['product:read']
}

const pm = new PermissionManager({
    roles: user.roles,
    permissions: user.permissions
})

// console.log(pm.hasPermission('product:delete')) // false
// console.log(pm.hasPermission('user:delete')) // false
// console.log(pm.hasPermission('product:update')) // false
// console.log(pm.hasPermission('product:create')) // false
// console.log(pm.hasPermission('user:create')) // false


const assessFreeTail = async (
    userId: string,
    email: string,
    password: string
) => {
    const policyGroup = PolicyBuilder.create()
        .addPolicy(new RegistrationPolicy())
        .addPolicy(new FreeTrailPolicy())
        .build();

    const { allowed, reason, name } = await policyGroup.can({
        userId: userId,
        email
    });

    if(!allowed) {
        console.error(`User with email ${email} is not allowed to access the free trail because ${reason}`);
        return;
    }

    // do some operation
    return {
        success: true,
        message: `Trail access granted for user with email ${email}`
    };
}

console.log(assessFreeTail('123', 't2est@test2.com', 'password').then(console.log));
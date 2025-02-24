# Authentication vs Authorization

**Authentication:** Authentication is the process of verifying the identity of a user or entity. It confirms that the
person or system is who they claim to be. Ex. Entering a username and password to log into a website.

**Authorization:** Authorization is the process of determining whether an authenticated user has the right to access
specific resources or perform certain actions. Ex. Once logged in, being able to access specific sections of a website 
based on user roles, like admin or regular user.

* **Authentication - Who is it? - Identity**
* **Authorization - What can you do? - Permissions/Access**

## Key Differences:

| Authentication                               | Authorization                                       |
|----------------------------------------------|-----------------------------------------------------|
| Authentication focuses on verifying identity | Authorization focuses on granting or denying access |
| Authentication occurs at the beginning       | To be authorized users must be authenticated        |
| Authentication is about “who you are”        | Authorization is about “What you can do”            |
| Error Status Code: 401                       | Error Status Code: 403                              |

## Real-World Examples and Analogies

**Hotel Check in:**

* **Authentication:** When you check into a hotel, you present your ID and booking confirmation. The hotel verifies
  your identity and reservation.
* **Authorization:** Once checked in, you receive a room key that grants you access to your specific room, gym, pool, 
  and other amenities based on your booking.

**Concert Tickets:**

* **Authentication:** At the concert entrance, you show your ticket to verify you have the right to enter the event.
* **Authorization:** Your ticket might also specify your seat, access to VIP areas, or backstage passes, determining 
  what parts of the venue you can access.

**Library Membership:**

* **Authentication:** To enter the library, you present your library card, which confirms your membership.
* **Authorization:** With the library card, you can borrow certain types of books, access study rooms, or use special
  collections based on your membership level.

## The Role of Authorization in Modern Applications

Authorization is a **critical component** of modern applications, ensuring that users can only access the data, 
features, or services they are permitted to use. Poor authorization can lead to **security breaches, compliance 
failures, and a degraded user experience.**

> Authorization comes with Authentication but they are not the same thing. There are several services to manage 
> authentication but you have to manage authorization by yourself with the help of Authentication services.

### Security Benefits

* **Prevents Unauthorized Access** – Ensures only permitted users can access sensitive resources.
* **Minimizes Attack Surface** – Restricts permissions, reducing potential exploits.
* **Protects Data Integrity** – Prevents unauthorized modifications to critical data.
* **Mitigates Insider Threats** – Employees have access only to what's necessary (principle of least privilege).

> The "principle of least privilege" (PoLP) is a security concept that states users, applications, or systems should 
> only be granted the minimum level of access necessary to perform their required tasks, minimizing the potential for 
> damage caused by accidental mistakes or malicious actions; essentially, giving users "just enough" access to do their
> job and no more.

### User Experience Benefits

* **Personalized Access** – Users see only relevant features and data.
* **Frictionless Navigation** – No unnecessary access requests or confusion.
* **Seamless Subscription Upgrades** – Automatically unlocks premium features.
* **Reduce Mistakes** - Reduce the chance of mistakes happen by unwilling actions.
* **Partial Rollouts** - Enable new features to the certain group of users

## Common Authorization Failures & Real-World Cases

**Broken Access Control:** Users can perform actions they shouldn't have access to. Example: A guest user in a social
medial app modifies other users posts. GitHub (2012): A broken authorization flaw allowed unauthorized users to modify 
repositories.

**Insecure Direct Object References:** Attackers access unauthorized data by modifying URLs or request parameters. 
Example: A user changes `/user/123/profile` to `/user/124/profile` and sees another user's data. Facebook Bug Bounty
(2019): IDOR in Facebook allowed users to delete anyone's Instagram photo.

**Privilege Escalation:** Users exploit vulnerabilities to gain higher access levels. Example: A customer support agent
gains admin privileges by manipulating API requests. Uber Breach (2022): Hackers gained admin access by compromising a 
contractor's credentials.

## Regulatory & Compliance Considerations: Key Regulations

* **GDPR (EU)** – Protects user data privacy. General Data Protection Regulation: [https://gdpr-info.eu/](https://gdpr-info.eu/)
* **HIPAA (US)** – Ensures healthcare data security: [https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/combined-regulation-text/index.html](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/combined-regulation-text/index.html) Health Insurance Portability and Accountability Act
* **SOC 2** – Enforces strong access control in SaaS. Systems and Organization Controls 2: [https://secureframe.com/hub/soc-2/compliance-documentation](https://secureframe.com/hub/soc-2/compliance-documentation)
* **PCI DSS** – Secures payment processing. Payment Card Industry Data Security Standards: [https://www.pcisecuritystandards.org/standards/](https://www.pcisecuritystandards.org/standards/)

**Examples:**

* A messaging app must ensure that only users can read their own messages. Even employees or admins should not have
  access to private chats. This prevents unauthorized access and protects user privacy. (GDPR)
* In a hospital system, only doctors should access patient records. Receptionists can see appointment details but not 
  medical history or test results. This ensures patient data remains confidential. (HIPAA)
* A sales team using a CRM system should have restricted access to leads. Sales representatives should only see their 
  own clients and not their colleagues’ deals to prevent data leaks. (SOC 2)
* In HR software, only senior HR personnel should be able to see salary details. Regular employees or interns must not 
  have access to prevent privacy violations. (GDPR)
* An online therapy platform must ensure that only assigned therapists can access patient notes. Other employees or
  therapists should not see confidential data. (HIPAA)
* A restaurant's payment system must only show the last four digits of a credit card number. Full card details should 
  never be visible to waiters to prevent fraud. (PCI DSS)
* Software engineers working on a banking app should not have access to customer account balances. They should only work 
  with test data, ensuring security. (SOC 2)
* A healthcare messaging app must ensure that only doctors and patients can see their conversations. Support agents 
  should not have access to medical discussions. (GDPR + HIPAA)

## Detailed Overview of Authorization Techniques

### Role-Based Access Control (RBAC)

RBAC assigns **permissions** based on predefined **roles** (e.g., Admin, Editor, Viewer). Users are **assigned roles**, 
and each role has a specific **set of permissions**. This is the most basic authorization techniques and no dynamic 
permissions.

Example: In an HR system, an **HR Manager** can access all employee records, while a **regular employee** can only view 
their own data.

### Permission-Based Access Control (PBAC)

PBAC assigns **explicit permissions** to users or roles. Permissions are checked **before granting access**.

Examples: A **project management tool** where:

* Admins can **create, edit, and delete** projects.
* Managers can **create and edit** but not delete projects.
* Employees can **only view** projects.

```ts
type Role = "admin" | "manager" | "employee";

const permissions: Record<Role, string[]> = {
  admin: ["create", "edit", "delete"],
  manager: ["create", "edit"],
  employee: ["view"],
};

function canAccess(role: Role, action: string): boolean {
  return permissions[role]?.includes(action) ?? false;
}

// Example usage:
console.log(canAccess("admin", "delete")); // true
console.log(canAccess("manager", "delete")); // false
console.log(canAccess("employee", "edit")); // false
console.log(canAccess("employee", "view")); // true
```

### Attribute-Based Access Control (ABAC)

ABAC defines access rules based on **attributes** (user attributes, resource attributes, and environment conditions). 
Instead of fixed roles, it evaluates conditions dynamically.

Use Cases: Fine-grained access control in SaaS, healthcare, and financial apps.

Example: A **banking app** allows transactions **only if**:

* The user’s **risk score is low**.
* The **device is trusted**.
* The **transaction amount is below $10,000**.

```ts
type User = {
  id: string;
  role: string;
  riskScore: number;
  deviceTrusted: boolean;
};

type Transaction = {
  amount: number;
  location: string;
};

function canPerformTransaction(user: User, transaction: Transaction): boolean {
  if (user.riskScore > 50) return false; // High risk users are blocked
  if (!user.deviceTrusted) return false; // Untrusted device restriction
  if (transaction.amount > 10_000) return false; // Large transactions require extra verification

  return true; // All conditions met, transaction allowed
}

// Example usage:
const user: User = { id: "123", role: "customer", riskScore: 30, deviceTrusted: true };
const transaction: Transaction = { amount: 5000, location: "New York" };

console.log(canPerformTransaction(user, transaction)); // true
```

### Policy-Based Access Control (PBAC)

PBAC extends ABAC by using **policies** to define access rules. Policies are **centralized** and can be updated without
modifying code. Example: A **cloud storage service** allows access **only if**:

* The user’s **role is "employee"**.
* The user’s **IP address is from an approved country**.
* The user is **accessing during business hours (9 AM - 5 PM UTC)**.

```ts
type UserContext = {
  role: string;
  ipAddress: string;
  accessTime: number; // 24-hour format (e.g., 14 for 2 PM)
};

const policies = [
  {
    condition: (user: UserContext) => user.role === "employee",
    message: "Only employees can access this resource.",
  },
  {
    condition: (user: UserContext) => ["192.168.1.1", "203.0.113.5"].includes(user.ipAddress),
    message: "Access allowed only from approved IP addresses.",
  },
  {
    condition: (user: UserContext) => user.accessTime >= 9 && user.accessTime <= 17,
    message: "Access allowed only during business hours.",
  },
];

function isAccessAllowed(user: UserContext): boolean {
  for (const policy of policies) {
    if (!policy.condition(user)) {
      console.log(`Access denied: ${policy.message}`);
      return false;
    }
  }
  return true;
}

// Example usage:
const user1: UserContext = { role: "employee", ipAddress: "192.168.1.1", accessTime: 10 };
console.log(isAccessAllowed(user1)); // true

const user2: UserContext = { role: "employee", ipAddress: "198.51.100.1", accessTime: 14 };
console.log(isAccessAllowed(user2)); // false (IP not approved)
```

## Discretionary Access Control (DAC)

DAC allows the resource owner to decide who can access their resources. It is commonly used in file-sharing and 
collaboration tools. Example: Google Drive / Dropbox style file sharing

* A user (owner) can decide who has access to a document.
* Users can be granted view or edit permissions.
* The owner can revoke access at any time.

```ts
type Permission = "view" | "edit";

class Document {
  private permissions: Map<string, Permission> = new Map(); // User ID -> Permission

  constructor(public owner: string, public name: string) {}

  grantAccess(userId: string, permission: Permission) {
    this.permissions.set(userId, permission);
  }

  revokeAccess(userId: string) {
    this.permissions.delete(userId);
  }

  canAccess(userId: string, requiredPermission: Permission): boolean {
    const userPermission = this.permissions.get(userId);

    if (!userPermission) {
      return false; // User has no permission at all
    }

    if (requiredPermission === "view") {
      return true; // Any permission grants view access
    }

    return userPermission === "edit"; // Only edit grants edit access
  }
}

// Example Usage
const doc = new Document("user1", "Project Plan");

doc.grantAccess("user2", "view");
doc.grantAccess("user3", "edit");

console.log(doc.canAccess("user2", "view")); // true
console.log(doc.canAccess("user2", "edit")); // false

console.log(doc.canAccess("user3", "edit")); // true

doc.revokeAccess("user2");
console.log(doc.canAccess("user2", "view")); // false
```


## Mandatory Access Control (MAC)

MAC is strict and non-discretionary. It enforces predefined security policies where users cannot modify access controls.
Typically used in government and military systems.

Use Cases: Military, classified data protection, financial institutions.

Example: A defense system ensures that only personnel with ‘Top Secret’ clearance can access classified reports.


## Just-In-Time (JIT) Access Control

JIT access grants temporary permissions only when needed and revokes them after use.

Use Case: DevOps, cloud infrastructure, high-security environments.

Example: A developer requests admin access to a production server for debugging. After 30 minutes, access is 
automatically revoked.


## Feature-Based Access Control (FBAC)

FBAC restricts access based on feature flags instead of user roles.

Use Case: SaaS applications, subscription-based models.

Example: A free-tier user can access basic features, while a premium user unlocks advanced analytics.

```ts
// Define available features
type FeatureFlags = {
  advancedAnalytics: boolean;
  darkMode: boolean;
  prioritySupport: boolean;
};

// User Subscription Plans
enum SubscriptionPlan {
  FREE = "free",
  PREMIUM = "premium",
}

// Feature Configuration for Different Plans
const featureConfig: Record<SubscriptionPlan, FeatureFlags> = {
  free: {
    advancedAnalytics: false,
    darkMode: false,
    prioritySupport: false,
  },
  premium: {
    advancedAnalytics: true,
    darkMode: true,
    prioritySupport: true,
  },
};

// User Class
class User {
  constructor(public id: string, public name: string, public plan: SubscriptionPlan) {}

  // Check if the user has access to a feature
  hasFeature(feature: keyof FeatureFlags): boolean {
    return featureConfig[this.plan][feature];
  }
}
```

## Hierarchical Access Control

Hierarchical systems allow inheritance of permissions across different levels.

Use Case: Multi-tiered organizations, government agencies.

Example: A CEO can access all company documents, while managers can only see reports relevant to their department.

```ts
// Define User Roles
enum Role {
  CEO = "CEO",
  Manager = "Manager",
  Employee = "Employee",
}

// Define Permissions
type Permission = "viewReports" | "editReports" | "viewAllDocuments";

// Permissions mapping for roles
const rolePermissions: Record<Role, Permission[]> = {
  [Role.CEO]: ["viewReports", "editReports", "viewAllDocuments"],
  [Role.Manager]: ["viewReports"],
  [Role.Employee]: [],
};

// User Class
class User {
  constructor(public name: string, public role: Role) {}

  // Check if the user has permission
  hasPermission(permission: Permission): boolean {
    return rolePermissions[this.role].includes(permission);
  }
}
```

## Understand Role Hierarchy & Its Importance

In complex applications like SaaS, implementing a role hierarchy is crucial for managing access control efficiently. 
Role hierarchy allows organizations to structure roles in a way that reflects their operational needs, enabling
fine-grained access control.

### Role Hierarchy

Role hierarchy organizes roles in a parent-child relationship, where higher-level roles inherit permissions from 
lower-level roles. This structure simplifies permission management and ensures that users at different levels have 
appropriate access.

**Key Concepts:**

* **Parent Roles:** Higher-level roles that grant broader permissions.
* **Child Roles:** Lower-level roles that inherit permissions from parent roles but can also have additional 
  restrictions.
* **Inheritance:** Lower-level roles automatically gain permissions from their parent roles, reducing redundancy in 
  permission assignments.

**Example of Role Hierarchy:**

* **CEO:** Has access to all company documents and settings.
* **Manager:** Inherits access to view reports but can also manage team-specific documents.
* **Employee:** Can view specific documents relevant to their tasks.

**Corporate Structure:**

* **Administrator:** Full access to all features and settings.
* **HR Manager:** Can manage employee records and reports.
* **HR Employee:** Can view and update employee information.

**Educational Institution:**

* **Principal:** Access to all school data and reports.
* **Teacher:** Can access class schedules and student records.
* **Student:** Can view personal grades and assignments.

**E-commerce Platform:**

* **Owner:** Full control over the platform and product management.
* **Admin:** Manages inventory and orders.
* **Staff:** Can assist with customer inquiries and order processing.

```ts
// Define Permissions
type Permission = "viewReports" | "editReports" | "manageUsers" | "viewSensitiveData";

// Define User Roles
enum Role {
  Admin = "Admin",
  HRManager = "HR Manager",
  HRStaff = "HR Staff",
  Employee = "Employee",
}

// Role Permissions Mapping
const rolePermissions: Record<Role, Permission[]> = {
  [Role.Admin]: [
    // "viewReports", => Inherited from HRStaff
    // "editReports", => Inherited from HRManager
    // "manageUsers", => Inherited from HRManager 
    "viewSensitiveData",
  ],
  [Role.HRManager]: [
    // "viewReports", => Inherited from HRStaff
    "editReports",
    "manageUsers",
  ],
  [Role.HRStaff]: [
    "viewReports",
  ],
  [Role.Employee]: [],
};
```
### Benefits of Role Hierarchy

* **Simplified Management:** Reduces complexity by allowing permissions to be set at higher levels, automatically 
  applying them to all child roles.
* **Scalability:** Easily accommodates changes in the organization structure by adding or modifying roles without 
  disrupting existing permissions.
* **Consistency:** Ensures that users with similar responsibilities have consistent access, reducing the likelihood of
  misconfigurations.
* **Fine-Grained Control:** Allows organizations to define specific permissions for different levels, ensuring that 
  sensitive data is accessible only to those who need it.

### Challenges of Role Hierarchy

* **Risk of Over-Permissioning:** If not carefully managed, users at lower levels may inherit more permissions than
  intended, leading to security risks.
* **Complexity in Maintenance:** As the organization grows, maintaining and updating the role hierarchy can become 
  complex and time-consuming.
* **Conflict Resolution:** Conflicts may arise when different roles have overlapping permissions, necessitating clear 
  policies to manage these situations.
* **Potential for Confusion:** Users may be unclear about their actual permissions, especially if the hierarchy is deep
  or poorly documented.

## Managing Subscriptions using Roles and Permissions

In many SaaS applications, managing user subscriptions through roles is a common and effective approach. Each
subscription level can be associated with specific roles that determine what features or data the user can access.

### Defining Roles for Different Subscription Levels

For instance, in a SaaS application with multiple subscription tiers, you might define roles like:

* **Free Tier:** Basic access to limited features.
* **Pro Tier:** Access to advanced features and additional data.
* **Enterprise Tier:** Full access to all features, plus premium support.

### Strategies for Managing and Updating Roles Dynamically

To manage roles effectively, you can implement the following strategies:

* **Role Assignment on Subscription Purchase:** When a user subscribes to a particular tier, automatically assign the 
  corresponding role.
* **Role Upgrades:** If a user upgrades their subscription, dynamically change their role to reflect the new tier.
* **Expiration Handling:** If a subscription expires, revoke the role or downgrade to a lower tier automatically.

```ts
// Define Roles
enum Role {
  FreeUser = "Free User",
  ProUser = "Pro User",
  EnterpriseUser = "Enterprise User",
}

// Role Permissions Mapping
const rolePermissions: Record<Role, string[]> = {
  [Role.FreeUser]: ["viewBasicFeatures"],
  [Role.ProUser]: ["viewBasicFeatures", "viewProFeatures", "accessProSupport"],
  [Role.EnterpriseUser]: ["viewBasicFeatures", "viewProFeatures", "accessProSupport", "accessEnterpriseSupport"],
}; 
```

## Resources
* [Authorization Master Class - Roles, Permissions & Multi Tier Subscriptions](https://www.stacklearner.com/my/workshops/authorization-master-class-roles-permissions-and-multi-tier-subscriptions)

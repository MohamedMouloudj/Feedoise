import { OrganizationRole, ProjectRole } from "./generated/prisma/enums";

/**
 * Organization permissions matrix:
 * 
 * | Category                        | Permission              | Owner | Admin | Member | Project Maintainer | Project Contributor |
 * | ------------------------------- | ----------------------- | :---: | :---: | :----: | :----------------: | :-----------------: |
 * | **Organization**                | Update org settings     |   ✅   |   ✅   |    ❌   |          ❌         |          ❌          |
 * |                                 | Invite org members      |   ✅   |   ✅   |    ❌   |          ❌         |          ❌          |
 * |                                 | Remove org members      |   ✅   |   ✅   |    ❌   |          ❌         |          ❌          |
 * | **Projects**                    | View all org projects   |   ✅   |   ✅   |    ✅   |         ✅*         |          ✅*         |
 * |                                 | Create projects         |   ✅   |   ✅   |    ❌   |          ❌         |          ❌          |
 * |                                 | Update project settings |   ✅   |   ✅   |    ❌   |         ✅**        |          ❌          |
 * |                                 | Delete projects         |   ✅   |   ✅   |    ❌   |          ❌         |          ❌          |
 * |                                 | Add project members     |   ✅   |   ✅   |    ❌   |         ✅**        |          ❌          |
 * | **Threads**                     | View threads            |   ✅   |   ✅   |    ✅   |          ✅         |          ✅          |
 * |                                 | Create threads          |   ✅   |   ✅   |    ✅   |          ✅         |          ✅          |
 * |                                 | Change status           |   ✅   |   ✅   |    ❌   |          ✅         |          ❌          |
 * |                                 | Assign threads          |   ✅   |   ✅   |    ❌   |          ✅         |          ❌          |
 * |                                 | Set priority            |   ✅   |   ✅   |    ❌   |          ✅         |          ❌          |
 * |                                 | Create / edit labels    |   ✅   |   ✅   |    ❌   |          ✅         |          ❌          |
 * |                                 | Delete any thread       |   ✅   |   ✅   |    ❌   |          ✅         |          ❌          |
 * |                                 | Delete own thread       |   ✅   |   ✅   |    ✅   |          ✅         |          ✅          |
 * | **Comments**                    | Add comments            |   ✅   |   ✅   |    ✅   |          ✅         |          ✅          |
 * |                                 | Delete any comment      |   ✅   |   ✅   |    ❌   |          ✅         |          ❌          |
 * |                                 | Delete own comment      |   ✅   |   ✅   |    ✅   |          ✅         |          ✅          |
 * | **Billing & Subscription**      | View billing status     |   ✅   |   ✅   |    ❌   |          ❌         |          ❌          |
 * |                                 | Update payment method   |   ✅   |   ❌   |    ❌   |          ❌         |          ❌          |
 * |                                 | Change subscription     |   ✅   |   ❌   |    ❌   |          ❌         |          ❌          |
 * |                                 | Cancel subscription     |   ✅   |   ❌   |    ❌   |          ❌         |          ❌          |
 * |                                 | View invoice history    |   ✅   |   ✅   |    ❌   |          ❌         |          ❌          |
 *
 * **Notes:**
 * - \* assigned only
 * - \** own project
 */

export const PERMISSIONS = {
  // Organization-level roles
  OWNER: [
    // Organization management
    "org:view",
    "org:update",
    "org:delete",
    "org:invite:generate", // Generate invite codes
    "org:member:view",
    "org:member:add",
    "org:member:remove",
    "org:member:role:update",
    "org:ownership:transfer",

    // Project management
    "project:view:all",
    "project:create",
    "project:update",
    "project:delete",
    "project:visibility:update",
    "project:member:add",
    "project:member:remove",

    // Thread/feedback management
    "thread:view",
    "thread:create",
    "thread:update:any",
    "thread:status:update",
    "thread:assign",
    "thread:priority:update",
    "thread:delete:any",

    // Labels
    "label:create",
    "label:update",
    "label:delete",

    // Comments
    "comment:create",
    "comment:update:any",
    "comment:delete:any",

    // Billing (future)
    "billing:view",
    "billing:update",
    "billing:cancel",
  ],

  ADMIN: [
    // Organization management
    "org:view",
    "org:update",
    "org:invite:generate",
    "org:member:view",
    "org:member:add",
    "org:member:remove",
    "org:member:role:update", // change member ↔ admin

    // Project management
    "project:view:all",
    "project:create",
    "project:update",
    "project:delete",
    "project:visibility:update",
    "project:member:add",
    "project:member:remove",

    // Thread/feedback management
    "thread:view",
    "thread:create",
    "thread:update:any",
    "thread:status:update",
    "thread:assign",
    "thread:priority:update",
    "thread:delete:any",

    // Labels
    "label:create",
    "label:update",
    "label:delete",

    // Comments
    "comment:create",
    "comment:update:any",
    "comment:delete:any",

    // Billing
    "billing:view",
  ],

  MEMBER: [
    // Organization
    "org:view",
    "org:member:view",

    // Projects (only assigned projects)
    "project:view:assigned", // Can only view projects they're added to

    // Threads/feedback
    "thread:view",
    "thread:create",
    "thread:update:own",
    "thread:delete:own",

    // Comments
    "comment:create",
    "comment:update:own",
    "comment:delete:own",
  ],

  // Project-level roles
  PROJECT_MAINTAINER: [
    // Project management (for ASSIGNED project only)
    "project:update", // Can update project settings
    "project:member:add", // Can add contributors
    "project:member:remove",

    // Thread/feedback management (for ASSIGNED project only)
    "thread:view",
    "thread:create",
    "thread:update:any",
    "thread:status:update",
    "thread:assign",
    "thread:priority:update",
    "thread:delete:any",

    // Labels (for ASSIGNED project only)
    "label:create",
    "label:update",
    "label:delete",

    // Comments (for ASSIGNED project only)
    "comment:create",
    "comment:update:any",
    "comment:delete:any",
  ],

  PROJECT_CONTRIBUTOR: [
    // Threads/feedback
    "thread:view",
    "thread:create",
    "thread:update:own",
    "thread:delete:own",

    // Comments
    "comment:create",
    "comment:update:own",
    "comment:delete:own",
  ],
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS][number];

/**
 * Check if a user has a specific permission
 * @param userPermissions - Array of permissions the user has
 * @param requiredPermission - The permission to check for
 * @returns True if the user has the required permission, otherwise false
 */
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission,
): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Get permissions for an organization role
 * @param role Organization role ("owner", "admin", or "member")
 * @returns Array of permissions associated with the role
 */
export function getOrgPermissions(role: OrganizationRole): Permission[] {
  const roleMap = {
    owner: PERMISSIONS.OWNER,
    admin: PERMISSIONS.ADMIN,
    member: PERMISSIONS.MEMBER,
  };

  return [...roleMap[role]];
}

/**
 * Get permissions for a project role
 * @param role Project role ("maintainer" or "contributor")
 * @returns Array of permissions associated with the role
 */
export function getProjectPermissions(role: ProjectRole): Permission[] {
  const roleMap = {
    maintainer: PERMISSIONS.PROJECT_MAINTAINER,
    contributor: PERMISSIONS.PROJECT_CONTRIBUTOR,
  };

  return [...roleMap[role]];
}

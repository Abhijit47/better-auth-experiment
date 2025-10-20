import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
  user: [...defaultStatements.user, 'impersonate'],
} as const;

export const ac = createAccessControl(statement);

export const userPermission = ac.newRole({
  project: ['create'],
});

export const adminPermission = ac.newRole({
  project: ['create', 'update'],
  ...adminAc.statements,
});

export const myCustomRolePermission = ac.newRole({
  project: ['create', 'update', 'delete'],
  // user: ['ban'],
  user: [...adminAc.statements.user, 'impersonate'],
});

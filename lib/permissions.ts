import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc, userAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

// Full admin power
export const admin = ac.newRole({
  ...adminAc.statements,
});

// Dev: can see everything (list/get users, sessions) but can't ban,
// impersonate, delete, or change roles
export const dev = ac.newRole({
  user: ["list", "get"],
  session: ["list"],
});

// Regular customer: no admin-plugin permissions
export const consumer = ac.newRole({
  ...userAc.statements,
});
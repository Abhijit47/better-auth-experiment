import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// --- ENUMS
export const UserRole = pgEnum('role', ['USER', 'ADMIN', 'MODERATOR']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: UserRole('role').default('USER').notNull(),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  username: text('username').unique(),
  displayUsername: text('display_username'),
  favoriteNumber: integer('favorite_number').default(0).notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const two_factors = pgTable('two_factors', {
  id: text('id').primaryKey(),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const passkeys = pgTable('passkeys', {
  id: text('id').primaryKey(),
  name: text('name'),
  publicKey: text('public_key').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  credentialID: text('credential_id').notNull(),
  counter: integer('counter').notNull(),
  deviceType: text('device_type').notNull(),
  backedUp: boolean('backed_up').notNull(),
  transports: text('transports'),
  createdAt: timestamp('created_at'),
  aaguid: text('aaguid'),
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts, { relationName: 'UserToAccount' }),
  sessions: many(sessions, { relationName: 'UserToSession' }),
  verifications: many(verifications, { relationName: 'UserToVerification' }),
  twoFactors: many(two_factors, { relationName: 'UserToTwoFactor' }),
  passkeys: many(passkeys, { relationName: 'UserToPasskey' }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    relationName: 'UserToAccount',
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    relationName: 'UserToSession',
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationRelations = relations(verifications, ({ one }) => ({
  user: one(users, {
    relationName: 'UserToVerification',
    fields: [verifications.id],
    references: [users.id],
  }),
}));

export const twoFactorRelations = relations(two_factors, ({ one }) => ({
  user: one(users, {
    relationName: 'UserToTwoFactor',
    fields: [two_factors.userId],
    references: [users.id],
  }),
}));

export const passkeyRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    relationName: 'UserToPasskey',
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));

// --- TYPES
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectSession = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

export type SelectAccount = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

export type SelectVerification = typeof verifications.$inferSelect;
export type InsertVerification = typeof verifications.$inferInsert;

export type SelectTwoFactor = typeof two_factors.$inferSelect;
export type InsertTwoFactor = typeof two_factors.$inferInsert;

export type SelectPasskey = typeof passkeys.$inferSelect;
export type InsertPasskey = typeof passkeys.$inferInsert;

// --- Union Types
export const userRole = UserRole.enumValues;
export type UserRolesUnion = (typeof UserRole)['enumValues'][number];

import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';



// Auth tables for better-auth
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Portfolio tables
export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  field: text('field').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  description: text('description'),
  location: text('location').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  proficiency: integer('proficiency'),
  iconUrl: text('icon_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  company: text('company').notNull(),
  position: text('position').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  description: text('description'),
  location: text('location').notNull(),
  current: boolean('current').default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  technologies: text('technologies').notNull(),
  imageUrl: text('image_url'),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  featured: boolean('featured').default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  issueDate: text('issue_date').notNull(),
  credentialUrl: text('credential_url'),
  description: text('description'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const contact = pgTable('contact', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  location: text('location'),
  github: text('github'),
  linkedin: text('linkedin'),
  twitter: text('twitter'),
  facebook: text('facebook'),
  instagram: text('instagram'),
  youtube: text('youtube'),
  discord: text('discord'),
  website: text('website'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const hero = pgTable('hero', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  cvUrl: text('cv_url'),
  availableForWork: boolean('available_for_work').default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
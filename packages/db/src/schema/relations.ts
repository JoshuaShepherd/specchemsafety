// Safety Training Schema Relations
// This file defines all the relationships between tables for type-safe joins

import { relations } from "drizzle-orm";
import { profiles } from "./profiles";
import { plants } from "./plants";
import { courses } from "./courses";
import { enrollments } from "./enrollments";
import { progress } from "./progress";
import { activityEvents } from "./activity-events";
import { questionEvents } from "./question-events";
import { adminRoles } from "./admin-roles";
import { auditLog } from "./audit-log";

// New Safety Business Tables
import { territories } from "./territories";
import { userProfiles } from "./user-profiles";
import { accounts } from "./accounts";
import { branches } from "./branches";
import { contacts } from "./contacts";
import { activityLogs } from "./activity-logs";
import { opportunities } from "./opportunities";
import { salesFacts } from "./sales-facts";
import { products } from "./products";
import { projects } from "./projects";

// Profiles relations
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  plant: one(plants, {
    fields: [profiles.plantId],
    references: [plants.id],
  }),
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
  adminRoles: many(adminRoles),
  auditLogs: many(auditLog),
}));

// Plants relations
export const plantsRelations = relations(plants, ({ many }) => ({
  profiles: many(profiles),
  courses: many(courses),
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
  adminRoles: many(adminRoles),
}));

// Courses relations
export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
}));

// Enrollments relations
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(profiles, {
    fields: [enrollments.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [enrollments.plantId],
    references: [plants.id],
  }),
}));

// Progress relations
export const progressRelations = relations(progress, ({ one }) => ({
  user: one(profiles, {
    fields: [progress.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [progress.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [progress.plantId],
    references: [plants.id],
  }),
}));

// Activity Events relations
export const activityEventsRelations = relations(activityEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [activityEvents.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [activityEvents.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [activityEvents.plantId],
    references: [plants.id],
  }),
}));

// Question Events relations
export const questionEventsRelations = relations(questionEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [questionEvents.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [questionEvents.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [questionEvents.plantId],
    references: [plants.id],
  }),
}));

// Admin Roles relations
export const adminRolesRelations = relations(adminRoles, ({ one }) => ({
  user: one(profiles, {
    fields: [adminRoles.userId],
    references: [profiles.id],
  }),
  plant: one(plants, {
    fields: [adminRoles.plantId],
    references: [plants.id],
  }),
}));

// Audit Log relations
export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(profiles, {
    fields: [auditLog.userId],
    references: [profiles.id],
  }),
}));

// ===== NEW SAFETY BUSINESS TABLE RELATIONS =====

// Territories relations
export const territoriesRelations = relations(territories, ({ many }) => ({
  userProfiles: many(userProfiles),
  accounts: many(accounts),
  products: many(products),
}));

// User Profiles relations
export const userProfilesRelations = relations(
  userProfiles,
  ({ one, many }) => ({
    territory: one(territories, {
      fields: [userProfiles.territoryId],
      references: [territories.id],
    }),
    accounts: many(accounts),
    contacts: many(contacts),
    activityLogs: many(activityLogs),
    opportunities: many(opportunities),
    salesFacts: many(salesFacts),
    projects: many(projects),
  })
);

// Accounts relations
export const accountsRelations = relations(accounts, ({ one, many }) => ({
  territory: one(territories, {
    fields: [accounts.territoryId],
    references: [territories.id],
  }),
  owner: one(userProfiles, {
    fields: [accounts.ownerId],
    references: [userProfiles.id],
  }),
  branches: many(branches),
  contacts: many(contacts),
  activityLogs: many(activityLogs),
  opportunities: many(opportunities),
  salesFacts: many(salesFacts),
  projects: many(projects),
}));

// Branches relations
export const branchesRelations = relations(branches, ({ one, many }) => ({
  account: one(accounts, {
    fields: [branches.accountId],
    references: [accounts.id],
  }),
  contacts: many(contacts),
}));

// Contacts relations
export const contactsRelations = relations(contacts, ({ one, many }) => ({
  account: one(accounts, {
    fields: [contacts.accountId],
    references: [accounts.id],
  }),
  branch: one(branches, {
    fields: [contacts.branchId],
    references: [branches.id],
  }),
  owner: one(userProfiles, {
    fields: [contacts.ownerId],
    references: [userProfiles.id],
  }),
  activityLogs: many(activityLogs),
  opportunities: many(opportunities),
}));

// Activity Logs relations
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  account: one(accounts, {
    fields: [activityLogs.accountId],
    references: [accounts.id],
  }),
  contact: one(contacts, {
    fields: [activityLogs.contactId],
    references: [contacts.id],
  }),
  user: one(userProfiles, {
    fields: [activityLogs.userId],
    references: [userProfiles.id],
  }),
}));

// Opportunities relations
export const opportunitiesRelations = relations(
  opportunities,
  ({ one, many }) => ({
    account: one(accounts, {
      fields: [opportunities.accountId],
      references: [accounts.id],
    }),
    contact: one(contacts, {
      fields: [opportunities.contactId],
      references: [contacts.id],
    }),
    owner: one(userProfiles, {
      fields: [opportunities.ownerId],
      references: [userProfiles.id],
    }),
    salesFacts: many(salesFacts),
  })
);

// Sales Facts relations
export const salesFactsRelations = relations(salesFacts, ({ one }) => ({
  account: one(accounts, {
    fields: [salesFacts.accountId],
    references: [accounts.id],
  }),
  opportunity: one(opportunities, {
    fields: [salesFacts.opportunityId],
    references: [opportunities.id],
  }),
  user: one(userProfiles, {
    fields: [salesFacts.userId],
    references: [userProfiles.id],
  }),
}));

// Products relations
export const productsRelations = relations(products, ({ one }) => ({
  territory: one(territories, {
    fields: [products.territoryId],
    references: [territories.id],
  }),
}));

// Projects relations
export const projectsRelations = relations(projects, ({ one }) => ({
  account: one(accounts, {
    fields: [projects.accountId],
    references: [accounts.id],
  }),
  owner: one(userProfiles, {
    fields: [projects.ownerId],
    references: [userProfiles.id],
  }),
}));

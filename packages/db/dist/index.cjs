"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  PACKAGE_DESCRIPTION: () => PACKAGE_DESCRIPTION,
  PACKAGE_METADATA: () => PACKAGE_METADATA,
  PACKAGE_NAME: () => PACKAGE_NAME,
  PACKAGE_VERSION: () => PACKAGE_VERSION,
  accountStatusEnum: () => accountStatusEnum,
  accountTypeEnum: () => accountTypeEnum,
  accounts: () => accounts,
  activityEvents: () => activityEvents,
  activityEventsRelations: () => activityEventsRelations,
  activityLogs: () => activityLogs,
  activityPriorityEnum: () => activityPriorityEnum,
  activityStatusEnum: () => activityStatusEnum,
  activityTypeEnum: () => activityTypeEnum,
  adminRoleEnum: () => adminRoleEnum,
  adminRoles: () => adminRoles,
  adminRolesRelations: () => adminRolesRelations,
  auditLog: () => auditLog,
  auditLogRelations: () => auditLogRelations,
  branches: () => branches,
  complianceStandardEnum: () => complianceStandardEnum,
  contactRoleEnum: () => contactRoleEnum,
  contactStatusEnum: () => contactStatusEnum,
  contacts: () => contacts,
  courses: () => courses,
  coursesRelations: () => coursesRelations,
  enrollmentStatusEnum: () => enrollmentStatusEnum,
  enrollments: () => enrollments,
  enrollmentsRelations: () => enrollmentsRelations,
  eventTypeEnum: () => eventTypeEnum,
  industryEnum: () => industryEnum,
  opportunities: () => opportunities,
  opportunitySourceEnum: () => opportunitySourceEnum,
  opportunityStageEnum: () => opportunityStageEnum,
  opportunityStatusEnum: () => opportunityStatusEnum,
  opportunityTypeEnum: () => opportunityTypeEnum,
  periodTypeEnum: () => periodTypeEnum,
  plants: () => plants,
  plantsRelations: () => plantsRelations,
  probabilityEnum: () => probabilityEnum,
  productStatusEnum: () => productStatusEnum,
  productTypeEnum: () => productTypeEnum,
  products: () => products,
  profiles: () => profiles,
  profilesRelations: () => profilesRelations,
  progress: () => progress,
  progressRelations: () => progressRelations,
  projectPriorityEnum: () => projectPriorityEnum,
  projectStatusEnum: () => projectStatusEnum,
  projectTypeEnum: () => projectTypeEnum,
  projects: () => projects,
  questionEvents: () => questionEvents,
  questionEventsRelations: () => questionEventsRelations,
  salesFactTypeEnum: () => salesFactTypeEnum,
  salesFacts: () => salesFacts,
  territories: () => territories,
  userProfiles: () => userProfiles,
  userRoleEnum: () => userRoleEnum,
  userStatusEnum: () => userStatusEnum
});
module.exports = __toCommonJS(index_exports);

// src/schema/profiles.ts
var import_pg_core18 = require("drizzle-orm/pg-core");
var import_drizzle_orm18 = require("drizzle-orm");

// src/schema/plants.ts
var import_pg_core17 = require("drizzle-orm/pg-core");
var import_drizzle_orm17 = require("drizzle-orm");

// src/schema/courses.ts
var import_pg_core15 = require("drizzle-orm/pg-core");
var import_drizzle_orm15 = require("drizzle-orm");

// src/schema/enrollments.ts
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_orm = require("drizzle-orm");
var enrollmentStatusEnum = (0, import_pg_core.pgEnum)("enrollment_status", [
  "enrolled",
  "in_progress",
  "completed"
]);
var enrollments = (0, import_pg_core.pgTable)("enrollments", {
  id: (0, import_pg_core.uuid)("id").primaryKey().defaultRandom(),
  userId: (0, import_pg_core.uuid)("user_id").notNull().references(() => profiles.id),
  courseId: (0, import_pg_core.uuid)("course_id").notNull().references(() => courses.id),
  plantId: (0, import_pg_core.uuid)("plant_id").notNull().references(() => plants.id),
  status: enrollmentStatusEnum("status").default("enrolled").notNull(),
  enrolledAt: (0, import_pg_core.timestamp)("enrolled_at").defaultNow().notNull(),
  completedAt: (0, import_pg_core.timestamp)("completed_at"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var enrollmentsRelations = (0, import_drizzle_orm.relations)(enrollments, ({ one }) => ({
  user: one(profiles, {
    fields: [enrollments.userId],
    references: [profiles.id]
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id]
  }),
  plant: one(plants, {
    fields: [enrollments.plantId],
    references: [plants.id]
  })
}));

// src/schema/progress.ts
var import_pg_core2 = require("drizzle-orm/pg-core");
var import_drizzle_orm2 = require("drizzle-orm");
var progress = (0, import_pg_core2.pgTable)("progress", {
  id: (0, import_pg_core2.uuid)("id").primaryKey().defaultRandom(),
  userId: (0, import_pg_core2.uuid)("user_id").notNull().references(() => profiles.id),
  courseId: (0, import_pg_core2.uuid)("course_id").notNull().references(() => courses.id),
  plantId: (0, import_pg_core2.uuid)("plant_id").notNull().references(() => plants.id),
  progressPercent: (0, import_pg_core2.integer)("progress_percent").default(0).notNull(),
  currentSection: (0, import_pg_core2.text)("current_section"),
  lastActiveAt: (0, import_pg_core2.timestamp)("last_active_at").defaultNow().notNull(),
  createdAt: (0, import_pg_core2.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core2.timestamp)("updated_at").defaultNow().notNull()
});
var progressRelations = (0, import_drizzle_orm2.relations)(progress, ({ one }) => ({
  user: one(profiles, {
    fields: [progress.userId],
    references: [profiles.id]
  }),
  course: one(courses, {
    fields: [progress.courseId],
    references: [courses.id]
  }),
  plant: one(plants, {
    fields: [progress.plantId],
    references: [plants.id]
  })
}));

// src/schema/activity-events.ts
var import_pg_core3 = require("drizzle-orm/pg-core");
var import_drizzle_orm3 = require("drizzle-orm");
var eventTypeEnum = (0, import_pg_core3.pgEnum)("event_type", [
  "view_section",
  "start_course",
  "complete_course"
]);
var activityEvents = (0, import_pg_core3.pgTable)("activity_events", {
  id: (0, import_pg_core3.uuid)("id").primaryKey().defaultRandom(),
  userId: (0, import_pg_core3.uuid)("user_id").notNull().references(() => profiles.id),
  courseId: (0, import_pg_core3.uuid)("course_id").notNull().references(() => courses.id),
  plantId: (0, import_pg_core3.uuid)("plant_id").notNull().references(() => plants.id),
  eventType: eventTypeEnum("event_type").notNull(),
  meta: (0, import_pg_core3.jsonb)("meta"),
  occurredAt: (0, import_pg_core3.timestamp)("occurred_at").defaultNow().notNull(),
  createdAt: (0, import_pg_core3.timestamp)("created_at").defaultNow().notNull()
});
var activityEventsRelations = (0, import_drizzle_orm3.relations)(activityEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [activityEvents.userId],
    references: [profiles.id]
  }),
  course: one(courses, {
    fields: [activityEvents.courseId],
    references: [courses.id]
  }),
  plant: one(plants, {
    fields: [activityEvents.plantId],
    references: [plants.id]
  })
}));

// src/schema/question-events.ts
var import_pg_core4 = require("drizzle-orm/pg-core");
var import_drizzle_orm4 = require("drizzle-orm");
var questionEvents = (0, import_pg_core4.pgTable)("question_events", {
  id: (0, import_pg_core4.uuid)("id").primaryKey().defaultRandom(),
  userId: (0, import_pg_core4.uuid)("user_id").notNull().references(() => profiles.id),
  courseId: (0, import_pg_core4.uuid)("course_id").notNull().references(() => courses.id),
  plantId: (0, import_pg_core4.uuid)("plant_id").notNull().references(() => plants.id),
  sectionKey: (0, import_pg_core4.text)("section_key").notNull(),
  questionKey: (0, import_pg_core4.text)("question_key").notNull(),
  isCorrect: (0, import_pg_core4.boolean)("is_correct").notNull(),
  attemptIndex: (0, import_pg_core4.integer)("attempt_index").default(1).notNull(),
  responseMeta: (0, import_pg_core4.jsonb)("response_meta"),
  answeredAt: (0, import_pg_core4.timestamp)("answered_at").defaultNow().notNull(),
  createdAt: (0, import_pg_core4.timestamp)("created_at").defaultNow().notNull()
});
var questionEventsRelations = (0, import_drizzle_orm4.relations)(questionEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [questionEvents.userId],
    references: [profiles.id]
  }),
  course: one(courses, {
    fields: [questionEvents.courseId],
    references: [courses.id]
  }),
  plant: one(plants, {
    fields: [questionEvents.plantId],
    references: [plants.id]
  })
}));

// src/schema/course-sections.ts
var import_pg_core14 = require("drizzle-orm/pg-core");
var import_drizzle_orm14 = require("drizzle-orm");

// src/schema/content-blocks.ts
var import_pg_core8 = require("drizzle-orm/pg-core");
var import_drizzle_orm8 = require("drizzle-orm");

// src/schema/content-interactions.ts
var import_pg_core5 = require("drizzle-orm/pg-core");
var import_drizzle_orm5 = require("drizzle-orm");
var interactionTypeEnum = (0, import_pg_core5.pgEnum)("interaction_type", [
  "view",
  "click",
  "expand",
  "collapse",
  "download",
  "share"
]);
var contentInteractions = (0, import_pg_core5.pgTable)("content_interactions", {
  id: (0, import_pg_core5.uuid)("id").primaryKey().defaultRandom(),
  userId: (0, import_pg_core5.text)("user_id").notNull(),
  contentBlockId: (0, import_pg_core5.uuid)("content_block_id").notNull().references(() => contentBlocks.id, { onDelete: "cascade" }),
  interactionType: interactionTypeEnum("interaction_type").notNull(),
  metadata: (0, import_pg_core5.jsonb)("metadata"),
  interactedAt: (0, import_pg_core5.timestamp)("interacted_at").defaultNow().notNull()
});
var contentInteractionsRelations = (0, import_drizzle_orm5.relations)(
  contentInteractions,
  ({ one }) => ({
    contentBlock: one(contentBlocks, {
      fields: [contentInteractions.contentBlockId],
      references: [contentBlocks.id]
    })
  })
);

// src/schema/content-block-translations.ts
var import_pg_core7 = require("drizzle-orm/pg-core");
var import_drizzle_orm7 = require("drizzle-orm");

// src/schema/course-translations.ts
var import_pg_core6 = require("drizzle-orm/pg-core");
var import_drizzle_orm6 = require("drizzle-orm");
var languageCodeEnum = (0, import_pg_core6.pgEnum)("language_code", [
  "en",
  "es",
  "fr",
  "de"
]);
var courseTranslations = (0, import_pg_core6.pgTable)(
  "course_translations",
  {
    id: (0, import_pg_core6.uuid)("id").primaryKey().defaultRandom(),
    courseId: (0, import_pg_core6.uuid)("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    title: (0, import_pg_core6.text)("title").notNull(),
    description: (0, import_pg_core6.text)("description"),
    createdAt: (0, import_pg_core6.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core6.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    courseLanguageUnique: unique(
      "course_translations_course_language_unique"
    ).on(table.courseId, table.languageCode)
  })
);
var courseTranslationsRelations = (0, import_drizzle_orm6.relations)(
  courseTranslations,
  ({ one }) => ({
    course: one(courses, {
      fields: [courseTranslations.courseId],
      references: [courses.id]
    })
  })
);

// src/schema/content-block-translations.ts
var contentBlockTranslations = (0, import_pg_core7.pgTable)(
  "content_block_translations",
  {
    id: (0, import_pg_core7.uuid)("id").primaryKey().defaultRandom(),
    contentBlockId: (0, import_pg_core7.uuid)("content_block_id").notNull().references(() => contentBlocks.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    content: (0, import_pg_core7.jsonb)("content").notNull(),
    createdAt: (0, import_pg_core7.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core7.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    blockLanguageUnique: unique(
      "content_block_translations_block_language_unique"
    ).on(table.contentBlockId, table.languageCode)
  })
);
var contentBlockTranslationsRelations = (0, import_drizzle_orm7.relations)(
  contentBlockTranslations,
  ({ one }) => ({
    contentBlock: one(contentBlocks, {
      fields: [contentBlockTranslations.contentBlockId],
      references: [contentBlocks.id]
    })
  })
);

// src/schema/content-blocks.ts
var contentBlockTypeEnum = (0, import_pg_core8.pgEnum)("content_block_type", [
  "hero",
  "text",
  "card",
  "image",
  "table",
  "list",
  "grid",
  "callout",
  "quote",
  "divider",
  "video",
  "audio"
]);
var contentBlocks = (0, import_pg_core8.pgTable)(
  "content_blocks",
  {
    id: (0, import_pg_core8.uuid)("id").primaryKey().defaultRandom(),
    sectionId: (0, import_pg_core8.uuid)("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    blockType: contentBlockTypeEnum("block_type").notNull(),
    orderIndex: (0, import_pg_core8.integer)("order_index").notNull(),
    content: (0, import_pg_core8.jsonb)("content").notNull(),
    metadata: (0, import_pg_core8.jsonb)("metadata"),
    createdAt: (0, import_pg_core8.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core8.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    sectionOrderUnique: unique("content_blocks_section_order_unique").on(
      table.sectionId,
      table.orderIndex
    )
  })
);
var contentBlocksRelations = (0, import_drizzle_orm8.relations)(
  contentBlocks,
  ({ one, many }) => ({
    section: one(courseSections, {
      fields: [contentBlocks.sectionId],
      references: [courseSections.id]
    }),
    contentInteractions: many(contentInteractions),
    contentBlockTranslations: many(contentBlockTranslations)
  })
);

// src/schema/quiz-questions.ts
var import_pg_core11 = require("drizzle-orm/pg-core");
var import_drizzle_orm11 = require("drizzle-orm");

// src/schema/quiz-attempts.ts
var import_pg_core9 = require("drizzle-orm/pg-core");
var import_drizzle_orm9 = require("drizzle-orm");
var quizAttempts = (0, import_pg_core9.pgTable)("quiz_attempts", {
  id: (0, import_pg_core9.uuid)("id").primaryKey().defaultRandom(),
  userId: (0, import_pg_core9.text)("user_id").notNull(),
  quizQuestionId: (0, import_pg_core9.uuid)("quiz_question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
  userAnswer: (0, import_pg_core9.jsonb)("user_answer").notNull(),
  isCorrect: (0, import_pg_core9.boolean)("is_correct").notNull(),
  attemptedAt: (0, import_pg_core9.timestamp)("attempted_at").defaultNow().notNull(),
  timeSpentSeconds: (0, import_pg_core9.integer)("time_spent_seconds").default(0).notNull()
});
var quizAttemptsRelations = (0, import_drizzle_orm9.relations)(quizAttempts, ({ one }) => ({
  quizQuestion: one(quizQuestions, {
    fields: [quizAttempts.quizQuestionId],
    references: [quizQuestions.id]
  })
}));

// src/schema/quiz-question-translations.ts
var import_pg_core10 = require("drizzle-orm/pg-core");
var import_drizzle_orm10 = require("drizzle-orm");
var quizQuestionTranslations = (0, import_pg_core10.pgTable)(
  "quiz_question_translations",
  {
    id: (0, import_pg_core10.uuid)("id").primaryKey().defaultRandom(),
    quizQuestionId: (0, import_pg_core10.uuid)("quiz_question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    questionText: (0, import_pg_core10.text)("question_text").notNull(),
    options: (0, import_pg_core10.jsonb)("options"),
    correctAnswer: (0, import_pg_core10.jsonb)("correct_answer").notNull(),
    explanation: (0, import_pg_core10.text)("explanation"),
    createdAt: (0, import_pg_core10.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core10.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    questionLanguageUnique: unique(
      "quiz_question_translations_question_language_unique"
    ).on(table.quizQuestionId, table.languageCode)
  })
);
var quizQuestionTranslationsRelations = (0, import_drizzle_orm10.relations)(
  quizQuestionTranslations,
  ({ one }) => ({
    quizQuestion: one(quizQuestions, {
      fields: [quizQuestionTranslations.quizQuestionId],
      references: [quizQuestions.id]
    })
  })
);

// src/schema/quiz-questions.ts
var questionTypeEnum = (0, import_pg_core11.pgEnum)("question_type", [
  "true-false",
  "multiple-choice"
]);
var quizQuestions = (0, import_pg_core11.pgTable)(
  "quiz_questions",
  {
    id: (0, import_pg_core11.uuid)("id").primaryKey().defaultRandom(),
    sectionId: (0, import_pg_core11.uuid)("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    questionKey: (0, import_pg_core11.text)("question_key").notNull(),
    questionType: questionTypeEnum("question_type").notNull(),
    questionText: (0, import_pg_core11.text)("question_text").notNull(),
    options: (0, import_pg_core11.jsonb)("options"),
    correctAnswer: (0, import_pg_core11.jsonb)("correct_answer").notNull(),
    explanation: (0, import_pg_core11.text)("explanation"),
    orderIndex: (0, import_pg_core11.integer)("order_index").default(0).notNull(),
    isPublished: (0, import_pg_core11.boolean)("is_published").default(false).notNull(),
    createdAt: (0, import_pg_core11.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core11.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    sectionKeyUnique: unique("quiz_questions_section_key_unique").on(
      table.sectionId,
      table.questionKey
    )
  })
);
var quizQuestionsRelations = (0, import_drizzle_orm11.relations)(
  quizQuestions,
  ({ one, many }) => ({
    section: one(courseSections, {
      fields: [quizQuestions.sectionId],
      references: [courseSections.id]
    }),
    quizAttempts: many(quizAttempts),
    quizQuestionTranslations: many(quizQuestionTranslations)
  })
);

// src/schema/user-progress.ts
var import_pg_core12 = require("drizzle-orm/pg-core");
var import_drizzle_orm12 = require("drizzle-orm");
var userProgress = (0, import_pg_core12.pgTable)(
  "user_progress",
  {
    id: (0, import_pg_core12.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, import_pg_core12.text)("user_id").notNull(),
    courseId: (0, import_pg_core12.uuid)("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    sectionId: (0, import_pg_core12.uuid)("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    isCompleted: (0, import_pg_core12.boolean)("is_completed").default(false).notNull(),
    completionPercentage: (0, import_pg_core12.integer)("completion_percentage").default(0).notNull(),
    timeSpentSeconds: (0, import_pg_core12.integer)("time_spent_seconds").default(0).notNull(),
    lastAccessedAt: (0, import_pg_core12.timestamp)("last_accessed_at").defaultNow().notNull(),
    completedAt: (0, import_pg_core12.timestamp)("completed_at"),
    createdAt: (0, import_pg_core12.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core12.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    userSectionUnique: unique("user_progress_user_section_unique").on(
      table.userId,
      table.sectionId
    )
  })
);
var userProgressRelations = (0, import_drizzle_orm12.relations)(userProgress, ({ one }) => ({
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id]
  }),
  section: one(courseSections, {
    fields: [userProgress.sectionId],
    references: [courseSections.id]
  })
}));

// src/schema/section-translations.ts
var import_pg_core13 = require("drizzle-orm/pg-core");
var import_drizzle_orm13 = require("drizzle-orm");
var sectionTranslations = (0, import_pg_core13.pgTable)(
  "section_translations",
  {
    id: (0, import_pg_core13.uuid)("id").primaryKey().defaultRandom(),
    sectionId: (0, import_pg_core13.uuid)("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    title: (0, import_pg_core13.text)("title").notNull(),
    createdAt: (0, import_pg_core13.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core13.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    sectionLanguageUnique: unique(
      "section_translations_section_language_unique"
    ).on(table.sectionId, table.languageCode)
  })
);
var sectionTranslationsRelations = (0, import_drizzle_orm13.relations)(
  sectionTranslations,
  ({ one }) => ({
    section: one(courseSections, {
      fields: [sectionTranslations.sectionId],
      references: [courseSections.id]
    })
  })
);

// src/schema/course-sections.ts
var courseSections = (0, import_pg_core14.pgTable)(
  "course_sections",
  {
    id: (0, import_pg_core14.uuid)("id").primaryKey().defaultRandom(),
    courseId: (0, import_pg_core14.uuid)("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    sectionKey: (0, import_pg_core14.text)("section_key").notNull(),
    title: (0, import_pg_core14.text)("title").notNull(),
    orderIndex: (0, import_pg_core14.integer)("order_index").notNull(),
    iconName: (0, import_pg_core14.text)("icon_name"),
    isPublished: (0, import_pg_core14.boolean)("is_published").default(false).notNull(),
    createdAt: (0, import_pg_core14.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core14.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    courseSectionUnique: unique("course_sections_course_section_unique").on(
      table.courseId,
      table.sectionKey
    ),
    courseOrderUnique: unique("course_sections_course_order_unique").on(
      table.courseId,
      table.orderIndex
    )
  })
);
var courseSectionsRelations = (0, import_drizzle_orm14.relations)(
  courseSections,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseSections.courseId],
      references: [courses.id]
    }),
    contentBlocks: many(contentBlocks),
    quizQuestions: many(quizQuestions),
    userProgress: many(userProgress),
    sectionTranslations: many(sectionTranslations)
  })
);

// src/schema/courses.ts
var courses = (0, import_pg_core15.pgTable)("courses", {
  id: (0, import_pg_core15.uuid)("id").primaryKey().defaultRandom(),
  slug: (0, import_pg_core15.text)("slug").notNull().unique(),
  courseKey: (0, import_pg_core15.text)("course_key").unique(),
  title: (0, import_pg_core15.text)("title").notNull(),
  description: (0, import_pg_core15.text)("description"),
  version: (0, import_pg_core15.text)("version").default("1.0").notNull(),
  isPublished: (0, import_pg_core15.boolean)("is_published").default(false).notNull(),
  createdAt: (0, import_pg_core15.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core15.timestamp)("updated_at").defaultNow().notNull()
});
var coursesRelations = (0, import_drizzle_orm15.relations)(courses, ({ many }) => ({
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
  courseSections: many(courseSections),
  courseTranslations: many(courseTranslations),
  userProgress: many(userProgress)
}));

// src/schema/admin-roles.ts
var import_pg_core16 = require("drizzle-orm/pg-core");
var import_drizzle_orm16 = require("drizzle-orm");
var adminRoleEnum = (0, import_pg_core16.pgEnum)("admin_role", [
  "hr_admin",
  "dev_admin",
  "plant_manager"
]);
var adminRoles = (0, import_pg_core16.pgTable)("admin_roles", {
  id: (0, import_pg_core16.uuid)("id").primaryKey().defaultRandom(),
  userId: (0, import_pg_core16.uuid)("user_id").notNull().references(() => profiles.id),
  role: adminRoleEnum("role").notNull(),
  plantId: (0, import_pg_core16.uuid)("plant_id").references(() => plants.id),
  createdAt: (0, import_pg_core16.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core16.timestamp)("updated_at").defaultNow().notNull()
});
var adminRolesRelations = (0, import_drizzle_orm16.relations)(adminRoles, ({ one }) => ({
  user: one(profiles, {
    fields: [adminRoles.userId],
    references: [profiles.id]
  }),
  plant: one(plants, {
    fields: [adminRoles.plantId],
    references: [plants.id]
  })
}));

// src/schema/plants.ts
var plants = (0, import_pg_core17.pgTable)("plants", {
  id: (0, import_pg_core17.uuid)("id").primaryKey().defaultRandom(),
  name: (0, import_pg_core17.text)("name").notNull().unique(),
  isActive: (0, import_pg_core17.boolean)("is_active").default(true).notNull(),
  createdAt: (0, import_pg_core17.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core17.timestamp)("updated_at").defaultNow().notNull()
});
var plantsRelations = (0, import_drizzle_orm17.relations)(plants, ({ many }) => ({
  profiles: many(profiles),
  courses: many(courses),
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
  adminRoles: many(adminRoles)
}));

// src/schema/profiles.ts
var userStatusEnum = (0, import_pg_core18.pgEnum)("user_status", [
  "active",
  "inactive",
  "suspended"
]);
var profiles = (0, import_pg_core18.pgTable)("profiles", {
  id: (0, import_pg_core18.uuid)("id").primaryKey(),
  // References auth.users.id
  plantId: (0, import_pg_core18.uuid)("plant_id").notNull().references(() => plants.id),
  firstName: (0, import_pg_core18.text)("first_name").notNull(),
  lastName: (0, import_pg_core18.text)("last_name").notNull(),
  email: (0, import_pg_core18.text)("email").notNull(),
  jobTitle: (0, import_pg_core18.text)("job_title"),
  status: userStatusEnum("status").default("active").notNull(),
  createdAt: (0, import_pg_core18.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core18.timestamp)("updated_at").defaultNow().notNull()
});
var profilesRelations = (0, import_drizzle_orm18.relations)(profiles, ({ one }) => ({
  plant: one(plants, {
    fields: [profiles.plantId],
    references: [plants.id]
  })
}));

// src/schema/audit-log.ts
var import_pg_core19 = require("drizzle-orm/pg-core");
var import_drizzle_orm19 = require("drizzle-orm");
var auditLog = (0, import_pg_core19.pgTable)("audit_log", {
  id: (0, import_pg_core19.uuid)("id").primaryKey().defaultRandom(),
  tableName: (0, import_pg_core19.text)("table_name").notNull(),
  operation: (0, import_pg_core19.text)("operation").notNull(),
  oldData: (0, import_pg_core19.jsonb)("old_data"),
  newData: (0, import_pg_core19.jsonb)("new_data"),
  userId: (0, import_pg_core19.uuid)("user_id").references(() => profiles.id),
  occurredAt: (0, import_pg_core19.timestamp)("occurred_at").defaultNow().notNull()
});
var auditLogRelations = (0, import_drizzle_orm19.relations)(auditLog, ({ one }) => ({
  user: one(profiles, {
    fields: [auditLog.userId],
    references: [profiles.id]
  })
}));

// src/schema/territories.ts
var import_pg_core20 = require("drizzle-orm/pg-core");
var territories = (0, import_pg_core20.pgTable)(
  "territories",
  {
    id: (0, import_pg_core20.uuid)("id").primaryKey().defaultRandom(),
    name: (0, import_pg_core20.text)("name").notNull().unique(),
    code: (0, import_pg_core20.text)("code").notNull().unique(),
    // e.g., "NORTH", "SOUTH", "EAST", "WEST"
    description: (0, import_pg_core20.text)("description"),
    region: (0, import_pg_core20.text)("region"),
    // e.g., "North America", "Europe", "Asia-Pacific"
    isActive: (0, import_pg_core20.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core20.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core20.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    nameIdx: (0, import_pg_core20.index)("territories_name_idx").on(table.name),
    codeIdx: (0, import_pg_core20.index)("territories_code_idx").on(table.code),
    regionIdx: (0, import_pg_core20.index)("territories_region_idx").on(table.region),
    activeIdx: (0, import_pg_core20.index)("territories_active_idx").on(table.isActive)
  })
);

// src/schema/user-profiles.ts
var import_pg_core21 = require("drizzle-orm/pg-core");
var userRoleEnum = (0, import_pg_core21.pgEnum)("user_role", [
  "safety_admin",
  "safety_manager",
  "safety_coordinator",
  "safety_instructor",
  "safety_rep",
  "plant_manager",
  "hr_admin",
  "employee"
]);
var userProfiles = (0, import_pg_core21.pgTable)(
  "user_profiles",
  {
    id: (0, import_pg_core21.uuid)("id").primaryKey(),
    // References auth.users.id
    authUserId: (0, import_pg_core21.uuid)("auth_user_id").notNull().unique(),
    // Direct reference to auth.users.id
    territoryId: (0, import_pg_core21.uuid)("territory_id").notNull().references(() => territories.id),
    firstName: (0, import_pg_core21.text)("first_name").notNull(),
    lastName: (0, import_pg_core21.text)("last_name").notNull(),
    email: (0, import_pg_core21.text)("email").notNull().unique(),
    phone: (0, import_pg_core21.text)("phone"),
    jobTitle: (0, import_pg_core21.text)("job_title"),
    department: (0, import_pg_core21.text)("department"),
    role: userRoleEnum("role").default("employee").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    isActive: (0, import_pg_core21.boolean)("is_active").default(true).notNull(),
    lastLoginAt: (0, import_pg_core21.timestamp)("last_login_at"),
    createdAt: (0, import_pg_core21.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core21.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, import_pg_core21.uuid)("created_by")
    // References another user_profiles.id
  },
  (table) => ({
    authUserIdIdx: (0, import_pg_core21.index)("user_profiles_auth_user_id_idx").on(table.authUserId),
    territoryIdIdx: (0, import_pg_core21.index)("user_profiles_territory_id_idx").on(
      table.territoryId
    ),
    emailIdx: (0, import_pg_core21.index)("user_profiles_email_idx").on(table.email),
    roleIdx: (0, import_pg_core21.index)("user_profiles_role_idx").on(table.role),
    statusIdx: (0, import_pg_core21.index)("user_profiles_status_idx").on(table.status),
    activeIdx: (0, import_pg_core21.index)("user_profiles_active_idx").on(table.isActive)
  })
);

// src/schema/accounts.ts
var import_pg_core22 = require("drizzle-orm/pg-core");
var accountTypeEnum = (0, import_pg_core22.pgEnum)("account_type", [
  "safety_equipment_customer",
  "training_client",
  "consulting_client",
  "maintenance_client",
  "partner",
  "vendor"
]);
var accountStatusEnum = (0, import_pg_core22.pgEnum)("account_status", [
  "active",
  "inactive",
  "suspended",
  "closed"
]);
var industryEnum = (0, import_pg_core22.pgEnum)("industry", [
  "manufacturing",
  "construction",
  "oil_gas",
  "chemical",
  "mining",
  "utilities",
  "transportation",
  "healthcare",
  "agriculture",
  "other"
]);
var accounts = (0, import_pg_core22.pgTable)(
  "accounts",
  {
    id: (0, import_pg_core22.uuid)("id").primaryKey().defaultRandom(),
    territoryId: (0, import_pg_core22.uuid)("territory_id").notNull().references(() => territories.id),
    ownerId: (0, import_pg_core22.uuid)("owner_id").notNull().references(() => userProfiles.id),
    name: (0, import_pg_core22.text)("name").notNull(),
    accountNumber: (0, import_pg_core22.text)("account_number").unique(),
    type: accountTypeEnum("type").default("safety_equipment_customer").notNull(),
    status: accountStatusEnum("status").default("active").notNull(),
    industry: industryEnum("industry"),
    website: (0, import_pg_core22.text)("website"),
    phone: (0, import_pg_core22.text)("phone"),
    email: (0, import_pg_core22.text)("email"),
    description: (0, import_pg_core22.text)("description"),
    annualRevenue: (0, import_pg_core22.decimal)("annual_revenue", { precision: 15, scale: 2 }),
    employeeCount: (0, import_pg_core22.text)("employee_count"),
    // e.g., "1-10", "11-50", "51-200", "201-500", "500+"
    safetyComplianceLevel: (0, import_pg_core22.text)("safety_compliance_level"),
    // e.g., "OSHA Compliant", "ISO 45001", "Custom"
    billingAddress: (0, import_pg_core22.text)("billing_address"),
    shippingAddress: (0, import_pg_core22.text)("shipping_address"),
    isActive: (0, import_pg_core22.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core22.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core22.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, import_pg_core22.uuid)("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    territoryIdIdx: (0, import_pg_core22.index)("accounts_territory_id_idx").on(table.territoryId),
    ownerIdIdx: (0, import_pg_core22.index)("accounts_owner_id_idx").on(table.ownerId),
    nameIdx: (0, import_pg_core22.index)("accounts_name_idx").on(table.name),
    accountNumberIdx: (0, import_pg_core22.index)("accounts_account_number_idx").on(
      table.accountNumber
    ),
    typeIdx: (0, import_pg_core22.index)("accounts_type_idx").on(table.type),
    statusIdx: (0, import_pg_core22.index)("accounts_status_idx").on(table.status),
    industryIdx: (0, import_pg_core22.index)("accounts_industry_idx").on(table.industry),
    activeIdx: (0, import_pg_core22.index)("accounts_active_idx").on(table.isActive)
  })
);

// src/schema/branches.ts
var import_pg_core23 = require("drizzle-orm/pg-core");
var branches = (0, import_pg_core23.pgTable)(
  "branches",
  {
    id: (0, import_pg_core23.uuid)("id").primaryKey().defaultRandom(),
    accountId: (0, import_pg_core23.uuid)("account_id").notNull().references(() => accounts.id),
    name: (0, import_pg_core23.text)("name").notNull(),
    branchCode: (0, import_pg_core23.text)("branch_code"),
    // Internal code for the branch
    address: (0, import_pg_core23.text)("address").notNull(),
    city: (0, import_pg_core23.text)("city").notNull(),
    state: (0, import_pg_core23.text)("state").notNull(),
    postalCode: (0, import_pg_core23.text)("postal_code").notNull(),
    country: (0, import_pg_core23.text)("country").default("US").notNull(),
    phone: (0, import_pg_core23.text)("phone"),
    email: (0, import_pg_core23.text)("email"),
    contactPerson: (0, import_pg_core23.text)("contact_person"),
    safetyManager: (0, import_pg_core23.text)("safety_manager"),
    // Primary safety contact
    isPrimary: (0, import_pg_core23.boolean)("is_primary").default(false).notNull(),
    // Primary branch for the account
    isActive: (0, import_pg_core23.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core23.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core23.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    accountIdIdx: (0, import_pg_core23.index)("branches_account_id_idx").on(table.accountId),
    nameIdx: (0, import_pg_core23.index)("branches_name_idx").on(table.name),
    branchCodeIdx: (0, import_pg_core23.index)("branches_branch_code_idx").on(table.branchCode),
    cityIdx: (0, import_pg_core23.index)("branches_city_idx").on(table.city),
    stateIdx: (0, import_pg_core23.index)("branches_state_idx").on(table.state),
    primaryIdx: (0, import_pg_core23.index)("branches_primary_idx").on(table.isPrimary),
    activeIdx: (0, import_pg_core23.index)("branches_active_idx").on(table.isActive)
  })
);

// src/schema/contacts.ts
var import_pg_core24 = require("drizzle-orm/pg-core");
var contactRoleEnum = (0, import_pg_core24.pgEnum)("contact_role", [
  "safety_manager",
  "safety_coordinator",
  "safety_instructor",
  "hr_manager",
  "plant_manager",
  "purchasing_manager",
  "decision_maker",
  "influencer",
  "user",
  "other"
]);
var contactStatusEnum = (0, import_pg_core24.pgEnum)("contact_status", [
  "active",
  "inactive",
  "do_not_contact"
]);
var contacts = (0, import_pg_core24.pgTable)(
  "contacts",
  {
    id: (0, import_pg_core24.uuid)("id").primaryKey().defaultRandom(),
    accountId: (0, import_pg_core24.uuid)("account_id").notNull().references(() => accounts.id),
    branchId: (0, import_pg_core24.uuid)("branch_id").references(() => branches.id),
    // Optional - may not be assigned to specific branch
    ownerId: (0, import_pg_core24.uuid)("owner_id").notNull().references(() => userProfiles.id),
    firstName: (0, import_pg_core24.text)("first_name").notNull(),
    lastName: (0, import_pg_core24.text)("last_name").notNull(),
    email: (0, import_pg_core24.text)("email").notNull(),
    phone: (0, import_pg_core24.text)("phone"),
    mobile: (0, import_pg_core24.text)("mobile"),
    jobTitle: (0, import_pg_core24.text)("job_title"),
    department: (0, import_pg_core24.text)("department"),
    role: contactRoleEnum("role").default("user").notNull(),
    status: contactStatusEnum("status").default("active").notNull(),
    isPrimary: (0, import_pg_core24.boolean)("is_primary").default(false).notNull(),
    // Primary contact for the account
    safetyCertifications: (0, import_pg_core24.text)("safety_certifications"),
    // e.g., "OSHA 30", "CSP", "ASP"
    notes: (0, import_pg_core24.text)("notes"),
    isActive: (0, import_pg_core24.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core24.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core24.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, import_pg_core24.uuid)("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    accountIdIdx: (0, import_pg_core24.index)("contacts_account_id_idx").on(table.accountId),
    branchIdIdx: (0, import_pg_core24.index)("contacts_branch_id_idx").on(table.branchId),
    ownerIdIdx: (0, import_pg_core24.index)("contacts_owner_id_idx").on(table.ownerId),
    emailIdx: (0, import_pg_core24.index)("contacts_email_idx").on(table.email),
    nameIdx: (0, import_pg_core24.index)("contacts_name_idx").on(table.firstName, table.lastName),
    roleIdx: (0, import_pg_core24.index)("contacts_role_idx").on(table.role),
    statusIdx: (0, import_pg_core24.index)("contacts_status_idx").on(table.status),
    primaryIdx: (0, import_pg_core24.index)("contacts_primary_idx").on(table.isPrimary),
    activeIdx: (0, import_pg_core24.index)("contacts_active_idx").on(table.isActive)
  })
);

// src/schema/activity-logs.ts
var import_pg_core25 = require("drizzle-orm/pg-core");
var activityTypeEnum = (0, import_pg_core25.pgEnum)("activity_type", [
  "safety_consultation",
  "equipment_demo",
  "training_session",
  "safety_audit",
  "compliance_review",
  "incident_follow_up",
  "proposal_presentation",
  "follow_up_call",
  "site_visit",
  "note",
  "task",
  "other"
]);
var activityStatusEnum = (0, import_pg_core25.pgEnum)("activity_status", [
  "completed",
  "pending",
  "cancelled",
  "rescheduled"
]);
var activityPriorityEnum = (0, import_pg_core25.pgEnum)("activity_priority", [
  "low",
  "medium",
  "high",
  "urgent"
]);
var activityLogs = (0, import_pg_core25.pgTable)(
  "activity_logs",
  {
    id: (0, import_pg_core25.uuid)("id").primaryKey().defaultRandom(),
    accountId: (0, import_pg_core25.uuid)("account_id").references(() => accounts.id),
    // Optional - some activities may not be account-specific
    contactId: (0, import_pg_core25.uuid)("contact_id").references(() => contacts.id),
    // Optional - some activities may not be contact-specific
    userId: (0, import_pg_core25.uuid)("user_id").notNull().references(() => userProfiles.id),
    type: activityTypeEnum("type").notNull(),
    subject: (0, import_pg_core25.text)("subject").notNull(),
    description: (0, import_pg_core25.text)("description"),
    status: activityStatusEnum("status").default("completed").notNull(),
    priority: activityPriorityEnum("priority").default("medium").notNull(),
    scheduledAt: (0, import_pg_core25.timestamp)("scheduled_at"),
    // For future activities
    completedAt: (0, import_pg_core25.timestamp)("completed_at"),
    // When the activity was completed
    duration: (0, import_pg_core25.text)("duration"),
    // e.g., "30 minutes", "1 hour"
    outcome: (0, import_pg_core25.text)("outcome"),
    // Result of the activity
    nextSteps: (0, import_pg_core25.text)("next_steps"),
    // Follow-up actions
    safetyNotes: (0, import_pg_core25.text)("safety_notes"),
    // Safety-specific observations
    isActive: (0, import_pg_core25.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core25.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core25.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    accountIdIdx: (0, import_pg_core25.index)("activity_logs_account_id_idx").on(table.accountId),
    contactIdIdx: (0, import_pg_core25.index)("activity_logs_contact_id_idx").on(table.contactId),
    userIdIdx: (0, import_pg_core25.index)("activity_logs_user_id_idx").on(table.userId),
    typeIdx: (0, import_pg_core25.index)("activity_logs_type_idx").on(table.type),
    statusIdx: (0, import_pg_core25.index)("activity_logs_status_idx").on(table.status),
    priorityIdx: (0, import_pg_core25.index)("activity_logs_priority_idx").on(table.priority),
    scheduledAtIdx: (0, import_pg_core25.index)("activity_logs_scheduled_at_idx").on(
      table.scheduledAt
    ),
    completedAtIdx: (0, import_pg_core25.index)("activity_logs_completed_at_idx").on(
      table.completedAt
    ),
    activeIdx: (0, import_pg_core25.index)("activity_logs_active_idx").on(table.isActive)
  })
);

// src/schema/opportunities.ts
var import_pg_core26 = require("drizzle-orm/pg-core");
var opportunityStageEnum = (0, import_pg_core26.pgEnum)("opportunity_stage", [
  "prospecting",
  "qualification",
  "needs_analysis",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost"
]);
var opportunityStatusEnum = (0, import_pg_core26.pgEnum)("opportunity_status", [
  "open",
  "closed",
  "cancelled"
]);
var opportunitySourceEnum = (0, import_pg_core26.pgEnum)("opportunity_source", [
  "inbound",
  "outbound",
  "referral",
  "website",
  "trade_show",
  "safety_conference",
  "cold_call",
  "other"
]);
var opportunityTypeEnum = (0, import_pg_core26.pgEnum)("opportunity_type", [
  "safety_equipment",
  "safety_training",
  "safety_consulting",
  "safety_audit",
  "compliance_services",
  "maintenance_contract",
  "other"
]);
var probabilityEnum = (0, import_pg_core26.pgEnum)("probability", [
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
  "90",
  "100"
]);
var opportunities = (0, import_pg_core26.pgTable)(
  "opportunities",
  {
    id: (0, import_pg_core26.uuid)("id").primaryKey().defaultRandom(),
    accountId: (0, import_pg_core26.uuid)("account_id").notNull().references(() => accounts.id),
    contactId: (0, import_pg_core26.uuid)("contact_id").references(() => contacts.id),
    // Primary contact for this opportunity
    ownerId: (0, import_pg_core26.uuid)("owner_id").notNull().references(() => userProfiles.id),
    name: (0, import_pg_core26.text)("name").notNull(),
    description: (0, import_pg_core26.text)("description"),
    type: opportunityTypeEnum("type").notNull(),
    stage: opportunityStageEnum("stage").default("prospecting").notNull(),
    status: opportunityStatusEnum("status").default("open").notNull(),
    source: opportunitySourceEnum("source"),
    probability: probabilityEnum("probability").default("10").notNull(),
    amount: (0, import_pg_core26.decimal)("amount", { precision: 15, scale: 2 }),
    // Expected deal value
    closeDate: (0, import_pg_core26.timestamp)("close_date"),
    // Expected close date
    actualCloseDate: (0, import_pg_core26.timestamp)("actual_close_date"),
    // Actual close date
    lostReason: (0, import_pg_core26.text)("lost_reason"),
    // Reason if opportunity was lost
    nextSteps: (0, import_pg_core26.text)("next_steps"),
    // Next actions
    safetyRequirements: (0, import_pg_core26.text)("safety_requirements"),
    // Specific safety needs
    complianceNotes: (0, import_pg_core26.text)("compliance_notes"),
    // Compliance-related notes
    notes: (0, import_pg_core26.text)("notes"),
    isActive: (0, import_pg_core26.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core26.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core26.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, import_pg_core26.uuid)("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    accountIdIdx: (0, import_pg_core26.index)("opportunities_account_id_idx").on(table.accountId),
    contactIdIdx: (0, import_pg_core26.index)("opportunities_contact_id_idx").on(table.contactId),
    ownerIdIdx: (0, import_pg_core26.index)("opportunities_owner_id_idx").on(table.ownerId),
    nameIdx: (0, import_pg_core26.index)("opportunities_name_idx").on(table.name),
    typeIdx: (0, import_pg_core26.index)("opportunities_type_idx").on(table.type),
    stageIdx: (0, import_pg_core26.index)("opportunities_stage_idx").on(table.stage),
    statusIdx: (0, import_pg_core26.index)("opportunities_status_idx").on(table.status),
    sourceIdx: (0, import_pg_core26.index)("opportunities_source_idx").on(table.source),
    probabilityIdx: (0, import_pg_core26.index)("opportunities_probability_idx").on(
      table.probability
    ),
    closeDateIdx: (0, import_pg_core26.index)("opportunities_close_date_idx").on(table.closeDate),
    activeIdx: (0, import_pg_core26.index)("opportunities_active_idx").on(table.isActive)
  })
);

// src/schema/sales-facts.ts
var import_pg_core27 = require("drizzle-orm/pg-core");
var salesFactTypeEnum = (0, import_pg_core27.pgEnum)("sales_fact_type", [
  "safety_equipment_revenue",
  "training_revenue",
  "consulting_revenue",
  "maintenance_revenue",
  "equipment_units_sold",
  "training_sessions_delivered",
  "consulting_hours",
  "contract_value",
  "renewal",
  "upsell",
  "cross_sell"
]);
var periodTypeEnum = (0, import_pg_core27.pgEnum)("period_type", [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly"
]);
var salesFacts = (0, import_pg_core27.pgTable)(
  "sales_facts",
  {
    id: (0, import_pg_core27.uuid)("id").primaryKey().defaultRandom(),
    accountId: (0, import_pg_core27.uuid)("account_id").notNull().references(() => accounts.id),
    opportunityId: (0, import_pg_core27.uuid)("opportunity_id").references(() => opportunities.id),
    // Optional - may not be tied to specific opportunity
    userId: (0, import_pg_core27.uuid)("user_id").notNull().references(() => userProfiles.id),
    factType: salesFactTypeEnum("fact_type").notNull(),
    periodType: periodTypeEnum("period_type").notNull(),
    periodStart: (0, import_pg_core27.timestamp)("period_start").notNull(),
    periodEnd: (0, import_pg_core27.timestamp)("period_end").notNull(),
    amount: (0, import_pg_core27.decimal)("amount", { precision: 15, scale: 2 }).notNull(),
    quantity: (0, import_pg_core27.integer)("quantity"),
    // Number of units, sessions, hours, etc.
    currency: (0, import_pg_core27.text)("currency").default("USD").notNull(),
    description: (0, import_pg_core27.text)("description"),
    safetyCategory: (0, import_pg_core27.text)("safety_category"),
    // e.g., "PPE", "Training", "Consulting"
    complianceStandard: (0, import_pg_core27.text)("compliance_standard"),
    // e.g., "OSHA", "ISO 45001", "ANSI"
    isActive: (0, import_pg_core27.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core27.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core27.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    accountIdIdx: (0, import_pg_core27.index)("sales_facts_account_id_idx").on(table.accountId),
    opportunityIdIdx: (0, import_pg_core27.index)("sales_facts_opportunity_id_idx").on(
      table.opportunityId
    ),
    userIdIdx: (0, import_pg_core27.index)("sales_facts_user_id_idx").on(table.userId),
    factTypeIdx: (0, import_pg_core27.index)("sales_facts_fact_type_idx").on(table.factType),
    periodTypeIdx: (0, import_pg_core27.index)("sales_facts_period_type_idx").on(table.periodType),
    periodStartIdx: (0, import_pg_core27.index)("sales_facts_period_start_idx").on(table.periodStart),
    periodEndIdx: (0, import_pg_core27.index)("sales_facts_period_end_idx").on(table.periodEnd),
    safetyCategoryIdx: (0, import_pg_core27.index)("sales_facts_safety_category_idx").on(
      table.safetyCategory
    ),
    activeIdx: (0, import_pg_core27.index)("sales_facts_active_idx").on(table.isActive)
  })
);

// src/schema/products.ts
var import_pg_core28 = require("drizzle-orm/pg-core");
var productTypeEnum = (0, import_pg_core28.pgEnum)("product_type", [
  "safety_equipment",
  "ppe",
  // Personal Protective Equipment
  "safety_training",
  "safety_consulting",
  "safety_software",
  "safety_services",
  "maintenance_services",
  "other"
]);
var productStatusEnum = (0, import_pg_core28.pgEnum)("product_status", [
  "active",
  "inactive",
  "discontinued",
  "coming_soon"
]);
var complianceStandardEnum = (0, import_pg_core28.pgEnum)("compliance_standard", [
  "osha",
  "ansi",
  "niosh",
  "iso_45001",
  "iso_14001",
  "custom",
  "other"
]);
var products = (0, import_pg_core28.pgTable)(
  "products",
  {
    id: (0, import_pg_core28.uuid)("id").primaryKey().defaultRandom(),
    territoryId: (0, import_pg_core28.uuid)("territory_id").notNull().references(() => territories.id),
    sku: (0, import_pg_core28.text)("sku").notNull().unique(),
    // Stock Keeping Unit
    name: (0, import_pg_core28.text)("name").notNull(),
    description: (0, import_pg_core28.text)("description"),
    type: productTypeEnum("type").notNull(),
    status: productStatusEnum("status").default("active").notNull(),
    category: (0, import_pg_core28.text)("category"),
    // e.g., "Head Protection", "Fall Protection", "Online Training"
    subcategory: (0, import_pg_core28.text)("subcategory"),
    // e.g., "Hard Hats", "Safety Harnesses", "OSHA 10-Hour"
    unitPrice: (0, import_pg_core28.decimal)("unit_price", { precision: 10, scale: 2 }),
    currency: (0, import_pg_core28.text)("currency").default("USD").notNull(),
    unitOfMeasure: (0, import_pg_core28.text)("unit_of_measure"),
    // e.g., "each", "hour", "license", "course"
    weight: (0, import_pg_core28.decimal)("weight", { precision: 8, scale: 2 }),
    // in pounds
    dimensions: (0, import_pg_core28.text)("dimensions"),
    // e.g., "12x8x4 inches"
    manufacturer: (0, import_pg_core28.text)("manufacturer"),
    model: (0, import_pg_core28.text)("model"),
    complianceStandards: (0, import_pg_core28.text)("compliance_standards"),
    // JSON array of compliance standards
    safetyFeatures: (0, import_pg_core28.text)("safety_features"),
    // Key safety features
    specifications: (0, import_pg_core28.text)("specifications"),
    // JSON string or detailed specs
    isActive: (0, import_pg_core28.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core28.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core28.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    territoryIdIdx: (0, import_pg_core28.index)("products_territory_id_idx").on(table.territoryId),
    skuIdx: (0, import_pg_core28.index)("products_sku_idx").on(table.sku),
    nameIdx: (0, import_pg_core28.index)("products_name_idx").on(table.name),
    typeIdx: (0, import_pg_core28.index)("products_type_idx").on(table.type),
    statusIdx: (0, import_pg_core28.index)("products_status_idx").on(table.status),
    categoryIdx: (0, import_pg_core28.index)("products_category_idx").on(table.category),
    subcategoryIdx: (0, import_pg_core28.index)("products_subcategory_idx").on(table.subcategory),
    activeIdx: (0, import_pg_core28.index)("products_active_idx").on(table.isActive)
  })
);

// src/schema/projects.ts
var import_pg_core29 = require("drizzle-orm/pg-core");
var projectTypeEnum = (0, import_pg_core29.pgEnum)("project_type", [
  "safety_audit",
  "safety_consulting",
  "safety_training",
  "safety_equipment_installation",
  "compliance_assessment",
  "safety_system_implementation",
  "incident_investigation",
  "safety_program_development",
  "other"
]);
var projectStatusEnum = (0, import_pg_core29.pgEnum)("project_status", [
  "planning",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled"
]);
var projectPriorityEnum = (0, import_pg_core29.pgEnum)("project_priority", [
  "low",
  "medium",
  "high",
  "urgent"
]);
var projects = (0, import_pg_core29.pgTable)(
  "projects",
  {
    id: (0, import_pg_core29.uuid)("id").primaryKey().defaultRandom(),
    accountId: (0, import_pg_core29.uuid)("account_id").notNull().references(() => accounts.id),
    ownerId: (0, import_pg_core29.uuid)("owner_id").notNull().references(() => userProfiles.id),
    name: (0, import_pg_core29.text)("name").notNull(),
    description: (0, import_pg_core29.text)("description"),
    type: projectTypeEnum("type").notNull(),
    status: projectStatusEnum("status").default("planning").notNull(),
    priority: projectPriorityEnum("priority").default("medium").notNull(),
    startDate: (0, import_pg_core29.timestamp)("start_date"),
    endDate: (0, import_pg_core29.timestamp)("end_date"),
    actualStartDate: (0, import_pg_core29.timestamp)("actual_start_date"),
    actualEndDate: (0, import_pg_core29.timestamp)("actual_end_date"),
    budget: (0, import_pg_core29.decimal)("budget", { precision: 15, scale: 2 }),
    actualCost: (0, import_pg_core29.decimal)("actual_cost", { precision: 15, scale: 2 }),
    currency: (0, import_pg_core29.text)("currency").default("USD").notNull(),
    location: (0, import_pg_core29.text)("location"),
    // Project site location
    safetyRequirements: (0, import_pg_core29.text)("safety_requirements"),
    // Specific safety requirements
    complianceStandards: (0, import_pg_core29.text)("compliance_standards"),
    // Applicable compliance standards
    deliverables: (0, import_pg_core29.text)("deliverables"),
    // Project deliverables
    notes: (0, import_pg_core29.text)("notes"),
    isActive: (0, import_pg_core29.boolean)("is_active").default(true).notNull(),
    createdAt: (0, import_pg_core29.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_pg_core29.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, import_pg_core29.uuid)("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    accountIdIdx: (0, import_pg_core29.index)("projects_account_id_idx").on(table.accountId),
    ownerIdIdx: (0, import_pg_core29.index)("projects_owner_id_idx").on(table.ownerId),
    nameIdx: (0, import_pg_core29.index)("projects_name_idx").on(table.name),
    typeIdx: (0, import_pg_core29.index)("projects_type_idx").on(table.type),
    statusIdx: (0, import_pg_core29.index)("projects_status_idx").on(table.status),
    priorityIdx: (0, import_pg_core29.index)("projects_priority_idx").on(table.priority),
    startDateIdx: (0, import_pg_core29.index)("projects_start_date_idx").on(table.startDate),
    endDateIdx: (0, import_pg_core29.index)("projects_end_date_idx").on(table.endDate),
    activeIdx: (0, import_pg_core29.index)("projects_active_idx").on(table.isActive)
  })
);

// src/index.ts
var PACKAGE_VERSION = "1.0.0";
var PACKAGE_NAME = "@specchem/db";
var PACKAGE_DESCRIPTION = "Database schema and types for Safety System";
var PACKAGE_METADATA = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION,
  description: PACKAGE_DESCRIPTION,
  features: [
    "Complete Safety Training Schema",
    "Safety Business CRM Schema",
    "TypeScript Type Safety",
    "Drizzle ORM Integration",
    "Comprehensive Relations",
    "Enterprise-Grade Indexes",
    "Audit Trail Support",
    "Territory-Based Access Control"
  ],
  schema: {
    coreTables: 9,
    businessTables: 10,
    totalTables: 19,
    enums: 26,
    relations: 19,
    indexes: 100
  },
  compatibility: {
    drizzle: "0.29+",
    postgresql: "15+",
    typescript: "5.0+"
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PACKAGE_DESCRIPTION,
  PACKAGE_METADATA,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  accountStatusEnum,
  accountTypeEnum,
  accounts,
  activityEvents,
  activityEventsRelations,
  activityLogs,
  activityPriorityEnum,
  activityStatusEnum,
  activityTypeEnum,
  adminRoleEnum,
  adminRoles,
  adminRolesRelations,
  auditLog,
  auditLogRelations,
  branches,
  complianceStandardEnum,
  contactRoleEnum,
  contactStatusEnum,
  contacts,
  courses,
  coursesRelations,
  enrollmentStatusEnum,
  enrollments,
  enrollmentsRelations,
  eventTypeEnum,
  industryEnum,
  opportunities,
  opportunitySourceEnum,
  opportunityStageEnum,
  opportunityStatusEnum,
  opportunityTypeEnum,
  periodTypeEnum,
  plants,
  plantsRelations,
  probabilityEnum,
  productStatusEnum,
  productTypeEnum,
  products,
  profiles,
  profilesRelations,
  progress,
  progressRelations,
  projectPriorityEnum,
  projectStatusEnum,
  projectTypeEnum,
  projects,
  questionEvents,
  questionEventsRelations,
  salesFactTypeEnum,
  salesFacts,
  territories,
  userProfiles,
  userRoleEnum,
  userStatusEnum
});
//# sourceMappingURL=index.cjs.map
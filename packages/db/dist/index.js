// src/schema/profiles.ts
import { pgTable as pgTable18, uuid as uuid18, text as text15, timestamp as timestamp18, pgEnum as pgEnum11 } from "drizzle-orm/pg-core";
import { relations as relations18 } from "drizzle-orm";

// src/schema/plants.ts
import { pgTable as pgTable17, uuid as uuid17, text as text14, timestamp as timestamp17, boolean as boolean7 } from "drizzle-orm/pg-core";
import { relations as relations17 } from "drizzle-orm";

// src/schema/courses.ts
import { pgTable as pgTable15, uuid as uuid15, text as text13, timestamp as timestamp15, boolean as boolean6 } from "drizzle-orm/pg-core";
import { relations as relations15 } from "drizzle-orm";

// src/schema/enrollments.ts
import { pgTable, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
var enrollmentStatusEnum = pgEnum("enrollment_status", [
  "enrolled",
  "in_progress",
  "completed"
]);
var enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  courseId: uuid("course_id").notNull().references(() => courses.id),
  plantId: uuid("plant_id").notNull().references(() => plants.id),
  status: enrollmentStatusEnum("status").default("enrolled").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var enrollmentsRelations = relations(enrollments, ({ one }) => ({
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
import { pgTable as pgTable2, uuid as uuid2, text, timestamp as timestamp2, integer } from "drizzle-orm/pg-core";
import { relations as relations2 } from "drizzle-orm";
var progress = pgTable2("progress", {
  id: uuid2("id").primaryKey().defaultRandom(),
  userId: uuid2("user_id").notNull().references(() => profiles.id),
  courseId: uuid2("course_id").notNull().references(() => courses.id),
  plantId: uuid2("plant_id").notNull().references(() => plants.id),
  progressPercent: integer("progress_percent").default(0).notNull(),
  currentSection: text("current_section"),
  lastActiveAt: timestamp2("last_active_at").defaultNow().notNull(),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().notNull()
});
var progressRelations = relations2(progress, ({ one }) => ({
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
import { pgTable as pgTable3, uuid as uuid3, timestamp as timestamp3, jsonb, pgEnum as pgEnum2 } from "drizzle-orm/pg-core";
import { relations as relations3 } from "drizzle-orm";
var eventTypeEnum = pgEnum2("event_type", [
  "view_section",
  "start_course",
  "complete_course"
]);
var activityEvents = pgTable3("activity_events", {
  id: uuid3("id").primaryKey().defaultRandom(),
  userId: uuid3("user_id").notNull().references(() => profiles.id),
  courseId: uuid3("course_id").notNull().references(() => courses.id),
  plantId: uuid3("plant_id").notNull().references(() => plants.id),
  eventType: eventTypeEnum("event_type").notNull(),
  meta: jsonb("meta"),
  occurredAt: timestamp3("occurred_at").defaultNow().notNull(),
  createdAt: timestamp3("created_at").defaultNow().notNull()
});
var activityEventsRelations = relations3(activityEvents, ({ one }) => ({
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
import {
  pgTable as pgTable4,
  uuid as uuid4,
  text as text2,
  timestamp as timestamp4,
  boolean,
  integer as integer2,
  jsonb as jsonb2
} from "drizzle-orm/pg-core";
import { relations as relations4 } from "drizzle-orm";
var questionEvents = pgTable4("question_events", {
  id: uuid4("id").primaryKey().defaultRandom(),
  userId: uuid4("user_id").notNull().references(() => profiles.id),
  courseId: uuid4("course_id").notNull().references(() => courses.id),
  plantId: uuid4("plant_id").notNull().references(() => plants.id),
  sectionKey: text2("section_key").notNull(),
  questionKey: text2("question_key").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptIndex: integer2("attempt_index").default(1).notNull(),
  responseMeta: jsonb2("response_meta"),
  answeredAt: timestamp4("answered_at").defaultNow().notNull(),
  createdAt: timestamp4("created_at").defaultNow().notNull()
});
var questionEventsRelations = relations4(questionEvents, ({ one }) => ({
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
import {
  pgTable as pgTable14,
  uuid as uuid14,
  text as text12,
  timestamp as timestamp14,
  boolean as boolean5,
  integer as integer7
} from "drizzle-orm/pg-core";
import { relations as relations14 } from "drizzle-orm";

// src/schema/content-blocks.ts
import {
  pgTable as pgTable8,
  uuid as uuid8,
  timestamp as timestamp8,
  integer as integer3,
  jsonb as jsonb5,
  pgEnum as pgEnum6
} from "drizzle-orm/pg-core";
import { relations as relations8 } from "drizzle-orm";

// src/schema/content-interactions.ts
import {
  pgTable as pgTable5,
  uuid as uuid5,
  text as text3,
  timestamp as timestamp5,
  jsonb as jsonb3,
  pgEnum as pgEnum3
} from "drizzle-orm/pg-core";
import { relations as relations5 } from "drizzle-orm";
var interactionTypeEnum = pgEnum3("interaction_type", [
  "view",
  "click",
  "expand",
  "collapse",
  "download",
  "share"
]);
var contentInteractions = pgTable5("content_interactions", {
  id: uuid5("id").primaryKey().defaultRandom(),
  userId: text3("user_id").notNull(),
  contentBlockId: uuid5("content_block_id").notNull().references(() => contentBlocks.id, { onDelete: "cascade" }),
  interactionType: interactionTypeEnum("interaction_type").notNull(),
  metadata: jsonb3("metadata"),
  interactedAt: timestamp5("interacted_at").defaultNow().notNull()
});
var contentInteractionsRelations = relations5(
  contentInteractions,
  ({ one }) => ({
    contentBlock: one(contentBlocks, {
      fields: [contentInteractions.contentBlockId],
      references: [contentBlocks.id]
    })
  })
);

// src/schema/content-block-translations.ts
import {
  pgTable as pgTable7,
  uuid as uuid7,
  timestamp as timestamp7,
  jsonb as jsonb4
} from "drizzle-orm/pg-core";
import { relations as relations7 } from "drizzle-orm";

// src/schema/course-translations.ts
import { pgTable as pgTable6, uuid as uuid6, text as text4, timestamp as timestamp6, pgEnum as pgEnum4 } from "drizzle-orm/pg-core";
import { relations as relations6 } from "drizzle-orm";
var languageCodeEnum = pgEnum4("language_code", [
  "en",
  "es",
  "fr",
  "de"
]);
var courseTranslations = pgTable6(
  "course_translations",
  {
    id: uuid6("id").primaryKey().defaultRandom(),
    courseId: uuid6("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    title: text4("title").notNull(),
    description: text4("description"),
    createdAt: timestamp6("created_at").defaultNow().notNull(),
    updatedAt: timestamp6("updated_at").defaultNow().notNull()
  },
  (table) => ({
    courseLanguageUnique: unique(
      "course_translations_course_language_unique"
    ).on(table.courseId, table.languageCode)
  })
);
var courseTranslationsRelations = relations6(
  courseTranslations,
  ({ one }) => ({
    course: one(courses, {
      fields: [courseTranslations.courseId],
      references: [courses.id]
    })
  })
);

// src/schema/content-block-translations.ts
var contentBlockTranslations = pgTable7(
  "content_block_translations",
  {
    id: uuid7("id").primaryKey().defaultRandom(),
    contentBlockId: uuid7("content_block_id").notNull().references(() => contentBlocks.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    content: jsonb4("content").notNull(),
    createdAt: timestamp7("created_at").defaultNow().notNull(),
    updatedAt: timestamp7("updated_at").defaultNow().notNull()
  },
  (table) => ({
    blockLanguageUnique: unique(
      "content_block_translations_block_language_unique"
    ).on(table.contentBlockId, table.languageCode)
  })
);
var contentBlockTranslationsRelations = relations7(
  contentBlockTranslations,
  ({ one }) => ({
    contentBlock: one(contentBlocks, {
      fields: [contentBlockTranslations.contentBlockId],
      references: [contentBlocks.id]
    })
  })
);

// src/schema/content-blocks.ts
var contentBlockTypeEnum = pgEnum6("content_block_type", [
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
var contentBlocks = pgTable8(
  "content_blocks",
  {
    id: uuid8("id").primaryKey().defaultRandom(),
    sectionId: uuid8("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    blockType: contentBlockTypeEnum("block_type").notNull(),
    orderIndex: integer3("order_index").notNull(),
    content: jsonb5("content").notNull(),
    metadata: jsonb5("metadata"),
    createdAt: timestamp8("created_at").defaultNow().notNull(),
    updatedAt: timestamp8("updated_at").defaultNow().notNull()
  },
  (table) => ({
    sectionOrderUnique: unique("content_blocks_section_order_unique").on(
      table.sectionId,
      table.orderIndex
    )
  })
);
var contentBlocksRelations = relations8(
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
import {
  pgTable as pgTable11,
  uuid as uuid11,
  text as text9,
  timestamp as timestamp11,
  boolean as boolean3,
  integer as integer5,
  jsonb as jsonb8,
  pgEnum as pgEnum8
} from "drizzle-orm/pg-core";
import { relations as relations11 } from "drizzle-orm";

// src/schema/quiz-attempts.ts
import {
  pgTable as pgTable9,
  uuid as uuid9,
  text as text7,
  timestamp as timestamp9,
  boolean as boolean2,
  integer as integer4,
  jsonb as jsonb6
} from "drizzle-orm/pg-core";
import { relations as relations9 } from "drizzle-orm";
var quizAttempts = pgTable9("quiz_attempts", {
  id: uuid9("id").primaryKey().defaultRandom(),
  userId: text7("user_id").notNull(),
  quizQuestionId: uuid9("quiz_question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
  userAnswer: jsonb6("user_answer").notNull(),
  isCorrect: boolean2("is_correct").notNull(),
  attemptedAt: timestamp9("attempted_at").defaultNow().notNull(),
  timeSpentSeconds: integer4("time_spent_seconds").default(0).notNull()
});
var quizAttemptsRelations = relations9(quizAttempts, ({ one }) => ({
  quizQuestion: one(quizQuestions, {
    fields: [quizAttempts.quizQuestionId],
    references: [quizQuestions.id]
  })
}));

// src/schema/quiz-question-translations.ts
import {
  pgTable as pgTable10,
  uuid as uuid10,
  text as text8,
  timestamp as timestamp10,
  jsonb as jsonb7
} from "drizzle-orm/pg-core";
import { relations as relations10 } from "drizzle-orm";
var quizQuestionTranslations = pgTable10(
  "quiz_question_translations",
  {
    id: uuid10("id").primaryKey().defaultRandom(),
    quizQuestionId: uuid10("quiz_question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    questionText: text8("question_text").notNull(),
    options: jsonb7("options"),
    correctAnswer: jsonb7("correct_answer").notNull(),
    explanation: text8("explanation"),
    createdAt: timestamp10("created_at").defaultNow().notNull(),
    updatedAt: timestamp10("updated_at").defaultNow().notNull()
  },
  (table) => ({
    questionLanguageUnique: unique(
      "quiz_question_translations_question_language_unique"
    ).on(table.quizQuestionId, table.languageCode)
  })
);
var quizQuestionTranslationsRelations = relations10(
  quizQuestionTranslations,
  ({ one }) => ({
    quizQuestion: one(quizQuestions, {
      fields: [quizQuestionTranslations.quizQuestionId],
      references: [quizQuestions.id]
    })
  })
);

// src/schema/quiz-questions.ts
var questionTypeEnum = pgEnum8("question_type", [
  "true-false",
  "multiple-choice"
]);
var quizQuestions = pgTable11(
  "quiz_questions",
  {
    id: uuid11("id").primaryKey().defaultRandom(),
    sectionId: uuid11("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    questionKey: text9("question_key").notNull(),
    questionType: questionTypeEnum("question_type").notNull(),
    questionText: text9("question_text").notNull(),
    options: jsonb8("options"),
    correctAnswer: jsonb8("correct_answer").notNull(),
    explanation: text9("explanation"),
    orderIndex: integer5("order_index").default(0).notNull(),
    isPublished: boolean3("is_published").default(false).notNull(),
    createdAt: timestamp11("created_at").defaultNow().notNull(),
    updatedAt: timestamp11("updated_at").defaultNow().notNull()
  },
  (table) => ({
    sectionKeyUnique: unique("quiz_questions_section_key_unique").on(
      table.sectionId,
      table.questionKey
    )
  })
);
var quizQuestionsRelations = relations11(
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
import {
  pgTable as pgTable12,
  uuid as uuid12,
  text as text10,
  timestamp as timestamp12,
  boolean as boolean4,
  integer as integer6
} from "drizzle-orm/pg-core";
import { relations as relations12 } from "drizzle-orm";
var userProgress = pgTable12(
  "user_progress",
  {
    id: uuid12("id").primaryKey().defaultRandom(),
    userId: text10("user_id").notNull(),
    courseId: uuid12("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    sectionId: uuid12("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    isCompleted: boolean4("is_completed").default(false).notNull(),
    completionPercentage: integer6("completion_percentage").default(0).notNull(),
    timeSpentSeconds: integer6("time_spent_seconds").default(0).notNull(),
    lastAccessedAt: timestamp12("last_accessed_at").defaultNow().notNull(),
    completedAt: timestamp12("completed_at"),
    createdAt: timestamp12("created_at").defaultNow().notNull(),
    updatedAt: timestamp12("updated_at").defaultNow().notNull()
  },
  (table) => ({
    userSectionUnique: unique("user_progress_user_section_unique").on(
      table.userId,
      table.sectionId
    )
  })
);
var userProgressRelations = relations12(userProgress, ({ one }) => ({
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
import { pgTable as pgTable13, uuid as uuid13, text as text11, timestamp as timestamp13 } from "drizzle-orm/pg-core";
import { relations as relations13 } from "drizzle-orm";
var sectionTranslations = pgTable13(
  "section_translations",
  {
    id: uuid13("id").primaryKey().defaultRandom(),
    sectionId: uuid13("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    title: text11("title").notNull(),
    createdAt: timestamp13("created_at").defaultNow().notNull(),
    updatedAt: timestamp13("updated_at").defaultNow().notNull()
  },
  (table) => ({
    sectionLanguageUnique: unique(
      "section_translations_section_language_unique"
    ).on(table.sectionId, table.languageCode)
  })
);
var sectionTranslationsRelations = relations13(
  sectionTranslations,
  ({ one }) => ({
    section: one(courseSections, {
      fields: [sectionTranslations.sectionId],
      references: [courseSections.id]
    })
  })
);

// src/schema/course-sections.ts
var courseSections = pgTable14(
  "course_sections",
  {
    id: uuid14("id").primaryKey().defaultRandom(),
    courseId: uuid14("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    sectionKey: text12("section_key").notNull(),
    title: text12("title").notNull(),
    orderIndex: integer7("order_index").notNull(),
    iconName: text12("icon_name"),
    isPublished: boolean5("is_published").default(false).notNull(),
    createdAt: timestamp14("created_at").defaultNow().notNull(),
    updatedAt: timestamp14("updated_at").defaultNow().notNull()
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
var courseSectionsRelations = relations14(
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
var courses = pgTable15("courses", {
  id: uuid15("id").primaryKey().defaultRandom(),
  slug: text13("slug").notNull().unique(),
  courseKey: text13("course_key").unique(),
  title: text13("title").notNull(),
  description: text13("description"),
  version: text13("version").default("1.0").notNull(),
  isPublished: boolean6("is_published").default(false).notNull(),
  createdAt: timestamp15("created_at").defaultNow().notNull(),
  updatedAt: timestamp15("updated_at").defaultNow().notNull()
});
var coursesRelations = relations15(courses, ({ many }) => ({
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
  courseSections: many(courseSections),
  courseTranslations: many(courseTranslations),
  userProgress: many(userProgress)
}));

// src/schema/admin-roles.ts
import { pgTable as pgTable16, uuid as uuid16, timestamp as timestamp16, pgEnum as pgEnum10 } from "drizzle-orm/pg-core";
import { relations as relations16 } from "drizzle-orm";
var adminRoleEnum = pgEnum10("admin_role", [
  "hr_admin",
  "dev_admin",
  "plant_manager"
]);
var adminRoles = pgTable16("admin_roles", {
  id: uuid16("id").primaryKey().defaultRandom(),
  userId: uuid16("user_id").notNull().references(() => profiles.id),
  role: adminRoleEnum("role").notNull(),
  plantId: uuid16("plant_id").references(() => plants.id),
  createdAt: timestamp16("created_at").defaultNow().notNull(),
  updatedAt: timestamp16("updated_at").defaultNow().notNull()
});
var adminRolesRelations = relations16(adminRoles, ({ one }) => ({
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
var plants = pgTable17("plants", {
  id: uuid17("id").primaryKey().defaultRandom(),
  name: text14("name").notNull().unique(),
  isActive: boolean7("is_active").default(true).notNull(),
  createdAt: timestamp17("created_at").defaultNow().notNull(),
  updatedAt: timestamp17("updated_at").defaultNow().notNull()
});
var plantsRelations = relations17(plants, ({ many }) => ({
  profiles: many(profiles),
  courses: many(courses),
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
  adminRoles: many(adminRoles)
}));

// src/schema/profiles.ts
var userStatusEnum = pgEnum11("user_status", [
  "active",
  "inactive",
  "suspended"
]);
var profiles = pgTable18("profiles", {
  id: uuid18("id").primaryKey(),
  // References auth.users.id
  plantId: uuid18("plant_id").notNull().references(() => plants.id),
  firstName: text15("first_name").notNull(),
  lastName: text15("last_name").notNull(),
  email: text15("email").notNull(),
  jobTitle: text15("job_title"),
  status: userStatusEnum("status").default("active").notNull(),
  createdAt: timestamp18("created_at").defaultNow().notNull(),
  updatedAt: timestamp18("updated_at").defaultNow().notNull()
});
var profilesRelations = relations18(profiles, ({ one }) => ({
  plant: one(plants, {
    fields: [profiles.plantId],
    references: [plants.id]
  })
}));

// src/schema/audit-log.ts
import { pgTable as pgTable19, uuid as uuid19, text as text16, timestamp as timestamp19, jsonb as jsonb9 } from "drizzle-orm/pg-core";
import { relations as relations19 } from "drizzle-orm";
var auditLog = pgTable19("audit_log", {
  id: uuid19("id").primaryKey().defaultRandom(),
  tableName: text16("table_name").notNull(),
  operation: text16("operation").notNull(),
  oldData: jsonb9("old_data"),
  newData: jsonb9("new_data"),
  userId: uuid19("user_id").references(() => profiles.id),
  occurredAt: timestamp19("occurred_at").defaultNow().notNull()
});
var auditLogRelations = relations19(auditLog, ({ one }) => ({
  user: one(profiles, {
    fields: [auditLog.userId],
    references: [profiles.id]
  })
}));

// src/schema/territories.ts
import {
  pgTable as pgTable20,
  uuid as uuid20,
  text as text17,
  timestamp as timestamp20,
  boolean as boolean8,
  index
} from "drizzle-orm/pg-core";
var territories = pgTable20(
  "territories",
  {
    id: uuid20("id").primaryKey().defaultRandom(),
    name: text17("name").notNull().unique(),
    code: text17("code").notNull().unique(),
    // e.g., "NORTH", "SOUTH", "EAST", "WEST"
    description: text17("description"),
    region: text17("region"),
    // e.g., "North America", "Europe", "Asia-Pacific"
    isActive: boolean8("is_active").default(true).notNull(),
    createdAt: timestamp20("created_at").defaultNow().notNull(),
    updatedAt: timestamp20("updated_at").defaultNow().notNull()
  },
  (table) => ({
    nameIdx: index("territories_name_idx").on(table.name),
    codeIdx: index("territories_code_idx").on(table.code),
    regionIdx: index("territories_region_idx").on(table.region),
    activeIdx: index("territories_active_idx").on(table.isActive)
  })
);

// src/schema/user-profiles.ts
import {
  pgTable as pgTable21,
  uuid as uuid21,
  text as text18,
  timestamp as timestamp21,
  boolean as boolean9,
  pgEnum as pgEnum12,
  index as index2
} from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum12("user_role", [
  "safety_admin",
  "safety_manager",
  "safety_coordinator",
  "safety_instructor",
  "safety_rep",
  "plant_manager",
  "hr_admin",
  "employee"
]);
var userProfiles = pgTable21(
  "user_profiles",
  {
    id: uuid21("id").primaryKey(),
    // References auth.users.id
    authUserId: uuid21("auth_user_id").notNull().unique(),
    // Direct reference to auth.users.id
    territoryId: uuid21("territory_id").notNull().references(() => territories.id),
    firstName: text18("first_name").notNull(),
    lastName: text18("last_name").notNull(),
    email: text18("email").notNull().unique(),
    phone: text18("phone"),
    jobTitle: text18("job_title"),
    department: text18("department"),
    role: userRoleEnum("role").default("employee").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    isActive: boolean9("is_active").default(true).notNull(),
    lastLoginAt: timestamp21("last_login_at"),
    createdAt: timestamp21("created_at").defaultNow().notNull(),
    updatedAt: timestamp21("updated_at").defaultNow().notNull(),
    createdBy: uuid21("created_by")
    // References another user_profiles.id
  },
  (table) => ({
    authUserIdIdx: index2("user_profiles_auth_user_id_idx").on(table.authUserId),
    territoryIdIdx: index2("user_profiles_territory_id_idx").on(
      table.territoryId
    ),
    emailIdx: index2("user_profiles_email_idx").on(table.email),
    roleIdx: index2("user_profiles_role_idx").on(table.role),
    statusIdx: index2("user_profiles_status_idx").on(table.status),
    activeIdx: index2("user_profiles_active_idx").on(table.isActive)
  })
);

// src/schema/accounts.ts
import {
  pgTable as pgTable22,
  uuid as uuid22,
  text as text19,
  timestamp as timestamp22,
  boolean as boolean10,
  pgEnum as pgEnum13,
  index as index3,
  decimal
} from "drizzle-orm/pg-core";
var accountTypeEnum = pgEnum13("account_type", [
  "safety_equipment_customer",
  "training_client",
  "consulting_client",
  "maintenance_client",
  "partner",
  "vendor"
]);
var accountStatusEnum = pgEnum13("account_status", [
  "active",
  "inactive",
  "suspended",
  "closed"
]);
var industryEnum = pgEnum13("industry", [
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
var accounts = pgTable22(
  "accounts",
  {
    id: uuid22("id").primaryKey().defaultRandom(),
    territoryId: uuid22("territory_id").notNull().references(() => territories.id),
    ownerId: uuid22("owner_id").notNull().references(() => userProfiles.id),
    name: text19("name").notNull(),
    accountNumber: text19("account_number").unique(),
    type: accountTypeEnum("type").default("safety_equipment_customer").notNull(),
    status: accountStatusEnum("status").default("active").notNull(),
    industry: industryEnum("industry"),
    website: text19("website"),
    phone: text19("phone"),
    email: text19("email"),
    description: text19("description"),
    annualRevenue: decimal("annual_revenue", { precision: 15, scale: 2 }),
    employeeCount: text19("employee_count"),
    // e.g., "1-10", "11-50", "51-200", "201-500", "500+"
    safetyComplianceLevel: text19("safety_compliance_level"),
    // e.g., "OSHA Compliant", "ISO 45001", "Custom"
    billingAddress: text19("billing_address"),
    shippingAddress: text19("shipping_address"),
    isActive: boolean10("is_active").default(true).notNull(),
    createdAt: timestamp22("created_at").defaultNow().notNull(),
    updatedAt: timestamp22("updated_at").defaultNow().notNull(),
    createdBy: uuid22("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    territoryIdIdx: index3("accounts_territory_id_idx").on(table.territoryId),
    ownerIdIdx: index3("accounts_owner_id_idx").on(table.ownerId),
    nameIdx: index3("accounts_name_idx").on(table.name),
    accountNumberIdx: index3("accounts_account_number_idx").on(
      table.accountNumber
    ),
    typeIdx: index3("accounts_type_idx").on(table.type),
    statusIdx: index3("accounts_status_idx").on(table.status),
    industryIdx: index3("accounts_industry_idx").on(table.industry),
    activeIdx: index3("accounts_active_idx").on(table.isActive)
  })
);

// src/schema/branches.ts
import {
  pgTable as pgTable23,
  uuid as uuid23,
  text as text20,
  timestamp as timestamp23,
  boolean as boolean11,
  index as index4
} from "drizzle-orm/pg-core";
var branches = pgTable23(
  "branches",
  {
    id: uuid23("id").primaryKey().defaultRandom(),
    accountId: uuid23("account_id").notNull().references(() => accounts.id),
    name: text20("name").notNull(),
    branchCode: text20("branch_code"),
    // Internal code for the branch
    address: text20("address").notNull(),
    city: text20("city").notNull(),
    state: text20("state").notNull(),
    postalCode: text20("postal_code").notNull(),
    country: text20("country").default("US").notNull(),
    phone: text20("phone"),
    email: text20("email"),
    contactPerson: text20("contact_person"),
    safetyManager: text20("safety_manager"),
    // Primary safety contact
    isPrimary: boolean11("is_primary").default(false).notNull(),
    // Primary branch for the account
    isActive: boolean11("is_active").default(true).notNull(),
    createdAt: timestamp23("created_at").defaultNow().notNull(),
    updatedAt: timestamp23("updated_at").defaultNow().notNull()
  },
  (table) => ({
    accountIdIdx: index4("branches_account_id_idx").on(table.accountId),
    nameIdx: index4("branches_name_idx").on(table.name),
    branchCodeIdx: index4("branches_branch_code_idx").on(table.branchCode),
    cityIdx: index4("branches_city_idx").on(table.city),
    stateIdx: index4("branches_state_idx").on(table.state),
    primaryIdx: index4("branches_primary_idx").on(table.isPrimary),
    activeIdx: index4("branches_active_idx").on(table.isActive)
  })
);

// src/schema/contacts.ts
import {
  pgTable as pgTable24,
  uuid as uuid24,
  text as text21,
  timestamp as timestamp24,
  boolean as boolean12,
  pgEnum as pgEnum14,
  index as index5
} from "drizzle-orm/pg-core";
var contactRoleEnum = pgEnum14("contact_role", [
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
var contactStatusEnum = pgEnum14("contact_status", [
  "active",
  "inactive",
  "do_not_contact"
]);
var contacts = pgTable24(
  "contacts",
  {
    id: uuid24("id").primaryKey().defaultRandom(),
    accountId: uuid24("account_id").notNull().references(() => accounts.id),
    branchId: uuid24("branch_id").references(() => branches.id),
    // Optional - may not be assigned to specific branch
    ownerId: uuid24("owner_id").notNull().references(() => userProfiles.id),
    firstName: text21("first_name").notNull(),
    lastName: text21("last_name").notNull(),
    email: text21("email").notNull(),
    phone: text21("phone"),
    mobile: text21("mobile"),
    jobTitle: text21("job_title"),
    department: text21("department"),
    role: contactRoleEnum("role").default("user").notNull(),
    status: contactStatusEnum("status").default("active").notNull(),
    isPrimary: boolean12("is_primary").default(false).notNull(),
    // Primary contact for the account
    safetyCertifications: text21("safety_certifications"),
    // e.g., "OSHA 30", "CSP", "ASP"
    notes: text21("notes"),
    isActive: boolean12("is_active").default(true).notNull(),
    createdAt: timestamp24("created_at").defaultNow().notNull(),
    updatedAt: timestamp24("updated_at").defaultNow().notNull(),
    createdBy: uuid24("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    accountIdIdx: index5("contacts_account_id_idx").on(table.accountId),
    branchIdIdx: index5("contacts_branch_id_idx").on(table.branchId),
    ownerIdIdx: index5("contacts_owner_id_idx").on(table.ownerId),
    emailIdx: index5("contacts_email_idx").on(table.email),
    nameIdx: index5("contacts_name_idx").on(table.firstName, table.lastName),
    roleIdx: index5("contacts_role_idx").on(table.role),
    statusIdx: index5("contacts_status_idx").on(table.status),
    primaryIdx: index5("contacts_primary_idx").on(table.isPrimary),
    activeIdx: index5("contacts_active_idx").on(table.isActive)
  })
);

// src/schema/activity-logs.ts
import {
  pgTable as pgTable25,
  uuid as uuid25,
  text as text22,
  timestamp as timestamp25,
  boolean as boolean13,
  pgEnum as pgEnum15,
  index as index6
} from "drizzle-orm/pg-core";
var activityTypeEnum = pgEnum15("activity_type", [
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
var activityStatusEnum = pgEnum15("activity_status", [
  "completed",
  "pending",
  "cancelled",
  "rescheduled"
]);
var activityPriorityEnum = pgEnum15("activity_priority", [
  "low",
  "medium",
  "high",
  "urgent"
]);
var activityLogs = pgTable25(
  "activity_logs",
  {
    id: uuid25("id").primaryKey().defaultRandom(),
    accountId: uuid25("account_id").references(() => accounts.id),
    // Optional - some activities may not be account-specific
    contactId: uuid25("contact_id").references(() => contacts.id),
    // Optional - some activities may not be contact-specific
    userId: uuid25("user_id").notNull().references(() => userProfiles.id),
    type: activityTypeEnum("type").notNull(),
    subject: text22("subject").notNull(),
    description: text22("description"),
    status: activityStatusEnum("status").default("completed").notNull(),
    priority: activityPriorityEnum("priority").default("medium").notNull(),
    scheduledAt: timestamp25("scheduled_at"),
    // For future activities
    completedAt: timestamp25("completed_at"),
    // When the activity was completed
    duration: text22("duration"),
    // e.g., "30 minutes", "1 hour"
    outcome: text22("outcome"),
    // Result of the activity
    nextSteps: text22("next_steps"),
    // Follow-up actions
    safetyNotes: text22("safety_notes"),
    // Safety-specific observations
    isActive: boolean13("is_active").default(true).notNull(),
    createdAt: timestamp25("created_at").defaultNow().notNull(),
    updatedAt: timestamp25("updated_at").defaultNow().notNull()
  },
  (table) => ({
    accountIdIdx: index6("activity_logs_account_id_idx").on(table.accountId),
    contactIdIdx: index6("activity_logs_contact_id_idx").on(table.contactId),
    userIdIdx: index6("activity_logs_user_id_idx").on(table.userId),
    typeIdx: index6("activity_logs_type_idx").on(table.type),
    statusIdx: index6("activity_logs_status_idx").on(table.status),
    priorityIdx: index6("activity_logs_priority_idx").on(table.priority),
    scheduledAtIdx: index6("activity_logs_scheduled_at_idx").on(
      table.scheduledAt
    ),
    completedAtIdx: index6("activity_logs_completed_at_idx").on(
      table.completedAt
    ),
    activeIdx: index6("activity_logs_active_idx").on(table.isActive)
  })
);

// src/schema/opportunities.ts
import {
  pgTable as pgTable26,
  uuid as uuid26,
  text as text23,
  timestamp as timestamp26,
  boolean as boolean14,
  pgEnum as pgEnum16,
  index as index7,
  decimal as decimal2
} from "drizzle-orm/pg-core";
var opportunityStageEnum = pgEnum16("opportunity_stage", [
  "prospecting",
  "qualification",
  "needs_analysis",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost"
]);
var opportunityStatusEnum = pgEnum16("opportunity_status", [
  "open",
  "closed",
  "cancelled"
]);
var opportunitySourceEnum = pgEnum16("opportunity_source", [
  "inbound",
  "outbound",
  "referral",
  "website",
  "trade_show",
  "safety_conference",
  "cold_call",
  "other"
]);
var opportunityTypeEnum = pgEnum16("opportunity_type", [
  "safety_equipment",
  "safety_training",
  "safety_consulting",
  "safety_audit",
  "compliance_services",
  "maintenance_contract",
  "other"
]);
var probabilityEnum = pgEnum16("probability", [
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
var opportunities = pgTable26(
  "opportunities",
  {
    id: uuid26("id").primaryKey().defaultRandom(),
    accountId: uuid26("account_id").notNull().references(() => accounts.id),
    contactId: uuid26("contact_id").references(() => contacts.id),
    // Primary contact for this opportunity
    ownerId: uuid26("owner_id").notNull().references(() => userProfiles.id),
    name: text23("name").notNull(),
    description: text23("description"),
    type: opportunityTypeEnum("type").notNull(),
    stage: opportunityStageEnum("stage").default("prospecting").notNull(),
    status: opportunityStatusEnum("status").default("open").notNull(),
    source: opportunitySourceEnum("source"),
    probability: probabilityEnum("probability").default("10").notNull(),
    amount: decimal2("amount", { precision: 15, scale: 2 }),
    // Expected deal value
    closeDate: timestamp26("close_date"),
    // Expected close date
    actualCloseDate: timestamp26("actual_close_date"),
    // Actual close date
    lostReason: text23("lost_reason"),
    // Reason if opportunity was lost
    nextSteps: text23("next_steps"),
    // Next actions
    safetyRequirements: text23("safety_requirements"),
    // Specific safety needs
    complianceNotes: text23("compliance_notes"),
    // Compliance-related notes
    notes: text23("notes"),
    isActive: boolean14("is_active").default(true).notNull(),
    createdAt: timestamp26("created_at").defaultNow().notNull(),
    updatedAt: timestamp26("updated_at").defaultNow().notNull(),
    createdBy: uuid26("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    accountIdIdx: index7("opportunities_account_id_idx").on(table.accountId),
    contactIdIdx: index7("opportunities_contact_id_idx").on(table.contactId),
    ownerIdIdx: index7("opportunities_owner_id_idx").on(table.ownerId),
    nameIdx: index7("opportunities_name_idx").on(table.name),
    typeIdx: index7("opportunities_type_idx").on(table.type),
    stageIdx: index7("opportunities_stage_idx").on(table.stage),
    statusIdx: index7("opportunities_status_idx").on(table.status),
    sourceIdx: index7("opportunities_source_idx").on(table.source),
    probabilityIdx: index7("opportunities_probability_idx").on(
      table.probability
    ),
    closeDateIdx: index7("opportunities_close_date_idx").on(table.closeDate),
    activeIdx: index7("opportunities_active_idx").on(table.isActive)
  })
);

// src/schema/sales-facts.ts
import {
  pgTable as pgTable27,
  uuid as uuid27,
  text as text24,
  timestamp as timestamp27,
  boolean as boolean15,
  pgEnum as pgEnum17,
  index as index8,
  decimal as decimal3,
  integer as integer8
} from "drizzle-orm/pg-core";
var salesFactTypeEnum = pgEnum17("sales_fact_type", [
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
var periodTypeEnum = pgEnum17("period_type", [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly"
]);
var salesFacts = pgTable27(
  "sales_facts",
  {
    id: uuid27("id").primaryKey().defaultRandom(),
    accountId: uuid27("account_id").notNull().references(() => accounts.id),
    opportunityId: uuid27("opportunity_id").references(() => opportunities.id),
    // Optional - may not be tied to specific opportunity
    userId: uuid27("user_id").notNull().references(() => userProfiles.id),
    factType: salesFactTypeEnum("fact_type").notNull(),
    periodType: periodTypeEnum("period_type").notNull(),
    periodStart: timestamp27("period_start").notNull(),
    periodEnd: timestamp27("period_end").notNull(),
    amount: decimal3("amount", { precision: 15, scale: 2 }).notNull(),
    quantity: integer8("quantity"),
    // Number of units, sessions, hours, etc.
    currency: text24("currency").default("USD").notNull(),
    description: text24("description"),
    safetyCategory: text24("safety_category"),
    // e.g., "PPE", "Training", "Consulting"
    complianceStandard: text24("compliance_standard"),
    // e.g., "OSHA", "ISO 45001", "ANSI"
    isActive: boolean15("is_active").default(true).notNull(),
    createdAt: timestamp27("created_at").defaultNow().notNull(),
    updatedAt: timestamp27("updated_at").defaultNow().notNull()
  },
  (table) => ({
    accountIdIdx: index8("sales_facts_account_id_idx").on(table.accountId),
    opportunityIdIdx: index8("sales_facts_opportunity_id_idx").on(
      table.opportunityId
    ),
    userIdIdx: index8("sales_facts_user_id_idx").on(table.userId),
    factTypeIdx: index8("sales_facts_fact_type_idx").on(table.factType),
    periodTypeIdx: index8("sales_facts_period_type_idx").on(table.periodType),
    periodStartIdx: index8("sales_facts_period_start_idx").on(table.periodStart),
    periodEndIdx: index8("sales_facts_period_end_idx").on(table.periodEnd),
    safetyCategoryIdx: index8("sales_facts_safety_category_idx").on(
      table.safetyCategory
    ),
    activeIdx: index8("sales_facts_active_idx").on(table.isActive)
  })
);

// src/schema/products.ts
import {
  pgTable as pgTable28,
  uuid as uuid28,
  text as text25,
  timestamp as timestamp28,
  boolean as boolean16,
  pgEnum as pgEnum18,
  index as index9,
  decimal as decimal4
} from "drizzle-orm/pg-core";
var productTypeEnum = pgEnum18("product_type", [
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
var productStatusEnum = pgEnum18("product_status", [
  "active",
  "inactive",
  "discontinued",
  "coming_soon"
]);
var complianceStandardEnum = pgEnum18("compliance_standard", [
  "osha",
  "ansi",
  "niosh",
  "iso_45001",
  "iso_14001",
  "custom",
  "other"
]);
var products = pgTable28(
  "products",
  {
    id: uuid28("id").primaryKey().defaultRandom(),
    territoryId: uuid28("territory_id").notNull().references(() => territories.id),
    sku: text25("sku").notNull().unique(),
    // Stock Keeping Unit
    name: text25("name").notNull(),
    description: text25("description"),
    type: productTypeEnum("type").notNull(),
    status: productStatusEnum("status").default("active").notNull(),
    category: text25("category"),
    // e.g., "Head Protection", "Fall Protection", "Online Training"
    subcategory: text25("subcategory"),
    // e.g., "Hard Hats", "Safety Harnesses", "OSHA 10-Hour"
    unitPrice: decimal4("unit_price", { precision: 10, scale: 2 }),
    currency: text25("currency").default("USD").notNull(),
    unitOfMeasure: text25("unit_of_measure"),
    // e.g., "each", "hour", "license", "course"
    weight: decimal4("weight", { precision: 8, scale: 2 }),
    // in pounds
    dimensions: text25("dimensions"),
    // e.g., "12x8x4 inches"
    manufacturer: text25("manufacturer"),
    model: text25("model"),
    complianceStandards: text25("compliance_standards"),
    // JSON array of compliance standards
    safetyFeatures: text25("safety_features"),
    // Key safety features
    specifications: text25("specifications"),
    // JSON string or detailed specs
    isActive: boolean16("is_active").default(true).notNull(),
    createdAt: timestamp28("created_at").defaultNow().notNull(),
    updatedAt: timestamp28("updated_at").defaultNow().notNull()
  },
  (table) => ({
    territoryIdIdx: index9("products_territory_id_idx").on(table.territoryId),
    skuIdx: index9("products_sku_idx").on(table.sku),
    nameIdx: index9("products_name_idx").on(table.name),
    typeIdx: index9("products_type_idx").on(table.type),
    statusIdx: index9("products_status_idx").on(table.status),
    categoryIdx: index9("products_category_idx").on(table.category),
    subcategoryIdx: index9("products_subcategory_idx").on(table.subcategory),
    activeIdx: index9("products_active_idx").on(table.isActive)
  })
);

// src/schema/projects.ts
import {
  pgTable as pgTable29,
  uuid as uuid29,
  text as text26,
  timestamp as timestamp29,
  boolean as boolean17,
  pgEnum as pgEnum19,
  index as index10,
  decimal as decimal5
} from "drizzle-orm/pg-core";
var projectTypeEnum = pgEnum19("project_type", [
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
var projectStatusEnum = pgEnum19("project_status", [
  "planning",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled"
]);
var projectPriorityEnum = pgEnum19("project_priority", [
  "low",
  "medium",
  "high",
  "urgent"
]);
var projects = pgTable29(
  "projects",
  {
    id: uuid29("id").primaryKey().defaultRandom(),
    accountId: uuid29("account_id").notNull().references(() => accounts.id),
    ownerId: uuid29("owner_id").notNull().references(() => userProfiles.id),
    name: text26("name").notNull(),
    description: text26("description"),
    type: projectTypeEnum("type").notNull(),
    status: projectStatusEnum("status").default("planning").notNull(),
    priority: projectPriorityEnum("priority").default("medium").notNull(),
    startDate: timestamp29("start_date"),
    endDate: timestamp29("end_date"),
    actualStartDate: timestamp29("actual_start_date"),
    actualEndDate: timestamp29("actual_end_date"),
    budget: decimal5("budget", { precision: 15, scale: 2 }),
    actualCost: decimal5("actual_cost", { precision: 15, scale: 2 }),
    currency: text26("currency").default("USD").notNull(),
    location: text26("location"),
    // Project site location
    safetyRequirements: text26("safety_requirements"),
    // Specific safety requirements
    complianceStandards: text26("compliance_standards"),
    // Applicable compliance standards
    deliverables: text26("deliverables"),
    // Project deliverables
    notes: text26("notes"),
    isActive: boolean17("is_active").default(true).notNull(),
    createdAt: timestamp29("created_at").defaultNow().notNull(),
    updatedAt: timestamp29("updated_at").defaultNow().notNull(),
    createdBy: uuid29("created_by").notNull().references(() => userProfiles.id)
  },
  (table) => ({
    accountIdIdx: index10("projects_account_id_idx").on(table.accountId),
    ownerIdIdx: index10("projects_owner_id_idx").on(table.ownerId),
    nameIdx: index10("projects_name_idx").on(table.name),
    typeIdx: index10("projects_type_idx").on(table.type),
    statusIdx: index10("projects_status_idx").on(table.status),
    priorityIdx: index10("projects_priority_idx").on(table.priority),
    startDateIdx: index10("projects_start_date_idx").on(table.startDate),
    endDateIdx: index10("projects_end_date_idx").on(table.endDate),
    activeIdx: index10("projects_active_idx").on(table.isActive)
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
export {
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
};
//# sourceMappingURL=index.js.map
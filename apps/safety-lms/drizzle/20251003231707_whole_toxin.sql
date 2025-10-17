CREATE TYPE "public"."account_status" AS ENUM('active', 'inactive', 'suspended', 'closed');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('safety_equipment_customer', 'training_client', 'consulting_client', 'maintenance_client', 'partner', 'vendor');--> statement-breakpoint
CREATE TYPE "public"."industry" AS ENUM('manufacturing', 'construction', 'oil_gas', 'chemical', 'mining', 'utilities', 'transportation', 'healthcare', 'agriculture', 'other');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('view_section', 'start_course', 'complete_course');--> statement-breakpoint
CREATE TYPE "public"."activity_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."activity_status" AS ENUM('completed', 'pending', 'cancelled', 'rescheduled');--> statement-breakpoint
CREATE TYPE "public"."activity_type" AS ENUM('safety_consultation', 'equipment_demo', 'training_session', 'safety_audit', 'compliance_review', 'incident_follow_up', 'proposal_presentation', 'follow_up_call', 'site_visit', 'note', 'task', 'other');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('hr_admin', 'dev_admin', 'plant_manager');--> statement-breakpoint
CREATE TYPE "public"."contact_role" AS ENUM('safety_manager', 'safety_coordinator', 'safety_instructor', 'hr_manager', 'plant_manager', 'purchasing_manager', 'decision_maker', 'influencer', 'user', 'other');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('active', 'inactive', 'do_not_contact');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('enrolled', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('safety_admin', 'safety_manager', 'safety_coordinator', 'safety_instructor', 'safety_rep', 'plant_manager', 'hr_admin', 'employee');--> statement-breakpoint
CREATE TYPE "public"."opportunity_source" AS ENUM('inbound', 'outbound', 'referral', 'website', 'trade_show', 'safety_conference', 'cold_call', 'other');--> statement-breakpoint
CREATE TYPE "public"."opportunity_stage" AS ENUM('prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'closed_won', 'closed_lost');--> statement-breakpoint
CREATE TYPE "public"."opportunity_status" AS ENUM('open', 'closed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."opportunity_type" AS ENUM('safety_equipment', 'safety_training', 'safety_consulting', 'safety_audit', 'compliance_services', 'maintenance_contract', 'other');--> statement-breakpoint
CREATE TYPE "public"."probability" AS ENUM('10', '20', '30', '40', '50', '60', '70', '80', '90', '100');--> statement-breakpoint
CREATE TYPE "public"."period_type" AS ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."sales_fact_type" AS ENUM('safety_equipment_revenue', 'training_revenue', 'consulting_revenue', 'maintenance_revenue', 'equipment_units_sold', 'training_sessions_delivered', 'consulting_hours', 'contract_value', 'renewal', 'upsell', 'cross_sell');--> statement-breakpoint
CREATE TYPE "public"."compliance_standard" AS ENUM('osha', 'ansi', 'niosh', 'iso_45001', 'iso_14001', 'custom', 'other');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive', 'discontinued', 'coming_soon');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('safety_equipment', 'ppe', 'safety_training', 'safety_consulting', 'safety_software', 'safety_services', 'maintenance_services', 'other');--> statement-breakpoint
CREATE TYPE "public"."project_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('safety_audit', 'safety_consulting', 'safety_training', 'safety_equipment_installation', 'compliance_assessment', 'safety_system_implementation', 'incident_investigation', 'safety_program_development', 'other');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"territory_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"account_number" text,
	"type" "account_type" DEFAULT 'safety_equipment_customer' NOT NULL,
	"status" "account_status" DEFAULT 'active' NOT NULL,
	"industry" "industry",
	"website" text,
	"phone" text,
	"email" text,
	"description" text,
	"annual_revenue" numeric(15, 2),
	"employee_count" text,
	"safety_compliance_level" text,
	"billing_address" text,
	"shipping_address" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	CONSTRAINT "accounts_account_number_unique" UNIQUE("account_number")
);
--> statement-breakpoint
CREATE TABLE "activity_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"event_type" "event_type" NOT NULL,
	"meta" jsonb,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"contact_id" uuid,
	"user_id" uuid NOT NULL,
	"type" "activity_type" NOT NULL,
	"subject" text NOT NULL,
	"description" text,
	"status" "activity_status" DEFAULT 'completed' NOT NULL,
	"priority" "activity_priority" DEFAULT 'medium' NOT NULL,
	"scheduled_at" timestamp,
	"completed_at" timestamp,
	"duration" text,
	"outcome" text,
	"next_steps" text,
	"safety_notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "admin_role" NOT NULL,
	"plant_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_name" text NOT NULL,
	"operation" text NOT NULL,
	"old_data" jsonb,
	"new_data" jsonb,
	"user_id" uuid,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"name" text NOT NULL,
	"branch_code" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text DEFAULT 'US' NOT NULL,
	"phone" text,
	"email" text,
	"contact_person" text,
	"safety_manager" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"branch_id" uuid,
	"owner_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"mobile" text,
	"job_title" text,
	"department" text,
	"role" "contact_role" DEFAULT 'user' NOT NULL,
	"status" "contact_status" DEFAULT 'active' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"safety_certifications" text,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"version" text DEFAULT '1.0' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"status" "enrollment_status" DEFAULT 'enrolled' NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"plant_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"job_title" text,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plants_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"current_section" text,
	"last_active_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"section_key" text NOT NULL,
	"question_key" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"attempt_index" integer DEFAULT 1 NOT NULL,
	"response_meta" jsonb,
	"answered_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "territories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"region" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "territories_name_unique" UNIQUE("name"),
	CONSTRAINT "territories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"territory_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"job_title" text,
	"department" text,
	"role" "user_role" DEFAULT 'employee' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "user_profiles_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "user_profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"contact_id" uuid,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "opportunity_type" NOT NULL,
	"stage" "opportunity_stage" DEFAULT 'prospecting' NOT NULL,
	"status" "opportunity_status" DEFAULT 'open' NOT NULL,
	"source" "opportunity_source",
	"probability" "probability" DEFAULT '10' NOT NULL,
	"amount" numeric(15, 2),
	"close_date" timestamp,
	"actual_close_date" timestamp,
	"lost_reason" text,
	"next_steps" text,
	"safety_requirements" text,
	"compliance_notes" text,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"opportunity_id" uuid,
	"user_id" uuid NOT NULL,
	"fact_type" "sales_fact_type" NOT NULL,
	"period_type" "period_type" NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"quantity" integer,
	"currency" text DEFAULT 'USD' NOT NULL,
	"description" text,
	"safety_category" text,
	"compliance_standard" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"territory_id" uuid NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "product_type" NOT NULL,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"category" text,
	"subcategory" text,
	"unit_price" numeric(10, 2),
	"currency" text DEFAULT 'USD' NOT NULL,
	"unit_of_measure" text,
	"weight" numeric(8, 2),
	"dimensions" text,
	"manufacturer" text,
	"model" text,
	"compliance_standards" text,
	"safety_features" text,
	"specifications" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "project_type" NOT NULL,
	"status" "project_status" DEFAULT 'planning' NOT NULL,
	"priority" "project_priority" DEFAULT 'medium' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"actual_start_date" timestamp,
	"actual_end_date" timestamp,
	"budget" numeric(15, 2),
	"actual_cost" numeric(15, 2),
	"currency" text DEFAULT 'USD' NOT NULL,
	"location" text,
	"safety_requirements" text,
	"compliance_standards" text,
	"deliverables" text,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_territory_id_territories_id_fk" FOREIGN KEY ("territory_id") REFERENCES "public"."territories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_owner_id_user_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_created_by_user_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_user_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_user_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_created_by_user_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_events" ADD CONSTRAINT "question_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_events" ADD CONSTRAINT "question_events_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_events" ADD CONSTRAINT "question_events_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_territory_id_territories_id_fk" FOREIGN KEY ("territory_id") REFERENCES "public"."territories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_owner_id_user_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_created_by_user_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_facts" ADD CONSTRAINT "sales_facts_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_facts" ADD CONSTRAINT "sales_facts_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_facts" ADD CONSTRAINT "sales_facts_user_id_user_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_territory_id_territories_id_fk" FOREIGN KEY ("territory_id") REFERENCES "public"."territories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_user_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_user_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_territory_id_idx" ON "accounts" USING btree ("territory_id");--> statement-breakpoint
CREATE INDEX "accounts_owner_id_idx" ON "accounts" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "accounts_name_idx" ON "accounts" USING btree ("name");--> statement-breakpoint
CREATE INDEX "accounts_account_number_idx" ON "accounts" USING btree ("account_number");--> statement-breakpoint
CREATE INDEX "accounts_type_idx" ON "accounts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "accounts_status_idx" ON "accounts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "accounts_industry_idx" ON "accounts" USING btree ("industry");--> statement-breakpoint
CREATE INDEX "accounts_active_idx" ON "accounts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "activity_logs_account_id_idx" ON "activity_logs" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "activity_logs_contact_id_idx" ON "activity_logs" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "activity_logs_type_idx" ON "activity_logs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "activity_logs_status_idx" ON "activity_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "activity_logs_priority_idx" ON "activity_logs" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "activity_logs_scheduled_at_idx" ON "activity_logs" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "activity_logs_completed_at_idx" ON "activity_logs" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "activity_logs_active_idx" ON "activity_logs" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "branches_account_id_idx" ON "branches" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "branches_name_idx" ON "branches" USING btree ("name");--> statement-breakpoint
CREATE INDEX "branches_branch_code_idx" ON "branches" USING btree ("branch_code");--> statement-breakpoint
CREATE INDEX "branches_city_idx" ON "branches" USING btree ("city");--> statement-breakpoint
CREATE INDEX "branches_state_idx" ON "branches" USING btree ("state");--> statement-breakpoint
CREATE INDEX "branches_primary_idx" ON "branches" USING btree ("is_primary");--> statement-breakpoint
CREATE INDEX "branches_active_idx" ON "branches" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "contacts_account_id_idx" ON "contacts" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "contacts_branch_id_idx" ON "contacts" USING btree ("branch_id");--> statement-breakpoint
CREATE INDEX "contacts_owner_id_idx" ON "contacts" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "contacts_email_idx" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contacts_name_idx" ON "contacts" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX "contacts_role_idx" ON "contacts" USING btree ("role");--> statement-breakpoint
CREATE INDEX "contacts_status_idx" ON "contacts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contacts_primary_idx" ON "contacts" USING btree ("is_primary");--> statement-breakpoint
CREATE INDEX "contacts_active_idx" ON "contacts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "territories_name_idx" ON "territories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "territories_code_idx" ON "territories" USING btree ("code");--> statement-breakpoint
CREATE INDEX "territories_region_idx" ON "territories" USING btree ("region");--> statement-breakpoint
CREATE INDEX "territories_active_idx" ON "territories" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "user_profiles_auth_user_id_idx" ON "user_profiles" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "user_profiles_territory_id_idx" ON "user_profiles" USING btree ("territory_id");--> statement-breakpoint
CREATE INDEX "user_profiles_email_idx" ON "user_profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_profiles_role_idx" ON "user_profiles" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_profiles_status_idx" ON "user_profiles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_profiles_active_idx" ON "user_profiles" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "opportunities_account_id_idx" ON "opportunities" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "opportunities_contact_id_idx" ON "opportunities" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "opportunities_owner_id_idx" ON "opportunities" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "opportunities_name_idx" ON "opportunities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "opportunities_type_idx" ON "opportunities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "opportunities_stage_idx" ON "opportunities" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "opportunities_status_idx" ON "opportunities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "opportunities_source_idx" ON "opportunities" USING btree ("source");--> statement-breakpoint
CREATE INDEX "opportunities_probability_idx" ON "opportunities" USING btree ("probability");--> statement-breakpoint
CREATE INDEX "opportunities_close_date_idx" ON "opportunities" USING btree ("close_date");--> statement-breakpoint
CREATE INDEX "opportunities_active_idx" ON "opportunities" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "sales_facts_account_id_idx" ON "sales_facts" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "sales_facts_opportunity_id_idx" ON "sales_facts" USING btree ("opportunity_id");--> statement-breakpoint
CREATE INDEX "sales_facts_user_id_idx" ON "sales_facts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sales_facts_fact_type_idx" ON "sales_facts" USING btree ("fact_type");--> statement-breakpoint
CREATE INDEX "sales_facts_period_type_idx" ON "sales_facts" USING btree ("period_type");--> statement-breakpoint
CREATE INDEX "sales_facts_period_start_idx" ON "sales_facts" USING btree ("period_start");--> statement-breakpoint
CREATE INDEX "sales_facts_period_end_idx" ON "sales_facts" USING btree ("period_end");--> statement-breakpoint
CREATE INDEX "sales_facts_safety_category_idx" ON "sales_facts" USING btree ("safety_category");--> statement-breakpoint
CREATE INDEX "sales_facts_active_idx" ON "sales_facts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "products_territory_id_idx" ON "products" USING btree ("territory_id");--> statement-breakpoint
CREATE INDEX "products_sku_idx" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_type_idx" ON "products" USING btree ("type");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_subcategory_idx" ON "products" USING btree ("subcategory");--> statement-breakpoint
CREATE INDEX "products_active_idx" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "projects_account_id_idx" ON "projects" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "projects_owner_id_idx" ON "projects" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "projects_name_idx" ON "projects" USING btree ("name");--> statement-breakpoint
CREATE INDEX "projects_type_idx" ON "projects" USING btree ("type");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "projects_priority_idx" ON "projects" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "projects_start_date_idx" ON "projects" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "projects_end_date_idx" ON "projects" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "projects_active_idx" ON "projects" USING btree ("is_active");
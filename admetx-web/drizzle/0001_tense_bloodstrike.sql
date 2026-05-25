CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"username" varchar(64) NOT NULL,
	"action" varchar(32) NOT NULL,
	"auth_source" varchar(16),
	"ip" varchar(64),
	"user_agent" varchar(256),
	"detail" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_audit_user_created" ON "audit_log" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_action_created" ON "audit_log" USING btree ("action","created_at");
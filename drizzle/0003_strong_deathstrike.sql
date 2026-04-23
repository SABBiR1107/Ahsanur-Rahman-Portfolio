ALTER TABLE "skills" ALTER COLUMN "proficiency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "icon_url" text;
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table
export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Portfolio content table (versioned with draft/published)
export const portfolioContent = pgTable("portfolio_content", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  isDraft: boolean("is_draft").notNull().default(true),

  // Profile information
  profileName: text("profile_name").notNull(),
  profileTitle: text("profile_title").notNull(),
  profileDescription: text("profile_description").notNull(),
  profileEmail: text("profile_email").notNull(),
  profileLocation: text("profile_location").notNull(),
  profileImageUrl: text("profile_image_url"),

  // Hero section
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  heroStatus: text("hero_status").notNull(),

  // About section
  aboutText: text("about_text"),

  // Theme customization
  themeColors: jsonb("theme_colors").$type<{
    primary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
  }>(),
  themeFonts: jsonb("theme_fonts").$type<{
    serif?: string;
    sans?: string;
  }>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPortfolioContentSchema = createInsertSchema(portfolioContent);
export const selectPortfolioContentSchema = createSelectSchema(portfolioContent);

export type InsertPortfolioContent = z.infer<typeof insertPortfolioContentSchema>;
export type PortfolioContent = typeof portfolioContent.$inferSelect;

// Experience entries
export const experiences = pgTable("experiences", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: uuid("portfolio_id").notNull().references(() => portfolioContent.id, { onDelete: "cascade" }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  bullets: jsonb("bullets").$type<string[]>().notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertExperienceSchema = createInsertSchema(experiences);
export const selectExperienceSchema = createSelectSchema(experiences);

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

// Education entries
export const education = pgTable("education", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: uuid("portfolio_id").notNull().references(() => portfolioContent.id, { onDelete: "cascade" }),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  dates: text("dates").notNull(),
  details: text("details"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEducationSchema = createInsertSchema(education);
export const selectEducationSchema = createSelectSchema(education);

export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;

// Skills
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: uuid("portfolio_id").notNull().references(() => portfolioContent.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSkillSchema = createInsertSchema(skills);
export const selectSkillSchema = createSelectSchema(skills);

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

// Legacy users table (can be removed if not needed)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

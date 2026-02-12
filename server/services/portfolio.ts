import { db } from "../storage";
import { portfolioContent, experiences, education, skills } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import type {
  InsertPortfolioContent,
  PortfolioContent,
  InsertExperience,
  Experience,
  InsertEducation,
  Education,
  InsertSkill,
  Skill,
} from "@shared/schema";

// ===================
// Portfolio Content
// ===================

export async function getPublishedPortfolio() {
  const [portfolio] = await db
    .select()
    .from(portfolioContent)
    .where(eq(portfolioContent.isDraft, false))
    .orderBy(desc(portfolioContent.updatedAt))
    .limit(1);

  if (!portfolio) {
    return null;
  }

  const [portfolioExperiences, portfolioEducation, portfolioSkills] = await Promise.all([
    db
      .select()
      .from(experiences)
      .where(eq(experiences.portfolioId, portfolio.id))
      .orderBy(experiences.order),
    db
      .select()
      .from(education)
      .where(eq(education.portfolioId, portfolio.id))
      .orderBy(education.order),
    db
      .select()
      .from(skills)
      .where(eq(skills.portfolioId, portfolio.id))
      .orderBy(skills.order),
  ]);

  return {
    ...portfolio,
    experiences: portfolioExperiences,
    education: portfolioEducation,
    skills: portfolioSkills,
  };
}

export async function getDraftPortfolio() {
  const [portfolio] = await db
    .select()
    .from(portfolioContent)
    .where(eq(portfolioContent.isDraft, true))
    .orderBy(desc(portfolioContent.updatedAt))
    .limit(1);

  if (!portfolio) {
    return null;
  }

  const [portfolioExperiences, portfolioEducation, portfolioSkills] = await Promise.all([
    db
      .select()
      .from(experiences)
      .where(eq(experiences.portfolioId, portfolio.id))
      .orderBy(experiences.order),
    db
      .select()
      .from(education)
      .where(eq(education.portfolioId, portfolio.id))
      .orderBy(education.order),
    db
      .select()
      .from(skills)
      .where(eq(skills.portfolioId, portfolio.id))
      .orderBy(skills.order),
  ]);

  return {
    ...portfolio,
    experiences: portfolioExperiences,
    education: portfolioEducation,
    skills: portfolioSkills,
  };
}

export async function saveDraft(data: Partial<InsertPortfolioContent>) {
  // Get or create draft
  let [draft] = await db
    .select()
    .from(portfolioContent)
    .where(eq(portfolioContent.isDraft, true))
    .limit(1);

  if (!draft) {
    // Create new draft from published
    const [published] = await db
      .select()
      .from(portfolioContent)
      .where(eq(portfolioContent.isDraft, false))
      .limit(1);

    // Exclude id and createdAt to let database generate new ones
    const { id, createdAt, ...publishedData } = published;

    [draft] = await db
      .insert(portfolioContent)
      .values({
        ...publishedData,
        isDraft: true,
        ...data,
      })
      .returning();
  } else {
    // Update existing draft
    [draft] = await db
      .update(portfolioContent)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(portfolioContent.id, draft.id))
      .returning();
  }

  return draft;
}

export async function publishDraft() {
  const [draft] = await db
    .select()
    .from(portfolioContent)
    .where(eq(portfolioContent.isDraft, true))
    .limit(1);

  if (!draft) {
    throw new Error("No draft to publish");
  }

  // Update published content
  const [published] = await db
    .select()
    .from(portfolioContent)
    .where(eq(portfolioContent.isDraft, false))
    .limit(1);

  if (published) {
    // Exclude id when updating to avoid overwriting the published id
    const { id, createdAt, ...draftData } = draft;
    await db
      .update(portfolioContent)
      .set({
        ...draftData,
        isDraft: false,
        updatedAt: new Date(),
      })
      .where(eq(portfolioContent.id, published.id));
  } else {
    // Exclude id and createdAt to let database generate new ones
    const { id, createdAt, ...draftData } = draft;
    await db
      .insert(portfolioContent)
      .values({
        ...draftData,
        isDraft: false,
      });
  }

  // Delete draft
  await db.delete(portfolioContent).where(eq(portfolioContent.id, draft.id));

  return getPublishedPortfolio();
}

// ===================
// Experiences
// ===================

export async function createExperience(portfolioId: string, data: Omit<InsertExperience, "portfolioId">) {
  const [experience] = await db
    .insert(experiences)
    .values({
      ...data,
      portfolioId,
    })
    .returning();
  return experience;
}

export async function updateExperience(id: string, data: Partial<InsertExperience>) {
  const [experience] = await db
    .update(experiences)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(experiences.id, id))
    .returning();
  return experience;
}

export async function deleteExperience(id: string) {
  await db.delete(experiences).where(eq(experiences.id, id));
}

export async function reorderExperiences(portfolioId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(experiences)
      .set({ order: i })
      .where(and(eq(experiences.id, orderedIds[i]), eq(experiences.portfolioId, portfolioId)));
  }
}

// ===================
// Education
// ===================

export async function createEducation(portfolioId: string, data: Omit<InsertEducation, "portfolioId">) {
  const [edu] = await db
    .insert(education)
    .values({
      ...data,
      portfolioId,
    })
    .returning();
  return edu;
}

export async function updateEducation(id: string, data: Partial<InsertEducation>) {
  const [edu] = await db
    .update(education)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(education.id, id))
    .returning();
  return edu;
}

export async function deleteEducation(id: string) {
  await db.delete(education).where(eq(education.id, id));
}

export async function reorderEducation(portfolioId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(education)
      .set({ order: i })
      .where(and(eq(education.id, orderedIds[i]), eq(education.portfolioId, portfolioId)));
  }
}

// ===================
// Skills
// ===================

export async function createSkill(portfolioId: string, data: Omit<InsertSkill, "portfolioId">) {
  const [skill] = await db
    .insert(skills)
    .values({
      ...data,
      portfolioId,
    })
    .returning();
  return skill;
}

export async function updateSkill(id: string, data: Partial<InsertSkill>) {
  const [skill] = await db
    .update(skills)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, id))
    .returning();
  return skill;
}

export async function deleteSkill(id: string) {
  await db.delete(skills).where(eq(skills.id, id));
}

export async function reorderSkills(portfolioId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(skills)
      .set({ order: i })
      .where(and(eq(skills.id, orderedIds[i]), eq(skills.portfolioId, portfolioId)));
  }
}

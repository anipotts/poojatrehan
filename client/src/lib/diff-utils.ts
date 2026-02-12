import type { Portfolio, Experience, Education, Skill } from "./api";

export type DiffStatus = "published" | "modified" | "new";

/**
 * Compare two values and determine if they're different
 */
function isDifferent(a: any, b: any): boolean {
  if (typeof a === "object" && typeof b === "object") {
    return JSON.stringify(a) !== JSON.stringify(b);
  }
  return a !== b;
}

/**
 * Get diff status for an experience item
 */
export function getExperienceDiffStatus(
  exp: Experience,
  publishedExperiences: Experience[]
): DiffStatus {
  const published = publishedExperiences.find((p) => p.id === exp.id);

  if (!published) {
    return "new";
  }

  // Compare all fields except id and portfolioId
  const isModified =
    exp.company !== published.company ||
    exp.role !== published.role ||
    exp.type !== published.type ||
    exp.location !== published.location ||
    exp.startDate !== published.startDate ||
    exp.endDate !== published.endDate ||
    JSON.stringify(exp.bullets) !== JSON.stringify(published.bullets);

  return isModified ? "modified" : "published";
}

/**
 * Get diff status for an education item
 */
export function getEducationDiffStatus(
  edu: Education,
  publishedEducation: Education[]
): DiffStatus {
  const published = publishedEducation.find((p) => p.id === edu.id);

  if (!published) {
    return "new";
  }

  const isModified =
    edu.school !== published.school ||
    edu.degree !== published.degree ||
    edu.dates !== published.dates ||
    edu.details !== published.details;

  return isModified ? "modified" : "published";
}

/**
 * Get diff status for a skill item
 */
export function getSkillDiffStatus(
  skill: Skill,
  publishedSkills: Skill[]
): DiffStatus {
  const published = publishedSkills.find((p) => p.id === skill.id);

  if (!published) {
    return "new";
  }

  const isModified = skill.name !== published.name;

  return isModified ? "modified" : "published";
}

/**
 * Get diff status for profile fields
 */
export function getProfileDiffStatus(
  draft: Portfolio,
  published: Portfolio | null
): DiffStatus {
  if (!published) {
    return "new";
  }

  const isModified =
    draft.profileName !== published.profileName ||
    draft.profileTitle !== published.profileTitle ||
    draft.profileDescription !== published.profileDescription ||
    draft.profileEmail !== published.profileEmail ||
    draft.profileLocation !== published.profileLocation ||
    draft.profileImageUrl !== published.profileImageUrl ||
    draft.heroTitle !== published.heroTitle ||
    draft.heroSubtitle !== published.heroSubtitle ||
    draft.heroStatus !== published.heroStatus;

  return isModified ? "modified" : "published";
}

/**
 * Get diff status for theme
 */
export function getThemeDiffStatus(
  draft: Portfolio,
  published: Portfolio | null
): DiffStatus {
  if (!published) {
    return "new";
  }

  const isModified =
    JSON.stringify(draft.themeColors) !== JSON.stringify(published.themeColors);

  return isModified ? "modified" : "published";
}

/**
 * Check if there are any unpublished changes
 */
export function hasUnpublishedChanges(
  draft: Portfolio,
  published: Portfolio | null
): boolean {
  if (!published) {
    return true;
  }

  // Check profile
  if (getProfileDiffStatus(draft, published) !== "published") {
    return true;
  }

  // Check theme
  if (getThemeDiffStatus(draft, published) !== "published") {
    return true;
  }

  // Check experiences
  if (draft.experiences.length !== published.experiences.length) {
    return true;
  }
  for (const exp of draft.experiences) {
    if (getExperienceDiffStatus(exp, published.experiences) !== "published") {
      return true;
    }
  }

  // Check education
  if (draft.education.length !== published.education.length) {
    return true;
  }
  for (const edu of draft.education) {
    if (getEducationDiffStatus(edu, published.education) !== "published") {
      return true;
    }
  }

  // Check skills
  if (draft.skills.length !== published.skills.length) {
    return true;
  }
  for (const skill of draft.skills) {
    if (getSkillDiffStatus(skill, published.skills) !== "published") {
      return true;
    }
  }

  return false;
}

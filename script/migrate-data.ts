import { db } from "../server/storage";
import { portfolioContent, experiences, education, skills } from "../shared/schema";

// Hardcoded data from the current home.tsx
const initialData = {
  profile: {
    name: "Pooja Trehan",
    title: "Economics Student",
    description: "I'm Pooja Trehan (she/her), a senior Economics student at New York University. I'm focused on transitioning into the accounting industry through hands-on internship experience, clear communication, and detail-first work.",
    email: "pt2293@nyu.edu",
    location: "New York, NY",
    imageUrl: null, // Will be uploaded later via admin panel
  },
  hero: {
    title: "A precise, modern portfolio — built for trust.",
    subtitle: "I'm Pooja Trehan (she/her), a senior Economics student at New York University. I'm focused on transitioning into the accounting industry through hands-on internship experience, clear communication, and detail-first work.",
    status: "Senior Economics student at NYU • Pursuing accounting roles",
  },
  experiences: [
    {
      company: "Accounting Solutions of NY",
      role: "Accounting Intern",
      type: "Internship",
      location: "New York, NY (On-site)",
      startDate: "May 2025",
      endDate: "Aug 2025",
      bullets: [
        "Supported month-end tasks and reconciliations with a strong focus on accuracy.",
        "Assisted with documentation and organized financial records for quick review.",
      ],
      order: 0,
    },
    {
      company: "Astatine Investment Partners",
      role: "Finance Intern",
      type: "Internship",
      location: "Connecticut (On-site)",
      startDate: "May 2024",
      endDate: "Aug 2024",
      bullets: [
        "Built cash flow and DCF analysis to support investment research and discussions.",
        "Synthesized findings into clear, decision-ready summaries.",
      ],
      order: 1,
    },
    {
      company: "Brave",
      role: "Marketing Representative",
      type: "Part-time",
      location: "New York, NY",
      startDate: "Jan 2024",
      endDate: "May 2024",
      bullets: [
        "Strengthened communication through outreach and event-style engagement.",
        "Practiced project planning and consistent follow-through.",
      ],
      order: 2,
    },
    {
      company: "KK MEHTA LTD",
      role: "Accounting Intern",
      type: "Full-time",
      location: "New York, NY (On-site)",
      startDate: "May 2023",
      endDate: "Aug 2023",
      bullets: [
        "Supported financial reporting workflows and maintained organized records.",
        "Assisted with asset tracking and basic reporting tasks.",
      ],
      order: 3,
    },
  ],
  education: [
    {
      school: "New York University",
      degree: "B.A. in Economics",
      dates: "Sep 2022 — May 2026",
      details: null,
      order: 0,
    },
    {
      school: "Jericho Senior High School",
      degree: "High School Diploma",
      dates: "Sep 2019 — Jun 2022",
      details: "Activities: Debate, Model UN, Swim",
      order: 1,
    },
  ],
  skills: [
    { name: "Financial Reporting", order: 0 },
    { name: "Analytical Skills", order: 1 },
    { name: "DCF & Cash Flow Modeling", order: 2 },
    { name: "Reconciliation Support", order: 3 },
    { name: "Documentation", order: 4 },
    { name: "Public Speaking", order: 5 },
    { name: "Project Planning", order: 6 },
  ],
};

async function migrateData() {
  console.log("=== Migrating Initial Portfolio Data ===\n");

  // Create published portfolio content
  console.log("Creating published portfolio content...");
  const [portfolio] = await db
    .insert(portfolioContent)
    .values({
      isDraft: false,
      profileName: initialData.profile.name,
      profileTitle: initialData.profile.title,
      profileDescription: initialData.profile.description,
      profileEmail: initialData.profile.email,
      profileLocation: initialData.profile.location,
      profileImageUrl: initialData.profile.imageUrl,
      heroTitle: initialData.hero.title,
      heroSubtitle: initialData.hero.subtitle,
      heroStatus: initialData.hero.status,
      aboutText: null,
      themeColors: null,
      themeFonts: null,
    })
    .returning();

  console.log(`✅ Portfolio content created (ID: ${portfolio.id})\n`);

  // Create experiences
  console.log("Creating experiences...");
  for (const exp of initialData.experiences) {
    await db.insert(experiences).values({
      portfolioId: portfolio.id,
      company: exp.company,
      role: exp.role,
      type: exp.type,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      bullets: exp.bullets,
      order: exp.order,
    });
  }
  console.log(`✅ Created ${initialData.experiences.length} experiences\n`);

  // Create education
  console.log("Creating education entries...");
  for (const edu of initialData.education) {
    await db.insert(education).values({
      portfolioId: portfolio.id,
      school: edu.school,
      degree: edu.degree,
      dates: edu.dates,
      details: edu.details,
      order: edu.order,
    });
  }
  console.log(`✅ Created ${initialData.education.length} education entries\n`);

  // Create skills
  console.log("Creating skills...");
  for (const skill of initialData.skills) {
    await db.insert(skills).values({
      portfolioId: portfolio.id,
      name: skill.name,
      order: skill.order,
    });
  }
  console.log(`✅ Created ${initialData.skills.length} skills\n`);

  console.log("✅ Data migration complete!\n");
  process.exit(0);
}

migrateData().catch((error) => {
  console.error("Error migrating data:", error);
  process.exit(1);
});

import { db } from "../server/storage";
import { admins } from "../shared/schema";
import bcrypt from "bcrypt";

async function seedAdmins() {
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!password) { console.error("Set ADMIN_SEED_PASSWORD env var"); process.exit(1); }
  const usernames = ["pooja", "poojatrehan", "anipotts"];

  console.log("=== Creating Admin Users ===\n");

  const hashedPassword = await bcrypt.hash(password, 10);

  for (const username of usernames) {
    try {
      const [admin] = await db
        .insert(admins)
        .values({
          username,
          password: hashedPassword,
        })
        .returning();

      console.log(`✅ Created admin: ${admin.username} (ID: ${admin.id})`);
    } catch (error: any) {
      if (error.code === '23505') {
        console.log(`⚠️  Admin '${username}' already exists, skipping...`);
      } else {
        console.error(`❌ Error creating admin '${username}':`, error.message);
      }
    }
  }

  console.log("\n✅ Admin setup complete!");
  console.log("\nYou can now log in at /admin with any of these usernames:");
  usernames.forEach(u => console.log(`  - ${u}`));
  console.log(`\nPassword: [from ADMIN_SEED_PASSWORD env var]\n`);

  process.exit(0);
}

seedAdmins().catch((error) => {
  console.error("Error seeding admins:", error);
  process.exit(1);
});

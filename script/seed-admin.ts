import { db } from "../server/storage";
import { admins } from "../shared/schema";
import bcrypt from "bcrypt";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function seedAdmin() {
  console.log("=== Admin User Setup ===\n");

  const username = await question("Enter admin username: ");
  const password = await question("Enter admin password: ");

  if (!username || !password) {
    console.error("Username and password are required!");
    process.exit(1);
  }

  console.log("\nHashing password...");
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Inserting admin user...");
  const [admin] = await db
    .insert(admins)
    .values({
      username,
      password: hashedPassword,
    })
    .returning();

  console.log(`\n✅ Admin user created successfully!`);
  console.log(`   Username: ${admin.username}`);
  console.log(`   ID: ${admin.id}`);
  console.log(`\nYou can now log in at /admin with these credentials.\n`);

  rl.close();
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error("Error seeding admin:", error);
  rl.close();
  process.exit(1);
});

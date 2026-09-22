/**
 * Renaissance Restaurant - Admin User Creation Utility
 * Usage: node scripts/create-admin.mjs [email] [password]
 * Example: node scripts/create-admin.mjs admin@renaissance.com Renaissance2026!
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.supabase_secret_key || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and supabase_secret_key are required in .env or .env.local.");
  process.exit(1);
}

const email = process.argv[2] || "admin@renaissance.com";
const password = process.argv[3] || "Renaissance2026!";

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`\n👑 Renaissance Restaurant - Admin Setup`);
  console.log(`Connecting to: ${supabaseUrl}`);
  console.log(`Target Email: ${email}`);

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("❌ Error listing users:", listError.message);
    process.exit(1);
  }

  const existing = usersData.users.find((u) => u.email === email);

  if (existing) {
    console.log(`ℹ️ User already exists (ID: ${existing.id}). Updating password and confirming email...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });

    if (updateError) {
      console.error("❌ Failed to update user:", updateError.message);
      process.exit(1);
    }
    console.log("✅ Admin user credentials updated successfully!");
  } else {
    console.log("Creating new admin user with auto-confirmed email...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });

    if (createError) {
      console.error("❌ Failed to create admin user:", createError.message);
      process.exit(1);
    }
    console.log(`✅ Admin user created successfully (ID: ${newUser.user.id})!`);
  }

  console.log("\n-------------------------------------------");
  console.log("🔑 Login details:");
  console.log(`   URL:      http://localhost:3000/admin/login`);
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log("-------------------------------------------\n");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

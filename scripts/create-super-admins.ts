/**
 * Script to create super admin accounts in Supabase Auth
 * Run this once to set up the initial super admin accounts
 * 
 * Usage: npx tsx scripts/create-super-admins.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables!");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const superAdmins = [
  { email: "songky@cau.ac.kr", password: "fiber@ptics1550" },
];

async function createSuperAdmins() {
  console.log("Creating super admin accounts...\n");

  for (const admin of superAdmins) {
    console.log(`Processing: ${admin.email}`);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        console.log(`  ✓ Auth account already exists`);
      } else {
        console.error(`  ✗ Auth error: ${authError.message}`);
        continue;
      }
    } else {
      console.log(`  ✓ Auth account created`);
    }

    // Ensure admin_users record exists
    const { data: existing } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", admin.email)
      .single();

    if (existing) {
      // Update to ensure super admin status
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({
          is_super_admin: true,
          is_approved: true,
          approved_at: new Date().toISOString(),
        })
        .eq("email", admin.email);

      if (updateError) {
        console.error(`  ✗ Update error: ${updateError.message}`);
      } else {
        console.log(`  ✓ Updated to super admin status`);
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from("admin_users").insert({
        email: admin.email,
        is_super_admin: true,
        is_approved: true,
        approved_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error(`  ✗ Insert error: ${insertError.message}`);
      } else {
        console.log(`  ✓ Admin record created`);
      }
    }

    console.log("");
  }

  console.log("✅ Super admin setup complete!");
  console.log("\nYou can now log in with:");
  superAdmins.forEach((admin) => {
    console.log(`  - ${admin.email}`);
  });
}

createSuperAdmins().catch(console.error);

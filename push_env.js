const { execSync } = require('child_process');
const fs = require('fs');

const envs = {
  NEXT_PUBLIC_SUPABASE_URL: "https://hiulbwlwzooxzhckztwz.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_PTMRtRn5dU0hSX7202MLdg_BiVecu2y",
  DATABASE_URL: "postgresql://postgres:PrimeBilty056@db.hiulbwlwzooxzhckztwz.supabase.co:5432/postgres",
  DIRECT_URL: "postgresql://postgres:PrimeBilty056@db.hiulbwlwzooxzhckztwz.supabase.co:5432/postgres",
  JWT_SECRET: "PrimeBilty_JWT_Super_Secret_Key_2024_@#$%",
  JWT_REFRESH_SECRET: "PrimeBilty_Refresh_JWT_Super_Secret_Key_2024_@#$%"
};

for (const [key, value] of Object.entries(envs)) {
  console.log(`Adding ${key}...`);
  fs.writeFileSync('temp_val.txt', value);
  try {
    execSync(`vercel env add ${key} production -y < temp_val.txt`, { stdio: 'inherit' });
    execSync(`vercel env add ${key} preview -y < temp_val.txt`, { stdio: 'inherit' });
    execSync(`vercel env add ${key} development -y < temp_val.txt`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to add ${key}`);
  }
}
fs.unlinkSync('temp_val.txt');
console.log("Done adding env variables!");

// One-off recovery script: creates an admin user from ADMIN_USERNAME /
// ADMIN_PASSWORD_HASH in .env. Use this if you're ever locked out of /admin
// (e.g. deleted the last user by mistake via direct DB access).
//
// Run with: npx tsx scripts/bootstrap-admin.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_USERNAME
  const passwordHash = process.env.ADMIN_PASSWORD_HASH

  if (!username || !passwordHash) {
    throw new Error("Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH in .env first.")
  }

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  })

  console.log(`Admin user ready: ${user.username}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

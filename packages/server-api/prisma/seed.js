import bcrypt from "bcrypt";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const email = "aamir@mahimediasolutions.com";
  const password = "123123123123";

  const passwordHash = await bcrypt.hash(password, 10);

  // Admin
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, role: "SUPER_ADMIN" },
  });

  // Brands
  const aamir = await prisma.brand.upsert({
    where: { slug: "aamir" },
    update: {},
    create: {
      slug: "aamir",
      name: "PetCare",
      route: "/aamir",
      status: "ACTIVE",
      primaryDomain: "insuranceco.com/aamir",
      accentColor: "#008080",
      typography: "Inter + Playfair",
    },
  });

  const umair = await prisma.brand.upsert({
    where: { slug: "umair" },
    update: {},
    create: {
      slug: "umair",
      name: "Trust Life",
      route: "/umair",
      status: "ACTIVE",
      primaryDomain: "insuranceco.com/umair",
      accentColor: "#2563eb",
      typography: "Inter + DM Serif",
    },
  });

  // Brand templates (Header/Footer/Home only)
  const baseTemplates = [
    { key: "global-header", title: "Global Header", status: "PUBLISHED" },
    { key: "global-footer", title: "Global Footer", status: "PUBLISHED" },
    { key: "home", title: "Home Page", status: "DRAFT" },
  ];

  for (const b of [aamir, umair]) {
    for (const t of baseTemplates) {
      await prisma.template.upsert({
        where: { scope_brandId_key: { scope: "BRAND", brandId: b.id, key: t.key } },
        update: { title: t.title, status: t.status },
        create: {
          scope: "BRAND",
          brandId: b.id,
          key: t.key,
          title: t.title,
          status: t.status,
        },
      });
    }
  }

  // Main site templates
  const mainTemplates = [
    { key: "global-header", title: "Main Global Header" },
    { key: "global-footer", title: "Main Global Footer" },
    { key: "home", title: "Main Home Page" },
    { key: "about", title: "Main About Page" },
    { key: "contact", title: "Main Contact Page" },
    { key: "get-a-quote", title: "Main Get a Quote" },
  ];

  for (const t of mainTemplates) {
    await prisma.template.upsert({
      where: { scope_brandId_key: { scope: "MAIN", brandId: null, key: t.key } },
      update: { title: t.title },
      create: { scope: "MAIN", key: t.key, title: t.title, status: "DRAFT" },
    });
  }

  // Brand inner pages
  const innerPages = [
    { slug: "privacy", title: "Privacy Policy", status: "PUBLISHED" },
    { slug: "terms", title: "Terms of Service", status: "PUBLISHED" },
    { slug: "faq", title: "FAQ", status: "DRAFT" },
    { slug: "pricing", title: "Pricing", status: "PUBLISHED" },
    { slug: "claims-help", title: "Claims Help", status: "DRAFT" },
  ];

  for (const b of [aamir, umair]) {
    for (const p of innerPages) {
      await prisma.innerPage.upsert({
        where: { scope_brandId_slug: { scope: "BRAND", brandId: b.id, slug: p.slug } },
        update: { title: p.title, status: p.status },
        create: {
          scope: "BRAND",
          brandId: b.id,
          slug: p.slug,
          title: p.title,
          status: p.status,
        },
      });
    }
  }

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

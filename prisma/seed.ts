import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. 既存データのクリア（順序に注意：子から先に消す）
  await prisma.ingredient.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();

  // 2. カテゴリの作成
  const catCurry = await prisma.category.create({
    data: { name: "カレー" },
  });
  const catStew = await prisma.category.create({
    data: { name: "シチュー" },
  });

  // 3. カレー（1人前）の作成
  await prisma.menu.create({
    data: {
      name: "ポークカレー",
      description: "1人前カレー",
      categoryId: catCurry.id,
      ingredients: {
        create: [
          { name: "豚こま切れ肉", amount: "80g" },
          { name: "玉ねぎ", amount: "1/4個" },
          { name: "じゃがいも", amount: "1/2個" },
          { name: "にんじん", amount: "1/8本" },
          { name: "カレールウ", amount: "1皿分" },
          { name: "水", amount: "150ml" },
        ],
      },
    },
  });

  // 4. シチュー（1人前）の作成
  await prisma.menu.create({
    data: {
      name: "クリームシチュー",
      description: "1人前シチュー",
      categoryId: catStew.id,
      ingredients: {
        create: [
          { name: "鶏もも肉", amount: "80g" },
          { name: "玉ねぎ", amount: "1/4個" },
          { name: "じゃがいも", amount: "1/2個" },
          { name: "ブロッコリー", amount: "2房" },
          { name: "シチュールウ", amount: "1皿分" },
          { name: "水", amount: "100ml" },
          { name: "牛乳", amount: "50ml" },
        ],
      },
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
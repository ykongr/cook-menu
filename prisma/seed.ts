// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 依存関係の逆順で削除（具材 -> メニュー -> カテゴリ）
  await prisma.ingredient.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();

  // 1. カテゴリの作成
  const pasta = await prisma.category.create({ data: { name: "パスタ" } });
  const salad = await prisma.category.create({ data: { name: "サラダ" } });

  // 2. メニューと具材を同時に作成
  await prisma.menu.create({
    data: {
      name: "濃厚カルボナーラ",
      description: "卵黄とパンチェッタの本格派",
      categoryId: pasta.id, // パスタカテゴリに紐付け
      ingredients: {
        create: [
          { name: "スパゲッティ", amount: "100g" },
          { name: "卵黄", amount: "2個" },
          { name: "パンチェッタ", amount: "30g" },
        ],
      },
    },
  });

  await prisma.menu.create({
    data: {
      name: "シーザーサラダ",
      description: "自家製ドレッシングのサラダ",
      categoryId: salad.id, // サラダカテゴリに紐付け
      ingredients: {
        create: [
          { name: "ロメインレタス", amount: "1/4個" },
          { name: "クルトン", amount: "適量" },
        ],
      },
    },
  });

  console.log("リレーション付きシード完了！");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
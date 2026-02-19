import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  console.log("シードデータを注入開始...");

  // 1. 既存の Menu レコードをすべて削除（重複を防ぐため）
  await prisma.menu.deleteMany();

  // 2. Menu データの作成
  await prisma.menu.createMany({
    data: [
      {
        name: "特製オムライス",
        description: "ふわふわ卵と自家製ケチャップの絶品オムライスです。",
        price: 1200,
      },
      {
        name: "濃厚カルボナーラ",
        description: "パンチェッタとたっぷりのチーズを使用した本格派。",
        price: 1400,
      },
      {
        name: "季節のグリーンサラダ",
        description: "地元の農家から届いた新鮮な野菜をふんだんに使用。",
        price: 800,
      },
      {
        name: "ガトーショコラ",
        description: "しっとり濃厚なチョコレートケーキです。",
        price: 650,
      },
    ],
  });

  console.log("シードデータの注入が完了しました！");
};

main()
  .catch((e) => {
    console.error("エラーが発生しました:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import prisma from "@/lib/prisma";
import Link from "next/link"; // 追加

export default async function RecipesPage() {
  const menus = await prisma.menu.findMany({
    include: { category: true }, // 具材はここでは不要なので外す
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">レシピ一覧</h1>
        <Link href="/recipes/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          ＋ 新規登録
        </Link>
      </div>

      <div className="grid gap-4">
        {menus.map((menu) => (
          /* 詳細画面へのリンク */
          <Link key={menu.id} href={`/recipes/${menu.id}`}>
            <article className="border rounded-lg p-5 hover:bg-gray-50 transition shadow-sm bg-white flex justify-between items-center cursor-pointer">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{menu.name}</h2>
                <span className="text-sm text-blue-600 font-medium">
                  #{menu.category.name}
                </span>
              </div>
              <div className="text-gray-400">→</div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
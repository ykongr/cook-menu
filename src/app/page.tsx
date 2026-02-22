import prisma from "@/lib/prisma";
import Link from "next/link";
import CategorySort from "./components/CategorySort";

export default async function RecipeListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categoryId = category ? Number(category) : undefined;

  const [categories, menus] = await Promise.all([
    prisma.category.findMany(),
    prisma.menu.findMany({
      where: {
        categoryId: categoryId || undefined,
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">レシピ一覧</h1>
        <Link 
          href="/recipes/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
        >
          ＋ 新規作成
        </Link>
      </div>

      <CategorySort categories={categories} activeCategoryId={categoryId} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {menus.map((menu) => (
          <Link key={menu.id} href={`/recipes/${menu.id}`}>
            <div className="border rounded-xl p-6 hover:shadow-md transition bg-white group">
              {menu.category && (
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">
                  {menu.category.name}
                </span>
              )}
              <h2 className="text-xl font-bold mt-2 group-hover:text-blue-600">
                {menu.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                {menu.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {menus.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          このジャンルのレシピはまだありません。
        </div>
      )}
    </main>
  );
}
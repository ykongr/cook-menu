import prisma from "@/lib/prisma";

export default async function RecipesPage() {
  // 1. データベースから全件取得
  const recipes = await prisma.menu.findMany();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">レシピ一覧</h1>
      <ul>
        {recipes.map((menu) => (
          <li key={menu.id} className="border-b py-2">
            {menu.name}
          </li>
        ))}
      </ul>
      {recipes.length === 0 && <p>レシピがまだありません。</p>}
    </main>
  );
}
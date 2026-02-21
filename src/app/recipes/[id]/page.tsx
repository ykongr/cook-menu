import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // URLからIDを取得
  const { id } = await params;
  
  // データベースから特定のメニューを1件取得
  const menu = await prisma.menu.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      ingredients: true,
    },
  });

  // メニューが存在しない場合は404ページを表示
  if (!menu) notFound();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <Link href="/recipes" className="text-blue-500 mb-6 inline-block">← 一覧に戻る</Link>
      
      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <span className="text-blue-600 font-bold text-sm uppercase">{menu.category.name}</span>
        <h1 className="text-4xl font-bold mt-2 mb-4">{menu.name}</h1>
        
        {menu.description && (
          <p className="text-gray-600 text-lg mb-8 pb-6 border-b">{menu.description}</p>
        )}

        <h3 className="font-bold text-xl mb-4">必要な具材</h3>
        <ul className="space-y-3">
          {menu.ingredients.map((ing) => (
            <li key={ing.id} className="flex justify-between bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-700">{ing.name}</span>
              <span className="text-gray-500">{ing.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
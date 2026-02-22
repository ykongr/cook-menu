import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import RecipeDetailClient from "../../components/RecipeDetailClient";
import DeleteButton from "../../components/DeleteButton";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [categories, menu] = await params && await Promise.all([
    prisma.category.findMany(),
    prisma.menu.findUnique({
      where: { id: Number(id) },
      include: { category: true, ingredients: true },
    })
  ]);

  if (!menu) notFound();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-gray-500 mb-6 inline-block hover:underline">← 戻る</Link>
        <DeleteButton id={menu.id} />
      </div>
      <RecipeDetailClient menu={menu} categories={categories} />
    </main>
  );
}
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  const categoryIdRaw = formData.get("categoryId");
  const newCategoryName = formData.get("newCategoryName") as string;

  let finalCategoryId: number;

  // 1. 新しいカテゴリ名が入力されている場合、まずそれを作成
  if (newCategoryName && newCategoryName.trim() !== "") {
    const newCategory = await prisma.category.create({
      data: { name: newCategoryName.trim() }
    });
    finalCategoryId = newCategory.id;
  } 
  // 2. 既存のカテゴリが選択されている場合
  else if (categoryIdRaw) {
    finalCategoryId = Number(categoryIdRaw);
  } 
  // 3. どちらもない場合はエラー（本来はバリデーションが必要）
  else {
    throw new Error("カテゴリを選択するか、新しく入力してください。");
  }

  // メニューの作成
  await prisma.menu.create({
    data: {
      name,
      description,
      categoryId: finalCategoryId,
    },
  });

  revalidatePath("/recipes");
  redirect("/recipes");
}
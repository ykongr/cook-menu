"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryIdRaw = formData.get("categoryId");
  const newCategoryName = formData.get("newCategoryName") as string;

  let finalCategoryId: number | null = null; // 初期値を null に

  // 1. 新しいカテゴリが入力された場合
  if (newCategoryName && newCategoryName.trim() !== "") {
    const newCategory = await prisma.category.create({
      data: { name: newCategoryName.trim() }
    });
    finalCategoryId = newCategory.id;
  } 
  // 2. 既存のカテゴリが選ばれた場合
  else if (categoryIdRaw && String(categoryIdRaw).trim() !== "" && Number(categoryIdRaw) !== 0) {
    finalCategoryId = Number(categoryIdRaw);
  }

  // 3. 保存（categoryId が null でも OK になる）
  await prisma.menu.create({
    data: {
      name,
      description,
      categoryId: finalCategoryId, // ここが null ならカテゴリなしで保存される
    },
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateMenu(formData: FormData) {
  const idStr = formData.get("id");
  const nameStr = formData.get("name");
  const categoryIdStr = formData.get("categoryId");
  const descriptionStr = formData.get("description");
  const id = Number(idStr);
  const name = nameStr ? String(nameStr) : "";
  const categoryIdValue = categoryIdStr ? String(categoryIdStr).trim() : "";
  const categoryId = categoryIdValue && categoryIdValue !== "" ? Number(categoryIdValue) : null;
  const description = descriptionStr ? String(descriptionStr) : "";

  if (!name || name.trim() === "") {
    throw new Error("料理名を入力してください");
  }

  const ingredientNames = formData.getAll("ingName").map(n => String(n));
  const ingredientAmounts = formData.getAll("ingAmount").map(a => String(a));

  const ingredientsToCreate = ingredientNames
    .map((n, index) => ({
      name: n.trim(),
      amount: ingredientAmounts[index]?.trim() || "",
    }))
    .filter((ing) => ing.name !== "");

  // 4. 実行
  await prisma.$transaction([
    // ① 具材削除
    prisma.ingredient.deleteMany({
      where: { menuId: id },
    }),
    // ② 本体更新と具材作成
    prisma.menu.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        categoryId: categoryId,
        ingredients: {
          create: ingredientsToCreate,
        },
      },
    }),
  ]);

  revalidatePath(`/recipes/${id}`);
  revalidatePath("/");
}

export async function deleteMenu(formData: FormData) {
  const id = Number(formData.get("id"));

  // 1. 関連する具材を先に削除（PrismaのCASCADE設定がない場合）
  await prisma.ingredient.deleteMany({
    where: { menuId: id },
  });

  // 2. メニュー本体を削除
  await prisma.menu.delete({
    where: { id: id },
  });

  revalidatePath("/");
  redirect("/");
}
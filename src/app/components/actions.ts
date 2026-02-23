"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryIdRaw = formData.get("categoryId");
  const newCategoryName = formData.get("newCategoryName") as string;

  let finalCategoryId: number | undefined = undefined;

  if (newCategoryName && newCategoryName.trim() !== "") {
    const newCategory = await prisma.category.create({
      data: { name: newCategoryName.trim() }
    });
    finalCategoryId = newCategory.id;
  } 
  else if (categoryIdRaw && String(categoryIdRaw).trim() !== "" && Number(categoryIdRaw) !== 0) {
    finalCategoryId = Number(categoryIdRaw);
  }
  await prisma.menu.create({
    data: {
      name,
      description,
      categoryId: finalCategoryId,
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

  await prisma.$transaction([
    prisma.ingredient.deleteMany({
      where: { menuId: id },
    }),
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

  await prisma.ingredient.deleteMany({
    where: { menuId: id },
  });

  await prisma.menu.delete({
    where: { id: id },
  });

  revalidatePath("/");
  redirect("/");
}
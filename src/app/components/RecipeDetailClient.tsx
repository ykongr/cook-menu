"use client";

import { useOptimistic, useTransition } from "react";
import { updateMenu } from "./actions";
import IngredientEditor from "./IngredientEditor";

type Ingredient = {
  id: number;
  name: string | null;
  amount: string;
};

type MenuWithIngredients = {
  id: number;
  name: string;
  description: string | null;
  categoryId: number | null;
  ingredients: Ingredient[];
};

type Category = {
  id: number;
  name: string;
};

export default function RecipeDetailClient({ menu, categories }: { menu: MenuWithIngredients, categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticMenu, setOptimisticMenu] = useOptimistic(
    menu,
    (state, updatedFields: Partial<MenuWithIngredients>) => ({
      ...state,
      ...updatedFields,
    })
  );

  async function handleAction(formData: FormData) {
    const ingredientNames = formData.getAll("ingName").map(n => String(n));
    const ingredientAmounts = formData.getAll("ingAmount").map(a => String(a));
    
    const ingredients = ingredientNames
      .map((name, index) => ({
        id: Date.now() + index, 
        name: name.trim(),
        amount: ingredientAmounts[index]?.trim() || "",
      }))
      .filter((ing) => ing.name !== "");

    const categoryIdStr = formData.get("categoryId") as string;
    const categoryId = categoryIdStr && categoryIdStr.trim() !== "" ? Number(categoryIdStr) : null;

    const updatedData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      categoryId: categoryId,
      ingredients: ingredients, 
    };

    startTransition(() => {
      setOptimisticMenu(updatedData);
    });

    await updateMenu(formData);
  }

  return (
    <form 
      action={handleAction} 
      className={`bg-white border rounded-xl p-8 shadow-sm transition-opacity ${isPending ? "opacity-70" : "opacity-100"}`}
    >
      <input type="hidden" name="id" value={menu.id} />
      
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">ジャンル</label>
          <select 
            name="categoryId" 
            defaultValue={optimisticMenu.categoryId || ""}
            className="block w-full mt-1 border-gray-200 rounded-md text-blue-600 font-bold"
          >
            <option value="">選択なし</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">料理名</label>
          <input 
            name="name" 
            defaultValue={optimisticMenu.name}
            className="text-3xl font-bold w-full border-b border-gray-100 p-0 pb-1 mt-1 outline-none"
            required
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">説明</label>
          <textarea 
            name="description"
            defaultValue={optimisticMenu.description || ""}
            rows={2}
            className="w-full mt-1 border-none p-0 text-gray-600 text-lg outline-none resize-none"
          />
        </div>

        <IngredientEditor 
  key={optimisticMenu.ingredients.length + (isPending ? "pending" : "stable")}
  initialIngredients={optimisticMenu.ingredients} 
/>

        <button 
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-8 hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg"
        >
          {isPending ? "保存中..." : "この内容で保存する"}
        </button>
      </div>
    </form>
  );
}
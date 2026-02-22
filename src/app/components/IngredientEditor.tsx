"use client";

import { useState } from "react";

export default function IngredientEditor({ initialIngredients }: { initialIngredients: { id: number; name: string | null; amount: string }[] }) {
  const [ingredients, setIngredients] = useState(initialIngredients);

  const addRow = () => {
    setIngredients([...ingredients, { id: Date.now(), name: "", amount: "" }]);
  };

  const removeRow = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="pt-6 border-t">
      <h3 className="font-bold text-xl mb-4">具材リスト</h3>
      <div className="space-y-3">
        {ingredients.map((ing, index) => (
          <div key={ing.id || index} className="flex gap-2 items-center">
            <input
              name="ingName"
              defaultValue={ing.name || ""}
              placeholder="具材名"
              className="flex-1 p-2 border rounded text-sm"
            />
            <input
              name="ingAmount"
              defaultValue={ing.amount}
              placeholder="分量"
              className="w-24 p-2 border rounded text-sm"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-red-400 hover:text-red-600 px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-4 text-sm text-blue-600 font-bold hover:underline"
      >
        ＋ 具材を追加
      </button>
    </div>
  );
}
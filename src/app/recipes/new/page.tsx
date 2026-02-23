import prisma from "@/lib/prisma";
import Link from "next/link";
import { createMenu } from "../../components/actions";

export default async function NewMenuPage() {
  const categories = await prisma.category.findMany();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <Link 
          href="/recipes" 
          className="text-gray-500 hover:text-gray-700 hover:underline flex items-center gap-1 transition-colors"
        >
          ← 戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">新しいメニューを登録</h1>

      <form action={createMenu} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">料理名</label>
          <input
            name="name"
            type="text"
            required
            className="w-full p-2 border rounded"
            placeholder="例: ボロネーゼ"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <label className="block text-sm font-bold mb-3">カテゴリ設定</label>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">既存から選ぶ</p>
              <select name="categoryId" className="w-full p-2 border rounded">
                <option value="">選択してください</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">または</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">新しく作る</p>
              <input 
                name="newCategoryName" 
                type="text" 
                placeholder="新しいカテゴリ名を入力" 
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
        >
          登録する
        </button>
      </form>
    </main>
  );
}
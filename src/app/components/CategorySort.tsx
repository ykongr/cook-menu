"use client";

import { useRouter, usePathname } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function CategorySort({ 
  categories, 
  activeCategoryId 
}: { 
  categories: Category[], 
  activeCategoryId?: number 
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSort = (id?: number) => {
    if (!id) {
      router.push(pathname); 
    } else {
      router.push(`${pathname}?category=${id}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleSort()}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
          !activeCategoryId 
            ? "bg-gray-800 text-white" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        すべて
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSort(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            activeCategoryId === cat.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
import UserDeleteButton from '@/app/components/UserDeleteButton';
import LogoutButton from '@/app/components/LogoutButton';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 hover:underline flex items-center gap-1 transition-colors"
        >
          ← 戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">設定</h1>

      <div className="flex flex-col gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h2 className="text-sm font-bold mb-3">セッション</h2>
          <LogoutButton />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h2 className="text-sm font-bold mb-3">アカウント</h2>
          <p className="text-gray-600 text-sm mb-4">
            アカウントを削除すると、すべてのレシピと関連データが削除されます。
          </p>
          <UserDeleteButton />
        </div>
      </div>
    </main>
  );
}

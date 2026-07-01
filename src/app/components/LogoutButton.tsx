'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      alert('ログアウトに失敗しました');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400"
    >
      {loading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}

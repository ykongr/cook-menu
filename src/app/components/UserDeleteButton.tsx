'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDeleteButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // ログイン画面にリダイレクト
        router.push('/login');
      } else {
        const error = await response.json();
        alert(error.error || 'ユーザー削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('ユーザー削除中にエラーが発生しました');
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {showConfirm ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ユーザーを削除しますか？
            </h2>
            <p className="text-gray-600 mb-6">
              この操作は取り消せません。アカウント、すべてのレシピ、および関連データが削除されます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
        >
          アカウントを削除
        </button>
      )}
    </>
  );
}

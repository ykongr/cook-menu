import { PrismaClient } from '@prisma/client'

// PrismaClient のインスタンスを生成する関数
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// グローバルオブジェクトに型を定義
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 既にインスタンスがあればそれを使い、なければ新しく作る
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

// 本番環境以外（開発中）は、グローバルにインスタンスを保存して再利用する
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
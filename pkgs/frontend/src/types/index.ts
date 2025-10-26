import type { ReactNode } from "react";

// Next.js App Router用の型定義
export interface AppRouterPageProps {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

// 共通のコンポーネントプロパティ
export interface ComponentProps {
  children?: ReactNode;
  className?: string;
}

// レイアウト関連の型
export interface LayoutProps {
  children: ReactNode;
}

export * from "./api";
export * from "./nexus";
// プロジェクト固有の型定義は project.ts から import してください
export * from "./project";
export * from "./wallet";

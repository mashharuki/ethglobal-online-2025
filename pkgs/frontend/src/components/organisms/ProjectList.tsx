"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { ExternalLink, Coins, Trash2 } from "lucide-react";
import {
  getStoredProjects,
  deleteProject,
  type ProjectData,
} from "@/utils/projectStorage";

export function ProjectList() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = () => {
      const storedProjects = getStoredProjects();
      setProjects(storedProjects);
      setIsLoading(false);
    };

    loadProjects();
  }, []);

  const handleDeleteProject = (projectId: string) => {
    if (confirm("このプロジェクトを削除しますか？")) {
      deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">プロジェクトを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Coins className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">プロジェクトがありません</h3>
        <p className="text-muted-foreground mb-6">
          新しいプロジェクトを作成して始めましょう
        </p>
        <Button asChild>
          <Link href="/create">プロジェクトを作成</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">作成済みプロジェクト</h2>
        <Button asChild>
          <Link href="/create">新しいプロジェクト</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="border-2 hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl line-clamp-2">
                  {project.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-3">
                {project.description || "説明がありません"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* プロジェクト情報 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">集約先トークン</span>
                  <span className="font-semibold">{project.targetToken}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">集約先チェーン</span>
                  <span className="font-semibold">{project.targetChain}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">作成日</span>
                  <span className="font-semibold">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>

              {/* 統一アドレス */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">統一アドレス</p>
                <code className="text-xs font-mono break-all bg-muted p-2 rounded block">
                  {project.unifiedAddress}
                </code>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 gradient-primary text-white"
                  asChild
                >
                  <Link href={`/admin/${project.id}`}>
                    管理
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link href={`/donate/${project.id}`}>寄付ページ</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";

export default function PromptPreviewDialog({
  open,
  onOpenChange,
  title,
  content,    
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  content: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gray-300 dark:bg-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title ?? "Prompt Preview"}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 bg-gray-200 dark:bg-gray-900">
            <article className="prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || "*No content*"}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
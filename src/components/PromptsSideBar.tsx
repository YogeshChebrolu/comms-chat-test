"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Prompt = {
    name: string;
    slug: string;
    preview: string;
    content: string;
}

export default function PromptSideBar({
  onSelect,
  onPreview,
  currentSystemSlug,

}: {
  onSelect: (slug: string, content: string, name: string) => void;
  onPreview: (slug: string, content: string) => void;
  currentSystemSlug?: string;
}){
  const [ prompts, setPrompts ] = useState<Prompt[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(()=> {
    let mounted = true;
    setLoading(true);
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.prompts) {
          setPrompts(data.prompts);
        } else {
          setPrompts([]);
        }
      })
      .catch((e) => {
        console.error(e);
        setError("Failed to loaded prompts");
      })
      .finally(() => setLoading(false));

      return () => {
        mounted = false;
      }
  }, []);

  return (
    <aside className="w-80 bg-slate-900 text-slate-100 border-r border-slate-800 p-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">System Prompts</h3>
      </div>
      
      <div className="text-sm text-slate-300 mb-3">
        Choose a system prompt to apply it to the chat or preview it.
      </div>

      <ScrollArea className="h-[70vh]" >
        {prompts.map((p)=>(
          <Card
            key={p.slug}
            className={`px-2 py-4 bg-slate-800 border-slate-700 my-4 mx-2
              ${currentSystemSlug === p.slug ? "ring-2 ring-blue-400" : ""}
            `}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="font-medium text-slate-100">{p.slug}</div>
                <div className="mt-2 text-xs text-slate-300 whitespace-pre-wrap max-h-20 overflow-hidden">
                  {p.preview}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-3">
                <Button
                  size="sm"
                  onClick={()=> onSelect(p.slug, p.content, p.name)}
                >
                  Use
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={()=> onPreview(p.name, p.content)}
                >
                  Preview
                </Button>
              </div>
            </div>

          </Card>
        ))}

        {prompts.length === 0 && !loading && (
          <div className="text-sm text-slate-400">No pormpts found</div>
        )}
      </ScrollArea>
    </aside>
  );
};
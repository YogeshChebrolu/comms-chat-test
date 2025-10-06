"use client";

import {useState, useRef, useEffect} from "react";
import PromptSideBar from "@/components/PromptsSideBar";
import PromptPreviewDialog from "@/components/PromptPreviewDialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type role = "user" | "assistant" | "system";

type Message = {
  "role": role,
  "content": string
}
const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hi I am Miko, Ask me anything"
  }
]

export default function Home(){
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentSystemSlug, setCurrentSystemSlug] = useState<string | undefined>(undefined);

  // Preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Sidebar callbacks
  const handleSelectSystem = (slug: string, content: string, name:string) => {
    setCurrentSystemSlug(slug);
    setMessages((prev) => {
      // remove previous system messages then add at top
      const withoutSystem = prev.filter((m) => m.role !== "system");
      return [{ role: "system", content }, ...withoutSystem];
    });
  };

  const handlePreview = (name: string, content: string) => {
    setPreviewTitle(name || "Preview");
    setPreviewContent(content);
    setPreviewOpen(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input},];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const assistantReply = data?.response ?? "No response";
      // Add assistant reply
      setMessages((prev) => [
        ...newMessages,
        { role: "assistant", content: assistantReply}
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev)=>[
        ...newMessages,
        { role: "assistant", "content": "Something went wrong"},
      ])
    } finally {
      setIsTyping(false)
    }
    

  } 

  return (
    <div className="flex h-screen">
      <PromptSideBar
        onSelect={handleSelectSystem}
        onPreview={handlePreview}
        currentSystemSlug={currentSystemSlug}
      />

      <main className="flex-1 flex flex-col bg-slate-800">
        <header className="text-center font-bold text-2xl bg-slate-900 py-3 text-white">
          KAIROS CHATBOT
        </header>

        <section className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] text-sm shadow ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : msg.role === "assistant"
                    ? "bg-gray-200 text-gray-900 rounded-bl-none"
                    : "bg-pink-200 text-gray-900 border-l-4 "
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{(msg.content.slice(0, 20000)).concat("...")}</ReactMarkdown>
                {/* {msg.content} */}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 rounded-lg rounded-bl-none px-4 py-3 max-w-[70%] text-sm shadow">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        <footer className="border-t p-4 bg-slate-100">
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type Something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Send
            </button>
          </div>
        </footer>
      </main>

      <PromptPreviewDialog
        open={previewOpen}
        onOpenChange={(v) => setPreviewOpen(v)}
        title={previewTitle}
        content={previewContent}
      />
    </div>
  );
}
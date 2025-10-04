"use client";
import {useState, useRef, useEffect} from "react";

type Message = {
  "role": "user" | "assistant",
  "content": string
}
const sampleMessages: Message[] = [
  {
    role: "assistant",
    content: "Hi I am Miko, Ask me anything"
  }
]

export default function Home(){
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input},
    ];
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

      // Add assistant reply
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response}
      ])
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "assistant", "content": "Something went wrong"},
      ])
    } finally {
      setIsTyping(false)
    }
    

  } 

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-800">
    <div className="text-center font-bold text-2xl bg-gray-900 rounded-lg py-2">
      KAIROS CHATBOT
    </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm shadow
                ${
                  msg.role==="user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 rounded-lg rounded-bl-none px-4 py-3 max-w-[70%] text-sm shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>
      {/* Input Area */}
      <div className="border-t p-4 bg-gray-200 text-gray-900 rounded-t-md">
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Type Something..."
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key == "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
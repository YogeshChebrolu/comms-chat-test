import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { sysP1, promptFromFileV1 } from "@/app/lib/sys_prompts";

export async function POST(req : Request){
  const { messages } = await req.json();
  console.log(messages)
  const response = await generateText({
    model: openai("gpt-4"),
    messages: messages,
    system: promptFromFileV1
  })
  console.log(response.content[0].text)
  return NextResponse.json({response: response.content[0].text})
}
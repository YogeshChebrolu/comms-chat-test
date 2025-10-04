import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
// import { sysP1 } from "@/app/lib/sys_prompts";

export async function POST(req : Request){
  try {
    const { messages } = await req.json();
    console.log(messages)
    
    const response = await generateText({
      model: openai("gpt-4"),
      messages: messages,
      // system: promptFromFileV1
    })
    
    console.log(response.text)
    return NextResponse.json({response: response.text})
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({error: "Failed to generate response"}, {status: 500});
  }
}
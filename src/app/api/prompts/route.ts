import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const PROMPTS_DIR = path.join(process.cwd(), "src", "app", "lib", "prompts");

function safeBasename(filename: string) {
    return path.basename(filename);
}

export async function GET() {
    try {
        const filenames = fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith(".md"));
        const prompts = filenames.map((file) => {
            const safe = safeBasename(file);
            const fullPath = path.join(PROMPTS_DIR, safe);
            const content = fs.readFileSync(fullPath, "utf-8");
            const preview = content.split("/n").slice(0, 6).join("\n");
            return { name: safe, slug: safe.replace(".md", ""), preview, content };
        });

        return NextResponse.json({prompts});
    } catch (error){
        return NextResponse.json({error: 'Unable to read prompts'}, {status: 500});
    }
}
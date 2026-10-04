import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ARTICLES } from "./articles";

function decode(s: string) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;|&mdash;/g, "—")
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const readArticle = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().max(64) }).parse(d))
  .handler(async ({ data }) => {
    const article = ARTICLES.find((a) => a.id === data.id);
    if (!article) throw new Error("Not found");
    try {
      const res = await fetch(article.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; EmberReader/1.0)", Accept: "text/html" },
      });
      if (!res.ok) return { paragraphs: [] as { tag: string; text: string }[] };
      let html = await res.text();
      html = html.replace(/<(script|style|nav|footer|header|aside|form)[\s\S]*?<\/\1>/gi, "");
      const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? html;
      const out: { tag: string; text: string }[] = [];
      for (const m of main.matchAll(/<(h2|h3|p|li)[^>]*>([\s\S]*?)<\/\1>/gi)) {
        const text = decode(m[2]);
        if (text.length < 25 && m[1].toLowerCase() === "p") continue;
        if (text.length < 3) continue;
        out.push({ tag: m[1].toLowerCase(), text });
        if (out.length > 80) break;
      }
      return { paragraphs: out };
    } catch {
      return { paragraphs: [] as { tag: string; text: string }[] };
    }
  });

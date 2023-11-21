import { Marked } from 'marked';
import markedSequentialHooks from 'marked-sequential-hooks';
import markedHookFrontmatter from 'marked-hook-frontmatter';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

const renderer = new Marked()
    .use(markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        }
      })
    )
    .use(markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter({ dataPrefix: 'metadata' })],
        htmlHooks: [
          (html, data) => {
            console.log(data);
            return html;
          }
        ]
      })
    );

export function renderMarkdown(s: string) {
    return renderer.parse(s);
}

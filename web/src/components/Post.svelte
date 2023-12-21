<script lang="ts">
    import type { Entry } from "../lib/query";
    import { renderMarkdown } from "../lib/render";

    import 'github-markdown-css/github-markdown.css'
    import 'highlight.js/styles/github.css'
//    import 'highlight.js/styles/github-dark.css' // TODO: Toggle import depending on preference


    export let post: Entry|undefined;
    $: content = post ? renderMarkdown(post.content) : "";
</script>

<style>
.post {
    margin-top: 8px;
    border: 1px solid lightgray;
    border-radius: 4px;
    padding: 8px
}
</style>

{#if post}
<div id="post" class="markdown-body">
    {@html content}
</div>
{/if}

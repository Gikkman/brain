<script lang="ts">
    import type { Entry } from "../lib/query";
    import { renderMarkdown } from "../lib/render";

    // Communications channel
    export let post: Entry|undefined;
    $: content = post ? renderMarkdown(post.content) : "";
</script>

<div>
    {@html content}
</div>

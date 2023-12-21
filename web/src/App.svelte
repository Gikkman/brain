<script lang="ts">
    import Post from "./components/Post.svelte";
    import SearchBar from "./components/SearchBar.svelte";
    import type { Entry } from "./lib/query";

    export let post: Entry | undefined;
</script>

<style scoped>
.main {
    width: 100%;
    height: 100%;
}
</style>

<div class="main">
    <SearchBar bind:post />
    <Post bind:post />
</div>

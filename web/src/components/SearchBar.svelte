<script lang="ts">
    import AutoComplete from "simple-svelte-autocomplete";
    import { getEntry, remoteQuery, type QueryResult, type Entry } from "../lib/query";

    export let post: Entry;

    async function query(keyword: string) {
        if (!keyword) return [];
        const newResult = await remoteQuery(keyword);
        return newResult;
    }

    async function onChange(item: QueryResult) {
        post = await getEntry(item)
    }
</script>

<div class="auto-complete">
    <AutoComplete
        delay="250"
        className="auto-complete"
        searchFunction={query}
        localSorting={true}
        localFiltering={false}
        cleanUserText={false}
        minCharactersToSearch="3"
        maxItemsToShowInList="20"
        labelFieldName="title"
        placeholder="Search for a post"
        {onChange}
    />
</div>

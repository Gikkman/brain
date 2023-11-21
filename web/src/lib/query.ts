export type QueryResult = { name: string, index: number };
export type Entry = {title: string, tags: string[], created: number, updated?: number, content: string};

export async function remoteQuery(keyword: string) {
  // Fetch from the server if it is a new search
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, 5_000);
  try {
    const response = await fetch(`/entry?query=${keyword}`, { signal: controller.signal });
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      return data;
    }
  } catch (ex) {
    console.error(ex);
  }
  return [];
}

export async function getEntry(item: QueryResult): Promise<Entry> {
  if(!item) return undefined
  console.log(item)
  const response = await fetch(`/entry/${item.index}`);
  if (response.status >= 200 && response.status < 300) {
    return await response.json();
  }
}

import {join} from "path";

import Fastify, { FastifyRequest } from 'fastify';
import { readEntryByIndex } from "../../common/entries";

const fastify = Fastify({
    logger: true
});

type SearchEntry = FastifyRequest<{Params: { query: string }}>;
fastify.get("/entry", async (request: SearchEntry, response) => {
    const entries = [await readEntryByIndex(1), await readEntryByIndex(2), await readEntryByIndex(3), await readEntryByIndex(4)]
    const out = entries.flatMap(e => e ? [e] : []).map(e => ({title: e.title, index: e.index}))
    return out;
});

type GetEntry = FastifyRequest<{Params: { index: number }}>;
fastify.get("/entry/:index", async (request: GetEntry, response) => {
    const index = request.params.index;
    const entry = await readEntryByIndex(index);
    if(!entry) {
        return response.status(404).send(`No entry found for index ${index}`);
    }
    return entry;
});

const staticPath = join(process.cwd(), "..", "web", "dist");

fastify.listen({port: 8080})

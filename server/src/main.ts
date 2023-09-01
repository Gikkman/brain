import {join} from "path";

import Fastify, { FastifyRequest } from 'fastify';
import { getEntry, readEntry } from "./entries.js";

const fastify = Fastify({
    logger: true
});


type PostApi = FastifyRequest<{Querystring: { q: string }}>;
fastify.post("/api", (request: PostApi) => {
    const {q} = request.query;
    if(q) console.log("Hello " + q);
    else console.log("Hello")
    return "OK";
})

type GetEntry = FastifyRequest<{Params: { index: number }}>;
fastify.get("/entry/:id", async (request: GetEntry, response) => {
    const index = request.params.index;
    const entry = await getEntry(index);
    if(!entry) {
        return response.status(404).send(`No entry found for index ${index}`);
    }
    const content = await readEntry(entry);
    return content;
});

const staticPath = join(process.cwd(), "..", "web", "dist");

fastify.listen({port: 8080})

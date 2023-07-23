import express from "express";
import {join} from "path";
import * as url from "url";

const app = express();

const listener = app.listen(8080, () => {
    const address = listener.address();
    if(address && typeof address === "object" && "port" in address) {
        console.log("Listening to http://localhost:" + address.port)
    }
})

app.post("/api", (req,res) => {
    const {q} = req.query;
    if(q) console.log("Hello " + q);
    else console.log("Hello")
    res.send("OK")
})

const staticPath = join(process.cwd(), "..", "web", "dist");
app.use("/", express.static(staticPath))
const express = require("express");
var proxy = require("express-http-proxy");
const fetch = require("node-fetch");
const app = express();
const puppeteer = require("puppeteer");
const mainURL = "http://localhost:3090";

// app.use("/", proxy(mainURL));

app.get("*", async (req, res) => {
    const pattern = /\.[0-9a-z]{1,5}$/gi;
    const ignore = req.originalUrl.match(pattern);

    console.log("request url: " + req.originalUrl);

    // process page
    if (!ignore) {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--font-render-hinting=none", "--force-color-profile=srgb"]
        });
        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
        );

        const local_url = mainURL + req.originalUrl;
        await page.goto(local_url, { waitUntil: "networkidle0" });

        const html = await page.evaluate(() => {
            return document.documentElement.innerHTML;
        });

        res.send(html);
    } else {
        await fetch(mainURL + req.originalUrl).then(result => res.send(result.text()));
    }
});

app.listen(3000, () => console.log(`Server is listening on port: 3000`));

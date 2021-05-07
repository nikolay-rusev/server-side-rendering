const express = require("express");
const proxy = require("express-http-proxy");
const app = express();
const puppeteer = require("puppeteer");
const mainURL = "http://localhost:3090";

const handleSSR = async (req, res) => {
    const browser = await puppeteer.launch({
        headless: true
        // args: ["--font-render-hinting=none", "--force-color-profile=srgb"]
    });
    const page = await browser.newPage();
    // await page.setUserAgent(
    //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    // );

    const localURL = mainURL + req.originalUrl;
    await page.goto(localURL, { waitUntil: "networkidle2" });

    const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    res.send(html);
};

app.get("/api*", proxy(mainURL));
app.get("*.*", proxy(mainURL));
app.get("*", handleSSR);
// app.get("/?context=*", handleSSR);

app.listen(3000, () => console.log(`Server is listening on port: 3000`));

const express = require("express");
const app = express();
const puppeteer = require("puppeteer");

app.get("*", async (req, res) => {
    console.log("request url: " + req.url);

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--font-render-hinting=none", "--force-color-profile=srgb"]
    });
    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    const local_url = "http://localhost:3090" + req.originalUrl;
    await page.goto(local_url, { waitUntil: "networkidle0" });

    const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    res.send(html);
});

app.listen(3000, () => console.log(`Server is listening on port: 3000`));

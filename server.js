const express = require("express");
const app = express();
const puppeteer = require("puppeteer");

app.get("*", async (req, res) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log("req.originalUrl: " + req.originalUrl);

    const local_url = "http://localhost:3090" + req.originalUrl;
    await page.goto(local_url, {
        waitUntil: "networkidle0"
    });

    const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    res.send(html);
});

app.listen(3000, () => console.log(`Server is listening on port: 3000`));

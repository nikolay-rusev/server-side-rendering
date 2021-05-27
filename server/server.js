const express = require("express");
const puppeteer = require("puppeteer");
// const devices = require("puppeteer/lib/cjs/puppeteer/common/DeviceDescriptors");
const proxy = require("express-http-proxy");
const app = express();
const mainURL = "http://localhost:3090";

const handleSSR = async (req, res) => {
    // const iPhonex = devices["iPhone X"];

    const browser = await puppeteer.launch({
        headless: false
        // args: ["--font-render-hinting=none", "--force-color-profile=srgb"]
    });
    const page = await browser.newPage();
    // await page.setUserAgent(
    //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    // );

    const localURL = mainURL + req.originalUrl;
    console.log("SSR request to " + localURL + "");
    await page.setViewport({ width: 1280, height: 800 });
    // await page.emulate(iPhonex);
    await page.goto(localURL, { waitUntil: "networkidle2" });
    await page.screenshot({ path: "./screenshots/screenshot.png" });

    const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    res.send(html);

    await browser.close();
};

function proxyFunc(url) {
    console.log("Proxy request to " + url + "");
    return proxy(url);
}

app.get("/api*", proxyFunc(mainURL));
app.get("*.*", proxyFunc(mainURL));
app.get("*", handleSSR);
// app.get("/?context=*", handleSSR);

app.listen(3000, () => console.log(`Server is listening on port: 3000`));

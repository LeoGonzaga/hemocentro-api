const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");

var app = express();
const port = process.env.PORT || 3090;


app.use(cors());
app.get("/", async function (req, res) {
    let dataHemominas = await scrapHemominas();
    res.json({ dataHemominas });
});


app.listen(port, () => {
    console.log(`A NodeJS API is listining on port: ${port}`);
  });
  
async function scrapHemominas() {
    const browser = await puppeteer.launch({
         //headless: false,
    });
    const page = await browser.newPage();
    await page.goto(`http://www.hemominas.mg.gov.br/`);
    let data = await page.evaluate(() => {
         return Array.from(document.querySelectorAll("div.bolsasangue.span3 ")).map((data) => ({
            type: data.children[0].textContent,
            state: data.children[2].textContent,
            img: data.children[1].children[0].currentSrc,
        }));
    });
    await page.close();
    return data;
}
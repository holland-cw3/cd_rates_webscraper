const puppeteer = require('puppeteer');


const main = async () => {
    const url = 'https://www.navyfederal.org/checking-savings/savings/savings-resources/certificate-rates.html';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const allArticles = await page.evaluate (()=>{
        const articles = document.querySelectorAll('tr');

        return Array.from(articles).slice(3,7).map((article) => {
            const term = article.querySelector('th').innerHTML;

            const tdElements = Array.from(article.querySelectorAll('td'));
            
            const dataTh = tdElements.map((td) => td.getAttribute('data-th'));
            const rates = tdElements.map((td) => td.innerHTML);

            return { term, dataTh, rates };
        });
    });
    
    //console.log(allArticles);
    //await page.close();

    console.log("complete");
    return allArticles;

}

const express = require('express');
const app = express();

app.get('/data', async (req, res) => {
    try {
        const data = await main();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.listen(5000, () => {console.log("Server started on port 5000")});









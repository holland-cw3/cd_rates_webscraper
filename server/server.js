const puppeteer = require('puppeteer'); //Treats loading any webpage as if it were in Chrome

//only set-up to work for NFCU so far
const main = async () => {
    const url = 'https://www.navyfederal.org/checking-savings/savings/savings-resources/certificate-rates.html';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const allArticles = await page.evaluate(() => {
        //getting table elements 
        const articles = document.querySelectorAll('tr');
    
        return Array.from(articles).slice(6, 14).map((article) => {
                const term = article.querySelector('th').innerHTML;
                const tdElements = Array.from(article.querySelectorAll('td'));
                const dataTh = tdElements.map((td) => td.getAttribute('data-th'));
                const rates = tdElements.map((td) => td.innerHTML);
    
                return { term, dataTh, rates };
                
            }).filter((article) => article.term !== 'Term');
    });

    console.log("complete"); //indicates that scraping has completed
    return allArticles;

}

const express = require('express');
const app = express();

app.get('/data', async (req, res) => {
    try { //Put all data returned by main into a json and host it on some sort of local port
        const data = await main();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.listen(5004, () => {console.log("Server started on port 5001")});









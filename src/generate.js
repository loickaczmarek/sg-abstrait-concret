const fs = require('fs');
const puppeteer = require('puppeteer');

async function generateHTML() {
    const data = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`));
    let cardsHTML = '';
    let count = 0;

    for (const deckName in data) {
        for (const sujet of data[deckName].sujets) {
            if (count % 20 === 0) {
                if (count > 0) cardsHTML += `</div>`; // Ferme la page précédente
                cardsHTML += `<div class="page">`; // Nouvelle page
            }
            cardsHTML += `
            <div class="card">
                <div class="deck-name">Sujet - ${deckName}</div>
                <div class="card-content"><b>${sujet}</b></div>
            </div>
        `;
            count++;
        }
        for (const role of data[deckName].roles) {
            if (count % 20 === 0) {
                if (count > 0) cardsHTML += `</div>`; // Ferme la page précédente
                cardsHTML += `<div class="page">`; // Nouvelle page
            }
            cardsHTML += `
            <div class="card">
                <div class="deck-name">Rôle - ${deckName}</div>
                <div class="card-content"><b>${role}</b></div>
            </div>
        `;
            count++;
        }
    }
    cardsHTML += `</div>`; // Ferme la dernière page

    let html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
    html = html.replace('<!-- Les cartes seront insérées ici -->', cardsHTML);
    fs.writeFileSync(`${__dirname}/../data/output.html`, html);
    console.log("✅ HTML généré avec succès !");
}

async function generatePDF() {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.goto(`file://${__dirname}/../data/output.html`);
    await page.pdf({path: `${__dirname}/../data/cartes.pdf`, format: 'A4', printBackground: true});
    await browser.close();
    console.log("✅ PDF généré avec succès !");
}

async function main() {
    await generateHTML();
    await generatePDF();
}

main();
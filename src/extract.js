const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile(`${__dirname}/../data/cartes.xlsx`);
const decks = {};

workbook.SheetNames.forEach(sheetName => {
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    decks[sheetName] = {
        sujets: sheet.map(row => row['Sujets']).filter(value => value !== undefined),
        roles: sheet.map(row => row['Rôles']).filter(value => value !== undefined)
    };
});

fs.writeFileSync(`${__dirname}/../data/data.json`, JSON.stringify(decks, null, 2));
console.log("✅ Données extraites avec succès !");
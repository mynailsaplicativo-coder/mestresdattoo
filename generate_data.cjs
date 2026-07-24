const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'fotos artistas');
const outPath = path.join(__dirname, 'src', 'contentData.js');

const files = fs.readdirSync(imgDir);

let artists = [];

files.forEach(file => {
  if(!file.match(/\.(jpg|jpeg|png)$/i)) return;
  let name = file.replace(/\.(jpg|jpeg|png)$/i, '').trim();
  // Cleanup name if it has trailing dashes
  name = name.replace(/\s*[—\-]\s*$/, '');
  
  let category = 'Mestres';
  if(['Cap Coleman', 'Amund Dietzel', 'Betty Broadbent', 'Horst Streckenbach', 'Cliff Raven', 'Jacci Gresham', 'Mary Jane Haake', 'Samuel O’Reilly', 'Charlie Wagner', 'Bert Grimm'].some(n => name.toLowerCase().includes(n.toLowerCase()))) {
    category = 'Era de Ouro';
  } else if(['Sailor Jerry', 'Horiyoshi III', 'Lyle Tuttle', 'Whang-od', 'Filip Leu', 'George Burchett', 'Jessie Knight', 'Ed Hardy'].some(n => name.toLowerCase().includes(n.toLowerCase()))) {
    category = 'Lendas';
  }

  artists.push({
    name: name,
    years: 'Contemporâneo', // fallback
    desc: `Mestre da Tatuagem: ${name}`,
    imageUrl: `/fotos artistas/${file}`,
    category: category
  });
});

const oldContentData = fs.readFileSync(outPath, 'utf8');
const articlesMatch = oldContentData.match(/export const magazineArticles = \[\s*([\s\S]*?)\s*\];/);
const articles = articlesMatch ? articlesMatch[0] : 'export const magazineArticles = [];';

const newContent = `${articles}

export const featuredArtists = ${JSON.stringify(artists, null, 2)};
`;

fs.writeFileSync(outPath, newContent);
console.log('Done!');

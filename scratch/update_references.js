const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/page.tsx',
  'app/layout.tsx',
  'components/HeroParallax.tsx',
  'components/GalleryPage.tsx',
  'components/Footer.tsx'
];

const arabicToEnglish = {
  'بوستر.png': 'images/poster.webp',
  'غيوم صغيرة.png': 'images/cloud_small_1.webp',
  'غيووم صغيرة.png': 'images/cloud_small_2.webp',
  'غغغيم.png': 'images/clouds_new.webp'
};

function updateFiles() {
  filesToUpdate.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace specific Arabic mappings if any (though grep didn't find them)
    Object.keys(arabicToEnglish).forEach(arabic => {
      content = content.replace(new RegExp(arabic, 'g'), arabicToEnglish[arabic]);
    });

    // 2. Replace all .png with .webp
    // Be careful with common strings, but in this project it's mostly image paths.
    // We match ".png" followed by quote or whitespace or slash or end of line.
    content = content.replace(/\.png(?=["'\s\b])/g, '.webp');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  });
}

updateFiles();

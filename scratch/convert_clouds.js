const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const arabicMapping = {
  'بوستر.png': 'poster.webp',
  'غيوم صغيرة.png': 'cloud_small_1.webp',
  'غيووم صغيرة.png': 'cloud_small_2.webp',
  'غغغيم.png': 'clouds_new.webp'
};

async function convertAll() {
  const allFiles = getAllFiles(publicDir);
  const pngFiles = allFiles.filter(f => f.toLowerCase().endsWith('.png'));

  console.log(`Found ${pngFiles.length} PNG files to convert.`);

  for (const pngPath of pngFiles) {
    const filename = path.basename(pngPath);
    let outputName;
    
    if (arabicMapping[filename]) {
      outputName = arabicMapping[filename];
      // For Arabic ones, we might want to put them in public/images
      const imagesDir = path.join(publicDir, 'images');
      if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
      var outputPath = path.join(imagesDir, outputName);
    } else {
      outputName = filename.replace(/\.png$/i, '.webp');
      var outputPath = pngPath.replace(/\.png$/i, '.webp');
    }

    console.log(`Converting: ${filename} -> ${outputName}`);

    try {
      execSync(`ffmpeg -y -i "${pngPath}" -q:v 80 "${outputPath}"`, { stdio: 'inherit' });
      console.log(`Success. Deleting original...`);
      fs.unlinkSync(pngPath);
    } catch (err) {
      console.error(`Error converting ${filename}:`, err.message);
    }
  }
}

convertAll().then(() => {
  console.log('Conversion phase complete.');
});

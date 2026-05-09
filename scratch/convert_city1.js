const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convert() {
  const input = path.join(process.cwd(), 'public', 'images', 'city1.png');
  const output = path.join(process.cwd(), 'public', 'images', 'city1.webp');

  if (!fs.existsSync(input)) {
    console.error('Source file not found:', input);
    return;
  }

  try {
    console.log('Starting conversion of city1.png...');
    await sharp(input)
      .webp({ quality: 90, effort: 6 }) // High quality, high effort for better compression
      .toFile(output);
    console.log('Successfully converted city1.png to city1.webp');
    
    // Log sizes for comparison
    const oldSize = fs.statSync(input).size / 1024;
    const newSize = fs.statSync(output).size / 1024;
    console.log(`Original Size: ${oldSize.toFixed(2)} KB`);
    console.log(`WebP Size: ${newSize.toFixed(2)} KB`);
    console.log(`Reduction: ${(((oldSize - newSize) / oldSize) * 100).toFixed(1)}%`);

  } catch (err) {
    console.error('Conversion failed:', err);
  }
}

convert();

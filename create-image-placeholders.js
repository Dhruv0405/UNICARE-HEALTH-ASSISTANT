const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Function to create an actual image file as a placeholder
function createImagePlaceholder(fileName, width = 300, height = 200, bgColor = '#cccccc', textColor = '#333333', text = '') {
    // Create a canvas with the specified dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text by spaces if it's too long
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < canvas.width - 20) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    
    // Draw text lines
    const lineHeight = 30;
    const startY = height/2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, i) => {
        ctx.fillText(line, width/2, startY + i * lineHeight);
    });
    
    // Create a buffer with the image data
    let buffer;
    if (fileName.endsWith('.png')) {
        buffer = canvas.toBuffer('image/png');
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        buffer = canvas.toBuffer('image/jpeg');
    } else {
        buffer = canvas.toBuffer('image/png');
    }
    
    // Write the buffer to a file
    const filePath = path.join(imagesDir, fileName);
    fs.writeFileSync(filePath, buffer);
    console.log(`Created: ${fileName}`);
}

// List of placeholder images to create (same as before)
const imagesToCreate = [
    { fileName: 'medicine-icon.png', width: 300, height: 200, bgColor: '#0088cc', textColor: '#ffffff', text: 'Medicine Icon' },
    { fileName: 'lab-test-icon.png', width: 300, height: 200, bgColor: '#cc0000', textColor: '#ffffff', text: 'Lab Test Icon' },
    { fileName: 'doctor-icon.png', width: 300, height: 200, bgColor: '#00cc00', textColor: '#ffffff', text: 'Doctor Icon' },
    { fileName: 'healthcare-icon.png', width: 300, height: 200, bgColor: '#cc00cc', textColor: '#ffffff', text: 'Healthcare Icon' },
    { fileName: 'nutrition-banner.jpg', width: 800, height: 300, bgColor: '#cccccc', textColor: '#333333', text: 'Nutrition Banner' },
    { fileName: 'cancer-care.jpg', width: 800, height: 300, bgColor: '#eeeeee', textColor: '#333333', text: 'Cancer Care' },
    { fileName: 'covid-essentials.png', width: 200, height: 200, bgColor: '#ff0000', textColor: '#ffffff', text: 'Covid Essentials' },
    { fileName: 'diabetes.png', width: 200, height: 200, bgColor: '#00ff00', textColor: '#333333', text: 'Diabetes Care' },
    { fileName: 'cardiac.png', width: 200, height: 200, bgColor: '#0000ff', textColor: '#ffffff', text: 'Cardiac Care' },
    { fileName: 'stomach.png', width: 200, height: 200, bgColor: '#ffff00', textColor: '#333333', text: 'Stomach Care' },
    { fileName: 'vitamins.png', width: 200, height: 200, bgColor: '#ff00ff', textColor: '#ffffff', text: 'Vitamins & Supplements' },
    { fileName: 'personal-care.png', width: 200, height: 200, bgColor: '#00ffff', textColor: '#333333', text: 'Personal Care' },
    { fileName: 'product1.jpg', width: 300, height: 300, bgColor: '#eeeeee', textColor: '#333333', text: 'Product 1' },
    { fileName: 'vitamind3.jpg', width: 300, height: 300, bgColor: '#eeeeee', textColor: '#333333', text: 'Vitamin D3' },
    { fileName: 'glucose-monitor.jpg', width: 300, height: 300, bgColor: '#eeeeee', textColor: '#333333', text: 'Glucose Monitor' },
];

// Before running, install the canvas package
console.log('First install the canvas package:');
console.log('npm install canvas');
console.log('Then run this script again.');

// Create all images
function createAllImages() {
    try {
        imagesToCreate.forEach(img => 
            createImagePlaceholder(
                img.fileName, 
                img.width, 
                img.height, 
                img.bgColor, 
                img.textColor, 
                img.text
            )
        );
        console.log('All placeholder images created successfully!');
    } catch (error) {
        console.error('Error creating images:', error);
    }
}

// Uncomment this line after installing the canvas package
createAllImages(); 
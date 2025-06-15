const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Create a simple colored square with text as a placeholder
function createPlaceholderImage(fileName, width = 300, height = 200, bgColor = '#cccccc', textColor = '#333333', text = '') {
    // Create an HTML file that uses CSS to display a colored div with text
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Placeholder</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
        }
        .placeholder {
            width: 100%;
            height: 100%;
            background-color: ${bgColor};
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            color: ${textColor};
            font-size: 24px;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div class="placeholder">${text}</div>
</body>
</html>`;

    // Write the HTML file to the images directory
    const filePath = path.join(imagesDir, fileName);
    fs.writeFileSync(filePath, htmlContent);
    console.log(`Created: ${fileName}`);
}

// List of placeholder images to create
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

// Create all images
function createAllImages() {
    try {
        imagesToCreate.forEach(img => 
            createPlaceholderImage(
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

createAllImages(); 
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Placeholder images to download
const imagesToDownload = [
    { 
        url: 'https://via.placeholder.com/300x200/0088cc/ffffff?text=Medicine-Icon', 
        fileName: 'medicine-icon.png' 
    },
    { 
        url: 'https://via.placeholder.com/300x200/cc0000/ffffff?text=Lab-Test-Icon', 
        fileName: 'lab-test-icon.png' 
    },
    { 
        url: 'https://via.placeholder.com/300x200/00cc00/ffffff?text=Doctor-Icon', 
        fileName: 'doctor-icon.png' 
    },
    { 
        url: 'https://via.placeholder.com/300x200/cc00cc/ffffff?text=Healthcare-Icon', 
        fileName: 'healthcare-icon.png' 
    },
    { 
        url: 'https://via.placeholder.com/800x300/cccccc/333333?text=Nutrition+Banner', 
        fileName: 'nutrition-banner.jpg' 
    },
    { 
        url: 'https://via.placeholder.com/800x300/eeeeee/333333?text=Cancer+Care', 
        fileName: 'cancer-care.jpg' 
    },
    { 
        url: 'https://via.placeholder.com/200x200/ff0000/ffffff?text=Covid', 
        fileName: 'covid-essentials.png' 
    },
    { 
        url: 'https://via.placeholder.com/200x200/00ff00/333333?text=Diabetes', 
        fileName: 'diabetes.png' 
    },
    { 
        url: 'https://via.placeholder.com/200x200/0000ff/ffffff?text=Cardiac', 
        fileName: 'cardiac.png' 
    },
    { 
        url: 'https://via.placeholder.com/200x200/ffff00/333333?text=Stomach', 
        fileName: 'stomach.png' 
    },
    { 
        url: 'https://via.placeholder.com/200x200/ff00ff/ffffff?text=Vitamins', 
        fileName: 'vitamins.png' 
    },
    { 
        url: 'https://via.placeholder.com/200x200/00ffff/333333?text=Personal+Care', 
        fileName: 'personal-care.png' 
    },
    { 
        url: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Product+1', 
        fileName: 'product1.jpg' 
    },
    { 
        url: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Vitamin+D3', 
        fileName: 'vitamind3.jpg' 
    },
    { 
        url: 'https://via.placeholder.com/300x300/eeeeee/333333?text=Glucose+Monitor', 
        fileName: 'glucose-monitor.jpg' 
    },
];

// Download function
function downloadImage(url, fileName) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(imagesDir, fileName);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${fileName}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {}); // Delete the file if error occurs
            console.error(`Error downloading ${fileName}: ${err.message}`);
            reject(err);
        });
    });
}

// Download all images
async function downloadAllImages() {
    try {
        const promises = imagesToDownload.map(img => 
            downloadImage(img.url, img.fileName)
        );
        await Promise.all(promises);
        console.log('All images downloaded successfully!');
    } catch (error) {
        console.error('Error downloading images:', error);
    }
}

downloadAllImages(); 
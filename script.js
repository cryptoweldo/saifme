document.getElementById('layer0').addEventListener('change', handleBaseImageUpload);
document.getElementById('downloadBtn').addEventListener('click', downloadImage);
document.getElementById('removeBtn').addEventListener('click', removeBaseImage);
document.getElementById('enlargeBtn').addEventListener('click', enlargeBaseImage);
document.getElementById('reduceBtn').addEventListener('click', reduceBaseImage);

let baseImage = new Image();
let topImage = new Image();
let baseImageLoaded = false;
let baseImageX = 0;
let baseImageY = 0;
let baseImageScale = 1;
let isDragging = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load the default top image
topImage.src = 'imgs/saif.png';
topImage.onload = function() {
    drawImages();
};

// Function to handle base image upload
function handleBaseImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        baseImage.src = e.target.result;
        baseImage.onload = function() {
            baseImageLoaded = true;
            baseImageX = 0;
            baseImageY = 0;
            baseImageScale = 1;
            drawImages();
            document.getElementById('buttonContainer').classList.remove('hidden');
            updateTitle('Image Uploaded');
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    }
    // Reset file input to allow re-uploading the same file
    event.target.value = '';
}

// Function to remove the base image
function removeBaseImage() {
    baseImageLoaded = false;
    drawImages();
    updateTitle('Image Removed');
    // Reset file input to allow re-uploading
    document.getElementById('layer0').value = '';
    document.getElementById('buttonContainer').classList.add('hidden');
}

// Function to enlarge the base image
function enlargeBaseImage() {
    if (baseImageLoaded) {
        baseImageScale *= 1.1;
        drawImages();
        updateTitle('Image Enlarged');
    }
}

// Function to reduce the base image
function reduceBaseImage() {
    if (baseImageLoaded) {
        baseImageScale /= 1.1;
        drawImages();
        updateTitle('Image Reduced');
    }
}

// Function to draw images on the canvas
function drawImages() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image if it is loaded
    if (baseImageLoaded) {
        const aspectRatio = baseImage.width / baseImage.height;
        let drawWidth, drawHeight;

        if (aspectRatio > 1) {
            // Image is wider than canvas
            drawWidth = canvas.width * baseImageScale;
            drawHeight = drawWidth / aspectRatio;
        } else {
            // Image is taller than canvas
            drawHeight = canvas.height * baseImageScale;
            drawWidth = drawHeight * aspectRatio;
        }

        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        ctx.drawImage(baseImage, baseImageX + offsetX, baseImageY + offsetY, drawWidth, drawHeight);
    }

    // Draw top image
    ctx.drawImage(topImage, 0, 0, canvas.width, canvas.height);
}

// Function to download the combined image
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'Abdul-Saif.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    updateTitle('Image Downloaded');
}


// Mouse event handlers for dragging
canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= baseImageX && x <= baseImageX + canvas.width &&
        y >= baseImageY && y <= baseImageY + canvas.height) {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        baseImageX = e.clientX - rect.left - canvas.width / 2;
        baseImageY = e.clientY - rect.top - canvas.height / 2;
        drawImages();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

canvas.addEventListener('mouseleave', function() {
    isDragging = false;
});

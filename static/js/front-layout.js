// Function to initialize Fabric.js canvas
const initializeCanvas = (id, defaultImageUrl) => {
    const canvas = new fabric.Canvas(id, {});

    // Set default background image
    if (defaultImageUrl) {
        fabric.Image.fromURL(defaultImageUrl, (img) => {
            const container = canvas.wrapperEl.parentNode.getBoundingClientRect();
            const maxContainerWidth = container.width * 0.9;
            const maxContainerHeight = container.height * 0.9;

            const imageAspectRatio = img.width / img.height;
            let canvasWidth, canvasHeight;

            if (img.width > img.height) {
                canvasWidth = Math.min(img.width, maxContainerWidth);
                canvasHeight = canvasWidth / imageAspectRatio;
                if (canvasHeight > maxContainerHeight) {
                    canvasHeight = maxContainerHeight;
                    canvasWidth = canvasHeight * imageAspectRatio;
                }
            } else {
                canvasHeight = Math.min(img.height, maxContainerHeight);
                canvasWidth = canvasHeight * imageAspectRatio;
                if (canvasWidth > maxContainerWidth) {
                    canvasWidth = maxContainerWidth;
                    canvasHeight = canvasWidth / imageAspectRatio;
                }
            }

            canvas.setWidth(canvasWidth);
            canvas.setHeight(canvasHeight);

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height,
                originX: 'left',
                originY: 'top'
            });

            const canvasElement = canvas.getElement();
            canvasElement.style.position = 'absolute';
            canvasElement.style.left = '50%';
            canvasElement.style.top = '50%';
            canvasElement.style.transform = 'translate(-50%, -50%)';
        });
    }

    return canvas;
};

// Function to set background image on canvas and resize
const setBackgroundAndResizeCanvas = (url, canvas, container) => {
    fabric.Image.fromURL(url, (img) => {
        const maxContainerWidth = container.width * 0.9;
        const maxContainerHeight = container.height * 0.9;

        const imageAspectRatio = img.width / img.height;
        let canvasWidth, canvasHeight;

        if (img.width > img.height) {
            canvasWidth = Math.min(img.width, maxContainerWidth);
            canvasHeight = canvasWidth / imageAspectRatio;
            if (canvasHeight > maxContainerHeight) {
                canvasHeight = maxContainerHeight;
                canvasWidth = canvasHeight * imageAspectRatio;
            }
        } else {
            canvasHeight = Math.min(img.height, maxContainerHeight);
            canvasWidth = canvasHeight * imageAspectRatio;
            if (canvasWidth > maxContainerWidth) {
                canvasWidth = maxContainerWidth;
                canvasHeight = canvasWidth / imageAspectRatio;
            }
        }

        canvas.setWidth(canvasWidth);
        canvas.setHeight(canvasHeight);

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
            originX: 'left',
            originY: 'top'
        });

        const canvasElement = canvas.getElement();
        canvasElement.style.position = 'absolute';
        canvasElement.style.left = '50%';
        canvasElement.style.top = '50%';
        canvasElement.style.transform = 'translate(-50%, -50%)';
    });
};

// Function to lock text object controls
const lockTextObject = (obj) => {
    if (obj && obj.type === 'i-text') {
        obj.set({
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true
        });
        obj.setControlsVisibility({
            mt: false, mb: false, ml: false, mr: false,
            tl: false, tr: false, bl: false, br: false
        });
    }
};

// Function to update text properties for selected objects
const updateSelectedTextObjects = (objects, properties) => {
    objects.forEach(obj => {
        if (obj.type === 'i-text') {
            obj.set(properties);
            lockTextObject(obj); // Ensure text object remains locked
        }
    });
    canvas.renderAll();
};

// Array of available fonts
const fonts = [
    "Arial", "Arial Black", "Verdana", "Tahoma", "Trebuchet MS", "Impact",
    "Times New Roman", "Didot", "Georgia", "American Typewriter", "Courier",
    "Courier New", "Brush Script MT", "Comic Sans MS", "Lucida Console",
    "Monaco", "Palatino", "Garamond", "Bookman", "Avant Garde", "Candara",
    "Arial Narrow", "Arial Rounded MT Bold", "Helvetica", "Gill Sans",
    "Calibri", "Century Gothic", "Lucida Sans", "Franklin Gothic Medium",
    "Lucida Bright", "Segoe UI", "Open Sans", "Roboto", "Lato", "Oswald",
    "Montserrat", "Source Sans Pro", "PT Sans", "Droid Sans", "Oxygen",
    "Fira Sans", "Exo 2", "Merriweather", "Raleway", "Slabo 27px", "Bitter",
    "Lora", "Roboto Slab", "Open Sans Condensed", "Yanone Kaffeesatz"
];

// DOM elements
const canvas = initializeCanvas('canvas', "/uploads/front.png");
const container = document.getElementById('workspace').getBoundingClientRect();
const fontFamilySelect = document.getElementById('font-family');
const fontSizeInput = document.getElementById('font-size');
const textColorInput = document.getElementById('text-color');
const fileInput = document.getElementById('fileInput');

// Initialize font family options
fonts.forEach(font => {
    const option = document.createElement('option');
    option.value = font;
    option.textContent = font;
    if (font === "Arial") option.selected = true;
    fontFamilySelect.appendChild(option);
});

// Event listener for text tool
$('#text').on('click', () => {
    canvas.isDrawingMode = false;
    const text = new fabric.IText('Lorem ipsum', {
        left: 40,
        top: 40,
        objecttype: 'text',
        fontFamily: fontFamilySelect.value,
        fill: textColorInput.value,
        fontSize: parseInt(fontSizeInput.value, 10) || 40
    });
    lockTextObject(text);
    canvas.add(text);
});

// Event listener for replace button
$('#replace').on('click', () => {
    fileInput.click();
});

// Event listener for file input change
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const imageUrl = URL.createObjectURL(file);
                setBackgroundAndResizeCanvas(imageUrl, canvas, container);
            } else {
                console.error('Failed to upload image');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

// Event listeners for text property controls
['change', 'input'].forEach(event => {
    fontFamilySelect.addEventListener(event, () => {
        updateSelectedTextObjects(canvas.getActiveObjects(), { fontFamily: fontFamilySelect.value });
    });
    textColorInput.addEventListener(event, () => {
        updateSelectedTextObjects(canvas.getActiveObjects(), { fill: textColorInput.value });
    });
    fontSizeInput.addEventListener(event, () => {
        updateSelectedTextObjects(canvas.getActiveObjects(), { fontSize: parseInt(fontSizeInput.value, 10) });
    });
});

document.getElementById('save').addEventListener('click', () => {
    const canvasObjects = canvas.getObjects().map(obj => {
        if (obj.type === 'group') {
            const text = obj.getObjects().find(innerObj => innerObj.type === 'text');
            
            return {
                text: text ? text.text : '',
                type: 'group',
                left: obj.left,
                top: obj.top,
                width: obj.width,
                height: obj.height,
                angle: obj.angle,
            };
        } else {
            return {
                text: obj.text || '',
                type: obj.type,
                left: obj.left,
                top: obj.top,
                width: obj.width,
                height: obj.height,
                angle: obj.angle,
                fill: obj.fill,
                fontFamily: obj.fontFamily,
                fontSize: obj.fontSize
            };
        }
    });

    console.log(JSON.stringify(canvasObjects, null, 2));
});
// TK instead of console give this to the server


$('#remove').on('click', function () {
    canvas.isDrawingMode = false;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(object => canvas.remove(object));
    canvas.discardActiveObject().renderAll();
});

canvas.on('selection:created', (event) => {
    const selectedObjects = event.selected;
    $('#remove').prop('disabled', selectedObjects.length === 0);
    if (selectedObjects.length === 1 && selectedObjects[0].type === 'i-text') {
        const selectedObject = selectedObjects[0];
        fontFamilySelect.value = selectedObject.fontFamily;
        textColorInput.value = selectedObject.fill;
        fontSizeInput.value = selectedObject.fontSize;
        lockTextObject(selectedObject);
    }
});

canvas.on('selection:cleared', function () {
    $('#remove').prop('disabled', 'disabled');
    fontFamilySelect.disabled = false;
    textColorInput.disabled = false;
    fontSizeInput.disabled = false;
});

let rectangleCount = 1;

$('#rectangle').on('click', function () {
    canvas.isDrawingMode = false;
    
    const rectangle = new fabric.Rect({
        left: 40,
        top: 40,
        width: 60,
        height: 60,
        fill: 'Red'
    });

    const label = new fabric.Text(`Image ${rectangleCount}`, {
        left: rectangle.left + rectangle.width / 2,
        top: rectangle.top + rectangle.height / 2 - 6,
        fontSize: 10,
        fill: 'white',
        originX: 'center',
        selectable: false,
    });

    rectangleCount++;

    const group = new fabric.Group([rectangle, label], {
        selectable: true
    });

    canvas.add(group);
});
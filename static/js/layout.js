/**
 * Initializes a Fabric.js canvas with a specified ID and optional default background image.
 * @param {string} id - The ID of the canvas element.
 * @param {string} [defaultImageUrl] - The URL of the default background image.
 * @returns {fabric.Canvas} The initialized Fabric.js canvas.
 */
const initializeCanvas = (id, defaultImageUrl) => {
    const canvas = new fabric.Canvas(id, {});

    if (defaultImageUrl) {
        fabric.Image.fromURL(defaultImageUrl, (img) => {
            const container = canvas.wrapperEl.parentNode.getBoundingClientRect();
            const maxContainerWidth = container.width * 0.9;
            const maxContainerHeight = container.height * 0.9;

            const imageAspectRatio = img.width / img.height;
            let canvasWidth, canvasHeight;

            // Adjust canvas size based on image aspect ratio and container dimensions
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

            // Center the canvas element in the parent container
            const canvasElement = canvas.getElement();
            canvasElement.style.position = 'absolute';
            canvasElement.style.left = '50%';
            canvasElement.style.top = '50%';
            canvasElement.style.transform = 'translate(-50%, -50%)';
        });
    }

    return canvas;
};

/**
 * Sets the background image on the canvas and resizes the canvas to fit within the container.
 * @param {string} url - The URL of the image to set as the background.
 * @param {fabric.Canvas} canvas - The Fabric.js canvas object.
 * @param {DOMRect} container - The container's bounding rectangle for dimension constraints.
 */
const setBackgroundAndResizeCanvas = (url, canvas, container) => {
    fabric.Image.fromURL(url, (img) => {
        const maxContainerWidth = container.width * 0.9;
        const maxContainerHeight = container.height * 0.9;

        const imageAspectRatio = img.width / img.height;
        let canvasWidth, canvasHeight;

        // Adjust canvas size based on image aspect ratio and container dimensions
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

        // Center the canvas element in the parent container
        const canvasElement = canvas.getElement();
        canvasElement.style.position = 'absolute';
        canvasElement.style.left = '50%';
        canvasElement.style.top = '50%';
        canvasElement.style.transform = 'translate(-50%, -50%)';
    });
};

/**
 * Locks the scaling and rotation of a Fabric.js text object.
 * @param {fabric.IText} obj - The Fabric.js text object to lock.
 */
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

/**
 * Updates properties of selected text objects on the canvas.
 * @param {Array<fabric.Object>} objects - The selected objects to update.
 * @param {Object} properties - The properties to update on the selected objects.
 */
const updateSelectedTextObjects = (objects, properties) => {
    objects.forEach(obj => {
        if (obj.type === 'i-text') {
            obj.set(properties);
            lockTextObject(obj); 
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

// Initialize canvas and container
const canvas = initializeCanvas('canvas', document.getElementById('canvas').getAttribute('data-image-url'));
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

/**
 * Checks if a text string is unique among the existing text objects on the canvas.
 * @param {string} text - The text string to check for uniqueness.
 * @returns {boolean} True if the text is unique, false otherwise.
 */
function isTextUnique(text) {
    const existingTexts = canvas.getObjects().filter(obj => {
        if (obj.type === 'i-text' && obj.text.startsWith(text)) {
            return true;
        }
        if (obj.type === 'group') {
            return obj.getObjects().some(innerObj => innerObj.type === 'text' && innerObj.text.startsWith(text));
        }
        return false;
    });
    return existingTexts.length === 0;
}

// Add new text object to canvas on button click
$('#text').on('click', () => {
    canvas.isDrawingMode = false;

    let newText = 'Lorem ipsum';
    let number = 0;

    while (!isTextUnique(newText)) {
        number++;
        newText = `Lorem ipsum ${number}`;
    }

    const text = new fabric.IText(newText, {
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

// Trigger file input click on replace button click
$('#replace').on('click', () => {
    fileInput.click();
});

// Handle file input change event
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', layoutType);

    fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        processData: false,
        contentType: false
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const objectURL = URL.createObjectURL(file);
          setBackgroundAndResizeCanvas(objectURL, canvas, canvas.wrapperEl.parentNode.getBoundingClientRect());
        } else {
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error('Upload failed:', error);
      });      
});

// Update text properties on change or input events
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

// Add rectangle with unique label to canvas on button click
$('#rectangle').on('click', function () {
    canvas.isDrawingMode = false;

    const rectangle = new fabric.Rect({
        left: 40,
        top: 40,
        width: 60,
        height: 60,
        fill: 'Red'
    });

    let newLabelText = 'Image';
    let number = 0;

    while (!isTextUnique(newLabelText)) {
        number++;
        newLabelText = `Image ${number}`;
    }

    const label = new fabric.Text(newLabelText, {
        left: rectangle.left + rectangle.width / 2,
        top: rectangle.top + rectangle.height / 2 - 6,
        fontSize: 10,
        fill: 'white',
        originX: 'center',
        selectable: false,
    });

    const group = new fabric.Group([rectangle, label], {
        selectable: true
    });

    canvas.add(group);
});

// Remove selected objects from canvas on button click
$('#remove').on('click', function () {
    canvas.isDrawingMode = false;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(object => canvas.remove(object));
    canvas.discardActiveObject().renderAll();
});

// Event handler for selection created on canvas
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

// Event handler for selection cleared on canvas
canvas.on('selection:cleared', function () {
    $('#remove').prop('disabled', 'disabled');
    fontFamilySelect.disabled = false;
    textColorInput.disabled = false;
    fontSizeInput.disabled = false;
});

$(document).ready(function() {
    $('#save').click(function() {
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

        const jsonData = JSON.stringify(canvasObjects, null, 2);
        const saveUrl = `/save?type=${layoutType}`;

        // Send data to Flask using Fetch API
        fetch(saveUrl, {
            method: 'POST',
            body: jsonData,
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Handle success response from Flask
        })
        .catch(error => {
            console.error(error);  // Handle errors during request
        });
    });
});

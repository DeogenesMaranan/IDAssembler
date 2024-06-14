const initializeCanvas = (id) => {
    return new fabric.Canvas(id, {});
};

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

const updateTextObject = (obj, properties) => {
    if (obj && obj.type === 'i-text') {
        obj.set(properties);
        canvas.renderAll();
    }
};

const canvas = initializeCanvas('canvas');
const container = document.getElementById('workspace').getBoundingClientRect();
const frontImageUrl = document.getElementById('canvas').getAttribute('data-image-url');
setBackgroundAndResizeCanvas(frontImageUrl, canvas, container);

document.getElementById('draw').addEventListener('click', () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
});

// Add text
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

const fontFamilySelect = document.getElementById('font-family');
const fontSizeInput = document.getElementById('font-size');
const textColorInput = document.getElementById('text-color');

fonts.forEach(font => {
    const option = document.createElement('option');
    option.value = font;
    option.textContent = font;
    if (font === "Arial") option.selected = true;
    fontFamilySelect.appendChild(option);
});

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

canvas.on('selection:created', (event) => {
    const selectedObject = event.target;
    if (selectedObject && selectedObject.type === 'i-text') {
        fontFamilySelect.value = selectedObject.fontFamily;
        textColorInput.value = selectedObject.fill;
        fontSizeInput.value = selectedObject.fontSize;
        lockTextObject(selectedObject);
    }
});

['change', 'input'].forEach(event => {
    fontFamilySelect.addEventListener(event, () => updateTextObject(canvas.getActiveObject(), { fontFamily: fontFamilySelect.value }));
    textColorInput.addEventListener(event, () => updateTextObject(canvas.getActiveObject(), { fill: textColorInput.value }));
    fontSizeInput.addEventListener(event, () => updateTextObject(canvas.getActiveObject(), { fontSize: parseInt(fontSizeInput.value, 10) }));
});

document.getElementById('save').addEventListener('click', () => {
    const canvasObjects = canvas.getObjects().map(obj => ({
        text: obj.text,
        type: obj.type,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        angle: obj.angle,
        objecttype: obj.objecttype,
        fill: obj.fill,
        fontFamily: obj.fontFamily,
        fontSize: obj.fontSize
    }));
    console.log(JSON.stringify(canvasObjects, null, 2));
});
const fileInput = $('#file-input')[0];
const dataFileInput = $('#data-file-input')[0];

function createButtons(containerId, count, prefix) {
    var container = $('#' + containerId);
    for (var i = 0; i < count; i++) {
        var button = $('<button></button>');
        button.attr('id', i === 0 ? prefix : prefix + ' ' + i);
        button.text(button.attr('id'));
        button.on('click', function() {
            handleFileInput().then(() => {
                uploadImages(this.id);
            });
        });
        container.append(button);
    }
}

createButtons('upload-images-front', frontImageCount, 'front_layout_Image');
createButtons('upload-images-back', backImageCount, 'back_layout_Image');

function handleFileInput() {
    return new Promise((resolve) => {
        $(fileInput).on('change', () => {
            resolve();
        });
        $(fileInput).click();
    });
}

function uploadImages(folder) {
    var files = $(fileInput)[0].files;
    var formData = new FormData();
    formData.append('folder', folder);
    for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    $.ajax({
        url: `/${projectName}/upload/images?folder=${folder}`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            if (data.success) {
                alert('Files uploaded successfully.');
            } else {
                alert('File upload failed: ' + data.message);
            }
        },
        error: function(error) {
            console.error('Error:', error);
            alert('An error occurred while uploading files.');
        }
    });
}


function handleDataFileInput(layoutType) {
    return new Promise((resolve) => {
        $(dataFileInput).on('change', function() {
            resolve(this.files[0]);
        }).click();
    });
}

$('#upload-data-front').on('click', function() {
    handleDataFileInput('front').then((file) => {
        uploadData(file, 'front');
    });
});

$('#upload-data-back').on('click', function() {
    handleDataFileInput('back').then((file) => {
        uploadData(file, 'back');
    });
});

function uploadData(file, layoutType) {
    const uploadUrl = `/${projectName}/upload/data?type=${layoutType}`;

    const formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: uploadUrl,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            if (data.success) {
                alert('Files uploaded successfully.');
            } else {
                alert('File upload failed: ' + data.message);
            }
        },
        error: function(error) {
            console.error('Error:', error);
            alert('An error occurred while uploading files.');
        }
    });
}

$('#generate-bulk-front').on('click', function() {
    generateOverlay();
});

function generateOverlay() {
    const targetUrl = `/${projectName}/generateOverlay`;

    $.ajax({
        url: targetUrl,
        type: 'POST',
        success: function(response) {
            console.log("Request succeeded:", response);
        },
        error: function(error) {
            console.error("Request failed:", error);
        }
    });
}


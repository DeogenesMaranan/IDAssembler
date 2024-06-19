var modal = document.getElementById('projectModal');
var btn = document.getElementById('new-project');
var span = document.getElementsByClassName('close')[0];
var submitBtn = document.getElementById('submitProjectName');

btn.onclick = function() {
    modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

submitBtn.onclick = function() {
    var projectName = document.getElementById('projectName').value.trim();
    if (projectName) {
        window.location.href = '/' + projectName + '/layout?type=front';
        modal.style.display = 'none';
    } else {
        var requiredMessage = document.querySelector('.required-message');
        requiredMessage.style.display = 'block';
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

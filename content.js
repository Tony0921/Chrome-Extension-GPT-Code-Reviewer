chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.click();
    fileInput.addEventListener("change", function () {
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("file", file);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://example.com/upload");
        xhr.send(formData);
    });
});


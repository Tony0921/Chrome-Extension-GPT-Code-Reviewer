console.log("popup");

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("upload-btn").addEventListener("click", function () {
        chooseFile();
    });
    // popup("start"); //test
});

function chooseFile() {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.click();
    fileInput.addEventListener("change", function () {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            var contents = reader.result;
            // Do something with the file contents
            console.log(contents);
            popup(contents);
        };
        reader.readAsText(file);
    });
}


function popup(msg) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": msg});
    });
}

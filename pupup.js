document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("upload-btn").addEventListener("click", function () {
        chooseFile();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "upload" });
        });
        
    });

});

function chooseFile() {
    console.log("click");
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.click();
    fileInput.addEventListener("change", function () {
      var file = fileInput.files[0];
      var reader = new FileReader();
      reader.onload = function () {
        var contents = reader.result;
        console.log("click");
      };
      reader.readAsText(file);
    });
  }

console.log("contents");

var inputField = document.getElementsByTagName("textarea")[0];
var resault = "";

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type === "manual") {
            chooseFiles("manual");
        }
        if (message.type === "api") {
            chooseFiles("api");
        }
        if (message.type === "paramenters") {
            chooseFiles("paramenters");
        }
    }
);

async function chooseFiles(type) {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true; // enable multiple file selection
    fileInput.click();
    fileInput.addEventListener("change", async function () {
        const files = fileInput.files;
        // console.log(files);
        const fileContents = [];
        for (const file of files) {
            const fileName = file.name;
            // console.log("File name:", fileName);
            const contents = await readFile(file);
            fileContents.push({ fileName, contents });
            merge(contents, fileName);
        }
        console.log(fileContents);
        console.log("finish!");
        addPrompt(type);
    });
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
    });
}

function merge(content, fileName) {
    var open = "read " + fileName + " as follows, summary in 10 words";
    resault += open + "\r\n" + content + "\r\n";
}

function addPrompt(type) {
    var prompt = "";
    if (type == "manual") {
        prompt = "write a manual for this program";
    } else if (type == "api") {
        prompt = "write the API list and description for this program with a markdown table";
    } else if (type == "paramenters") {
        prompt = "show all parameters, description and its location in this program as a markdown table";
    }
    resault += prompt;
    console.log("resault:", resault);
    setFieldValue();
}

function setFieldValue() {
    inputField.value = resault;
    inputField.defaultValue = resault;

    // enable button
    var btn = document.getElementsByClassName("absolute") && document.getElementsByClassName("p-1")[0];
    btn.disabled = false;

    // set textfield height
    if (inputField.scrollHeight < 200) {
        inputField.setAttribute("style", " max-height:200px; height:" + (inputField.scrollHeight) + "px; overflow-y: hidden;");
    } else {
        inputField.setAttribute("style", "max-height:200px; height:" + (inputField.scrollHeight) + "px;");
    }
    resault = "";
}

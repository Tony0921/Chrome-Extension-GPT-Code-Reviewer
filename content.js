console.log("contents");

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type === "upload") {
            chooseFiles();
        }
        if (message.type === "clear") {
            setFieldValue("");
        }
        if (message.type === "manual") {
            // chooseFiles("manual");
            setPrompt("manual");
        }
        if (message.type === "api") {
            // chooseFiles("api");
            setPrompt("api");
        }
        if (message.type === "paramenters") {
            // chooseFiles("paramenters");
            setPrompt("paramenters");
        }
    }
);

async function chooseFiles() {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true; // enable multiple file selection
    fileInput.click();
    fileInput.addEventListener("change", async function () {
        const files = fileInput.files;
        // console.log(files);
        const fileContents = [];
        var resault = "";
        for (const file of files) {
            const fileName = file.name;
            // console.log("File name:", fileName);
            const contents = await readFile(file);
            fileContents.push({ fileName, contents });
            resault += merge(contents, fileName);
        }
        console.log(fileContents);
        console.log("finish!");
        setFieldValue(resault);
        // addPrompt(type);
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
    var open = "Read " + fileName + " as follows, summary in 10 words.";
    // resault += open + "\r\n" + content + "\r\n";
    return (open + "\r\n" + content + "\r\n");
}

function setPrompt(type) {
    var prompt = "";
    if (type == "manual") {
        prompt = "Write a manual for this program.";
    } else if (type == "api") {
        prompt = "Write the API list and description for this program with a markdown table.";
    } else if (type == "paramenters") {
        prompt = "Show all parameters, description and its location in this program as a markdown table.";
    }
    // resault += prompt;
    // console.log("resault:", resault);
    setFieldValue(prompt);
}

function setFieldValue(value) {
    var inputField = document.getElementsByTagName("textarea")[0];
    inputField.value = value;
    // inputField.defaultValue = value;

    // enable button
    var btn = document.getElementsByClassName("absolute") && document.getElementsByClassName("p-1")[0];
    if(value != ""){
        btn.disabled = false;
    }else{
        btn.disabled = true;
    }
    

    // set textfield height
    if (inputField.scrollHeight < 200) {
        inputField.setAttribute("style", " max-height:200px; height:" + (inputField.scrollHeight) + "px; overflow-y: hidden;");
    } else {
        inputField.setAttribute("style", "max-height:200px; height:" + (inputField.scrollHeight) + "px;");
    }
    // resault = "";
}

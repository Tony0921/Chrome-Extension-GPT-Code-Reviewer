let canSend = true;
var intervalID = setInterval(function () {
    var rs = document.getElementsByClassName("result-streaming");
    if (rs.length == 0) {
        canSend = true;
    } else {
        canSend = false;
    }
}, 1000);

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type === "upload") {
            chooseFiles();
        }
        if (message.type === "clear") {
            setFieldValue("");
        }
        if (message.type === "manual") {
            setPrompt("manual");
        }
        if (message.type === "api") {
            setPrompt("api");
        }
        if (message.type === "paramenters") {
            setPrompt("paramenters");
        }
        if (message.type === "flow") {
            setPrompt("flow");
        }
        if (message.type === "review") {
            setPrompt("review");
        }
        if (message.type === "markdown") {
            setPrompt("markdown");
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
        const fileContents = [];
        var results = "";
        var len = 0;
        for (const file of files) {
            const fileName = file.name;
            const contents = await readFile(file);
            len += contents.length;
            fileContents.push({ fileName, contents });
        }

        await sendCode(fileContents);
    });
}

let cancelled = false;

const taskStatus = document.createElement("div");
const statusMsg = document.createElement("div");
const uploadFailed = document.createElement("div");
const cancelButton = document.createElement("button");
const comfirmButton = document.createElement("button");
const bg = document.createElement("div");

function initUI(){
    taskStatus.classList.add("task-status");
    statusMsg.classList.add("status-msg");
    uploadFailed.classList.add("upload-failed");

    cancelButton.classList.add("cancel-btn");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", async function(){
        cancelled = true;
        statusMsg.innerText = "Canceling...";
    });

    comfirmButton.classList.add("comfirm-btn");
    comfirmButton.innerText = "Comfirm";
    comfirmButton.addEventListener("click", async function(){
        removeUI();
        removeBG();
    });

    taskStatus.appendChild(statusMsg);
    taskStatus.appendChild(uploadFailed);
}

initUI();

function showUI(state){
    console.log("show UI");
    if(state == "complete"){
        taskStatus.appendChild(comfirmButton);
    }
    else if(state == "cancel"){
        taskStatus.appendChild(cancelButton);
    }
    document.body.appendChild(taskStatus);
}

function removeUI(){
    console.log("remove UI");
    cancelButton.remove();
    comfirmButton.remove();
    taskStatus.remove();
}

// BG mask
function showBG(){
    bg.classList.add("alert-bg");
    document.body.appendChild(bg);
}

function removeBG(){
    bg.remove();
}

async function sendCode(fileContents){
    let fileCount = 0;
    showBG();
    uploadFailed.innerText = "";

    for (var fileContent of fileContents) {
        showUI("cancel");
        statusMsg.innerText = `Waiting for upload ${fileContent.fileName} ...`;

        // 超出字數上限，跳過上傳
        if (fileContent.contents.length > 16000) {
            // reject
            uploadFailed.innerText += `${fileContent.fileName} content exceeds the limit!\n`;
            continue;
        }

        // 等待回答完成
        while (!canSend) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 檢查是否已取消
        if (cancelled) {
            removeUI();
            removeBG();
            break;
        }

        // 填入輸入框，按下送出按鈕
        var result = merge(fileContent.contents, fileContent.fileName);
        setFieldValue(result);
        clickSend();
        canSend = false;
        fileCount++;
        
        // 清除提示框
        removeUI();
    }

    // 清除提示框
    if (!cancelled) {
        removeUI();

        if (fileCount==fileContents.length) {
            statusMsg.innerText = "All Task Complete!";
        }else{
            statusMsg.innerText = "The following file(s) have not been uploaded:";
        }

        showUI("complete");
    }
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
    return (open + "\r\n\r\n" + content + "\r\n");
}

function setPrompt(type) {
    var prompt = "";
    if (type == "manual") {
        prompt = "Write a manual for this program.";
    }
    else if (type == "api") {
        prompt = "Write the API list and description for this program with a markdown table.";
    }
    else if (type == "paramenters") {
        prompt = "Show all parameters, description and its location in this program as a markdown table.";
    }
    else if (type == "flow") {
        prompt = "Use PlantUML syntax create the flow chart with copy code output.";
    }
    else if (type == "review") {
        prompt = "Review this program, include Code review part and Suggestions for improvement part.";
    }
    else if (type == "markdown") {
        prompt = "Using markdown source code to write a readme.md for this program.";
    }
    setFieldValue(prompt);
}

function getSendBtn() {
    var element = document.querySelectorAll('button.absolute.p-1');
    return element[0];
}

function setFieldValue(value) {
    var inputField = document.getElementsByTagName("textarea")[0];
    inputField.value = value;

    // set textfield height
    if (inputField.scrollHeight < 200) {
        inputField.setAttribute("style", " max-height:200px; height:" + (inputField.scrollHeight) + "px; overflow-y: hidden;");
    } else {
        inputField.setAttribute("style", "max-height:200px; height:" + (inputField.scrollHeight) + "px;");
    }

    checkFieldValue(value);
}

function checkFieldValue(value) {
    var sendBtn = getSendBtn();

    // enable button
    if (value != "") {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
}

function clickSend() {
    var sendBtn = getSendBtn();
    sendBtn.click();
    canSend = false;
}

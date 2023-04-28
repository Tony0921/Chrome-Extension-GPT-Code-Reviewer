console.log("contents");

let canSend = true;
var intervalID = setInterval(function () {
    var rs = document.getElementsByClassName("result-streaming");
    // console.log(rs);
    if (rs.length == 0) {
        // console.log("can send!");
        canSend = true;
    } else {
        canSend = false;
        // console.log("can't send!");
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
        if (message.type === "flow") {
            // chooseFiles("paramenters");
            setPrompt("flow");
        }
        if (message.type === "review") {
            // chooseFiles("paramenters");
            setPrompt("review");
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
        var results = "";
        var len = 0;
        for (const file of files) {
            const fileName = file.name;
            // console.log("File name:", fileName);
            const contents = await readFile(file);
            console.log("contents len:" + contents.length);
            len += contents.length;
            fileContents.push({ fileName, contents });
        }
        // console.log("len:" + len);
        console.log(fileContents);
        console.log("finish!");
        // console.log("result len:" + results.length);

        await sendCode(fileContents);
        
        // setFieldValue(result);
        // addPrompt(type);
    });
}

async function sendCode(fileContents){
    let cancelled = false;
    let fileCount = 0;

    // 顯示提示框
    const taskStatus = document.createElement("div");
    taskStatus.classList.add("task-status");

    const statusMsg = document.createElement("div");
    statusMsg.classList.add("status-msg");

    const uploadFailed = document.createElement("div");
    uploadFailed.classList.add("upload-failed");

    taskStatus.appendChild(statusMsg);
    taskStatus.appendChild(uploadFailed);

    // 取消按鈕
    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", async function(){
        cancelled = true;
        taskStatus.innerText = "Canceling...";
        console.log("cancel click");
    });

    // 背景遮罩
    const bg = document.createElement("div");
    bg.classList.add("alert-bg");
    document.body.appendChild(bg);

    
    for (var fileContent of fileContents) {
        statusMsg.innerText = `Waiting for upload ${fileContent.fileName} ...`;
        taskStatus.appendChild(cancelButton);
        document.body.appendChild(taskStatus);
        // console.log(fileContent.contents.length);
        if (fileContent.contents.length > 16000) {
            // reject
            // taskStatus.innerText = `File size exceeds 16,000 bytes: ${fileContent.fileName}`;
            // taskStatus.style.color = "red";
            // taskStatus.removeChild(cancelButton);
            // bg.style.opacity = "0.5";
            // throw new Error(`File size exceeds 16,000 bytes: ${fileContent.fileName}`);
            uploadFailed.innerText += `${fileContent.fileName} content exceeds the limit!\n`;
            console.log(fileContent.fileName,"not unpload");
            continue;
        }

        while (!canSend) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 檢查是否已取消
        if (cancelled) {
            // 清除提示框
            // 退出迭代
            // taskStatus.innerText = "Waiting for";
            taskStatus.remove();
            bg.remove();
            break;
        }

        var result = merge(fileContent.contents, fileContent.fileName);
        setFieldValue(result);
        clickSend();
        canSend = false;
        fileCount++;
        
        // 清除提示框
        taskStatus.remove();
    }

    // 清除提示框
    if (!cancelled) {
        // const taskStatus = document.createElement("div");
        // taskStatus.classList.add("task-status");

        const comfirmButton = document.createElement("button");
        comfirmButton.innerText = "Comfirm";
        comfirmButton.addEventListener("click", async function(){
            taskStatus.remove();
            bg.remove();
            console.log("Comfirm click");
        });

        if (fileCount==fileContents.length) {
            taskStatus.innerText = "All Task Complete!";
        }else{
            taskStatus.appendChild(statusMsg);
            taskStatus.appendChild(uploadFailed);

            statusMsg.innerText = "The following file(s) have not been uploaded:";
        }

        cancelButton.remove();
        taskStatus.appendChild(comfirmButton);
        document.body.appendChild(taskStatus);
        // var timeoutID = setTimeout(()=>{
        //     taskStatus.remove();
        //     bg.remove();
        // }, 2000);
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
    setFieldValue(prompt);
}

function getSendBtn() {
    var elements_1 = document.getElementsByClassName("absolute");
    var elements_2 = document.getElementsByTagName("button");
    for (var element_1 of elements_1) {
        for (var element_2 of elements_2) {
            if (element_1 == element_2) {
                // console.log(element_1);
                // sendBtn = element_1;
                // break;
                return element_1;
            }
        }
    }

}

function setFieldValue(value) {
    var inputField = document.getElementsByTagName("textarea")[0];
    inputField.value = value;
    // inputField.defaultValue = value;

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

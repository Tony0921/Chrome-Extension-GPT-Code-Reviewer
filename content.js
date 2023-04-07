console.log("contents");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message != "" ) {
            // console.log(request)
            start(request);
        }
    }
);

function start(req){
    // alert("started");
    var prompt = "write a manual for this program ";
    var resault = prompt + "\r\n" + req.message;
    var inputField = document.getElementsByTagName("textarea")[0];
    inputField.value = resault;
    inputField.defaultValue = resault;

    var btn = document.getElementsByClassName("absolute") && document.getElementsByClassName("p-1")[0];
    // console.log(btn);
    btn.disabled = false;
    
    if(inputField.scrollHeight < 200){
        inputField.setAttribute("style", " max-height:200px; height:" + (inputField.scrollHeight) + "px; overflow-y: hidden;");
    }else{
        inputField.setAttribute("style", "max-height:200px; height:" + (inputField.scrollHeight) + "px;");
    }
    
}


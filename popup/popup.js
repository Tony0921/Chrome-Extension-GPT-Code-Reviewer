console.log("popup");

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("manual-btn").addEventListener("click", function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {type: "manual"});
        });
    });
    document.getElementById("api-btn").addEventListener("click", function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {type: "api"});
        });
    });
    document.getElementById("paramenters-btn").addEventListener("click", function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {type: "paramenters"});
        });
    });
});


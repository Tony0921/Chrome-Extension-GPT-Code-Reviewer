console.log("popup");

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("upload-btn").addEventListener("click", function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {type: "upload"});
        });
    });
    document.getElementById("clear-btn").addEventListener("click", function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {type: "clear"});
        });
    });
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
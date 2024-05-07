function getTabInfo() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        if (activeTab.url.includes("chatgpt.com")) {
            console.log("match");
            chrome.action.setPopup({ popup: './popup/popup.html' });
        } else {
            chrome.action.setPopup({ popup: './popup/popup2.html' });
        }
    });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    getTabInfo();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.active && changeInfo.url) {
        getTabInfo();
    }
});
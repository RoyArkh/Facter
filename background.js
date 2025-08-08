chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "factCheck",
    title: "Fact Check Highlighted Text",
    contexts: ["selection"]
  });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "factCheck" && info.selectionText) {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // Focus the extension icon so popup.html opens
      chrome.action.setPopup({
        tabId: tab.id,
        popup: "popup.html"
      });

      // Optional: trigger user to click the extension icon
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert("Click the extension icon (top right) to see the fact-check result.");
        }
      });
    });
  }
});

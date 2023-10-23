chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveSongs") {
    console.log("Saved songs:", request.data)
    chrome.storage.local.set({ extractedSongs: request.data }, () => {
      sendResponse({ success: true });
    });
  } else if (request.action === "getSongs") {
    console.log("Getting songs:", request.data)
    chrome.storage.local.get("extractedSongs", (data) => {
      sendResponse({ data: data.extractedSongs });
    });
  }
  return true; // This ensures the sendResponse can be called asynchronously
});

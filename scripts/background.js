/**
 * Copyright (c) 2018 Craig McNeill. All rights reserved.
 * Released under the MIT license (see LICENSE).
 */

// Initialize/reset settings in local storage
localStorage.enabled = 0;
localStorage.font = 'fullWidth';

// Listen for enabled/font update messages from the popup, and state requests from content scripts
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action === 'updateEnabled') {
        updateEnabled();
    } else if (msg.action === 'updateFont') {
        updateFont();
    } else if (msg.action === 'updateCombos') {
        updateCombos();
    } else if (msg.action === 'getState') {
        sendResponse({
            enabled: localStorage.enabled == 1,
            font: localStorage.font,
            combos: localStorage.combos == 1
        });
    }
});

// Update the enable status
function updateEnabled() {
    // Update the toolbar button's icon and title
    let path, title;
    if (localStorage.enabled == 1) {
        path = {
            "16": "icons/unitype_on_16.png",
            "32": "icons/unitype_on_32.png"
        };
        title = 'UniType is ON';
    } else {
        path = {
            "16": "icons/unitype_off_16.png",
            "32": "icons/unitype_off_32.png"
        };
        title = 'UniType is OFF';
    }
    chrome.browserAction.setIcon({path: path});
    chrome.browserAction.setTitle({title: title});

    // Enable/disable the content scripts
    sendMessageToAllTabs({enabled: localStorage.enabled == 1});
}

// Update the chosen font
function updateFont() {
    sendMessageToAllTabs({font: localStorage.font});
}

// Update the special combination status
function updateCombos() {
    sendMessageToAllTabs({combos: localStorage.combos == 1});
}

// Sends a message to all tabs in any window
function sendMessageToAllTabs(msg) {
    chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, msg, function() {
                chrome.runtime.lastError;
            });
        }
    });
}
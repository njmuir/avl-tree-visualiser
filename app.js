// File: app.js

const SCREEN_WIDTH = window.innerWidth;

let tree = new Tree();
// Saves the previous state of the tree
let save = null;

// Attempts to read in a key from the user
function readKey() {
    const key = document.getElementById('key').value;
    document.getElementById('key').value = "";
    if (!((/^[a-zA-Z]$/.test(key)))) {
        alert("Please enter a letter")
        return null;
    }
    return key.toUpperCase();
}

// Inserts a key
async function insert() {
    const key = readKey();
    if (!key) {
        return;
    }
    disableButtons();
    save = tree.copy();
    await tree.insert(key);
    enableButtons();
}

// Removes a key
async function remove() {
    const key = readKey();
    if (!key) {
        return;
    }
    disableButtons();
    save = tree.copy();
    await tree.remove(key);
    enableButtons();
}

// Undoes the last action
async function undo() {
    if (save) {
        tree = save;
        save = null;
        tree.visualise();
    } else {
        alert("No saved state");
    }
}

// Disables buttons during an operation
function disableButtons() {
    toggleButtons(true);
}

// Re-enables buttons after an operation
function enableButtons() {
    toggleButtons(false);
}

// Toggles button states
function toggleButtons(disabled) {
    document.getElementById('insertButton').disabled = disabled;
    document.getElementById('removeButton').disabled = disabled;
    document.getElementById('undoButton').disabled = disabled;
}


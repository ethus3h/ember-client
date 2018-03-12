// This file defines functions with implementations that are specific to the JavaScript implementation of EITE.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.

function normalizeMessage(message) {
    if (typeof message == 'object') {
        return (JSON && JSON.stringify ? JSON.stringify(message) : message);
    } else {
        return message;
    }
}

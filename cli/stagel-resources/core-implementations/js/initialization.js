// Global variables

let haveDom = false;
let datasets = [];
let dcData = [];

async function internalSetup() {
    // Detect if we can create DOM nodes (otherwise we'll output to a terminal)
    if (typeof window !== 'undefined') {
        haveDom = true;
    }
    await internalLoadDatasets();
}

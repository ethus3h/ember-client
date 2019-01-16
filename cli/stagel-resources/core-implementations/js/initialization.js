let haveDom = false;

async function internalSetup() {
    if (typeof window !== 'undefined') {
        haveDom = true;
    }
    
}

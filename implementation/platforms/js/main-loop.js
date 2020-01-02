// This file contains the implementation of the main loop of the JavaScript implementation of the EITE NDW

async function ndw() {
    ndw_invoke('main'); // Start EITE main loop
    while (ndw_invoke('tick'));
    return ndw_invoke('exitCode');
}

async function ndw_invoke(routine) {
    if (routine === 'main')
    return getWindowOrSelf()[routine]();
}

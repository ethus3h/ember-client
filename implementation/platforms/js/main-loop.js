// This file contains the implementation of the main loop of the JavaScript implementation of the EITE NDW

async function ndw() {
    // Start StageR main loop
    ndw_invoke('main');
    // Start
    while (ndw_invoke('tick'));
    return ndw_invoke('getExitCode');
}

async function ndw_invoke(routine) {
    if (routine === 'main')
    return getWindowOrSelf()[routine]();
}

// This file contains the implementation of the main loop of the JavaScript implementation of the EITE NDW

async function ndw() {
    // Start StageR main loop
    await ndw_invoke('main');
    // Run r/b/tick, which returns false once there is no more code to run
    while (await ndw_invoke('tick'));
    return await ndw_invoke('getExitCode');
}

async function ndw_invoke(routine) {
    if (routine === 'main')
    return getWindowOrSelf()[routine]();
}

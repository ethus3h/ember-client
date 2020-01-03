// This file contains the implementation of the main loop of the JavaScript implementation of the EITE NDW

async function ndw() {
    // Start StageR main loop
    await ndw_invoke('main');
    // Run r/b/tick, which returns 0 once there is no more code to run
    let status;
    while (status > 0) {
        status = await ndw_invoke('tick');
        if (status === 1) {
            // continue without waiting for next event
        } else if (status === 2) {
            // wait for next expected event
        }
    }
    return await ndw_invoke('getExitCode');
}

async function ndw_invoke(routine) {
    // sr_ prefix is the deterministic StageR routines
    if (routine === 'main') {
        return sr_main();
    }
    if (routine === 'tick') {
        return sr_tick();
    }
    if (routine === 'getExitCode') {
        return sr_getExitCode();
    }
}

// This file contains the implementation of the main loop of the JavaScript implementation of the EITE NDW

async function ndw(entrypoint='startEite') {
    ndw_invoke('start');
    while (ndw_invoke('tick'));
    return ndw_invoke('exitCode');
}

async function ndw_invoke(routine, parameter='') {
    return getWindowOrSelf()[routine]();
}

async function ndw_invoke_with_parameter(routine) {
    return getWindowOrSelf()[routine]();
}

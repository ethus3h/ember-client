// This file contains the implementation of the main loop of the JavaScript implementation of the EITE NDW

async function ndw(entrypoint='startEite') {
    ndw_invoke(entrypoint);
    while (ndw_invoke('tick')) {

    }
}

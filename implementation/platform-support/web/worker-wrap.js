// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

// To call a routine from eite, run: await eiteCall('yourRoutineName', [param1, param2, param3...]); (with the brackets around the params)

// Promise-wrapped worker strategy is inspired by Gilad Dayagi's implementation described at https://codeburst.io/promises-for-the-web-worker-9311b7831733

if (window.Worker) {
    let window.eiteWorker = new Worker('eite.js');
    const window.eiteWorkerResolveCallbacks = {};
    let window.eiteWorkerCallID = 0;
    window.eiteCall = async function(funcName, args) {
        window.eiteWorkerCallID = window.eiteWorkerCallID + 1;
        let thisCallId=window.eiteWorkerCallID;
        let thisCall={uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerRequest', msgid: thisCallId, args: [funcName, args]};
        return new Promise(function(resolve) {
            window.eiteWorkerResolveCallbacks[thisCallId]=resolve;
            window.eiteWorker.postMessage(thisCall);
        });
    };
    window.eiteWorker.onmessage = function(message) {
        const {uuid, msgid, res} = message.data;
        if (res) {
            let resolveCallback;
            resolveCallback = window.eiteWorkerResolveCallbacks[id];
            if (resolveCallback) {
                resolveCallback(res);
                delete window.eiteWorkerResolveCallbacks[id];
            }
            else {
                implDie('Web worker returned invalid message ID.');
                throw 'Web worker returned invalid message ID.';
            }
        }
        else {
            implDie('Web worker encountered an error.');
            throw 'Web worker encountered an error.';
        }
    };
}
else {
    window.eiteCall = async function(funcName, args) {
        return await window[funcName]( ...args );
    }
    implDie('Web worker required.');
    throw 'Web worker required.';
}

// @license-end

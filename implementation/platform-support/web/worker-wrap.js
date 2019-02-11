// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

// Promise-wrapped worker strategy is inspired by Gilad Dayagi's implementation described at https://codeburst.io/promises-for-the-web-worker-9311b7831733

if (window.Worker) {
    let window.eiteWorker = new Worker('eite.js');
    const window.eiteWorkerResolves = {};
    let window.eiteWorkerCallID = 0;
    window.eiteCall = async function(funcName, args) {
        window.eiteWorkerCallID = window.eiteWorkerCallID + 1;
        let thisCallId=window.eiteWorkerCallID;
        let thisCall={id: thisCallId, args: args};
        return new Promise(function(resolve) {
            window.eiteWorkerResolves[thisCallId]=resolve;
            window.eiteWorker.postMessage(thisCall);
        });
    };
    window.eiteWorker.onmessage = function(event) {
        const {id, res} = event.data;
        if (res) {
            if (window.eiteWorkerRejects[id]) {
                
            }
            else {
                await implDie('Web worker returned invalid message ID.');
            }
        }
        else {
            await implDie('Web worker encountered an error.');
        }
    };
}
else {
    await implDie('Web worker required.');
}

// @license-end

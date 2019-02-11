// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

if (window.Worker) {
    let window.eiteWorker = new Worker('eite.js');
    let window.eiteWorkerCallID = 0;
    // Gilad Dayagi has already implemented a pattern like I'm trying to, as it turns out. https://codeburst.io/promises-for-the-web-worker-9311b7831733
    window.eiteCall = async function(funcName, args) {
        window.eiteWorkerCallID = window.eiteWorkerCallID + 1;
        let thisCallId=window.eiteWorkerCallID;
        return new Promise(resolve => {
                thisCallId
            });
        }
    }
    window.eiteWorker.onmessage = function(event) {
        
    }
}
else {
    console.log('Web worker required.');
    throw 'Web worker required.';
}

// @license-end

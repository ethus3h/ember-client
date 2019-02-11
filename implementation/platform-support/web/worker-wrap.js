// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

if (window.Worker) {
    let window.eiteWorker = new Worker('eite.js');
    window.eiteCall = async function(funcName, args) {
    return new Promise(resolve => {
            fr.onload=function (){
                resolve(undefined);
            };
            fr.readAsArrayBuffer(file);
        });
    }
}
else {
    console.log('Web worker required.');
    throw 'Web worker required.';
}

// @license-end

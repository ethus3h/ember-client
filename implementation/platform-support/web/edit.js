// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

globalCachedInputState="";
window.onload = function() {
    (async function(){
        let dcNames=[];
        await eiteCall('setupIfNeeded');
        await setupIfNeeded(); /* Set up normally and in Web worker because things that need performance on quick calls e.g. to respond when typing are too slow going through the Web worker */
        dcNames=await eiteCall('dcGetColumn', ['DcData', 1]);
        let datasetLength=await eiteCall('dcDatasetLength', ['DcData']);
        for (let i=0; i<datasetLength; i++) {
            let elem=document.createElement('button');
            elem.onclick=function(){
                editAreaInsert(i+'');
            }
            elem.innerHTML=dcNames[i];
            elem.class='dcInsertButton';
            document.getElementById('DcSelection').appendChild(elem);
        }
        //console.log(dcNames);
        // Attach click event listeners to elements
        document.getElementById('ImportDocument').onclick=function(){updateNearestDcLabel(document.getElementById('inputarea'));openImportDialog();};
        document.getElementById('ExportDocument').onclick=function(){updateNearestDcLabel(document.getElementById('inputarea'));ExportDocument();};
        document.getElementById('RunDocument').onclick=function(){updateNearestDcLabel(document.getElementById('inputarea'));RunDocumentHandler();};
        inputarea=document.getElementById('inputarea');
        inputarea.disabled=false;
        document.addEventListener('input', function() {
            updateNearestDcLabel(inputarea,false);
        }, false);
        document.addEventListener('keydown', function(e) {
            updateNearestDcLabel(inputarea,false);
            globalCachedInputState=e.key;
        }, false);
        document.addEventListener('keyup', function() {
            updateNearestDcLabel(inputarea,false);
        }, false);
        document.addEventListener('click', function() {
            updateNearestDcLabel(inputarea);
        }, false);
        inputarea.addEventListener('input', function(event) {
            handleDcEditingKeystroke(event, inputarea);
        });
        document.getElementById('ImportDocument').disabled=false;
        document.getElementById('ExportDocument').disabled=false;
        document.getElementById('RunDocument').disabled=false;
        inFormat=document.getElementById('inFormat');
        inFormat.innerHTML='';
        let formats=[];
        formats = await eiteCall('listInputFormats');
        for (let i=0;i<Object.keys(formats).length;i++) {
            let elem=document.createElement('option');
            elem.innerHTML=formats[i];
            inFormat.appendChild(elem);
        }
        inFormat.disabled=false;
        outFormat=document.getElementById('outFormat');
        outFormat.innerHTML='';
        formats = await eiteCall('listOutputFormats');
        for (let i=0;i<Object.keys(formats).length;i++) {
            let elem=document.createElement('option');
            elem.innerHTML=formats[i];
            outFormat.appendChild(elem);
        }
        outFormat.disabled=false;
        editFormat=document.getElementById('editFormat');
        editFormat.innerHTML='';
        formats = ['utf8', 'integerList'];
        for (let i=0;i<Object.keys(formats).length;i++) {
            let elem=document.createElement('option');
            elem.innerHTML=formats[i];
            editFormat.appendChild(elem);
        }
        editFormat.disabled=false;
        window.setTimeout(function(){
            let overlay=document.getElementById('overlay');
            overlay.style.opacity=0;
            overlay.style.transform='scale(3)';
            let overlayLoadingSpinner=document.getElementById('overlayLoadingSpinner');
            overlayLoadingSpinner.style.opacity=0;
            window.setTimeout(function(){document.getElementById('overlay').remove()},1500);
        }, 500);
    })();
};

function editInts() {
    return 'integerList' === document.getElementById('editFormat').value;
}

function handleDcEditingKeystroke(event) {
    if (editInts()) {
        if (globalCachedInputState.length === 1) {
            if (globalCachedInputState !== " " && isNaN(parseInt(globalCachedInputState))) {
                if (inputarea.value.includes(globalCachedInputState)) {
                    (async function(elem, char){
                        let start = elem.selectionStart;
                        let end = elem.selectionEnd;
                        elem.value = elem.value.replace(char, '');
                        elem.selectionStart = start - 1;
                        elem.selectionEnd = end - 1;
                        typeInTextareaSpaced(elem, await dcFromFormat('ascii', await strToByteArray (char)));
                    })(inputarea, globalCachedInputState);
                }
            }
        }
    }
}

function startSpinner() {
    // Display loading spinner
    document.getElementById('inputarea').disabled='true';
    /* the [...foo] syntax is the "spread syntax". https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax */
    [...document.getElementsByTagName('select')].forEach(elem => {
        elem.disabled = true;
    });
    [...document.getElementsByTagName('button')].forEach(elem => {
        elem.disabled = true;
    });
    document.getElementById('eiteDocumentRoot').innerHTML = '';
    document.getElementById('eiteDocumentRoot').appendChild(document.importNode(document.getElementById('documentRootLoadingSpinnerTemplate').content, true));
}

function removeSpinner(clear=false) {
    // Remove the loading spinner
    if(clear) {
        document.getElementById('eiteDocumentRoot').innerHTML='';
    }
    document.getElementById('eiteDocumentRoot').style.backgroundColor="white";
    document.getElementById('inputarea').disabled=false;
    [...document.getElementsByTagName('select')].forEach(elem => {
        elem.disabled = false;
    });
    [...document.getElementsByTagName('button')].forEach(elem => {
        elem.disabled = false;
    });
}

function editAreaInsert(text) {
    if(editInts()) {
        typeInTextareaSpaced(document.getElementById('inputarea'), text);
    }
    else {
        typeInTextarea(document.getElementById('inputarea'), text);
    }
}

function setNearestDcLabel(text) {
    let nearestDcLabel = document.getElementById('currentDcLabel');
    nearestDcLabel.innerHTML=text;
    nearestDcLabel.title=text;
}

function autoformatInputArea(el) {
    if (editInts()) {
        // Autoformat input area
        start = el.selectionStart;
        end = el.selectionEnd;
        let len = el.value.length;
        el.value = el.value + ' ';
        el.value = el.value.replace(/\s+/g, ' ');
        len = len - el.value.length;
        el.selectionStart = el.selectionEnd = start - len;
    }
}

function updateNearestDcLabel(el, autoformat=true) {
    if (autoformat) {
        autoformatInputArea(el);
    }
    else {
        setTimeout(function(){autoformatInputArea(el)}, 750);
    }
    updateNearestDcLabelInner(el);
}

async function updateNearestDcLabelInner(el) {
    let start = el.selectionStart;
    let end = el.selectionEnd;
    if (start !== end) {
        setNearestDcLabel('');
        return;
    }
    let text = el.value;
    let before = text.substring(0, start);
    let after  = text.substring(end, text.length);
    let currentDc = '';
    if (editInts()) {
        after=after.substring(0, after.indexOf(' '));
        before=before+after;
        currentDc=parseInt(before.trim().split(' ').slice(-1));
    }
    else {
        currentDc=before.slice(-1);
        if (currentDc.length === 0) {
            currentDc=after[0];
        }
        currentDc=await dcaFromUtf8(currentDc);
        currentDc=currentDc[0];
    }
    if (isNaN(currentDc) || (! await isKnownDc(currentDc))) {
        setNearestDcLabel('');
        return;
    }
    setNearestDcLabel(currentDc + ': ' + await dcGetName(currentDc));
}

function typeInTextarea(el, newText) {
    // Based on Jayant Bhawal's post at https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
    let start = el.selectionStart;
    let end = el.selectionEnd;
    let text = el.value;
    let before = text.substring(0, start);
    let after  = text.substring(end, text.length);
    el.value = (before + newText + after);
    el.selectionStart = el.selectionEnd = start + newText.length;
    el.focus();
}

function typeInTextareaSpaced(el, newText) {
    // Based on Jayant Bhawal's post at https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
    let start = el.selectionStart;
    let end = el.selectionEnd;
    let text = el.value;
    let before = text.substring(0, start);
    let after  = text.substring(end, text.length);
    if (before.substr(-1) === ' ' || before.substr(-1) === '') {
        newText = newText + ' ';
        el.value = (before + newText + after);
    }
    else {
        newText = ' ' + newText;
        el.value = (before + newText + after);
    }
    el.selectionStart = el.selectionEnd = start + newText.length;
    el.focus();
}

async function getInputDoc() {
    let val;
    val = document.getElementById('inputarea').value;
    if (!editInts()) {
        val = await eiteCall('importAndExport', ['utf8', 'integerList', ])
    }
    let res=await eiteCall('strToByteArray', []);
    return res;
}

async function RunDocumentHandler(callback) {
    startSpinner();
    // Timeout is an awful hack to give the browser time to start displaying the loading spinner. There should be a better way to do this, but I don't know what it is. This method would presumably break on slower computers.
    window.setTimeout(async function(){
        // Do the computation-heavy work
        await eiteCall('runDocument', [await eiteCall('importDocument', ['integerList', await getInputDoc()])]);
        if (callback !== undefined) {
            window.setTimeout(async function() {
                await callback();
                await removeSpinner();
            }, 500);
        }
        else {
            await removeSpinner();
        }
    }, 500);
};

function closeImportDialog() {
    notificationOverlay.removeEventListener('keyup', importDialogEscapeListener);
    let e=document.getElementsByClassName('importDialog');
    i=0;
    while (Object.keys(e).length > 0 && i < Object.keys(e).length) {
        notificationOverlay.style.opacity=0;
        e[i].style.opacity=0;
        e[i].style.transform='translate(-50%, -50%) scale(0.75)';
        i=i+1;
    };
    setTimeout(function(){
        let e=document.getElementsByClassName('importDialog');
        while (Object.keys(e).length > 0) {
            e[0].parentNode.removeChild(e[0]);
        };
        notificationOverlay.style.display='none';
    }, 750);
}

function closeAlertDialog() {
    notificationOverlay.removeEventListener('keyup', alertDialogEscapeListener);
    // Alert dialog also shares importDialog class. Maybe it shouldn't, but anyway.
    let e=document.getElementsByClassName('importDialog');
    i=0;
    while (Object.keys(e).length > 0 && i < Object.keys(e).length) {
        notificationOverlay.style.opacity=0;
        e[i].style.opacity=0;
        e[i].style.transform='translate(-50%, -50%) scale(0.75)';
        i=i+1;
    };
    setTimeout(function(){
        let e=document.getElementsByClassName('importDialog');
        while (Object.keys(e).length > 0) {
            e[0].parentNode.removeChild(e[0]);
        };
        notificationOverlay.style.display='none';
    }, 750);
}

function importDialogEscapeListener(event) {
        if (event.key === 'Escape') {
            closeImportDialog();
        }
}

function alertDialogEscapeListener(event) {
        if (event.key === 'Escape') {
            closeAlertDialog();
        }
}

function openImportDialog() {
    let elem=document.importNode(document.getElementById('importDialogTemplate').content, true);
    elem.firstChild.getElementsByClassName('importFromFileBtn')[0].onclick=function(){importDocumentFromFile();};
    elem.firstChild.getElementsByClassName('importFromUrlBtn')[0].onclick=function(){importDocumentFromURL(prompt('What URL do you want? Note that the same-origin policy must allow the URL to be fetched. (Dangerous workaround if it does not: do NOT do this unless you know what you are doing: To disable same-origin enforcement, you can use CORS Everywhere add-on for Firefox, but it allows any Web site access to any other, including your current logins.)'));};
    elem.firstChild.getElementsByClassName('closeImportDiaBtn')[0].onclick=function(){closeImportDialog();};
    document.addEventListener('keyup', importDialogEscapeListener);
    notificationOverlay=document.getElementById('notificationOverlay');
    notificationOverlay.addEventListener('click', function(event) {
        closeImportDialog();
    });
    notificationOverlay.style.display='block';
    notificationOverlay.style.opacity=1;
    document.body.appendChild(elem.firstChild);
}

function openAlertDialog(message) {
    let elem=document.importNode(document.getElementById('alertDialogTemplate').content, true);
    elem.firstChild.getElementsByClassName('closeAlertDiaBtn')[0].onclick=function(){closeAlertDialog();};
    elem.querySelector('.alertDialogMessageRegion').innerHTML=message;
    document.addEventListener('keyup', alertDialogEscapeListener);
    notificationOverlay=document.getElementById('notificationOverlay');
    notificationOverlay.addEventListener('click', function(event) {
        closeAlertDialog();
    });
    notificationOverlay.style.display='block';
    notificationOverlay.style.opacity=1;
    document.body.appendChild(elem.firstChild);
}

function importDocumentFromFile() {
    startSpinner();
    closeImportDialog();
    window.setTimeout(async function(){
        inFormat=document.getElementById('inFormat').value;
        if (!await eiteCall('isSupportedInputFormat', [inFormat])) {
            await implDie(inFormat+' is not a supported input format!');
        }
        let picker=document.getElementById('filepicker');
        picker.click();
        let file=picker.files[0];
        if (file !== undefined && file !== null) {
            let fr=new FileReader();
            await new Promise(resolve => {
                fr.onload=function (){
                    resolve(undefined);
                };
                fr.readAsArrayBuffer(file);
            });
            document.getElementById('inputarea').value = await eiteCall('strFromByteArray', [await eiteCall('importAndExport', [inFormat, 'integerList', new Uint8Array(fr.result)])]);
        }
        removeSpinner(true);
    }, 500);
};

function importDocumentFromURL(path) {
    if (path === null) {
        return;
    }
    if (path === undefined) {
        closeImportDialog();
        return;
    }
    startSpinner();
    closeImportDialog();
    window.setTimeout(async function(){
        inFormat=document.getElementById('inFormat').value;
        if (!await eiteCall('isSupportedInputFormat', [inFormat])) {
            await implDie(inFormat+' is not a supported input format!');
        }
        try {
            document.getElementById('inputarea').value = await eiteCall('strFromByteArray', [await eiteCall('importAndExport', [inFormat, 'integerList', await eiteCall('getFileFromPath', [path])])]);
        }
        catch(e) {
            removeSpinner(true);
        }
        removeSpinner(true);
    }, 500);
};

function exportNotify(name) {
    let elem=document.importNode(document.getElementById('exportNotifyTemplate').content, true);
    elem.firstChild.innerHTML=name;
    elem.firstChild.id='exportNotifyTempId';
    notificationOverlay=document.getElementById('notificationOverlay');
    notificationOverlay.style.display='block';
    notificationOverlay.style.opacity=1;
    document.body.appendChild(elem.firstChild);
    let elemAppended=document.getElementById('exportNotifyTempId');
    elemAppended.removeAttribute('id');
    setTimeout(function() {
        let e=document.getElementsByClassName('exportNotification');
        i=0;
        while (Object.keys(e).length > 0 && i < Object.keys(e).length) {
            notificationOverlay.style.opacity=0;
            e[0].style.opacity=0;
            e[0].style.transform='translate(-50%, -50%) scale(0.75)';
            i=i+1;
        };
        setTimeout(function(){
            let e=document.getElementsByClassName('exportNotification');
            while (Object.keys(e).length > 0) {
                e[0].parentNode.removeChild(e[0]);
            };
            notificationOverlay.style.display='none';
        }, 2000);
    }, 1250);
}

async function ExportDocument() {
    startSpinner();
    window.setTimeout(async function(){
        outFormat=document.getElementById('outFormat').value;
        if (!await eiteCall('isSupportedOutputFormat', [outFormat])) {
            await implDie(outFormat+' is not a supported output format!');
        }
        let exported=Uint8Array.from(await eiteCall('importAndExport', ['sems', outFormat, await getInputDoc()]));
        let blob=await new Blob([exported], { type: 'application/octet-stream' });
        let link=document.createElement('a');
        link.href=window.URL.createObjectURL(blob);
        let date=new Date();
        let outName='Export-'+date.getUTCFullYear()+'m'+(date.getUTCMonth()+1)+'d'+date.getUTCDate()+'-'+date.getUTCHours()+'-'+date.getUTCMinutes()+'-'+date.getUTCSeconds()+'-'+date.getUTCMilliseconds()+'-'+date.getTimezoneOffset()+'.'+await eiteCall('getExportExtension', [outFormat]);
        exportNotify(outName);
        link.download=outName;
        link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
        removeSpinner(true);
    }, 500);
};

// @license-end

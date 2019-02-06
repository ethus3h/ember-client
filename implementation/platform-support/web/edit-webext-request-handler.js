window.addEventListener('message', function(message) {
    canEdit=message[0];
    contents=message[1];
    if (!canEdit) {
        openAlertDialog('The requested content is read-only.');
    }
    document.getElementById('inputarea').value = await strFromByteArray(await importAndExport('ascii', 'integerList', new Uint8Array(fr.result)));
});

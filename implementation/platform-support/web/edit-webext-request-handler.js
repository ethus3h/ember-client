window.addEventListener('message', async function(message) {
    canEdit=message[0];
    contents=message[1];
    if (!canEdit) {
        openAlertDialog('The requested content is read-only.');
    }
    let utf8encoder = new TextEncoder();
    document.getElementById('inputarea').value = await strFromByteArray(await importAndExport('ascii', 'integerList', new Uint8Array(utf8encoder.encode(contents))));
});

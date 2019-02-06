window.addEventListener('message', async function(message) {
    canEdit=message.data[0];
    contents=message.data[1];
    console.log(message.data);
    if (!canEdit) {
        openAlertDialog('The requested content is read-only.');
    }
    let utf8encoder = new TextEncoder();
    document.getElementById('inputarea').value = await strFromByteArray(await importAndExport('ascii', 'integerList', new Uint8Array(utf8encoder.encode(contents))));
});

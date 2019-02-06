b8316ea083754b2e9290591f37d94765EiteWebextensionProviderGetResponse=[];

b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem=document.activeElement;

if ((b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem instanceof HTMLInputElement && (b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem.type == 'text' || b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem.type == 'search')) || (b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem instanceof HTMLTextAreaElement)) {
    b8316ea083754b2e9290591f37d94765EiteWebextensionProviderGetResponse=['b8316ea083754b2e9290591f37d94765EiteWebextensionMessage', true, document.activeElement.value];
}
else {
    b8316ea083754b2e9290591f37d94765EiteWebextensionProviderGetResponse=['b8316ea083754b2e9290591f37d94765EiteWebextensionMessage', false, document.activeElement.innerHTML];
}

window.addEventListener('message', function(message) {
    if (message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessage') {
        // Put the edited content back where it goes
        if ((b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem instanceof HTMLInputElement && (b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem.type == 'text' || b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem.type == 'search')) || (b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem instanceof HTMLTextAreaElement)) {
            b8316ea083754b2e9290591f37d94765EiteWebextensionProviderTempElem.value = message.data[1];
        }
        else {
            // An element that isn't editable has had content sent back to be saved into it. What?!
            alert("A bug has been encountered in EITE: An element that is not editable has had content returned for it.");
        }
    }
});
console.log(b8316ea083754b2e9290591f37d94765EiteWebextensionProviderGetResponse);
b8316ea083754b2e9290591f37d94765EiteWebextensionProviderGetResponse;

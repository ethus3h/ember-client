window.onload=(async function(){
    if (typeof browser === 'undefined') {
        // Not running as a WebExtension
        response=['b8316ea083754b2e9290591f37d94765EiteWebextensionMessage', true, " <input class=\"nav-trigger\" id=\"nav-trigmain>  ", document.baseURI]
        iframe=document.getElementById('eiteEditToolFrame');
        iframe.contentWindow.postMessage(response, iframe.src);
    }
});

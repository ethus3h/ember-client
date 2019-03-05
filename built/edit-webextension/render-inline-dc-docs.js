(async function() {
    // https://web.archive.org/web/20190305052833/https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
    function textNodesUnder(el) {
        var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
        while(n=walk.nextNode()) a.push(n);
        return a;
    }
    let elems=textNodesUnder(document.body);
    let el;
    let re=/􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐/g
    for(let i=0;i<elems.length;i++){
        el=elems[i];
        if(el.textContent.match(re)){
            let ifr=document.createElement('iframe');
            ifr.id='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i;
            ifr.className='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrame';
            ifr.src=browser.runtime.getURL('edit.html');
            el.parentNode.insertBefore(ifr, el);
            ifr=document.getElementById('b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i);
            ifr.contentWindow.postMessage(['b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUtf8', false, el.textContent.match(new RegExp('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐(.*)󼅹󴶯􈡺󿔊􆲦􍸂󲀰􏼝'))[0]], ifr.src);
        }
    }
})();

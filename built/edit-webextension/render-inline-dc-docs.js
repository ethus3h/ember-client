(async function() {
    //let elems=document.getElementsByTagName('*');
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
            ifr.class='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrame';
            ifr.src=browser.runtime.getURL('edit.html');
            ifr.contentWindow.postMessage(['b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUtf8', false, el.textContent.match(new RegExp('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐(.*)󼅹󴶯􈡺󿔊􆲦􍸂󲀰􏼝'))[0]], ifr.src);
            el.insertBefore(ifr);
        }
    }
})();

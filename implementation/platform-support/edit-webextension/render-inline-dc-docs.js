(async function() {
    //let elems=document.getElementsByTagName('*');
    function textNodesUnder(el) {
        var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
        while(n=walk.nextNode()) a.push(n);
        return a;
    }
    let elems=textNodesUnder(document.body);
    let el;
    let re=/􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐/g;
    let nodeVal;
    let foundIndex;
    for (let i=0;i<elems.length;i++) {
        el=elems[i];
        if (el.textContent.match(re)) {
            // based on https://web.archive.org/web/20190311140420/https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript
            let nodeVal=el.nodeValue;
            let foundIndex = nodeVal.indexOf('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐');
            let matchedText = el.textContent.match(new RegExp('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐(.*)󼅹󴶯􈡺󿔊􆲦􍸂󲀰􏼝'));
            let ifr=document.createElement('iframe');
            ifr.id='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i;
            ifr.className='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrame';
            ifr.src=browser.runtime.getURL('edit.html');
            el.parentNode.insertBefore(ifr, el);
            ifr=document.getElementById('b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i);
            ifr.contentWindow.postMessage(['b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUtf8', false, matchedText)[0]], ifr.src);
        }
    }
})();

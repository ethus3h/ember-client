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
    let begin;
    let ifr;
    let matched;
    let textNode;
    let parentNode;
    for (let i=0;i<elems.length;i++) {
        el=elems[i];
        if (el.textContent.match(re)) {
            // based on https://web.archive.org/web/20190311140420/https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript
            nodeVal=el.nodeValue;
            foundIndex = nodeVal.indexOf('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐');
            begin = nodeVal.substring(0, foundIndex);
            parentNode = el.parentNode;
            matched = el.textContent.match(new RegExp('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐(.*)󼅹󴶯􈡺󿔊􆲦􍸂󲀰􏼝'));
            if (begin.length > 0) {
                textNode = document.createTextNode(begin);
                parentNode.insertBefore(textNode, el);
            }
            ifr=document.createElement('iframe');
            ifr.id='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i;
            ifr.className='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrame';
            ifr.src=browser.runtime.getURL('edit.html');
            parentNode.insertBefore(ifr, el);
            ifr=document.getElementById('b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i);
            ifr.contentWindow.postMessage(['b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUtf8', false, matched)[0]], ifr.src);
        }
    }
})();

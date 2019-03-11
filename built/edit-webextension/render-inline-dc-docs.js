(async function() {
    //let elems=document.getElementsByTagName('*');
    let textNodesUnder = function(el) {
        let n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
        while (n=walk.nextNode()) {
            a.push(n);
        }
        return a;
    }
    let elems=textNodesUnder(document.body);
    let added=false;
    let addCssIfNeeded = function() {
        if (!added) {
            added=true;
            let addRule = (function (style) {
                // https://web.archive.org/web/20190311175426/https://stackoverflow.com/questions/4481485/changing-css-pseudo-element-styles-via-javascript
                let sheet = document.head.appendChild(style).sheet;
                return function (selector, css) {
                    let propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
                        return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
                    }).join(";");
                    sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
                };
            })(document.createElement("style"));
            addRule("b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderSpan.::before", {
                display: "block",
                width: "100px",
                height: "100px",
                background: "red",
                "border-radius": "50%",
                content: "' '"
            });
        }
    }
    let el;
    let re=/􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐/g;
    let nodeVal;
    let foundIndex;
    let begin;
    let ifr;
    let matched;
    let textNode;
    let parentNode;
    let span;
    let replacedAll;
    let limit = 1;
    let j;
    for (let i=0;i<elems.length;i++) {
        console.log('bubububbubu');
        el=elems[i];
        if (el.textContent.match(re)) {
            addCssIfNeeded();
            replacedAll = false;
            j = 0;
            while (!replacedAll && j < limit) {
                j = j + 1;
                // based on https://web.archive.org/web/20190311140420/https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript
                nodeVal = el.nodeValue;
                foundIndex = nodeVal.indexOf('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐');
                if (foundIndex < 0) {
                    replacedAll = true;
                }
                else {
                    begin = nodeVal.substring(0, foundIndex);
                    parentNode = el.parentNode;
                    matched = el.textContent.match(new RegExp('􍁝􋶀󼷢󺀊󸥎􈺍󲋠􏺐(.*)󼅹󴶯􈡺󿔊􆲦􍸂󲀰􏼝'))[0];
                    if (begin.length > 0) {
                        textNode = document.createTextNode(begin);
                        parentNode.insertBefore(textNode, el);
                    }
                    span = document.createElement("span");
                    span.className = span.className + ' b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderSpan';
                    span.appendChild(document.createTextNode(matched));
                    parentNode.insertBefore(span, el);
                    ifr=document.createElement('iframe');
                    el.nodeValue = nodeVal.substring(foundIndex + matched.length);
                    ifr.id='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i;
                    ifr.className='b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrame';
                    ifr.src=browser.runtime.getURL('edit.html');
                    parentNode.insertBefore(ifr, el);
                    ifr=document.getElementById('b8316ea083754b2e9290591f37d94765EiteWebextensionInlineRenderFrameId'+i);
                    ifr.contentWindow.postMessage([ 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUtf8', false, matched], ifr.src);
                }
            }
        }
    }
})();

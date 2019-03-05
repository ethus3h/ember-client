(async function {
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
        if(el.textContent.match())
    }
})();

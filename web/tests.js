// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

//        implRunEiteTest("ept", "idiomatic-hello-world-sems");

window.onload = function() {
    async function() {
        await startDocument(await loadDocument('sems', 'idiomatic-hello-world.sems'));
    }();
    startDocument(async function() { return await loadDocument('sems', 'idiomatic-hello-world.sems'); });
    implLoadDatasets(function() {
        // This is where the actual commands to run (entry points) should go
        implOperateOnDocFromUrl("sems", "idiomatic-hello-world.sems", async function (doc) { await runDocument(doc); } );
    });
};

// @license-end

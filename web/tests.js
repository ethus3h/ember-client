// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

window.onload = function() {
    startDocument(async function())
    implLoadDatasets(function() {
        // This is where the actual commands to run (entry points) should go
        implRunEiteTest("ept", "idiomatic-hello-world-sems");
        implOperateOnDocFromUrl("sems", "idiomatic-hello-world.sems", async function (doc) { await runDocument(doc); } );
    });
};

// @license-end

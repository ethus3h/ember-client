window.onload = function() {
    loadDatasets(function() {
        // This is where the actual commands to run (entry points) should go
        runEiteTest('ept', 'idiomatic-hello-world-sems');
        docFromUrl('sems', 'idiomatic-hello-world.sems', function (doc) { doc.run(); } );
    });
};

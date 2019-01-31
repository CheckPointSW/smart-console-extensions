$(document).ready(function () {
    var params = { "callback": "onContext" };
    smxProxy.sendRequest("get-context", null, "onContext");
});

function onContext(context) {
    var tree = JSONTree.create(context);
    $("#example").html(tree);
}
function _(e) {
    return document.getElementById(e);
}
function title(t) {
    _("title").innerHTML = "";
    for (var i = 0; i < t.length; i++) {
        _("title").innerHTML += "<span>" + t.charAt(i).toUpperCase() + "</span>";
    }
}
$(function() {
    title("learn");
    $("#chooselearn").dialog({
        modal: true,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        buttons: {
            "BASH": function() {
                title("learn:bash");
                learn = "bash";
                $( this ).dialog( "close" );
            },
            "C++": function() {
                title("learn:c++");
                learn = "cpp";
                $( this ).dialog( "close" );
            },
            "PYTHON": function() {
                title("learn:python");
                learn = "python";
                $( this ).dialog( "close" );
            },
            "PHP": function() {
                title("learn:php");
                learn = "php";
                $( this ).dialog( "close" );
            }
        }
    });
});
var learn;
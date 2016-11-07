function _(e) {
    return document.getElementById(e);
}
function title(t) {
    _("title").innerHTML = "";
    _("sidemenu").innerHTML = "";
    for (var i = 0; i < t.length; i++) {
        _("title").innerHTML += "<span>" + t.charAt(i).toUpperCase() + "</span>";
    }
}
$(function() {
    if (location.protocol != 'https:' && location.protocol != 'file:') {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
        return;
    }
    
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
                acelng = "sh";
                $( this ).dialog( "close" );
                updatemenu();
            },
            "C++": function() {
                title("learn:c++");
                learn = "cpp";
                acelng = "c_cpp";
                $( this ).dialog( "close" );
                updatemenu();
            },
            "PYTHON": function() {
                title("learn:python");
                learn = "python";
                acelng = "python";
                $( this ).dialog( "close" );
                updatemenu();
            },
            /*"PHP": function() {
                title("learn:php");
                learn = "php";
                acelng = "php";
                $( this ).dialog( "close" );
                updatemenu();
            }*/
        }
    });
});
var learn;
var acelng;
var lastid;
var marletezik = false;

function updatemenu() {
    _("sidemenu").innerHTML = "<div class='loader'>";
    $.ajax({
        url: "https://host.csfcloud.com/learndb/list.php",
        success: function(data){
            _("sidemenu").innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                _("sidemenu").innerHTML += "<button onclick='openTask(\""+data[i].id+"\")'>"+data[i].name+"</button>";
            }
        },
        error: function (xhr, status, error) {
            _("sidemenu").innerHTML = "Hiba történt!";
        }
    });
}

function openTask(id) {
    /*if (marletezik) {
        if (_("editor").value != "") {
            if (!confirm("Biztos ellépsz? A megoldásod törlődni fog!")) {
                return;
            }
        }
    }*/
    _("cnt").innerHTML = "<div class='loader'>";
    lastid = id;
    $.ajax({
        url: "https://host.csfcloud.com/learndb/feladat.php?id=" + id,
        success: function(data){
            _("cnt").innerHTML = "";
            _("cnt").innerHTML += "<h1>"+data.name+"</h1>";
            _("cnt").innerHTML += ""+data.description+"";
            _("cnt").innerHTML += "<br><br>";
            _("cnt").innerHTML += "<h2>Kód</h2>";
            _("cnt").innerHTML += "<textarea id='editor' style='width: 600px; height: 300px;'>";
            _("cnt").innerHTML += "</textarea>";
            _("cnt").innerHTML += "<h2>Példa</h2>";
            _("cnt").innerHTML += "<table><tr><td>"+replaceAll("\n", "<br>", data.e_input)+"</td><td class='icons'>&#xE72A;</td><td>"+replaceAll("\n", "<br>", data.e_output)+"</td></tr></table>";
            _("cnt").innerHTML += "<h2>Ellenőrzés</h2>";
            _("cnt").innerHTML += "<button onclick='checkSolution()' class='checkbutton'>Ellenőrzés</button>";
            _("cnt").innerHTML += "<div id='result'></div>";
            marletezik = true;
            if (learn == 'bash') {
                _("editor").value = "#!/bin/bash\n";
            }
            if (learn == 'cpp') {
                _("editor").value = "\
#include <iostream>\n\
#include <cstdlib>\n\
\n\
using namespace std;\n\
\n\
int main()\n\
{\n\
    return 0;\n\
}";
            }
            $('#editor').ace({ theme: 'twilight', lang: acelng })
        },
        error: function (xhr, status, error) {
            _("editor").innerHTML = "Hiba történt!";
        }
    });
}

function replaceAll(a, b, c) {
    var f = c;
    for (var i = 0; i < c.length; i++) {
        f = f.replace(a, b); 
    }
    return f;
}

function checkSolution() {
	var formdata = new FormData();
	formdata.append("lang", learn);
	formdata.append("code", _("editor").value);
    
    _("result").innerHTML = "<div class='loader'>";
	
	$.ajax({
		url: 'https://host.csfcloud.com/learndb/megoldas.php?id=' + lastid,
		type: 'POST',
		crossDomain: true,
		data: formdata,
		success: function(data){
            var str = "";
            str = "<table class='resulttable'>";
            str += "<tr><td><b>Bemenet /console/</b></td><td><b>Bemenet /paraméterek/</b></td><td><b>Bemenet /file/</b></td><td><b>Kimenet</b></td><td><b>Várt kimenet</b></td><td><b>Eredmény</b></td></tr>";
            for (var i = 0; i < data.length; i++) {
                if (data[i].ok === true) {
                    str += "<tr class='helyes'>";
                } else {
                    str += "<tr class='hibas'>";
                }
                str += "<td>"+replaceAll("\n", "<br>", data[i].input_console)+"</td><td>"+replaceAll("\n", "<br>", data[i].input_parameters)+"</td><td>"+replaceAll("\n", "<br>", data[i].input_file)+"</td><td>"+replaceAll("\n", "<br>", data[i].output)+"</td><td>"+replaceAll("\n", "<br>", data[i].controll)+"</td>";
                if (data[i].ok === true) {
                    str += "<td><b>Helyes</b></td>";
                } else {
                    str += "<td><b>Hibás</b></td>";
                }
                str += "</tr>";
            }
            str += "</table>";
            _("result").innerHTML = str;
		},
		error: function(xhr, status, error){
			console.log("HTTP GET Error: " + error);
            _("result").innerHTML = "Hiba történt!";
		},
        cache: false,
        contentType: false,
        processData: false
	});
}
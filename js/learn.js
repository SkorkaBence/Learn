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
    
    if (getSavedData("userId") == "") {
        saveData("userId", makeid());
    }
    userid = getSavedData("userId");
    
    $("#chooselearn").hide();
    $("#correctanswer").hide();
    $("#osszeskesz").hide();
    
    title(":learn:");
    $("#chooselearn").dialog({
        modal: true,
        width: 600,
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
            "C#": function() {
                title("learn:c#");
                learn = "cs";
                acelng = "csharp";
                $( this ).dialog( "close" );
                updatemenu();
            },
            "python": function() {
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
            },*/
            /*"JavaScript": function() {
                title("learn:python");
                learn = "js";
                acelng = "javascript";
                $( this ).dialog( "close" );
                updatemenu();
            },*/
            "Pascal": function() {
                title("learn:pascal");
                learn = "pascal";
                acelng = "javascript";
                $( this ).dialog( "close" );
                updatemenu();
            }
        }
    });
    
    $("#codeOpener").change(function() {
        var file =  _("codeOpener").files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            var contents = e.target.result;
            //$("#editor").val(contents);
            $('#editor').data('ace').editor.ace.setValue(contents);
        };
    });
});
var learn;
var acelng;
var lastid;
var marletezik = false;
var userid = false;
var firstupdate = true;

function updatemenu() {
    _("sidemenu").innerHTML = "<div class='loader'>";
    $.ajax({
        url: "https://host.csfcloud.com/learndb/list.php?userid="+userid+"&lang="+learn,
        success: function(data){
            _("sidemenu").innerHTML = "";
            var vannemmegoldott = false;
            _("sidemenu").innerHTML += "<h2>Megoldásra vár</h2>";
            for (var i = 0; i < data.length; i++) {
                if (!data[i].completed) {
                    _("sidemenu").innerHTML += "<button onclick='openTask(\""+data[i].id+"\")' class='csf-wave-button light'>"+data[i].name+"</button>";
                    vannemmegoldott = true;
                }
            }
            _("sidemenu").innerHTML += "<h2>Kész feladatok</h2>";
            for (var i = 0; i < data.length; i++) {
                if (data[i].completed) {
                    _("sidemenu").innerHTML += "<button onclick='openTask(\""+data[i].id+"\")' class='completed csf-wave-button light'>"+data[i].name+"</button>";
                }
            }
            if (firstupdate) {
                firstupdate = false;
                _("cnt").innerHTML = "<h1>Kérlek válassz feladatot az oldalsó menüből!</h1>";
            }
            if (!vannemmegoldott) {
                $("#osszeskesz").dialog({
                    modal: true,
                    width: 600,
                    open: function(event, ui) {
                        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                    },
                    buttons: {
                        "Bezár": function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
            }
            csfLoadVaveButtons();
        },
        error: function (xhr, status, error) {
            _("sidemenu").innerHTML = "Hiba történt!";
            _("cnt").innerHTML = "";
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
        url: "https://host.csfcloud.com/learndb/feladat.php?id=" + id + "&userid=" + userid + "&lang=" + learn,
        success: function(data){
            _("cnt").innerHTML = "";
            _("cnt").innerHTML += "<h1>"+data.name+"</h1>";
            _("cnt").innerHTML += ""+data.description+"";
            _("cnt").innerHTML += "<br><br>";
            _("cnt").innerHTML += "<h2>Kód</h2>";
            _("cnt").innerHTML += "<button onclick='loadSolution()' class='checkbutton csf-wave-button light'>Betöltés fileból</button>";
            _("cnt").innerHTML += "<textarea id='editor' style='width: 600px; height: 300px;'>";
            _("cnt").innerHTML += "</textarea>";
            _("cnt").innerHTML += "<h2>Példa</h2>";
            _("cnt").innerHTML += "<table><tr><td>"+replaceAll("\n", "<br>", data.e_input)+"</td><td class='icons'>&#xE72A;</td><td>"+replaceAll("\n", "<br>", data.e_output)+"</td></tr></table>";
            _("cnt").innerHTML += "<h2>Egyéb információk</h2>";
            _("cnt").innerHTML += "Időlimit: 1 másodperc";
            if (learn == 'cs') {
                var str = "";
                str += "<h2>Segítség</h2>";
                str += "Ha segítségre van szüksége, vigye rá az egeret a kitakart mezőre!<br>";
                str += "<code-spoiler>";
                str += "String -> int: Int32.Parse(<string>);<br>";
                str += "String -> double: Double.Parse(<string>);<br>";
                str += "File olvasás: System.IO.File.ReadAllText(@\"utvonal\");<br>";
                str += "Program helye: System.Reflection.Assembly.GetExecutingAssembly().Location;<br>";
                str += "</code-spoiler>";
                _("cnt").innerHTML += str;
            }
            _("cnt").innerHTML += "<h2>Ellenőrzés</h2>";
            _("cnt").innerHTML += "<button onclick='checkSolution()' class='checkbutton csf-wave-button light'>Ellenőrzés</button>";
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
            if (learn == 'cs') {
                _("editor").value = "\
using System;\n\
\n\
namespace Solution\n\
{\n\
    class Program\n\
    {\n\
        static void Main(string[] args)\n\
        {\n\
            \n\
        }\n\
    }\n\
}";
            }
            
            if (data.code !== false) {
                _("editor").value = data.code;
            }
            $('#editor').ace({ theme: 'chaos', lang: acelng });
            csfLoadVaveButtons();
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
    formdata.append("userId", userid);
    
    _("result").innerHTML = "<div class='loader'>";
	
	$.ajax({
		url: 'https://host.csfcloud.com/learndb/megoldas.php?id=' + lastid,
		type: 'POST',
		crossDomain: true,
		data: formdata,
		success: function(data){
            var str = "";
            var helyes = true;
            str = "<table class='resulttable'>";
            str += "<tr><td><b>Bemenet /console/</b></td><td><b>Bemenet /paraméterek/</b></td><td><b>Bemenet /file/</b></td><td><b>Kimenet</b></td><td><b>Várt kimenet</b></td><td><b>Eredmény</b></td></tr>";
            for (var i = 0; i < data.length; i++) {
                if (data[i].ok === true) {
                    str += "<tr class='helyes'>";
                } else {
                    str += "<tr class='hibas'>";
                }
                str += "<td>"+replaceAll("\n", "<br>", data[i].input_console)+"</td><td>"+replaceAll("\n", "<br>", data[i].input_parameters)+"</td><td>"+replaceAll("\n", "<br>", data[i].input_file)+"</td><td>"+replaceAll("\n", "<br>", data[i].output)+"</td>";
                
                if (data[i].regex === false) {
                    str += "<td>"+replaceAll("\n", "<br>", data[i].controll)+"</td>";
                } else {
                    str += "<td>"+replaceAll("\n", "<br>", data[i].controll)+"<hr/>Elfogadott reguláris kifejezés:<br>"+replaceAll("\n", "<br>", data[i].regex)+"</td>";
                }
                
                if (data[i].ok === true) {
                    str += "<td><b>Helyes</b></td>";
                } else {
                    str += "<td><b>Hibás</b></td>";
                }
                helyes = data[i].ok;
                str += "</tr>";
            }
            str += "</table>";
            _("result").innerHTML = str;
            
            if (helyes) {
                $("#correctanswer").dialog({
                    modal: true,
                    width: 600,
                    open: function(event, ui) {
                        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                    },
                    buttons: {
                        "Bezár": function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
                updatemenu();
            }
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

function loadSolution() {
    $("#codeOpener").click();
}

function getSavedData(key) {
    var name = key + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function saveData(key, data) {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = ""+key+"="+data+";"+expires+"";
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 64; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
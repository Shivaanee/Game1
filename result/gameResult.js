function gameLostStart() {
    level = parseInt(sessionStorage.getItem("level"));
    document.getElementById("lvl").innerHTML = "Level " + level;
}

function formatTime(s) {
    var minutes = Math.floor( s/60 );
    var seconds = Math.floor( s - (minutes*60) );

    if(minutes<10){ minutes = "0" + minutes; }
    if(seconds<10){ seconds = "0" + seconds; }

    return minutes + ":" + seconds;
}

function gameWonStart() {
    level = parseInt(sessionStorage.getItem("level"));
    document.getElementById("lvl").innerHTML = "Level " + level;
    time = parseInt(sessionStorage.getItem("time"));
    document.getElementById("time").innerHTML = formatTime(time);
}

function Next() {
    level = parseInt(sessionStorage.getItem("level"));
    sessionStorage.removeItem("level");
    sessionStorage.setItem("level", (level+1).toString());
    window.location.href = "../solo/solo1.html";
}
function start() {
    //display level
    if(!sessionStorage.getItem("level")) {
        document.getElementById("Level").innerHTML += 1;
        sessionStorage.setItem("level", "1");
    }
    else
    document.getElementById("Level").innerHTML += parseInt(sessionStorage.getItem("level"));
    // create Foozie
    if(!foozie) {
        foozie = new Foozie();
    }
    //default starting position - Foozie
    foozie.x = "0";
    foozie.y = "0";
    foozie.display();
    //default position - portal
    if(!portal)
    portal = new Portal();
    portal.defaultPos();
    //zombie
    if(!zombies){
        zombies = new Array();
    }
    makeZombies();
    updateZombiesX();
    updateZombiesY();
    // Stopwatch for best time
    bestTime = 0;
    document.getElementById("timer").innerHTML = formatTime(bestTime);
    update = setInterval(updateTimer, 1000);
    updateTimer();
    // Add event listener to handle keypress event (to move Foozie)
    document.addEventListener("keyup", moveFoozie);
}

function Foozie()
{
    this.dFoozie = 30;
    this.htmlElement = document.getElementById("foozie");
    this.id = this.htmlElement.id;
    this.x = this.htmlElement.offsetLeft;
    this.y = this.htmlElement.offsetTop;
    this.move = function(xDir, yDir)
    {
        this.x += this.dFoozie * xDir;
        this.y += this.dFoozie * yDir;
        this.fitBounds(); // to keep Foozie within gameboard
        this.display();
    };
    this.display = function()
    {
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.display = "block";
    };
    this.fitBounds = function()
    {
        let parent = this.htmlElement.parentElement;
        let iw = this.htmlElement.offsetWidth;
        let ih = this.htmlElement.offsetHeight;
        let l = parent.offsetLeft;
        let t = parent.offsetTop;
        let w = parent.offsetWidth;
        let h = parent.offsetHeight;
        if(this.x < 0) this.x = 0;
        if(this.x > w-iw) this.x = w - iw;
        if(this.y < 0) this.y = 0;
        if(this.y > h-ih) this.y = h - ih;
    };
}

function moveFoozie(e) { // handle keyboard events to move Foozie
    // code of the four keys
    const KEYLEFT = 37;
    const KEYUP = 38;
    const KEYRIGHT = 39;
    const KEYDOWN = 40;

    if(e.keyCode == KEYLEFT) { foozie.move(-1, 0); } // left key
    if(e.keyCode == KEYUP) { foozie.move(0, -1); } // up key
    if(e.keyCode == KEYRIGHT) { foozie.move(1, 0); } //right key
    if(e.keyCode == KEYDOWN) { foozie.move(0, 1); } // down key
}

function getRandomInt(n) {
    return Math.floor(Math.random() * n);
}

class Zombie {
    constructor(zombieNumber) {
        this.htmlElement = createZombieImg(zombieNumber);
        this.id = this.htmlElement.id;
        this.x = this.htmlElement.offsetLeft;
        this.y = this.htmlElement.offsetTop;

        this.move = function(dx, dy) {
            // move zombie by dx, dy
            this.x += dx;
            this.y += dy;
            this.display();
        };
        this.display = function() {
            //adjust position of zombie and display it
            this.fitBounds();
            this.htmlElement.style.left = this.x + "px";
            this.htmlElement.style.top = this.y + "px";
            this.htmlElement.style.display = "block";
        };
        this.fitBounds = function() {
            // adjust postion of zombie within gameboard
            let parent = this.htmlElement.parentElement;
            let iw = this.htmlElement.offsetWidth;
            let ih = this.htmlElement.offsetHeight;
            let w = parent.offsetWidth;
            let h = parent.offsetHeight;
            if (this.x < 0) this.x  = 0;
            if (this.x > w-iw) this.x = w-iw;
            if (this.y < 0) this.y = 0;
            if (this.y > h-ih) this.y = h-ih;
        };
        this.moveZombiesY = function() {
            let speed = 20;
            let dy = getRandomInt(2*speed) - speed;
            this.move(0, dy);

        };
    }
}

function createZombieImg(wNum) {
    // get dimension and position of board div
	let boardDiv = document.getElementById("content");
	let boardDivW = boardDiv.offsetWidth;
	let boardDivH = boardDiv.offsetHeight;
	let boardDivX = boardDiv.offsetLeft;
	let boardDivY = boardDiv.offsetTop;
	// create IMG element
	let img = document.createElement("img");
	img.setAttribute("src", "../game-elements/zombie.gif");
	img.setAttribute("width", "80");
	img.setAttribute("alt", "zombie");
	img.setAttribute("id", "zombie" + wNum);
	img.setAttribute("class", "zombie");
    img.setAttribute("z-index", "2");
	// add the IMG element to the DOM as a child of board div
	img.style.position = "absolute";
	boardDiv.appendChild(img);
	// set initial position
	let x = getRandomInt(boardDivW);
	let y = getRandomInt(boardDivH);
	img.style.left = (x + 1) + "px";
	img.style.top = (y-100) + "px";
	// return img object
	return img;
}

function makeZombies(){
	let level = parseInt(sessionStorage.getItem("level")) + 1;
    let i = 0;
    while(i < level) {
        var zombie = new Zombie(i); // create object and its IMG element
        zombie.display(); // display the zombie
        zombies.push(zombie); // add zombie object to bees array
        i++;
    }
}

function clearZombies() {
    let boardDiv = document.getElementById("content");
    while(boardDiv.children.length>4){
        boardDiv.removeChild(boardDiv.lastChild);
        zombies.pop();
    }
}

function moveZombiesX() {
    let level = parseInt(sessionStorage.getItem("level"));
    let speed = 20;
    // move each zombie to a random location
    for(let i = 0; i<zombies.length; i++) {
        let dx = getRandomInt(2*speed) - speed;
        zombies[i].move(dx, 0);
        if(overlap(zombies[i], foozie))
        zombieHit();
    }
}

function updateZombiesX() {
    moveZombiesX();
    updateTimerZombie = setTimeout(updateZombiesX, 90);
}

function updateZombiesY() {
    for(let i = 0; i<zombies.length; i++) {
        zombies[i].moveZombiesY();
    }
    updateTimerZombieY = setTimeout(updateZombiesY, 1000);
}

function updateTimer() {
    /*if(overlap(zombie, foozie)) {
        zombieHit();
    } else */ if(overlap(foozie, portal)) {
        portalHit();
    } else {
        bestTime += 1;
        document.getElementById("timer").innerHTML = formatTime(bestTime);
    }
}

function formatTime(s) {
    var minutes = Math.floor( s/60 );
    var seconds = Math.floor( s - (minutes*60) );

    if(minutes<10){ minutes = "0" + minutes; }
    if(seconds<10){ seconds = "0" + seconds; }

    return minutes + ":" + seconds;
}

function Portal() {
    this.htmlElement = document.getElementById("portal");
    this.id = this.htmlElement.id;
    this.x = this.htmlElement.offsetLeft;
    this.y = this.htmlElement.offsetTop;
    this.display = function()
    {
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.display = "block";
    };
    this.defaultPos = function()
    {
        let parent = this.htmlElement.parentElement;
        let iw = this.htmlElement.offsetWidth;
        let ih = this.htmlElement.offsetHeight;
        let l = parent.offsetLeft;
        let t = parent.offsetTop;
        let w = parent.offsetWidth;
        let h = parent.offsetHeight;
        this.x = w - iw + 15;
        this.y = h - ih - 15;
        this.display();
    };
}

// WHAT TO DO AFTER GAME IS WON
function portalHit() {
    clearInterval(updateTimerZombie);
    clearInterval(update);
    sessionStorage.setItem("time", bestTime.toString());
    window.location.href = '../result/gameWon.html';
}

//WHAT TO DO AFTER GAME IS LOST
function zombieHit() {
    clearInterval(updateTimerZombie);
    clearInterval(update);
    window.location.href = '../result/gameLost.html';
}

function overlap(element1, element2) {
    //rectangle of first element
    left1 = element1.htmlElement.offsetLeft;
    top1 = element1.htmlElement.offsetTop;
    right1 = element1.htmlElement.offsetLeft + element1.htmlElement.offsetWidth;
    bottom1 = element1.htmlElement.offsetTop + element1.htmlElement.offsetHeight;
    //rectangle of second element
    left2 = element2.htmlElement.offsetLeft;
    top2 = element2.htmlElement.offsetTop;
    right2 = element2.htmlElement.offsetLeft + element2.htmlElement.offsetWidth;
    bottom2 = element2.htmlElement.offsetTop + element2.htmlElement.offsetHeight;
    //intersection of two rectangles
    x_intersect = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
    y_intersect = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2))
    intersect_area = x_intersect * y_intersect;

    if(intersect_area == 0 || isNaN(intersect_area))
    return false;
    return true;
}
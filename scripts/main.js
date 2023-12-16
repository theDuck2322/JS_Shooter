const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = innerWidth;
const height = innerHeight;
canvas.width = width;
canvas.height = height;

let speed = 4;
let speedR = 0.05;

// initializing classes

class Text {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Player {
    constructor(px, py, width, height, rotation) {
        this.px = px;
        this.py = py;
        this.width = width;
        this.height = height;
        this.rotation = rotation; // Initialize rotation to 0
        this.sprite = new Image();
        this.sprite.src = 'Resources/rocket.png';
    }
}

// making objects

let player = new Player((width / 2) - 50, (height / 2) - 80, 50, 80);
player.rotation = 0;

let scoreText = new Text(1300, 50);
let score = 0;

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`Score: ${score}`, scoreText.x, scoreText.y);
}

function getScore() {
    // Implement score logic if needed
}

function clear() {
    ctx.fillStyle = "#000061";
    ctx.fillRect(0, 0, width, height);
}

function drawPlayer() {
    ctx.save(); // Save the current context state
    ctx.translate(player.px + player.width / 2, player.py + player.height / 2); // Translate to the center of the player
    ctx.rotate(player.rotation); // Rotate
    ctx.drawImage(player.sprite, -player.width / 2, -player.height / 2, player.width, player.height); // Draw the rotated player
    ctx.restore(); // Restore the saved context state
}

var keys = {
    "w": false,
    "a": false,
    "s": false,
    "d": false,
    "ArrowLeft": false,
    "ArrowRight": false,
    "h": false
};

// Add event listeners to update the keys object
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    keys[event.key] = true;
    event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    keys[event.key] = false;
    event.preventDefault();
}, true);

// Your playerMove function
function playerMove() {
    // Update the player's position based on the keys pressed
    let degree = player.rotation * (180 / Math.PI);
    let rad = degree / (180 / Math.PI);
    
    if (degree >= 360) {
        degree = Math.abs(degree - 360); // Subtract 360 degrees
        rad = degree / (180 / Math.PI);
        player.rotation = rad;
    }
    if(degree <=0){
        degree = Math.abs(degree - 360); // Subtract 360 degrees
        rad = degree / (180 / Math.PI);
        player.rotation = rad;
    }


    if (keys["w"]) {
        player.py -= speed;
    }
    if (keys["a"]) {
        player.px -= speed;
    }
    if (keys["s"]) {
        player.py += speed;
    }
    if (keys["d"]) {
        player.px += speed;
    }

    if (keys["ArrowLeft"]) {
        player.rotation -= speedR;
    }
    if (keys["ArrowRight"]) {
        player.rotation += speedR;
    }
    ///// test key /////
    if(keys["h"]){
        console.log(`Player Rotation ${player.rotation} in degres = ${degree} and bac to rad = ${rad}`);
    }
}

let shootEnabled = true; // Add a flag to check if shooting is enabled

function Shoot() {
    if (shootEnabled) {
        canvas.addEventListener("mousedown", createBullet);
        shootEnabled = false; // Disable shooting until the bullet is created
    }

    function createBullet(event) {
        if (event.button === 0) {
            ctx.fillStyle = "#ff0000";
            console.log("Shoot");

            // Optionally, remove the event listener if you don't need it anymore
            canvas.removeEventListener("mousedown", createBullet);

            shootEnabled = true; // Enable shooting again after the bullet is created
        }
    }
}


function draw() {
    clear();
    drawPlayer();
    drawScore();
}

function start() {
    score = 0;
    requestAnimationFrame(update);
}

function update() {
    draw();
    getScore();
    playerMove();
    Shoot();





    requestAnimationFrame(update);
}

start();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = innerWidth;
const height = innerHeight;
canvas.width = width;
canvas.height = height;

let speed = 4;
let speedR = 0.05;

// Player class
class Player {
    constructor(x, y, width, height, rotation) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.sprite = new Image();
        this.sprite.src = 'Resources/rocket.png';
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

// Bullet class
class Bullet {
    constructor(x, y, width, height, rotation) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.speed = 10;
    }

    update() {
        this.x += this.speed * Math.cos(this.rotation);
        this.y += this.speed * Math.sin(this.rotation);
    }

    draw() {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Text class
class Text {
    constructor(x, y, text, font) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.font = font;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
    }
}

// Game state
let player = new Player((width / 2) - 50, (height / 2) - 80, 50, 80, 0);
let bullets = [];
let scoreText = new Text(1300, 50, "Score: 0", "bold 18px Arial");
let score = 0;

// Input handling
let keys = {
    "w": false,
    "a": false,
    "s": false,
    "d": false,
    "ArrowLeft": false,
    "ArrowRight": false,
    "h": false
};

window.addEventListener("keydown", function (event) {
    keys[event.key] = true;
    event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
    keys[event.key] = false;
    event.preventDefault();
}, true);

// Game functions
function clear() {
    ctx.fillStyle = "#000061";
    ctx.fillRect(0, 0, width, height);
}

function drawScore() {
    scoreText.text = `Score: ${score}`;
    scoreText.draw();
}

function playerMove() {
    if (keys["w"]) player.y -= speed;
    if (keys["a"]) player.x -= speed;
    if (keys["s"]) player.y += speed;
    if (keys["d"]) player.x += speed;

    if (keys["ArrowLeft"]) player.rotation -= speedR;
    if (keys["ArrowRight"]) player.rotation += speedR;
    if (keys["x"]) player.rotation -= speedR;
    if (keys["c"]) player.rotation += speedR;
    if (keys["h"]) {
        console.log(`Player Rotation ${player.rotation}`);
    }
}


let canShoot = true;

// Add an event listener for mouse clicks
canvas.addEventListener("mousedown", function (event) {
    if (event.button === 0 && canShoot) { // 0 represents the left mouse button
        shoot();
        canShoot = false; // Set to false to prevent further shooting until the next click
    }
});

function shoot() {
    const offsetX = player.width / 2;
    const offsetY = player.height / 2;
    const startX = player.x + offsetX;  // Change to player.x
    const startY = player.y + offsetY;  // Change to player.y
    bullets.push(new Bullet(startX-5, startY-5, 10, 10, player.rotation - Math.PI/2));
    // Add any other shooting-related logic here

    setTimeout(() => {
        canShoot = true;
    }, 5); 
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.update();

        // Remove bullets that are out of bounds
        if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
            bullets.splice(i, 1);
        } else {
            bullet.draw();
        }
    }
}

function update() {
    clear();
    playerMove();
    player.draw();
    updateBullets();
    drawScore();
    requestAnimationFrame(update);
}

function start() {
    score = 0;
    requestAnimationFrame(update);
}

start();

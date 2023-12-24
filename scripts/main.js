const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = innerWidth;
const height = innerHeight;
canvas.width = width;
canvas.height = height;

let speed = 4;
let astSpeed = 0.5;
let speedR = 0.05;

const asteroidImages = ['/Resources/asteroid1.png', '/Resources/asteroid2.png'];
const asteroidCount = 50;

function chooseImage() {
    const randomImage = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
    return randomImage;
}

function checkCollision2D(x1, y1, width1, height1, x2, y2, width2, height2) {
    // Calculate the sides of each rectangle
    const left1 = x1;
    const right1 = x1 + width1;
    const top1 = y1;
    const bottom1 = y1 + height1;

    const left2 = x2;
    const right2 = x2 + width2;
    const top2 = y2;
    const bottom2 = y2 + height2;

    // Check for overlap along both axes (X and Y)
    if (right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2) {
        // No overlap along either axis
        return false;
    } else {
        // Overlapping along both axes
        return true;
    }
}

class Player {
    constructor(x, y, width, height, rotation, health) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.health = health;
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

class Asteroid {
    constructor(x, y, width, height, rotation) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.image = new Image();
        this.image.src = chooseImage();
    }

    static createRandomAsteroid() {
        const side = Math.floor(Math.random() * 3); // 0: left, 1: top, 2: right
        let randomX, randomY;

        switch (side) {
            case 0: // Left side
                randomX = 0;
                randomY = Math.random() * height;
                break;
            case 1: // Top side
                randomX = Math.random() * width;
                randomY = 0;
                break;
            case 2: // Right side
                randomX = width;
                randomY = Math.random() * height;
                break;
            default:
                break;
        }

        const randomRotation = Math.random() * Math.PI * 2;

        return new Asteroid(randomX, randomY, 50, 50, randomRotation);
    }

    update() {
        
        this.x += astSpeed * Math.cos(this.rotation);
        this.y += astSpeed * Math.sin(this.rotation);
    }


    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

let player = new Player((width / 2) - 50, (height / 2) - 80, 50, 80, 0, 100);
let bullets = [];
let asteroids = [];
let scoreText = new Text(1300, 50, "Score: 0", "bold 18px Arial");
let hpText = new Text(50, 50, "HP: 100", "bold 18px Arial");
let score = 0;

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

function clear() {
    // Set the background image of the canvas
    const imageUrl = "Resources/galaxy.png"; // Replace with the actual path to your image file
    canvas.style.backgroundImage = `url('${imageUrl}')`;
    canvas.style.backgroundSize = "cover"; // Adjust as needed

    // Clear the canvas content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function textDraw() {
    scoreText.text = `Score: ${score}`;
    scoreText.draw();
    hpText.text = `HP: ${player.health}`;
    hpText.draw();
}

function playerMove() {
    if (keys["w"] && player.y > 0) player.y -= speed;
    if (keys["a"] && player.x > 0) player.x -= speed;
    if (keys["s"] && player.y < height - player.height - 5) player.y += speed;
    if (keys["d"] && player.x < width - player.width - 10) player.x += speed;

    if (keys["ArrowLeft"]) player.rotation -= speedR;
    if (keys["ArrowRight"]) player.rotation += speedR;
    if (keys["x"]) player.rotation -= speedR;
    if (keys["c"]) player.rotation += speedR;
}

let canShoot = true;

canvas.addEventListener("mousedown", function (event) {
    if (event.button === 0 && canShoot) {
        shoot();
        canShoot = false;
    }
});

function shoot() {
    const offsetX = player.width / 2;
    const offsetY = player.height / 2;
    const startX = player.x + offsetX;
    const startY = player.y + offsetY;
    bullets.push(new Bullet(startX - 5, startY - 5, 10, 10, player.rotation - Math.PI / 2));

    setTimeout(() => {
        canShoot = true;
    }, 5);
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.update();

        // Check for collisions with asteroids
        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];

            if (checkCollision2D(bullet.x, bullet.y, bullet.width, bullet.height, asteroid.x, asteroid.y, asteroid.width, asteroid.height)) {
                // Collision detected
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                score += 10; // Increase the score (you can adjust this value)
            }
        }

        // Remove bullets that are out of bounds
        if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
            bullets.splice(i, 1);
        } else {
            bullet.draw();
        }
    }
}

function updateAsteroids() {
    while (asteroids.length < asteroidCount) {
        asteroids.push(Asteroid.createRandomAsteroid());
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        asteroid.update();

        // Check for collisions with the player
        if (checkCollision2D(player.x, player.y, player.width, player.height, asteroid.x, asteroid.y, asteroid.width, asteroid.height)) {
            // Collision detected
            asteroids.splice(i, 1);
            player.health -= 25; // Decrease player's health (you can adjust this value)
        }

        // Remove asteroids that are out of bounds
        if (asteroid.y > height || asteroid.x > width || asteroid.x + asteroid.width < 0) {
            asteroids.splice(i, 1);
        } else {
            asteroid.draw();
        }
    }
}

function update() {
    clear();
    playerMove();
    player.draw();
    if(player.health <= 0)
        Reset();
    updateBullets();
    updateAsteroids();
    textDraw();
    if (keys["h"]) 
        console.log(`Player Rotation ${player.rotation}`);
    requestAnimationFrame(update);
}

function Reset()
{
    alert(`You died, your score was ${score}`);
    score = 0;
    player.health = 100;
    player.rotation = 0;
    player.x = width/2 - player.width;
    player.y = height/2 - player.height;
    asteroids = [];

    // Clear player movement
    keys = {
        "w": false,
        "a": false,
        "s": false,
        "d": false,
        "ArrowLeft": false,
        "ArrowRight": false,
        "x": false,
        "c": false,
        "h": false
    };
}


function start() {
    score = 0;
    requestAnimationFrame(update);
}

start();

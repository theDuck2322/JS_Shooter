const asteroidCount = 25; // Adjust as needed

const asteroidImages = ['/Resources/asteroid1.png', '/Resources/asteroid2.png'];

    function createAsteroid(container) {
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';

        // Adjust the initial vertical position (top) as needed
        asteroid.style.top = `${Math.random() * -10}px`;

        asteroid.style.left = `${Math.random() * window.innerWidth}px`;

        // Randomly choose an image path
        const randomImage = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
        asteroid.style.backgroundImage = `url('${randomImage}')`;

        // Adjust the size of the asteroid randomly
        const asteroidSize = Math.floor(Math.random() * (50 - 20 + 1)) + 20; // Adjust the size range as needed
        asteroid.style.width = `${asteroidSize}px`;
        asteroid.style.height = `${asteroidSize}px`;

        container.appendChild(asteroid);
        animateAsteroid(asteroid, container);
    }


function animateAsteroid(asteroid, container) {
    const speed = 1 + Math.random() * 2; // Adjust speed
    const rotation = Math.random() * 360; // Random rotation

    asteroid.style.transform = `rotate(${rotation}deg)`;

    const animation = asteroid.animate(
        [
            { transform: 'translateY(0)' },
            { transform: `translateY(${window.innerHeight}px)` }
        ],
        {
            duration: 5000 / speed, // Adjust duration based on speed
            easing: 'linear',
            iterations: Infinity
        }
    );

    animation.onfinish = () => {
        container.removeChild(asteroid);
        createAsteroid(container);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const animationContainer = document.getElementById('animation-container');
    
    for (let i = 0; i < asteroidCount; i++) {
        createAsteroid(animationContainer);
    }
});

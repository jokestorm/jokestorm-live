// Got this from ChatGPT, pretty cool
console.log("Tank Script Loaded");
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const projectile = {
    x: 0,
    y: 0,
    radius: 10,
    speed: 3,
    direction: 0
};

function loop() {
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    projectile.x += projectile.speed * Math.cos(projectile.direction);
    projectile.y += projectile.speed * Math.sin(projectile.direction);

    ctx.beginPath();
    ctx.arc(projectile.x,projectile.y, projectile.radius, 0,Math.PI *2);
    ctx.fillStyle = 'black'
    ctx.fill();

    requestAnimationFrame(loop);
}

loop();

function collision(a,b) {
    return a.x -b.x < b.width / 2 + a.radius &&
    b.x - a.x < b.width / 2 + a.radius &&
    a.y - b.y < b.height / 2 + a.radius &&
    b.y - a.y < b.height / 2 + a.radius;
}
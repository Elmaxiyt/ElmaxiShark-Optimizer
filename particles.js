// --- PLEXUS/NEURAL NETWORK BACKGROUND EFFECT ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let width, height, particles;
const PARTICLE_COUNT = 80;
const CONNECT_DISTANCE = 100;

const mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function init() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() * 0.4 - 0.2);
    this.speedY = (Math.random() * 0.4 - 0.2);
    this.color = '#9400D3';
  }

  update() {
    if (this.x > width || this.x < 0) this.speedX *= -1;
    if (this.y > height || this.y < 0) this.speedY *= -1;

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if(distance < mouse.radius){
        this.x -= dx / 20;
        this.y -= dy / 20;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function connect() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONNECT_DISTANCE) {
        const opacity = 1 - (distance / CONNECT_DISTANCE);
        ctx.strokeStyle = `rgba(148, 0, 211, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (const particle of particles) {
    particle.update();
    particle.draw();
  }
  connect();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  init();
});

init();
animate();
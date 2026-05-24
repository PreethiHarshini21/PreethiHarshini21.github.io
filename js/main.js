// ===== GLOWING GRADIENT BLOB CURSOR WITH TRAIL =====
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
const trail = [];
const TRAIL_LENGTH = 8;

// Create trail elements
for (let i = 0; i < TRAIL_LENGTH; i++) {
	const dot = document.createElement('div');
	dot.classList.add('cursor-trail');
	const size = 20 - (i * 2);
	dot.style.width = size + 'px';
	dot.style.height = size + 'px';
	dot.style.opacity = (1 - i / TRAIL_LENGTH) * 0.4;
	document.body.appendChild(dot);
	trail.push({ el: dot, x: 0, y: 0 });
}

document.addEventListener('mousemove', (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
});

function animateCursor() {
	// Smooth main glow
	glowX += (mouseX - glowX) * 0.18;
	glowY += (mouseY - glowY) * 0.18;
	cursorGlow.style.left = (glowX - 16) + 'px';
	cursorGlow.style.top = (glowY - 16) + 'px';

	// Animate trail with staggered easing
	let prevX = glowX, prevY = glowY;
	for (let i = 0; i < trail.length; i++) {
		const t = trail[i];
		t.x += (prevX - t.x) * (0.25 - i * 0.02);
		t.y += (prevY - t.y) * (0.25 - i * 0.02);
		const size = parseInt(t.el.style.width);
		t.el.style.left = (t.x - size / 2) + 'px';
		t.el.style.top = (t.y - size / 2) + 'px';
		prevX = t.x;
		prevY = t.y;
	}

	requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects for interactive elements
document
	.querySelectorAll('a,button,.project-card,.skill-item,.nav-cta,.submit-btn,.cert-card,.contact-link,.stat-chip')
	.forEach((el) => {
		el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
		el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
	});

// Hide cursor on touch devices
if ('ontouchstart' in window) {
	cursorGlow.style.display = 'none';
	trail.forEach(t => t.el.style.display = 'none');
	document.body.style.cursor = 'auto';
}

// ===== STICKY NAV =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
	navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
function openMobile() {
	document.getElementById('mobileMenu').classList.add('open');
}
function closeMobile() {
	document.getElementById('mobileMenu').classList.remove('open');
}
document.getElementById('mobileClose').addEventListener('click', closeMobile);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('active');
				revealObserver.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
	const scrollY = window.scrollY + 100;
	sections.forEach((s) => {
		const top = s.offsetTop - 120,
			h = s.offsetHeight,
			id = s.getAttribute('id');
		const link = document.querySelector(`.nav-links a[href="#${id}"]`);
		if (link) {
			scrollY >= top && scrollY < top + h
				? link.classList.add('active')
				: link.classList.remove('active');
		}
	});
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((a) => {
	a.addEventListener('click', (e) => {
		const href = a.getAttribute('href');
		if (href === '#') return;
		const target = document.querySelector(href);
		if (target) {
			e.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			closeMobile();
		}
	});
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
	document.querySelectorAll('.stat-chip .number').forEach((el) => {
		const text = el.textContent;
		const match = text.match(/(\d+)/);
		if (!match) return;
		const target = parseInt(match[1]);
		const suffix = text.replace(match[1], '');
		let current = 0;
		const increment = Math.ceil(target / 40);
		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				current = target;
				clearInterval(timer);
			}
			el.textContent = current + suffix;
		}, 30);
	});
}
const statsObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				animateCounters();
				statsObserver.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.5 }
);
const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

function setTheme(isLight) {
	if (isLight) {
		document.body.classList.add('light-theme');
		if (sunIcon && moonIcon) {
			sunIcon.style.display = 'none';
			moonIcon.style.display = 'block';
		}
		localStorage.setItem('theme', 'light');
	} else {
		document.body.classList.remove('light-theme');
		if (sunIcon && moonIcon) {
			sunIcon.style.display = 'block';
			moonIcon.style.display = 'none';
		}
		localStorage.setItem('theme', 'dark');
	}
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
	setTheme(true);
} else {
	setTheme(false);
}

if (themeToggle) {
	themeToggle.addEventListener('click', () => {
		const isLight = !document.body.classList.contains('light-theme');
		setTheme(isLight);
	});
}

// ===== FLOATING PARTICLES =====
function createParticles() {
	const container = document.querySelector('.particles');
	if (!container) return;
	for (let i = 0; i < 20; i++) {
		const particle = document.createElement('div');
		particle.classList.add('particle');
		particle.style.left = Math.random() * 100 + '%';
		particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
		particle.style.animationDelay = (Math.random() * 10) + 's';
		particle.style.width = (Math.random() * 3 + 2) + 'px';
		particle.style.height = particle.style.width;
		container.appendChild(particle);
	}
}
createParticles();

// ===== TYPING EFFECT =====
function typeEffect() {
	const el = document.getElementById('typingText');
	if (!el) return;
	const roles = ['Power BI Developer', 'Data Analyst', 'BI Solutions Architect', 'Dashboard Designer'];
	let roleIndex = 0;
	let charIndex = 0;
	let isDeleting = false;

	function type() {
		const currentRole = roles[roleIndex];
		if (isDeleting) {
			el.textContent = currentRole.substring(0, charIndex - 1);
			charIndex--;
		} else {
			el.textContent = currentRole.substring(0, charIndex + 1);
			charIndex++;
		}

		let speed = isDeleting ? 50 : 80;

		if (!isDeleting && charIndex === currentRole.length) {
			speed = 2000;
			isDeleting = true;
		} else if (isDeleting && charIndex === 0) {
			isDeleting = false;
			roleIndex = (roleIndex + 1) % roles.length;
			speed = 500;
		}

		setTimeout(type, speed);
	}
	type();
}
typeEffect();

// ===== DATA VISUALIZATION CANVAS =====
function initDataViz() {
	const canvas = document.getElementById('dataVizCanvas');
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	const dpr = window.devicePixelRatio || 1;
	canvas.width = 600 * dpr;
	canvas.height = 600 * dpr;
	ctx.scale(dpr, dpr);

	const centerX = 300, centerY = 300;
	const nodes = [];
	const connections = [];

	// Create data nodes in orbital arrangement (radii scaled by ~1.5x, sizes by ~1.3x for larger screen visibility)
	const categories = [
		{ label: 'Power BI', radius: 180, angle: 0, size: 36, color: '#a78bfa' },
		{ label: 'DAX', radius: 150, angle: 0.8, size: 28, color: '#c084fc' },
		{ label: 'SQL', radius: 195, angle: 1.5, size: 32, color: '#818cf8' },
		{ label: 'Python', radius: 165, angle: 2.3, size: 26, color: '#f472b6' },
		{ label: 'Snowflake', radius: 210, angle: 3.0, size: 30, color: '#67e8f9' },
		{ label: 'Tableau', radius: 157, angle: 3.8, size: 27, color: '#fb923c' },
		{ label: 'Azure', radius: 187, angle: 4.5, size: 28, color: '#60a5fa' },
		{ label: 'ETL', radius: 172, angle: 5.2, size: 24, color: '#34d399' },
		{ label: 'Fabric', radius: 202, angle: 5.8, size: 26, color: '#e879f9' },
	];

	categories.forEach((cat, i) => {
		nodes.push({
			x: centerX + Math.cos(cat.angle) * cat.radius,
			y: centerY + Math.sin(cat.angle) * cat.radius,
			baseAngle: cat.angle,
			radius: cat.radius,
			size: cat.size,
			label: cat.label,
			color: cat.color,
			speed: 0.003 + Math.random() * 0.004,
			pulsePhase: Math.random() * Math.PI * 2,
		});
	});

	// Create connections between nearby nodes
	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			if (Math.random() > 0.5) {
				connections.push({ from: i, to: j });
			}
		}
	}

	let time = 0;

	function draw() {
		ctx.clearRect(0, 0, 600, 600);
		time += 0.016;

		// Update node positions (orbital movement)
		nodes.forEach((node) => {
			node.baseAngle += node.speed;
			node.x = centerX + Math.cos(node.baseAngle) * node.radius;
			node.y = centerY + Math.sin(node.baseAngle) * node.radius;
		});

		// Draw connections
		connections.forEach((conn) => {
			const from = nodes[conn.from];
			const to = nodes[conn.to];
			const dx = to.x - from.x;
			const dy = to.y - from.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const opacity = Math.max(0, 1 - dist / 375) * 0.15;

			ctx.beginPath();
			ctx.moveTo(from.x, from.y);
			ctx.lineTo(to.x, to.y);
			ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
			ctx.lineWidth = 1;
			ctx.stroke();

			// Animated data pulse along connections
			const pulsePos = (time * 0.5 + conn.from * 0.3) % 1;
			const px = from.x + dx * pulsePos;
			const py = from.y + dy * pulsePos;
			ctx.beginPath();
			ctx.arc(px, py, 2, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(167, 139, 250, ${opacity * 3})`;
			ctx.fill();
		});

		// Draw orbital rings (radius scaled)
		[120, 180, 240].forEach((r, i) => {
			ctx.beginPath();
			ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
			ctx.strokeStyle = `rgba(167, 139, 250, ${0.05 - i * 0.01})`;
			ctx.lineWidth = 1;
			ctx.setLineDash([4, 8]);
			ctx.stroke();
			ctx.setLineDash([]);
		});

		// Draw center node (scaled)
		const centerPulse = Math.sin(time * 2) * 0.15 + 0.85;
		ctx.beginPath();
		ctx.arc(centerX, centerY, 52 * centerPulse, 0, Math.PI * 2);
		const centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 52);
		centerGrad.addColorStop(0, 'rgba(167, 139, 250, 0.3)');
		centerGrad.addColorStop(1, 'rgba(167, 139, 250, 0.05)');
		ctx.fillStyle = centerGrad;
		ctx.fill();
		ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
		ctx.lineWidth = 1.5;
		ctx.stroke();

		// Center label (larger)
		ctx.fillStyle = 'rgba(167, 139, 250, 0.9)';
		ctx.font = '500 15px "Space Grotesk", sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('DATA', centerX, centerY - 8);
		ctx.fillText('ANALYST', centerX, centerY + 10);

		// Draw nodes
		nodes.forEach((node) => {
			const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.15 + 0.85;
			const s = node.size * pulse;

			// Node glow
			const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, s * 1.5);
			glowGrad.addColorStop(0, node.color + '30');
			glowGrad.addColorStop(1, 'transparent');
			ctx.beginPath();
			ctx.arc(node.x, node.y, s * 1.5, 0, Math.PI * 2);
			ctx.fillStyle = glowGrad;
			ctx.fill();

			// Node circle
			ctx.beginPath();
			ctx.arc(node.x, node.y, s * 0.5, 0, Math.PI * 2);
			const nodeGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, s * 0.5);
			nodeGrad.addColorStop(0, node.color + 'cc');
			nodeGrad.addColorStop(1, node.color + '60');
			ctx.fillStyle = nodeGrad;
			ctx.fill();

			// Node label (larger, adjusted spacing)
			ctx.fillStyle = 'rgba(237, 233, 246, 0.8)';
			ctx.font = '500 12px "Inter", sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText(node.label, node.x, node.y + s * 0.5 + 18);
		});

		requestAnimationFrame(draw);
	}
	draw();
}
initDataViz();

// ===== CONSOLE EASTER EGG =====
console.log(
	'%c💜 Welcome to Preethi Harshini\'s Portfolio!',
	'font-size:20px;font-weight:bold;color:#a78bfa'
);
console.log(
	"%cBuilt with passion for data & design",
	'font-size:14px;color:#9490a8'
);

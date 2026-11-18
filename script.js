const DISPLAY_NAME = "Geby Verita Aulia";
const HEART_PARTICLE_COUNT = 12;

const nameElement = document.querySelector("#animated-name");
const particleContainer = document.querySelector("#heart-particles");

nameElement.textContent = DISPLAY_NAME;

const heartColors = ["#ff6fae", "#ff9bc8", "#ffffff", "#d7a1ff"];
for (let i = 0; i < HEART_PARTICLE_COUNT; i += 1) {
  const heart = document.createElement("span");
  heart.className = "heart-particle";
  heart.textContent = String.fromCharCode(0x2665);
  heart.style.setProperty("--heart-x", `${Math.random() * 280 - 140}px`);
  heart.style.setProperty("--heart-y", `${Math.random() * 100 - 50}px`);
  heart.style.setProperty("--heart-size", `${Math.random() * 9 + 8}px`);
  heart.style.setProperty("--heart-duration", `${Math.random() * 2 + 3.5}s`);
  heart.style.setProperty("--heart-delay", `${Math.random() * -5}s`);
  heart.style.setProperty("--heart-color", heartColors[i % heartColors.length]);
  particleContainer.appendChild(heart);
}

const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];
const tl = gsap.timeline();

for (let i = 0; i < length; i += 0.8) {
  const point = path.getPointAtLength(i);

  const vector = new THREE.Vector3(point.x - 300, -(point.y - 275), 0);
  vector.x += (Math.random() - 0.5) * 20;
  vector.y += (Math.random() - 0.5) * 20;
  vector.z += (Math.random() - 0.5) * 50;
  vertices.push(vector);
  tl.from(vector, { x: 0, y: 0, z: 0, ease: "power2.inOut", duration: Math.random() * 2 + 1 }, i * 0.002);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 2000);
const baseCameraDistance = 400;
const heartWidth = 640;
const horizontalFit = 0.88;
camera.position.z = baseCameraDistance;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const geom = new THREE.BufferGeometry().setFromPoints(vertices);
const mat = new THREE.PointsMaterial({ color: 0xff3b7a, size: 3 });
const points = new THREE.Points(geom, mat);
scene.add(points);
let mobileLayout = innerWidth <= 600;

let hue = 0;
function animate() {
  requestAnimationFrame(animate);
  geom.setFromPoints(vertices);

  // Ganti warna hati secara halus melewati spektrum warna.
  hue = (hue + 0.002) % 1;
  mat.color.setHSL(hue, 0.85, 0.6);

  if (mobileLayout) {
    points.rotation.y = Math.sin(performance.now() * 0.0005) * 0.18;
  } else {
    points.rotation.y += 0.002;
  }
  renderer.render(scene, camera);
}

animate();
window.addEventListener("resize", () => {
  mobileLayout = innerWidth <= 600;
  camera.aspect = innerWidth / innerHeight;
  const horizontalView = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
  camera.position.z = Math.max(baseCameraDistance, heartWidth / (horizontalView * horizontalFit));
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

window.dispatchEvent(new Event("resize"));

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
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 400;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const geom = new THREE.BufferGeometry().setFromPoints(vertices);
const mat = new THREE.PointsMaterial({ color: 0xff3b7a, size: 3 });
const points = new THREE.Points(geom, mat);
scene.add(points);

let hue = 0;
function animate() {
  requestAnimationFrame(animate);
  geom.setFromPoints(vertices);

  // Ganti warna hati secara halus melewati spektrum warna.
  hue = (hue + 0.002) % 1;
  mat.color.setHSL(hue, 0.85, 0.6);

  points.rotation.y += 0.002;
  renderer.render(scene, camera);
}

animate();
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

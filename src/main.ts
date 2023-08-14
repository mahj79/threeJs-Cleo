import './style.css'
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new Three.TorusGeometry(10, 3, 16, 100);
const material = new Three.MeshStandardMaterial({color: 0xFF6347});
const torus = new Three.Mesh(geometry, material);

scene.add(torus);

const pointLight = new Three.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new Three.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new Three.PointLightHelper(pointLight);
const gridHelper = new Three.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new Three.SphereGeometry(0.25, 24, 24);
  const material = new Three.MeshStandardMaterial({color: 0xffffff});
  const star = new Three.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => Three.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new Three.TextureLoader().load('SPACE.jpg');
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

//Cleo Photo

const cleoTexture = new Three.TextureLoader().load('Cleo Grumpy.ico.jpg');

const cleo = new Three.Mesh(
  new Three.BoxGeometry(3, 3, 3),
  new Three.MeshBasicMaterial({ map: cleoTexture })
);

scene.add(cleo);

//Moon
const moonTexture = new Three.TextureLoader().load('moon.jpg');
const normalTexture = new Three.TextureLoader().load('normal.jpg');

const moon = new Three.Mesh(
  new Three.SphereGeometry(3, 32, 32),
  new Three.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
)

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  cleo.rotation.y += 0.01;
  cleo.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

animate();
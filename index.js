import {
    Scene,
    SphereGeometry,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Mesh,
    WebGLRenderer,
    PerspectiveCamera,
    PointLight,
    TextureLoader,
    BackSide,
    AmbientLight,
    CircleGeometry,
    LineBasicMaterial,
    Line,
    BufferGeometry,
    Vector3,
    AudioLoader,
    Audio,
    AudioListener,
} from "three";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

const gui = new GUI();

const canvas = document.getElementById("three-canvas");
const scene = new Scene();

// Variables

var guiVariables = {
    timescale: 50,
    debug: false,
    musicVolume: 0.5,
};

// Objects

// Skybox

const skyboxGeometry = new SphereGeometry(2000, 20, 10);
const skyboxMat = new MeshBasicMaterial({map: new TextureLoader().load("Assets/Textures/8k_stars.jpg"), side: BackSide});
const skybox = new Mesh(skyboxGeometry, skyboxMat);
scene.add(skybox);

const sunGeometry = new SphereGeometry(109, 48, 24);
const sunMat = new MeshBasicMaterial({map: new TextureLoader().load("Assets/Textures/8k_sun.jpg")});
const sun = new Mesh(sunGeometry, sunMat);
scene.add(sun);

const sunGlowMat1 = new MeshBasicMaterial({color: "#ffff00", transparent: true, opacity: 0.1, side: BackSide});
const sunGlow1 = new Mesh(sunGeometry, sunGlowMat1);
sunGlow1.scale.set(1.05, 1.05, 1.05);
sun.add(sunGlow1);

const sunGlowMat2 = new MeshBasicMaterial({color: "#ffff00", transparent: true, opacity: 0.05, side: BackSide});
const sunGlow2 = new Mesh(sunGeometry, sunGlowMat2);
sunGlow2.scale.set(1.1, 1.1, 1.1);
sun.add(sunGlow2);

const earthGeometry = new SphereGeometry(1, 48, 24);
const earthMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/8k_earth_daymap.jpg"), 
specularMap: new TextureLoader().load("Assets/Specular Maps/8k_earth_specular_map.jpg"),
normalMap: new TextureLoader().load("Assets/Normal Maps/8k_earth_normal_map.jpg"),
emissive: "#ffeeaa", emissiveMap: new TextureLoader().load("Assets/Textures/8k_earth_light_map.jpg"), emissiveIntensity: 0.3});
const earth = new Mesh(earthGeometry, earthMat);
earth.position.z = 500;
earth.rotation.x = 0.2;
scene.add(earth);

const earthCloudsMat = new MeshPhongMaterial({alphaMap: new TextureLoader().load("Assets/Textures/8k_earth_clouds.jpg"), transparent: true});
const earthClouds = new Mesh(earthGeometry, earthCloudsMat);
earthClouds.scale.set(1.01, 1.01, 1.01);
earth.add(earthClouds);

const earthAtmosphereMat1 = new MeshBasicMaterial({color: "#a8e2ff", transparent: true, opacity: 0.15, side: BackSide});
const earthAtmosphere1 = new Mesh(earthGeometry, earthAtmosphereMat1);
earthAtmosphere1.scale.set(1.03, 1.03, 1.03);
earth.add(earthAtmosphere1);

const earthAtmosphereMat2 = new MeshBasicMaterial({color: "#6bceff", transparent: true, opacity: 0.1, side: BackSide});
const earthAtmosphere2 = new Mesh(earthGeometry, earthAtmosphereMat2);
earthAtmosphere2.scale.set(1.08, 1.08, 1.08);
earth.add(earthAtmosphere2);

const earthAtmosphereMat3 = new MeshBasicMaterial({color: "#1fb4ff", transparent: true, opacity: 0.04, side: BackSide});
const earthAtmosphere3 = new Mesh(earthGeometry, earthAtmosphereMat3);
earthAtmosphere3.scale.set(1.12, 1.12, 1.12);
earth.add(earthAtmosphere3);

const moonGeometry = new SphereGeometry(0.25, 32, 16);
const moonMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/8k_moon.jpg")});
const moon = new Mesh(moonGeometry, moonMat);
moon.position.z = 30

const moonOrbit = new Mesh(new SphereGeometry(0, 0, 0), new MeshBasicMaterial());
earth.add(moonOrbit);
moonOrbit.add(moon);

// Lighting

const ambientLight = new AmbientLight("#ddddff", 0.003);
scene.add(ambientLight);

const sunLight = new PointLight("#ffffff", 1);
scene.add(sunLight);

// Camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
camera.position.z = earth.position.z - 3;
scene.add(camera);

// Renderer

const renderer = new WebGLRenderer({canvas});
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 1.5;
controls.maxDistance = 500;
controls.target = earth.position;

// Debug

const earthcircle = new Line(new CircleGeometry(1.002, 64), new LineBasicMaterial({ color: "#ff0000" }));
earthcircle.rotation.x = Math.PI/2;
earth.add(earthcircle);
const earthpoints1 = [];
earthpoints1.push( new Vector3(0, -3, 0 ) );
earthpoints1.push( new Vector3(0, 3, 0 ) );
const earthpoints2 = [];
earthpoints2.push( new Vector3(-2, 0, 0 ) );
earthpoints2.push( new Vector3(2, 0, 0 ) );
const earthline1 = new Line(new BufferGeometry().setFromPoints(earthpoints1), new LineBasicMaterial({color: "#00ff00"}));
earth.add(earthline1);
const earthline2 = new Line(new BufferGeometry().setFromPoints(earthpoints2), new LineBasicMaterial({color: "#0000ff"}));
earth.add(earthline2);
const mooncircle = new Line(new CircleGeometry(0.252, 64), new LineBasicMaterial({ color: "#ff0000" }));
mooncircle.rotation.x = Math.PI/2;
moon.add(mooncircle);
const moonpoints1 = [];
moonpoints1.push( new Vector3(0, -3, 0 ) );
moonpoints1.push( new Vector3(0, 3, 0 ) );
const moonpoints2 = [];
moonpoints2.push( new Vector3(-2, 0, 0 ) );
moonpoints2.push( new Vector3(2, 0, 0 ) );
const moonline1 = new Line(new BufferGeometry().setFromPoints(moonpoints1), new LineBasicMaterial({color: "#00ff00"}));
moon.add(moonline1);
const moonline2 = new Line(new BufferGeometry().setFromPoints(moonpoints2), new LineBasicMaterial({color: "#0000ff"}));
moon.add(moonline2);

// GUI
gui.add(moon.position, "z", 3, 30, 0.1).name("Moon Distance");
gui.add(skybox, "visible").name("Toggle Skybox");
gui.add(moon, "visible").name("Toggle Moon");
gui.add(sun, "visible").name("Toggle Sun");
gui.add(sunLight, "visible").name("Toggle Sunlight");
gui.add(guiVariables, "timescale", 0.00, 1000, 0.01).name("Timescale");
gui.add(guiVariables, "debug").name("Toggle Debug");
gui.add(guiVariables, "musicVolume", 0, 1, 0.01).name("Music Volume");

// Audio

const listener = new AudioListener();
camera.add(listener);

const music = new Audio(listener);

const audioLoader = new AudioLoader();
audioLoader.load("Assets/Music/Honeylune Ridge.mp3", function(buffer) {
	music.setBuffer(buffer);
	music.setLoop(true);
	music.setVolume(0.5);
	music.play();
});

// Animate

function animate() {
    controls.update();

    skybox.position.x = camera.position.x;
    skybox.position.y = camera.position.y;
    skybox.position.z = camera.position.z;

    skybox.rotateY(0.00027 / 2 * guiVariables.timescale / 50);
    sun.rotateY(0.00027 / 2 * guiVariables.timescale / 50);
    moonOrbit.rotateY(-0.0003 * guiVariables.timescale / 50);
    earth.rotateY(0.0006 * guiVariables.timescale / 50);
    earthClouds.rotateY(0.0002 * guiVariables.timescale / 50);

	music.setVolume(guiVariables.musicVolume);

    if(guiVariables.debug)
    {
        earthline1.visible = true;
        earthline2.visible = true;
        earthcircle.visible = true;
        
        moonline1.visible = true;
        moonline2.visible = true;
        mooncircle.visible = true;
    }
    else
    {
        earthline1.visible = false;
        earthline2.visible = false;
        earthcircle.visible = false;
        
        moonline1.visible = false;
        moonline2.visible = false;
        mooncircle.visible = false;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    PointLight,
    Mesh,
    SphereGeometry,
    RingGeometry,
    CircleGeometry,
    BufferGeometry,
    MeshBasicMaterial,
    MeshPhongMaterial,
    ShaderMaterial,
    RawShaderMaterial,
    LineBasicMaterial,
    TextureLoader,
    BackSide,
    DoubleSide,
    Line,
    Audio,
    AudioLoader,
    AudioListener,
    Clock,
    AdditiveBlending,
} from "three";

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

atmosphereInnerVertexShader = `

varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`

atmosphereInnerFragmentShader = `

uniform sampler2D globeTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.15, 0.3, 0.5) * pow(intensity, 1.5);

    gl_FragColor = vec4(atmosphere, 0.6);
}

`

atmosphereOuterVertexShader = `

varying vec3 vertexNormal;

void main() {
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.9);
}

`

atmosphereOuterFragmentShader = `

varying vec3 vertexNormal;

void main() {
    float intensity = pow(0.5 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}

`

glowOuterVertexShader = `

varying vec3 vertexNormal;

void main() {
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.9);
}

`

glowOuterFragmentShader = `

varying vec3 vertexNormal;

void main() {
    float intensity = pow(0.2 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(1.0, 0.8, 0.5, 1.0) * intensity;
}

`

const scene = new Scene();
const canvas = document.getElementById("three-canvas");

const gui = new GUI();

const clock = new Clock();

const backgroundMusic = new Audio(new AudioListener());
const audioLoader = new AudioLoader();

audioLoader.load("Assets/Music/music.wav", function(buffer) {
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true);
    backgroundMusic.play();
                                            backgroundMusic.pause();
});

// Variables.

const km = 0.0001;

const s = 1;
const h = 3600;

const sunRadius = 696340 * km;
const earthRadius = 6371 * km;

const earthDistance = 151750000 * km;

var simulationVariables = {
    timescale: 300,
    pause: false,
    useDeltaTime: false,
};

// Camera.

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 20000);
scene.add(camera);
camera.position.z = earthDistance / 10 + 2;

// Renderer.

const renderer = new WebGLRenderer({canvas, antialias: true});
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

window.addEventListener("resize", () => {
    camera.aspect(canvas.clientWidth / canvas.clientHeight);
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// Objects.

const textureLoader = new TextureLoader();

const skyboxGeom = new SphereGeometry(15000, 20, 10);
const skyboxMat = new MeshBasicMaterial({
    transparent: true,
    opacity: 0.3,
    map: textureLoader.load("Assets/Textures/8k_stars_milky_way.jpg"),
    side: BackSide
});
const skybox = new Mesh(skyboxGeom, skyboxMat);
scene.add(skybox);

skybox.renderOrder = -1;

const sunGeom = new SphereGeometry(sunRadius, 48, 24);
const sunMat = new MeshBasicMaterial({
    map: textureLoader.load("Assets/Textures/2k_sun.jpg")
});
const sun = new Mesh(sunGeom, sunMat);
scene.add(sun);

const sunGlowOuter = new Mesh(sunGeom, sunGlowOuterMat = new ShaderMaterial({
    vertexShader: glowOuterVertexShader,
    fragmentShader: glowOuterFragmentShader,
    blending: AdditiveBlending,
    side: BackSide,
    transparent: true
}));
sun.add(sunGlowOuter);
sunGlowOuter.scale.set(1.3, 1.3, 1.3);

const earthGeom = new SphereGeometry(earthRadius, 48, 24);
const earthMat = new MeshPhongMaterial({
    map: textureLoader.load("Assets/Textures/2k_earth_daymap.jpg"),
    specularMap: textureLoader.load("Assets/Specular Maps/2k_earth_specular_map.jpg"),
    normalMap: textureLoader.load("Assets/Normal Maps/2k_earth_normal_map.jpg"),
    emissiveMap: textureLoader.load("Assets/Textures/8k_earth_light_map.jpg"), 
    emissive: "#ffeeaa",
    emissiveIntensity: 1
});
const earth = new Mesh(earthGeom, earthMat);
scene.add(earth);
earth.position.z = earthDistance / 10; // Temporary

const earthCloudsMat = new MeshPhongMaterial({
    alphaMap: textureLoader.load("Assets/Textures/2k_earth_clouds.jpg"),
    transparent: true,
    opacity: 0.5
});
const earthClouds = new Mesh(earthGeom, earthCloudsMat);
earthClouds.scale.set(1.01, 1.01, 1.01);
earth.add(earthClouds);
earthClouds.renderOrder = 1;

const earthAtmosphereInner = new Mesh(earthGeom, earthAtmosphereInnerMat = new ShaderMaterial({
    vertexShader: atmosphereInnerVertexShader,
    fragmentShader: atmosphereInnerFragmentShader,
    transparent: true
}));
earth.add(earthAtmosphereInner);
earthAtmosphereInner.scale.set(1.004, 1.004, 1.004);

const earthAtmosphereOuter = new Mesh(earthGeom, earthAtmosphereOuterMat = new ShaderMaterial({
    vertexShader: atmosphereOuterVertexShader,
    fragmentShader: atmosphereOuterFragmentShader,
    blending: AdditiveBlending,
    side: BackSide,
    transparent: true
}));
earth.add(earthAtmosphereOuter);
earthAtmosphereOuter.scale.set(0.97, 0.97, 0.97);

// Lighting.

const ambientLight = new AmbientLight("#ddddff", 0.003);
scene.add(ambientLight);

const sunLight = new PointLight("#ffffff", 1);
scene.add(sunLight);

// Controls.

const controls = new OrbitControls(camera, canvas);

controls.target = earth.position;
controls.minDistance = 1;
controls.maxDistance = 1000;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// GUI.

const timeFolder = gui.addFolder('Time');
timeFolder.add(simulationVariables, "timescale", 1, 10000, 0.01).name("Timescale (min/s)");
timeFolder.add(simulationVariables, "pause").name("Pause");
timeFolder.add(simulationVariables, "useDeltaTime").name("Accurate Time (may cause jittering)");

// Game loop.

const realMinutes = new Date().getMinutes();
const realHours = new Date().getHours();
gameTime = 0;

function animate() {
    delta = clock.getDelta();

    if(simulationVariables.useDeltaTime)
    {
        timescale = ((simulationVariables.timescale * (km / s) * 52.5) * 60) * delta * 144;
    }
    else
    {
        timescale = ((simulationVariables.timescale * (km / s) * 52.5) * 60);
    }

    if(simulationVariables.pause)
    {
        timescale = 0;
    }

    updateClock();

    earthClouds.rotateY(0.00001 * timescale);

    controls.update();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Misc.

function updateClock() {
    gameTime += timescale * 1371; //72000 / 52.5;
    let clockDiv = document.getElementById("worldClock");
    let dateDiv = document.getElementById("worldDate");

    function dateFromDay(year, day){
        var date = new Date(year, 0);
        return new Date(date.setDate(day)).toString();
      }

    let timerId = setInterval(function() {
        var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var realDay = Math.floor(diff / oneDay);
        let min = Math.floor(gameTime / 60000 + realMinutes) % 60;
        let hour = Math.floor(gameTime / 3600000 + realHours) % 24;
        let day = Math.floor(gameTime / (3600000 * 24) + realDay) % 365;
        let year = Math.floor(gameTime / (3600000 * 24 * 365) + new Date().getFullYear()) % 10000;
        clockDiv.textContent = `${hour}:${min}`.replace(/\b\d\b/g, "0$&");
        dateDiv.textContent = `${dateFromDay(year, day).slice(0, 16)}`.replace(/\b\d\b/g, "$&");
    }, 50);
}
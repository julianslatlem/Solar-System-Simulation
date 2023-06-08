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
    Sphere,
    Clock,
    FrontSide,
    RingGeometry,
    DoubleSide,
    RingBufferGeometry,
} from "three";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

listener = new AudioListener();

music = new Audio(listener);

audioLoader = new AudioLoader();

audioLoader.load("Assets/Music/music.wav", function(buffer) {
    music.setBuffer(buffer);
    music.setLoop(true);
    music.play();
});

var gui = new GUI();

const canvas = document.getElementById("three-canvas");
const scene = new Scene();

// Variables

const km = 0.0001;

const sec = 1;
const min = sec * 60;
const h = min * 60;

minutes = 0;
hours = minutes / 60;

var guiVariables = {
    timescale: 300,
    debug: false,
    musicVolume: 0,
    rotateCameraWithEarth: false,
    earthOrbitSpeed: 29.78,
    jupiterOrbitSpeed: 13,
    earthSize: 6371,
    mercurySize: 2439,
    sunSize: 696340,
    jupiterSize: 69911,
    marsSize: 3389.5,
    moonSize: 1737.4,
    earthRotationSpeed: 1670,
    planetDistanceDivider: 10,
    earthDistance: 151750000,
    marsDistance: 250700000,
    mercuryDistance: 58545000,
    mercuryOrbitSpeed: 47,
    marsOrbitSpeed: 24.08,
    moonDistance: 384400,
    moonOrbitSpeed: 3683,
    jupiterDistance: 741380000,
    useHighResTextures: false,
    resolutionScale: 100,
    useDeltaTime: false,
    lockToEarth: false,
    saturnSize: 58232,
    saturnDistance: 1463600000,
    saturnOrbitSpeed: 9.67,
    planetScalePercent: 100,
    pause: false,
};

// Objects

const solarSystemCenter = new Vector3(0, 0, -guiVariables.earthDistance * km);

const skyboxGeometry = new SphereGeometry(15000, 20, 10);
const skyboxMat = new MeshBasicMaterial({opacity: 0.3, transparent: true, map: new TextureLoader().load("Assets/Textures/8k_stars_milky_way.jpg"), side: BackSide});
const skybox = new Mesh(skyboxGeometry, skyboxMat);
scene.add(skybox);
skybox.renderOrder = -1;

const sunGeometry = new SphereGeometry(guiVariables.sunSize * km, 48, 24);
const sunMat = new MeshBasicMaterial({map: new TextureLoader().load("Assets/Textures/2k_sun.jpg")});
const sun = new Mesh(sunGeometry, sunMat);
scene.add(sun);

const sunGlowMat1 = new MeshBasicMaterial({color: "#ffbb00", transparent: true, opacity: 0.1});
const sunGlow1 = new Mesh(sunGeometry, sunGlowMat1);
sunGlow1.scale.set(1.05, 1.05, 1.05);
sun.add(sunGlow1);

const sunGlowMat2 = new MeshBasicMaterial({color: "#ffcc00", transparent: true, opacity: 0.08});
const sunGlow2 = new Mesh(sunGeometry, sunGlowMat2);
sunGlow2.scale.set(1.13, 1.13, 1.13);
sun.add(sunGlow2);

const sunGlowMat3 = new MeshBasicMaterial({color: "#ffcc00", transparent: true, opacity: 0.05});
const sunGlow3 = new Mesh(sunGeometry, sunGlowMat3);
sunGlow3.scale.set(1.18, 1.18, 1.18);
sun.add(sunGlow3);

const sunGlowMat4 = new MeshBasicMaterial({color: "#ffcc00", transparent: true, opacity: 0.04});
const sunGlow4 = new Mesh(sunGeometry, sunGlowMat4);
sunGlow4.scale.set(1.2, 1.2, 1.2);
sun.add(sunGlow4);

const earthRot2 = new Mesh(new SphereGeometry(0, 0, 0), new MeshBasicMaterial());
scene.add(earthRot2);

const earthGeometry = new SphereGeometry(guiVariables.earthSize * km, 48, 24);
const earthMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/2k_earth_daymap.jpg"), 
specularMap: new TextureLoader().load("Assets/Specular Maps/2k_earth_specular_map.jpg"),
normalMap: new TextureLoader().load("Assets/Normal Maps/2k_earth_normal_map.jpg"),
emissive: "#ffeeaa", emissiveMap: new TextureLoader().load("Assets/Textures/8k_earth_light_map.jpg"), emissiveIntensity: 0.3});
const earth = new Mesh(earthGeometry, earthMat);
earth.rotation.x = 0.41;
earthRot2.add(earth);

const earthCloudsMat = new MeshPhongMaterial({alphaMap: new TextureLoader().load("Assets/Textures/2k_earth_clouds.jpg"), transparent: true});
const earthClouds = new Mesh(earthGeometry, earthCloudsMat);
earthClouds.scale.set(1.01, 1.01, 1.01);
earth.add(earthClouds);
earthClouds.renderOrder = 1;

const earthAtmosphereMat1 = new MeshBasicMaterial({color: "#a8e2ff", transparent: true, opacity: 0.15, side: BackSide});
const earthAtmosphere1 = new Mesh(earthGeometry, earthAtmosphereMat1);
earthAtmosphere1.scale.set(1.02, 1.02, 1.02);
earth.add(earthAtmosphere1);

const earthAtmosphereMat2 = new MeshBasicMaterial({color: "#6bceff", transparent: true, opacity: 0.1, side: BackSide});
const earthAtmosphere2 = new Mesh(earthGeometry, earthAtmosphereMat2);
earthAtmosphere2.scale.set(1.04, 1.04, 1.04);
earth.add(earthAtmosphere2);

const earthAtmosphereMat3 = new MeshBasicMaterial({color: "#1fb4ff", transparent: true, opacity: 0.04, side: BackSide});
const earthAtmosphere3 = new Mesh(earthGeometry, earthAtmosphereMat3);
earthAtmosphere3.scale.set(1.07, 1.07, 1.07);
earth.add(earthAtmosphere3);

const moonGeometry = new SphereGeometry(guiVariables.moonSize * km, 32, 16);
const moonMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/2k_moon.jpg")});
const moon = new Mesh(moonGeometry, moonMat);

const moonOrbit = new Mesh(new SphereGeometry(0, 0, 0), new MeshBasicMaterial());
scene.add(moonOrbit);
moonOrbit.add(moon);

const jupiterGeometry = new SphereGeometry(guiVariables.jupiterSize * km, 32, 16);
const jupiterMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/2k_jupiter.jpg")})
const jupiter = new Mesh(jupiterGeometry, jupiterMat);
const jupiterOrbit = new Mesh(new SphereGeometry(0, 0, 0), new MeshBasicMaterial());
scene.add(jupiterOrbit);
jupiterOrbit.position.z = solarSystemCenter.z;
jupiterOrbit.add(jupiter);

const marsGeometry = new SphereGeometry(guiVariables.marsSize * km, 32, 16);
const marsMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/2k_mars.jpg")})
const mars = new Mesh(marsGeometry, marsMat);
const marsOrbit = new Mesh(new SphereGeometry(0, 0, 0), new MeshBasicMaterial());
scene.add(marsOrbit);
marsOrbit.position.z = solarSystemCenter.z;
marsOrbit.add(mars);

const mercuryGeometry = new SphereGeometry(guiVariables.mercurySize * km, 32, 16);
const mercuryMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/2k_mercury.jpg")})
const mercury = new Mesh(mercuryGeometry, mercuryMat);
const mercuryOrbit = new Mesh(new SphereGeometry(0, 0, 0), new MeshBasicMaterial());
scene.add(mercuryOrbit);
mercuryOrbit.position.z = solarSystemCenter.z;
mercuryOrbit.add(mercury);

const saturnGeometry = new SphereGeometry(guiVariables.saturnSize * km, 32, 16);
const saturnMat = new MeshPhongMaterial({map: new TextureLoader().load("Assets/Textures/2k_saturn.jpg")})
const saturn = new Mesh(saturnGeometry, saturnMat);
const saturnOrbit = new Mesh(new SphereGeometry(0, 0, 0), new MeshBasicMaterial());
scene.add(saturnOrbit);
saturnOrbit.position.z = solarSystemCenter.z;
saturnOrbit.add(saturn);

const saturnRingGeometry = new RingGeometry(3, 5, 64);
var pos = saturnRingGeometry.attributes.position;
var v3 = new Vector3();
for (let i = 0; i < pos.count; i++){
  v3.fromBufferAttribute(pos, i);
  saturnRingGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
}
const saturnRingMaterial = new MeshBasicMaterial({
  map: new TextureLoader().load("Assets/Textures/2k_saturn_ring_alpha.png"),
  color: "#ffffff",
  side: DoubleSide,
  transparent: true,
  opacity: 0.5,
});
const saturnRing = new Mesh(saturnRingGeometry, saturnRingMaterial);
saturn.add(saturnRing);
saturnRing.scale.set(3,3,3);
saturnRing.rotateX(1.3);

// Lighting

const ambientLight = new AmbientLight("#ddddff", 0.003);
scene.add(ambientLight);

const sunLight = new PointLight("#ffffff", 1);
scene.add(sunLight);

// Camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 20000);
camera.position.z = -10000 * km;
camera.position.x = -20000 * km;
scene.add(camera);

camera.add(listener);

// Renderer

const renderer = new WebGLRenderer({canvas, antialias: true});
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// Controls

const controls = new OrbitControls(camera, canvas);
controls.target = earth.position;
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minDistance = 0;
controls.maxDistance = 1000;
controls.autoRotate = true;
controls.enablePan = false;

// Debug

const earthcircle = new Line(new CircleGeometry((guiVariables.earthSize * km) + 0.001, 64), new LineBasicMaterial({ color: "#ff0000" }));
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

const mooncircle = new Line(new CircleGeometry((guiVariables.moonSize * km) + 0.001, 64), new LineBasicMaterial({ color: "#ff0000" }));
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

const timescaleFolder = gui.addFolder('Timescale');
timescaleFolder.add(guiVariables, "timescale", 1, 10000, 0.01).name("Timescale (min/s)");
timescaleFolder.add(guiVariables, "pause").name("Pause");

const toggleFolder = gui.addFolder("Toggles");
toggleFolder.add(skybox, "visible").name("Skybox");
toggleFolder.add(moon, "visible").name("Moon");
toggleFolder.add(sun, "visible").name("Sun");
toggleFolder.add(sunLight, "visible").name("Sunlight");
toggleFolder.add(guiVariables, "useHighResTextures").name("High Resolution Textures");
toggleFolder.add(guiVariables, "useDeltaTime").name("Accurate Time (may cause jittering)");

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(guiVariables, "rotateCameraWithEarth").name("Lock Camera to Orbit");
cameraFolder.add(guiVariables, "lockToEarth").name("Lock Camera to Earth");

const earthAndMoonFolder = gui.addFolder("Earth and Moon");
earthAndMoonFolder.add(guiVariables, "earthOrbitSpeed", 0, 100, 0.001).name("Earth Orbit Speed (km/s)");
earthAndMoonFolder.add(guiVariables, "moonDistance", 10000, 384400, 1).name("Moon Distance (km)");

const miscFolder = gui.addFolder('Misc');
miscFolder.add(guiVariables, "musicVolume", 0, 100, 0.1).name("Music Volume (%)");
miscFolder.add(guiVariables, "planetDistanceDivider", 0.5, 100, 0.01).name("Planetary Distances (%)");
miscFolder.add(guiVariables, "planetScalePercent", 100, 1000, 0.1).name("Planet Scales (%)");
miscFolder.add(guiVariables, "resolutionScale", 1, 200, 0.1).name("Resolution Scale (%)");


const debugFolder = gui.addFolder('Debug');
debugFolder.add(guiVariables, "debug").name("Toggle Debug");

// Animate

var i = true;
gameTime = 0;

const clock = new Clock();

realMinutes = new Date().getMinutes();

realHours = new Date().getHours();

function animate() {
    const delta = clock.getDelta();

    if(guiVariables.useDeltaTime)
    {
        timescale = ((guiVariables.timescale * (km / sec) * 52.5) * 60) * delta * 144;
    }
    else
    {
        timescale = ((guiVariables.timescale * (km / sec) * 52.5) * 60);
    }

    if(guiVariables.pause)
    {
        timescale = 0;
    }

    renderer.setSize(canvas.clientWidth * (guiVariables.resolutionScale / 100), canvas.clientHeight * (guiVariables.resolutionScale / 100), false);

    // Clock
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

    const earthDistance = guiVariables.earthDistance * (guiVariables.planetDistanceDivider / 100) * km;
    const moonDistance = guiVariables.moonDistance * (guiVariables.planetDistanceDivider / 100) * km;
    const marsDistance = guiVariables.marsDistance * (guiVariables.planetDistanceDivider / 100) * km;
    const jupiterDistance = guiVariables.jupiterDistance * (guiVariables.planetDistanceDivider / 100) * km;
    const mercuryDistance = guiVariables.mercuryDistance * (guiVariables.planetDistanceDivider / 100) * km;
    const saturnDistance = guiVariables.saturnDistance * (guiVariables.planetDistanceDivider / 100) * km;

    const sunRotationSpeed = 1.997 * (km / sec) / Math.sqrt(Math.pow(guiVariables.sunSize / (10000 * Math.PI), 3));

    const earthOrbitSpeed = (guiVariables.earthOrbitSpeed * (km / sec)) / Math.sqrt(Math.pow(guiVariables.earthDistance / (100000 * Math.PI), 3));
    const moonOrbitSpeed = (guiVariables.moonOrbitSpeed * (km / h)) / Math.sqrt(Math.pow(9.5, 3));
    const marsOrbitSpeed = (guiVariables.marsOrbitSpeed * (km / sec)) / Math.sqrt(Math.pow(guiVariables.marsDistance / (100000 * Math.PI), 3)) - earthOrbitSpeed;;
    const jupiterOrbitSpeed = (guiVariables.jupiterOrbitSpeed * (km / sec)) / Math.sqrt(Math.pow(guiVariables.jupiterDistance / (100000 * Math.PI), 3)) - earthOrbitSpeed;;
    const mercuryOrbitSpeed = (guiVariables.mercuryOrbitSpeed * (km / sec)) / Math.sqrt(Math.pow(guiVariables.mercuryDistance / (100000 * Math.PI), 3)) - earthOrbitSpeed;;
    const saturnOrbitSpeed = (guiVariables.saturnOrbitSpeed * (km / sec)) / Math.sqrt(Math.pow(guiVariables.saturnDistance / (100000 * Math.PI), 3)) - earthOrbitSpeed;;
    
    controls.minDistance = earth.scale.x * 1.5;
    controls.update();

    if(guiVariables.rotateCameraWithEarth)
    {
        controls.autoRotate = false;
    }
    else
    {
        controls.autoRotateSpeed = (guiVariables.earthOrbitSpeed * (km / sec) * 572.95) / Math.sqrt(Math.pow(guiVariables.earthDistance / (100000 * Math.PI), 3)) * timescale;
        controls.autoRotate = true;
    }

    if(guiVariables.lockToEarth)
    {
        controls.autoRotate = true;
        controls.autoRotateSpeed = -(guiVariables.earthRotationSpeed * (km / sec) * 572.95) / Math.sqrt(Math.pow(guiVariables.earthDistance / (340000 * Math.PI), 3)) * timescale;
    }

    if(guiVariables.useHighResTextures && i)
    {
        i = false;
        if(!i)
        {
            sunMat.map = new TextureLoader().load("Assets/Textures/8k_sun.jpg");

            earthMat.map = new TextureLoader().load("Assets/Textures/8k_earth_daymap.jpg");
            earthMat.specularMap = new TextureLoader().load("Assets/Specular Maps/8k_earth_specular_map.jpg");
            earthMat.normalMap = new TextureLoader().load("Assets/Normal Maps/8k_earth_normal_map.jpg");
            earthCloudsMat.alphaMap = new TextureLoader().load("Assets/Textures/2k_earth_clouds.jpg")
            
            moonMat.map = new TextureLoader().load("Assets/Textures/8k_moon.jpg");
        }
    }

    if(!guiVariables.useHighResTextures && !i)
    {
        i = true;
        if(i)
        {
            sunMat.map = new TextureLoader().load("Assets/Textures/2k_sun.jpg");

            earthMat.map = new TextureLoader().load("Assets/Textures/2k_earth_daymap.jpg");
            earthMat.specularMap = new TextureLoader().load("Assets/Specular Maps/2k_earth_specular_map.jpg");
            earthMat.normalMap = new TextureLoader().load("Assets/Normal Maps/2k_earth_normal_map.jpg");
            earthCloudsMat.alphaMap = new TextureLoader().load("Assets/Textures/2k_earth_clouds.jpg")

            moonMat.map = new TextureLoader().load("Assets/Textures/2k_moon.jpg");
        }
    }

    moon.position.z = guiVariables.moonDistance * km;

    sun.position.z = -earthDistance;

    sunLight.position.z = sun.position.z;
    jupiterOrbit.position.z = sun.position.z;
    marsOrbit.position.z = sun.position.z;
    mercuryOrbit.position.z = sun.position.z;
    saturnOrbit.position.z = sun.position.z;

    earth.scale.set(guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100);
    moon.scale.set(guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100);
    mercury.scale.set(guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100);
    mars.scale.set(guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100);
    jupiter.scale.set(guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100);
    saturn.scale.set(guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100, guiVariables.planetScalePercent / 100);

    skybox.position.x = camera.position.x;
    skybox.position.y = camera.position.y;
    skybox.position.z = camera.position.z;

    jupiter.position.z = jupiterDistance;
    mercury.position.z = mercuryDistance;
    mars.position.z = marsDistance;
    saturn.position.z = saturnDistance;

    skybox.rotateY(-earthOrbitSpeed * timescale);
    sun.rotateY((-earthOrbitSpeed + sunRotationSpeed) * timescale);
    moonOrbit.rotateY(moonOrbitSpeed * timescale);
    marsOrbit.rotateY(marsOrbitSpeed * timescale);
    mercuryOrbit.rotateY(mercuryOrbitSpeed * timescale);
    saturnOrbit.rotateY(saturnOrbitSpeed * timescale);
    earthRot2.rotateY(0.00000027 * timescale);
    jupiterOrbit.rotateY(jupiterOrbitSpeed * timescale);
    earth.rotateY((guiVariables.earthRotationSpeed * (km / sec)) / Math.sqrt(Math.pow(guiVariables.earthDistance / (340000 * Math.PI), 3)) * timescale);
    earthClouds.rotateY(((120000 * (km / sec)) * timescale) / Math.sqrt(Math.pow(guiVariables.earthSize, 3)));

    // Audio
    
	music.setVolume(guiVariables.musicVolume / 100);

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
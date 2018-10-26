var camera, scene, renderer, mixer;
var horse, horseAnimation;

var cars = [];
var carsColaiders = [];
var logs = [];
var logsColaiders = [];
var trees = [];
var treesColaiders = [];
var horseColaider;

var MAP_TYPES = {GRASS:0,STREET:11,WATER:2};
function createScene(canvas){
  console.log("createScene");
  renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
  // Set the viewport size
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Turn on shadows
  renderer.shadowMap.enabled = true;
  // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 0;
  camera.position.y = 150;
  camera.rotation.x= -Math.PI/3;

  // camera.position.z = 0;
  // camera.position.x = 350;
  // camera.position.y = 50;
  // camera.position.z = 0;
  // camera.rotation.x= -Math.PI/4;
  // camera.rotation.z= Math.PI/2;
  // camera.rotation.y= Math.PI/2;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x009bd5 );
  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  mixer = new THREE.AnimationMixer( scene );

  // loadMap();
  loadMapPart(0);
  loadMapPart(1);
  loadMapPart(2);
  loadMapPart(3);
  loadMapPart(4);
  loadMapPart(5);
  loadHorse();

  initEventListeners();
  initAnimations();
}

var mapType = MAP_TYPES.STREET;
var mapSectionWidth = 60;
var planeGrassGeometry = new THREE.BoxGeometry( 400, 2, mapSectionWidth );
var planeStreetGeometry = new THREE.BoxGeometry( 400, 1, mapSectionWidth );

function loadMapPart(index){
  let mapGroup = new THREE.Object3D;
  let color;
  let plane = mapType != MAP_TYPES.GRASS?planeStreetGeometry:planeGrassGeometry;
  let mesh;

  if(mapType == MAP_TYPES.GRASS){
    let random = Math.random();
    mapType = random<0.5?MAP_TYPES.STREET:MAP_TYPES.WATER;
    color =  mapType==MAP_TYPES.STREET?0xffffff:0x5dfdff;
  }else{
    mapType = MAP_TYPES.GRASS
    color = 0x2bd845;
  }
  mesh = new THREE.Mesh(plane,new THREE.MeshPhongMaterial({color:color, side:THREE.DoubleSide}));
  // TODO Algoritmo de avance
  // Generar un mapa de acuerdo al índice
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.name = 'p1';
  mapGroup.add(mesh);
  mapGroup.position.y = (mapType==MAP_TYPES.STREET||mapType==MAP_TYPES.STREET)?0:1;
  mapGroup.position.z = index*-mapSectionWidth;
  if(mapType == MAP_TYPES.GRASS)
    loadTrees(mapGroup);
  if(mapType == MAP_TYPES.STREET)
    loadCars(mapGroup);
    if(mapType == MAP_TYPES.WATER)
    loadLogs(mapGroup);
  scene.add(mapGroup);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var treeBoxGeometry = new THREE.BoxGeometry( 20, 100, 20 );
var treeMesh = new THREE.Mesh(treeBoxGeometry,new THREE.MeshPhongMaterial({color:0x894800}));
var treeOutlineMesh = new THREE.Mesh(treeBoxGeometry,new THREE.MeshPhongMaterial({ wireframe : true}));
function loadTrees(mapGroup){
  for(let i = 0; i<4; i++){
    let tempTreeMesh = treeMesh.clone();
    let tempTreeOutlineMesh = treeOutlineMesh.clone();
    let zPosition = getRandomInt(-20,20);
    let xPosition = getRandomInt(-200,200);
    tempTreeMesh.position.z = zPosition;
    tempTreeMesh.position.y = 20;
    tempTreeMesh.position.x = xPosition;

    let treeBBox = new THREE.BoxHelper(tempTreeMesh, 0x00ff00);
    treeBBox.update();
    treeBBox.visible = false;
    treesColaiders.push(treeBBox);

    trees.push(tempTreeMesh)
    tempTreeMesh.add(tempTreeOutlineMesh)
    mapGroup.add(tempTreeMesh);
  }
}

var carBoxGeometry = new THREE.BoxGeometry( 40, 20, 20 );
var carMesh = new THREE.Mesh(carBoxGeometry,new THREE.MeshPhongMaterial({color:0xff0000}));
var carOutlineMesh = new THREE.Mesh(carBoxGeometry,new THREE.MeshPhongMaterial({ wireframe : true}));
function loadCars(mapGroup){
  for(let i = 0; i<4; i++){
    let tempCarMesh = carMesh.clone();
    let tempCarOutlineMesh = carOutlineMesh.clone();
    let zPosition = getRandomInt(0,10)>5?15:-10;
    let xPosition = getRandomInt(-300,300);
    tempCarMesh.position.z = zPosition;
    tempCarMesh.position.y = 12;
    tempCarMesh.position.x = xPosition;
    let carBBox = new THREE.BoxHelper(tempCarMesh, 0x00ff00);
    carBBox.update();
    carBBox.visible = false;
    carsColaiders.push(carBBox);
    cars.push(tempCarMesh);

    tempCarMesh.add(tempCarOutlineMesh);
    mapGroup.add(tempCarMesh);
  }
}

var logBoxGeometry = new THREE.BoxGeometry( 50, 2, 25 );
var logMesh = new THREE.Mesh(logBoxGeometry,new THREE.MeshPhongMaterial({color:0x894800}));
var logOutlineMesh = new THREE.Mesh(logBoxGeometry,new THREE.MeshPhongMaterial({ wireframe : true}));
function loadLogs(mapGroup){
  for(let i = 0; i<4; i++){
    let tempLogMesh = logMesh.clone();
    let tempLogOutlineMesh = logOutlineMesh.clone();
    let zPosition = getRandomInt(0,10)>5?15:-12;
    let xPosition = getRandomInt(-300,300);
    tempLogMesh.position.z = zPosition;
    tempLogMesh.position.y = 1;
    tempLogMesh.position.x = xPosition;

    let logBBox = new THREE.BoxHelper(tempLogMesh, 0x00ff00);
    logBBox.update();
    logBBox.visible = false;
    logsColaiders.push(logBBox);
    logs.push(tempLogMesh);

    tempLogMesh.add(tempLogOutlineMesh);
    mapGroup.add(tempLogMesh);
  }
}

function loadHorse(){
  // console.log("loadHorse");
  var loader = new THREE.GLTFLoader();
  loader.load( "../models/Horse.glb", ( gltf )=>{
    var horseMesh = gltf.scene.children[ 0 ];
    horse = new THREE.Object3D;
    horse.add( horseMesh );
    // console.log("horse",horse); //Mesh
    horse.scale.set( 0.1, 0.1, 0.1 );
    horse.rotation.y = Math.PI;
    // horse.position.z =30;
    horse.position.z =-10;

    horse.castShadow = true;
    horse.receiveShadow = true;

    let horseBBox = new THREE.BoxHelper(horse, 0x00ff00);
    horseBBox.update();
    horseBBox.visible = false;
    horseColaider = horseBBox;

    scene.add( horse );
    horseAnimation = mixer.clipAction( gltf.animations[ 0 ], horse).setDuration( 1 );
    // console.log(gltf.animations);
    animator.interps[0].target = horse.position;
    rotateAnimator.interps[0].target = horse.rotation;
  });
}

function initEventListeners(){
  document.addEventListener('keyup', onDocumentKeyUp);
}

function run(){
  requestAnimationFrame( run );
  KF.update();
  renderer.render( scene, camera );
  // if(isPlaying)
  animate();
}

function onDocumentKeyUp(event){
  // console.log("onDocumentKeyUp",event);
  playHorseAnimation(event.keyCode);
}

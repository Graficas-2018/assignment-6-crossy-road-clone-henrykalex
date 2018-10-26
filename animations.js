var animator, rotateAnimator;
var currentTime = Date.now();
var isPlaying = false;

function initAnimations(){
  animator = new KF.KeyFrameAnimator;
  animator.init({
    interps:[
      {
        keys:[0, 1],
        values:[
          { z : 0 },
          { z : -10  },
        ],
      },
    ],
    loop: false,
    duration: 0.5 * 1000,
  });
  rotateAnimator = new KF.KeyFrameAnimator;
  rotateAnimator.init({
    interps:[
      {
        keys:[0, 1],
        values:[
          { y : Math.PI },
          { y : (Math.PI/2)*3  },
        ],
      },
    ],
    loop: false,
    duration: 0.5 * 1000,
  });
}

function animate(){
  // console.log("animate");
  let now = Date.now();
  let deltat = now - currentTime;
  currentTime = now;
  if ( mixer ) {
    mixer.update( ( deltat ) * 0.0015 );
  }
  animateCars(deltat);
  animateLogs(deltat);
  checkColisions();
}

function checkColisions(){
  horseColaider.update();
  var horseBox = new THREE.Box3().setFromObject(horseColaider);
  checkModelColiders(horseBox, carsColaiders);
  checkModelColiders(horseBox, treesColaiders);
}
function checkModelColiders(horseBox, colaidersList){
  return new Promise((resolve,reject)=>{
    // console.log("checkCarColiders, promise");
    for(let modColider of colaidersList){
      modColider.update();
      if(horseBox.intersectsBox(new THREE.Box3().setFromObject(modColider)))
      horseColision();
    }
    resolve();
  });
}


function horseColision(){
  console.log("horseColision");
  horse.position.z+=20;
}

function animateCars(deltat){
  for(let car of cars){
    // if(!tempo)
    // console.log("horse",horse);
    car.position.x +=  deltat * ((Math.floor(Math.random() * (4 - 3 + 1)) + 3)/100);
    if(car.position.x > 170){
      // console.log("horse",horse);
      car.position.x = -170 - Math.random() * 50;
      // car.children[0].rotation.x = 0;
      // car.children[0].position.y = 0;
    }
  }
}

function animateLogs(deltat){
  for(let log of logs){
    // if(!tempo)
    // console.log("horse",horse);
    log.position.x +=  deltat * ((Math.floor(Math.random() * (4 - 3 + 1)) + 3)/100);
    if(log.position.x > 170){
      // console.log("horse",horse);
      log.position.x = -170 - Math.random() * 50;
      // car.children[0].rotation.x = 0;
      // car.children[0].position.y = 0;
    }
  }
}

var ROTATE_STATUS = {
  LEFT: 1,
  FRONT: 2,
  RIGHT: 3,
  DOWN: 4
}
var horseStatus = ROTATE_STATUS.FRONT;
function playHorseAnimation(keyCode){
  if(isPlaying)
  return;
  isPlaying = true;
  if([37,38,39,40].includes(keyCode)){
    horseAnimation.play();
    setTimeout(()=>{
      horseAnimation.stop();
      isPlaying = false;
    },0.6*1000);
  }
  // console.log("playHorseAnimation",keyCode);
  let horseRotationStart = horse.rotation.y;
  // console.log("horseRotationStart",horseRotationStart);
  switch (keyCode) {
    case 37: // LEFT
      horseStatus = horseStatus-1;
      horseStatus = horseStatus<1?4:horseStatus;
      // console.log("horseRotationEnd",horseRotationStart+(Math.PI/2));
      rotateAnimator.interps[0].values[0].y = horseRotationStart;
      rotateAnimator.interps[0].values[1].y = horseRotationStart+(Math.PI/2);
      rotateAnimator.start();
      break;
    case 38: // UP
      if(horseStatus==ROTATE_STATUS.RIGHT){
        // console.log("1",(horseRotationStart % Math.PI/2));
        animator.interps[0].values[0].z = horse.position.z;
        animator.interps[0].values[1].z = horse.position.z;
        animator.interps[0].values[0].x = horse.position.x;
        animator.interps[0].values[1].x = horse.position.x+20;
      }
      if(horseStatus==ROTATE_STATUS.FRONT){
        // console.log("2",(horseRotationStart % Math.PI));
        animator.interps[0].values[0].z = horse.position.z;
        animator.interps[0].values[1].z = horse.position.z-20;
        animator.interps[0].values[0].x = horse.position.x;
        animator.interps[0].values[1].x = horse.position.x;
      }
      if(horseStatus==ROTATE_STATUS.LEFT){
        // console.log("3",(horseRotationStart % (Math.PI/2)*3));
        animator.interps[0].values[0].z = horse.position.z;
        animator.interps[0].values[1].z = horse.position.z;
        animator.interps[0].values[0].x = horse.position.x;
        animator.interps[0].values[1].x = horse.position.x-20;
      }
      if(horseStatus==ROTATE_STATUS.DOWN){
        // console.log("4",(horseRotationStart % Math.PI*2));
        animator.interps[0].values[0].z = horse.position.z;
        animator.interps[0].values[1].z = horse.position.z+20;
        animator.interps[0].values[0].x = horse.position.x;
        animator.interps[0].values[1].x = horse.position.x;
      }

      animator.start();
      break;
    case 39: // RIGHT
      horseStatus = horseStatus+1;
      horseStatus = horseStatus>4?1:horseStatus;
      // console.log("horseRotationEnd",horseRotationStart-(Math.PI/2));
      rotateAnimator.interps[0].values[0].y = horseRotationStart;
      rotateAnimator.interps[0].values[1].y = horseRotationStart-(Math.PI/2);
      rotateAnimator.start();
      break;
    // case 40: // DOWN
    //   animator.interps[0].values[0].z = horse.position.z;
    //   animator.interps[0].values[1].z = horse.position.z-20;
    //   animator.start();
    //   break;
    default:

  }
  // console.log("horse",horse.position);
  // console.log("animator.interps",animator.interps);
  // console.log("rotateAnimator.interps",rotateAnimator.interps);
}

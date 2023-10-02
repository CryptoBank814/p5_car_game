let track = [];
let grassImage;
let trackImage;
let finishImage;
let carImage1;
let carImage2;
let start_x1 = 0;
let start_x2 = 0;
let start_y = 0;
let grassGrp;
let trackGrp;

const spriteSize = 40;

function preload() {
  trackFile = loadStrings('http://95.217.51.146:5000/track.txt')
  grassImage = loadImage('http://95.217.51.146:5000/grass.png'); // 0 = grass
  trackImage = loadImage('http://95.217.51.146:5000/track.png'); // 1 = track
  finishImage = loadImage('http://95.217.51.146:5000/finish.png'); // 2 = start/finish line
  carImage1 = loadImage('http://95.217.51.146:5000/car.png'); // Player 1
  carImage2 = loadImage('http://95.217.51.146:5000/car-blue.png'); // Player 2
}

function setup() {
  createCanvas(600, 600);
  grassGrp = new Group();
  trackGrp = new Group();

  // You may need to resize your images to match your sprite dimensions
  grassImage.resize(spriteSize, spriteSize);
  trackImage.resize(spriteSize, spriteSize);
  finishImage.resize(spriteSize * 0.2, spriteSize * 0.2);

  console.log(trackFile);
  console.log(trackFile.length);
  //prints 15 - this is the num of rows or lines in the text file

  /*
  Here we go through the file that was read in earlier (trackfile) 
  go row by row and get the numbers '0', '1', '2',...
  and then dependig on what the number is we draw image
  so if num is 0 we draw grass , if its 1 we draw track image
  */
  // rotate(PI / 3.0);
  // read track file row by row
  for (let row = 0; row < trackFile.length; row++) {
    console.log("\n\nWe are processing row\t", row, '\tfrom the file.');
    let tiles_in_col = trackFile[row].split(" ");
    console.log("Row we read\t", trackFile[row]);
    console.log("Numbers in row we read\t", tiles_in_col);
    track[row] = tiles_in_col;
    for (let col = 0; col < tiles_in_col.length; col++) {
      tile = tiles_in_col[col];
      //track[col][row] = tile;
      /*
      createSprite(x,y,width,height)
      here location along x-axis is given by variable 'col'
      and  location along y-axis is given by variable 'row'
      so when creating sprite the call is createSprite(col,row,...) 
      */
      let spr = createSprite(col * spriteSize + spriteSize / 2, row * spriteSize + spriteSize / 2, spriteSize, spriteSize);
      spr.immovable = true;
      console.log('row\t', row, 'col\t', col, 'tile', tile);

      if (tile == '0') {
        spr.addImage(grassImage);
        grassGrp.add(spr);
      } else if (tile == '1') {
        spr.addImage(trackImage);
        trackGrp.add(spr);
      } else if (tile == '2') {
        spr.addImage(finishImage);
        start_x1 = col * spriteSize + 10;
        start_x2 = col * spriteSize + 30;
        start_y = row * spriteSize + 20;
      } else {
        console.log("no such tile");
      }
    }
  }
  // console.log(track);
  // console.log(grassGrp);
  // console.log(trackGrp);

  car1Draw();
  car2Draw();
}

function car1Draw() {
  car1 = createSprite(start_x1, start_y);
  car1.scale = 1;
  car1.rotation = 270;
  car1.maxSpeed = 6;
  car1.friction = 0.02;
  car1.addImage(carImage1);
  car1.rotateToDirection = true;
}

function car2Draw() {
  car2 = createSprite(start_x2, start_y);
  car2.scale = 1;
  car2.rotation = 270;
  car2.maxSpeed = 6;
  car2.friction = 0.02;
  car2.addImage(carImage2);
  car2.rotateToDirection = true;
}

function draw() {
  background(200);

  // Car 1

  if (keyDown(LEFT_ARROW)) {
    // makes car go left of direction of motion
    // also rotates anticlockwise or to the left of direction of motion
    car1.setVelocity(0, 0);
    car1.rotation -= 2;
  }

  if (keyDown(RIGHT_ARROW)) {
    // makes car go right of direction of motion
    // also rotates clockwise or to the right of direction of motion
    car1.setVelocity(0, 0);
    car1.rotation += 2;

  }
  if (keyDown(UP_ARROW)) {
    // setting +ve speed acts as accelerating
    car1.setSpeed(1);
    // need to find how to impose speed limit
  }

  if (keyDown(DOWN_ARROW)) {
    // setting speed 0 acts as braking - stops the car
    car1.setSpeed(0);
  }

  // Car 2

  if (keyDown('A')) {
    // makes car go left of direction of motion
    // also rotates anticlockwise or to the left of direction of motion
    car2.setVelocity(0, 0);
    car2.rotation -= 2;
  }

  if (keyDown('D')) {
    // makes car go right of direction of motion
    // also rotates clockwise or to the right of direction of motion
    car2.setVelocity(0, 0);
    car2.rotation += 2;

  }
  if (keyDown('W')) {
    // setting +ve speed acts as accelerating
    car2.setSpeed(1);
    // need to find how to impose speed limit
  }

  if (keyDown('S')) {
    // setting speed 0 acts as braking - stops the car
    car2.setSpeed(0);
  }

  drawSprites();


  /* if car has gone off track i.e. collided with grass sprites
     we position car back at its starting position
     one way to do it - restarting the game by calling setup() again

    another way - just redraw the car at its staring position
  */
  if (car1.overlap(grassGrp)) {
    //console.log("Car has gone onto the grass");
    if (keyDown(UP_ARROW)) {
      car1.setSpeed(0.1);
    } else {
      car1.setSpeed(0);
    }
  }

  if (car2.overlap(grassGrp)) {
    //console.log("Car has gone onto the grass");
    if (keyDown('W')) {
      car2.setSpeed(0.1);
    } else {
      car2.setSpeed(0);
    }
  }

  if (car1.overlap(car2)) {
    if (car1.position.x < car2.position.x) {
      car1.position.x -= 2;
      car2.position.x += 2;
    } else {
      car1.position.x += 2;
      car2.position.x -= 2;
    }

    car1.setSpeed(0.1);
    car2.setSpeed(0.1);
  }

}
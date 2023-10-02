let track = [];
let grassImage;
let trackImage;
let finishImage;
let carImage;
let start_x = 0;
let start_y = 0;
let grassGrp;
let trackGrp;
// let grassGrp = new Group();
// let trackGrp = new Group();

function preload() {
  trackFile = loadStrings('https://thebjjmatrix.com/api/profile/get-belt')
  grassImage = loadImage('images/grass.png'); // 0 = grass
  trackImage = loadImage('images/track.png'); // 1 = track
  finishImage = loadImage('images/finish.png'); // 2 = start/finish line
  carImage = loadImage('images/car.png');
}

function setup() {
  createCanvas(310, 310);
  grassGrp = new Group();
  trackGrp = new Group();
  const track_length = 15;
  const spriteSize = 20;

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
      let spr = createSprite(col * spriteSize + 15, row * spriteSize + 15, spriteSize, spriteSize);
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
        start_x = col * spriteSize + 15;
        start_y = row * spriteSize + 15;
      } else {
        console.log("no such tile");
      }
    }
  }
  console.log(track);
  console.log(grassGrp);
  console.log(trackGrp);

  carDraw();
}

function carDraw() {
  car = createSprite(start_x, start_y);
  car.scale = 0.8;
  car.rotation = 270;
  car.maxSpeed = 6;
  car.friction = 0.02;
  car.addImage(carImage);
  car.rotateToDirection = true;
}

function draw() {
  background(200);

  if (keyDown(LEFT_ARROW)) {
    // makes car go left of direction of motion
    // also rotates anticlockwise or to the left of direction of motion
    car.setVelocity(0, 0);
    car.rotation -= 2;
  }

  if (keyDown(RIGHT_ARROW)) {
    // makes car go right of direction of motion
    // also rotates clockwise or to the right of direction of motion
    car.setVelocity(0, 0);
    car.rotation += 2;

  }
  if (keyDown(UP_ARROW)) {
    // setting +ve speed acts as accelerating
    car.setSpeed(1);
    // need to find how to impose speed limit
  }

  if (keyDown(DOWN_ARROW)) {
    // setting speed 0 acts as braking - stops the car
    car.setSpeed(0);
  }

  drawSprites();


  /* if car has gone off track i.e. collided with grass sprites
     we position car back at its starting position
     one way to do it - restarting the game by calling setup() again

    another way - just redraw the car at its staring position
  */
  if (car.overlap(grassGrp)) {
    //console.log("Car has gone onto the grass");
    car.remove();
    carDraw();
  }

}
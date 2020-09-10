var dog, happyDog, database, foods, foodStock, currentHour, currentMinute; 
var dogImg, happyDogImg, foodImg;
var hr, mn, sc;
var feedButton;
var addFood;
var food;
var col;
var foodArray = [];
var testButton;
var livingRoom, livingRoomImg;
var bedRoom, bedRoomImg;
var garden, gardenImg;
var gameState = "hungary";

function preload()  {  
  
  dogImg = loadImage('images/dog.png');
  happyDogImg = loadImage('images/happy dog.png');
  foodImg = loadImage('images/milk.png');  
  livingRoomImg = loadImage('images/Living Room.png') ; 
  bedRoomImg = loadImage('images/Bed Room.png');
  gardenImg = loadImage('images/Garden.png');
}

function setup() {
  createCanvas(800,600); 
  col = color(239, 95, 95); 

  feedButton = createButton('CLICK TO FEED THE DOG');
  feedButton.position(400, 75);
  feedButton.style('background-color', col);
  feedButton.size(110, 110);
  
  addFood = createButton('ADD FOOD');
  addFood.position(600, 75);
  addFood.style('background-color', col);
  addFood.size(110, 110); 
  
  database = firebase.database(); 

  if(gameState === "hungary") {
    dog = createSprite(600, 315, 200, 200);
    dog.addImage(dogImg);
    dog.scale = 0.30; 
  }
     
  currentHour = hr;
  currentMinute = mn;

  database.ref('food').on('value', function(data){
    foodStock = data.val();
  })

}
 
function draw() {

  background("grey");
  textSize(10); 
  push();
  strokeWeight(7);
  stroke(0);
  line(425, 1, 425, 600);
  pop();  

  if(hr != undefined  && feedButton.mousePressed())  {
    push();
    fill("black");
    textSize(20);
    textStyle(BOLD);
    text("LAST FEED "+hr +":" + mn, 40, 520);
    pop();
  }

  fill("black");
  text(mouseX + "," + mouseY, 10, 10);

  if(foodStock === 0) {
    dog.addImage(dogImg);
  }

  feedButton.mousePressed(() =>{            
    if(foodStock != 0)  {
      dog.addImage(happyDogImg);      
      hr = hour();
      mn = minute();
      updateHour();
      updateMinute();
      writeStock(foodStock);
      gameState = "food feed";
    }       
  }) 

  addFood.mousePressed(() =>{
    if(foodStock === 0) {
      addStocks(foodStock);
    }
  })    
 
  if(foodStock != undefined) {  
    push();  
    textSize(20);
    textStyle(BOLD);
    if(foodStock === 0) {
      fill("red");
    }
    text("FOOD REMAINING : "+foodStock,40,490);
    pop();
  }

  imageMode(CENTER);
  y = 150;
  for(var i=0;i<foodStock;i++){
    if(i%5==0){
      x=80;
      y=y+50;
    }
    image(foodImg,x,y,50,50);
    x=x+30;
}

if(gameState != "hungary" ) {
  feedButton.hide();
}

if(gameState != 0)  {
  push();
  textSize(20);
  textStyle(BOLD);
  text(gameState, 55, 590);
  pop();
}  
  drawSprites();
  livingRoomUpdate(mn, 1);
  bedroomUpdate(mn, 2);
  gardenUpdate(mn, 3);
  updateHunger(mn);
}

function writeStock(x) {
 if(x <= 0) {
   x = 0;
 }
 else{
   x = x-1;   
 }
 database.ref('/').update({
   food:x
 })
}

function addStocks(x) {
  if(30 <= x) {
    x = 30;
  }
  else  {
    x += 30;
  }
  database.ref('/').update({
    food:x
  })
}

function updateHour(x) {
  x = hr
  database.ref('/').update({
    hour:hr
  })
}

function updateMinute(x)  {
  x = mn
  database.ref('/').update({
    minute:x
  })
}

function livingRoomUpdate(x, y)  {
  var r;
  r = minute();
  //console.log(r); 
  if(r - x === y) {    
    livingRoom = createSprite(615, 300, 50, 50);
    livingRoom.addImage(livingRoomImg);
    livingRoom.scale = 0.75;
    gameState = "living room";
  }
  else if(r - x === 2)  {
    livingRoom.hide();
  }

}
function bedroomUpdate(x, y) {
  var r;
  r = minute();
  if(r - x === y) {
    bedRoom = createSprite(615, 300, 50, 50);
    bedRoom.addImage(bedRoomImg);
    bedRoom.scale = 0.75;
    gameState = "bed room";
  }
  else if(r - x === 3)  {
    bedRoom.hide();
  }
}
function gardenUpdate(x, y) {
  var r;
  r = minute();
  if(r - x === y) {
    garden = createSprite(615, 300, 50, 50);
    garden.addImage(gardenImg);
    garden.scale = 0.75;
    gameState = "garden";
  }
  else if(r - x === 4)  {
    garden.hide();
  }
}
function updateHunger(x) {
  var r;
  r = minute();
  if(r - x === 4) {
    gameState = "hungary";
  }
}

/**
 * ENTRY POINT FOR THE PROJECT
 */

// Global variables
let canvas = new Canvas(720, 360);

const FPS = 30;
let drawables = [];
let pages = {};
let active_page;
let nextPage; // Named wrong, but it stores the selected game
let difficulty;
let pageLastClicked = Date.now();

let finalScore = 0; // Used later in the end page

let vignette; // For darkening edges

const starRatings = {
  eggs: [500, 1000, 1500, 2000, 2500],
  asteroid: [200, 600, 1200, 2000, 3000],
  maze: [
    // idk
  ],
};

// // ! Remove later
// difficulty = "easy";
// nextPage = "asteroid";
// finalScore = 1500;

// Check if a page was clicked after N time
function pageClickedWithin(ms) {
  return Date.now() - pageLastClicked < ms;
}

// Function to change pages
function changePage(id) {
  console.log({
    page: id,
    time: Date.now(),
    finalScore,
    difficulty,
    nextPage,
  });
  if (active_page) active_page.exit();
  if (pages[id] === undefined) {
    console.error(`Page "${id}" does not exist!`);
    return;
  }
  active_page = new pages[id]();
  active_page.enter();
}

// Stuff done before calling setup
// LOAD IMAGES AND AUDIO HERE
function preload() {
  // IMAGE ASSETS
  backgroundImg = loadImage("assets/background.jpg");
  mazebg = loadImage("assets/mazebg.png");
  maze1 = loadImage("assets/maze1.png");
  eggImg = loadImage("assets/egg.png");
  backButton = loadImage("assets/backbutton.png");
  asteroid = loadImage("assets/asteroid.png");
  star = loadImage("assets/star.png");
  stars = loadImage("assets/stars.png");
  heart = loadImage("assets/heart.webp");
  asteroidbg = loadImage("assets/asteroidBackground.png");
  maze2 = loadImage("assets/maze2.png");
  eggCracked = loadImage("assets/eggCracked.png");
  egg2 = loadImage("assets/egg2.png");
   egg3 = loadImage("assets/egg3.png");
  eggBG = loadImage("assets/eggGameBG.png");
  eggBreak1 = loadImage("assets/eggBreak1.png");
  eggBreak2 = loadImage("assets/eggBreak2.png");
  eggBreak3 = loadImage("assets/eggBreak3.png");
  eggBreak4 = loadImage("assets/eggBreak4.png");
  shield = loadImage("assets/shield.png");
  shieldOverlay = loadImage("assets/shieldOverlay.png");
  // dinoGif = loadImage("assets/dino.gif"); // ! Make smaller
  // dinoGif2 = loadImage("assets/dino2.gif"); // ! Make smaller
  // dinoGif3 = loadImage("assets/dino3.gif"); // ! Make smaller
  // dinolose = loadImage("assets/dinolose.gif"); // ! Make smaller
  maze3 = loadImage("assets/maze3.png");

  // AUDIO ASSETS
  gameBegin = loadSound("assets/audio/gameBegin.mp3");
  gameBegin.setVolume(0.5);
  gameWin = loadSound("assets/audio/gameWin.mp3");
  gameWin.setVolume(0.5);
  goodDing = loadSound("assets/audio/goodDing.mp3");
  metalPipe = loadSound("assets/audio/metalPipe.mp3"); // We need to add this somewhere
  shine = loadSound("assets/audio/shine.mp3");
  smallEggCrack = loadSound("assets/audio/smallEggCrack.mp3");
  uiButtonClick = loadSound("assets/audio/uiButtonClick.mp3");
  uiButtonHover = loadSound("assets/audio/uiButtonHover.mp3");
  shieldDown = loadSound("assets/audio/shieldDown.mp3");
}

// Drawings to only call once
function setup() {
  const cnv = createCanvas(canvas.x, canvas.y);
  cnv.parent("game");

  vignette = createGraphics(canvas.x, canvas.y);
  vignette.noStroke();

  const maxR = max(canvas.x, canvas.y);

  for (let r = 0; r < maxR; r++) {
    let alpha = map(r, 0, maxR, 0, 255);
    vignette.fill(0, alpha);
    vignette.ellipse(canvas.x / 2, canvas.y / 2, r * 2);
  }

  pages = {
    main: MainPage,
    eggs: EggsPage,
    maze: MazePage,
    asteroid: AsteroidPage,
    difficulty: DifficultyPage,
    end: EndPage,
  };

  changePage("main");

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
}

// Called every frame update
function draw() {
  active_page.update();
}

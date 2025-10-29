/**
 * ENTRY POINT FOR THE PROJECT
 */

// Global variables
let canvas = new Canvas(720, 360);

let drawables = [];
let pages = {};
let active_page;
let nextPage;
let difficulty;
let pageLastClicked;

// Check if a page was clicked after N time
function pageClickedWithin(ms) {
  return Date.now() - pageLastClicked < ms;
}

// Function to change pages
function changePage(id) {
  active_page = pages[id];
}

// Stuff done before calling setup
// LOAD IMAGES HERE
function preload() {
  backgroundImg = loadImage("assets/background.jpg");
  mazebg = loadImage("assets/mazebg.png");
  maze1 = loadImage("assets/maze1.png");
  eggImg = loadImage("assets/egg.png");
  backButton = loadImage("assets/backbutton.png");
}

// Drawings to only call once
function setup() {
  pages = {
    main: new MainPage(),
    eggs: new EggsPage(),
    astroid: new AstroidPage(),
    maze: new MazePage(),
    difficulty: new DifficultyPage(),
  };
  active_page = pages.main;

  createCanvas(canvas.x, canvas.y);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
}

// Called every frame update
function draw() {
  active_page.update();
}



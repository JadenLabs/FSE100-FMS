let canvas = new Canvas(720, 360);

let drawables = [];
let pages = {};
let active_page;
let nextPage;
let difficulty;

// Function to change pages
function changePage(id) {
  active_page = pages[id];
}

// Stuff done before calling setup
function preload() {
  backgroundImg = loadImage("assets/background.jpg");
  eggImg = loadImage("assets/egg.png");
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



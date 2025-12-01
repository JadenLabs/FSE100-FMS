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

const starRatings = {
    eggs: [
        500,
        1000,
        1500,
        2000,
        2500,
    ],
    asteroid: [
        200,
        600,
        1200,
        2000,
        3000,
    ],
    maze: [
        // idk
    ]
}

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
// LOAD IMAGES HERE
function preload() {
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
    dinoGif = loadImage("assets/maze1.png");
    dinoGif2 = loadImage("assets/maze1.png");
    dinoGif3 = loadImage("assets/maze1.png");
    dinolose = loadImage("assets/maze2.png");
     maze3 = loadImage("assets/maze3.png");
}

// Drawings to only call once
function setup() {
    pages = {
        main: MainPage,
        eggs: EggsPage,
        maze: MazePage,
        asteroid: AsteroidPage,
        difficulty: DifficultyPage,
        end: EndPage,
    };
    changePage("main");
    // changePage("end");

    const cnv = createCanvas(canvas.x, canvas.y);
    cnv.parent("game");
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
}

// Called every frame update
function draw() {
    active_page.update();
}

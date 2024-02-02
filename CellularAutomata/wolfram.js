var TamSquare = 5;
var length = Math.round(window.innerWidth / TamSquare);
var maxIteration = Math.round(window.innerHeight / TamSquare);
var palettes = [];
var currentPalette;
var iteration = 0;
var cells = [];
var rules = [];
var indexRules = 0;
var currentCells;
var currentRule;


createInitialCells();
createRules();
createPalettes();

currentRule = rules[0];
currentPalette = palettes[0];
currentCells = cells;


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    stroke(255);     // Set line drawing color to white
    background(0);
}

function draw() {

    drawCells();
    next();


}


function createInitialCells() {

    //for (let i = 0; i < length; i++) {
    //       cells.push( Math.round(Math.random()));

    //}

    cells = Array(length).fill(0);
    cells[Math.round(length / 2)] = 1;

}


function createRules() {
    var array = [18, 13, 22, 15, 30, 26, 45, 54, 57, 62, 60, 73, 75, 77, 82, 105, 99, 124, 129, 149, 150, 195, 250];

    for (let i = 0; i <= array.length; i++)
        rules.push(toBinary(array[i]));



}


function createPalettes() {
    palettes.push(new Palette({ R: 252, G: 244, B: 3 }, { R: 3, G: 15, B: 252 }));
    palettes.push(new Palette({ R: 11, G: 252, B: 3 }, { R: 24, G: 3, B: 252 }));
    palettes.push(new Palette({ R: 0, G: 237, B: 245 }, { R: 245, G: 0, B: 221 }));
}

function toBinary(number) {
    var values = [1, 2, 4, 8, 16, 32, 64, 128];
    var output = Array(8).fill(0);
    var remaining = number;
    var index = 7;

    while (remaining >= 0) {

        while (values[index] > remaining) index--;


        output[index] = 1;
        remaining = remaining - values[index];
    }

    return output;

}


function drawCells() {

    let i = 0;
    currentCells.forEach(c => {
        let x = 1 + (i * TamSquare);
        let y = 1 + (iteration * TamSquare);

        if (c == 0)
            fill(currentPalette.light.R, currentPalette.light.G, currentPalette.light.B);
        else
            fill(currentPalette.dark.R, currentPalette.dark.G, currentPalette.dark.B);

        square(x, y, TamSquare);

        i++;
    });


}


function next() {

    if (indexRules >= rules.length) return;

    if (iteration == maxIteration) {

        iteration = 0;
        currentCells = cells;
        currentRule = rules[++indexRules];
        currentPalette = palettes[Math.floor(Math.random() * palettes.length)];

        clear();
        return;
    }


    var newCells = Array(length).fill(0);

    for (let i = 1; i < newCells.length - 1; i++) {

        let left = currentCells[i - 1];
        let right = currentCells[i + 1];
        let center = currentCells[i];

        newCells[i] = rule(left, center, right);
    }

    iteration++;
    currentCells = newCells;

}


function rule(left, center, right) {
    if (left == 0 && center == 0 && right == 0) return currentRule[0];
    if (left == 0 && center == 0 && right == 1) return currentRule[1];
    if (left == 0 && center == 1 && right == 0) return currentRule[2];
    if (left == 0 && center == 1 && right == 1) return currentRule[3];
    if (left == 1 && center == 0 && right == 0) return currentRule[4];
    if (left == 1 && center == 0 && right == 1) return currentRule[5];
    if (left == 1 && center == 1 && right == 0) return currentRule[6];
    if (left == 1 && center == 1 && right == 1) return currentRule[7];



}



function Palette(light, dark) {
    this.light = light;
    this.dark = dark;
}







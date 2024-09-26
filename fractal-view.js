
function loadFractals() {
    loadFractal("3dgameoflife", "Game of Life", "3DGameOfLife");
    loadFractal("carrito", "Carrito", "Carrito");
    loadFractal("sierpinski", "Sierpinski", "Sierpinski");

    loadFractal("asccimaldelbrot", "Ascii Maldelbrot", "AscciMandelbrot");
    loadFractal("barsleyfractal", "Barnsley Fern Fractal", "Barnsley Fern Fractal");
    loadFractal("cellularAutomata", "Cellular Automata", "CellularAutomata");

    loadFractal("cesaroFractal", "Cesaro Fractal", "Cesaro Fractal");
    loadFractal("fractalTree", "Fractal Tree", "Fractal tree");
    loadFractal("LangstonAnt", "Langston Ant", "LangstonAnt");

    loadFractal("mathrose", "Math Rose", "Math Rose");
}

function loadFractal(id, name, carpet) {
    createView(
        id, 
        name,
        `./${carpet}/index.html`, 
        `./${carpet}/index.js`,
    );
}

function createView(id, name, htmlFile, jsFile) {

    $("body").append(`
            <div class="container">
        <div class="title">
            <h1>${name}</h1>
        </div>

        <div class="fractal-container">
            <iframe class="preview-container" src="${htmlFile}" title="description">
            </iframe>

            <pre class="code-container">
            <code class="language-javascript" id="js-${id}">

            </code>
        </pre>
        </div>
    </div>
        `);

    loadCode(id, jsFile);
}

function loadCode(id, jsFile){
    fetch(jsFile)
    .then(response => response.text())
    .then(code => {
        document.getElementById('js-' + id ).textContent = code;
        Prism.highlightAll();
    })
    .catch(error => console.error('Error loading JS file:', error));
}

loadFractals();



function loadFractals() {
    createView("3dgameoflife", "Game of Life", "./3DGameOfLife/index.html", "./3DGameOfLife/gameOfLife.js");
    createView("carrito", "Carrito", "./Carrito/index.html", "Carrito/Main.js"); 
    createView("sierpinski", "Sierpinski", "./Sierpinski/index.html", "./Sierpinski/Sierpinski.js");

    createView("asccimaldelbrot", "Ascii Maldelbrot", "./AscciMandelbrot/index.html", "./AscciMandelbrot/index.js");
    createView("barsleyfractal", "Barnsley Fern Fractal", "./Barnsley Fern Fractal/index.html", "./Barnsley Fern Fractal/Main.js");
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
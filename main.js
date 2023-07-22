const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const canvas_parent = document.getElementsByClassName('drawing-board')[0];
const ctx = canvas.getContext('2d');
const counter = document.getElementById('count-number');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = canvas_parent.offsetWidth - 2;
canvas.height = canvas_parent.offsetHeight - 2;

let isPainting = false;
let lineWidth = 20;
let startX;
let startY;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        resetCanvas();
    }
    if (e.target.id === 'save') {
        saveCanvas();
        resetCanvas();
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }
    
});

const resetCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);    
}
    

const saveCanvas = () => {
    //scale the canvas
    let scale = 28/200;
    let w = canvas.width;
    let h = canvas.height;
    let canvasCopy = document.createElement("canvas");
    let copyContext = canvasCopy.getContext("2d");
    canvasCopy.width = w * scale;
    canvasCopy.height = h * scale;
    copyContext.scale(scale, scale);
    copyContext.drawImage(canvas, 0, 0);

    //save the image
    let filename = document.getElementById('filename').value;
    counter.innerHTML = parseInt(counter.innerHTML) + 1;
    let img = canvasCopy.toDataURL('image/jpeg');
    let a = document.createElement('a');
    a.href = img;
    // check if filename is empty
    if (filename === '') {
        filename = 'image.jpg';
    }

    if (filename.slice(-4) !== '.jpg') {
        filename = filename + '.jpg';
    }

    a.download = filename;
    a.click();

    canvasCopy.remove();
}

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    let canvasX = e.clientX - canvas_parent.offsetLeft;
    let canvasY = e.clientY - canvas_parent.offsetTop;
    ctx.lineCap = "round";
    ctx.lineTo(canvasX, canvasY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX - canvas_parent.offsetLeft;
    startY = e.clientY - canvas_parent.offsetTop;
    console.log(startX, startY);
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

window.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
        saveCanvas();
        resetCanvas();
    }

    if (e.key === 'z' && e.ctrlKey) {
        resetCanvas();
    }

  }, false);

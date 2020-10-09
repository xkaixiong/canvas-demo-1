let canvas = document.getElementById('canvas')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
let ctx = canvas.getContext('2d')
let brush = document.getElementById("brush");
let eraser = document.getElementById("eraser");
let clear = false;
let activeColor = 'black';
let aColorBtn = document.getElementsByClassName("color-item");
let reSetCanvas = document.getElementById("clear");
ctx.lineWidth = 10;
ctx.lineCap = 'round';

setCanvasBg('white');
listenToUser(canvas);
getColor();

function setCanvasBg(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
}
function getColor(){
    for (let i = 0; i < aColorBtn.length; i++) {
        aColorBtn[i].onclick = function () {
            for (let i = 0; i < aColorBtn.length; i++) {
                aColorBtn[i].classList.remove("active");
                this.classList.add("active");
                activeColor = this.style.backgroundColor;
                ctx.fillStyle = activeColor;
                ctx.strokeStyle = activeColor;
            }
        }
    }
}
function drawCircle(x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (clear) {
        ctx.clip();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.restore();
    }
}
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function listenToUser(canvas) {
    let painting = false;
    let lastPoint = {x: undefined, y: undefined};

    if (document.body.ontouchstart !== undefined) {
        canvas.ontouchstart = function (e) {
            painting = true;
            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;
            lastPoint = {"x": x, "y": y};
            ctx.save();
            drawCircle(x, y, 0);
        };
        canvas.ontouchmove = function (e) {
            if (painting) {
                let x = e.touches[0].clientX;
                let y = e.touches[0].clientY;
                let newPoint = {"x": x, "y": y};
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        };

        canvas.ontouchend = function () {
            painting = false;
        }
    } else {
        canvas.onmousedown = function (e) {
            painting = true;
            let x = e.clientX;
            let y = e.clientY;
            lastPoint = {"x": x, "y": y};
            ctx.save();
            drawCircle(x, y, 0);
        };
        canvas.onmousemove = function (e) {
            if (painting) {
                let x = e.clientX;
                let y = e.clientY;
                let newPoint = {"x": x, "y": y};
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y,clear);
                lastPoint = newPoint;
            }
        };

        canvas.onmouseup = function () {
            painting = false;
        };

        canvas.mouseleave = function () {
            painting = false;
        }
    }
}


eraser.onclick = function () {
    clear = true;
    this.classList.add("active");
    brush.classList.remove("active");
    ctx.fillStyle = 'white';
    ctx.strokeStyle =  'white';
};

brush.onclick = function () {
    clear = false;
    this.classList.add("active");
    eraser.classList.remove("active");
};

reSetCanvas.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBg('white');
};


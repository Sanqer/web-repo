import './style.css';

let canvas = document.querySelector<HTMLCanvasElement>('#myCanvas');
if (canvas == null) {
    throw new Error();
}

canvas.width = 640;
canvas.height = 460; //d

let ctx = canvas.getContext('2d');
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, 10, 10);

ctx.strokeStyle = "#000000";
ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
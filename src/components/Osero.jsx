import React, { useEffect, useRef, useState } from 'react';

export const PanelStatus = {
    N : 0, B : 1, W : 2,
}
const SIZE = 650;
const SQUREA = 8;
const COLOR_WHITE = "#FFFFFF";
const COLOR_BLACK = "#000000";

const drawCycle = (ctx, x, y, color) => {
    x = SIZE/SQUREA*x - (SIZE/SQUREA/2);
    y = SIZE/SQUREA*y - (SIZE/SQUREA/2);
    ctx.beginPath();
    ctx.arc(x, y, SIZE/SQUREA/2*0.75, 0*Math.PI/180, 360*Math.PI/180, false);
    ctx.fillStyle = color;
    ctx.fill();
};

const drawRect = (ctx) => {
    ctx.beginPath();
    ctx.rect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "#007F00";
    ctx.fill();
};

const drawLine = (ctx) => {
    const oneLineLength = SIZE/SQUREA;
    ctx.beginPath();
    for (let i = 1; i <= SQUREA; i++) {
        // 横ライン
        ctx.moveTo(0, i*oneLineLength);
        ctx.lineTo(SIZE, i*oneLineLength);

        // 縦ライン
        ctx.moveTo(i*oneLineLength, 0);
        ctx.lineTo(i*oneLineLength, SIZE);

        ctx.closePath();
        ctx.stroke();
    } 
};

const Osero = (props) => {
  const { board, clickSquare } = props;
  const canvasRef = useRef(null);
  const onClick = (e) => {
    const {x, y} = (() => {
      const rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = Math.ceil(x*SQUREA/SIZE);
      y = Math.ceil(y*SQUREA/SIZE);
      return {x, y};
    })();
    clickSquare(x, y);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('click', onClick);
    
    const ctx = canvas.getContext('2d');
    ctx.fill();
    drawRect(ctx);
    drawLine(ctx);
    if (board) {
      board.forEach((row, x) => {
        row.forEach((col, y) => {
          switch(col) {
            case PanelStatus.B:
              drawCycle(ctx, x+1, y+1, COLOR_BLACK);
              break;
            case PanelStatus.W:
              drawCycle(ctx, x+1, y+1, COLOR_WHITE);
            // eslint-disable-next-line no-fallthrough
            default:
          }
        });
      });
    }
    return () => {
      canvas.removeEventListener('click', onClick);
    };
  }, [board])
  
  return <canvas ref={canvasRef} height={SIZE} width={SIZE} {...props}/>
};

export default Osero;
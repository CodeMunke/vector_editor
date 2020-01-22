/* Скрипт для для копирования и вставки фигур с помощью Ctrl+C, Ctrl+V*/

'use strict'

let svgBuffer;
let svgCopyID;
let constr;

const copy = () => {
    switch(constr.name) {
        // case 'Rectangle':
        //     svgBuffer = createSVGElem('rect');
        //     svgBuffer.setAttribute('x', +(currentFigure.x + 33));
        //     svgBuffer.setAttribute('y', +(currentFigure.y + 33));
        //     svgBuffer.setAttribute('width', +currentFigure.width);
        //     svgBuffer.setAttribute('height', +currentFigure.height);
        //     svgBuffer.setAttribute('rx', +currentFigure.r);
        //     svgBuffer.setAttribute('ry', +currentFigure.r);
        //     copySVGStyle(svgBuffer, currentFigure.svgFig);
        //     break;
        // case 'Polygon':
        //     svgBuffer = createSVGElem('polygon');
        //     for (let i = 0; i < currentFigure.svgFig.points.numberOfItems; i++) {
        //         const point = svgPanel.createSVGPoint();
        //         point.x = currentFigure.svgFig.points[i].x + 30;
        //         point.y = currentFigure.svgFig.points[i].y + 30;
        //         svgBuffer.points.appendItem(point);
        //     }
        //     break;
        // case 'Ellipse':
        //     svgBuffer = createSVGElem('ellipse');
        //     svgBuffer.setAttribute('cx', +(currentFigure.x + 33));
        //     svgBuffer.setAttribute('cy', +(currentFigure.y + 33));
        //     svgBuffer.setAttribute('rx', +currentFigure.rx);
        //     svgBuffer.setAttribute('ry', +currentFigure.ry);
        //     copySVGStyle(svgBuffer, currentFigure.svgFig);
        //     break;
        case 'Line':
            // svgBuffer = createSVGElem('line');
            let tempBuffer = currentFigure.svgFig.clone();
            tempBuffer.center(currentFigure.center.x + 33, currentFigure.center.y + 33);
            
            svgCopyID = tempBuffer.id();
            // svgCopyID += "copy";
            // tempBuffer.id(svgCopyID);
            // svgCopyID = tempBufferID;
            svgBuffer = tempBuffer.svg();
            tempBuffer.remove();

            // svgBuffer = svgPanel.line(currentFigure.x1 + 33, currentFigure.y1 + 33, currentFigure.x2 + 33, currentFigure.y2 + 33)
            // svgBuffer.setAttribute('x1', +(currentFigure.x1 + 33));
            // svgBuffer.setAttribute('y1', +(currentFigure.y1 + 33));
            // svgBuffer.setAttribute('x2', +(currentFigure.x2 + 33));
            // svgBuffer.setAttribute('y2', +(currentFigure.y2 + 33));
            // copySVGStyle(svgBuffer, currentFigure.svgFig);
            break;
        // case 'Polyline':
        //     svgBuffer = createSVGElem('polyline');
        //     for (let i = 0; i < currentFigure.svgFig.points.numberOfItems; i++) {
        //         const point = svgPanel.createSVGPoint();
        //         point.x = currentFigure.svgFig.points[i].x + 30;
        //         point.y = currentFigure.svgFig.points[i].y + 30;
        //         svgBuffer.points.appendItem(point);
        //     }
        //     copySVGStyle(svgBuffer, currentFigure.svgFig);
        //     break;
    }
};

document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.keyCode == 67 && currentFigure) {
        constr = currentFigure.constructor;
        copy();
    }
    if(e.ctrlKey && e.keyCode == 86 && svgBuffer) {
        if(constr.name !== 'Polygon'){
            svgPanel.svg(svgBuffer);
            var svgCopy = SVG.get(svgCopyID);
            // svgCopy.svg(svgBuffer);
            currentFigure = constr.create(svgCopy);
        } 
        // else {
        //     currentFigure = Polyline.create(svgBuffer);
        // }
        copy();
    }
});

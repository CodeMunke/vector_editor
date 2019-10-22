/*
    Скрипт для открытия файла.
*/

'use strict';

const openFile = (evt) => {
    const f = evt.target.files[0];
     
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('svg-panel').outerHTML = e.target.result;
        svgPanel = document.getElementById('svg-panel');
        
        const rects = svgPanel.getElementsByTagName('rect');
        const specialCircles = svgGrid.specialObjects.getElementsByTagName('circle');
        while (specialCircles.length > 0) {
            svgGrid.specialObjects.removeChild(specialCircles[0]);
        }
        const circles = svgPanel.getElementsByTagName('circle');
        for (let i = 0; i < rects.length; i++) {
            if (rects[i].getAttribute('stroke-opacity') === '0.5') {
                svgPanel.removeChild(rects[i]);
            }    
        }
        while (circles.length > 0) {
            if (circles[0].parentNode.getAttribute("id") == "specObj") {
                circles[0].parentNode.removeChild(circles[0]);
                continue;
            }
            svgPanel.removeChild(circles[0]);
        }
        
        const childs = Array.prototype.slice.call(svgPanel.childNodes);
        for (let i = 0; i < childs.length; i++) {
            switch(childs[i].nodeName) {
                case 'rect':
                    Rectangle.create(childs[i]);
                    break;
                case 'ellipse':
                    Ellipse.create(childs[i]);
                    break;
                case 'polygon':
                    Polyline.create(childs[i]);
                    break;
                case 'path':
                    BrushBox.create(childs[i]);
                    break;    
                case 'foreignObject':
                    TextBox.create(childs[i]);
                    break;
                case 'line':
                    Line.create(childs[i]);
                    break;  
                case 'g':
                    if (childs[i].id == "grid") {
                        Grid.createFromSVGGroup(childs[i]);
                    }
                    if (childs[i].id == "specObj") {
                        Grid.recreateSpecialObj(childs[i]);
                    }
                    break;      
            }
        }
    };
    reader.readAsText(f);
};

document.getElementById('file-input').addEventListener('change', openFile);

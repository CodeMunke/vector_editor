'use strict';

class Grid {
    constructor(gap) {
        /**  Массив для вертикальных линий сетки */
        this.gridLineArrayVer = new Array();
        /**  Массив для горизонтальных линий сетки */
        this.gridLineArrayHor = new Array();
        /** Флаг видимости */
        this.visible = false;
        /**  HTML-объект сетки. Имеет аттрибут "grid". Для фактических изменений в сетке, писать сюда.*/
        this.gridObj = document.createElementNS(svgNS, 'g');
        this.gridObj.setAttribute('id', "grid");

        this.draw(gap);
        svgPanel.appendChild(this.gridObj);
        // svgPanel.insertAdjacentElement('afterbegin', g);
        // svgPanel.insertAdjacentHTML('afterbegin',"<g id = \"grid\" >");
    }

    draw(gap) {
        let width = svgPanel.getAttribute('width');
        let height = svgPanel.getAttribute('height');
        for (let i = 0; i <= width; i += gap) {
            let line = createSVGElem('line',
            'undefined',
            paletteColor,
            '1',
            '1');
            line.setAttribute("x1", i);
            line.setAttribute("y1", 0);
            line.setAttribute("x2", i);
            line.setAttribute("y2", height);
            line.setAttribute("opacity", 0);
            this.gridLineArrayVer.push(line);
            this.gridObj.appendChild(line);
        }
        for (let i = 0; i <= height; i += gap) {
            let line = createSVGElem('line',
            'undefined',
            paletteColor,
            '1',
            '1');
            line.setAttribute("x1", 0);
            line.setAttribute("y1", i);
            line.setAttribute("x2", width);
            line.setAttribute("y2", i);
            line.setAttribute("opacity", 0);
            this.gridLineArrayHor.push(line);
            this.gridObj.appendChild(line);
        }
    }

    show () {
        this.visible = true;
        for (let i = 0; i < this.gridLineArrayHor.length; i++) {
            this.gridLineArrayHor[i].setAttribute("opacity", 0.5);
        }
        for (let i = 0; i < this.gridLineArrayVer.length; i++) {
            this.gridLineArrayVer[i].setAttribute("opacity", 0.5);
        }
    }

    hide () {
        this.visible = false;
        for (let i = 0; i < this.gridLineArrayHor.length; i++) {
            this.gridLineArrayHor[i].setAttribute("opacity", 0);
        }
        for (let i = 0; i < this.gridLineArrayVer.length; i++) {
            this.gridLineArrayVer[i].setAttribute("opacity", 0);
        }
    }

    redraw(newGap, show = 1) {
        for (let i = 0; i < this.gridLineArrayHor.length; i++) {
            this.gridObj.removeChild(this.gridLineArrayHor[i], this.gridObj);
        }
        for (let i = 0; i < this.gridLineArrayVer.length; i++) {
            this.gridObj.removeChild(this.gridLineArrayVer[i], this.gridObj);
        }

        this.gridLineArrayVer = new Array();
        this.gridLineArrayHor = new Array();

        this.draw(newGap);
        if (show) {
            this.show();
        }
    }
}

var svgGrid = new Grid(10);

const gridButton = document.getElementById('grid-button');
gridButton.addEventListener('click', function() { 
    if (gridButton.innerText == "Показать") {
        gridButton.innerText = "Скрыть"
        svgGrid.show();
    }
    else {
        gridButton.innerText = "Показать"
        svgGrid.hide();
    }
});

// drawPanel.addEventListener('mousedown', Grid.redraw = Grid.redraw.bind());

{
    const inputs = optionsGrid.getElementsByTagName('input');
    const selectors = optionsGrid.getElementsByTagName('ul');
    inputs[0].addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            if (inputs[0].value < 0) {
                inputs[0].value = 0;
            }
            svgGrid.redraw(parseInt(inputs[0].value, 10), svgGrid.visible)
        }
    })
    selectors[0].addEventListener('click', () => {
        svgGrid.redraw(parseInt(inputs[0].value, 10), svgGrid.visible);
    })
}
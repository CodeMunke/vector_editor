'use strict';

class Grid {
    constructor(gap) {
        this.gridLineArrayVer = new Array();
        this.gridLineArrayHor = new Array();
        this.visible = false;
        this.gridGroup = document.createElement('g');
        this.gridGroup.setAttribute('id', "grid");
        svgPanel.appendChild(this.gridGroup);
        // svgPanel.insertAdjacentElement('afterbegin', g);
        // svgPanel.insertAdjacentHTML('afterbegin',"<g id = \"grid\" >");

        this.draw(gap);
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
            this.gridGroup.appendChild(line);
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
            this.gridGroup.appendChild(line);
        }
    }

    show () {
        this.visible = true;
        for (let i = 0; i < this.gridLineArrayHor.length; i++) {
            this.gridLineArrayHor[i].setAttribute("opacity", 0.7);
        }
        for (let i = 0; i < this.gridLineArrayVer.length; i++) {
            this.gridLineArrayVer[i].setAttribute("opacity", 0.7);
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
            svgPanel.removeChild(this.gridLineArrayHor[i], svgPanel);
        }
        for (let i = 0; i < this.gridLineArrayVer.length; i++) {
            svgPanel.removeChild(this.gridLineArrayVer[i], svgPanel);
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
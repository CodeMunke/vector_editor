'use strict';

const opacityVisible = 0.5;
const opacityInvisible = 0;


class Grid {
    /**
     * 
     * @param {Размер клетки. Значение null озночает отложенный рендеринг} gap 
     */
    constructor(gap) {
        /**  Массив для вертикальных линий сетки для быстрого доступа */
        this.gridLineArrayVer = new Array();
        /**  Массив для горизонтальных линий сетки для быстрого доступа */
        this.gridLineArrayHor = new Array();
        /** Флаг видимости */
        this.visible = false;
        /**  HTML-объект сетки. Имеет аттрибут "grid". Для фактических изменений в сетке, писать сюда.*/
        this.gridObj = document.createElementNS(svgNS, 'g');
        this.gridObj.setAttribute('id', "grid");
        /* Атрибут группы передается по наследству всем её детям */
        this.gridObj.setAttribute('opacity', opacityInvisible);

        /** HTML-объект для группировки вертикальных линий */
        this.verLineGroup = document.createElementNS(svgNS, 'g');
        this.verLineGroup.setAttribute('id', "verLines");

        /** HTML-объект для группировки горизонтальных линий */
        this.horLineGroup = document.createElementNS(svgNS, 'g');
        this.horLineGroup.setAttribute('id', "horLines");

        /* Если задан размер клетки, рендерим сеть немедленно */
        if (gap != null) this.render(gap);
        /* Если нет, откладываем рендеринг */
        svgPanel.appendChild(this.gridObj);
        this.gridObj.appendChild(this.verLineGroup);
        this.gridObj.appendChild(this.horLineGroup);
    }

    render(gap) {
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
            this.gridLineArrayVer.push(line);
            this.verLineGroup.appendChild(line);
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
            this.gridLineArrayHor.push(line);
            this.horLineGroup.appendChild(line);
        }
    }

    static createFromSVGGroup(svgGridGroup) {
        svgGrid = new Grid(null);

        let groups = Array.prototype.slice.call(svgGridGroup.childNodes);
        let verLines = Array.prototype.slice.call(groups[0].childNodes);
        let horLines = Array.prototype.slice.call(groups[1].childNodes);

        if (svgGridGroup.getAttribute("opacity") == opacityVisible) {
            svgGrid.visible = true;
            svgGrid.gridObj.setAttribute("opacity", opacityVisible);
            gridButton.innerText = "Скрыть";
        }
        for (let i = 0; i < verLines.length; i++) {
            svgGrid.verLineGroup.appendChild(verLines[i]);
            svgGrid.gridLineArrayVer.push(verLines[i]);
        }
        for (let i = 0; i < horLines.length; i++) {
            svgGrid.horLineGroup.appendChild(horLines[i]);
            svgGrid.gridLineArrayHor.push(horLines[i]);
        }
    }

    show () {
        this.visible = true;
        this.gridObj.setAttribute("opacity", opacityVisible);
    }

    hide () {
        this.visible = false;
        this.gridObj.setAttribute("opacity", opacityInvisible);
    }

    redraw(newGap, show = 1) {
        for (let i = 0; i < this.gridLineArrayHor.length; i++) {
            this.horLineGroup.removeChild(this.gridLineArrayHor[i], this.horLineGroup);
        }
        for (let i = 0; i < this.gridLineArrayVer.length; i++) {
            this.verLineGroup.removeChild(this.gridLineArrayVer[i], this.verLineGroup);
        }

        this.gridLineArrayVer = new Array();
        this.gridLineArrayHor = new Array();

        this.render(newGap);
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
'use strict';

const opacityVisible = 0.5;
const opacityInvisible = 0;
const specialObjectOpacity = 1;


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

        /** HTML-объект для группировки горизонтальных линий */
        this.specialObjects = document.createElementNS(svgNS, 'g');
        this.specialObjects.setAttribute('id', "specObj");
        this.specialObjects.setAttribute('opacity', 0);

        this.beginningText = document.createElementNS(svgNS, 'text');
        this.beginningPoint = createSVGElem('circle', null, null, 1, 1, 1);

        this.specialObjects.appendChild(this.beginningText);
        this.specialObjects.appendChild(this.beginningPoint);


        /* Если задан размер клетки, рендерим сеть немедленно */
        if (gap != null) {
            // this.beginningText.setAttribute('x', 5);
            // this.beginningText.setAttribute('y', 15);
            // this.beginningText.setAttribute('class', "svg-text");
            // this.beginningText.textContent = "(0, 0)";

            // this.beginningPoint.setAttribute("cx", 0);
            // this.beginningPoint.setAttribute("cy", 0);
            // this.beginningPoint.setAttribute("r", 5);

            this.render(gap);
        }
        /* Если нет, откладываем рендеринг */
        svgPanel.appendChild(this.gridObj);
        this.gridObj.appendChild(this.verLineGroup);
        this.gridObj.appendChild(this.horLineGroup);
        svgPanel.appendChild(this.specialObjects);
    }

    render(gap) {
        const renderBeginningText = () => {
            this.beginningText = document.createElementNS(svgNS, 'text');
            this.beginningText.setAttribute('x', 5);
            this.beginningText.setAttribute('y', 15);
            this.beginningText.setAttribute('class', "svg-text");
            this.beginningText.textContent = "(0, 0)";
            this.specialObjects.appendChild(this.beginningText);
        }

        const renderBeginningPoint = () => {
            this.beginningPoint = createSVGElem('circle', null, null, 1, 1, 1);
            this.beginningPoint.setAttribute("cx", 0);
            this.beginningPoint.setAttribute("cy", 0);
            this.beginningPoint.setAttribute("r", 5);
            this.specialObjects.appendChild(this.beginningPoint);
        }


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
            if (i == 0) {
                line.setAttribute('stroke-width', 3);
                this.specialObjects.appendChild(line);
                continue;
            }
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
            if (i == 0) {
                line.setAttribute('stroke-width', 3);
                this.specialObjects.appendChild(line);
                continue;
            }
            this.horLineGroup.appendChild(line);
        }

        renderBeginningText();
        renderBeginningPoint();
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

    static recreateSpecialObj(svgSpecObjGroup) {
        let objects = Array.prototype.slice.call(svgSpecObjGroup.childNodes);

        if (svgSpecObjGroup.getAttribute("opacity") == specialObjectOpacity) {
            svgGrid.visible = true;
            svgGrid.specialObjects.setAttribute("opacity", specialObjectOpacity);
            gridButton.innerText = "Скрыть";
        }
        for (let i = 0; i < objects.length; i++) {
            svgGrid.specialObjects.appendChild(objects[i]);
        }
    }


    show () {
        this.visible = true;
        this.gridObj.setAttribute("opacity", opacityVisible);
        this.specialObjects.setAttribute("opacity", specialObjectOpacity);
    }

    hide () {
        this.visible = false;
        this.gridObj.setAttribute("opacity", opacityInvisible);
        this.specialObjects.setAttribute("opacity", opacityInvisible);
    }

    redraw(newGap, show = 1) {
        deleteAllChildren(this.specialObjects);
        deleteAllChildren(this.horLineGroup);
        deleteAllChildren(this.verLineGroup);

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
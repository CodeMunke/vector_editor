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
        this.gridObj = svgPanel.group("grid").opacity(opacityInvisible).id('grid');

        this.verLineGroup = svgPanel.group("verLines").id("verLines");

        this.horLineGroup = svgPanel.group("horLines").id("horLines");

        this.specialObjects = svgPanel.group("specObj").opacity(opacityInvisible).id("specObj");


        /* Если задан размер клетки, рендерим сеть немедленно */
        if (gap != null) {
            this.render(gap);
        }
        /* Если нет, откладываем рендеринг */
        this.gridObj.add(this.verLineGroup);
        this.gridObj.add(this.horLineGroup);
    }

    render(gap) {
        this.beginningText = svgPanel.text("(0, 0)").x(5).y(15).font({
            family: 'Roboto',
            size: 10,
        }).id("beginningText");
        this.beginningPoint = svgPanel.circle(5).x(0).y(0).id("beginningPoint");
        this.specialObjects.add(this.beginningText);
        this.specialObjects.add(this.beginningPoint);

        let width = svgPanel.width();
        let height = svgPanel.height();
        for (let i = 0, axisMarkGap = 0; i <= width; i += gap, axisMarkGap++) {
            let line = svgPanel.line(i, 0, i, height).stroke({width: 1});
            this.gridLineArrayVer.push(line);
            if (i == 0) {
                line.stroke({width: 3});
                this.specialObjects.add(line);
                continue;
            }

            if (axisMarkGap == 5) {
                let axisMark = svgPanel.text(i.toString()).x(i).y(10).font({
                    family: 'Roboto',
                    size: 10,
                }).id("axisMark" + i.toString());
                let axisCircle = svgPanel.circle(5).x(i - 2.5).y(0).id("axisCircle" + i.toString());
                this.verLineGroup.add(axisMark);
                this.verLineGroup.add(axisCircle);
                axisMarkGap = 0;
            }
            this.verLineGroup.add(line);
        }
        for (let i = 0, axisMarkGap = 0; i <= width; i += gap, axisMarkGap++) {
            let line = svgPanel.line(0, i, width, i).stroke({width: 1});
            this.gridLineArrayHor.push(line);
            if (i == 0) {
                line.stroke({width: 3});
                this.specialObjects.add(line);
                continue;
            }

            if (axisMarkGap == 5) {
                let axisMark = svgPanel.text(i.toString()).x(10).y(i).font({
                    family: 'Roboto',
                    size: 10,
                }).id("axisMark" + i.toString());
                let axisCircle = svgPanel.circle(5).x(0).y(i - 2.5).id("axisCircle" + i.toString());
                this.horLineGroup.add(axisMark);
                this.horLineGroup.add(axisCircle);     
                axisMarkGap = 0;       
            }
            this.horLineGroup.add(line);
        }
    }

    static createFromSVGGroup(svgGridGroup) {
        svgGrid = new Grid(null);
        

        let groups = svgGridGroup.children();
        let verLines = groups[0].children();
        let horLines = groups[1].children();

        if (svgGridGroup.opacity() == opacityVisible) {
            svgGrid.visible = true;
            svgGrid.gridObj.opacity(opacityVisible);
            gridButton.innerText = "Скрыть";
        }
        for (let i = 0; i < verLines.length; i++) {
            svgGrid.verLineGroup.add(verLines[i]);
            svgGrid.gridLineArrayVer.push(verLines[i]);
        }
        for (let i = 0; i < horLines.length; i++) {
            svgGrid.horLineGroup.add(horLines[i]);
            svgGrid.gridLineArrayHor.push(horLines[i]);
        }
    }

    static recreateSpecialObj(svgSpecObjGroup) {
        // let objects = Array.prototype.slice.call(svgSpecObjGroup.childNodes);
        let objects = svgSpecObjGroup.children();
        
        if (svgSpecObjGroup.opacity() == specialObjectOpacity) {
            svgGrid.visible = true;
            svgGrid.specialObjects.opacity(specialObjectOpacity);
            gridButton.innerText = "Скрыть";
        }
        for (let i = 0; i < objects.length; i++) {
            svgGrid.specialObjects.add(objects[i]);
        }
    }


    show () {
        this.visible = true;
        this.gridObj.opacity(opacityVisible);
        this.specialObjects.opacity(specialObjectOpacity);
    }

    hide () {
        this.visible = false;
        this.gridObj.opacity(opacityInvisible);
        this.specialObjects.opacity(opacityInvisible);
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
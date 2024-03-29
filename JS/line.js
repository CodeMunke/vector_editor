/*Скрипт для работы инструмента "Прямая"*/
'use strict';

var currentLine;

class Line extends Figure {
    constructor(svgFigure) {
        super(svgFigure);
        this.center = new LinePoint(this);
        this.center.circle.mousedown(this.moveLine.bind(this));

        let isErasing = false;
        this.svgFig = svgFigure;
        this.svgFig.mousemove(this.start.bind(this));
        // this.svgFig.addEventListener('mousemove', this.start.bind(this));

        this.refPoints.push(new LinePoint(this));
        this.refPoints.push(new LinePoint(this));
        
        this.eq = new LineEquasion(this.refPoints[0], this.refPoints[1]);
        
        this.svgFig.mousedown(this.eq.conversion_wrapper.bind(this));
        // this.svgFig.addEventListener('mousedown', this.eq.conversion_wrapper.bind(this));
    }

    static create(svgFigure) {
        const obj = new Line(svgFigure);
        // const get = attr => svgFigure.getAttribute(attr);
        // obj.setAttrs([get('x1'), get('y1'), get('x2'), get('y2')]);
        obj.svgFig.plot(svgFigure.array());
        obj.updateRefPointsCoords();
        obj.hideOrShow();
        obj.hideRefPoints();
        // svgPanel.add(obj.svgFig);
        obj.isShowing = false;
        obj.finished = true;
        currentFigure = null;
        return obj;
    }

    static draw(event) {
        if (!line.checked) return;

        let click = getMouseCoords(event);
        let moving = false;
        const options = optionsLine.getElementsByTagName('input');
        const obj = new Line(svgPanel.line(click.x, click.y, click.x + 1, click.y + 1).stroke({color: paletteColor, width: options[0].value, opacity: 1}));
        // svgPanel.appendChild(obj.svgFig);

        const moveLine = (event) => {
            moving = true;
            const current = getMouseCoords(event);
            obj.svgFig.stroke({opacity: 0.5})
            // obj.svgFig.setAttribute('stroke-opacity', '0.5');
            obj.moveByAngeles(click, current);
            const dx = current.x - click.x;
            const dy = current.y - click.y;
            options[1].value = obj.eq.eq_str;
        };

        const stopMoving = () => {
            document.removeEventListener('mousemove', moveLine);
            drawPanel.removeEventListener('mouseup', stopMoving);
            if (!moving) {
                obj.svgFig.remove();
                // svgPanel.removeChild(obj.svgFig);
                return;
            }
            obj.svgFig.stroke({opacity: 1})
            // obj.svgFig.setAttribute('stroke-opacity', '1');
            obj.updateRefPointsCoords();
            obj.hideOrShow();
            obj.showRefPoints();
            obj.finished = true;
        };

        document.addEventListener('mousemove', moveLine);
        drawPanel.addEventListener('mouseup', stopMoving);
    }
        
    // erase(event) {
    //     if (!eraser.checked) return;
    //     isErasing = true;
    // }

    static getDist (src, dest) {
        const dx = dest.x - src.x;
        const dy = dest.y - src.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    start(event) {
        if (!this.isErasing) return;

        const calcPointToCut = (src, dest, eraserCoord) => {
            const temp = (dest.x - src.x) / (dest.y - src.y);
            const y = (eraserCoord.x - src.x + eraserCoord.y/temp + temp*src.y) / (temp + 1/temp);
            const x = temp * (y - src.y) + src.x;
            return { x: x, y: y };
        }
        
        const options = optionsEraser.getElementsByTagName('input');
        const current = getMouseCoords(event);
        const width = options[0].value / 2;
        const eraserCoords = [ { x: current.x - width, y: current.y + width },
                               { x: current.x + width, y: current.y + width },
                               { x: current.x + width, y: current.y - width },
                               { x: current.x - width, y: current.y - width } ];

        let min1 = this.length, min2 = this.length;
        let point1 = { x: 0, y: 0 }, point2 = { x: 0, y: 0 };
        for (let i = 0; i < eraserCoords.length; i++) {
            const point = calcPointToCut({ x: this.x1, y: this.y1 },
                                         { x: this.x2, y: this.y2 },
                                         eraserCoords[i]);
            const dist1 = getDist({ x: this.x1, y: this.y1 }, point);
            if (min1 > dist1) {
                min1 = dist1;
                point1 = point;
            }
            const dist2 = getDist(point, { x: this.x2, y: this.y2 });
            if (min2 > dist2) {
                min2 = dist2;
                point2 = point;
            }
        }

        const maxX = this.x1 > this.x2 ? this.x1 : this.x2;
        const maxY = this.y1 > this.y2 ? this.y1 : this.y2;
        const minX = this.x1 < this.x2 ? this.x1 : this.x2;
        const minY = this.y1 < this.y2 ? this.y1 : this.y2;

        if (minX <= point1.x && point1.x <= maxX && minY <= point1.y && point1.y <= maxY) {
            const obj = Line.create(createSVGElem('line'));
            copySVGStyle(obj.svgFig, this.svgFig);
            obj.x1 = this.x1;    obj.y1 = this.y1;
            obj.x2 = point1.x;   obj.y2 = point1.y;
            svgPanel.appendChild(obj.svgFig);
            obj.updateRefPointsCoords();
        }

        if (minX <= point2.x && point2.x <= maxX && minY <= point2.y && point2.y <= maxY) {
            const obj = Line.create(createSVGElem('line'));
            copySVGStyle(obj.svgFig, this.svgFig);
            obj.x1 = point2.x;   obj.y1 = point2.y;
            obj.x2 = this.x2;    obj.y2 = this.y2;
            svgPanel.appendChild(obj.svgFig);
            obj.updateRefPointsCoords();
        }

        svgPanel.removeChild(this.svgFig);
        this.svgFig = null;
        currentFigure = null;
    }

    moveByMiddles(fixed, moving, horizontal) {
        this.setAttrs(this.getAttrsByMiddles(fixed, moving, horizontal));
    }

    getAttrsByMiddles(fixed, moving, horizontal) {
        let x, y, width, height;
        if (horizontal) {
            const left = (fixed.x < moving.x) ? fixed : moving;
            [x, y, width, height] = [left.x, this.y, Math.abs(fixed.x - moving.x), this.height];
        } else {
            const upper = (fixed.y < moving.y) ? fixed : moving;
            [x, y, width, height] = [this.x, upper.y, this.width, Math.abs(fixed.y - moving.y)];
        }
        return [x, y, width, height];
    }

    takePoint(event) {
        if (!cursor.checked || this.somePointTaken || someFigureTaken) {
            return;
        }

        const oldAttrs = [this.x1, this.y1, this.x2, this.y2];
        const options = optionsLine.getElementsByTagName('input');
        const clicked = getMouseCoords(event);
        let ind = this.findIndexMerged(clicked), newInd = null;
        if (ind === undefined) return;
        const symInd = this.findIndexMerged(this.getSymmetrical(clicked));
        const pushed = {x: this.refPoints[ind].x, y: this.refPoints[ind].y};
        let fixed = {x: this.refPoints[symInd].x, y: this.refPoints[symInd].y};
        const [horizontal, angelPushed] = [pushed.y == fixed.y, !(pushed.y == fixed.y || pushed.x == fixed.x)];

        const movePoint = ((event) => {
            const coords = getMouseCoords(event);

            // if (angelPushed) {
                this.moveByAngeles(fixed, coords);
            // } else {
            //     const coord = (horizontal) ? 'y' : 'x';
            //     coords[coord] = pushed[coord];
            //     this.moveByMiddles(fixed, coords, horizontal);
            // }

            this.updateRefPointsCoords();
            newInd = this.findIndexMerged(this.getSymmetrical(fixed));
            if (newInd != ind) {
                this.refPoints[ind].circle.fill({color: '#FFFFFF'});
                ind = newInd;
                this.refPoints[ind].circle.fill({color: '#0000FF'});
            }
            options[1].value = this.eq.toString();
        }).bind(this);

        const stopMoving = (event) => {
            const upped = this.findIndexMerged(getMouseCoords(event), ind);
            if (upped !== undefined) return;
            this.deleteTmpCopy();
            this.somePointTaken = someFigureTaken = false;
            this.refPoints[ind].circle.fill({color: '#FFFFFF'});
            document.removeEventListener('mousemove', movePoint);
            document.removeEventListener('keydown', returnToOld);
            this.refPoints[ind].circle.mousedown(this.takePoint);
            drawPanel.removeEventListener('mouseup', stopMoving);
        };

        const returnToOld = ((event) => {
            if (e.keyCode == 27) {
                this.setAttrs(oldAttrs);
                this.updateRefPointsCoords();
                stopMoving(event);
            }
        }).bind(this);

        this.createTmpCopy();
        this.somePointTaken = someFigureTaken = true;
        this.refPoints[ind].circle.fill({color: '#0000FF'});
        document.addEventListener('mousemove', movePoint);
        document.addEventListener('keydown', returnToOld);
        this.refPoints[ind].circle.off('mousedown', this.takePoint);
        drawPanel.addEventListener('mouseup', stopMoving);
    }

    moveLine(event) {
        if (!cursor.checked || this.somePointTaken || someFigureTaken) {
            return;
        }
        const move = (event) => {
            const coords = getMouseCoords(event);
            const dx = coords.x - this.c.x;
            const dy = coords.y - this.c.y;
            this.x1 += dx;
            this.x2 += dx;
            this.y1 += dy;
            this.y2 += dy;
            this.updateRefPointsCoords();
        };

        const stopMoving = (event) => {
            this.deleteTmpCopy();
            this.somePointTaken = someFigureTaken = false;
            this.center.circle.fill({color: '#FFFFFF'});
            this.center.circle.mousedown(this.moveLine);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('keydown', returnToOld);
            drawPanel.removeEventListener('mouseup', stopMoving);
        };

        const returnToOld = (event) => {
            if (event.keyCode == 27) {
                move(event);
                stopMoving();
            }
        };

        this.createTmpCopy();
        this.somePointTaken = someFigureTaken = true;
        this.center.circle.fill({color: '#0000FF'});
        this.center.circle.off('mousedown', this.moveLine);
        document.addEventListener('mousemove', move);
        document.addEventListener('keydown', returnToOld);
        drawPanel.addEventListener('mouseup', stopMoving);
    }

    updateRefPointsCoords() {
        const update = (ind, x, y) => this.refPoints[ind].setCoords({x: x, y: y});
        const [x1, y1, x2, y2] = [this.x1, this.y1, this.x2, this.y2];
        update(0, x1, y1);
        update(1, x2, y2);
        this.center.setCoords(this.c);

        this.eq.updateEquasionByPoints(this.refPoints[0], this.refPoints[1]);
    }

    showRefPoints() {
        this.refPoints.forEach(p => svgPanel.add(p.circle));
        svgPanel.add(this.center.circle);
    }

    hideRefPoints() {
        // this.refPoints.forEach(p => svgPanel.removeChild(p.circle));
        // svgPanel.removeChild(this.center.circle);
        this.refPoints.forEach(p => p.circle.remove());
        this.center.circle.remove();
    }

    moveByAngeles(a, c) {
        this.setAttrs(this.getAttrsByAngeles(a, c));
    }

    setAttrs(attrs) {
        [this.x1, this.y1, this.x2, this.y2] = attrs;
    }

    getAttrsByAngeles(a, b) {
        return [a.x, a.y, b.x, b.y];
    }

    getSymmetrical(point) {
        return {
            x: 2*this.c.x - point.x,
            y: 2*this.c.y - point.y
        };
    }

    createTmpCopy() {
        this.copy = svgPanel.line(0, 0, 0, 0).stroke({color: '#000000', opacity: 0.5, width: 1});
        // this.copy = createSVGElem('line', 'undefined', '#000000', '1', '0.5');
        let pointArr = this.copy.array();
        pointArr.value = [[this.x1, this.y1], [this.x2, this.y2]];
        this.copy.plot(pointArr);
        // this.copy.setAttribute('x1', this.x1);
        // this.copy.setAttribute('y1', this.y1);
        // this.copy.setAttribute('x2', this.x2);
        // this.copy.setAttribute('y2', this.y2);
        // svgPanel.insertBefore(this.copy, this.svgFigure);
    }

    showOptions() {
        hideAllOptions();
        optionsLine.classList.add('show-option');
        const options = optionsLine.getElementsByTagName('input');
        options[0].value = this.svgFig.attr('stroke-width');
        options[1].value = this.eq.toString();
    }

    set x1(v) { let a = this.svgFig.array(); a.value[0][0] = v; this.svgFig.plot(a); }
    set y1(v) { let a = this.svgFig.array(); a.value[0][1] = v; this.svgFig.plot(a);}
    set x2(v) { let a = this.svgFig.array(); a.value[1][0] = v; this.svgFig.plot(a); }
    set y2(v) { let a = this.svgFig.array(); a.value[1][1] = v; this.svgFig.plot(a); }

    // get x1() { return +this.svgFig.getAttribute('x1'); }
    get x1() { return +this.svgFig.array().value[0][0]; }

    get y1() { return +this.svgFig.array().value[0][1]; }
    // get y1() { return +this.svgFig.getAttribute('y1'); }

    // get x2() { return +this.svgFig.getAttribute('x2'); }
    get x2() { return +this.svgFig.array().value[1][0]; }

    // get y2() { return +this.svgFig.getAttribute('y2'); }
    get y2() { return +this.svgFig.array().value[1][1]; }

    get  c() { return {x: (this.x1 + this.x2)/2, y: (this.y1 + this.y2)/2}; }
    get length() {
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class LinePoint extends RefPoint {
    constructor(obj, coords = {x: 0, y: 0}) {
        super(obj, coords, line);
        this.circle.mousedown(this.figure.takePoint.bind(this.figure));
    }

    setCoords(coords) {
        this.x = coords.x;
        this.y = coords.y;
    }
}

drawPanel.addEventListener('mousedown', Line.draw = Line.draw.bind(Line));

{
    const inputs = optionsLine.getElementsByTagName('input');
    const selectors = optionsLine.getElementsByTagName('ul');
    Figure.addPanelListener(Line, inputs, selectors, 0, () => {
        currentFigure.svgFig.stroke({width: +inputs[0].value});
    });
    Figure.addPanelListener(Line, inputs, selectors, 1, () => {
        // currentFigure.eq.normalize();
        // inputs[1].value = currentFigure.eq.toSrting();
        // if (+inputs[1].value <= 0) {
        //     inputs[1].value = currentFigure.length;
        //     return;
        // }
        // const sin = (currentFigure.y2 - currentFigure.y1) / currentFigure.length;
        // const cos = (currentFigure.x2 - currentFigure.x1) / currentFigure.length;
        // currentFigure.x2 = currentFigure.x1 + (+inputs[1].value * cos);
        // currentFigure.y2 = currentFigure.y1 + (+inputs[1].value * sin);
        currentFigure.updateRefPointsCoords();
    });

    // colorPicker.addEventListener("mousedown", (event) => {
    //     if (currentFigure != null) {
    //         currentFigure.svgFig.setAttribute('stroke', paletteColor);
    //     }
    // });
}


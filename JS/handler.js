'use strict';

/*Массив инструментов*/
const instruments = [];

/*ID'шники инструментов*/
// const ids = ['cursor', 'hand', 'pen', 'text',
//     'line', 'ellipse', 'rect', 'polygon',
//     'brush', 'eraser', 'pipette', 'zoom'];
const ids = ['cursor', 'hand', 'line', 'grid', 'transfer'
            , 'scale', 'rotate', 'mirror', 'project'];

const transferTools = [];

/*Текущий выбранный инструмент*/
let currentInstrument = null;

/*Текущая выделенная фигура*/
let currentFigure = null;

/*Захвачена ли опорная точка некоторой фигуры*/
let someFigureTaken = false;

let pendingConversion;

const drawPanel = document.getElementById('workspace');
const leftPanel = document.getElementById('left-panel');
var  svgPanel = SVG('workspace').size(900, 500).id('svg-panel');

// let svgPanel = document.getElementById('svg-panel');
const svgNS = 'http://www.w3.org/2000/svg';

/*Добавление всех инструментов в массив и присваивание обработчиков*/
for (let i = 0; i < ids.length; i++) {
    instruments[i] = document.getElementById(ids[i]);
    instruments[i].addEventListener('click', function() { currentInstrument = this; });
    instruments[i].addEventListener('click', changeLabelSelected);
    instruments[i].addEventListener('click', showOptions);
    if (instruments[i].id == "transfer" || instruments[i].id == "scale" || instruments[i].id == "rotate" 
    || instruments[i].id == "mirror" || instruments[i].id == "project") {
        transferTools.push(instruments[i]);
    }
}

// let buttonColor = document.getElementById('button-color');
// let colorPicker = document.getElementById('color-picker');
// buttonColor.addEventListener('click', function() { colorPicker.classList.toggle('show-option'); });

let paletteColor = '#000000';

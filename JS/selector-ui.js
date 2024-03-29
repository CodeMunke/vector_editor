/*Панели опций*/
// const optionsText = document.getElementById('options-text');
const optionsLine = document.getElementById('options-line');
const optionsGrid = document.getElementById('options-grid');
// const optionsRect = document.getElementById('options-rect');
// const optionsEllipse = document.getElementById('options-ellipse');
// const optionsPolygon = document.getElementById('options-polygon');
// const optionsBrush = document.getElementById('options-brush');
// const optionsEraser = document.getElementById('options-eraser');
// const optionsZoom = document.getElementById('options-zoom');

/*Механика работы селектора*/
const allSelectors = document.querySelectorAll('.selector');
for (let i = 0; i < allSelectors.length; i++) {
    let input = allSelectors[i].querySelectorAll('.selector-field');
    let allOptions = allSelectors[i].querySelectorAll('.selector-li');
    let allEquasionOptions = allSelectors[i].querySelectorAll('.equasion-li');
    if (allOptions.length != 0){
        input[0].value = allOptions[0].innerHTML;
        for (let j = 0; j < allOptions.length; j++) {
            allOptions[j].addEventListener('click', function() { input[0].value = allOptions[j].innerHTML; });
        }
    }

    if (allEquasionOptions.length != 0) {
        for (let j = 0; j < allEquasionOptions.length; j++) {
            if (allEquasionOptions[j].id == "norm-form") {
                allEquasionOptions[j].addEventListener('click', function() {
                    if (currentFigure != null) {
                        currentFigure.eq.norm_required = true;
                        input[0].value = currentFigure.eq.toString();
                    }
                    else {
                        input[0].value = null;
                    }
                });
            }
            else {
                allEquasionOptions[j].addEventListener('click', function() {
                    if (currentFigure != null) {
                        currentFigure.eq.norm_required = false;
                        input[0].value = currentFigure.eq.toString();
                    }
                    else input[0].value = null;
                });
            }
        }
    }
}

/*Функция, скрывающая всю панель опций*/
const hideAllOptions = () => {
    // optionsText.classList.remove('show-option');
    optionsLine.classList.remove('show-option');
    // optionsRect.classList.remove('show-option');
    // optionsBrush.classList.remove('show-option');
    // optionsEllipse.classList.remove('show-option');
    // optionsPolygon.classList.remove('show-option');
    // optionsEraser.classList.remove('show-option');
    // optionsZoom.classList.remove('show-option');
    optionsGrid.classList.remove('show-option');
};

/*Функция, включающая конкретную панель*/
const showOptions = () => {
    hideAllOptions();

    if (currentInstrument.alt == 'Прямая') {
        optionsLine.classList.add('show-option');
    // } else if (currentInstrument.alt == 'Текст') {
    //     optionsText.classList.add('show-option');
    // } else if (currentInstrument.alt == 'Прямоугольник') {
    //     optionsRect.classList.add('show-option');
    // } else if (currentInstrument.alt == 'Эллипс') {
    //     optionsEllipse.classList.add('show-option');
    // } else if (currentInstrument.alt == 'Многоугольник') {
    //     optionsPolygon.classList.add('show-option');
    // } else if (currentInstrument.alt == 'Кисть') {
    //     optionsBrush.classList.add('show-option');
    // } else if (currentInstrument.alt == 'Ластик') {
    //     optionsEraser.classList.add('show-option');
    // } else if (currentInstrument.alt == 'Лупа') {
    //     optionsZoom.classList.add('show-option');
    } else if (currentInstrument.alt == 'Система координат') {
        optionsGrid.classList.add('show-option');
    }
};

/* Созддание нового пространства рисования, файла */

function deleteChild( node, parent ) {
	for (var i = 0; i < node.childNodes.length;)
		deleteChild(node.childNodes[i], node);

	if (node.childNodes.length == 0) {
		parent.removeChild(node);
		return;
	}
}

function deleteAllChildren( node ) {
	if (node instanceof HTMLElement) {
		for (var i = 0; i < node.childNodes.length;)
		deleteChild(node.childNodes[i], node);
	}
	else {
		node.clear();
	}
}

function createSVGPanel() {
	var
	  width = prompt('Введите ширину нового поля', 900),
	  height = prompt('Введите высоту нового поля', 500);

	if (width < 1 || height < 1) {
		alert("Пожалуйста, введите корректные данные!")
		return;
	}

	deleteAllChildren(drawPanel);
	svgPanel = SVG('workspace').size(width, height).id("svg-panel");

	svgGrid = new Grid(10);
	gridButton.innerText = "Показать";
}

/*
*/

$(document).ready(function() {

	var ttsData = [
		{
			clue: 'Bahasa pemrograman berkarat.',
			answer: 'rust',
			orientation: 'menurun',
			no: 1,
			startx: 1,
			starty: 0
		},
		{
			clue: '&*.',
			answer: 'pointer',
			orientation: 'menurun',
			no: 3,
			startx: 4,
			starty: 0
		},
		{
			clue: 'Perkawinan C dan Pascal.',
			answer: 'golang',
			orientation: 'menurun',
			no: 4,
			startx: 7,
			starty: 0
		},
		{
			clue: 'Perangkat yang punya CPU pasti bisa diinstallin ini.',
			answer: 'linux',
			orientation: 'menurun',
			no: 7,
			startx: 9,
			starty: 5
		},
		{
			clue: 'Cangkang sistem operasi.',
			answer: 'shell',
			orientation: 'menurun',
			no: 9,
			startx: 5,
			starty: 6
		},
		{
			clue: 'Bahasa pemrograman (singk.).',
			answer: 'cpp',
			orientation: 'mendatar',
			no: 2,
			startx: 3,
			starty: 0
		},
		{
			clue: 'Laptop kelas bisnis terbaik (objectively).',
			answer: 'thinkpad',
			orientation: 'mendatar',
			no: 5,
			startx: 1,
			starty: 3
		},
		{
			clue: 'Lisensi Free Software.',
			answer: 'gpl',
			orientation: 'mendatar',
			no: 6,
			startx: 7,
			starty: 5
		},
		{
			clue: 'f(f(x)).',
			answer: 'shell',
			orientation: 'mendatar',
			no: 8,
			startx: 0,
			starty: 6
		},
		{
			clue: 'Bukan bahasa pemrograman.',
			answer: 'html',
			orientation: 'mendatar',
			no: 10,
			startx: 2,
			starty: 9
		}
	],
		tableWidth = 10,
		tableHeight = 11

	function makeTable() {
		table = "<table><tbody>"
		for (var row=0; row<tableWidth; row++) {
			table += "<tr>"
			for(var col=0; col<tableHeight; col++) {
				table += "<td data-coord=" + col + "," + row + "></td>"
			}
			table += "</tr>"
		}
		$('#tts-wrapper').append(table)
	}

	function makeEntries() {
		$.each(ttsData, function (idx, obj) { 
			if (obj.orientation == 'menurun'){ 
				fillColumn(obj.starty, obj.startx, obj.answer.length, obj.no);
			}
			if (obj.orientation == 'mendatar') {
				fillRow(obj.startx, obj.starty, obj.answer.length, obj.no);
			}
		});
	}

	function fillRow(startx, y, length, no) {
		input = '<input maxlength="1" val="" type=text tabindex="-1" />'
		$("td").filter('[data-coord="' + startx + "," + y + '"' +"]").append("<span>" + no + "</span>");
		for (var i=startx; i<length+startx; i++){
			cell = $("td").filter('[data-coord="' + i + "," + y + '"' +"]");
			console.log(no)
			if (!cell.find("input").length) {
				cell.append(input);
				console.log(no)
			}
			cell.addClass('entry-' + no)
		}
	}

	function fillColumn(starty, x, length, no) {
		input = '<input maxlength="1" val="" type=text tabindex="-1" />'
		$("td").filter('[data-coord="' + x + "," + starty + '"' +"]").append("<span>" + no + "</span>");
		for (var i=starty; i<length+starty; i++){
			cell = $("td").filter('[data-coord="' + x + "," + i + '"' +"]");
			cell.append(input);
			cell.addClass('entry-' + no)
		}
	}

	function makeClues() {
		$.each(ttsData, function (idx, obj) { 
			if (obj.orientation == 'mendatar') {
				$("#mendatar").append('<li class=entry-' + obj.no + '>' + obj.no + ". " + obj.clue + '</li>');
			}
			if (obj.orientation == 'menurun')  {
				$("#menurun").append('<li class=entry-' + obj.no + '>' + obj.no + ". " + obj.clue + '</li>');
			}
		});
	}

	function eventListener() {
		$("input").on('keyup', function () {
			checkAnswer();	
		});
	}

	function checkAnswer() {
		$.each(ttsData, function (idx, obj) { 
			input = $(".entry-" + obj.no).find("input");
			answer = $(input).map(function() {
				return $(this).val();
			}).get();
			if (answer.join('').toLowerCase() == obj.answer) {
				correctElement = input.parent().attr("class");
				input.addClass('correct');
				$('.' + correctElement).addClass('correct');
			}
		});
	}

	function init() {
		makeTable();
		makeEntries();
		makeClues();
		eventListener();
	}

	init();
});
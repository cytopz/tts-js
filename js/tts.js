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
			answer: 'rekursi',
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
		tableWidth = 11,
		tableHeight = 11,
		highlightActive = false,
		currentHighlightedInput = [],
		correctAnswers = 0;

	function makeTable() {
		table = "<table><tbody>"
		for (var col=0; col<tableWidth; col++) {
			table += "<tr>"
			for(var row=0; row<tableHeight; row++) {
				table += "<td data-coord=" + row + "," + col + "></td>"
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
			if (!cell.find("input").length) {
				cell.append(input);
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
		$("input").on('keyup', function (e) {
			checkAnswer();	
			navigateCursor(e);
		});

		$("input").on('click', function () {
			highlightAnswer($(this));	
			getHighlightedInput($(this).attr("class"));
		});

		$("#talukButton").on('click', function() {
			$(".highlighted").removeClass("highlighted");
			fillAnswer();
		});
	}

	function fillAnswer() {
		entries = $("li:not(.correct)");
		console.log(entries);
		$.each(entries, function(idx, obj) {
			currEntry = $(obj).attr("class").split("-")[1];
			$.each(ttsData, function(i, data) {
				if(currEntry != data.no) {
					return;
				}
				answer = data.answer.split('');
				inputs = $("td.entry-" + currEntry).children("input");
				$.each(answer, function(i, letter) {
					$(inputs[i]).val(letter);
					$(inputs[i]).prop("disabled", true);
				})
			})
		});
		$("#score").append("Score : " + correctAnswers);	
	}

	function checkAnswer() {
		$.each(ttsData, function (idx, obj) { 
			input = $(".entry-" + obj.no).find("input");
			answer = $(input).map(function() {
				return $(this).val();
			}).get();
			if (answer.join('').toLowerCase() == obj.answer) {
				$(".entry-" + obj.no).addClass("correct");
				input.addClass("correct")
				input.prop('disabled', true);
				input.removeClass("highlighted");
				$(".entry-" + obj.no).removeClass("highlighted");
				correctAnswers = $("li.correct").length
			}
			if (correctAnswers >= 3) {
				$("#talukButton").prop("disabled", false);
			}

			if (correctAnswers == ttsData.length) {
				$("#score").append("Score : " + correctAnswers);
				$("#talukButton").prop("disabled", true);
				return false;
			}
		});
	}

	function highlightAnswer(input) {
		var className = getHighlightedInputClass(input);
		if (highlightActive) {
			$(".highlighted").removeClass("highlighted");
			highlightActive = false;
			currentHighlightedInput.length = 0;
		}
		$("." + className).each(function (idx, obj) {
			$(this).children().filter("input:not(.correct)").addClass("highlighted");
			$(this).addClass("highlighted");
			highlightActive = true;
		});
	}

	function getHighlightedInputClass(input) {
		var className;
		if (input.siblings("span").text() > 0) {
			className = "entry-" + input.siblings("span").text();
		}
		else {
			className = input.parent().attr("class").split(' ')[0];
		}
		return className;
	}

	function getCurrentOrientation(input) {
		var entry,
			orientation
		entry = getHighlightedInputClass(input);
		$.each(ttsData, function(idx, obj) {
			if (obj.no == entry.split('-')[1]) {
				orientation = obj.orientation;
				return false;
			}
		});
		return orientation;
	}

	function getHighlightedInput(className) {
		$("." + className).each(function(idx, obj) {
			input = $(obj).children("input");
			if (input.length > 0 && input.hasClass("highlighted")) {
				currentHighlightedInput.push(input);
			}
		})
	}

	function getCurrentCursorPos() {
		pos = $("input:focus").parent().attr('data-coord');
		try {
			return pos.split(',');
		} catch (TypeErrror) {
			return '';
		}
	}

	function navigateCursor(e) {
		var currPos = getCurrentCursorPos(),
			input = currentHighlightedInput[0],
			orientation = getCurrentOrientation(input),
			x = Number(currPos[0]),
			y = Number(currPos[1]),
			nextInput;
		if (e.which == 8) {
			nextInput = (orientation == "mendatar") ? traverseInput(orientation, x, y, -1) : traverseInput(orientation, x, y, -1);
			if (nextInput.hasClass("correct")) {
				nextInput = (orientation == "mendatar") ? traverseInput(orientation, x, y, -2) : traverseInput(orientation, x, y, -2);
			}
			$(nextInput).val('');
		}
		else if (e.which <= 90 && e.which >= 65) {
			nextInput = (orientation == "mendatar") ? traverseInput(orientation, x, y, 1) : traverseInput(orientation, x, y, 1);
			if (nextInput.hasClass("correct")) {
				nextInput = (orientation == "mendatar") ? traverseInput(orientation, x, y, 2) : traverseInput(orientation, x, y, 2);
			}
		}
		else {
			nextInput = $("input:focus");
			$(nextInput).val('');
		}
		$(nextInput).focus();
	}

	function traverseInput(orientation, x, y, val) {
		return (orientation == "mendatar") ? $('td[data-coord="' + (x+val) + ',' + y + '"]').children("input") : $('td[data-coord="' + x + ',' + (y+val) + '"]').children("input");

	}

	function init() {
		makeTable();
		makeEntries();
		makeClues();
		eventListener();
	}

	init();
});
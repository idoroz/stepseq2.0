var curr;
var saved;
var kick = new Howl({
    src: ['808drum/808kick.wav'],
});

var snr = new Howl({
    src: ['808drum/808snr.wav'],
});

var hhc = new Howl({
    src: ['808drum/808hhc.wav'],
});

var hho = new Howl({
    src: ['808drum/808hho.wav'],
});

var Kick = 'kick';
var Snare = 'snare';
var HHC = 'hhc';
var HHO = 'hho';

var seqCounter = 'counter';

var ticker;

$(document).ready(function() {

    $.getJSON('data.json').done(function(response) {
        console.log("Success");
        saved = response;
    }).fail(function() {
        console.log("Error");
    });


    createRow(seqCounter);
    createRow(Kick);
    createRow(Snare);
    createRow(HHC);
    createRow(HHO);



    $('#start').on('click', function() {
        startCounter();
    });

    $('#stop').on('click', function() {
        var allTicks = $('td.counter');
        for (var i = 0; i < allTicks.length; i++) {
            if (allTicks[i].style.background = 'lightgrey') {
                allTicks[i].style.background = 'grey';
            }
        }
        clearTimeout(ticker);
    });

    $('td').click(function() {
        curr = this
        if (curr.dataset.note == '0') {

            slct(curr);
        } else {
            deslct(curr);
        }
    });


    $('#save').on('click', function() {
        savePattern();
    });

    $('#load').on('click', function() {
    	//saved = pattern chosen
        loadPattern(saved);
    });

    $('#clear').on('click', function() {
    	var allCells = $('td');
    for(var i = 0; i<allCells.length; i++) {
    	deslct(allCells[i]);
    }
    })

});


function createRow(type) {

    var table = $('.seq');
    var row = $(document.createElement('tr'));

    var cells = [];

    for (var i = 0; i < 32; i++) {
        cells.push('<td class=' + type + ' data-note = 0></td>');
    }

    $(row).append(cells.join(''));
    $(table).append(row);


}

function startCounter() {
    var allTicks = $('td.counter');
    var allKicks = $('td.kick');
    var allSnares = $('td.snare');
    var allHHC = $('td.hhc');
    var allHHO = $('td.hho');


    var j = 0;
    var obj;


    function currentColumn() {
        ticker = setTimeout(function() {
            $(allTicks[31]).css('background', 'grey');

            $(allTicks[j]).css('background', 'lightgrey');
            $(allTicks[j - 1]).css('background', 'grey');

            obj = {
                column: j.toString(),
                kick: allKicks[j].dataset.note,
                snare: allSnares[j].dataset.note,
                hhc: allHHC[j].dataset.note,
                hho: allHHO[j].dataset.note
            }
            console.log(obj);
            playSound(obj);
            j++;
            if (j < allTicks.length) {
                currentColumn();
            } else {

                startCounter()
            }
        }, 125)
    }
    currentColumn();
}



function playSound(obj) {

    if (obj.kick == "1") {
        kick.play();
    }
    if (obj.snare == "1") {
        snr.play();
    }
    if (obj.hhc == "1") {
        hhc.play();
    }
    if (obj.hho == "1") {
        hho.play();
    }

    return false;

}


function slct(curr) {
    curr.style.background = 'red';
    curr.dataset.note = '1';
};

function deslct(curr) {
    curr.style.background = 'grey';
    curr.dataset.note = '0';
};



function savePattern() {

    var allKicks = $('td.kick');
    var allSnares = $('td.snare');
    var allHHC = $('td.hhc');
    var allHHO = $('td.hho');

    //var kickArr = [];
    var snareArr = [];
    var hhcArr = [];
    var hhoArr = [];

    function getNotes(type) {
        var arr = [];
        for (var i = 0; i < type.length; i++) {

            arr.push(type[i].dataset.note);
        }

        return arr;
    }

    var kickArr = getNotes(allKicks);
    var snareArr = getNotes(allSnares);
    var hhcArr = getNotes(allHHC);
    var hhoArr = getNotes(allHHO);

    var savedPattern = {

        name: 'thename',
        kick: kickArr,
        snare: snareArr,
        hhc: hhcArr,
        hho: hhoArr
    }


    console.log(JSON.stringify(savedPattern));
};


function loadPattern(pattern) {
	var kickRow = $('td.kick');
	var snareRow = $('td.snare');
    var hhcRow = $('td.hhc');
    var hhoRow = $('td.hho');
	var loaded_kicks = pattern.kick;
	var loaded_snares = pattern.snare;
	var loaded_hhc = pattern.hhc;
	var loaded_hho = pattern.hho;

setLoadedNotes(kickRow, loaded_kicks);
setLoadedNotes(snareRow, loaded_snares);
setLoadedNotes(hhcRow, loaded_hhc);
setLoadedNotes(hhoRow, loaded_hho);
	

}

function setLoadedNotes(row, loadedType) {
				for (var j = 0; j<row.length; j++) {
		if(loadedType[j] == '1') {
			slct(row[j]);
		}
	}
}
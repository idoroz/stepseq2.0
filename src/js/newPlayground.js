var curr;
var saved;
var jsonData;
var patNames = [];
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

        var links = [];
        var dropDownOpts = $('.dropdown-content');
        for (var i = 0; i < saved.length; i++) {
            links.push('<a id=' + saved[i].nameID + '>' + saved[i].nameID + '</a>');
            patNames.push(saved[i].nameID);
        }
        getDataJson(response)
        $(dropDownOpts).append(links);

    }).fail(function() {
        console.log("Error");
    });


    createRow(seqCounter);
    createRow(Kick);
    createRow(Snare);
    createRow(HHC);
    createRow(HHO);

    function getDataJson(response) {
        jsonData = response;
    }

    $('#start').on('click', function() {
        startCounter();
          $(this).attr("disabled",true);
    });

    $('#classic').on('click', function() {
        console.log('classic')
    });

    $('#stop').on('click', function() {
        var allTicks = $('td.counter');
        for (var i = 0; i < allTicks.length; i++) {
            if (allTicks[i].style.background = 'lightgrey') {
                allTicks[i].style.background = 'grey';
            }
        }
        clearTimeout(ticker);
        $('#start').attr("disabled",false);
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
        alert('WIP - still to do')
    });

    $('#clear').on('click', function() {
clearPattern();
    })


    $('a').on('click', function(e) {
        e.preventDefault();
        console.log('clicked a ')
    });

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

function clearPattern() {
            var allCells = $('td');
        for (var i = 0; i < allCells.length; i++) {
            deslct(allCells[i]);
        }
}


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

        nameID: 'thename',
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
    for (var j = 0; j < row.length; j++) {
        if (loadedType[j] == '1') {
            slct(row[j]);
        }
    }
}



/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function loadThePatterns() {
    document.getElementById("load_dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
    if (event.target.matches('a')) {

        var selectedPattern = event.srcElement.id
        console.log(patNames);
        console.log(jsonData)

        for(var i = 0; i<jsonData.length; i++) {
            if(jsonData[i].nameID == selectedPattern) {
                clearPattern()
                loadPattern(jsonData[i]);
            }
        }

    }
}

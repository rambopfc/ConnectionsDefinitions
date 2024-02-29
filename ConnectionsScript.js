// ==UserScript==
// @name         Connections Word Definitions
// @namespace    https://www.nytimes.com/
// @version      2024-02-23
// @description  Get definitions for a word on hover
// @author       Joe
// @match        https://www.nytimes.com/games/connections
// @connect      api.dictionaryapi.dev
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dictionaryapi.dev
// @run-at document-idle
// @grant        none
// ==/UserScript==

var selected = [];
var LoadedDefs = [];
var jsonresponse = "";

window.addEventListener('load', function() {


    //Inject a div into this location. Add definition elements to a string and then inject them into this div on mouse over.
    var replacemediv = "<div id='replaceme'>Hover over a word to see its definition.</div>";
	//$(".Board-module_board__gdu5I").css('margin','15px');
	$(".Board-module_board__gdu5I").css('margin-left','1000px');
	$(".Board-module_boardContainer__vObNY").prepend(replacemediv);
	//alert($(this).attr("data-flip-id"));
	$("#replaceme").css("margin-left","-980px");
	$("#replaceme").css("margin-right","660px");
	$("#replaceme").css("height","700px");
	$("#replaceme").css("overflow-y","scroll");
	$("#replaceme").css("overflow-x","hidden");
	$("#replaceme").css("white-space","break-spaces");

    $('.Card-module_label__U_Q2H').each(function() {
        selected.push($(this).attr("data-flip-id"));

    });


	$('.Card-module_label__U_Q2H').on( "mouseover", FindDefs($(this).attr("data-flip-id")));

    LoadDefs();


   //console.log(LoadedDefs);

}, false);



function LoadDefs(){
    var elementarray = document.getElementsByClassName('Card-module_label__U_Q2H');
    //const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(WordToFind);

    for (let x = 0; x< selected.length; x++) {

        let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(selected[x]);
        fetch(url)
            .then(res => res.json())
            .then(out => {
            //console.log('Checkout this JSON! ', out[0].word)
            const wordobj = new Object();
            wordobj.word = selected[x];
			wordobj.meanings = [];

            //wordobj.meanings = out[0].meanings
            if (out.title === "No Definitions Found") {
				const meaningobj = new Object();
				meaningobj.definitions = [];
				meaningobj.PartOfSpeech = "Unknown"
				meaningobj.definitions[0] = "No Definitions Found"
				wordobj.meanings[0] = meaningobj;


            } else {
                for (let q = 0; q< out[0].meanings.length; q++){
                    const meaningobj = new Object();
					meaningobj.definitions = [];
                    meaningobj.PartOfSpeech = out[0].meanings[q].partOfSpeech;
                    for (let y = 0; y< out[0].meanings[q].definitions.length; y++){
                        meaningobj.definitions[y] = out[0].meanings[q].definitions[y].definition;
                    }
					wordobj.meanings[q] = meaningobj;
                }
            }



            LoadedDefs.push(wordobj);
        })
            .catch(err => { throw err });



    }

    for (let i = 0; i < elementarray.length; i++) {

        elementarray[i].addEventListener(
            "mouseover",
            (event) => {
                FindDefs(elementarray[i].getAttribute('data-flip-id'));

            },
            false,
        );
    }

    return LoadedDefs;

}

function FindDefs(WordToFind){
    var resultval = LoadedDefs.filter(function (items) {
       return items.word === WordToFind;
    })
	var HTMLstring = "";

	if(WordToFind === undefined){
		HTMLstring ="<h2>Hover over a word to see its definition</h2>";
	} else {
		HTMLstring = "<h2>" + WordToFind + "</h2><br><br>";
		HTMLstring = HTMLstring + "<dl style='text-align: left;'>";

		for(let p = 0; p< resultval[0].meanings.length; p++){
			console.log(p);
			HTMLstring = HTMLstring + "<dt>" + resultval[0].meanings[p].PartOfSpeech + "</dt>";
			HTMLstring = HTMLstring + "<br>";
			for(let t = 0; t< resultval[0].meanings[p].definitions.length; t++){
				HTMLstring = HTMLstring + "<dd>" + resultval[0].meanings[p].definitions[t] + "</dd>";
			}
			HTMLstring = HTMLstring + "<br>";

		}



		HTMLstring = HTMLstring + "</dl>";
	}




    console.log(resultval);
    //console.log(resultval.word.meanings.definition[1]);

//console.log(LoadedDefs);
    setTimeout(() => {
  $('#replaceme').html(HTMLstring);
}, "250");



}

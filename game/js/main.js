// 2140238- Student name 1
// 2140001- Student name 2
// 2140002- Student name 3

// Implementation:

var main = function(){
  'use strict';

  $('#highlightButtons').find('button').click(function(event) {
    var value = $(this).val();
    highlightCells(value);
  });

  $('#btn-new').click(function(event) {
    onClickNewGame();
  });

  $('#btn-check').click(function(event) {
    onClickCheckGame();
  });

  $('.dad-cell input').dblclick(function(event) {
    selectCell($(this));
  });

  $('.dad-cell input').change(function(event) {
    checkVal($(this));
    reloadCss($(this));
  });

  $(".dad-row").click(function(event){
      var x = $(this).children();
      var delay = 50;
      for (var i = 0; i < x.length; i++) {
         
        $(x[i]).animate
        ({ backgroundColor: "#FFBF00" }, 500 + delay);

        var input = $(x[i]).children();

        if(!input.hasClass('initial')){
          input.animate
          ({ backgroundColor: "#FFBF00" }, 500 + delay);
        }
        

        setTimeout(function(cell) {
          $(cell).animate
          ({ backgroundColor: "white" }, 500 + delay);


          if(!$(cell).children().hasClass('initial')){
            $(cell).children().animate
            ({ backgroundColor: "white" }, 500 + delay);
          }

        }, 400, x[i]);

        delay += 100;
    };

  });

  loadGrill('easy');
  //animateCell();
};

function animateCell(){

var values = $('.dad-row');
      for (var i = values.length - 1; i >= 0; i--) {
        var input = $('.dad-board').find('[data-line="' + values[i].line);
      } 
};

function loadInitialCss () {
  $('.dad-cell input').each(function (index, value) { 
    var cellInput = $(this);
    cellInput.attr('min','1');
    cellInput.attr('max','9');
    if(cellInput.val() != ''){
      cellInput.addClass('initial');
    }else if (cellInput.val() === '') {
      cellInput.removeClass('initial');
    }
  });
};

function reloadCss (cellInput) {
  if(cellInput.val() != '' && !cellInput.hasClass('initial')){
    cellInput.addClass('with-value');
  }else if (cellInput.val() === '') {
    cellInput.attr('class','');
  }
};

function checkVal (cellInput) {
  if(Number(cellInput.val()) < Number(cellInput.attr('min')) || Number(cellInput.val()) > Number(cellInput.attr('max'))){
    cellInput.val('');
  }
};

function highlightCells (val) {
  $('.dad-cell input').each(function (index, value) { 
    //Remove all previously highlitghted nummbers
    var cellInput = $(this);
    cellInput.removeClass('highlight');
    
    if(cellInput.val() === val ){
      cellInput.toggleClass('highlight').delay(5000).queue('fx', function() { 
        cellInput.removeClass('highlight').dequeue(); 
      });
    }
  });
};

function selectCell (cellInput) {
  if(cellInput.val() != ''){
    cellInput.toggleClass('individual-highlight');
  }
};

function conflictCell(cellInput) {
  cellInput.removeClass('conflict');
  cellInput.toggleClass('conflict').delay(5000).queue('fx', function() { 
    cellInput.removeClass('conflict').dequeue(); 
  });
};

function onClickNewGame(){
  var dificulty = $('#select-mode').find(":selected").val();
  loadGrill(dificulty);
};

function onClickCheckGame() {
  checkConflict();
};

function checkConflict() {
  var jsonObj = getBoard();
  var strJSON = JSON.stringify(jsonObj);
  $.post({
    url: 'http://198.211.118.123:8080/board/check',
    type: 'POST',
    data: strJSON,
    dataType: "json",
    contentType: "application/json;",
  }).done(function(data){
    console.log(data);
    if(data.finished === false){
      var values = data.conflicts;
      for (var i = values.length - 1; i >= 0; i--) {
        var input = $('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
        conflictCell(input);
      }
    }else{
      endGame();
    }
  }).fail(function (errorThrown) {
   console.log(errorThrown);
 }).always(function () {
  //
});
};

function endGame () {
  // body... 
};

function cleanBoard(){
  var cellInput = $('.dad-cell input');
  cellInput.prop('disabled', false);
  cellInput.val('');
  cellInput.attr('class', '');
};

function getBoard(){
  var jsonObj = [];
  $('.dad-cell input').each( function (index, value){
    var element = $(this);
    if(element.val() != ''){
      item = {};
      item ["line"] = Number(element.attr("data-line"));
      item ["column"] = Number(element.attr("data-column"));
      item ["value"] = Number(element.val());
      item ["fixed"] = element.prop('disabled');
      jsonObj.push(item);
    }    
  });

  return jsonObj;
};

function loadGrill (dificulty) {
  cleanBoard();
  $('#loading').toggleClass('invisible');
  $.getJSON("http://198.211.118.123:8080/board/" + dificulty).done(function(data) {
   var values = data;
   for (var i = values.length - 1; i >= 0; i--) {
     var input = $('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
     input.val(values[i].value);
     input.prop('disabled', true);
   };
   loadInitialCss(); 
 }).fail(function (errorThrown) {
   console.log(errorThrown);
}).always(function(){
  $('#loading').toggleClass('invisible');
});
};



$(document).ready(main);


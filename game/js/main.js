// 2140000- Student name 1
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
    checkConflict();
  });

  load_grill('easy');

  $('.dad-cell input').dblclick(function(event) {
    $(this).toggleClass('individual-highlight');
  });

  $('.dad-cell input').change(function(event) {
    reload_css();
    });
  };

function load_css () {
  $('.dad-cell input').each(function (index, value) { 
    var cellInput = $(this);
    if(cellInput.val() != ''){
      cellInput.addClass('initial');
    }else if (cellInput.val() === '') {
      cellInput.removeClass('initial');
    }
  });
};

function reload_css () {
  $('.dad-cell input').each(function (index, value) { 
    var cellInput = $(this);
    if(cellInput.val() != '' && !cellInput.hasClass('initial')){
      cellInput.addClass('with-value');
    }else if (cellInput.val() === '') {
      cellInput.removeClass('with-value');
    }
  });
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

function conflictCell(cellInput) {
    cellInput.removeClass('conflict');
    cellInput.toggleClass('conflict').delay(5000).queue('fx', function() { 
        cellInput.removeClass('conflict').dequeue(); 
      });
};

function onClickNewGame(){
  var dificulty = $('#select-mode').find(":selected").val();
  load_grill(dificulty);
};

function onClickCheckGame() {
  checkConflict();
};

function checkConflict() {
var jsonObj = [];
$('.dad-cell input').each( function (index, value){
  var element = $(this);
    item = {};
    item ["line"] = element.attr("data-line");
    item ["column"] = element.attr("data-column");
    item ["value"] = element.val();
    item ["fixed"] = element.prop('disabled');
    jsonObj.push(item);
});
var strJSON = JSON.stringify(jsonObj);
console.log(strJSON);
  $.ajax({
    url: 'http://198.211.118.123:8080/board/check',
    type: 'POST',
    data: strJSON,
    contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
         var values = data;
         for (var i = values.length - 1; i >= 0; i--) {
           var input = $('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
          conflictCell(input);
         }; 
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
};

function cleanBoard(){
  var cellInput = $('.dad-cell input');
  cellInput.prop('disabled', false);
  cellInput.val('');
  cellInput.attr('class', '');
};


function load_grill (dificulty) {
cleanBoard();
  $('#loading').toggleClass('invisible');
 $.ajax({url: "http://198.211.118.123:8080/board/" + dificulty}).done(function(data) {
   var values = data;
   for (var i = values.length - 1; i >= 0; i--) {
     var input = $('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
     input.val(values[i].value);
     input.prop('disabled', true);
   };
    load_css();
    $('#loading').toggleClass('invisible');
 });
};


$(document).ready(main);


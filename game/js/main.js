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

  $('.dad-cell input').keyup(function(event) {
    var $inputCell = $(this);
    checkVal($inputCell);
    reloadCss($inputCell);
    
    checkColumn($inputCell);
    checkLine($inputCell);
    checkQuadrant($inputCell);
  });

  loadGrill('easy');
};

function animateCell(){

  var values = $('.dad-row');
  for (var i = values.length - 1; i >= 0; i--) {
    var input = $('.dad-board').find('[data-line="' + values[i].line);
  } 
};

function loadInitialCss () {
  $('.dad-cell input').each(function (index, value) { 
    var $cellInput = $(this);
    $cellInput.attr('min','1');
    $cellInput.attr('max','9');
    if($cellInput.val() != ''){
      $cellInput.addClass('initial');
    }else if ($cellInput.val() === '') {
      $cellInput.removeClass('initial');
    }
  });
};

function reloadCss ($cellInput) {
  if($cellInput.val() != '' && !$cellInput.hasClass('initial')){
    $cellInput.addClass('with-value');
  }else if ($cellInput.val() === '') {
    $cellInput.attr('class','');
  }
};

function checkVal ($cellInput) {
  if(Number($cellInput.val()) < Number($cellInput.attr('min')) || Number($cellInput.val()) > Number($cellInput.attr('max'))){
    $cellInput.val('');
  }
};

function highlightCells (val) {
  $('.dad-cell input').each(function (index, value) { 
    //Remove all previously highlitghted nummbers
    var $cellInput = $(this);
    $cellInput.removeClass('highlight');
    
    if($cellInput.val() === val ){
      $cellInput.toggleClass('highlight').delay(5000).queue('fx', function() { 
        $cellInput.removeClass('highlight').dequeue(); 
      });
    }
  });
};

function selectCell ($cellInput) {
  if($cellInput.val() != ''){
    $cellInput.toggleClass('individual-highlight');
  }
};

function conflictCell($cellInput) {
 $cellInput.removeClass('conflict');
 $cellInput.toggleClass('conflict').delay(5000).queue('fx', function() { 
  $cellInput.removeClass('conflict').dequeue(); 
});
};

function onClickNewGame(){
  var dificulty = $('#select-mode').find(":selected").val();
  loadGrill(dificulty);
};

function onClickCheckGame() {
  
  var conflicts = checkConflict();
  //if checkConflict didnt get any error or the game has ended
  if(conflicts != null){
  //there is conflict
  if(conflicts.length > 0){  
   loadConflictCss(conflicts);
 }
}

};

function loadConflictCss(conflicts){  
  for (var i = conflicts.length - 1; i >= 0; i--) {
    var $input = $('.dad-board').find('[data-line="' + conflicts[i].line + '"][data-column="' + conflicts[i].column + '"]');
    conflictCell($input);
  }
}

function checkConflict() {
  var jsonObj = getBoard();
  var strJSON = JSON.stringify(jsonObj);
  var result = null;
  $.post({
    url: 'http://198.211.118.123:8080/board/check',
    type: 'POST',
    data: strJSON,
    async: false,
    dataType: "json",
    contentType: "application/json;",
  }).done(function(data){
    if(data.finished === false){
      result = data;
    }else{
      endGame();
    }
  }).fail(function (errorThrown) {
   console.log(errorThrown);
 }).always(function () {
  
 });
 return (result === null? null : result.conflicts);
};

function endGame () {
  // body... 
};

function checkLine ($cellInput) {
 var line = $cellInput.attr('data-line');
 var count = 0;
 $cells = $('.dad-board').find('[data-line="' + line + '"]');
 $cells.each(function(index, el) {
  //if one input of the line is empty , increase counter
  if($(this).val() == ''){
    count++;
  }
});
 if(count == 0){
   var conflicts = checkConflict();
 //if checkConflict didnt get any error or the game has ended
 if(conflicts != null){
  //there is no error conflict
  if(conflicts.length === 0){  
      //0 conflicts
     //do animation to line
     animateCellsInput($cells);
   }
 }
}
};

function checkColumn ($cellInput) {
  var column = $cellInput.attr('data-column');
  var count = 0;
  $cells = $('.dad-board').find('[data-column="' + column + '"]');
  $cells.each(function(index, el) {
  //if one input of the column is empty , increase counter
  if($(this).val() == ''){
    count++;
  }
});
  if(count == 0){
   var conflicts = checkConflict();
 //if checkConflict didnt get any error or the game has ended
 if(conflicts != null){
  //there is no error conflict
  if(conflicts.length === 0){  
      //0 conflicts
     //do animation to column
     animateCellsInput($cells);
   }
 }
}
};

function checkQuadrant ($cellInput) {
  var quadrant = $cellInput.attr('data-quadrant');
  var count = 0;
  $cells = $('.dad-board').find('[data-quadrant="' + quadrant + '"]');
  $cells.each(function(index, el) {
  //if one input of the quadrant is empty , increase counter
  if($(this).val() == ''){
    count++;
  }
});
  if(count == 0){
   var conflicts = checkConflict();
 //if checkConflict didnt get any error or the game has ended
 if(conflicts != null){
  //there is no error conflict
  if(conflicts.length === 0){  
      //0 conflicts
     //do animation to quadrant
     animateCellsInput($cells);
   }
 }
}
};

function animateCellsInput ($cellsInput) {
  var delay = 50;
  $cellsInput.each(function(index, el) {

    var $input = $(this);
    var $dad_cell = $input.parent('.dad-cell');
    
    $dad_cell.animate({ backgroundColor: "#FFBF00" }, 300 + delay);
    if(!$input.hasClass('initial')){
      $input.animate({ backgroundColor: "#FFBF00" }, 300 + delay);
    }
    setTimeout(function($cell) {
      $cell.animate({ backgroundColor: "white" }, 300 + delay);
      if(!$cell.children().hasClass('initial')){
        $cell.children().animate({backgroundColor: "white" }, 300 + delay);
      }
    }, 200, $dad_cell);
    delay += 50;
  });
};

function cleanBoard(){
  var $cellInput = $('.dad-cell input');
  $cellInput.prop('disabled', false);
  $cellInput.val('');
  $cellInput.attr('class', '');
};

function getBoard(){
  var jsonObj = [];
  $('.dad-cell input').each( function (index, value){
    var $element = $(this);
    if($element.val() != ''){
      item = {};
      item ["line"] = Number($element.attr("data-line"));
      item ["column"] = Number($element.attr("data-column"));
      item ["value"] = Number($element.val());
      item ["fixed"] = $element.prop('disabled');
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
     var $input = $('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
     $input.val(values[i].value);
     $input.prop('disabled', true);
   };
   loadInitialCss(); 
 }).fail(function (errorThrown) {
   console.log(errorThrown);
 }).always(function(){
  $('#loading').toggleClass('invisible');
});
};

function quadrantLoader(){

};



$(document).ready(main);


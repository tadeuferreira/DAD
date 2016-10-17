// 2140238- Student name 1
// 2140001- Student name 2
// 2140002- Student name 3

// Implementation:



var main = function(){
  'use strict';
  var timeNow = 0;
  atrQuadrant();
  loadProjectAuthors();

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
    var $inputCell = $(this);
    checkVal($inputCell);
    reloadCss($inputCell);
    
    checkPartialCompletion($inputCell,'column');
    checkPartialCompletion($inputCell,'line');
    checkPartialCompletion($inputCell,'quadrant');
    checkFullCompletion();
  });
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
    if($cellInput.val() === val ){
      $cellInput.toggleClass('highlight').delay(5000).queue('fx', function() { 
        $cellInput.removeClass('highlight').dequeue(); 
      });
    }else{
     $cellInput.removeClass('highlight');  
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
  timeNow = new Date();
};

function onClickCheckGame() {
  checkConflict(null);
};

function loadConflictCss(conflicts){  
  for (var i = conflicts.length - 1; i >= 0; i--) {
    var $input = $('.dad-board').find('[data-line="' + conflicts[i].line + '"][data-column="' + conflicts[i].column + '"]');
    conflictCell($input);
  }
};

function checkConflict($cells) {
  var jsonObj = getBoard();
  var strJSON = JSON.stringify(jsonObj);
  $.post({
    url: 'http://198.211.118.123:8080/board/check',
    type: 'POST',
    data: strJSON,
    dataType: "json",
    contentType: "application/json;",
  }).done(function(data){
    if(data.finished == false){
     if(data.conflicts.length > 0){
       loadConflictCss(data.conflicts);
     }else{
       if($cells != null){
        animateCellsInput($cells);
      }
    }
  }else{
    endGame();
  }
}).fail(function (errorThrown) {
 console.log(errorThrown);
}).always(function () {
});
};

function endGame () {
  $('.dad-cell input.with-value').each(function () {
    $(this).toggleClass("finished");
  });
  
  var timeEnd = (new Date().getTime()) - timeNow.getTime();
  var formatted = secondsTimeSpanToHMS(timeEnd/1000);

  $("#message").text("Game Won, congratulations!!");
  $("#time").text("Time: " + formatted);
  $( "#dialog" ).dialog();
};

function checkPartialCompletion($cellInput,type) {
 var val = $cellInput.attr('data-'+type);
 var count = 0;
 $cells = $('.dad-board').find('[data-'+type+'="' + val + '"]');
 $cells.each(function(index, el) {
  //if one input is empty , increase counter
  if($(this).val() == ''){
    count++;
  }
});
 if(count == 0){
   checkConflict($cells);
 }
};

function checkFullCompletion(){
  var count = 0;
  $('.dad-cell input').each(function(index, el) {
    if($(this).val() == ''){
      count++;
    }
  });
  //check if the game have no empty cells
  if(count == 0){
    //calls the check conflict function   
    checkConflict(null);
  }
};

function animateCellsInput ($cellsInput) {
  var defaultDelay = 500;
  var delay = 100;
  $cellsInput.each(function(index, el) {
    var $input = $(this);
    var $dad_cell = $input.parent('.dad-cell');  

    $dad_cell
    .delay(delay*(index+1))
    .animate({ backgroundColor: "#FFAF00" },defaultDelay)
    .delay(delay)
    .animate({backgroundColor: "white" },defaultDelay);

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
    if($element.val()){
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

function atrQuadrant(){
  $('.dad-cell input').each( function (index, value){
    var line = $(this).attr("data-line");
    var column = $(this).attr("data-column");
    if(line >= 0 && line < 3 && column >= 0 && column < 3){
      $(this).attr("data-quadrant","1");
    }else if(line >= 0 && line < 3 && column >= 3 && column < 6){
      $(this).attr("data-quadrant","2");   
    }else if(line >= 0 && line < 3 && column >= 6 && column < 9){
      $(this).attr("data-quadrant","3");  
    }else if(line >= 3 && line < 6 && column >= 0 && column < 3){
      $(this).attr("data-quadrant","4");
    }else if(line >= 3 && line < 6 && column >= 3 && column < 6){
      $(this).attr("data-quadrant","5");
    }else if(line >= 3 && line < 6 && column >= 6 && column < 9){
      $(this).attr("data-quadrant","6");
    }else if(line >= 6 && line < 9 && column >= 0 && column < 3){
      $(this).attr("data-quadrant","7");
    }else if(line >= 6 && line < 9 && column >= 3 && column < 6){
      $(this).attr("data-quadrant","8");
    }else if(line >= 6 && line < 9 && column >= 6 && column < 9){
      $(this).attr("data-quadrant","9");
    }
  });
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

function secondsTimeSpanToHMS(s) {
  s = Math.trunc(s);
  var h = Math.floor(s/3600); //Get whole hours
  s -= h*3600;
  var m = Math.floor(s/60); //Get remaining minutes
  s -= m*60;
  return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
};

function loadProjectAuthors() {
  $author = $('.thumbnail');

  $author.last().addClass('invisible');

  $author.eq(0).find('h3').text('2140238');
  $author.eq(0).find('p').text('Luiz Tadeu');
  $author.eq(0).find('img').attr('src','img/f1.jpg').attr('height',400).attr('width',400);


  $author.eq(1).find('h3').text('2110094');
  $author.eq(1).find('p').text('Bruno Henriques');
  $author.eq(1).find('img').attr('src','img/f2.jpg').attr('height',400).attr('width',400);


  $author.eq(2).find('h3').text('2140666');
  $author.eq(2).find('p').text('Luiz Daniel');
  $author.eq(2).find('img').attr('src','img/f3.jpg').attr('height',400).attr('width',400);
};

$(document).ready(main);
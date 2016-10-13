// 2140238- Student name 1
// 2140001- Student name 2
// 2140002- Student name 3

// Implementation:



var main = function(){
  'use strict';
  var timer = 0;
  window.timer = timer;

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
  $.post({
    url: 'http://198.211.118.123:8080/board/check',
    type: 'POST',
    data: strJSON,
    dataType: "json",
    contentType: "application/json;",
  }).done(function(data){
    if(data.finished == false){
      loadConflictCss(data.conflicts);
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
  $("#message").text("Game Won, congratulations!!");
  $("#time").text("Time: " + secondsTimeSpanToHMS(window.timer/1000));
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
   animateCellsInput($cells);
 }
};

function checkFullCompletion(){
  var count = 0;
  $('.dad-cell input').each(function(index, el) {
    if($(this).val() == ''){
      count++;
    }
  });
  if(count == 0){
    //check if the game have no conflicts
    checkConflict();
  }
};

function animateCellsInput ($cellsInput) {
  var delay = 50;
  $cellsInput.each(function(index, el) {
    var $input = $(this);
    var $dad_cell = $input.parent('.dad-cell');    
    $dad_cell.animate({ backgroundColor: "#FFBF00" }, 500 + delay);

    if(!$input.hasClass('initial') && !$input.hasClass('with-value')){
      $input.animate({ backgroundColor: "#FFBF00" }, 500 + delay);
    }
    setTimeout(function($cell) {
      $cell.animate({ backgroundColor: "white" }, 500 + delay);
      if(!$cell.children().hasClass('initial') && !$cell.children().hasClass('with-value')){
        $cell.children().animate({backgroundColor: "white" }, 500 + delay);
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
    
  }

  else if(line >= 3 && line < 6 && column >= 0 && column < 3){
   $(this).attr("data-quadrant","4");

 }else if(line >= 3 && line < 6 && column >= 3 && column < 6){
  $(this).attr("data-quadrant","5");


}else if(line >= 3 && line < 6 && column >= 6 && column < 9){
  $(this).attr("data-quadrant","6");
}

else if(line >= 6 && line < 9 && column >= 0 && column < 3){
 $(this).attr("data-quadrant","7");

}else if(line >= 6 && line < 9 && column >= 3 && column < 6){
  $(this).attr("data-quadrant","8");


}else if(line >= 6 && line < 9 && column >= 6 && column < 9){
  $(this).attr("data-quadrant","9");
}
});
}

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
   
   atrQuadrant();
   loadInitialCss(); 
   
   setTimeout(function(){
    window.timer++;
  }, 1);

 }).fail(function (errorThrown) {
   console.log(errorThrown);
 }).always(function(){
  $('#loading').toggleClass('invisible');
});
};

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
  }



  $(document).ready(main);


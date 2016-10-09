// 2140000- Student name 1
// 2140001- Student name 2
// 2140002- Student name 3

// Implementation:

var main = function(){


 $('#highlightButtons').children().click(function(event) {
  var value = $(this).val();
  highlightCells(value);
  console.log('avavsas')
});

 $('#btn-new').click(function(event) {
  onClickNewGame();
 });

 $('#btn-check').click(function(event) {
   onClickCheckGame();
 });

 //setup initial game
 onClickNewGame();

  $('.dad-cell input').change(function(event) {
    //reload the css for inputed values
    reload_css();
  });

  $('.dad-cell input').dblclick(function(event) {
    $(this).toggleClass('individual-highlight');
  });

};

function load_initial_css () {
  $('.dad-cell input').each(function (index, value) { 
    if($(this).val() != ''){
      $(this).addClass('initial');
    }else if ($(this).val() === '') {
      $(this).removeClass('initial')
    }
  });
};

function reload_css () {
  $('.dad-cell input').each(function (index, value) { 
    
    if($(this).val() != '' && !$(this).hasClass('initial')){
      $(this).addClass('with-value');
    }else if ($(this).val() === '') {
      $(this).removeClass('with-value')
    }
  });
};

function highlightCells (val) {
  $('.dad-cell input').each(function (index, value) { 
    //Remove all previously highlitghted nummbers
    $(this).removeClass('highlight');
    
    if($(this).val() === val ){
      $(this).toggleClass('highlight');
    }

  });
};

function conflictCell(val) {
  $('.dad-cell input').parent().each(function(index) {
    $(this).removeClass('conflict')

    if($(this).val() === val){
      $(this).toggleClass('conflict');
    }
  });
}

function onClickNewGame(){
  var dificulty = $('#select-mode').find(":selected").val();
  load_grill(dificulty);

}

function onClickCheckGame() {
  

}

function checkConflict() {
  $.ajax({url: "http://198.211.118.123:8080/board/"}).then(function(data) {
   var values = data;
   for (var i = values.length - 1; i >= 0; i--) {
     var input = $('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
     input.val(values[i].value);
     input.prop('disabled', true);
   };
}

function cleanBoard(){
  var cellInput = $('.dad-cell input');
  cellInput.prop('disabled', false);
  cellInput.val('');
  cellInput.removeClass('individual-highlight');
}

function load_grill (dificulty) {
cleanBoard();
  $('#loading').toggleClass('invisible');

 $.ajax({url: "http://198.211.118.123:8080/board/" + dificulty}).then(function(data) {
   var values = data;
   for (var i = values.length - 1; i >= 0; i--) {
     var input = $('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
     input.val(values[i].value);
     input.prop('disabled', true);
   };
    load_initial_css();
    $('#loading').toggleClass('invisible');
 });
};

$(document).ready(main);


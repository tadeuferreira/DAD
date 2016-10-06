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


 // var btnCheck = getElementById('#btn-check');
//var btnNew = getElementById('#btn-new');
 // var selectMode = getElementById('#select-mode');

 
 load_grill('easy');

};


function load_css () {
  $('.dad-cell input').each(function (index, value) { 
    if($(this).val() != ''){
      $(this).addClass('initial');
    }else if ($(this).val() == '') {
      $(this).removeClass('initial')
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

function onClickNewGame(){
  var dificulty = $('#select-mode').find(":selected").val();
  load_grill(dificulty);

}

function cleanBoard(){
  $('.dad-cell input').prop('disabled', false);
  $('.dad-cell input').val('');
}

function load_grill (dificulty) {
cleanBoard();
  $('#loading').toggleClass('invisible');

 $.ajax({url: "http://198.211.118.123:8080/board/" + dificulty}).then(function(data) {
   var values = data;
   for (var i = values.length - 1; i >= 0; i--) {
     var input=$('.dad-board').find('[data-line="' + values[i].line + '"][data-column="' + values[i].column + '"]');
     $(input).val(values[i].value);
     $(input).prop('disabled', true);
   };
    load_css();
    $('#loading').toggleClass('invisible');
 });
};

$(document).ready(main);


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


 // var btnCheck = getElementById('#btn-check');
//var btnNew = getElementById('#btn-new');
 // var selectMode = getElementById('#select-mode');

 load_css();
 load_grill();
};


function load_css () {
  $('.dad-cell input').each(function (index, value) { 

    if($(this).val() != null && !$(this).hasClass('initial')){
      $(this).addClass('with-value');
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

function load_grill () {

 $.ajax({url: "http://198.211.118.123:8080/board/easy"}).then(function(data) {
   myvar = data;
   console.log(myvar)
       //for(var i = 0; i<$('.dad-row').length; i++){
        $( ".dad-row" ).each(function() {
          var row = this;
          for (var j = 0; j< row.children.length; j++) {
            
            //var cell = row.children[j];
            //var input = cell.children[0];       
            $('.dad-cell input').val(1);
          //row.children.each(function() {
          //});

        }
      });
      });
};

$(document).ready(main);


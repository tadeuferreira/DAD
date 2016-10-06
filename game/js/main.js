// 2140000- Student name 1
// 2140001- Student name 2
// 2140002- Student name 3

// Implementation:

var main = function(){

  load_css();
  load_grill();
};


function load_css () {
  // body... 
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


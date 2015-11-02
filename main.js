/**
 * Created by Stefanie on 10/29/2015.
 */

/* Pre-made calculator.js hook-in code

 function displayValue(type, value, item) {

 $('#number-readout').text(value);

 }

 var my_calculator = new calculator(displayValue);

 $(document).ready(function () {

 $('.button-wrapper').on('click', 'button', function () {

 var val = $(this).text();
 my_calculator.addItem(val);

 })

 });*/

//OOP Calculator First-attempt

var calculationInput = [];

var calculations = function (value) {

    this.value = value;

    this.inputValue = function (value) {
      calculationInput.push(value);
    };

    this.calcDisplay = function (value) {
        $('#number-readout').text(value);
    };

};

var calculator = new calculations();

$(document).ready(function () {

    $('.button-wrapper').on('click', 'button', function () {

        console.log('clicked');
        var val = $(this).text();
        calculator.calcDisplay(val);
        calculator.inputValue(val);
        console.log(calculationInput);

    });

});
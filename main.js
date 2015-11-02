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

var calculations = function (value) {
    var calculationInput = [];

    this.value = value;

    this.inputValue = function (value) {

        switch (value) {
            case 'C':
                calculationInput = [];
                $('#number-readout').text('');
                break;

            case 'CE':
                calculationInput.pop();
                this.calcDisplay(calculationInput[calculationInput.length - 1]);
                break;

            case '=':
                if (calculationInput.length == 3) {
                    var output = this.processInputs();
                    this.calcDisplay(output);
                    calculationInput = [];
                }

                else {
                    this.calcDisplay('Not Ready');
                }
                break;

            case '+':
            case '-':
            case '*':
            case '/':
                calculationInput.push(value);
                break;

            default:
                calculationInput.push(value);
                this.calcDisplay(value);
                console.log(calculationInput);
                break;
        }

    };

    this.calcDisplay = function (value) {

        $('#number-readout').text(value);

    };

    this.processInputs = function () {

        var output = null;

        switch (calculationInput[1]) {
            case '+':
                output = parseFloat(calculationInput[0]) + parseFloat(calculationInput[2]);
                break;

            case '-':
                output = parseFloat(calculationInput[0]) - parseFloat(calculationInput[2]);
                break;

            case '*':
                output = parseFloat(calculationInput[0]) + parseFloat(calculationInput[2]);
                break;

            default:
                output = parseFloat(calculationInput[0]) / parseFloat(calculationInput[2]);
        }
        return output

    };

};

var calculator = new calculations();

$(document).ready(function () {

    $('.button-wrapper').on('click', 'button', function () {

        var val = $(this).text();
        calculator.inputValue(val);

    });

});
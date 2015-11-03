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

    this.canAddDecimal = true;

    this.inputValue = function (value) {

        var newInput = {
            value: '',
            type: '',
            hasDecimal: false
        };

        switch (value) {
            case 'C':
                calculationInput = [];
                $('#number-readout').text('');
                break;

            case 'CE':
                calculationInput.pop();
                this.calcDisplay(calculationInput[calculationInput.length - 1].value);
                break;

            case '=':
                switch (calculationInput.length) {
                    case 1:
                        this.calcDisplay(calculationInput[calculationInput.length-1].value);
                        calculationInput = [];
                        break;

                    case 3:
                        var output = this.processInputs();
                        if (!isFinite(output)) {
                            output = 'Error';
                        }
                        this.calcDisplay(output);
                        break;

                    default:
                        this.calcDisplay('Error');
                        break;
                }
                break;

            case '+':
            case '-':
            case '*':
            case '/':
                if (calculationInput.length >= 1) {
                    if (calculationInput[calculationInput.length - 1].type == 'operator') {
                        calculationInput[calculationInput.length - 1].value = value;
                    }

                    else {
                        newInput.value = value;
                        newInput.type = 'operator';
                        calculationInput.push(newInput);
                    }
                    this.calcDisplay(calculationInput[calculationInput.length - 1].value);
                    console.log(calculationInput);
                }
                else {
                    return
                }
                break;

            case '.':
                if (calculationInput.length >= 1 && !calculationInput[calculationInput.length - 1].hasDecimal) {
                    if (calculationInput.length >= 1 && calculationInput[calculationInput.length - 1].type == 'number') {
                        calculationInput[calculationInput.length - 1].value += value;
                        calculationInput[calculationInput.length - 1].hasDecimal = true;
                    }
                }

                else {
                    return
                }
                this.calcDisplay(calculationInput[calculationInput.length - 1].value);
                console.log(calculationInput);
                break;

            default:
                if (calculationInput.length >= 1 && calculationInput[calculationInput.length - 1].type == 'number') {
                    calculationInput[calculationInput.length - 1].value += value;
                }

                else {
                    newInput.value = value;
                    newInput.type = 'number';
                    calculationInput.push(newInput);
                }

                this.calcDisplay(calculationInput[calculationInput.length - 1].value);
                console.log(calculationInput);
                break;
        }

    };

    //Shows current value in number readout
    this.calcDisplay = function (value) {

        $('#number-readout').text(value);

    };

    //Performs calculations
    this.processInputs = function () {

        var output = null;

        switch (calculationInput[1].value) {
            case '+':
                output = parseFloat(calculationInput[0].value) + parseFloat(calculationInput[2].value);
                break;

            case '-':
                output = parseFloat(calculationInput[0].value) - parseFloat(calculationInput[2].value);
                break;

            case '*':
                output = parseFloat(calculationInput[0].value) * parseFloat(calculationInput[2].value);
                break;

            default:
                output = parseFloat(calculationInput[0].value) / parseFloat(calculationInput[2].value);
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
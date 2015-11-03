/**
 * Created by Stefanie on 10/29/2015.
 */

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
                        this.calcDisplay(calculationInput[calculationInput.length - 1].value);
                        calculationInput = [];
                        break;

                    case 0:
                    case 2:
                        this.calcDisplay('Error');
                        break;

                    case 3:
                        var output = this.processInputs();
                        if (!isFinite(output)) {
                            output = 'Error';
                        }

                        else {
                            calculationInput[0].value = output;
                        }
                        this.calcDisplay(output);
                        break;

                    default:
                        var output = this.multiInput();
                        this.calcDisplay(output);
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

    this.multiInput = function () {

        while (calculationInput.length >= 3) {
            var firstCalc = this.processInputs();
            calculationInput[0].value = firstCalc;
            calculationInput.splice(1, 2);
        }

        return calculationInput[0].value;

    }

};

var calculator = new calculations();

$(document).ready(function () {

    $('.button-wrapper').on('click', 'button', function () {

        var val = $(this).text();
        calculator.inputValue(val);

    });

});
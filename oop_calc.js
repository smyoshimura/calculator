//Calculator Supervisor
var Supervisor = function (input) {
    var self = this;

    self.calculationInputs = [];

    self.input = input;

    self.inputSort = function (input) {

        var newInput = new Input(input, '', false);

        switch (input) {
            case 'C':
                self.calculationInputs = [];
                $('#number-readout').text('');
                break;

            case 'CE':
                self.calculationInputs.pop();
                self.calcDisplay(self.calculationInputs[self.calculationInputs.length - 1].value);
                break;

            case '=':
                switch (self.calculationInputs.length) {
                    case 1:
                        self.calcDisplay(self.calculationInputs[self.calculationInputs.length - 1].value);
                        self.calculationInputs = [];
                        break;

                    case 0:
                    case 2:
                        self.calcDisplay('Error');
                        break;

                    case 3:
                        var output = calcAccountant.multiInput();
                        if (!isFinite(output)) {
                            output = 'Error';
                        }

                        else {
                            self.calculationInputs[0].value = output;
                        }

                        self.calcDisplay(output);
                        break;

                    default:
                        var output = calcAccountant.multiInput();
                        self.calcDisplay(output);
                        break;
                }
                break;

            case '+':
            case '-':
            case '*':
            case '/':
                if (self.calculationInputs.length >= 1) {
                    if (self.calculationInputs[self.calculationInputs.length - 1].type == 'operator') {
                        self.calculationInputs[self.calculationInputs.length - 1].value = input;
                    }

                    else {
                        newInput.type = 'operator';
                        self.calculationInputs.push(newInput);
                    }

                    self.calcDisplay(self.calculationInputs[self.calculationInputs.length - 1].value);
                    console.log(self.calculationInputs);
                }

                else {
                    return
                }
                break;

            case '.':
                if (self.calculationInputs.length >= 1 && !self.calculationInputs[self.calculationInputs.length - 1].hasDecimal) {
                    if (self.calculationInputs.length >= 1 && self.calculationInputs[self.calculationInputs.length - 1].type == 'number') {
                        self.calculationInputs[self.calculationInputs.length - 1].value += input;
                        self.calculationInputs[self.calculationInputs.length - 1].hasDecimal = true;
                    }
                }

                else {
                    return
                }
                self.calcDisplay(self.calculationInputs[self.calculationInputs.length - 1].value);
                console.log(self.calculationInputs);
                break;

            default:
                if (self.calculationInputs.length >= 1 && self.calculationInputs[self.calculationInputs.length - 1].type == 'number') {
                    self.calculationInputs[self.calculationInputs.length - 1].value += input;
                }

                else {
                    newInput.type = 'number';
                    self.calculationInputs.push(newInput);
                }

                self.calcDisplay(self.calculationInputs[self.calculationInputs.length - 1].value);
                console.log(self.calculationInputs);
                break;
        }
    };

    self.calcDisplay = function (input) {

        $('#number-readout').text(input);

    };
};

//Calculator Accountant
var Accountant = function () {
    this.processInputs = function () {

        var output = null;

        switch (calcSupervisor.calculationInputs[1].value) {
            case '+':
                output = parseFloat(calcSupervisor.calculationInputs[0].value) + parseFloat(calcSupervisor.calculationInputs[2].value);
                break;

            case '-':
                output = parseFloat(calcSupervisor.calculationInputs[0].value) - parseFloat(calcSupervisor.calculationInputs[2].value);
                break;

            case '*':
                output = parseFloat(calcSupervisor.calculationInputs[0].value) * parseFloat(calcSupervisor.calculationInputs[2].value);
                break;

            default:
                output = parseFloat(calcSupervisor.calculationInputs[0].value) / parseFloat(calcSupervisor.calculationInputs[2].value);
        }

        return output
    };

    this.multiInput = function () {

        while (calcSupervisor.calculationInputs.length >= 3) {
            calcSupervisor.calculationInputs[0].value = this.processInputs();
            calcSupervisor.calculationInputs.splice(1, 2);
        }

        return calcSupervisor.calculationInputs[0].value;
    }
};

//Inputs
var Input = function (value, type, hasDecimal) {
    this.value = value;
    this.type = type;
    this.hasDecimal = hasDecimal;
};

//Calling constructors
var calcSupervisor = new Supervisor();
var calcAccountant = new Accountant();

//Document Ready
$(document).ready(function () {

    //Handler for clicking on the buttons
    $('.button-wrapper').on('click', 'button', function () {

        var val = $(this).text();
        calcSupervisor.inputSort(val);

    });

    //Handler for using number keys and numpad
    $(document).keypress(function(e){
        if (e.which == 13) {
            calcSupervisor.inputSort('=');
        }

        else {
            var actualKeyPress = String.fromCharCode(e.which);
            calcSupervisor.inputSort(actualKeyPress);
        }
    });
});
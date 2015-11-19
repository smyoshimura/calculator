//Calculator Supervisor - delegates and tracks inputs
var Supervisor = function (input) {
    var self = this;

    //Array for holding all inputs waiting for calculation
    self.calculationInputs = [];

    self.input = input;

    self.inputSort = function (input, accountant) {

        var newInput = new Input(input, '', false);

        //Determines behavior depending on input including clearing, operators, and numerals
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
                //Determines behavior depending on number of inputs when '=' is entered
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
                        var output = accountant.multiInput(self);
                        if (!isFinite(output)) {
                            output = 'Error';
                        }

                        else {
                            self.calculationInputs[0].value = output;
                        }

                        self.calcDisplay(output);
                        break;

                    default:
                        var output = accountant.multiInput(self);
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
                break;
        }
    };

    //Displays relevant input in the readout section in the DOM
    self.calcDisplay = function (input) {

        $('#number-readout').text(input);
    };
};

//Calculator Accountant - handles all actual calculations
var Accountant = function () {
    var self = this;

    //Main calculation function
    self.processInputs = function (supervisor) {

        var output = null;

        switch (supervisor.calculationInputs[1].value) {
            case '+':
                output = parseFloat(supervisor.calculationInputs[0].value) + parseFloat(supervisor.calculationInputs[2].value);
                break;

            case '-':
                output = parseFloat(supervisor.calculationInputs[0].value) - parseFloat(supervisor.calculationInputs[2].value);
                break;

            case '*':
                output = parseFloat(supervisor.calculationInputs[0].value) * parseFloat(supervisor.calculationInputs[2].value);
                break;

            default:
                output = parseFloat(supervisor.calculationInputs[0].value) / parseFloat(supervisor.calculationInputs[2].value);
        }

        return output
    };

    //Rearranges array when there are more than three inputs in a row
    self.multiInput = function (supervisor) {

        while (supervisor.calculationInputs.length >= 3) {
            supervisor.calculationInputs[0].value = self.processInputs(supervisor);
            supervisor.calculationInputs.splice(1, 2);
        }

        return supervisor.calculationInputs[0].value;
    }
};

//Inputs - holds needed values for each input
var Input = function (value, type, hasDecimal) {
    this.value = value;
    this.type = type;
    this.hasDecimal = hasDecimal;
};

//Document Ready
$(document).ready(function () {
    //Calling constructors
    var calcSupervisor = new Supervisor();
    var calcAccountant = new Accountant();

    //Handler for clicking on the buttons
    $('.button-wrapper').on('click', 'button', function () {

        var val = $(this).text();

        calcSupervisor.inputSort(val, calcAccountant);
    });

    //Handler for using number keys and numpad
    $(document).keypress(function (e) {
        //Check for enter key presses
        if (e.which == 13) {
            calcSupervisor.inputSort('=', calcAccountant);
        }

        else {
            var actualKeyPress = String.fromCharCode(e.which);
            calcSupervisor.inputSort(actualKeyPress, calcAccountant);
        }
    });
});
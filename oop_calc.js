//Calculator Supervisor - delegates and tracks inputs
var Supervisor = function (input) {
    var self = this;

    self.currentDisplay = '';

    //Array for holding all inputs waiting for calculation
    self.calculationInputs = [];

    self.input = input;

    self.inputSort = function (input, accountant) {

        var newInput = new Input(input, '', false, false);

        //Determines behavior depending on input including clearing, operators, and numerals
        switch (input) {
            case 'C':
                self.calculationInputs = [];
                self.currentDisplay = '';
                self.calcDisplay();
                break;

            case 'CE':
                self.currentDisplay = self.currentDisplay.slice(0, self.currentDisplay.length - 1);
                self.calculationInputs.pop();
                self.calcDisplay();
                break;

            case '=':
                //Determines behavior depending on number of inputs when '=' is entered
                switch (self.calculationInputs.length) {
                    case 1:
                        self.calcDisplay();
                        self.currentDisplay = '';
                        self.calculationInputs = [];
                        break;

                    case 0:
                    case 2:
                        self.calcDisplay();
                        break;

                    case 3:
                        var output = accountant.processOrderOps(self);
                        if (!isFinite(output)) {
                            self.currentDisplay = 'Error';
                        }

                        else {
                            self.calculationInputs[0].value = output;
                            self.currentDisplay = output;
                        }

                        self.calcDisplay();
                        break;

                    default:
                        var output = accountant.processOrderOps(self);
                        self.currentDisplay = output;
                        self.calcDisplay();
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
                        self.currentDisplay[self.currentDisplay.length - 1] = input;
                    }

                    else {
                        newInput.type = 'operator';
                        self.calculationInputs.push(newInput);
                        self.currentDisplay += input;
                    }

                    if (input == '*' || input == '/') {
                        self.calculationInputs[self.calculationInputs.length - 1].hasPrecedence = true;
                        self.calculationInputs[self.calculationInputs.length - 2].hasPrecedence = true;
                    }

                    self.calcDisplay();
                }

                else {
                    return
                }
                break;

            case '.':
                if (self.calculationInputs.length >= 1 && !self.calculationInputs[self.calculationInputs.length - 1].hasDecimal) {
                    if (self.calculationInputs.length >= 1 && self.calculationInputs[self.calculationInputs.length - 1].type == 'number') {
                        self.calculationInputs[self.calculationInputs.length - 1].value += input;
                        self.currentDisplay += input;
                        self.calculationInputs[self.calculationInputs.length - 1].hasDecimal = true;
                    }
                }

                else {
                    return
                }

                self.calcDisplay();
                break;

            default:
                if (self.calculationInputs.length >= 1 && self.calculationInputs[self.calculationInputs.length - 1].type == 'number') {
                    self.calculationInputs[self.calculationInputs.length - 1].value += input;
                    self.currentDisplay += input;
                }

                else {
                    newInput.type = 'number';
                    self.calculationInputs.push(newInput);
                    self.currentDisplay += input;
                }

                if (self.calculationInputs.length > 1 && self.calculationInputs[self.calculationInputs.length - 2].hasPrecedence == true) {
                    self.calculationInputs[self.calculationInputs.length - 1].hasPrecedence = true;
                }

                self.calcDisplay();
                break;
        }
    };

    //Displays relevant input in the readout section in the DOM
    self.calcDisplay = function () {

        $('#number-readout').text(self.currentDisplay);
    };
};

//Calculator Accountant - handles all actual calculations
var Accountant = function () {
    var self = this;

    //Main calculation function
    self.processInputs = function (array) {

        var output = null;

        switch (array[1].value) {
            case '+':
                output = parseFloat(array[0].value) + parseFloat(array[2].value);
                break;

            case '-':
                output = parseFloat(array[0].value) - parseFloat(array[2].value);
                break;

            case '*':
                output = parseFloat(array[0].value) * parseFloat(array[2].value);
                break;

            default:
                output = parseFloat(array[0].value) / parseFloat(array[2].value);
        }

        return output
    };

    //Processes array when there are more than three inputs in a row
    self.multiInput = function (array) {

        while (array.length >= 3) {
            array[0].value = self.processInputs(array);
            array.splice(1, 2);
        }

        return array[0].value;
    };

    //Processes priority calculations for order of operations
    self.processOrderOps = function (supervisor) {
        var tempArray = [];
        var tempIndexes = [];

        for (var i = 0; i < supervisor.calculationInputs.length; i++) {
            if (tempArray.length < 3) {
                if (supervisor.calculationInputs[i].hasPrecedence == true) {
                    tempArray.push(supervisor.calculationInputs[i]);
                    tempIndexes.push(i);
                }
            }
        }

        if (tempArray.length == 0) {
            return self.multiInput(supervisor.calculationInputs)
        }

        supervisor.calculationInputs[tempIndexes[0]].value = self.processInputs(tempArray);

        supervisor.calculationInputs.splice(tempIndexes[1], 2);

        if (supervisor.calculationInputs.length - 1 > tempIndexes[0] && supervisor.calculationInputs[tempIndexes[0] + 1].hasPrecedence == true) {
            supervisor.calculationInputs[tempIndexes[0]].hasPrecedence = true;
        }
        else {
            supervisor.calculationInputs[tempIndexes[0]].hasPrecedence = false;
        }

        return self.processOrderOps(supervisor)
    }
};

//Inputs - holds needed values for each input
var Input = function (value, type, hasDecimal, hasPrecedence) {
    this.value = value;
    this.type = type;
    this.hasDecimal = hasDecimal;
    this.hasPrecedence = hasPrecedence;
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
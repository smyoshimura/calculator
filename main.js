/**
 * Created by Stefanie on 10/29/2015.
 */

function displayValue(type, value, item) {
    $('#number-readout').text(value);
}

var my_calculator = new calculator(displayValue);

$(document).ready(function () {

    $('button').on('click', function () {
        var val = $(this).text();
        my_calculator.addItem(val);
    })

});
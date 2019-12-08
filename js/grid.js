// Create query selector constants
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Get the width of the grid parent element
const parent_width = $('.calc-buttons').clientWidth;

// Calculate the size since they have a margin of 1px
const btn_margin_size = 4;
const btn_width = ((1 / 4) * parent_width) - (btn_margin_size * 2);
const btn_height = btn_width - 10;

// Used to keep track of the values
var currentValue = 0;

// holds the values to be inserted into the button
const calc_values = [7, 8, 9, '/',
                     4, 5, 6, 'x',
                     1, 2, 3, '-',
                     0, '.', '+', '='];

// Used to add a 4 x 4 button grid
// Run when the document has loaded and is ready
window.addEventListener('load', () => {
    // Loop 4 times
    for(var i = 0; i < 4; ++i){
        // Loop 4 times
        for(var j = 0; j < 4; ++j){
            // Create the button
            var btn = document.createElement('button');

            // Assign id
            btn.id = 'calc-btn-' + i + '-' + j;

            // Set the class for the buttons
            if(currentValue == 15){ // = sign
                btn.classList.add('equals-operator');
            }
            else if(currentValue == 14 || (currentValue + 1) % 4 == 0){ // + operator
                btn.classList.add('operators');
            }
            else { // The rest which are numbers
                btn.classList.add('calc-button');
            }

            // Set the width and height
            btn.style.width = btn_width + 'px';
            btn.style.height = btn_height + 'px';

            // Assign values to the button
            btn.innerHTML= calc_values[currentValue];
            btn.dataset.value = calc_values[currentValue];

            // Increment current value by 1
            ++currentValue;

            // Add on click event
            btn.addEventListener('click', function() {
                onButtonClickEvent(this);
            });

            // Add the button to html element
            $('.calc-buttons').appendChild(btn);
        }
    }
});

// Button functions here
// Create a new instance of the calculate class
const calculate = new Calculate();

// Handles the button on click event
function onButtonClickEvent(btn){
    var value = btn.dataset.value;

    if(value == '='){ // Equals sign
        $('#answer-display').value = calculate.getAnswer();
    }
    else{
        var results = calculate.insert(value);

        $('#number-display').value += results.value;
        $('#calc-btn-3-1').disabled = !results.decimalEnabled;

        // Set cursor to end
        setCursorToEnd($('#number-display'));
    }
}

// Adds event hanblers for the remaining misc buttons
$('#btn-del').onclick = () => {
    var disp = $('#number-display');

    // Disable or enable decimal button depending on key pressed
    $('#calc-btn-3-1').disabled = !calculate.delete().decimalEnabled;

    // Remove the last digit from what is on the display
    disp.value = disp.value.substring(0, disp.value.length - 1);

    // Set cursor to end
    setCursorToEnd($('#number-display'));
}

// Sets the cursor to end
function setCursorToEnd(input){
    input.selectionStart = input.selectionEnd = 10000;
}

// btn-clear
$('#btn-clear').onclick = () => {
    $('#number-display').value = '';

    $('#answer-display').value = '';

    // Clear array in infix expression stack
    calculate.clear();

    $('#calc-btn-3-1').disabled = !calculate.decimalEnabled;
}

// Btn-opening bracket
$('#btn-opening-bracket').onclick = () => {
    $('#number-display').value += '(';

    // Clear array in infix expression stack
    calculate.insert('(');
}

// Btn-opening bracket
$('#btn-closing-bracket').onclick = () => {
    $('#number-display').value += ')';

    // Clear array in infix expression stack
    calculate.insert(')');
}


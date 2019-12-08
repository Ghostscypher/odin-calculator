// The calculate class used to find calculations
class Calculate{
    constructor() {
       this.infix_expression = new Stack(32);
       this.postfix_expression = new Stack(32);
       this.decimalEnabled = true; // Tracks if decimal is enabled 
    }

    // Checks if a value supplied is ana operator
    isValidOperator(value){
        switch (value) {
            case '+':
            case 'x':
            case '/':
            case '-':
            case '^':
            case '%':
                return true;
        
            default:
                return false;
        }
    }

    // Checks if a value supplied is a valid interger digit
    isDigit(value){
        return (parseInt(value) >= 0 && parseInt(value) <= 9)
    }

    isDigit2(value){
        return (Math.abs(parseInt(value)) >= 0);
    }

    // Check if the value supplied is a bracket
    // Will be used to extend this app later
    isBracket(value){
        return (value == '(' || value == ')');
    }

    /* Used to remove value from array when user presses delete
    * @returns
    *  0 - if the value removed was a number
    *  1 - if value was an operator
    *  2 - if value was a .
    * -1 - if there is an error removing from array
    */
    delete(){
        // Will throw an error in future
        if(this.infix_expression.isEmpty()){
            return {value: '', decimalEnabled: this.decimalEnabled};
        }

        var value = this.infix_expression.pop();

        if(this.isDigit(value) || this.isBracket(value)){ // Number
            return {value: value, decimalEnabled: this.decimalEnabled};
        }
        else if(value == '.'){ // Decimal
            this.decimalEnabled = true;

            return {value: value, decimalEnabled: this.decimalEnabled};
        }
        else{
            if(calculate.isValidOperator(value)){
                this.decimalEnabled = true;
                
                return {value: value, decimalEnabled: this.decimalEnabled};
            }
            else{
                return {value: '', decimalEnabled: true};
            } 
        }
    }

    /* Used to insert a value into array when user enters a value
    * @returns
    *  dictionary
    *       value: value
    *       decimalEnabled: whether decimal button can be pressed
    * -1 - if there is an error inserting into array 
    */
    insert(value){
        // Will throw an error in future
        if(this.infix_expression.isFull()){
            return {value: '', decimalEnabled: this.decimalEnabled};
        }

        // Push value to stack
        // Check previous value
        if(this.infix_expression.isEmpty()){
            this.infix_expression.push(value);
        }
        else{
            var temp = this.infix_expression.peek().slice(-1);

            if(this.isValidOperator(value) || this.isBracket(value)){
                if(value == '('){
                    this.infix_expression.push('x');
                    this.infix_expression.push(value);
                }
                else if(value == ')'){ // Expression in the form '()'
                    if(temp == '('){
                        value == '';

                        // Removes the x and (
                        this.infix_expression.pop();
                        this.infix_expression.pop();
                    }
                    else{
                        this.infix_expression.push(value);
                    }
                }
                else{
                    // Catch repeating operators
                    if(temp == '-' && value == '-'){
                       this.infix_expression.pop();
                       this.infix_expression.push('+');
                    }
                    else if((temp == '-' && value == '+') || (temp == '+' && value == '-')){
                        this.infix_expression.pop();
                        this.infix_expression.push('-');
                    }
                    else if((temp == '+' && value == '+')){
                        this.infix_expression.pop();
                        this.infix_expression.push('+');
                    }
                    else{
                        this.infix_expression.push(value);
                    }
                }
            }
            else{
                if(this.isDigit(temp) || temp == "."){
                    temp = this.infix_expression.pop() + value;
                }
                else{
                    temp = value;
                }

                this.infix_expression.push(temp);
            }
        }

        if(this.isDigit(value) || this.isBracket(value)){ // Number
            return {value: value, decimalEnabled: this.decimalEnabled};
        }
        else if(value == '.'){ // Decimal
            this.decimalEnabled = false;

            return {value: value, decimalEnabled: this.decimalEnabled};
        }
        else{
            if(calculate.isValidOperator(value)){
                // Re-enable decimal
                this.decimalEnabled = true;
    
                return {value: value, decimalEnabled: this.decimalEnabled};
            } 
        }
    }

    // Clears the array entirely when user presses clear button
    clear(){
        this.infix_expression.clearAll();

        this.decimalEnabled = true;
    }

    // Returns current length of items in the array
    getLength(){
        return this.infix_expression.length;
    }

    // Used to evaluate expression and get answer
    getAnswer(){
        try {
            // Convert our infix expression to postfix
            this.infixToPostFix();
            
            return this.evaluatePostfix();   
        } catch (error) {
            console.error(error);

            return 'Syntax Error'; 
        }
    }

    // Evaluates the postfix expression and returns the answer
    evaluatePostfix(){
        var evaluate_stack = new Stack;

        // Evaluate each element in postfix expression
        this.postfix_expression.array.forEach(value => {
            if(this.isValidOperator(value)){
                var b = this.roundNumber(parseFloat(evaluate_stack.pop()), 8);
                var a = this.roundNumber(parseFloat(evaluate_stack.pop()), 8);

                evaluate_stack.push(this.roundNumber(this.operate(value, a, b), 8));
            }
            else{
                evaluate_stack.push(value);
            }
        });

        // The answer is the remaining value in stack
        var ans = evaluate_stack.pop();
        
        // If a value still remains in the stack then there was a syntax error
        if(!evaluate_stack.isEmpty() || !this.isDigit2(ans)){
            return 'Syntax error';
        }
        else{
            return ans;
        }
    }

    // Used to pretty print an answer
    prettyPrint(number){

    }

    // used to round numbers
    roundNumber(num, precision){
        return Math.round(num * (Math.pow(10, precision))) / (Math.pow(10, precision));
    }

    // Will be used to convert infix to postfix expression
    precedence(ch) {
        if(ch == '+' || ch == '-' || ch == '%') {
           return 1;              //Precedence of + or - is 1
        }else if(ch == 'x' || ch == '/') {
           return 2;            //Precedence of (x or *) or / is 2
        }else if(ch == '^') {
           return 3;            //Precedence of ^ is 3
        }else {
           return 0;
        }
    }

    // Converts infix to postfix
    infixToPostFix(){
        // Reset postfix expression
        this.postfix_expression.clearAll();

        var stk = new Stack;
        stk.push('#'); // Add some extra character to avoid underflow

        for(var i = 0; i < this.infix_expression.getSize(); ++i){
            var value = this.infix_expression.array[i];

            if(this.isDigit2(value)){
                this.postfix_expression.push(value);
            }
            else if(value == '('){
                stk.push('(');
            }
            else if(value == '^'){
                stk.push('^');
            }
            else if(value == ')'){
                while(stk.peek() != '#' && stk.peek() != '('){
                    this.postfix_expression.push(stk.pop());
                }

                stk.pop(); // Used to pop '(' from stack
            }
            else{
                while (stk.peek() != '#' && (this.precedence(value) <= this.precedence(stk.peek()))) {
                    this.postfix_expression.push(stk.pop());
                }

                stk.push(value);
            }
        }

        while (stk.peek() != '#') {
            this.postfix_expression.push(stk.pop());
        }

        return this.postfix_expression;
    }

    // Other operations to be placed here
    // Takes in an operator and performs the operator action on a and b
    operate(operator, a, b){
        switch (operator) {
            case '+':
                return this.add(a, b);

            case '-':
                return this.subtract(a, b);

            case 'x':
                return this.multiply(a, b);
            
            case '/':
                return this.divide(a, b);
            
            case '%':
                return this.modulus(a, b);
            
            case '^':
                return this.power(a, b);
        
            default:
                return null; // The operator is not yet supported
        }
    }

    // Basic arithmetic operations
    // Add two numbers
    add(a, b){
        return a + b;
    }

    // Subtracts b from a
    subtract(a, b){
        return a - b;
    }

    // Multiplies a and b
    multiply(a, b){
        return a * b;
    }

    // Divides two numbers
    divide(a, b){
        return a / b;
    }

    // Finds modulus of a mod b
    modulus(a, b){
        return a % b;
    }

    // Finds power of a raised to b
    power(){
        return Math.pow(a, b);
    }
}

// Will be used to convert infix expression to postfix
class Stack{
    constructor(max_size){
        this.max_size = max_size;
        this.array = new Array();
    }

    // Check if stack is empty
    isEmpty(){
        return this.array.length == 0;
    }

    // Check if the stack is full
    isFull(){
        return this.array.length == this.max_size;
    }

    // Used to add/push value into stack
    push(value){
        this.array[this.getSize()] = value;
    }

    // Used to pop value from stack
    pop(){
        return this.array.pop();
    }

    // Used to remove value from start of stack
    inversePop(){
        return this.array.shift();
    }

    // Preview what is in the last position of the array
    peek(){
        if(this.isEmpty()){
           throw new Error('Stack is empty');
        }

        return this.array[this.getSize() - 1];
    }

    // View what is in the first potion of array
    inversePeek(){
        if(this.isEmpty()){
            throw new Error('Stack is empty');
        }

        return this.array[0];
    }

    // Gets the current size of stack
    getSize(){
        return this.array.length;
    }

    // Gets the max size of this stack
    getMaxSize(){
        return this.max_size;
    }

    // Clears all the values in the array
    clearAll(){
        this.array.length = 0;
    }
}



const buttons = document.querySelectorAll('.calc-button');
const expValue = document.querySelector('.calc-value');
const expMemory = document.querySelector('.calc-memory');

for (button of buttons) {
    button.addEventListener('click', (event) => buttonClick(event))
}

function toDecimal5(number) {
    let split = (+number).toString().split('.');
    console.table(split);
    if (!split[1] || split[1].length < 5) 
        return +number;
    return +number.toFixed(5);
}

function calcPower(number, power) {
    calc = (+number) ** (power);
    return toDecimal5(calc);
}

function evalExp(){
    let split = expMemory.innerText.split(" ");
    const operator = split[1];
    const operand1 = +split[0];
    const operand2 = +expValue.innerText;
    
    switch(operator){
        case '+':
            return toDecimal5(operand1 + operand2);
        case '-':
            return toDecimal5(operand1 - operand2);
        case '*':
            return toDecimal5(operand1 * operand2);
        case '/':
            return toDecimal5(operand1 / operand2);
        case 'mod':
            return toDecimal5(operand1 % operand2);
    }
    return '/#EVIL'
}

function newResult(){
    expValue.innerText = evalExp().toString();
    expMemory.innerText = ' ';
    return;
}

function truncateTo15() {
    if (expValue.innerText.length > 15){
        expValue.innerText = expValue.innerText.substring(expValue.innerText.length - 15, expValue.innerText.length)
    }
    return;
}

function buttonClick (event) { 
    event.cancelBubble = true  /* does this work? */
    switch(event.target.dataset.value){
        case 'AC': clearAll();
            break;
        case 'C': expValue.innerText != '-'? 
                  expValue.innerText = expValue.innerText.slice(0, - 1) :
                  true;
            break;
        case 'sign': (expValue.innerText[0] == '-'? 
                     expValue.innerText = expValue.innerText.slice(1) :
                     expValue.innerText = '-' +  expValue.innerText);
            break;
        case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': 
            expValue.innerText +=  event.target.dataset.value;
            break;
        case '0' : case '00':
            /[1-9]/.test(expValue.innerText)? 
            expValue.innerText = expValue.innerText + event.target.dataset.value.toString(): 
            true
            break;
        case '+' : case '-': case '*' : case '/': case 'mod':
            if ((expValue.innerText != ' ' || expValue.innerText != '-') && expMemory.innerText != ' ') newResult();
            if (/[1-9]/.test(expValue.innerText)){
                let swap = expValue.innerText +' '+event.target.dataset.value.toString();
                expMemory.innerText = swap;
                expValue.innerText = ' ';
            }
            break;
        case '.':
            if(expValue.innerText == ' ' || expValue.innerText == '-') {
                expValue.innerText = expValue.innerText + '0.';
                break;
            }
            expValue.innerText = expValue.innerText + '.';
            break;
        case 'root':
            expValue.innerText = calcPower(expValue.innerText, 0.5).toString();
            break;
        case 'sqr':
            expValue.innerText = calcPower(expValue.innerText, 2).toString();
            break;
        case '=':
            if(expMemory.innerText != ' ' || expValue.innerText == '-'){
/*                 expValue.innerText = evalExp().toString();
                expMemory.innerText = ''; */
                newResult();
            }
            break;
    }

    truncateTo15();
    return;
}

function clearAll() {
    expValue.innerText = ' ';
    expMemory.innerText = ' ';
    return;
}
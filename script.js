const buttons = document.querySelectorAll('.calc-button');
const expValue = document.querySelector('.calc-value');
const expMemory = document.querySelector('.calc-memory');
clearAll();

function clearZeroes() {
    const sign = expValue.textContent[0];
    let newNum = expValue.textContent;
    while(newNum[1] == '0'){
        newNum = sign + newNum.substring(2, newNum.length);
    }
    expValue.textContent = newNum;
}

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
    let split = expMemory.textContent.split(" ");
    const operator = split[1];
    const operand1 = +split[0];
    const operand2 = +expValue.textContent;
    
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
    expValue.textContent = evalExp().toString();
    expMemory.textContent = ' ';
    return;
}

function truncateTo15() {
    const sign = expValue.textContent[0];
    if (expValue.textContent.length > 15){
        expValue.textContent = sign + expValue.textContent.substring(expValue.textContent.length - 14, expValue.textContent.length)
    }
    return;
}

function buttonClick (event) { 
    event.cancelBubble = true  /* does this work? */
    switch(event.target.dataset.value){
        case 'AC': clearAll();
            break;
        case 'C': 
        if (expValue.textContent != '-' && expValue.textContent != ' ')
                  expValue.textContent = expValue.textContent.slice(0, - 1) 
            break;
        case 'sign': (expValue.textContent[0] == '-'? 
                     expValue.textContent = ' ' + expValue.textContent.slice(1) :
                     expValue.textContent = '-' +  expValue.textContent);
            break;
        case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': 
            expValue.textContent +=  event.target.dataset.value;
            break;
        case '0' : case '00':
            /[1-9]/.test(expValue.textContent)? 
            expValue.textContent = expValue.textContent + event.target.dataset.value.toString(): 
            true
            break;
        case '+' : case '-': case '*' : case '/': case 'mod':
            if ((expValue.textContent != ' ' || expValue.textContent != '-') && expMemory.textContent != ' ') newResult();
            if (/[1-9]/.test(expValue.textContent)){
                let swap = expValue.textContent +' '+event.target.dataset.value.toString();
                expMemory.textContent = swap;
                expValue.textContent = ' ';
            }
            break;
        case '.':
            if(expValue.textContent == ' ' || expValue.textContent == '-') {
                expValue.textContent = expValue.textContent + '0.';
                break;
            }
            expValue.textContent = expValue.textContent + '.';
            break;
        case 'root':
            expValue.textContent = calcPower(expValue.textContent, 0.5).toString();
            break;
        case 'sqr':
            expValue.textContent = calcPower(expValue.textContent, 2).toString();
            break;
        case '=':
            if(expMemory.textContent != ' ' || expValue.textContent == '-'){
/*                 expValue.textContent = evalExp().toString();
                expMemory.textContent = ''; */
                newResult();
            }
            break;
    }

    truncateTo15();
    clearZeroes();
    return;
}

function clearAll() {
    expValue.textContent = ' ';
    expMemory.textContent = ' ';
    return;
}
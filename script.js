
const buttons = document.querySelectorAll('.calc-button');
const expValue = document.querySelector('.calc-value');
const expMemory = document.querySelector('.calc-memory');
clearAll();

function clearZeroes() {
    const sign = expValue.textContent[0];
    let newNum = expValue.textContent;
    while(newNum[1] == '0' && newNum[2] != '.'){
        newNum = sign + newNum.substring(2, newNum.length);
    }
    expValue.textContent = newNum;
}

for (button of buttons) {
    button.addEventListener('click', (event) => buttonClick(event))
    button.addEventListener("transitionend", (event) => {
        event.target.classList.remove('clicked')
        event.target.disabled = false;
    });
}
document.addEventListener('keydown', (event) => keyPress(event));

function keyPress(event) {
    let button = null;
    switch (true){
        case event.key == '`': {
            button = document.querySelector(".calc-button[data-value = '`']")
            if(button.disabled != true)
            {
            button.classList.add('clicked');
                new Audio('./music/doof.mp3').play();
                button.disabled = "disabled";
                break;
            }
            return;
        }
        case ((event.key == 'Backspace' || event.key == 'Delete') && event.shiftKey == true) : {
            button = document.querySelector(".calc-button[data-value = 'AC']");
            break;
        }
        case (event.key == '0' && event.shiftKey == true) : {
            button = document.querySelector(".calc-button[data-value = '00']");
            break;
        }
        case (event.key == 'Backspace' || event.key == 'Delete') : {
            button = document.querySelector(".calc-button[data-value = 'C']");
            break;
        }
        case ((event.key == '_' || event.key == '-') && event.shiftKey == true) : {
            button = document.querySelector(".calc-button[data-value = 'sign']");
            break;
        }
        case (event.key == '!') : {
            button = document.querySelector(".calc-button[data-value = 'mod']");
            break;
        }
        case (event.key == '@') : {
            button = document.querySelector(".calc-button[data-value = 'root']");
            break;
        }
        case (event.key == '#') : {
            button = document.querySelector(".calc-button[data-value = 'sqr']");
            break;
        }
        default : {
            button = document.querySelector(`.calc-button[data-value = "${event.key}"]`)
            console.log(event.key);
            break;
        }
    }
    new Audio('./music/evil.mp3').play()
    button.click();
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
    let result = 1;
    while(split[0] == '')
        split.shift(); /* removes first element */
    const operator = split[1];
    const operand1 = +split[0];
    const operand2 = +expValue.textContent;

    switch(operator){
        case '+':
            result = toDecimal5(operand1 + operand2);
            break;
        case '-':
            result = toDecimal5(operand1 - operand2);
            break;
        case '*':
            result =  toDecimal5(operand1 * operand2);
            break;
        case '/':
            result =  toDecimal5(operand1 / operand2);
            break;
        case 'mod':
            result =  toDecimal5(operand1 % operand2);
            break;
        default: return '/#EVIL';
    }
    if(result.toString().length >= 14) {
        result = result.toExponential();
        if(result.toString().length >= 14) 
            return '/#BIG'
    }
    return result;
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
    if(event.target.dataset.value == '`'){
        event.target.classList.add('clicked');
        new Audio('./music/doof.mp3').play()
        event.target.disabled = "disabled";
        return;
    }
    new Audio('./music/evil.mp3').play()
    event.target.classList.add('clicked') ;
    checkBadResult();
    switch(event.target.dataset.value){
        case 'AC': clearAll();
            break;
        case 'C': clear();
/*         if (expValue.textContent != '-' && expValue.textContent != ' ')
                  expValue.textContent = expValue.textContent.slice(0, - 1)  */
            break;
        case 'sign': 
            if (expValue.textContent[0] == '-'){
                expValue.textContent = ' ' + expValue.textContent.slice(1)
                break;
            }
            expValue.textContent = '-' +  expValue.textContent.slice(1);
            break;
        case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': 
            expValue.textContent +=  event.target.dataset.value;
            break;
        case '0' : case '00':
            /[1-9.]/.test(expValue.textContent)? 
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
            if(expValue.textContent.includes('.')){
                if (expValue.textContent[expValue.textContent.length - 1] == '.'){ 
                    expValue.textContent = expValue.textContent.slice(0, - 1);
                    break;
                }
                else break; 
            }
            expValue.textContent = expValue.textContent + '.';
            break;
        case 'root':
            getResult(); 
            expValue.textContent = calcPower(expValue.textContent, 0.5).toString();
            break;
        case 'sqr':
            getResult(); 
            expValue.textContent = calcPower(expValue.textContent, 2).toString();
            break;
        case '=':
            getResult();
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

function clear() {
    if (expValue.textContent != '-' && expValue.textContent != ' ')
    expValue.textContent = expValue.textContent.slice(0, - 1) 
}

function checkBadResult(){
    let sign = (expValue.textContent == "-"? "-" : " ");
    if(
            expValue.textContent.includes('Infinity')
            || expValue.textContent.includes('/#EVIL')
            || expValue.textContent.includes('NaN')
            || expValue.textContent.includes('/#BIG')
    ) expValue.textContent = sign;
    return;
}

function getResult() {
    if(expMemory.textContent != ' ' || expValue.textContent == '-'){
        newResult();
    }
}
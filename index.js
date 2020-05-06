//////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа 2 по дисциплине ЛОИС
// Выполнена студентом группы 721702 БГУИР Гуриновичем Александром Александровичем
// Файл содержит функции нахождения подформул,генерации формул, систему проверки знаний пользователя
//
// Функция генерации формулы https://github.com/PlagaMedicum/LOIS/tree/master/Lab1
//

okButton = document.getElementById("ok_button");
inputField = document.getElementById("input_field");
resultTextarea = document.getElementById("result_textarea");

genTestButton = document.getElementById("genTest");
genResultField = document.getElementById("genResult");

truthTable = document.getElementById("truthTable");

classicModeButton = document.getElementById("classic");
testModeButton = document.getElementById("user_test");

formulaForm = document.getElementById("formulaForm");
answerField = document.getElementById("answer");
answerLabel = document.getElementById("answerLabel");
checkAnswerButton = document.getElementById("checkAnswer");

let isNeutral = false;


okButton.addEventListener("click", () => {
    let inputString = inputField;
    main(inputString);
});

checkAnswerButton.addEventListener("click", () => {
    checkAnswer();
});

classicModeButton.addEventListener("click", () => {
    testModeButton.removeAttribute("class");
    classicModeButton.setAttribute("class", "selected");

    formulaForm.removeAttribute("class");
    // genTestButton.setAttribute("class","none");
    // genResultField.setAttribute("class","none");
    answerField.setAttribute("class","none");
    answerLabel.setAttribute("class","none");
    checkAnswerButton.setAttribute("class","none");
    resultTextarea.value = "";

});

testModeButton.addEventListener("click", () => {
    classicModeButton.removeAttribute("class");testModeButton
    testModeButton.setAttribute("class", "selected")

    formulaForm.setAttribute("class","none");
    // genTestButtongenTestButton.removeAttribute("class");
    // genResultField.removeAttribute("class");
    answerField.removeAttribute("class");
    answerLabel.removeAttribute("class");
    checkAnswerButton.removeAttribute("class");
    resultTextarea.value = "";
});


genTestButton.addEventListener("click", () => {
    genResult.value = genFormula();
});

let openBracketsCount = 0;
let openArray = [];
let closeArray = [];

let arrayChecked = [];
let arrayOfFindAtom = [];
let arrayCalculated = [];

const atom = /[A-Z0-1]/g;
const operators = /[*&|~]/g;
const arrow = /(->)/


function main(inputX){

    openBracketsCount = 0;
    openArray = [];
    closeArray = [];

    arrayChecked = [];
    arrayOfFindAtom = [];

    let inputString  = inputX.value;

    let brackets = getBracketsFromString(inputString);
    if(!countBrackets(brackets)){
        resultTextarea.value = "проверь скобки";
        openBracketsCount = 0;
    } else {
        resultTextarea.value = "Открывающий скобок = " + openBracketsCount;
        if(checkSpace(inputString)){
            if ( allSubStringsIsFormula(inputString) ) {
                resultTextarea.value = "Строка является формулой.";
                resultTextarea.value += " Найдено " + findAtomCount(inputString) + " подформул";
                configurateTruthTable();

            } else {
             resultTextarea.value = "Строка не является формулой.";
            }

        } else {
            resultTextarea.value = "проверь пробелы";
        }
    }
}

function getBracketsFromString(inputString){
    let bracketsString = "";
    openBracketsCount = 0;
    for(let i = 0; i < inputString.length; i += 1) {

        if (inputString[i] === '(') {
            bracketsString += inputString[i];
            openBracketsCount += 1;

        } else if ( inputString[i] === ')'){
            bracketsString += inputString[i];
        }
    }
    return bracketsString;
}

function countBrackets(str){

    let ArrBrackets = [];
    let open = 0;
    let close = 0;
                     
    bracketsConfig =[['(', ')']];
  
    if(str.length %2 != 0 ){
      return false;
    }
  
    for (let i = 0 ;i <str.length;i++){
      for (let j = 0 ;j <bracketsConfig.length;j++){
        if(bracketsConfig[j][0] == bracketsConfig[j][1]){
          if (str[i] == bracketsConfig[j][0]){
            if(close==open){
              ArrBrackets.push(i);
              open++;
              break;
            }
            else {
              ArrBrackets.pop();
              close ++;
              break;
            }
          }
        }
        else if (bracketsConfig[j][0] != bracketsConfig[j][1]){
          if (str[i] == bracketsConfig[j][0]){
            ArrBrackets.push(str[i]);
            open ++;
            break;
          }
          else if (str[i] == bracketsConfig[j][1]){
            if(ArrBrackets[ArrBrackets.length-1] == bracketsConfig[j][0]){
              ArrBrackets.pop();
              close ++;
              break;
            }
          }
        }
      }
    }
    return (ArrBrackets.length === 0);

}


function checkSpace(string){
    for(let i = 0; i < string.length; i += 1 ) {
        if(string[i] === " ") {
            return false;
        }
    }
    return true;
}

function allSubStringsIsFormula(inputString){
    let subStringsArray = [];

    let isFormula = true;

    configurateBraketsPair(inputString)
    
    console.log(openArray);
    console.log(closeArray);
    
    let getFirstFindBracketIndex = Math.min.apply(null,openArray);
    let getLastFindBracketIndex = Math.max.apply(null,closeArray);
    
    if(openArray.length > 0){
    
        let difference =  (getLastFindBracketIndex - getFirstFindBracketIndex);
    
        if ( difference + 1 !== inputString.length){
            resultTextarea.value = "все должно находиться внутри скобок";
            return null;
        }

        for(let i = 0; i < openArray.length;i++) {
            subStringsArray.push(inputString.substring(openArray[i],closeArray[i] + 1));
        }

        subStringsArray = sortArraysOfString(subStringsArray);

        for(let i = 0; i < openArray.length;i++) {
            if( !checkString(subStringsArray[i]) ) {
                isFormula = false;
            }
        }

    } else {
        if ( !checkString(inputString) ) {
            isFormula = false;
        }
    }

    return isFormula;
}

function configurateBraketsPair(array){

    if ( openBracketsCount === 0 ) {
        return;
    }

    let visitedArray = [];
    let currentOpenState = [];

    let indexOpen = -1;
    let indexClose = -1;

    let counterOfBracketPairs = 0;

    for(let i = 0;i <= array.length; ){
        if ( !visitedArray.includes(i) && array[i] === "(") {
            indexOpen = i;
            currentOpenState.push(i);
        }  else if (!visitedArray.includes(i) && array[i] === ")"){
            indexClose = i;
        }

        if ( indexOpen !== -1 && indexClose !== -1){

            openArray.push(currentOpenState[currentOpenState.length-1] );
            closeArray.push(indexClose );

            visitedArray.push(currentOpenState[currentOpenState.length-1]);
            visitedArray.push(indexClose);

            currentOpenState.pop();
            counterOfBracketPairs++;

            indexClose = -1;
            if (currentOpenState.length === 0) {
                indexOpen = -1;
            }
  
        }
        if (i === array.length && counterOfBracketPairs !== openBracketsCount) {
            i = 0;
            continue;
        }
        i++;
    }
}

function sortArraysOfString(inputArrayOfString){
    for ( let i = 0; i < inputArrayOfString.length; i += 1 ) {
       for ( let j = 0; j < inputArrayOfString.length; j += 1 ) {
           if ( inputArrayOfString[i].length >= inputArrayOfString[j].length ) {
               continue;
           } else if ( inputArrayOfString[i].length < inputArrayOfString[j].length ) {
               let tmp = inputArrayOfString[i];
               inputArrayOfString[i] = inputArrayOfString[j];
               inputArrayOfString[j] = tmp;
           }
       }
    }
    return inputArrayOfString;
}


function checkString(getStrings){    
    if ( getStrings.length ) {
        if ( checkSubString(getStrings) ) {
            if (!arrayContainsElement(getStrings, arrayChecked)) {
                arrayChecked.push(getStrings);
            }
            return true;
        } else {
            return false;
        }
       
    }
}


function checkSubString(string){
    for(let i = arrayChecked.length - 1; i >= 0 ; i -= 1) {
        if ( string.includes( arrayChecked[i] ) ) { 
            string = string.replace(arrayChecked[i],"A");
            i++;
        }
    }

    if ( string.length > 1 && (string[0] !== "(" || string[string.length-1] !== ")") ) {       
        console.log("отклонил по причине отсутствия открывающей или закрывающей скобки");
        return false;
    }

    if(string.length === 3 && string[0] === "(") { // отсеивает (A) , но просто А должно проходить
        return false;
    }
    string = removeFirstBrackets(string);

    if(string.length >= 5 ){
        resultTextarea.value = `недопустимая формула "${string}"`;
        return false;
    } else if (string.length === 0){
            resultTextarea.value = `Введите формулу`;
             return false;
    }

    for ( let i = 0; i < string.length; i += 1 ) {
        if (string[0] === "!") { 
            if (string.length === 2 && string[1].match(atom) !== null){
                return true;
            }  else {
                return false;
            }
        } else if (string.length === 4) { 
            if ( (string[1] + string[2]).match(arrow)) {
                return string[0].match(atom) && string[3].match(atom);
            } 
            return false;

        } else if (string .length === 3 ){
            return string[0].match(atom) && string[1].match(operators) && string[2].match(atom);
        } else if (string.length === 1 ) {
            return string.match(atom) !== null;
        }
        return false;
    }
    return false;
}

function removeFirstBrackets(string) {
    if (string[0] === "("){
        string = string.substring(1,string.length);
    }

    if(string[string.length-1] === ")") {
        string = string.substring(0,string.length-1);
    }
    return string;
}

function arrayContainsElement(el,array){
    for (let i = 0; i < array.length; i++ ) {
        if ( array[i].toString(10) === (el).toString(10) ) {
            return true;
        }
    }
    return false;
}

function findAtomCount(string){
    let counter = 0;
    for ( let i = 0; i < arrayChecked.length; i += 1 ) {
        if ( string.includes( arrayChecked[i] ) ) {
            counter++;
        }
    }
    for ( let i = 0; i < string.length; i++ ) {
        let atomic = string[i].match(atom); 
        if ( atomic!== null ) {
            let condition = arrayContainsElement(atomic, arrayChecked);

            if (condition) {
                continue;
            }
            condition = arrayContainsElement(atomic, arrayOfFindAtom)
            if ( condition) {
                continue;
            } else {
                arrayOfFindAtom.push(atomic);
                counter++;
            }
        }
    }
    return counter;
}

function configurateTruthTable(){
    let arrayOfAtoms = [];
    let arrayOfFormulas = [];
    let counterOfConstants = 0;

    for ( let i = 0; i < arrayOfFindAtom.length; i++ ) {
        arrayOfAtoms.push( arrayOfFindAtom[i] );
        if ( arrayOfAtoms[i].toString(10) === "0" || arrayOfAtoms[i].toString(10) === "1" ) {
            counterOfConstants ++;
        }

    }
    for (let i = 0; i < arrayChecked.length; i++ ) {
        if(arrayChecked[i].length === 1) {
            arrayOfAtoms.push( arrayChecked[i]);
            if ( arrayOfAtoms[i].toString(10) === "0" || arrayOfAtoms[i].toString(10) === "1" ) {
                counterOfConstants ++;
            }
        } else {
            arrayOfFormulas.push(arrayChecked[i]);
        }
    }
    
    truthTable.innerHTML = "";
    let tableHeadersRow = truthTable.insertRow(0);

    for( let i = 0; i < arrayOfAtoms.length; i++ ) {
        let cell = tableHeadersRow.insertCell(i);
        cell.innerHTML = arrayOfAtoms[i];
    }

    let colLength = Math.pow(2,arrayOfAtoms.length - counterOfConstants);

    for(let i = 0; i < colLength; i++ ) {
        let row = truthTable.insertRow(i+1);
        row.setAttribute("id", "id" + i);
    }
    configurateBasicColumn(arrayOfAtoms,colLength);

    for ( let i = 0; i < arrayOfFormulas.length; i++ ) {
        let cell = tableHeadersRow.insertCell(i + arrayOfAtoms.length);
        cell.innerHTML = arrayOfFormulas[i];
    }
    let lastColValues = [];

    if ( arrayOfFormulas.length === 0) {
        if (counterOfConstants === 1) {
            resultTextarea.value += ".Формула является не нейтральной";
            return;

        } else {
            isNeutral = true;
            resultTextarea.value += ".Формула является нейтральной";
            return;
        }

    }
    
    for (let j = 0; j < colLength; j++ ) {
        let row = document.getElementById("id" + j);
        for ( let i = 0; i < arrayOfFormulas.length; i++ ) {
            let cell = row.insertCell(i + arrayOfAtoms.length);
            let value = evalValue(findValue(arrayOfFormulas[i],j+1));
            cell.innerHTML = value;
            if (i === arrayOfFormulas.length - 1) {
                lastColValues.push(value);
            }

        }

    }
    if ( checkTheNeutralityOfTheFormula(lastColValues) ) {
        resultTextarea.value += ".Формула является нейтральной";
    } else {
        resultTextarea.value += ".Формула является не нейтральной";
    }
}

function checkTheNeutralityOfTheFormula(lastRowValues){
    let isTrue = false;
    let isFalse = false;

    if (arrayContainsElement("1", lastRowValues)) {
        isTrue = true;
    }

    if (arrayContainsElement("0", lastRowValues)) {
        isFalse = true;
    }

    isNeutral = isFalse && isTrue 
    return isNeutral;

}



function findFirstAtom(string) {
    for (let i = 0; i < string.length; i ++ ) {
        if (string[i].match(atom)){
            return string[i];
        }
    }
    return -1;
}


function findLastAtom(string) {
    for (let i = string.length - 1 ; i >= 0; i -- ) {
        if (string[i].match(atom)){
            return string[i];
        }
    }
    return -1;
}

function evalValue(string){
    if (string.includes("->")) {
        string = string.replace("->","|")
        string = "(!" + string.slice(1);
    } else if (string.includes("~")) {
        string = string.replace("~","|");
   
        let s1 = findFirstAtom(string);
        let s2 = findLastAtom(string);

        string = "(!" + string.slice(1);
        string = string + "&(!" + s2 + "|" + s1 + ")";
    }
    let willReturn = eval(string);

    if (willReturn == false || 0 ) {
        return "0";
    } else {
        return "1";
    }
}

function findValue(formula,rowNUM){
    let allHeaders = truthTable.childNodes[0].childNodes[0].innerText;
    let allHeadersArray = []
    allHeadersArray = allHeaders.split(/\s+/g);
  
    for(let i = allHeadersArray.length - 1; i >= 0 ; i -= 1) {
        if ( formula.includes( allHeadersArray[i] )  && formula !== allHeadersArray[i]) { 
             let newText = truthTable.childNodes[0].childNodes[rowNUM].childNodes[i].innerText

            formula = formula.replace(allHeadersArray[i],newText);

             if (allHeadersArray[i].toString(10 === "1" || allHeadersArray[i].toString(10) === "0")) {
                continue;
            }
              i++;
        }
    }
   return formula;
}

function configurateBasicColumn(arrayOfAtoms,colLength) {
    let currentSumInRow = ""
    let arrLength = 0;
    for (let i = 0; i < arrayOfAtoms.length; i++ ) {
        if (arrayOfAtoms[i].toString(10) === "1" || arrayOfAtoms[i].toString(10) === "0"){
            continue;
        }
        arrLength++;
        currentSumInRow += "0";
    }

    for (let i = 0; i < colLength; i++ ) {
        let row = document.getElementById("id" + i);
        let ij = 0;
        for (let j = 0; j < arrayOfAtoms.length; j++ ) {
     
            let cell = row.insertCell(j);
            if(arrayOfAtoms[j].toString(10) === "1") {
                cell.innerHTML = "1";
            } else if (arrayOfAtoms[j].toString(10) === "0") {
                cell.innerHTML = "0";
            } else {
                cell.innerHTML = currentSumInRow[ij];
                ij++;
            }
         
        } 
        currentSumInRow = addMissingZeros(sum(currentSumInRow,"1"),arrLength);
    }
}

function sum(x,y) {
    let x1 = parseInt(x,2);
    let y1 = parseInt(y,2);
    let result  = (x1+y1).toString(2);
    return result;
}

function addMissingZeros(string, length) {
    while(string.length < length) {
        string = "0" + string;
    }
    return string;
}



function checkAnswer(){
    let inputString = genResultField;
    main(inputString)
    let userAnswer = (answerField.value);

    if(userAnswer === "да" && isNeutral === true) {
        resultTextarea.value = "Вы правы. " + resultTextarea.value
    } else if (userAnswer === "нет" && isNeutral === false){
        resultTextarea.value = "Вы правы. " + resultTextarea.value
    } else {
        resultTextarea.value = "Вы не правы. " + resultTextarea.value
    }
}

/////////
const binary = ["->", "&", "|", "~"];
const braces = ["(", ")"];
const constant = ["0", "1"];
const symbol = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "X", "Y", "Z", "V", "W"];


const nestLimit = 15;
let nest = 0;

function genFormula() {
    nest = 0;
    let c = Math.floor(Math.random() * (nest < nestLimit ? 4 : 2));

    switch (c) {
        case 0:
            return genConst();
        case 1:
            return genSymbol();
        case 2:
            return genBinary();
        case 3:
            return genUnary();
    }
}


// genConst ...
function genConst() {
    return constant[Math.floor(Math.random() * constant.length)];
}

// genSymbol ...
function genSymbol() {
    return symbol[Math.floor(Math.random() * symbol.length)];
}

// genBinary ...
function genBinary() {
    nest++;
    return "(" + genFormula() + binary[Math.floor(Math.random() * binary.length)] + genFormula() + ")"
}

// genUnary ...
function genUnary() {
    nest++;
    return "(!" + genFormula() + ")"
}
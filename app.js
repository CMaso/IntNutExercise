/*
 * general layout -- doValidation() is called when the submit button is clicked. It runs through each input validation test,
 * and if a field fails validation, saves an error message string for that field to the arrErrMsgs array. At the end, if there are any error messages,
 * it displays the error messages to the user below the form and does nothing further. If there are none, it calls processInputs().
 * 
 * processInputs() runs through each input value and manipulates it per the exercise's instructions, displaying those results
 * below the form as it goes. At the end, it puts the form input values into a JSON object and displays that object via console.log.
 * 
 * The rest of the functions (other than reset()) are being used either to format data or do calculations on data.
 */

//GLOBAL VARS -- form inputs and display divs 
var objFname = document.getElementById("firstName");
var objLname = document.getElementById("lastName");
var objFood = document.getElementById("favFood");
var objNum = document.getElementById("favNum");
var objDay = document.getElementById("favDay");
var objColor = document.getElementById("favColor");
var ErrMsgDiv = document.getElementById("errMsgs");
var resultsDiv = document.getElementById("results");

//MAIN FUNCTIONS
function doValidation() {//runs the specified validation tests on the six fields. If a field fails validation, then an error message for that field
	//is saved to attErrMsgs. Success or failure of overall validation is determined at the end by whether arrErrMsgs has any error messages or not.
	var arrErrMsgs = [];
	var strTempErrMsg = "";//reusable var to hold error message of each field's validation.

	ErrMsgDiv.innerHTML = "";//clear any previous error messages from screen
	resultsDiv.innerHTML = "";//clear any previous results from screen

	//first name cannot be blank
	strTempErrMsg = validateText(objFname, "First Name");
	if (strTempErrMsg != "") {//if an error message was returned, push it to arrErrMsgs
		arrErrMsgs.push(strTempErrMsg);
	}

	//last name cannot be blank
	strTempErrMsg = validateText(objLname, "Last Name");
	if (strTempErrMsg != "") {
		arrErrMsgs.push(strTempErrMsg);
	}

	//favorite food cannot be blank
	strTempErrMsg = validateText(objFood, "Favorite Food");
	if (strTempErrMsg != "") {
		arrErrMsgs.push(strTempErrMsg);
	}
	
	//favorite number can't be blank and must be numeric.
	//the value entered will only be a non-negative integer, since only numeric digits can be typed in the field, per the bonus requirement.
	//thus "." and "-" aren't allowed.  
	strTempErrMsg = validateNum(objNum);
	if (strTempErrMsg != "") {
		arrErrMsgs.push(strTempErrMsg);
	}
	
	//favorite day must be one of the options other than the first "--please select--" option.
	strTempErrMsg = validateSelect(objDay, "Favorite Day");
	if (strTempErrMsg != "") {
		arrErrMsgs.push(strTempErrMsg);
	}

	//favorite color must be one of the options other than the first "--please select--" option.
	strTempErrMsg = validateSelect(objColor, "Favorite Color");
	if (strTempErrMsg != "") {
		arrErrMsgs.push(strTempErrMsg);
	}

	//if there are no error messages, validation was successful. Call processInputs() to do the required manipulations and display on screen.
	if (arrErrMsgs.length == 0) {
		processInputs();
		return true; // not necessary, but a function should have some sort of return value. 
	}
	else {//if there are 1 or more error messages, validation failed. Display error messages to user and do nothing further.
		for (var i=0; i<arrErrMsgs.length; i++) {
			ErrMsgDiv.innerHTML = ErrMsgDiv.innerHTML + arrErrMsgs[i] + "<br />";
		}
		return false;
	}	
}

function processInputs() {//do required manipulations to input data and display 
	//first name -- add space after each letter except last
	//last name -- reverse order of letters
	//fav food -- ascii values and sum
	//fav number -- find 2nd highest factor
	//fav day -- dates of next 6 occurrences
	//fav color -- hex value + 15px square filled by color
	//log all form inputs to console as JSON object

	resultsDiv.innerHTML = "<span style='text-decoration:underscore; color:#0000ff;'>Outputs:</span><br />";
	//first name
	var fnameStripped = objFname.value.replace(/\s+/g, '');//strip out all whitespace
	var arrFnameLetters = fnameStripped.split();//put all letters into an array so can use join method
	var str = arrFnameLetters.join(" ");//use join() method of array to create a list of the letters, delimited by " " 

	resultsDiv.innerHTML = resultsDiv.innerHTML + "<span class='resultsLabel'>First Name:</span> " + str + "<br />";//display first name with blanks between letters on screen 
	
	
	//last name
	var lnameStripped = objLname.value.replace(/\s+/g, '');//strip out all whitespace

	lnameStripped = reverse(lnameStripped);//put letters in reverse order
	resultsDiv.innerHTML = resultsDiv.innerHTML + "<span class='resultsLabel'>Last Name:</span> " + lnameStripped + "<br />";
	
	
	//favorite food
	//get ascii character of each letter, display as "[code1]+[code2]+... = [sum of all]"
	// per bonus requirement, recurring letters will be expressed as "[code]x[number of occurrences]"
	favFoodStripped = objFood.value.replace(/\s+/g, '');
	var arrAscii = [];
	var arrElementCounts;
	var asciiString = "";
	var plus = "+";
	var sum = 0;
	
	//since I need the sum of all the ascii codes, it makes sense here to use a loop instead of the split/join trick used in firstName
	for (var i=0; i<favFoodStripped.length; i++) {
		if (i == favFoodStripped.length - 1) {//change plus from "+" to empty string for last code
			plus = "";
		}
		asciiString = asciiString + favFoodStripped.charCodeAt(i) + plus;
		sum = sum + favFoodStripped.charCodeAt(i);
	}

	//do bonus -- go over asciiString and put "xN" where N is the number of times the ascii code occurs in the string
	arrAscii = asciiString.split("+");//put all ascii codes into an array
	
	
	arrElementCounts = countElements(arrAscii);//countElements returns an array with 2 arrays. First array is all the codes in arrAscii,
	//second array is number of occurrences for each. Thus, a[x] is the code, and b[x] is number of occurrences. 

	asciiString = "";
	plus = "+";
	
	for (var i=0; i<arrElementCounts[0].length; i++) {
		if (i == arrElementCounts[0].length - 1) {
			plus = "";
		}

		if (arrElementCounts[1][i] == 1) {// for single occurrences
			asciiString = asciiString + arrElementCounts[0][i] + plus;
		}
		else {//for multiple occurrences
			asciiString = asciiString + arrElementCounts[0][i] + "x" + arrElementCounts[1][i] + plus;
		}
	}
	asciiString = asciiString + "=" + sum;
	resultsDiv.innerHTML = resultsDiv.innerHTML + "<span class='resultsLabel'>Favorite Food:</span> " + asciiString + "<br />";
	
	
	//favorite number
	//get second greatest factor for favorite number (i.e., the greatest other than itself
	var factor = getFactor(objNum.value);
	resultsDiv.innerHTML = resultsDiv.innerHTML + "<span class='resultsLabel'>Favorite Number:</span> " + addCommas(factor) + "<br />";
	
	
	//favorite day
	//display the dates of the next 6 dates of that day (i.e., not including current date) in a list
	
	// first get a date object that is the next occurrence of favorite day
	var today = new Date();
    var resultDate = new Date();
    var arrDates = [];
    
    if (objDay.value == today.getDay()) {//if favorite day is same as today, then next occurrence is 7 days from now 
    	resultDate.setDate(today.getDate() + 7);
    }
    else {// use modulus to find the next date of favorite day
    	resultDate.setDate(today.getDate() + (7 + objDay.value - today.getDay()) % 7);
    }
    
    //second, push that occurrence to arrDates, then loop 5 times to get the next 5 occurrences of the favorite day, and push them as well
    arrDates.push(formatDate(resultDate));

    for (var i=1; i<=5; i++) {
    	arrDates.push(formatDate(resultDate.setDate(resultDate.getDate() + 7)));
    }
    
    resultsDiv.innerHTML = resultsDiv.innerHTML + "<span class='resultsLabel'>Favorite Date:</span> " + arrDates.join(", ") + "<br />";

    
    //favorite color
    //display a 15px x 15px box of favorite color, and the favorite color's hex code
	resultsDiv.innerHTML = resultsDiv.innerHTML + "<span class='resultsLabel'>Favorite Color:</span><div class='colorDiv' style='background-color:" + objColor.value + "'></div>" + objColor.value;
	
	//create JSON object of field values and log to the console
	var inputsJSON = {
		    "userInputs": [
		                  {
		                      "firstName": objFname.value,
		                      "lastName": objFname.value,
		                      "favoriteFood": objFood.value,
		                      "favoriteNumber": objNum.value,
		                      "FavoriteDay": objDay.value,
		                      "favoriteColor": objColor.value
		                  }
		              ]
		          };
	console.log(JSON.stringify(inputsJSON));
}

function reset() {//called by reset button, so user doesn't have to refresh the page to input another set of data
	objFname.value = "";
	objLname.value = "";
	objFood.value = "";
	objNum.value = "";
	objDay.value = "";
	objColor.value = "";
	ErrMsgDiv.innerHTML = "";
	resultsDiv.innerHTML = "";
}

//ANCILLARY FUNCTIONS

//***validation-related***

function validateText(obj, strObjName) {//used for firstName, lastName, and favorite food. Make sure the field input value,
	//when stripped of all whitespace, isn't an empty string. Return strErrMsg as either empty string (success) or
	//error message (failure) 
	var strErrMsg = "";
	var val = obj.value;
	
	val = val.replace(/\s+/g, '');//strip all whitespace
	
	if (val.length == 0) {
		strErrMsg = strObjName + " cannot be blank";
	}
	return strErrMsg;
}

function validateNum(obj){//used for favorite number. The field won't allow non-numeric keystrokes, so here it's really just making sure
	//that the field wasn't left blank
 
	if (!isNumeric(obj.value)){
		return "Favorite Number must be a number";
	}
	return "";
}

function isNumeric(n) {//used in validateNum() above
    return !isNaN(parseFloat(n)) && isFinite(n); 
}

function isNumber(evt) {//used for favorite number. Allows only numeric keystrokes
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function validateSelect(obj, strObjName) {//Used for favorite day and favorite color. Ensures that an option other than the
	//"--please select--" option was chosen. 
	var strErrMsg = "";

	if(obj.value == "") {
		strErrMsg = strObjName + " must be a valid selection";
	}
	return strErrMsg;
}


//***output-related***

function reverse(s) {//used for last name ouput. Reverses the letter order using split/join trick.
	  return s.split('').reverse().join('');
}


function countElements(arr) {//Used for favorite food, to do bonus requirement. Returns an array with 2 arrays - a is unique elements in arr, and b is number of occurrences of each element
	//so for an array [11,11,11,25], the return would be [ [11,25] [3,1] ]
    var a = []; 
    var b = [];
    var prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

function getFactor(x){ //Used for favorite number output. Uses modulus to find the highest number less than x that is a factor of x.
	if (x==1) {//special cases: 1st factor of 1 less than 1 is -1. Only factor of 0 is 0. 
		return -1;
	}
	else if (x==0) {
		return x;
	}
    for (var i=x-1; i>-1; i--){
       if (x % i == 0){ 
          return i;
       }
    }
 }

function addCommas(nStr) {//used for favorite number to add commas to the output number
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function formatDate(date) {//used for favorite day, to put output dates in mm/dd/yy format
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear().toString().substr(2,2);

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}
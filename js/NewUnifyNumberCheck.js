/*
 *  20200511 By George
 *  
 *  
 */
charset="big5"
function NewUnifyNumber (){}

NewUnifyNumber.Check = function(){
	var resourceNumber = arguments[0];

    if(typeof(resourceNumber)=="undefined" || resourceNumber.length != 10){
      return false;
    }

    //統一證號第1碼根據國民身分證代號換算數字表轉換為數字
	var firstLetter = resourceNumber.substring(0,1).toUpperCase();
	if(firstLetter < "A" || firstLetter > "Z"){
		return false
	}
	var firstNumber = this.TransLetterToNumber(firstLetter);
	
	var otherLetter = resourceNumber.substring(1);
    

    resourceNumber = firstNumber + otherLetter;
    

   	if(!(/^\d+$/.test(resourceNumber))){
   		return false
   	}
   	
   	//特定數
    var constantNumber = "1987654321";
    
    //將10碼統號各乘以對應特定數，在各取其個位數相加得一基數
    var number = 0;
    for(var index =0; index < (resourceNumber.length - 1); index ++) {
     	var temp = (constantNumber.charAt(index) * resourceNumber.charAt(index));
    	temp = temp.toString();
    	try{
			temp = temp.charAt(temp.length-1);
		}catch(E){
			alert(E.getMessage());
		}

		number +=  eval(temp);
    }


    number = number.toString();
    

    var lastNumber = number.substring(number.length-1);
    
    var checkMark;

    checkMark = (lastNumber == 0)? 0 : (10 - lastNumber);
	
	//alert("NewUnifyNumber:"+resourceNumber);
	//alert("number:"+number);
	

	var unifyNumLast = resourceNumber.substring(resourceNumber.length-1);
	
	//alert("統編最後一碼:"+unifyNumLast + "\n檢查碼   :"+checkMark);


	return (checkMark == unifyNumLast);
}
  

  NewUnifyNumber.TransLetterToNumber = function(letter){
  	var number = "";
    switch(letter){
			case "A":
				number = "10";
				break;
			case "B":
				number = "11";
				break;
			case "C":
				number = "12";
				break;
			case "D":
				number = "13";
				break;
			case "E":
				number = "14";
				break;
			case "F":
				number = "15";
				break;
			case "G":
				number = "16";
				break;
			case "H":
				number = "17";
				break;
			case "I":
				number = "34";
				break;
			case "J":
				number = "18";
				break;
			case "K":
				number = "19";
				break;
			case "L":
				number = "20";
				break;
			case "M":
				number = "21";
				break;
			case "N":
				number = "22";
				break;
			case "O":
				number = "35";
				break;
			case "P":
				number = "23";
				break;
			case "Q":
				number = "24";
				break;
			case "R":
				number = "25";
				break;
			case "S":
				number = "26";
				break;
			case "T":
				number = "27";
				break;
			case "U":
				number = "28";
				break;
			case "V":
				number = "29";
				break;
			case "W":
				number = "32";
				break;
			case "X":
				number = "30";
				break;
			case "Y":
				number = "31";
				break;
			case "Z":
				number = "33";
				break;
    }
    return number;
  }
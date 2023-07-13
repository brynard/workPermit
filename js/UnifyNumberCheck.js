/*
 *  20060829 By Daniel
 *  �ˬd�Τ@�Ҹ��榡�O�_���T
 *  
 */
charset="big5"
function UnifyNumber (){}

UnifyNumber.Check = function(){
		var resourceNumber = arguments[0];

    if(typeof(resourceNumber)=="undefined" || resourceNumber.length != 10){
      return false;
    }

		//���o�Ĥ@�X,�p�G�O�^��r���h�ഫ���������Ʀr,�_�h���ˬd���q�L
		var firstLetter = resourceNumber.substring(0,1).toUpperCase();
		if(firstLetter < "A" || firstLetter > "Z"){
			return false
		}
		var firstNumber = this.TransLetterToNumber(firstLetter);
		
		//���o�ĤG�X,�p�G�O�^��r���h�ഫ���������Ʀr,�_�h���ˬd���q�L
		var secondLetter = resourceNumber.substring(1,2).toUpperCase();
		if(secondLetter < "A" || secondLetter > "Z"){
			return false
		}
		var secondNumber = this.TransLetterToNumber(secondLetter);
		
		//���o�ĤT�X���᪺�r��
		var otherLetter = resourceNumber.substring(2);
    
    //���s�զX�X�ഫ�^��᪺�r��
    resourceNumber = firstNumber + secondNumber.substring(1) + otherLetter;
    
    //�ˬd���ի᪺�r��O�_���O�Ʀr
   	if(!(/^\d+$/.test(resourceNumber))){
   		return false
   	}
   	
   	//�w��
    var constantNumber = "1987654321";
    
    //�Ӧ�Ʋ֥[�`�M
    var number = 0;
    for(var index =0; index < (resourceNumber.length - 1); index ++) {
     	var temp = (constantNumber.charAt(index) * resourceNumber.charAt(index));
    	temp = temp.toString();
    	try{
    		//���o�Ӧ��
				temp = temp.charAt(temp.length-1);
			}catch(E){alert(E.getMessage());}
			//�Ӧ�ƪ��֥[
			number +=  eval(temp);
    }

    //�N�֥[�`�M�ഫ���r��
    number = number.toString();
    
    //���o�֥[�`�M���̫�@�X
    var lastNumber = number.substring(number.length-1);
    
    var checkMark;
    //�p�G�̫�@�X�O 0 ,�h�N�ˬd�X��Ȭ� 0
    checkMark = (lastNumber == 0)? 0 : (10 - lastNumber);
	
		//alert("unifyNumber:"+resourceNumber);
		//alert("number:"+number);
		
		//���o�Τ@�Ҹ��̫�@�X
		var unifyNumLast = resourceNumber.substring(resourceNumber.length-1);
		
		//alert("�Τ@�Ҹ��̫�@�X:"+unifyNumLast + "\n�ˬd�X   :"+checkMark);
	
		//�^���ˬd���G
		return (checkMark == unifyNumLast);
  }
  
  //�^�ǭ^��r�Ź������Ʀr
  UnifyNumber.TransLetterToNumber = function(letter){
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
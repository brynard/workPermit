jQ(function(){
	jQ("body").append("<div id=\"dialog-message2\" style=\"display:none;\"><p></p></div>");
	//修改歷史紀錄，避免重新提交表單
	window.history.replaceState(null, null, window.location.href);
});

String.prototype.Trim = function() 
{ 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt, from) {
	var len = this.length >>> 0;
	var from = Number(arguments[1]) || 0;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0) from += len;
	for (; from < len; from++) {
	if (from in this && this[from] === elt) return from;
	}
	return - 1;
	};
}

if(typeof String.prototype.endsWith !== "function") {
    /**
     * String.prototype.endsWith
     * Check if given string locate at the end of current string
     * @param {string} substring substring to locate in the current string.
     * @param {number=} position end the endsWith check at that position
     * @return {boolean}
     *
     * @edition ECMA-262 6th Edition, 15.5.4.23
     */
    String.prototype.endsWith = function(substring, position) {
        substring = String(substring);

        var subLen = substring.length | 0;

        if( !subLen )return true;//Empty string

        var strLen = this.length;

        if( position === void 0 )position = strLen;
        else position = position | 0;

        if( position < 1 )return false;

        var fromIndex = (strLen < position ? strLen : position) - subLen;

        return (fromIndex >= 0 || subLen === -fromIndex)
            && (
                position === 0
                // if position not at the and of the string, we can optimise search substring
                //  by checking first symbol of substring exists in search position in current string
                || this.charCodeAt(fromIndex) === substring.charCodeAt(0)//fast false
            )
            && this.indexOf(substring, fromIndex) === fromIndex
        ;
    };
}

/*
 * 將參數拆解，避免xss問題
 */
function rePaserToUrl(toUrl){
	//Control?function=RunAction&_action=extlCode20/extlCode20_qp.xml&q_kind=xxx
	//var params = toUrl.replace("Control?function=RunAction&","").split("&");
	//var jsonUrl = JSON.parse('{"' + decodeURI(toUrl.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
	//console.log("jsonUrl==>"+jsonUrl);
	
	//JSON.stringify(jsonUrl);
	return encodeURIComponent(toUrl);
}

function doActionSubmit(action,toNext,toUrl)
{
	if(action=="save"){
		var msg = "請確認是否儲存？Do you wish to save the data?";
		doActionSubmitCore(msg,toUrl);
	}else if(action=="edit"){
		var msg = "請確認是否完成編輯？Do you wish to edit the data?";
			doActionSubmitCore(msg,toUrl);
	}else{
		if(toUrl)
		{
			document.myform._toUrl.value = rePaserToUrl(toUrl);
		}
		document.myform.submit();
	}
	
}

function doActionDelete(action,toNext,toUrl)
{
	var msg = "請確認是否刪除？Do you wish to delete the data?";
	doActionSubmitCore(msg,toUrl);
}

function doActionSubmitCore(msg,toUrl){
	confirmDialog(msg, function() {
		if(toUrl)
		{
			document.myform._toUrl.value = rePaserToUrl(toUrl);
		}
		document.myform.submit();
	});
}

function doNext(actionId)
{
	jQ("#_event").val("");
	document.myform.toActionId.value = actionId;
	document.myform.submit();			    	
}

function doCancel()
{
	//doExit();
}

function doReload()
{
	jQ("#_event").val("");
	document.myform.submit();			    	
}

/*
function doExit()
{
	location.href="/wSite/Control?function=ReceivePage";
}
*/

function openPopWindow(page,width,height)
{
	var w = 600;
	var h = 400;
	if (width) w = width;
	if (height) h = height;
	
	page = page.replace(/&/g,'AND_SYMBOL');
	page = page.replace(/\?/g,'QUESTION_MARK');	
	var url = top.contextPath+"/wSite/common/PopWindow.jsp?page="+page;	
    var tmp = window.showModalDialog(url, top, "dialogHeight:"+ h +"px;dialogWidth:"+ w +"px;scroll:no;status:no;help:no;resizable:yes");
    return tmp;
}


function disableAllChild()
{
	jQ("input[type=text]").each(function(){
		jQ(this).attr("readonly",true);
		jQ(this).css("background-color","#DCDCDC");
	});
	jQ("input[type=radio],input[type=checkbox],select").each(function(){
		jQ(this).attr("disabled",true);
	});
	
	jQ("input[type=button],.ui-datepicker-trigger,.dhtmlxToolbar_dhx_blue").each(function(){
		//jQ(this).hide(); //add 99014 20130905
	});
	jQ("img.check").each(function(){
		jQ(this).removeAttr("onclick");
	});
	jQ("input[type=file]").each(function(){
		jQ(this).attr("disabled",true);
	});
}

function enableObj(obj)
{
	obj.disabled=false;
    obj.style.backgroundColor="";
}

function disableObj(obj)
{
    obj.disabled = true;
    //if(obj.tagName)
    obj.style.backgroundColor="#c0c0c0";
}

function doOpenUrl(title)
{
	obj = event.srcElement ? event.srcElement : event.target;
	var url = "";
	if(obj.getAttribute("refurl"))
	{
		url = obj.getAttribute("refurl").Trim();
	}
	
	var win = window.open(url, title, "height=600,width=800");
}

var winObj=null;
function showImgToNewWindow(obj,id,url)
{
	var dataObj = obj.getItem(id).data.dataObj;
	var fileName = dataObj.getAttribute("name");
		
	var imgSrcFull = fileName;
	var imgUrl = url +"/"+ imgSrcFull;
	
	winObj= window.open("photoViewer.jsp?img="+imgUrl,"檔案速覽視窗 An Overview of Documents",'width='+window.screen.width+',height='+window.screen.height+',menubar=no,scrollbars=no,resizable=yes');
}

//On KeyUp Function (digit)
function check_digit(obj)
{
	obj.value=obj.value.replace(/[^\d]/g,'');
}

//On KeyUp Function (alphanumeric)
function check_alpha(obj){
	obj.value=obj.value.replace(/[^\da-zA-Z\-]/g,'');
}

//On KeyUp Function (float)
function check_float(obj, size)
{
    var str = "";
    var dot = 0;

    dot = obj.value.indexOf(".") != -1 ? obj.value.indexOf(".") + (1 + size) : obj.value.length;

    for(var i = 0; i < dot; i++){
        if(obj.value.charAt(i) >= '0' && obj.value.charAt(i) <= '9' || (obj.value.charAt(i) == '.' && i < dot - 1 && str.indexOf(".") == -1)){
            str += obj.value.charAt(i)
        }
        
        if((i==0)&&(obj.value.charAt(i)=='-'))
        {
        	str += obj.value.charAt(i)
        }        
    }

    if(obj.value != str){
        obj.value = str;
    }
}

//Check Is Null
function check_isNull(obj,code)
{
	Trim(obj.value);
	
	if(!jQ(obj).is(":visible")){
		return false;
	}
	
	if(jQ(obj).first().attr("type") == 'radio' || jQ(obj).first().attr("type") == 'checkbox'){
		if(jQ("input[name='"+jQ(obj).first().attr('name')+"']:checked").length == 0){
			popupMessageAndFocus(jQ(obj).get(0),code + "欄位不應為空值，請確認！This field should not be empty. Please confirm!");
			return true;
		}
		
	}else if(obj.value == "")
	{	
		popupMessageAndFocus(obj,code + "欄位不應為空值，請確認！This field should not be empty. Please confirm!");
		
		return true;
	}
	return false;
}

function rTrim(s)
{
    var i;
	
    for(i = s.length - 1; i >= 0; i--)
    {
        if(s.charAt(i) != ' ')
        {
            break;
        }
    }
    return(s.substring(0, i + 1));
}

function lTrim(s)
{
    var i;
    for(i = 0; i < s.length; i++)
    {
        if(s.charAt(i) != ' ')
        {
            break;
        }
    }
    return(s.substring(i, s.length));
}

function Trim(s)
{
    if(s == null) return s;
    return(lTrim(rTrim(s)));
}

function toUpper()
{
    if(window.event){
       if(window.event.keyCode == 34 || window.event.keyCode == 39 || window.event.keyCode == 44 || window.event.keyCode == 92 || window.event.keyCode == 38 || window.event.keyCode == 63){
           return false;
       }
       if(window.event.keyCode >= 97 && window.event.keyCode <= 122){
            window.event.keyCode -= 32;
       }
    }

    return true;
}

function toLower()
{
    if(window.event){
       if(window.event.keyCode == 34 || window.event.keyCode == 39 || window.event.keyCode == 44 || window.event.keyCode == 92 || window.event.keyCode == 38 || window.event.keyCode == 63){
           return false;
       }
       if(window.event.keyCode >= 65 && window.event.keyCode <= 90){
            window.event.keyCode += 32;
       }
    }

    return true;
}

function IsInt(objStr,sign,zero)
{
    var reg;    
    var bolzero;    

    if(Trim(objStr)=="")
    {
        return false;
    }
    else
    {
        objStr=objStr.toString();
    }
    
    if((sign==null)||(Trim(sign)==""))
    {
        sign="+-";
    }

    if((zero==null)||(Trim(zero)==""))
    {
        bolzero=false;
    }
    else
    {
        zero=zero.toString();
        if(zero=="0")
        {
            bolzero=true;
        }
    }

    switch(sign)
	{
        case "+-":
            reg=/(^-?|^\+?)\d+$/;
            break;
        case "+":
            if(!bolzero)
            {
                reg=/^\+?[0-9]*[1-9][0-9]*$/;
            }
            else
            {
                reg=/^\+?[0-9]*[0-9][0-9]*$/;
            }
            break;
        case "-":
            if(!bolzero)
            {
                reg=/^-[0-9]*[1-9][0-9]*$/;
            }
            else
            {
                reg=/^-[0-9]*[0-9][0-9]*$/;
            }
            break;
        default:
            return false;
            break;
    }

    var r=objStr.match(reg);
	if(r==null)
    {
        return false;
    }
    else
    {        
        return true;     
    }
}

function IsFloat(objStr,sign,zero)
{
    var reg;    
    var bolzero;    

    if(Trim(objStr)=="")
    {
        return false;
    }
    else
    {
        objStr=objStr.toString();
    }    

    if((sign==null)||(Trim(sign)==""))
    {
        sign="+-";
    }

    if((zero==null)||(Trim(zero)==""))
    {
        bolzero=false;
    }
    else
    {
        zero=zero.toString();
        if(zero=="0")
        {
            bolzero=true;
        }
    }

    switch(sign)
    {
        case "+-":
            reg=/^((-?|\+?)\d+)(\.\d+)?$/;
            break;
        case "+": 
            if(!bolzero)           
            {
                reg=/^\+?(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            }
            else
            {
                reg=/^\+?\d+(\.\d+)?$/;
            }
            break;
        case "-":
            if(!bolzero)
            {
                reg=/^-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            }
            else
            {
                reg=/^((-\d+(\.\d+)?)|(0+(\.0+)?))$/;
            }            
            break;
        default:
            return false;
            break;
    }

    var r=objStr.match(reg);
    if(r==null)
    {
        return false;
    }
    else
    {        
        return true;
    }
}

function clearSelect(selectObj)
{
	if (!selectObj||!selectObj.options)
	{
		return;
	}
	
	for(var i=selectObj.options.length-1;i>=0;i--)
	{
		selectObj.options.remove(i);
	}	
}

function addSelectOption(selectObj,text,val)
{
	if (!text) text = "";
	if (!val) val = text;
	var oOption = document.createElement("OPTION");
	selectObj.options.add(oOption);
	oOption.innerText = text;
	oOption.value = val;
}

//檢查欄位長度
function check_length(obj)
{
	if(!obj || jQ(obj).val()==""){
		return;
	}
	var min = jQ(obj).attr("minlength") == '' ? 0 : eval(jQ(obj).attr("minlength"));
	var max = jQ(obj).attr("maxlength") == '' ? 5000 : eval(jQ(obj).attr("maxlength"));
	
	obj.value = Trim(obj.value);
	var val = obj.value;
	
	if(val.length < min || val.length > max)
	{
		popupMessageAndFocus(obj, "欄位長度不符(目前資料長度"+val.length+",最小長度"+(min==0?"無限制":min)+",最大長度"+(max==5000?"無限制":max)+")");
	}
}

//檢查email
function check_email(obj)
{
	//var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
	
	Trim(obj.value);
	if(obj.value != "" && !reg.test(obj.value))
	{
		popupMessageAndFocus(obj, "輸入格式不符，請重新輸入電子郵件 !The e-mail address format is incorrect, please enter a valid email address.");
	}
}

//檢查身份證號/統一編號
function check_idno(obj)
{
	var reg;	

	Trim(obj.value);
	obj.value = obj.value.toUpperCase();
	var foreignFormat = /^[A-Z][A-D]\d{8}$/;
	if(obj.value.length == 8) //統一編號
	{
		reg = /^[0-9]{8}$/;
		if(obj.value != "" && !reg.test(obj.value)) 
		{
			popupMessageAndFocus(obj, "輸入格式不符，請重新輸入統一編號 !The Unified business no. format is incorrect, please enter again.");
		}		
	}
	else if(foreignFormat.test(obj.value)) //居留證號(外國人)
	{
		if(obj.value != "" && !checkForeignIDNO(obj.value)) 
		{
			popupMessageAndFocus(obj, "輸入格式不符，請重新輸入身份證號/居留證號!The ARC number format is incorrect, please enter again.");
		}		
	}else //身份證號
	{
		if(obj.value != "" && !checkNormalIDNO(obj.value)) 
		{
			popupMessageAndFocus(obj, "輸入格式不符，請重新輸入身份證號/居留證號!The User ID format is incorrect, please enter again.");
		}		
	}
}

//身分證號
function checkNormalIDNO(idno) {
    idno = idno.toUpperCase();
    // 檢查基本格式
    var normalFormat = /^[A-Z]\d{9}$/;
    if(idno != '' && normalFormat.test(idno)) {
        var idnoArray = new Array(10);
        for(var i = 0; i < 10; i ++) {
            idnoArray[i] = idno.substring(i, i + 1);
        }
       
        // 檢查第一碼
        idnoArray[0] = transIDNOLetter(idnoArray[0]);
        var sum = parseInt(idnoArray[0].substring(0, 1));
        idnoArray[0] = idnoArray[0].substring(1, 2);
       
        for(var i = 0; i < 9; i ++) {
            sum += parseInt(idnoArray[i]) * (9 - i);
        }
       
        var lastCheck = (10 - (sum % 10));
        if((lastCheck % 10) == parseInt(idnoArray[9]))
            return true;
    }
   return false;
}

//居留證號
function checkForeignIDNO(idno) {
    idno = idno.toUpperCase();
    var foreignFormat = /^[A-Z][A-D]\d{8}$/;
    if(foreignFormat.test(idno)) {
        var idnoArray = new Array(10);
        for(var i = 0; i < 10; i ++)
            idnoArray[i] = idno.substring(i, i + 1);
       
        idnoArray[0] = transIDNOLetter(idnoArray[0]);
        idnoArray[1] = transIDNOLetter(idnoArray[1]);
       
        var sum = parseInt(idnoArray[0].substring(0, 1));
       
        idnoArray[0] = idnoArray[0].substring(1, 2);
        idnoArray[1] = idnoArray[1].substring(1, 2);
       
        for(var i = 0; i < 9; i ++) {
            sum += (parseInt(idnoArray[i]) * (9 - i)) % 10;
        }
       
        var lastCheck = (10 - (sum % 10));
        if((lastCheck % 10) == parseInt(idnoArray[9]))
            return true;
    }
    return false;
}

//檢查密碼
function check_pwd(obj){
	
	if(!obj || jQ(obj).val()==""){
		return;
	}
	
	var min = jQ(obj).attr("minlength") == '' ? 0 : eval(jQ(obj).attr("minlength"));
	var max = jQ(obj).attr("maxlength") == '' ? 5000 : eval(jQ(obj).attr("maxlength"));
	
	var val = obj.value;	
	
	if(val.length < min || val.length > max)
	{
		popupMessageAndFocus(obj, "欄位長度不符(目前資料長度"+val.length+",最小長度"+(min==0?"無限制":min)+",最大長度"+(max==5000?"無限制":max)+")");
		return;
	}
	
	var reg1 = /[a-zA-z]+/;
	var reg2 = /[0-9]+/;
	var reg3 = /[()\[\]{}<>+\-*/?.,:;"'_\|~`!@#$%^&=]+/;
	if(!reg1.test(obj.value) || !reg2.test(obj.value) || !reg3.test(obj.value)){
		popupMessageAndFocus(obj, "密碼制定規則：需有英文、數字、特殊符號。Please set your registration system password  containing English letter, number and special symbol");
		return;	
	}
		
}

function check_mobile(obj){
	if(!obj || jQ(obj).val()==""){
		return;
	}
	
	var min = jQ(obj).attr("minlength") == '' ? 0 : eval(jQ(obj).attr("minlength"));
	var max = jQ(obj).attr("maxlength") == '' ? 5000 : eval(jQ(obj).attr("maxlength"));
	
	var val = obj.value;
	
	if(val.length < min || val.length > max)
	{
		popupMessageAndFocus(obj, "欄位長度不符(目前資料長度"+val.length+",最小長度"+(min==0?"無限制":min)+",最大長度"+(max==5000?"無限制":max)+")");
		return;
	}			
	
//	var reg1 = /^09+/;
//	var reg2 = /[0-9]+/;
//	var reg3 = /[ \d\(\)\-#]+/;
//	if(!reg3.test(obj.value)){
//		popupMessageAndFocus(obj, "行動電話規則：僅接受輸入09開頭且全數字的號碼。(ex:0922123456)");
//		return;	
//	}
	var reg1 = /^09[\d]{8}$/g;
	var reg2 = /^09[\d]{2}\-[\d]{3}\-[\d]{3}$/g;
	if(!reg1.test(obj.value) && !reg2.test(obj.value)){
		popupMessageAndFocus(obj, "行動電話規則：僅接受輸入09開頭的號碼。(ex:0922123456 or 0922-123-456)");
		return;
	}
}

function transIDNOLetter(letter){
	var ALP_STR = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
	var NUM_STR = new Array("10",11,12,13,14,15,16,17,34,18,19,20,21,22,35,23,24,25,26,27,28,29,32,30,31,33);
	
	for(var i=0;i<ALP_STR.length;i++){
		if(ALP_STR[i] == letter){
			letter = NUM_STR[i].toString();
		}
	}
	
	return letter;
}

function popupMessageAndFocus(obj, msg)
{
	jQ("#dialog-message2 p").html(msg).find("br").remove();
	jQ("#dialog-message2").dialog({
		resizable: false,
		modal: true,
		title: "提示訊息 Prompt Message",
		buttons: {
			Ok: function() {
				jQ(this).dialog("close");
				obj.focus();
			}
		}
	});
}

function popupMessage(msg, param)
{
	if(param)
	{
		msg = msg + "<br>" + param;
	}
	
	jQ("#dialog-message2 p").empty();
	jQ("#dialog-message2 p").append(msg);
	jQ("#dialog-message2").dialog({
		resizable: false,
		modal: true,
		title: "系統訊息 System Message",
		width: 400,
		buttons: {
			Ok: function() {
				jQ(this).dialog("close");
			}
		}
	});	
}

function confirmDialog(msg, func1, func2)
{
	jQ("#dialog-message2 p").text(msg);
	jQ("#dialog-message2").dialog({
		resizable: false,
		modal: true,
		title: "確認視窗 Window confirm",
		buttons: {
			"確認Yes": function() {
				jQ(this).dialog("close");
				if(func1){
					func1.call();
				}
			},
			"取消Cancel": function() {
				jQ(this).dialog("close");
				jQ(".layout_main").unmask();
				if(func2){
					func2.call();
				}
			}
		},
		create: function( event, ui ){ //M:67300
			 jQ(".ui-dialog").append("<iframe src='about:blank' class='cover'></iframe>");
		        jQ(".cover").css({
		        	'min-width': '100%',
		        	'min-height': '100%',       
		        	'overflow': 'hidden',
		        	'position': 'absolute',
		        	'border': 'none',
		        	'left': 0,
		        	'top':0,
		        	'z-index': -1
		       });	
		}
	});
}

function waitToDoDoc(){
	window.setTimeout('doDoc();',5000);
	return;
}

function sleep( seconds ) {
	var timer = new Date();
	var time = timer.getTime();
	do
		timer = new Date();
	while( (timer.getTime() - time) < (seconds * 1000) );
}

function newServiceInput(serviceName, operationName)
{
	var si = {};
	si.url = "../ActionServiceServlet";
	si.serviceName = serviceName;
	si.operationName = operationName;
	return si;
}



function getGridInitData(gridObj)
{
	var data = new Array();
	for(i=0;i<gridObj.getColumnsNum();i++)
	{
		var v = "";
		if(gridObj.getColType(i)=="ch") v=0;
		
		data[i] = v;
	}
	return data;
}


function newCalendar(objId){
	//showButtonPanel: true
	//年份區間修正，y-70 ~ y+10, by jerry 
	jQ("#"+objId ).datepicker({
		showButtonPanel: true,
		changeMonth: true,
		changeYear: true,
		showOn: "button",
		buttonImage: "js/jquery/themes/calendar-icon.png",
		buttonImageOnly: true,
		datepicker : jQ.datepicker.regional[ "zh-TW" ],
		dateFormat : "Rmmdd",
		yearRange: 'c-70:c+10'
	});

}

function newCalendarAD(objId){
	//showButtonPanel: true
	//年份區間修正，y-70 ~ y+10, by jerry 
	jQ("#"+objId ).datepicker({
		showButtonPanel: true,
		changeMonth: true,
		changeYear: true,
		showOn: "button",
		buttonImage: "js/jquery/themes/calendar-icon.png",
		buttonImageOnly: true,
		dateFormat : "yy/mm/dd",
		yearRange: 'c-70:c+10'
	});

}


function saveFile(fileName, degrees)
{
	var jQ = jQuery.noConflict();
	var serviceName = "com.hyweb.evta.service.action.ImageProcessService";
	var operationName = "rotate";
	
	
	var wpinNo;
	if(document.myform)
	{
		wpinNo = document.myform.wpinNo.value;
	}
	else if(window.opener.document)
	{
		wpinNo = window.opener.document.myform.wpinNo;
	}
	
	var si = new newServiceInput(serviceName,operationName);	
	si.wpinNo = wpinNo;
	si.fileName = fileName;
	si.degrees = degrees;
	
	var jqxhr = jQ.post( si.url, jQ.toJSON(si),
		function(so)
		{
			if(so.returnCode=="000000")
			{
				imgViewer.iviewer('loadImage', fileName);
				popupMessage("儲存成功 Save successfully");
			}
			else
			{
				popupMessage(so.returnCode);
			}
		}
		,"json");
}


var resetActSetting = {};

function getActSetting(/*string*/ caseName){
	var resetStr = resetActSetting[caseName];
	if(!resetStr){
		//common resetActSetting
		resetStr = "a3,a4,"+caseName+"-review01,XXXX-document,"+caseName+"-review,"+caseName+"-summary";
	}
	
	return resetStr;
}

function doStep1Submit()
{
	var actStatus = jQ("#_actionStatus").val();
	var caseName = jQ("#wpkind").val() + jQ("#wptype").val();
	//var resetStr = getActSetting(caseName);
	//if(actStatus=="C" && resetStr)
	if(actStatus=="C")
	{
		var msg = "請確認是否儲存此表單資枓並清除其餘Step的資訊？";
		confirmDialog(msg, function() {	
			var serviceName = "com.hyweb.evta.service.action.ResetActionData";
			var operationName = "resetActionData";
			var si = new newServiceInput(serviceName,operationName);
			si.instanceId = jQ("input[name='wpinNo']").val();
			si.step1ActionId = "a1";
			//si.actionId = resetStr;
			var jqxhr = jQ.post( si.url, jQ.toJSON(si),
			function(so)
			{
				if(so.returnCode=="000000")
				{
					document.myform.submit();
				}
				else
				{
					popupMessage(so.returnCode);
				}
			}
			,"json");
			
		});
		return;
	}
	else
	{
		doActionSubmit();
	}
}

/*
 * 以ajax方式查詢instance xml中是否有指定名稱的table；
 * 查詢結果會回存至jsonInput中，並以jsonInput為參數呼叫函數func，達到callback的效果。
 *
 * jsonInput: json object，必須包含instanceId、tableName兩個屬性
 * callback:callback 函數，供caller針對查詢結果進行後處理
 * 查詢結果:"true"表示xml中有table；"false"表示xml中沒有table；"error"表示input錯誤或暫時無法連線至server查詢
 */
function checkTableExist(jsonInput, callback){
	if(jsonInput.instanceId!=null&&jsonInput.tableName!=null&&typeof(callback)=="function"){
		var serviceName = "com.hyweb.evta.service.action.InstanceService";
		var operationName = "checkTableExist";
		var si = new newServiceInput(serviceName,operationName);
		si.instanceId = jsonInput.instanceId;
		si.tableName = jsonInput.tableName;
		var jqxhr = jQ.post( si.url, jQ.toJSON(si), function(so){
			//如果執行成功，至少可以從so裡取得四個參數值
			// so.serviceName , 呼叫的service class name
			// so.operationName , 呼叫的method名稱
			// so.returnCode , "000000" 表示執行成功，其它代碼表示執行失敗。
			// so.output , 取得所叫用的該method所回傳的物件
			// 如果回傳值是Map型別，可以直接 so.output.xxxx 取值
			// 如果回傳值是List型別，可以判斷 so.output.length 有幾筆資料
			if(so.returnCode=="000000"){
				var output = so.output;
				if (output.result=="true"){
					jsonInput.result="true";
				}
				else {
					jsonInput.result="false";
				}
				callback(jsonInput);
			}
			else{
				jsonInput.result="error";
				callback(jsonInput);
			}
		},"json");
	}
	else{
		jsonInput.result="error";
		func(jsonInput);
	}
	
}

function viewData(){
	var wpinno = jQ("input[name='wpinNo']:first").val();
	window.open('Control?function=RunCase&_mode=view&_flowStatus=C1&wpinNo='+  wpinno , '初審案件檢視', config='');
}

var dhtmlxGridList = new Array();
var dhtmlxGriIddList = new Array();
function dhtmlxGridserialize(){
	for(var i=0;i<dhtmlxGridList.length;i++){
		var myXmlStr = dhtmlxGridList[i].serialize();
		myXmlStr = myXmlStr.replace(/\&/g,'&amp;');
		document.getElementById(dhtmlxGriIddList[i]).value = myXmlStr;
	}
	
}

function check_wpinno(obj){
	var no = Trim(obj.value);
	//var reg = /^\d{10}$/;
	
	//if(no=='' || no==null || !reg.test(no)){
	//	return false;
	//}
	if(no.length != 10){
		return false;
	}
	
	return true;
}

//檢核日期
function checkdd(obj){
	var reg = /[\-\/]/ig;
	
	if(!obj || jQ(obj).val()==""){
		return false;
	}
	//jQ(obj).val(Trim(obj.value.replace(reg,"")));
	var dd = jQ(obj).val();
	if(dd.length!=2){
		alert("日期格式錯誤!wrong date format",
				function(){
					jQ(obj).focus();
				}
			);
			return;	
	}
	else {
		if(!(dd>0 && dd<32)){
			alert("日期區間錯誤!",
					function(){
						jQ(obj).focus();
					}
				);
				return;
		}
	}
	
}

//檢核月份
function checkmm(obj){
	var reg = /[\-\/]/ig;
	
	if(!obj || jQ(obj).val()==""){
		return false;
	}
	//jQ(obj).val(Trim(obj.value.replace(reg,"")));
	var mm = jQ(obj).val();

	if(mm.length!=2){
		alert("月份格式錯誤!wrong month format",
				function(){
					jQ(obj).focus();
				}
			);
			return;	
	}
	else {
		if (!(mm>0 && mm<13)){
	
		alert("月份區間錯誤!",
				function(){
					jQ(obj).focus();
				}
			);
			return;	
		}
	}
	
}

function checkYYYmm(obj){
	var regROC1 = /^\d{1,3}\d{2}$/;
	var reg = /[\-\/]/ig;
	
	if(!obj || jQ(obj).val()==""){
		return false;
	}
	jQ(obj).val(Trim(obj.value.replace(reg,"")));
	var val = jQ(obj).val();
	if((val.length!=5) || !regROC1.test(val)){
		alert("日期年月(民國yyymm)格式錯誤!wrong format",
			function(){
				jQ(obj).focus();
			}
		);
		return;				
	}else{
		var mm = -1;
		if(val.length==4){
			mm = parseInt(val.substring(2,4),10);
		}else if(val.length==5){
			mm = parseInt(val.substring(3,5),10);
		}
		
		if(!(mm>0 && mm<13)){
			alert("日期年月(民國yyymm)，月份格式錯誤!wrong month format",
					function(){
						jQ(obj).focus();
					}
				);
				return;			
		}
	}
	
}

function check_date(obj,ca){
	var reg = /\D/ig;
	var regAD1 = /^\d{4}\d{2}\d{2}$/;
	var regAD2 = /^\d{4}\/\d{2}\/\d{2}$/;
	var regROC1 = /^\d{1,3}\d{2}\d{2}$/;
	var regROC2 = /^\d{1,3}\-\d{2}\-\d{2}$/;
	var seprator = "-";
	var type = "";
	if(ca && ca.toUpperCase()== "AD"){
		seprator = "/";
		type = "AD";
	}
	
	if(!obj || jQ(obj).val()==""){
		return false;
	}
	jQ(obj).val(Trim(obj.value));
	
	var val = jQ(obj).val();
	if(type == "AD"){
		if(!regAD1.test(val) && !regAD2.test(val)){
			alert("日期格式錯誤(西元yyyyMMdd or yyyy/MM/dd)!wrong date format",
				function(){
					jQ(obj).focus();
				}
			);
			return;				
		}
	}else if(!regROC1.test(val) && !regROC2.test(val)){
		alert("日期格式錯誤(民國yyyMMdd or yyy-MM-dd)!wrong date format",
			function(){
				jQ(obj).focus();
			}
		);
		return;				
	}
	
	val = val.replace(reg,"");
	var len = val.length;
	var y="",m="",d="";
	if(len == 5){
		y = val.substr(0,1);
		m = val.substr(1,2);
		d = val.substr(3,2);
	}else if(len == 6){
		y = val.substr(0,2);
		m = val.substr(2,2);
		d = val.substr(4,2);				
	}else if(len == 7){
		y = val.substr(0,3);
		m = val.substr(3,2);
		d = val.substr(5,2);				
	}else if(len == 8){
		y = val.substr(0,4);
		m = val.substr(4,2);
		d = val.substr(6,2);				
	}
	
	jQ(obj).val(y + seprator + m + seprator + d);
	
}

/*
 * true : 不含全形字
 * false : 含全形字
 * */
function checkFullCase(str){
	if(!str){
		return true;
	}
	return !(/[^\x00-\xff]/g.test(str));
}
/*
 * block select,radio button
 * */

jQ(window).on("load",
	function (){
		try{
			jQ(".readonly_input").parent().block({ 
		        message: null, 
				overlayCSS:  { 
						opacity:         0, 
						cursor:          "default" 
					}
		    });
			
			document.myform.oldsubmit = document.myform.submit;
			document.myform.submit = function(){
				jQ("select[multiple] option").attr("selected",true);
				this.oldsubmit();
			};
			
			jQ(document.myform).submit(function() {
				jQ("select[multiple] option").attr("selected",true);
			});				
		}catch (e) {
			
		}	
		
	}	
);

/*
 * file download
 * */
function doDownload(path,name){
	window.open('DownloadServlet?filePath=' + path + '&fileName='+name, '下載 Download', config='');
	jQ(".layout_main").unmask();			
}

/*
 * multiple select add
 * */
function addOption(totalOp, selOp){
	  if (jQ("#"+totalOp+" option:selected").val() != null) {
		  var tempSelect = jQ("#"+totalOp+" option:selected").val();
		  jQ("#"+totalOp+" option:selected").remove().appendTo("#"+selOp);
		  jQ("#"+totalOp).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
		  jQ("#"+selOp).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
		  jQ("#"+selOp).val(tempSelect);
		  tempSelect = '';
	  }	
	}
	
/*
 * multiple select remove
 * */
function removeOption(totalOp, selOp){
  if (jQ("#"+selOp +" option:selected").val() != null) {
	  var tempSelect = jQ("#"+selOp+" option:selected").val();
	  jQ("#"+selOp+" option:selected").remove().appendTo("#"+totalOp);
	  jQ("#"+selOp).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
	  jQ("#"+totalOp).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
	
	  jQ("#"+totalOp).val(tempSelect);
	  tempSelect = '';
  }
}	

/*
 * 重新產生驗證碼
 * 
 */
function changeVrfyCode(id){
	var newId = (new Date()).valueOf();
	jQ('#'+id).attr('src','VerifyCodeServlet?rid='+newId)
}

function dateFormat(val){
    if(val==null) return val;
    val = val.replace(/^\s+|\s+$|-|\//g, '');
    if(val=="") return val;
    
    var reg = /^\d{4}\d{2}\d{2}$/;
    var reg_roc = /^\d{3}\d{2}\d{2}$/;
    var reg_roc1 = /^\d{2}\d{2}\d{2}$/;
    
    if(reg.test(val)){
        var yyyy = parseInt(val.substr(0,4))-1911;
        var mm = val.substr(4,2);
        var dd = val.substr(6,2);
        
        return yyyy + "-" + mm + "-" + dd;
    }else if(reg_roc.test(val)){
        var yyyy = parseInt(val.substr(0,3))+1911;
        var mm = val.substr(3,2);
        var dd = val.substr(5,2);
        
        return yyyy + "/" + mm + "/" + dd;	
    }else if(reg_roc1.test(val)){
        var yyyy = parseInt(val.substr(0,2))+1911;
        var mm = val.substr(2,2);
        var dd = val.substr(4,2);
        
        return yyyy + "/" + mm + "/" + dd;	
    }else{
    	
        return val;
    }
}

function check_textarea(obj, len){
	var str = jQ(obj).val();
	//var strLen = str.replace(/[^\x00-\xff]/g,"rr").length;
	var strLen = str.length;
	var fullwidthLen = 0;
	if(str.match(/[\uff00-\uffff]/g) != null){
		fullwidthLen = str.match(/[\uff00-\uffff]/g).length
	}
	strLen = fullwidthLen + strLen;
	var span = jQ(obj).parent().find("span");
	jQ(span[2]).html(strLen);
	jQ(span[5]).html(strLen);
	
	if(strLen > len){
		jQ(span[3]).html(0);
		jQ(span[6]).html(0);
		jQ(obj).css("color","#FF0000");
		jQ(span[0]).show();
		obj.focus();
	}else{
		jQ(span[3]).html(len-strLen);
		jQ(span[6]).html(len-strLen);
		jQ(obj).css("color","");
		jQ(span[0]).hide();
	}
	
	return true;
}

jQ(function() {
    //先設定預設西元年的datepicker必要功能
    var old_generateMonthYearHeader = jQ.datepicker._generateMonthYearHeader;
    var old_formatDate = jQ.datepicker.formatDate;
    var old_parseDate = jQ.datepicker.parseDate;
     
    jQ.extend(jQ.datepicker, {
        //選擇日期之後的value
        formatDate: function (format, date, settings) {
            var oformatDate = old_formatDate(format, date, settings);    
            if(format == 'Rmmdd'){
                var d = date.getDate();
                var m = date.getMonth()+1;
                var y = date.getFullYear();            
                var fm = function(v){            
               return (v<10 ? '0' : '')+v;
            };
            
            if((y - 1911) >= 100) {y = y - 1911 ;}else { y = "0" + String(y - 1911);}
                return (y) +'-'+ fm(m) +'-'+ fm(d);
            }
            return oformatDate;
            
        },
        //點取已存在日期的parse
        parseDate: function (format, value, settings) {
            var v = new String(value);
            var Y,M,D;
            if(format == 'Rmmdd'){
                if(v.length==7){/*1001215*/
                    Y = v.substring(0,3)-0+1911;
                 M = v.substring(3,5)-0-1;
                 D = v.substring(5,7)-0;
                 return (new Date(Y,M,D));
              }else if(v.length==6){/*0981215*/
                  
                  Y = "0" + String(v.substring(0,2)-0+1911);
                 M = v.substring(2,4)-0-1;
                 D = v.substring(4,6)-0;
                 return (new Date(Y,M,D));
                }
                 return (new Date());
           }else {
               var oparseDate = old_parseDate.apply(this, [format, value, settings]);
                return (oparseDate);
           }

         },
         //改變小工具的年
        _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,    secondary, monthNames, monthNamesShort) {
            var dateFormat = this._get(inst, "dateFormat");
            var htmlYearMonth = old_generateMonthYearHeader.apply(this, [inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort]);
            if(dateFormat == 'Rmmdd'){
                if (jQ(htmlYearMonth).find(".ui-datepicker-year").length > 0) {
                    htmlYearMonth = jQ(htmlYearMonth).find(".ui-datepicker-year").find("option").each(function (i, e) {
                        //console.log(e.value);
                        if (Number(e.value) - 1911 > 0) {jQ(e).text(Number(e.value) - 1911);}
                        
                    }).end().end().get(0).outerHTML;
                }
            }
            return htmlYearMonth;
        }
    });
});	


/*
 * 地址元件js
 * */
jQ(window).on("load",
		function(){
			jQ(".addr_field").each(
				function(idx,ele){
					getZipCode(jQ(ele).next("select:first"));
					if(jQ(ele).val()!= ''){
						applyZip(jQ(ele));
					}
				}
			);			
		}
	);
	
	function applyZip(obj){
		var serviceName = "com.hyweb.ewcf.action.CommonAjaxService";
		var operationName = "getCityZip";
		var si = new newServiceInput(serviceName,operationName);	
		si.zipcode = jQ(obj).val();
		if(jQ(obj).val() == ''){
			return;
		}
		jQ(".layout_main").mask("系統處理中...System processing...");
		var jqxhr = jQ.post( si.url, jQ.toJSON(si), function(so){
		　　	if(so.returnCode=="000000"){
				var output = so.output;
				jQ(obj).next("select:first").val(output.CITYCODE);
				if(jQ(obj).next("select:first").val() == ""){
					jQ(".layout_main").unmask();
				}
				jQ(obj).next("select:first").change();					
		　　	}
		　　	else{
			alert(so.returnCode);
				}
		},"json");				
		
	}
	
	function getZipCode(obj){
		jQ(obj).change(function() {
			var zipObj = obj;
			if(jQ(zipObj).val() != ""){					
				var serviceName = "com.hyweb.ewcf.action.CommonAjaxService";
				var operationName = "getCity_zipSelOption";
				var si = new newServiceInput(serviceName,operationName);	
				if(jQ(zipObj).val() == null){
					si.cityname = '00';
				}else{
					si.cityname = jQ(zipObj).val();
				}				
				
				jQ(".layout_main").mask("系統處理中...System processing...");
				
				var jqxhr = jQ.post( si.url, jQ.toJSON(si), function(so){
					jQ(".layout_main").unmask();
				　　	if(so.returnCode=="000000"){
						var output = so.output;
						jQ(zipObj).next("select:first").empty();
						jQ(zipObj).next("select:first").append("<option value=''>== 請選擇 ==</option>");
						for(i=0; i < output.length;i++){
							jQ(zipObj).next("select:first").append("<option value='"+output[i].ZIPCODE+"'>"+output[i].ZIPNAME+"</option>");																															
						}
						
						if(output.length == 1){
							//console.log(output.length)
							jQ(zipObj).next("select:first").find("option:eq(1)").attr("selected","selected");
							jQ(zipObj).next("select:first").trigger("change")
						}
						
						if(jQ(zipObj).next("select:first").children("option[value='"+jQ(zipObj).prev("input:first").val()+"']").length > 0){
							jQ(zipObj).next("select:first").val(jQ(zipObj).prev("input:first").val());
						}else{
							jQ(zipObj).prev("input:first").val("");
						}
				　　	}
				　　	else{
					alert(so.returnCode);
						}
				},"json");
			}
			else{
				jQ(zipObj).next("select:first").empty();
				jQ(zipObj).next("select:first").append("<option value=''>== 請選擇 ==</option>");
				jQ(zipObj).prev("input:first").val("");
			}
			
		});
	
		jQ(obj).next("select:first").change(function() {
			if(jQ(obj).next("select:first").val() != ""){
				jQ(obj).prev("input:first").val(jQ(obj).next("select:first").val());
			} else {
				jQ(obj).prev("input:first").val("");
			}
		});
	}	
	
	
/*
 * 傳入西元年yyyy/MM/dd,計算年齡
 */
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}	

/*
 * reportURL : 報表主機URL 
 * page : 報表頁面,必要參數
 * message : 雜湊值驗證用
 * token : 驗證資訊,可解密
 * cas_sn : 必要參數
 * cas_seq : 必要參數
 * format : 格式,無此參數時,會開起預覽頁面
 *  
 * */
function viewReport(reportURL, page, token, message, cas_sn, cas_seq, format){
	if(format){
		jQuery("<form/>", {
		    id: "evtaReport",
		    action: reportURL + "preview",
		    method: "post",
		    target: "_blank"
		}).appendTo("body");
		jQuery("<input/>", {
			type: "hidden",
		    id: "token",
		    name: "token",
		    value : token
		}).appendTo("#evtaReport");
		jQuery("<input/>", {
			type: "hidden",
		    id: "message",
		    name: "message",
		    value : message
		}).appendTo("#evtaReport");		
		jQuery("<input/>", {
			type: "hidden",
		    id: "cas_sn",
		    name: "cas_sn",
		    value : cas_sn
		}).appendTo("#evtaReport");		
		jQuery("<input/>", {
			type: "hidden",
		    id: "cas_seq",
		    name: "cas_seq",
		    value : cas_seq
		}).appendTo("#evtaReport");	
		jQuery("<input/>", {
			type: "hidden",
		    id: "__asattachment",
		    name: "__asattachment",
		    value : "true"
		}).appendTo("#evtaReport");
		jQuery("<input/>", {
			type: "hidden",
		    id: "__report",
		    name: "__report",
		    value : page
		}).appendTo("#evtaReport");
		jQuery("<input/>", {
			type: "hidden",
		    id: "__masterpage",
		    name: "__masterpage",
		    value : "true"
		}).appendTo("#evtaReport");	
		jQuery("<input/>", {
			type: "hidden",
		    id: "__locale",
		    name: "__locale",
		    value : "zh_TW"
		}).appendTo("#evtaReport");	
		jQuery("<input/>", {
			type: "hidden",
		    id: "__format",
		    name: "__format",
		    value : format
		}).appendTo("#evtaReport");			
		
	}else{
		jQuery("<form/>", {
		    id: "evtaReport",
		    action: reportURL + page,
		    method: "post",
		    target: "_blank"
		}).appendTo("body");
		jQuery("<input/>", {
			type: "hidden",
		    id: "token",
		    name: "token",
		    value : token
		}).appendTo("#evtaReport");
		jQuery("<input/>", {
			type: "hidden",
		    id: "message",
		    name: "message",
		    value : message
		}).appendTo("#evtaReport");		
		jQuery("<input/>", {
			type: "hidden",
		    id: "cas_sn",
		    name: "cas_sn",
		    value : cas_sn
		}).appendTo("#evtaReport");		
		jQuery("<input/>", {
			type: "hidden",
		    id: "cas_seq",
		    name: "cas_seq",
		    value : cas_seq
		}).appendTo("#evtaReport");			
		
	}
	
	jQ("#evtaReport").submit();
	jQ("#evtaReport").remove();			
}	

/*
 * 多筆刪除GRID資料，必須定義一個name="del"的column才會生效
 * 
 */
function delGridData(gridName){
    var grid = eval(gridName);
    
    if(grid.getColIndexById("del") == null){
        return;
    }
    
    grid.forEachRow(
        function(rId){
            var delFlag = grid.cells(rId, grid.getColIndexById("del")).getValue();
            if(delFlag == "1"){
                grid.deleteRow(rId);
            }
        }
    );
}

/*
 * escape grid serialize XML string
 * 
 */
function escapeGridXMLStr(str){
	return str.replace(/\=/g,'%3D');
}

function addConfirmDialogMsg(msg) {
    jQ("#dialog-message2").dialog({ resizable: true,width: 350});
    if(jQ("#dialog-message2").dialog("isOpen")){
        jQ("#dialog-message2 p").html(jQ("#dialog-message2 p").html() + "<br/>" +msg);
    }
}

function checkBrowser(){
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	
	var s;
	(s = ua.match(/msie([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/trident\/([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : 0;
	
	if(Sys.ie){
		alert("不支援IE，請改CHROME瀏覽器");
		return false;
	}else{
		return true;
	}
}

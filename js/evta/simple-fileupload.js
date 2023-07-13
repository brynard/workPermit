jQ(window).on("load",
			function(){
				jQ(".ajax_upload").button();
		jQ(".ajax_upload").each(
			function(idx, domEle){
				var fmid = "iframe" + getRndid();
				var iframe = jQ('<iframe />', {
				    id: fmid,
				    name: fmid,
				    src: "javascript:false;"
				}).appendTo("body");
				jQ(iframe).hide();
				
				var fid = "form" + getRndid();
				var nform = jQ('<form/>', {
				    id: fid,
				    name: fid,
				    action: "FileUploader",
				    method: "post",
				    target: fmid,
				    encoding: "multipart/form-data",
				    enctype: "multipart/form-data"
				}).appendTo("body");
				jQ(nform).addClass("ajax_form");
				
				jQuery("<input/>", {
					type: "hidden",
				    id: "token_csrf",
				    name: "token_csrf",
				    value : jQ("#token_csrf").val()
				}).appendTo("#"+fid);	
				
				jQuery("<input/>", {
					type: "hidden",
				    id: "cas_sn",
				    name: "cas_sn",
				    value : jQ("#cas_sn").val()
				}).appendTo("#"+fid);	
				jQuery("<input/>", {
					type: "hidden",
				    id: "cas_seq",
				    name: "cas_seq",
				    value : jQ("#cas_seq").val()
				}).appendTo("#"+fid);
				jQuery("<input/>", {
					type: "hidden",
				    id: "cas_step_fore",
				    name: "cas_step_fore",
				    value : jQ("#cas_step_fore").val()
				}).appendTo("#"+fid);
				jQuery("<input/>", {
					type: "hidden",
				    id: "reqdocmObj",
				    name: "reqdocmObj",
				    value : jQ(domEle).parent().find(".reqdocm_obj:first").text()
				}).appendTo("#"+fid);
				jQuery("<input/>", {
					type: "hidden",
				    id: "spec_xml",
				    name: "spec_xml",
				    value : "caseFile.xml"
				}).appendTo("#"+fid);				
				
				var myfile = createFile();
				var divid = "divid" + getRndid() ;
				var div = jQ("<div/>", {
				    id: divid,
				    name: divid
				});
				addStyles( jQ(div).get(0), {
			      'display' : 'block',
			      'position' : 'absolute',
			      'overflow' : 'hidden',
			      'margin' : 0,
			      'padding' : 0,
			      'opacity' : 0,
			      'direction' : 'ltr',
			      'zIndex': 2147483583
			    });
				if ( jQ(div).get(0).style.opacity !== '0' ) {
			      jQ(div).get(0).style.filter = 'alpha(opacity=0)';
			    }					    					
				jQ(div).append(myfile);
				
				
				jQ(nform).append(div);
				var domId = "label" + getRndid();
				jQ(domEle).attr("id", domId);
				jQ(nform).append("<div name='labelId' style='display:none'>"+domId+"</div>");
				jQ(nform).append("<div name='iframeId' style='display:none'>"+fmid+"</div>");
				
				jQ(myfile).change(submitImg)												
									
			}
		);
			
			
    	jQ(".ajax_upload").mousemove(adjustLabel);						
	}
);

var fileSize = 0; //檔案大小，bytes
var limitSize = 0; //限制大小，bytes
var extension = ""; //副檔名
function submitImg(){
	var labelObj = jQ("#"+jQ(this).parent().parent().find("div[name='labelId']:first").html());
	var labelid = jQ(this).parent().parent().find("div[name='labelId']:first").html();
	var fmid = jQ(this).parent().parent().find("div[name='iframeId']:first").html();
	var fileName = jQ(this).val();
	var cas_apl_type = jQ("#cas_apl_type").val();
	fileSize = this.files.item(0).size;
	
	if(cas_apl_type=='N' || cas_apl_type=='F'){
		if(fileName.toLowerCase().endsWith("pdf")|| fileName.toLowerCase().endsWith("mpeg")|| fileName.toLowerCase().endsWith("mpg") || fileName.toLowerCase().endsWith("rmvb")|| fileName.toLowerCase().endsWith("rm") || fileName.toLowerCase().endsWith("avi")||fileName.toLowerCase().endsWith("mp4")||fileName.toLowerCase().endsWith("wmv")||fileName.toLowerCase().endsWith("3gp")){
			if(fileName.toLowerCase().endsWith("pdf")){
				extension = "pdf";
				limitSize = 1024 * 1024 * 5;
				if(!checkFileSize()){
					return;
				}
			}else{
				extension = "video";
				limitSize = 1024 * 1024 * 25;
				if(!checkFileSize()){
					return;
				}
			}
		}else{
			alert("表演類只允許上傳.rm、.rmvb、.mpg、.mpeg、.mp4、.avi、.wmv、.3pg影音檔 或.pdf文件檔!");
			return;
		}
	}else {
		if(!fileName.toLowerCase().endsWith("pdf")){
			alert("只允許上傳PDF檔!Only PDF file is allowed to upload.");
			return;
		}
		extension = "pdf";
		limitSize = 1024 * 1024 * 5;
		if(!checkFileSize()){
			return;
		}
	}
	
	jQ(labelObj).parent().mask("檔案上傳...");
	jQ("#"+fmid).one("load",
		function(){
			jQ(labelObj).parent().unmask();
			
			var jsonObj = jQ.parseJSON(jQ("#"+fmid).contents().text());
			if(jsonObj.returnCode == "000000"){
				for(var i=0;i<jsonObj.saveFiles.length;i++){
					if(jQ("#isForeFiles").val() == "Y") {
						addForeFileImg(jQ(labelObj).parent(),jsonObj.saveFiles[i])
					} else {
						addImg(jQ(labelObj).parent(),jsonObj.saveFiles[i])
					}
				}
			}else{
				if(jsonObj.msg && jsonObj.msg!= ""){
					alert(jsonObj.msg+"("+jsonObj.returnCode+")");
				}else{
					alert("上傳檔案失敗，請重新掃描上傳!upload batch files failed!");
				}
			}			
			
			jQ(this).attr("src","javascript:false;");
			adjustLabel();
		}
	);
	jQ(jQ(this).parent().parent()).submit();
	
	var myfile = createFile();
	jQ(this).parent().append(myfile);
	jQ(myfile).change(submitImg)
	jQ(this).remove();
	
	//window.setTimeout("adjustLabel()",500);
}

//檢查檔案大小
function checkFileSize() {
	
    if (fileSize > limitSize) {
    	var file = (fileSize / 1024 / 1024).toPrecision(2);
        var limit = (limitSize / 1024 /1024).toPrecision(2);
        alert("單次上傳" + extension + "檔案大小限制為:" + limit + "MB! Upload size limit for one single " + extension + " file:"+ limit + "MB!(建議您可分成多個檔案上傳，若PDF可改為單色掃描!)");
        return false;
    } else {
    	return true;
    }
}

function adjustLabel(){
	jQ(".ajax_upload").each(
		function(idx, domEle){
			copyLayout( domEle, jQ(jQ(jQ(".ajax_form").get(idx)).find("input[type='file']:first")).get(0).parentNode );
		}
	);
}		

function createFile(){
	var fileid = "upfile" ;
	var file = jQ("<input />", {
	    id: fileid,
	    name: fileid,
	    type: "file",
	    multiple:"multiple"
	});		
	
	addStyles( jQ(file).get(0), {
      'position' : 'absolute',
      'right' : 0,
      'margin' : 0,
      'padding' : 0,
      'fontSize' : '480px',
      'fontFamily' : 'sans-serif',
      'cursor' : 'pointer'
    });			
	
	return file;
}	

function getRndid() {
  return Math.floor((1 + cryptoRandom()) * 0x10000)
             .toString(16)
             .substring(1);
}
function cryptoRandom(){
  // return a crypto generated number
  // between 0 and 1 (0 inclusive, 1 exclusive);
  // Mimics the Math.random function in range of results
  var array = new Uint32Array(1),
    max = Math.pow(2, 32), // normally the max is 2^32 -1 but we remove the -1
                           //  so that the max is exclusive
    randomValue = window.crypto.getRandomValues(array)[0] / max;

    return randomValue;
}

function addStyles( elem, styles ) {

  for ( var name in styles ) {
    if ( styles.hasOwnProperty( name ) ) {
      elem.style[name] = styles[name];
    }
  }
}	 

function copyLayout( from, to ) {
  var box = getBox( from );

  addStyles( to, {
    position: 'absolute',
    left : box.left + 'px',
    top : box.top + 'px',
    width : from.offsetWidth + 'px',
    height : from.offsetHeight + 'px'
  });
};

function getBox( elem ) {
  var box,
      docElem,
      top = 0,
      left = 0;

  if ( elem.getBoundingClientRect ) {
    box = elem.getBoundingClientRect();
    docElem = document.documentElement;
    top = box.top  + ( window.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 );
    left = box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 );
  } else {
    do {
      left += elem.offsetLeft;
      top += elem.offsetTop;
    } while ( ( elem = elem.offsetParent ) );
  }
  return {
    top: Math.round( top ),
    left: Math.round( left )
  };
}	

function addImg(mobj,info){
	var fileName = info.CFI_NAME_O;
	var icon_pdf = "js/dhtmlxFolder/images/ico_pdf_48.gif";
	var imgStr = "";
	var cas_status = jQ("#cas_status").val();
	
	if(fileName != null && !fileName.toLowerCase().endsWith("pdf")){
		icon_pdf = "js/dhtmlxFolder/images/ico_unknown_48.gif";
	}
	
	imgStr += '<div style="display: inline;float: left;width: auto;border: 2px solid #4297d7;margin:1px">'
	imgStr += '<img src="'+ icon_pdf +'" title="'+info.CFI_NAME_O+'" onclick="downloadFile(this,'+info.CFI_SEQ+')" />' + info.CFI_NAME_O
	if(!(cas_status>='07' || info.CFI_STATUS=='1')){
		imgStr += '(<a href="javascript:void(0);" onclick="delFile(this,'+info.CFI_SEQ+'); return false;">刪除delete</a>)'
	}
	imgStr += '</div>';
	
	jQ(mobj).append(jQ(imgStr));
}
function delFile(obj,idx){
	var imgA = obj;
	confirmDialog("請確認是否刪除Are you sure to delete it'"+jQ(imgA).parent().find("img:first").attr("title")+"'？", function() {
		var serviceName = "com.hyweb.ewcf.action.CommonService";
		var operationName = "deleteCaseFile";
		var si = new newServiceInput(serviceName,operationName);	
		si.cas_sn = jQ("#cas_sn").val();
		si.cas_seq = jQ("#cas_seq").val();
		si.token_csrf = jQ("#token_csrf").val();
		si.cfi_seq = idx.toString();
		si.reqdocmObj = jQ(imgA).parent().parent().find(".reqdocm_obj:first").text();
		
		jQ(jQ(imgA).parent().parent()).mask("系統處理中system processing...");
		
		var jqxhr = jQ.post( si.url, jQ.toJSON(si), function(so){
			jQ(jQ(imgA).parent().parent()).unmask();
		　　	if(so.returnCode=="000000"){
				jQ(imgA).parent().remove();
		　　	}
		　　	else{
			alert(so.returnCode);
				}
		},"json");
	});
}
function downloadFile(imgA,idx){
	jQuery("<form/>", {
	    id: "downloadForm",
	    action: "DownloadServlet",
	    method: "post",
	    target: "_blank"
	}).appendTo("body");
	jQuery("<input/>", {
		type: "hidden",
	    id: "reqdocmObj",
	    name: "reqdocmObj",
	    value : jQ(imgA).parent().parent().find(".reqdocm_obj:first").text()
	}).appendTo("#downloadForm");
	jQuery("<input/>", {
		type: "hidden",
	    id: "cfi_seq",
	    name: "cfi_seq",
	    value : idx
	}).appendTo("#downloadForm");
	jQuery("<input/>", {
		type: "hidden",
	    id: "cas_sn",
	    name: "cas_sn",
	    value : jQ("#cas_sn").val()
	}).appendTo("#downloadForm");	
	jQuery("<input/>", {
		type: "hidden",
	    id: "cas_seq",
	    name: "cas_seq",
	    value : jQ("#cas_seq").val()
	}).appendTo("#downloadForm");
	jQuery("<input/>", {
		type: "hidden",
	    id: "cas_step_fore",
	    name: "cas_step_fore",
	    value : jQ("#cas_step_fore").val() != "" ? jQ("#cas_step_fore").val() : "1"
	}).appendTo("#downloadForm");
			
	jQ("#downloadForm").submit();
	jQ("#downloadForm").remove();				
}

function createBatchUpload(obj){
	var domEle = obj;
	var fmid = "iframe" + getRndid();
	var iframe = jQ('<iframe />', {
	    id: fmid,
	    name: fmid,
	    src: "javascript:false;"
	}).appendTo("body");
	jQ(iframe).hide();

	var fid = "form_" + jQ(domEle).attr("name");
	var nform = jQ('<form/>', {
	    id: fid,
	    name: fid,
	    action: "FileUploader",
	    method: "post",
	    target: fmid,
	    encoding: "multipart/form-data",
	    enctype: "multipart/form-data"
	}).appendTo("body");
	jQ(nform).addClass("ajax_batch_form");
	
	jQuery("<input/>", {
		type: "hidden",
	    id: "token_csrf",
	    name: "token_csrf",
	    value : jQ("#token_csrf").val()
	}).appendTo("#"+fid);	

	jQuery("<input/>", {
		type: "hidden",
	    id: "cas_sn",
	    name: "cas_sn",
	    value : jQ("#cas_sn").val()
	}).appendTo("#"+fid);
	jQuery("<input/>", {
		type: "hidden",
	    id: "cas_seq",
	    name: "cas_seq",
	    value : jQ("#cas_seq").val()
	}).appendTo("#"+fid);			
	jQuery("<input/>", {
		type: "hidden",
	    id: "spec_xml",
	    name: "spec_xml",
	    value : "batchFile.xml"
	}).appendTo("#"+fid);

	var myfile = createFile();
	var divid = "divid" + getRndid() ;
	var div = jQ("<div/>", {
	    id: divid,
	    name: divid
	});

	addStyles( jQ(div).get(0), {
      'display' : 'block',
      'position' : 'absolute',
      'overflow' : 'hidden',
      'margin' : 0,
      'padding' : 0,
      'opacity' : 0,
      'direction' : 'ltr',
      'zIndex': 2147483583
    });
	if ( jQ(div).get(0).style.opacity !== '0' ) {
      jQ(div).get(0).style.filter = 'alpha(opacity=0)';
    }
	jQ(div).append(myfile);

	jQ(nform).append(div);
	var domId = "label" + getRndid();
	jQ(domEle).attr("id", domId);
	jQ(nform).append("<div name='labelId' style='display:none'>"+domId+"</div>");
	jQ(nform).append("<div name='iframeId' style='display:none'>"+fmid+"</div>");

	jQ(myfile).change(submitBatchFile);
	
	jQ(domEle).mousemove(adjustBatchBTN);	
}

function submitBatchFile(){
	var labelObj = jQ("#"+jQ(this).parent().parent().find("div[name='labelId']:first").html());
	var labelid = jQ(this).parent().parent().find("div[name='labelId']:first").html();
	var fmid = jQ(this).parent().parent().find("div[name='iframeId']:first").html();
	var fileName = jQ(this).val();
	fileSize = this.files.item(0).size;
	
	if(!fileName.toLowerCase().endsWith("zip")){
		alert("只允許上傳ZIP檔!");
		return;
	}
	extension = "zip";
	limitSize = 1024 * 1024 * 50;
	if(!checkFileSize()){
		return;
	}
	
	jQ(labelObj).parent().mask("檔案上傳upload file...");
	jQ("#"+fmid).one("load",
		function(){
			jQ(labelObj).parent().unmask();
			
			var jsonObj = jQ.parseJSON(jQ("#"+fmid).contents().text());
			if(jsonObj.returnCode == "000000"){
				for(var i=0;i<jsonObj.saveFiles.length;i++){
					if(jsonObj.saveFiles[i].RESULT == "true"){
						//alert(jsonObj.saveFiles[i].FILE_NAME_O + "上傳成功!");
					}else if(jsonObj.saveFiles[i].RESULT == "false"){
						alert(jsonObj.saveFiles[i].FILE_NAME_O + "批次上傳失敗  upload batch files failed!");
					}
				}
				refreshHandler();						
			}else if(jsonObj.returnCode == "111111"){
				alert("只允許上傳PDF檔!Only PDF file is allowed to upload.");
			}else if(jsonObj.returnCode == "222222"){
				alert("表演類只允許上傳.rm、.rmvb、.mpg、.mpeg、.mp4、.avi、.wmv、.3pg影音檔 或.pdf文件檔!");
			}else{
				if(jsonObj.msg && jsonObj.msg!= ""){
					alert(jsonObj.msg);
				}else{
					alert("上傳檔案失敗!upload batch files failed!")
				}
			}
			
			jQ(this).attr("src","javascript:false;");
			jQ("#"+labelid).trigger("mousemove");
		}
	);
	jQ(jQ(this).parent().parent()).submit();
	
	var myfile = createFile();
	jQ(this).parent().append(myfile);
	jQ(myfile).change(submitBatchFile)
	jQ(this).remove();		
}

function adjustBatchBTN(){
	copyLayout( jQ(this).get(0), jQ(jQ(jQ(".ajax_batch_form").get(0)).find("input[type='file']:first")).get(0).parentNode );
}

function refreshHandler(){
    alert("上傳成功，請按「OK」後重整頁面資料!",function(){
	   doReload();
    });
}

function addForeFileImg(mobj,info){
	var icon_pdf = "js/dhtmlxFolder/images/ico_pdf_48.gif";
	var imgStr = "";
	var cas_status = jQ("#cas_status").val();
	
	imgStr += '<div style="display: inline;float: left;width: auto;border: 2px solid #4297d7;margin:1px">'
	imgStr += '<img src="'+ icon_pdf +'" title="'+info.FFI_NAME_O+'" onclick="downloadFile(this,'+info.FFI_SEQ+')" />' + info.FFI_NAME_O
	if((cas_status < '06' || cas_status == '51') && info.FFI_STATUS != '1'){
		imgStr += '(<a href="javascript:void(0);" onclick="delForeFile(this,'+info.FFI_SEQ+'); return false;">刪除delete</a>)'
	}
	imgStr += '</div>';
	jQ(mobj).append(jQ(imgStr));
}

function delForeFile(obj,idx){
	var imgA = obj;
	confirmDialog("請確認是否刪除Are you sure to delete it'"+jQ(imgA).parent().find("img:first").attr("title")+"'？", function() {
		var serviceName = "com.hyweb.ewcf.action.CommonService";
		var operationName = "deleteCaseLForeFile";
		var si = new newServiceInput(serviceName,operationName);	
		si.cas_sn = jQ("#cas_sn").val();
		si.cas_seq = jQ("#cas_seq").val();
		var fro_seq = jQ("#cas_step_fore").val() != "" ? jQ("#cas_step_fore").val() : "1";
		si.fro_seq = fro_seq;
		si.ffi_seq = idx.toString();
		si.reqdocmObj = jQ(imgA).parent().parent().find(".reqdocm_obj:first").text();
		
		jQ(jQ(imgA).parent().parent()).mask("系統處理中system processing...");
		
		var jqxhr = jQ.post( si.url, jQ.toJSON(si), function(so){
			jQ(jQ(imgA).parent().parent()).unmask();
		　　	if(so.returnCode=="000000"){
				jQ(imgA).parent().remove();
		　　	}
		　　	else{
			alert(so.returnCode);
				}
		},"json");
	});
}
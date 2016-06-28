function scrapeContent() {
    var content = document.body.innerHTML;
    findFirstHTTPRequst(content);
}


function findFirstHTTPRequst(content){
	var firstRequestIndex = content.indexOf(uniqueHttpString);
	if (firstRequestIndex < 0){
		openBrowserTabForGetRequests();
		return; //end recursion
	}else{
		var request = isolateHTTPCall(content);
		findURLsforGETs(request);
		content = content.substring(firstRequestIndex + uniqueHttpString.length, content.length);
		findFirstHTTPRequst(content);
	}

}

function isolateHTTPCall(content){
		var startOfRequestIndex = content.indexOf(startOfRequest);
		var firstRequestIndex = content.indexOf(uniqueHttpString);
		var request = content.substring(startOfRequestIndex, firstRequestIndex);
		return request;
}

function findURLsforGETs(request){
	request = request.replace("&amp;", "&");
	var isGet = request.indexOf("GET");
	if (isGet > 0){
		urls[urls.length] = request.substring(request.indexOf('http'), request.length);
	}

}

function openBrowserTabForGetRequests(){
	for (i = 0; i < urls.length; i++) {
		var win = window.open(urls[i], '_blank');
		if (i==urls.length) win.focus();
    }
}

var urls = [];
var uniqueHttpString = "with body" //Set this to a unique string that appears in your logs for HTTP requests after the URL
var startOfRequest = "Sending request" //Set this to a unique strong that appears in your logs before the URL for the HTTP request
scrapeContent();
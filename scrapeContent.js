(function(){
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
	function escapeRegExp(string){
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	function findMatches(message, sender, sendResponse){
		const prefix = escapeRegExp(message.prefix);
		const suffix = escapeRegExp(message.suffix);
		const regex = new RegExp(`${prefix}\\\s*(.*?)\\\s*${suffix}`, 'g');
		const source = document.body.innerText;

		var matches = [];
		var match = regex.exec(source);
		while(match) {
			matches.push(match[1]);
			match = regex.exec(source);
		}

		sendResponse({matches: matches});
	}
	chrome.runtime.onMessage.addListener(findMatches);
})();
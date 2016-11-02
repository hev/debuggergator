document.addEventListener('DOMContentLoaded', function () {
    const DEFAULT_PREFIX = 'Sending request';
    const DEFAULT_SUFFIX = 'with data';

    function saveChanges() {
        chrome.storage.sync.set({
            prefix: getPrefix() || DEFAULT_PREFIX,
            suffix: getSuffix() || DEFAULT_SUFFIX
        });
    }

    getElement('prefix').addEventListener('input', saveChanges);
    getElement('suffix').addEventListener('input', saveChanges);

    function clear() {
        getElement('results').innerHTML = '';
    }

    function getPrefix() {
        return getElement('prefix').value.trim();
    }

    function getSuffix() {
        return getElement('suffix').value.trim();
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function initialize() {
        chrome.storage.sync.get({
            prefix: DEFAULT_PREFIX,
            suffix: DEFAULT_SUFFIX
        }, function (items) {
            getElement('prefix').value = items.prefix;
            getElement('suffix').value = items.suffix;
        });
    }

    getElement('scan').addEventListener('click', function () {
        const message = {
            prefix: getPrefix(),
            suffix: getSuffix()
        };

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            id = tabs[0].id;
            chrome.tabs.executeScript(id, {file: 'scrapeContent.js'});
            chrome.tabs.sendMessage(id, message, {}, scanComplete);
        });
    });

    getElement('reset').addEventListener('click', function () {
        clear();
        initialize();
    });

    function checkAll(checked) {
        inputs = getElement('results').getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs.item(i).checked = checked;
        }
    }

    getElement('select-all').addEventListener('click', function () {
        checkAll(true);
    });

    getElement('select-none').addEventListener('click', function () {
        checkAll(false);
    });

    function scanComplete(results) {
        if (!results) {
            return;
        }

        function createItem(text) {
            var textNode = document.createTextNode(text);
            var inputNode = document.createElement('input');
            inputNode.setAttribute('type', 'checkbox');
            inputNode.checked = true;
            var labelNode = document.createElement('label');
            labelNode.appendChild(inputNode);
            labelNode.appendChild(textNode);
            var listItemNode = document.createElement('li');
            listItemNode.appendChild(labelNode);
            return listItemNode;
        }

        clear();

        const matches = results.matches;
        const resultsElement = getElement('results');
        matches.forEach(function (match) {
            resultsElement.appendChild(createItem(match));
        });
    }

    initialize();
});
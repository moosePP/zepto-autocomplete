;
(function ($) {
    var ZeptoAutoComplete = {
        limit: 2,
        autoCompleteURL: '',
        searchTerm: '',
        init: function (limit) {
            var searchTextField = $('.autocomplete-input');
            this.autoCompleteURL = searchTextField.data('source');
            this.searchTerm = searchTextField.data('search-key');
            this.limit = limit;
        },
        autoCompleteRemote: function (limit) {
            ZeptoAutoComplete.init(limit);
            var searchTextField = $('.autocomplete-input');
            searchTextField.bind("keyup", $.proxy(ZeptoAutoComplete._handleSearch, this));
        },
        clearAutoCompleteResults: function () {
            var resultContainer = $('.auto-complete-result');
            resultContainer.html('');
            resultContainer.hide();
        },
        autoCompleteLocal: function (limit, data) {
            ZeptoAutoComplete.init(limit);
            var searchTextField = $('.autocomplete-input');
            searchTextField.bind("input paste keyup", function () {
                var message = searchTextField.val();
                if (!ZeptoAutoComplete._isWithinLimit(message)) {
                    ZeptoAutoComplete.clearAutoCompleteResults();
                    return;
                }
                ZeptoAutoComplete._successHandler(data.filter(function (i) {
                    return i.indexOf(message) > -1;
                }));
            });
        },
        _handleSearch: function (evt) {
            var message = $('.autocomplete-input').val();
            var url = ZeptoAutoComplete.autoCompleteURL + '?' + ZeptoAutoComplete.searchTerm + '=' + message;
            if (!ZeptoAutoComplete._isWithinLimit(message)) {
                ZeptoAutoComplete.clearAutoCompleteResults();
                return;
            }
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: ZeptoAutoComplete._successHandler
            });
        },
        _isWithinLimit: function (message) {
            return message !== undefined && message.length > ZeptoAutoComplete.limit;
        },
        _successHandler: function (data) {
            if (data === undefined && data.length <= 0)
                return;

            var resultContainer = $('.auto-complete-result');
            var autocompleteHTML = "<ol>";
            $.map(data, function (listItem) {
                autocompleteHTML += "<li>" + listItem + "</li>";
            });
            autocompleteHTML += "</ol>";
            resultContainer.html(autocompleteHTML);
            resultContainer.show();
        }
    };
    $.extend($.fn, ZeptoAutoComplete);
})(Zepto);

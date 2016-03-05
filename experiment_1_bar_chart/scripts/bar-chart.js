(function() {
    'use strict';

    function Barchart(domContainer, data) {
        var  _barchart = this;
        _barchart._data = data || [];
        _barchart._containerSelection = d3.select(domContainer);
        _barchart._svg = _barchart._containerSelection.append('svg');
    }

    Barchart.prototype.render = function() {

    };

    Barchart.prototype.data = function(data) {
        var  _barchart = this;

        if (arguments.length === 1) {
            _barchart._data = data;
        }

        return _barchart._data;
    };

    function _generateData(numberOfDataPoints) {

    }

    function _init(id) {
        var data = _generateData(10),
            barchart = new Barchart(document.getElementById(id), data);

        barchart.render();
    }

    _init('d3-container');

})();
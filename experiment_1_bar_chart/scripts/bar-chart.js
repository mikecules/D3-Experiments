(function() {
    'use strict';

    function Barchart(domContainer, data, width, height) {
        var  _barchart = this;
        _barchart._data = data || [];
        _barchart._width = width || 640;
        _barchart._height = height || 480;
        _barchart._containerSelection = d3.select(domContainer);
        _barchart._svg = _barchart._containerSelection
          .append('svg')
          .classed('barchart', true)
          .attr('width', _barchart._width)
          .attr('height', _barchart._height);

    }

    Barchart.prototype.render = function() {
        var _barchart = this,
            barWidth = 30,
            barMargin = 5;

        var newX1 = 0;

        var colourInterpolator = _barchart._colourFn;

        var groups = _barchart._svg.selectAll('g')
          .data(_barchart._data);

        groups.enter().append('g');

        groups.attr('transform', function(d) {
             var x = newX1;
             newX1 = x + barWidth + barMargin;

             return 'translate(' + newX1 + ', ' + (_barchart._height - d) + ')';
        });

        var bars = groups.selectAll('rect.bar')
          .data(function(d) {return [d]; });

        bars.enter()
          .append('rect')
          .classed('bar', true)
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', barWidth);

        bars
          .attr('height', function(d) {
            return d;
          })
          .transition()
          .style('fill', function(d) { return colourInterpolator(d); });


        var labels = groups.selectAll('text')
          .data(function(d) {return [d]});

        labels.enter().append('text')
          .attr('x', 3)
          .attr('y', 15)
          .attr('fill', '#ffffff');

        labels
          .text(function(d) {return d;});

        bars.exit().remove();
        labels.exit().remove();
        groups.exit().remove();

    };

    Barchart.prototype.data = function(data) {
        var  _barchart = this;

        if (arguments.length === 1 && _.isArray(data)) {
            _barchart._data = data;
            _barchart._colourFn = d3.scale.linear()
              .domain([0,_barchart._height])
              .interpolate(d3.interpolateRgb)
              .range(["#000000", "#0000ff"]);
        }

        return _barchart._data;
    };

    function _generateData(numberOfDataPoints, minNumber, maxNumber) {
        var max = maxNumber || 400,
            min = minNumber || 0,
            data = [];

        for (var i = 0; i < numberOfDataPoints; i++) {
            data.push((Math.round(Math.random() * max)) + min);
        }

        return data;
    }

    function _init(id) {
        var data = _generateData(30),
            barchart = new Barchart(document.getElementById(id), data);

        _startAnimating(barchart);

    }

    function _startAnimating(barchart) {
        barchart.data(_generateData(30));
        barchart.render();

        setTimeout(function() {
            _startAnimating(barchart);
        }, 750);
    }

    _init('d3-container');

})();
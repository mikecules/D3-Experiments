(function() {
    'use strict';

    function Barchart(domContainer, data, width, height, padding) {
        var  _barchart = this;
        _barchart._data = data || [];
        _barchart._width = width || 640;
        _barchart._height = height || 480;
        _barchart._padding = padding || 80;

        _barchart._containerSelection = d3.select(domContainer);
        _barchart._svg = _barchart._containerSelection
          .append('svg')
          .classed('barchart', true)
          .attr('width', _barchart._width)
          .attr('height', _barchart._height);

      _barchart._svg
        .append('defs')
        .append('clipPath')
        .attr('clipPathUnits', 'userSpaceOnUse')
        .attr('id', 'chartArea')
        .append('rect')
        .attr('fill', 'none')
        .attr('x', _barchart._padding / 2)
        .attr('y', _barchart._padding - 5)
        .attr('width', _barchart._width)
        .attr('height', _barchart._height - _barchart._padding);

      // Create scale functions
      _barchart._yScale = d3.scale.linear()
        .domain([d3.max(data), 0])
        .range([0, _barchart._height - _barchart._padding]);


      // Define Y axis
      _barchart._yAxis = d3.svg.axis()
        .scale(_barchart._yScale)
        .orient('left')
        .ticks(10);

      // Create Y axis
      _barchart._svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(40, ' + (_barchart._padding - 5) +')')
        .call(_barchart._yAxis);

      _barchart._g = _barchart._svg.append('g')
        .attr('clip-path', 'url(#chartArea)')
        .attr('id', 'chart');

      _barchart._colourFn = d3.scale.linear()
        .domain([0,_barchart._height])
        .interpolate(d3.interpolateRgb)
        .range(['#000000', '#0000ff']);

    }

    Barchart.prototype.render = function() {
        var _barchart = this,
            barWidth = 20,
            barMargin = 5;

        var newX1 = 0;

        var colourInterpolator = _barchart._colourFn;

        var groups = _barchart._g.selectAll('g.bar')
          .data(_barchart._data);

        groups.enter().append('g').classed('bar', true);

        var x1s = [];

        groups.attr('transform', function(d) {
          newX1 += barWidth + barMargin;
          var x = newX1 + 20;
          x1s.push(x);

           return 'translate(' +  x /* move away from y-axis labels */ + ', ' +
             (_barchart._height + _barchart._padding) + ')';
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
            return _barchart._yScale(d);
          })
          .style('fill', function(d) { return colourInterpolator(d); });


      groups.transition()
        .duration(500)
        .delay(function(d, i) {
          return i / _barchart._data.length * 1000;
        })
        .attr('transform', function(d, i) {
        var x = x1s[i];
        return 'translate(' +  (x /* move away from y-axis labels */) + ', ' +
          (_barchart._height -_barchart._yScale(d) - 5) + ')';
      });

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
          _barchart._yScale.domain([0, d3.max(data)]);
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
        }, 2000);
    }

    _init('d3-container');

})();
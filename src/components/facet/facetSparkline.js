/*
 * Copyright 2017 Uncharted Software Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Handlebars = require('handlebars');

var TIMESERIES_X_INDEX = 0;
var TIMESERIES_Y_INDEX = 1;

/**
 * This class creates a sparkline in the given `svgContainer` using the data provided in the `spec`
 *
 * @class FacetSparkline
 * @param {element} svgContainer - SVG element where the sparkline should be created (can be an SVG group)
 * @param {Object} spec - Object describing the sparkline to be created.
 * @constructor
 */
function FacetSparkline(svgContainer, spec) {
	this._svg = svgContainer;
	this._spec = spec;
	this._totalWidth = 0;
	this._displayFn = $.isFunction(spec.displayFn) ? spec.displayFn : false;
	this._lineWidth = 0;
	this._points = [];
	this._colors = spec.colors ? spec.colors : [ '#000' ];
	this.initializeTimeseries(svgContainer, spec.sparklines ? spec.sparklines : spec.sparkline, !!spec.sparklines);
}

/**
 * The total width of the sparkline.
 *
 * @property totalWidth
 * @type {Number}
 * @readonly
 */
Object.defineProperty(FacetSparkline.prototype, 'totalWidth', {
	get: function () {
		return this._totalWidth;
	}
});

/**
 * The width of each individual line in the sparkline.
 *
 * @property lineWidth
 * @type {Number}
 * @readonly
 */
Object.defineProperty(FacetSparkline.prototype, 'lineWidth', {
	get: function () {
		return this._lineWidth;
	}
});

/**
 * The internal array containing the points in this histogram.
 *
 * @property points
 * @type {Array}
 * @readonly
 */
Object.defineProperty(FacetSparkline.prototype, 'points', {
	get: function () {
		return this._points;
	}
});

/**
 * Initializes the slices (bars/buckets) of this sparkline and saves them to the `_points` array.
 *
 * @method initializeSlices
 * @param {element} svg - The SVG element where the sparkline should be created.
 * @param {Array} sparkline - An array containing the sparkline to be created.
 */
FacetSparkline.prototype.initializeTimeseries = function(svg, sparkline, hasMultiple) {

	this._svg.empty();

	this._sparkWidth = this._svg.width();
	this._sparkHeight = this._svg.height() - 2;

	this._minX = Infinity;
	this._maxX = -Infinity;
	this._minY = Infinity;
	this._maxY = -Infinity;
	this._sparklineLength = 0;
	this._points = [];

	this._sparkline = sparkline;

	this._hasMultipleSparklines = hasMultiple;

	var that = this;
	var x, y,  i;

	if (this._hasMultipleSparklines) {
		// muiltiple sparkline

		var exists = {};
		sparkline.forEach(function(subseries) {

			var point;
			if (subseries.length > 0 && Array.isArray(subseries[0])) {

				for (i=0; i<subseries.length; i++) {

					x = subseries[i][TIMESERIES_X_INDEX];
					y = subseries[i][TIMESERIES_Y_INDEX];

					that._minX = Math.min(that._minX, x);
					that._maxX = Math.max(that._maxX, x);
					that._minY = Math.min(that._minY, y);
					that._maxY = Math.max(that._maxY, y);

					if (!exists[x]) {
						point = {
							x: x,
							y: [ y ],
							highlighted: false,
							metadata: null
						};
						that._points.push(point);
						exists[x] = point;
					} else {
						exists[x].y.push(y);
					}

				}

			} else {

				this._minX = 0;
				this._maxX = Math.max(this._maxX, subseries.length - 1);

				for (i=0; i<subseries.length; i++) {
					that._minY = Math.min(that._minY, subseries[i]);
					that._maxY = Math.max(that._maxY, subseries[i]);

					if (!exists[i]) {
						point = {
							x: i,
							y: [ subseries[i] ],
							highlighted: false,
							metadata: null
						};
						that._points.push(point);
						exists[i] = point;
					} else {
						exists[i].y.push(subseries[i]);
					}
				}
			}
			that._sparklineLength = Math.max(that._sparklineLength, subseries.length);
		});

		that._points.sort(function(a, b) {
			return a.x - b.x;
		});

		// sparkline.forEach(function(subseries, index) {
		// 	var totalSparklinePath = that._renderSparkline(this._sparkWidth, sparkHeight, subseries, that._maxY, index);
		// 	totalSparklinePath.appendTo(that._svg);
		// });

	} else {
		// single sparkline

		if (sparkline.length > 0 && Array.isArray(sparkline[0])) {

			for (i=0; i<sparkline.length; i++) {
				x = sparkline[i][TIMESERIES_X_INDEX];
				y = sparkline[i][TIMESERIES_Y_INDEX];
				that._minX = Math.min(that._minX, x);
				that._maxX = Math.max(that._maxX, x);
				that._minY = Math.min(that._minY, y);
				that._maxY = Math.max(that._maxY, y);
				this._points.push({
					x: x,
					y: y,
					highlighted: false,
					metadata: null
				});
			}

		} else {

			this._minX = 0;
			this._maxX = sparkline.length - 1;
			for (i=0; i<sparkline.length; i++) {
				this._minY = Math.min(this._minY, sparkline[i]);
				this._maxY = Math.max(this._maxY, sparkline[i]);
				this._points.push({
					x: i,
					y: sparkline[i],
					highlighted: false,
					metadata: null
				});
			}

		}
		this._sparklineLength = sparkline.length;

		// var totalSparklinePath = this._renderSparkline(this._sparkWidth, sparkHeight, sparkline, this._maxY, 0);
		// totalSparklinePath.appendTo(this._svg);
	}

	this._lineWidth = this._sparkWidth / this._sparklineLength;

	this._totalWidth = this._sparkWidth;

	this._updateSparklines();
};

FacetSparkline.prototype._updateSparklines = function() {

	this._svg.empty();

	var that = this;

	if (this._hasMultipleSparklines) {
		// muiltiple sparkline

		this._sparkline.forEach(function(subseries, index) {
			var totalSparklinePath = that._renderSparkline(that._sparkWidth, that._sparkHeight, subseries, that._maxY, index);
			totalSparklinePath.appendTo(that._svg);

			var highlights = that._renderHighlights(that._sparkWidth, that._sparkHeight, subseries, that._maxY, index);
			highlights.appendTo(that._svg);

			if (that._selected) {
				totalSparklinePath[0].classList.add('facet-sparkline-total');
			}
		});

	} else {
		// single sparkline

		var totalSparklinePath = this._renderSparkline(this._sparkWidth, this._sparkHeight, this._sparkline, this._maxY, 0);
		totalSparklinePath.appendTo(this._svg);

		var highlights = this._renderHighlights(this._sparkWidth, this._sparkHeight, this._sparkline, this._maxY, 0);
		highlights.appendTo(this._svg);

		if (this._selected) {
			totalSparklinePath[0].classList.add('facet-sparkline-total');
		}
	}

	if (this._selected) {
		var selectedSparklinePath = this._renderSparkline(this._sparkWidth, this._sparkHeight, this._selected, this._maxY);
		selectedSparklinePath.appendTo(this._svg);

		selectedSparklinePath[0].classList.add('facet-sparkline-selected');
	}

};

/**
 * Creates a SVG Path element for sparkline data
 * @param {Number} width - width of the container in pixels
 * @param {Number} height - height of the container in pixels
 * @param {Array} sparkline - array of {Number} representing values over time
 * @param {Number} maxValue - value to treat as the total/maximum value
 * @returns {*|jQuery|HTMLElement} - SVG Path containing the rendered data without styling
 * @method _updateSparkline
 * @private
 */
FacetSparkline.prototype._renderSparkline = function(width, height, sparkline, maxValue, index) {
	var x = 0, y = 0;
	var i;
	var pathData = 'M ';

	if (sparkline.length > 0 && Array.isArray(sparkline[0])) {
		// each entry is two values, x and y

		var first = sparkline[0];
		var last = sparkline[sparkline.length - 1];
		var xrange = last[TIMESERIES_X_INDEX] - first[TIMESERIES_X_INDEX];

		var lastEntry;
		for (i = 0; i < sparkline.length; i++) {
			var entry = sparkline[i];
			if (lastEntry) {
				x += width * ((entry[TIMESERIES_X_INDEX] - lastEntry[TIMESERIES_X_INDEX]) / xrange);
			}
			y = height - Math.floor((entry[TIMESERIES_Y_INDEX])/maxValue * height) + 1;
			pathData += (x + ' ' + y);
			if (i < sparkline.length-1) {
				pathData += ' L ';
			}
			lastEntry = entry;
		}
	} else {
		// each entry is one value, y
		var dx = width / (sparkline.length-1);

		for (i = 0; i < sparkline.length; i++) {
			y = height - Math.floor((sparkline[i])/maxValue * height) + 1;
			pathData += (x + ' ' + y);
			if (i < sparkline.length-1) {
				pathData += ' L ';
			}
			x += dx;
		}
	}

	var pathEl = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
	pathEl.attr('d', pathData);
	pathEl.css('stroke', this._colors[index % this._colors.length]);
	pathEl.css('opacity', 0.5);
	return pathEl;
};

FacetSparkline.prototype._renderHighlights = function(width, height, sparkline, maxValue, index) {

	if (!this._highlighted) {
		this._highlighted = {
			from: 0,
			to: this._sparklineLength - 1
		};
	}
	var x = 0, y = 0;
	var i;
	var pathData = 'M ';

	if (sparkline.length > 0 && Array.isArray(sparkline[0])) {
		// each entry is two values, x and y

		var first = sparkline[0];
		var last = sparkline[sparkline.length - 1];
		var xrange = last[TIMESERIES_X_INDEX] - first[TIMESERIES_X_INDEX];

		var lastEntry;
		for (i = 0; i <= this._highlighted.to; i++) {
			var entry = sparkline[i];
			if (lastEntry) {
				x += width * ((entry[TIMESERIES_X_INDEX] - lastEntry[TIMESERIES_X_INDEX]) / xrange);
			}
			y = height - Math.floor((entry[TIMESERIES_Y_INDEX])/maxValue * height) + 1;

			if (i >= this._highlighted.from) {
				pathData += (x + ' ' + y);
				if (i < this._highlighted.to) {
					pathData += ' L ';
				}
			}
			lastEntry = entry;
		}
	} else {
		// each entry is one value, y
		var dx = width / (sparkline.length-1);

		for (i = 0; i <= this._highlighted.to; i++) {
			y = height - Math.floor((sparkline[i])/maxValue * height) + 1;

			if (i >= this._highlighted.from) {
				pathData += (x + ' ' + y);
				if (i < this._highlighted.to) {
					pathData += ' L ';
				}
			}
			x += dx;
		}
	}

	var pathEl = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
	pathEl.attr('d', pathData);
	pathEl.css('stroke', this._colors[index % this._colors.length]);
	return pathEl;
};

/**
 * Converts a pixel range into a bar range.
 *
 * @method pixelRangeToPointRange
 * @param {{from: number, to: number}} pixelRange - The range in pixels to convert.
 * @returns {{from: number, to: number}}
 */
FacetSparkline.prototype.pixelRangeToPointRange = function (pixelRange) {
	return {
		from: Math.min(this._sparklineLength - 1, Math.max(0, Math.round(pixelRange.from / this._lineWidth))),
		to: Math.min(this._sparklineLength - 1, Math.max(0, Math.round((pixelRange.to - this._lineWidth) / this._lineWidth)))
	};
};

/**
 * Converts a bar range into a pixel range.
 *
 * @method pointRangeToPixelRange
 * @param {{from: number, to: number}} pointRange - The bar range to convert.
 * @returns {{from: number, to: number}}
 */
FacetSparkline.prototype.pointRangeToPixelRange = function (pointRange) {
	return {
		from: pointRange.from * (this._lineWidth),
		to: (pointRange.to * (this._lineWidth)) + this._lineWidth
	};
};

/**
 * Highlights the given bar range.
 *
 * @method highlightRange
 * @param {{from: number, to: number}} range - The bar range to highlight.
 */
FacetSparkline.prototype.highlightRange = function (range) {
	this._highlighted = range;
	this._updateSparklines();
};

/**
 * Highlights the given value range.
 *
 * @method highlightValueRange
 * @param {{from: number, to: number}} range - The value range to highlight.
 */
FacetSparkline.prototype.highlightValueRange = function (range) {
	this._highlighted = {
		from: Infinity,
		to: -Infinity
	};
	var points = this._points;
	for (var i = 0, n = points.length; i < n; ++i) {
		if (points[i].x >= range.from) {
			this._highlighted.from = Math.min(this._highlighted.from, i);
		}
		if (points[i].x <= range.to) {
			this._highlighted.to = Math.min(this._highlighted.to, i);
		}
	}
	this._updateSparklines();
};

/**
 * Selects the specified counts for each bar as specified in the `sparkline` parameter.
 *
 * @method select
 * @param {Object} sparkline - Data used to select sub-bar counts in this sparkline.
 */
FacetSparkline.prototype.select = function (sparkline) {
	this._selected = sparkline;
	this._updateSparklines();
};

/**
 * Clears the selection state of all bars in this sparkline.
 *
 * @method deselect
 */
FacetSparkline.prototype.deselect = function () {
	this._selected = null;
	this._updateSparklines();
};

/**
 * @export
 * @type {Histogram}
 */
module.exports = FacetSparkline;

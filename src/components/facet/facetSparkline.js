/*
 * Copyright 2017 Uncharted Software Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
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
	this.initializeTimeseries(svgContainer, spec.timeseries);
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
 * @param {element} svg - The SVG element where the timeseries should be created.
 * @param {Array} timeseries - An array containing the timeseries to be created.
 */
FacetSparkline.prototype.initializeTimeseries = function(svg, timeseries) {

	this._svg.empty();

	var sparkWidth = this._svg.width();
	var sparkHeight = this._svg.height()-2;

	this._minX = Infinity;
	this._maxX = -Infinity;
	this._minY = Infinity;
	this._maxY = -Infinity;
	this._sparklineLength = 0;
	this._points = [];

	var hasMultipleSparklines = Array.isArray(timeseries[0][0]);

	var that = this;

	if (hasMultipleSparklines) {
		// muiltiple timeseries

		var exists = {};

		timeseries.forEach(function(subseries) {
			for (var i=0; i<subseries.length; i++) {
				that._minX = Math.min(that._minX, subseries[i][TIMESERIES_X_INDEX]);
				that._maxX = Math.max(that._maxX, subseries[i][TIMESERIES_X_INDEX]);
				that._minY = Math.min(that._minY, subseries[i][TIMESERIES_Y_INDEX]);
				that._maxY = Math.max(that._maxY, subseries[i][TIMESERIES_Y_INDEX]);
				if (!exists[subseries[i][TIMESERIES_X_INDEX]]) {
					exists[subseries[i][TIMESERIES_X_INDEX]] = true;
					that._points.push({
						x: subseries[i][TIMESERIES_X_INDEX],
						y: null,
						highlighted: false,
						metadata: null
					});
				}
			}
			that._points.sort(function(a, b) {
				return a.x - b.x;
			});
			that._sparklineLength = Math.max(that._sparklineLength, subseries.length);
		});

		timeseries.forEach(function(subseries, index) {
			var totalSparklinePath = that._renderSparkline(sparkWidth, sparkHeight, subseries, that._maxY, index);
			totalSparklinePath.appendTo(that._svg);
		});

	} else {
		// single timeseries
		for (var i=0; i<timeseries.length; i++) {
			this._minX = Math.min(this._minX, timeseries[i][TIMESERIES_X_INDEX]);
			this._maxX = Math.max(this._maxX, timeseries[i][TIMESERIES_X_INDEX]);
			this._minY = Math.min(this._minY, timeseries[i][TIMESERIES_Y_INDEX]);
			this._maxY = Math.max(this._maxY, timeseries[i][TIMESERIES_Y_INDEX]);
			this._points.push({
				x: timeseries[i][TIMESERIES_X_INDEX],
				y: timeseries[i][TIMESERIES_Y_INDEX],
				highlighted: false,
				metadata: null
			});
		}
		this._sparklineLength = timeseries.length;

		var totalSparklinePath = this._renderSparkline(sparkWidth, sparkHeight, timeseries, this._maxY, 0);
		totalSparklinePath.appendTo(this._svg);
	}

	this._lineWidth = sparkWidth / this._sparklineLength;

	this._totalWidth = sparkWidth;
};

/**
 * Creates a SVG Path element for timeseries data
 * @param {Number} width - width of the container in pixels
 * @param {Number} height - height of the container in pixels
 * @param {Array} timeseries - array of {Number} representing values over time
 * @param {Number} maxValue - value to treat as the total/maximum value
 * @returns {*|jQuery|HTMLElement} - SVG Path containing the rendered data without styling
 * @method _updateSparkline
 * @private
 */
FacetSparkline.prototype._renderSparkline = function(width, height, timeseries, maxValue, index) {
	var x = 0, y = 0;
	var timeIdx;
	var pathData = 'M ';

	if (timeseries.length > 0 && Array.isArray(timeseries[0])) {
		// each entry is two values, x and y

		var first = timeseries[0];
		var last = timeseries[timeseries.length - 1];
		var xrange = last[TIMESERIES_X_INDEX] - first[TIMESERIES_X_INDEX];

		var lastEntry;
		for (timeIdx = 0; timeIdx < timeseries.length; timeIdx++) {
			var entry = timeseries[timeIdx];
			if (lastEntry) {
				x += width * ((entry[TIMESERIES_X_INDEX] - lastEntry[TIMESERIES_X_INDEX]) / xrange);
			}
			y = height - Math.floor((entry[TIMESERIES_Y_INDEX])/maxValue * height) + 1;
			pathData += (x + ' ' + y);
			if (timeIdx < timeseries.length-1) {
				pathData += ' L ';
			}
			lastEntry = entry;
		}
	} else {
		// each entry is one value, y
		var dx = width / (timeseries.length-1);

		for (timeIdx = 0; timeIdx < timeseries.length; timeIdx++) {
			y = height - Math.floor((timeseries[timeIdx])/maxValue * height) + 1;
			pathData += (x + ' ' + y);
			if (timeIdx < timeseries.length-1) {
				pathData += ' L ';
			}
			x += dx;
		}
	}

	var pathEl = $(document.createElementNS('http://www.w3.org/2000/svg','path'));
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
	// var points = this._points;
	// for (var i = 0, n = points.length; i < n; ++i) {
	// 	this._points[i].highlighted = this._spec.alwaysHighlight || (i >= range.from && i <= range.to);
	// }
};

/**
 * Highlights the given value range.
 *
 * @method highlightValueRange
 * @param {{from: number, to: number}} range - The value range to highlight.
 */
FacetSparkline.prototype.highlightValueRange = function (range) {
	// var points = this._points;
	// for (var i = 0, n = points.length; i < n; ++i) {
	// 	points[i].highlighted = (range.from >= points[i].x && range.to <= points[i].x);
	// }
};

/**
 * Selects the specified counts for each bar as specified in the `timeseries` parameter.
 *
 * @method select
 * @param {Object} timeseries - Data used to select sub-bar counts in this sparkline.
 */
FacetSparkline.prototype.select = function (timeseries) {
	// not implemented
};

/**
 * Clears the selection state of all bars in this sparkline.
 *
 * @method deselect
 */
FacetSparkline.prototype.deselect = function () {
	// not implemented
};

/**
 * @export
 * @type {Histogram}
 */
module.exports = FacetSparkline;

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

	this._points = timeseries.map(function(p) {
		return {
			x: p[TIMESERIES_X_INDEX],
			y: p[TIMESERIES_Y_INDEX],
			highlighted: false,
			metadata: null
		};
	});

	var sparklineLength = timeseries.length;

	this._lineWidth = sparkWidth / sparklineLength;

	// Compute the maximum value so total and selected sparklines are the same height
	var maxValue = 0;
	this._spec.timeseries.forEach(function(entry) {
		var y;
		if (Array.isArray(entry)) {
			y = entry[TIMESERIES_Y_INDEX];
		} else {
			y = entry;
		}
		maxValue = Math.max(maxValue, y);
	});
	maxValue = maxValue ? maxValue : 1;	// prevent divide by 0

	var totalSparklinePath = this._renderSparkline(sparkWidth,sparkHeight,this._spec.timeseries, maxValue);
	totalSparklinePath.appendTo(this._svg);

	// If we have a selection, add it to the svg, otherwise, override the styling if provided
	if (this._spec.selected && this._spec.selected.timeseries) {
		var selectedSparklinePath = this._renderSparkline(sparkWidth,sparkHeight,this._spec.selected.timeseries, maxValue);
		selectedSparklinePath.appendTo(this._svg);

		totalSparklinePath[0].classList.add('facet-sparkline-total');
		selectedSparklinePath[0].classList.add('facet-sparkline-selected');

		if (this._spec.isQuery && this._spec.icon && this._spec.icon.color) {
			selectedSparklinePath.css('stroke', this._spec.icon.color);
		}

	} else {
		if (this._spec.icon && this._spec.icon.color) {
			totalSparklinePath.css('stroke',this._spec.icon.color);
		}
	}

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
FacetSparkline.prototype._renderSparkline = function(width, height, timeseries, maxValue) {
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
	pathEl.attr('d',pathData);
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
		from: Math.min(this._points.length - 1, Math.max(0, Math.round(pixelRange.from / this._lineWidth))),
		to: Math.min(this._points.length - 1, Math.max(0, Math.round((pixelRange.to - this._lineWidth) / this._lineWidth)))
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
	var points = this._points;
	for (var i = 0, n = points.length; i < n; ++i) {
		this._points[i].highlighted = this._spec.alwaysHighlight || (i >= range.from && i <= range.to);
	}
};

/**
 * Highlights the given value range.
 *
 * @method highlightValueRange
 * @param {{from: number, to: number}} range - The value range to highlight.
 */
FacetSparkline.prototype.highlightValueRange = function (range) {
	this._highlights = [];
	var points = this._points;
	for (var i = 0, n = points.length; i < n; ++i) {
		points[i].highlighted = (range.from >= points[i].x && range.to <= points[i].x);
	}
};

/**
 * Selects the specified counts for each bar as specified in the `slices` parameter.
 *
 * @method select
 * @param {Object} slices - Data used to select sub-bar counts in this sparkline.
 */
FacetSparkline.prototype.select = function (slices) {
	console.log('not implemented');
};

/**
 * Clears the selection state of all bars in this sparkline.
 *
 * @method deselect
 */
FacetSparkline.prototype.deselect = function () {
	console.log('not implemented');
};

/**
 * @export
 * @type {Histogram}
 */
module.exports = FacetSparkline;

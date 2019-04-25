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

var _ = require('../../util/util');
var Facet = require('./facet');
var Histogram = require('./facetHistogram');
var HistogramFilter = require('./facetHistogramFilter');
var Sparkline = require('./facetSparkline');
var SparklineFilter = require('./facetSparklineFilter');
var Template = require('../../templates/facetHorizontal');

var ABBREVIATED_CLASS = 'facets-facet-horizontal-abbreviated';
var HIDDEN_CLASS = 'facets-facet-horizontal-hidden';

/**
 * Horizontal facet class, contains a histogram and controls to perform filters on it.
 *
 * @class FacetHorizontal
 * @param {jquery} container - The container element for this facet.
 * @param {Group} parentGroup - The group this facet belongs to.
 * @param {Object} spec - An object describing this facet.
 * @constructor
 */
function FacetHorizontal (container, parentGroup, spec) {
	Facet.call(this, container, parentGroup, spec);

	this._key = spec.key;
	this._spec = this.processSpec(spec);

	this._initializeLayout(Template);
	this.select(spec);
	this._setupHandlers();

	/* register the animation listener, animations can trigger add/remove handlers so their handler must be handled separately */
	this._element.on('transitionend', this._handleTransitionEnd.bind(this));
}

/**
 * @inheritance {Facet}
 */
FacetHorizontal.prototype = Object.create(Facet.prototype);
FacetHorizontal.prototype.constructor = FacetHorizontal;

/**
 * Returns this facet's key.
 *
 * @property key
 * @type {string}
 * @readonly
 */
Object.defineProperty(FacetHorizontal.prototype, 'key', {
	get: function () {
		return this._key;
	}
});

/**
 * The value of this facet.
 *
 * @property value
 * @type {*}
 * @readonly
 */
Object.defineProperty(FacetHorizontal.prototype, 'value', {
	get: function () {
		return this._key; // as of right now there can only be one facet per group, so the key and the value are the same
	}
});

/**
 * Defines if this facet has been visually compressed to its smallest possible state.
 * Note: Abbreviated facets cannot be interacted with.
 *
 * @property abbreviated
 * @type {boolean}
 */
Object.defineProperty(FacetHorizontal.prototype, 'abbreviated', {
	get: function () {
		return this._element.hasClass(ABBREVIATED_CLASS);
	},

	set: function(value) {
		if (value !== this.abbreviated) {
			if (value) {
				this._element.addClass(ABBREVIATED_CLASS);
				this._removeHandlers();
			} else {
				this._element.removeClass(ABBREVIATED_CLASS);
				this._addHandlers();
			}
		}
	}
});

/**
 * Defines if this facet is visible.
 *
 * @property visible
 * @type {boolean}
 */
Object.defineProperty(FacetHorizontal.prototype, 'visible', {
	get: function () {
		return !this._element.hasClass(HIDDEN_CLASS);
	},

	set: function(value) {
		if (value !== this.visible) {
			if (value) {
				this._element.removeClass(HIDDEN_CLASS);
				this._addHandlers();
			} else {
				this._element.addClass(HIDDEN_CLASS);
				this._removeHandlers();
			}
		}
	}
});

/**
 * Returns the range covered by this facet's filter.
 *
 * @property filterRange
 * @type {Object}
 * @readonly
 */
Object.defineProperty(FacetHorizontal.prototype, 'filterRange', {
	get: function () {

		var barRange, pointRange, pixelRange, fromInfo, toInfo;

		if (this._histogram) {

			barRange = this._histogramFilter.barRange;
			pixelRange = this._histogramFilter.pixelRange;
			fromInfo = this._histogram.bars[barRange.from].info;
			toInfo = this._histogram.bars[barRange.to].info;

			return {
				from: {
					index: barRange.from,
					pixel: pixelRange.from,
					label: fromInfo.label,
					count: fromInfo.count,
					metadata: fromInfo.metadata
				},
				to: {
					index: barRange.to,
					pixel: pixelRange.to,
					label: toInfo.toLabel,
					count: toInfo.count,
					metadata: toInfo.metadata
				}
			};

		} else if (this._sparkline) {

			pointRange = this._sparklineFilter.pointRange;
			pixelRange = this._sparklineFilter.pixelRange;
			fromInfo = this._sparkline.points[pointRange.from];
			toInfo = this._sparkline.points[pointRange.to];

			return {
				from: {
					index: pointRange.from,
					pixel: pixelRange.from,
					label: [fromInfo.x],
					count: [fromInfo.y],
					metadata: fromInfo.metadata
				},
				to: {
					index: pointRange.to,
					pixel: pixelRange.to,
					label: [toInfo.x],
					count: [toInfo.y],
					metadata: toInfo.metadata
				}
			};

		}


	}
});

/**
 * Marks this facet as selected and updates the visual state.
 *
 * @method select
 * @param {Object} data - Data used to select a range and sub-bar counts in this facet.
 */
FacetHorizontal.prototype.select = function(data) {

	var selectionData, from, to, fromIsString, toIsString, i, n;

	if (this._histogram) {

		if (data && 'selection' in data) {
			selectionData = data.selection;

			if ('range' in selectionData) {
				from = selectionData.range.from;
				to = selectionData.range.to;

				// string arguments are labels, number arguments are bin indices

				fromIsString = (typeof from === 'string' || (typeof from === 'object' && from.constructor === String));
				toIsString = (typeof to === 'string' || (typeof to === 'object' && to.constructor === String));

				var bars = this._histogram.bars;
				for (i = 0, n = bars.length; i < n && (fromIsString || toIsString); ++i) {
					var barMetadata = bars[i].metadata;

					for (var ii = 0, nn = barMetadata.length; ii < nn; ++ii) {
						var slice = barMetadata[ii];

						binStart = slice.label !== undefined ? slice.label : slice.binStart;
						binEnd = slice.toLabel !== undefined ? slice.toLabel : slice.binEnd;

						if (fromIsString && (binStart === from || +binStart === +from)) {
							from = i;
							fromIsString = false;
						}

						if (toIsString && (binEnd === to || +binEnd === +to)) {
							to = i;
							toIsString = false;
						}
					}
				}

				if (!fromIsString && !toIsString) {
					this._histogramFilter.setFilterBarRange({from: from, to: to});
				}
			} else {
				this._histogramFilter.setFilterPixelRange({ from: 0, to: this._histogram.totalWidth });
			}

			this._histogram.deselect();
			if ('slices' in selectionData) {
				this._histogram.select(selectionData.slices);
			}
		}

	} else if (this._sparkline) {

		if (data && 'selection' in data) {
			selectionData = data.selection;

			if ('range' in selectionData) {
				from = selectionData.range.from;
				to = selectionData.range.to;

				// string arguments are labels, number arguments are bin indices

				fromIsString = (typeof from === 'string' || (typeof from === 'object' && from.constructor === String));
				toIsString = (typeof to === 'string' || (typeof to === 'object' && to.constructor === String));

				var points = this._sparkline.points;
				for (i = 0, n = points.length; i < n && (fromIsString || toIsString); ++i) {
					var x = points[i].x;

					if (fromIsString && (x === from || +x === +from)) {
						from = i;
						fromIsString = false;
					}

					if (toIsString && (x === to || +x === +to)) {
						to = i;
						toIsString = false;
					}
				}

				if (!fromIsString && !toIsString) {
					this._sparklineFilter.setFilterPointRange({from: from, to: to});
				}
			} else {
				this._sparklineFilter.setFilterPixelRange({ from: 0, to: this._sparkline.totalWidth });
			}

			this._sparkline.deselect();
			if ('points' in selectionData) {
				this._sparkline.select(selectionData.points);
			}
		}

	}

};

/**
 * Marks this facet as not selected and updates the visual state.
 *
 * @method deselect
 */
FacetHorizontal.prototype.deselect = function() {

	if (this._histogram) {

		this._histogramFilter.setFilterPixelRange({ from: 0, to: this._histogram.totalWidth });
		this._histogram.deselect();

	} else if (this._sparkline) {

		this._sparklineFilter.setFilterPixelRange({ from: 0, to: this._sparkline.totalWidth });
		this._sparkline.deselect();
	}

};

/**
 * Processes the data in the provided spec and builds a new spec with detailed information.
 *
 * @method processSpec
 * @param {Object} inData - The original spec to process.
 * @returns {Object}
 */
FacetHorizontal.prototype.processSpec = function(inData) {

	if (inData.histogram) {

		var histogram = this.processHistogram(inData.histogram);
		histogram.scaleFn = inData.scaleFn;
		histogram.alwaysHighlight = inData.alwaysHighlight;
		var firstSlice = histogram.slices[0];
		var lastSlice = histogram.slices[histogram.slices.length - 1];

		var leftRangeLabel = firstSlice.label !== undefined ? firstSlice.label : firstSlice.binStart;
		var rightRangeLabel = (lastSlice.toLabel !== undefined || lastSlice.label !== undefined) ? (lastSlice.toLabel || lastSlice.label) : (lastSlice.binEnd || lastSlice.binStart);

		var displayFn = $.isFunction(inData.displayFn) ? inData.displayFn : false;
		if (displayFn) {
			leftRangeLabel = displayFn(leftRangeLabel);
			rightRangeLabel = displayFn(rightRangeLabel);
		}

		var outData = {
			histogram: histogram,
			leftRangeLabel: leftRangeLabel,
			rightRangeLabel: rightRangeLabel,
			filterable: inData.filterable !== undefined ? inData.filterable : true,
			displayFn: displayFn
		};
		return outData;

	} else if (inData.timeseries) {

		return inData;
	}

};

/**
 * Processes the histogram data and adds extra information to it.
 * Makes sure that all slices for the histogram are present and adds 0-count slices for any missing ones.
 *
 * @method processHistogram
 * @param {Object} inData - The data to process.
 * @returns {Object}
 */
FacetHorizontal.prototype.processHistogram = function(inData) {
	var outData = {
		slices: [],
		showOrigin: inData.showOrigin
	};

	var inSlices = inData.slices;
	var outSlices = outData.slices;

	var index = 0;
	for (var i = 0, n = inSlices.length; i < n; ++i, ++index) {
		var slice = inSlices[i];
		while (slice.index > index) {
			outSlices.push({
				label: 'Unknown',
				count: 0
			});
			++index;
		}

		outSlices.push(slice);
	}

	return outData;
};

/**
 * Updates this facet's spec with the passed data and then updates the facet's visual state.
 *
 * @method updateSpec
 * @param {Object} spec - The new spec for the facet
 */
FacetHorizontal.prototype.updateSpec = function (spec) {

	if (this._histogram) {

		this._spec.histogram = this._spec.histogram.concat(spec.histogram);

	} else if (this._sparkline) {

		this._spec.timeseries = this._spec.timeseries.concat(spec.timeseries);

	}

	this._removeHandlers();
	this._element.remove();
	this._spec = this.processSpec(this._spec);
	this._initializeLayout(Template);
	this.select(spec);
	this._addHandlers();
};

/**
 * Unbinds this instance from any reference that it might have with event handlers and DOM elements.
 *
 * @method destroy
 * @param {boolean=} animated - Should the facet be removed in an animated way before it being destroyed.
 */
FacetHorizontal.prototype.destroy = function(animated) {
	if (animated) {
		var _destroy = function() {
			this.off('facet-histogram:animation:visible-off', _destroy);
			this._destroy();
		}.bind(this);
		this.visible = false;
	} else {
		this._destroy();
	}
};

/**
 * Internal method to destroy this facet.
 *
 * @method _destroy
 * @private
 */
FacetHorizontal.prototype._destroy = function() {
	this._removeHandlers();
	this._element.off('transitionend');
	this._element.remove();
	Facet.prototype.destroy.call(this);
};

/**
 * Initializes all the layout elements based on the `template` provided.
 *
 * @method _initializeLayout
 * @param {function} template - The templating function used to create the layout.
 * @private
 */
FacetHorizontal.prototype._initializeLayout = function(template) {
	this._element = $(template(this._spec));
	this._container.append(this._element);
	this._svg = this._element.find('svg');

	var spec = {
		displayFn: this._spec.displayFn
	};

	if (this._spec.histogram) {

		this._histogram = new Histogram(this._svg, this._spec.histogram);
		this._histogramFilter = new HistogramFilter(this._element, this._histogram, spec);
		this._histogramFilter.setFilterPixelRange({ from: 0, to: this._histogram.totalWidth });

	} else if (this._spec.timeseries) {

		this._sparkline = new Sparkline(this._svg, this._spec);
		this._sparklineFilter = new SparklineFilter(this._element, this._sparkline, spec);
		this._sparklineFilter.setFilterPixelRange({ from: 0, to: this._sparkline.totalWidth });
	}

	this._rangeControls = this._element.find('.facet-range-controls');
};

/**
 * Adds the required event handlers needed to trigger this facet's own events.
 *
 * @method _addHandlers
 * @private
 */
FacetHorizontal.prototype._addHandlers = function() {

	if (this._histogram) {

		if (this.visible) {
			var bars = this._histogram.bars;
			for (var i = 0, n = bars.length; i < n; ++i) {
				bars[i]._addHandlers();
				bars[i].onMouseEnter = this._onMouseEventBar.bind(this, 'facet-histogram:mouseenter');
				bars[i].onMouseLeave = this._onMouseEventBar.bind(this, 'facet-histogram:mouseleave');
				bars[i].onClick = this._onMouseEventBar.bind(this, 'facet-histogram:click');
			}
			this._histogramFilter.onFilterChanged = this._onFilterChanged.bind(this);
		}

	} else if (this._sparkline) {

		// var points = this._sparkline.points;
		// for (var i = 0, n = bars.length; i < n; ++i) {
		// 	bars[i]._addHandlers();
		// 	bars[i].onMouseEnter = this._onMouseEventBar.bind(this, 'facet-histogram:mouseenter');
		// 	bars[i].onMouseLeave = this._onMouseEventBar.bind(this, 'facet-histogram:mouseleave');
		// 	bars[i].onClick = this._onMouseEventBar.bind(this, 'facet-histogram:click');
		// }
		this._sparklineFilter.onFilterChanged = this._onFilterChanged.bind(this);
	}


};

/**
 * Removes any added event handlers, virtually "muting" this facet
 *
 * @method _removeHandlers
 * @private
 */
FacetHorizontal.prototype._removeHandlers = function() {

	if (this._histogram) {

		var bars = this._histogram.bars;
		for (var i = 0, n = bars.length; i < n; ++i) {
			bars[i]._removeHandlers();
			bars[i].onMouseEnter = null;
			bars[i].onMouseLeave = null;
			bars[i].onClick = null;
		}

		this._histogramFilter.onFilterChanged = null;

	} else if (this._sparkline) {

		this._sparklineFilter.onFilterChanged = null;

	}

};

/**
 * Forwards a bar mouse event using the given type.
 *
 * @method _onMouseEventBar
 * @param {string} type - The type of the event to forward.
 * @param {FacetHistogramBar} bar - The bar which triggered the event.
 * @param {Event} event - The original event triggered.
 * @private
 */
FacetHorizontal.prototype._onMouseEventBar = function (type, bar, event) {
	var info = bar.info;
	this._formatLabels(info);
	this.emit(type, event, this._key, info, this);
};

FacetHorizontal.prototype._formatLabels = function (barInfo) {
	if (this._spec.displayFn) {
		barInfo.label = barInfo.label.map(this._spec.displayFn);
		barInfo.toLabel = barInfo.toLabel.map(this._spec.displayFn);
	}
};

/**
 * Handles the event when the filter range changes.
 *
 * @param {Object} newBarRange - A range object containing the new bar (slice/bucket) range.
 * @param {boolean=} fromUserInput - Defines if the filter range change was triggered by a user input interaction.
 * @private
 */
FacetHorizontal.prototype._onFilterChanged = function (newBarRange, fromUserInput) {
	var event = 'facet-histogram:rangechanged' + (fromUserInput ? 'user' : '');
	this.emit(event, null, this._key, this.filterRange, this);
};

/**
 * Transition end event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetHorizontal.prototype._handleTransitionEnd = function(evt) {
	var property = evt.originalEvent.propertyName;
	if (evt.target === this._element.get(0) && property === 'opacity') {
		if (this.visible) {
			this.emit('facet-histogram:animation:visible-on', evt, this._key, this);
		} else {
			this.emit('facet-histogram:animation:visible-off', evt, this._key, this);
		}
	} else if (evt.target === this._rangeControls.get(0) && property === 'opacity') {
		if (this.abbreviated) {
			this.emit('facet-histogram:animation:abbreviated-on', evt, this._key, this);
		} else {
			this.emit('facet-histogram:animation:abbreviated-off', evt, this._key, this);
		}
	}
};

/**
 * @export
 * @type {FacetHorizontal}
 */
module.exports = FacetHorizontal;

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

var TIMESERIES_X_INDEX = 0;
var TIMESERIES_Y_INDEX = 1;

/**
 * Helper class to manage the range filtering tools.
 *
 * @class FacetSparklineFilter
 * @param {jQuery} element - A jQuery wrapped element that contains all the range manipulation tools.
 * @param {FacetSparkline} sparkline - The sparkline to which the tools will be linked to.
 * @param {Object} spec - a spec for the filter
 * @constructor
 */
function FacetSparklineFilter (element, sparkline, spec) {
	this._element = element;
	this._sparkline = sparkline;
	this._rangeFilter = element.find('.facet-range-filter');
	this._leftHandle = this._rangeFilter.find('.facet-range-filter-left');
	this._rightHandle = this._rangeFilter.find('.facet-range-filter-right');

	this._currentRangeLabel = element.find('.facet-range-current');
	this._pageLeft = element.find('.facet-page-left');
	this._pageRight = element.find('.facet-page-right');

	this._draggingLeft = false;
	this._draggingLeftX = 0;
	this._canDragLeft = false;

	this._draggingRight = false;
	this._draggingRightX = 0;
	this._canDragRight = false;

	this._pixelRange = {
		from: 0,
		to: 0
	};

	this._pointRange = {
		from: 0,
		to: 0
	};

	this._maxPointRange = {
		from: 0,
		to: (sparkline.points.length - 1)
	};

	this._onFilterChanged = null;

  if (spec !== undefined) {
        this._spec = spec;
  }

	this._initializeDragging();
	this._initializePagination();

	this._rangeFilter.removeClass('facet-range-filter-init');
}

/**
 * A callback function invoked when the filter range is changed.
 *
 * @property onFilterChanged
 * @type {function}
 */
Object.defineProperty(FacetSparklineFilter.prototype, 'onFilterChanged', {
	get: function () {
		return this._onFilterChanged;
	},

	set: function (value) {
		if (typeof value === "function") {
			this._onFilterChanged = value;
		} else {
			this._onFilterChanged = null;
		}
	}
});

/**
 * Represents the point range of this sparkline filter.
 *
 * @property pointRange
 * @type {Object}
 */
Object.defineProperty(FacetSparklineFilter.prototype, 'pointRange', {
	get: function () {
		return this._pointRange;
	},

	set: function (value) {
		this.setFilterPointRange(value, false);
	}
});

/**
 * Represents the pixel range of this sparkline filter.
 *
 * @property pixelRange
 * @type {Object}
 */
Object.defineProperty(FacetSparklineFilter.prototype, 'pixelRange', {
	get: function () {
		return this._pixelRange;
	},

	set: function (value) {
		this.setFilterPixelRange(value, false);
	}
});

/**
 * Initializes the dragging functionality for the range selection controls.
 *
 * @method _initializeDragging
 * @private
 */
FacetSparklineFilter.prototype._initializeDragging = function () {
	var calculateFrom = function (range, offset, lineWidth, totalWidth) {
		range.from = Math.max(0, range.from + offset);
		if (range.from > range.to - lineWidth) {
			if (range.from + lineWidth < totalWidth) {
				range.to = range.from + lineWidth;
			} else {
				range.from = totalWidth - lineWidth;
				range.to = totalWidth;
			}
		}
	};

	var calculateTo = function (range, offset, lineWidth, totalWidth) {
		range.to = Math.min(totalWidth, range.to + offset);
		if (range.to < range.from + lineWidth) {
			if (range.to - lineWidth > 0) {
				range.from = range.to - lineWidth;
			} else {
				range.from = 0;
				range.to = lineWidth;
			}
		}
	};

	var lineWidth = this._sparkline.lineWidth;
	var totalWidth = this._sparkline.totalWidth;

	var endDragging = function (event) {
		if (this._draggingLeft || this._draggingRight) {
			event.preventDefault();
			var range = {
				from: this._pixelRange.from,
				to: this._pixelRange.to
			};

			if (this._draggingLeft) {
				this._canDragLeft = false;
				this._draggingLeft = false;
				calculateFrom(range, (event.clientX - this._draggingLeftX), lineWidth, totalWidth);
			}

			if (this._draggingRight) {
				this._canDragRight = false;
				this._draggingRight = false;
				calculateTo(range, (event.clientX - this._draggingRightX), lineWidth, totalWidth);
			}

			this.setFilterPixelRange(range, true);
			return false;
		}
		return true;
	}.bind(this);

	this._element.mouseleave(endDragging);
	this._element.mouseup(endDragging);

	this._element.mousemove(function(event) {
		if (this._canDragLeft || this._canDragRight) {
			var range = {
				from: this._pixelRange.from,
				to: this._pixelRange.to
			};

			if (this._canDragLeft) {
				if (!this._draggingLeft) {
					this._draggingLeft = true;
				}
				calculateFrom(range, (event.clientX - this._draggingLeftX), lineWidth, totalWidth);
			}

			if (this._canDragRight) {
				if (!this._draggingRight) {
					this._draggingRight = true;
				}
				calculateTo(range, (event.clientX - this._draggingRightX), lineWidth, totalWidth);
			}

			var pointRange = this._sparkline.pixelRangeToPointRange(range);
			this.updateUI(pointRange, range);
		}
	}.bind(this));

	this._leftHandle.mousedown(function (event) {
		event.preventDefault();
		this._canDragLeft = true;
		this._draggingLeft = false;
		this._draggingLeftX = event.clientX;
		return false;
	}.bind(this));

	this._rightHandle.mousedown(function (event) {
		event.preventDefault();
		this._canDragRight = true;
		this._draggingRight = false;
		this._draggingRightX = event.clientX;
		return false;
	}.bind(this));
};

/**
 * Initializes the pagination functionality of the range manipulation controls.
 *
 * @method _initializePagination
 * @private
 */
FacetSparklineFilter.prototype._initializePagination = function () {
	this._pageLeft.click(function() {
		var from = this._pointRange.from;
		var to = this._pointRange.to;
		var maxFrom = this._maxPointRange.from;

		if (from > maxFrom) {
			var offset = to - from + 1;
			if (from - offset < maxFrom) {
				offset = from - maxFrom;
			}

			this.setFilterPointRange({
				from: from - offset,
				to: to - offset
			}, true);
		}
	}.bind(this));

	this._pageRight.click(function() {
		var from = this._pointRange.from;
		var to = this._pointRange.to;
		var maxTo = this._maxPointRange.to;

		if (to < maxTo) {
			var offset = to - from + 1;
			if (to + offset > maxTo) {
				offset = maxTo - to;
			}

			this.setFilterPointRange({
				from: from + offset,
				to: to + offset
			}, true);
		}
	}.bind(this));
};

/**
 * Sets the given pixel range as the currently active range.
 * NOTE: This function rounds the pixel range to the closes possible point range.
 *
 * @method setFilterPixelRange
 * @param {Object} pixelRange - A range object containing the pixel coordinates to be selected.
 * @param {boolean=} fromUserInput - Defines if the filter range change was triggered by a user input interaction.
 */
FacetSparklineFilter.prototype.setFilterPixelRange = function (pixelRange, fromUserInput) {
	this.setFilterPointRange(this._sparkline.pixelRangeToPointRange(pixelRange), fromUserInput);
};

/**
 * Sets the given point range as the currently active range.
 *
 * @method setFilterPointRange
 * @param {Object} pointRange - The point range to select.
 * @param {boolean=} fromUserInput - Defines if the filter range change was triggered by a user input interaction.
 */
FacetSparklineFilter.prototype.setFilterPointRange = function (pointRange, fromUserInput) {
	var pixelRange = this._sparkline.pointRangeToPixelRange(pointRange);

	this._pixelRange = pixelRange;
	this._pointRange = pointRange;

	this.updateUI(pointRange, pixelRange);

	if (this._onFilterChanged) {
		this._onFilterChanged(pointRange, fromUserInput);
	}
};

/**
 * Updates the UI components of the range manipulation tools.
 * NOTE: The `pointRange` and the `pixelRange` may be different, this function does NOT perform tests to make sure they are equivalent.
 *
 * @method updateUI
 * @param {Object} pointRange - The point range used to update the UI
 * @param {Object} pixelRange - The pixel range to update the UI
 */
FacetSparklineFilter.prototype.updateUI = function (pointRange, pixelRange) {
	var points = this._sparkline.points;

	var leftPoint = points[pointRange.from].x;
	var rightPoint = points[pointRange.to].x;

	var fromLabel = leftPoint;
	var toLabel = rightPoint;

	var displayFn = this._spec ? this._spec.displayFn : false;
	if ($.isFunction(displayFn)) {
		fromLabel = this._spec.displayFn(fromLabel);
		toLabel = this._spec.displayFn(toLabel);
	}

	this._currentRangeLabel.text(fromLabel + ' - ' + toLabel);

	this._sparkline.highlightRange(pointRange);

	this._rangeFilter.css('left', pixelRange.from);
	this._rangeFilter.css('width', pixelRange.to - pixelRange.from);

	if (pointRange.from === this._maxPointRange.from && pointRange.to === this._maxPointRange.to) {
		this._currentRangeLabel.addClass('facet-range-current-hidden');
	} else {
		this._currentRangeLabel.removeClass('facet-range-current-hidden');
	}

	if (pointRange.from === this._maxPointRange.from) {
		this._pageLeft.addClass('facet-page-ctrl-disabled');
	} else {
		this._pageLeft.removeClass('facet-page-ctrl-disabled');
	}

	if (pointRange.to === this._maxPointRange.to) {
		this._pageRight.addClass('facet-page-ctrl-disabled');
	} else {
		this._pageRight.removeClass('facet-page-ctrl-disabled');
	}
};

/**
 * @export
 * @type {FacetSparklineFilter}
 */
module.exports = FacetSparklineFilter;

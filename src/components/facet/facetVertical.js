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

var facetVertical_icon = require('../../templates/facetVertical_icon');
var facetVertical_links = require('../../templates/facetVertical_links');
var facetVertical_search = require('../../templates/facetVertical_search');
var facetVertical_queryClose = require('../../templates/facetVertical_queryClose');
var facetVertical_bar = require('../../templates/facetVertical_bar');
var facetVertical_sparkline = require('../../templates/facetVertical_sparkline');

var Handlebars = require('handlebars');
var Template = require('../../templates/facetVertical');

var HIGHLIGHT_CLASS = 'facet-icon-highlighted';
var ABBREVIATED_CLASS = 'facets-facet-vertical-abbreviated';
var HIDDEN_CLASS = 'facets-facet-vertical-hidden';
var SELECTED_CLASS = 'facet-bar-selected';
var TIMESERIES_X_INDEX = 0;
var TIMESERIES_Y_INDEX = 1;

/**
 * Vertical facet class, standard facet class.
 *
 * @class FacetVertical
 * @param {jquery} container - The container element for this facet.
 * @param {Group} parentGroup - The group this facet belongs to.
 * @param {Object} spec - An object describing this facet.
 * @constructor
 */
function FacetVertical (container, parentGroup, spec) {
	Facet.call(this, container, parentGroup, spec);

	this._value = spec.value;
	this._key = spec.key;
	this._count = spec.count;
	this._type = this._spec.isQuery ? 'query' : 'facet';
	this._hasEmittedSelectedEvent = false;

	this._colors = spec.colors ? spec.colors : (this._spec.icon.color ? [ this._spec.icon.color ] : [ '#000' ]);

	if (this._spec.isQuery && this._key != '*') {
		this._spec.displayValue = this._key + ':' + (this._spec.label ? this._spec.label : this._spec.value);
	}

	/* register the partials to build the template */
	Handlebars.registerPartial('facetVertical_icon', facetVertical_icon);
	Handlebars.registerPartial('facetVertical_links', facetVertical_links);
	Handlebars.registerPartial('facetVertical_search', facetVertical_search);
	Handlebars.registerPartial('facetVertical_queryClose', facetVertical_queryClose);
	Handlebars.registerPartial('facetVertical_bar', facetVertical_bar);
	Handlebars.registerPartial('facetVertical_sparkline', facetVertical_sparkline);

	this._initializeLayout(Template);
	var sparklineDrawn = false;
	if ('selected' in this._spec) {
		sparklineDrawn = true;
		this.select(this._spec.selected);
	}
	this.highlighted = Boolean(this._spec.highlighted);
	this._setupHandlers();

	/* register the animation listener, animations can trigger add/remove handlers so their handler must be handled separately */
	this._element.on('transitionend', this._handleTransitionEnd.bind(this));

	/* Sparkline must be drawn after it's been inserted into the dom since we need to width/height to get pixel coords */
	if (!sparklineDrawn) {
		this._updateSparkline();
	}
}

/**
 * @inheritance {Facet}
 */
FacetVertical.prototype = Object.create(Facet.prototype);
FacetVertical.prototype.constructor = FacetVertical;

/**
 * This facet's key.
 *
 * @property key
 * @type {string}
 * @readonly
 */
Object.defineProperty(FacetVertical.prototype, 'key', {
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
Object.defineProperty(FacetVertical.prototype, 'value', {
	get: function () {
		return this._value;
	}
});

/**
 * The configured icon for this facet.
 *
 * @property icon
 * @type {Object}
 * @readonly
 */
Object.defineProperty(FacetVertical.prototype, 'icon', {
	get: function () {
		return this._spec.icon;
	}
});

/**
 * The total number of matches for this facet.
 *
 * @property total
 * @type {number}
 */
Object.defineProperty(FacetVertical.prototype, 'total', {
	get: function () {
		return this._spec.total;
	},

	set: function (value) {
		this._spec.total = value;
		this._update();
	}
});

/**
 * The count of matches for this facet.
 *
 * @property count
 * @type {number}
 * @readonly
 */
Object.defineProperty(FacetVertical.prototype, 'count', {
	get: function () {
		return this._spec.count;
	}
});

/**
 * Defines if this facet has been highlighted.
 *
 * @property highlighted
 * @type {boolean}
 */
Object.defineProperty(FacetVertical.prototype, 'highlighted', {
	get: function () {
		return this._iconContainer.hasClass(HIGHLIGHT_CLASS);
	},

	set: function (value) {
		if (value) {
			this._iconContainer.addClass(HIGHLIGHT_CLASS);
		} else {
			this._iconContainer.removeClass(HIGHLIGHT_CLASS);
		}
	}
});

/**
 * Defines if this facet has been visually compressed to its smallest possible state.
 * Note: Abbreviated facets cannot be interacted with.
 *
 * @property abbreviated
 * @type {boolean}
 */
Object.defineProperty(FacetVertical.prototype, 'abbreviated', {
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
Object.defineProperty(FacetVertical.prototype, 'visible', {
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
 * Marks this facet as selected and updates the visual state.
 *
 * @method select
 * @param {(number|Object)} selected - Either the selection object or the count of selected elements, for this facet.
 */
FacetVertical.prototype.select = function(selected) {
	this._spec.selected = {
		count: selected.count || selected,
		countLabel: selected.countLabel,
		segments: selected.segments,
		timeseries: selected.timeseries
	};
	this._update();
};

/**
 * Marks this facet as not selected and updates the visual state.
 *
 * @method deselect
 */
FacetVertical.prototype.deselect = function() {
	delete this._spec.selected;
	this._update();
};

/**
 * Updates this facet's spec with the passed data and then updates the facet's visual state.
 *
 * @method updateSpec
 * @param {Object} spec - The new spec for the facet
 */
FacetVertical.prototype.updateSpec = function (spec) {
	this._spec = _.extend(this._spec, spec);
	this.highlighted = Boolean(this._spec.highlighted);
	if ('selected' in this._spec) {
		this.select(this._spec.selected);
		delete this._spec.selected;
	} else {
		this._update();
	}
};

/**
 * Updates the hit count of this facet and updates the visual state.
 *
 * @method updateCount
 * @param {number} count - The new hit count for this facet.
 */
FacetVertical.prototype.updateCount = function(count) {
	this._spec.count += count;
	this._update();
};

/**
 * Updates the group total and updates the visual state (equivalent to the `total` property)
 *
 * @method rescale
 * @param groupTotal
 */
FacetVertical.prototype.rescale = function(groupTotal) {
	this.total = groupTotal;
};

/**
 * Unbinds this instance from any reference that it might have with event handlers and DOM elements.
 *
 * @method destroy
 * @param {boolean=} animated - Should the facet be removed in an animated way before it being destroyed.
 */
FacetVertical.prototype.destroy = function(animated) {
	if (animated) {
		var _destroy = function() {
			this.off(this._type + ':animation:visible-off', _destroy);
			this._destroy();
		}.bind(this);
		this.visible = false;
	} else {
		this._destroy();
	}
	Facet.prototype.destroy.call(this);
};

/**
 * Internal method to destroy this facet.
 *
 * @method _destroy
 * @private
 */
FacetVertical.prototype._destroy = function() {
	this._removeHandlers();
	this._element.off('transitionend');
	this._element.remove();
};

/**
 * Initializes all the layout elements based on the `template` provided.
 *
 * @method _initializeLayout
 * @param {function} template - The templating function used to create the layout.
 * @private
 */
FacetVertical.prototype._initializeLayout = function(template) {
	this._element = $(template(this._spec));
	this._container.append(this._element);

	this._barContainer = this._element.find('.facet-bar-container');
	var bars = this._barContainer.children('.facet-bar-base');
	this._barBackground = $(bars[0]);
	this._barForeground = $(bars[1]);

	this._iconContainer = this._element.find('.facet-icon');
	this._icon = this._iconContainer.children('i');
	this._iconColor = this._spec.icon && this._spec.icon.color ? this._spec.icon.color : null;

	this._label = this._element.find('.facet-label');
	this._labelCount = this._element.find('.facet-label-count');

	this._linksContainer = this._element.find('.facet-links');
	this._queryCloseContainer = this._element.find('.facet-query-close');
	this._searchContainer = this._element.find('.facet-search-container');
	if (!this._searchContainer.children().length) {
		this._searchContainer.empty();
	}

	this._sparklineContainer = this._element.find('.facet-sparkline-container');
	this._sparklineSVG = $(facetVertical_sparkline(this._spec));
	this._sparklineContainer.append(this._sparklineSVG);
};

/**
 * Adds the necessary event handlers for this object to function.
 *
 * @method _addHandlers
 * @private
 */
FacetVertical.prototype._addHandlers = function() {
	if (this.visible) {
		this._element.click(this._onClick.bind(this));
		this._element.hover(
			this._onMouseEnter.bind(this),
			this._onMouseLeave.bind(this));
		this._element.find('.facet-search-container').on('click.facetSearch', this._onSearch.bind(this));
		this._element.find('.facet-links').on('click.facetLink', this._onLink.bind(this));
		this._element.find('.facet-query-close').on('click.queryClose', this._onClose.bind(this));
	}
};

/**
 * Removes all the event handlers added by the `_addHandlers` function.
 *
 * @method _removeHandlers
 * @private
 */
FacetVertical.prototype._removeHandlers = function() {
	this._element.off('click');
	this._element.off('hover');
	this._element.find('.facet-search-container').off('click.facetSearch');
	this._element.find('.facet-links').off('click.facetLink');
};

/**
 * Creates a SVG Path element for timeseries data
 * @param {Number} width - width of the container in pixels
 * @param {Number} height - height of the container in pixels
 * @param {Array} timeseries - array of {Number} representing values over time
 * @param {Number} maxValue - value to treat as the total/maximum value
 * @returns {*|jQuery|HTMLElement} - SVG Path containing the rendered data without styling
 * @method _renderSparkline
 * @private
 */
FacetVertical.prototype._renderSparkline = function(width, height, sparkline, minXValue, maxXValue, maxYValue, index) {

	var x = 0, y = 0;
	var i;
	var pathData = 'M ';

	if (sparkline.length > 0 && Array.isArray(sparkline[0])) {
		// each entry is two values, x and y
		var xrange = maxXValue - minXValue;
		for (i = 0; i < sparkline.length; i++) {
			var entry = sparkline[i];
			x = width * ((entry[TIMESERIES_X_INDEX] - minXValue) / xrange);
			y = height - Math.floor((entry[TIMESERIES_Y_INDEX])/maxYValue * height) + 1;
			pathData += (x + ' ' + y);
			if (i < sparkline.length-1) {
				pathData += ' L ';
			}
		}
	} else {
		// each entry is one value, y
		var dx = width / (maxXValue);

		for (i = 0; i < sparkline.length; i++) {
			y = height - Math.floor((sparkline[i])/maxYValue * height) + 1;
			pathData += (x + ' ' + y);
			if (i < sparkline.length-1) {
				pathData += ' L ';
			}
			x += dx;
		}
	}

	var pathEl = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
	pathEl.attr('d', pathData);
	return pathEl;
};

/**
 * Re-render the sparkline if we've been provided timeseries data
 *
 * @method _updateSparkline
 * @private
 */
FacetVertical.prototype._updateSparkline = function() {

	if (!this._spec.timeseries && !this._spec.multipleTimeseries) {
		return;
	}

	this._sparklineSVG.empty();

	this._sparkWidth = this._sparklineSVG.width();
	this._sparkHeight = this._sparklineSVG.height() - 2;

	this._minX = Infinity;
	this._maxX = -Infinity;
	this._minY = Infinity;
	this._maxY = -Infinity;
	this._sparklineLength = 0;

	// backwards compatibility
	var sparkline = this._spec.timeseries || this._spec.multipleTimeseries;

	this._sparkline = sparkline;
	this._hasMultipleSparklines = !!this._spec.multipleTimeseries;

	var that = this;
	var x, y,  i;

	if (this._hasMultipleSparklines) {
		// muiltiple sparkline

		var exists = {};
		this._sparkline.forEach(function(subseries) {

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
						exists[x] = point;
					} else {
						exists[x].y.push(y);
					}

				}

			} else {

				that._minX = 0;
				that._maxX = Math.max(that._maxX, subseries.length - 1);

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
						exists[i] = point;
					} else {
						exists[i].y.push(subseries[i]);
					}
				}
			}
			that._sparklineLength = Math.max(that._sparklineLength, subseries.length);
		});


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
			}

		} else {

			this._minX = 0;
			this._maxX = sparkline.length - 1;
			for (i=0; i<sparkline.length; i++) {
				this._minY = Math.min(this._minY, sparkline[i]);
				this._maxY = Math.max(this._maxY, sparkline[i]);
			}

		}
		this._sparklineLength = sparkline.length;
	}

	this._lineWidth = this._sparkWidth / this._sparklineLength;

	this._totalWidth = this._sparkWidth;

	//

	if (this._hasMultipleSparklines) {
		// muiltiple sparkline

		this._sparkline.forEach(function(subseries, index) {
			var totalSparklinePath = that._renderSparkline(that._sparkWidth, that._sparkHeight, subseries, that._minX, that._maxX, that._maxY, index);
			totalSparklinePath.appendTo(that._sparklineSVG);

			if (that._spec.selected && that._spec.selected.timeseries) {
				totalSparklinePath[0].classList.add('facet-sparkline-total');
			} else {
				totalSparklinePath.css('stroke', that._colors[index % that._colors.length]);
			}
		});

		if (this._spec.selected && this._spec.selected.timeseries) {
			var selectedSparklinePath = this._renderSparkline(this._sparkWidth, this._sparkHeight, this._spec.selected.timeseries, this._minX, this._maxX, this._maxY, 0);
			selectedSparklinePath.appendTo(this._sparklineSVG);

			selectedSparklinePath[0].classList.add('facet-sparkline-selected');

			if (this._spec.isQuery && this._spec.icon && this._spec.icon.color) {
				selectedSparklinePath.css('stroke', this._spec.icon.color);
			}
		}

	} else {
		// single sparkline

		var totalSparklinePath = this._renderSparkline(this._sparkWidth, this._sparkHeight, this._sparkline, this._minX, this._maxX, this._maxY, 0);
		totalSparklinePath.appendTo(this._sparklineSVG);

		if (this._spec.selected && this._spec.selected.timeseries) {
			var selectedSparklinePath = this._renderSparkline(this._sparkWidth, this._sparkHeight, this._spec.selected.timeseries, this._minX, this._maxX, this._maxY, 0);
			selectedSparklinePath.appendTo(this._sparklineSVG);

			totalSparklinePath[0].classList.add('facet-sparkline-total');
			selectedSparklinePath[0].classList.add('facet-sparkline-selected');

			if (this._spec.isQuery && this._spec.icon && this._spec.icon.color) {
				selectedSparklinePath.css('stroke', this._spec.icon.color);
			}
		} else {

			totalSparklinePath.css('stroke', this._colors[0]);
		}
	}



};

/**
 * Updates the visual state of this facet.
 *
 * @method _update
 * @private
 */
FacetVertical.prototype._update = function() {
	var spec = this._spec;
	var selectedCount = spec.selected && spec.selected.count;
	var selectionSegments = spec.selected && spec.selected.segments || [];
	var isSelectionWithNoSegments = selectedCount >= 0 && selectionSegments.length === 0;
	var facetCount = isSelectionWithNoSegments ? selectedCount : spec.count;
	var barForegroundWidth = ((facetCount / spec.total) * 100) + '%';
	var newLabelHTML = spec.displayValue || spec.label || spec.value;
	var countLabel = (spec.selected && spec.selected.countLabel) || spec.countLabel || spec.count.toString();

	/* icon */ // TODO: Only update if the current icon is not the same as the icon in the spec.
	this._iconContainer.empty();
	this._iconContainer.append($(facetVertical_icon(this._spec)));
	this._icon = this._iconContainer.children('i');
	this._iconColor = this._spec.icon && this._spec.icon.color ? this._spec.icon.color : null;

	/* bar background */
	this._barBackground.css('width', ((spec.count / spec.total) * 100) + '%');

	/* bar foreground */
	if (selectedCount >= 0) {
		if (!this._barForeground.hasClass(SELECTED_CLASS)) {
			this._barForeground.removeAttr('style');
			if (selectionSegments.length === 0 && selectedCount > 0) {
				this._barForeground.addClass(SELECTED_CLASS);
			}
		}
		this._barForeground.css('width', barForegroundWidth);
	} else {
		if (this._iconColor && !spec.segments) {
			this._barForeground.css('box-shadow', 'inset 0 0 0 1000px ' + this._iconColor);
		}
		this._barForeground.removeClass(SELECTED_CLASS);
		this._barForeground.css('width', barForegroundWidth);
	}

	/* bar segments */
	this._barForeground.children().each(function (index, child) {
		var segment = selectionSegments[index] || spec.segments[index];
		var segmentCount = isSelectionWithNoSegments ? 0 : segment.count;
		$(child).toggleClass('zero-width', segmentCount === 0);
		$(child).css({
			'width': ((segmentCount / spec.count) * 100) + '%',
			'box-shadow': 'inset 0 0 0 1000px ' + segment.color
		});
	});

	/* label */
	if (this._label.html() !== newLabelHTML) {
		this._label.html(newLabelHTML);
	}

	/* count label */
	if (this._labelCount.html() !== countLabel) {
		this._labelCount.html(countLabel);
	}

	/* links */ // TODO: Only update if the current icon is not the same as the icon in the spec.
	this._linksContainer.empty();
	this._linksContainer.append(facetVertical_links(this._spec));

	/* search */ // TODO: Only update if the current icon is not the same as the icon in the spec.
	this._searchContainer.empty();
	this._searchContainer.append(facetVertical_search(this._spec));
	if (!this._searchContainer.children().length) {
		this._searchContainer.empty();
	}

	/* sparkline */
	this._updateSparkline();
};

/**
 * Click event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetVertical.prototype._onClick = function(evt) {
	this.emit(this._type + ':click', evt, this._key, this._value, this._count, this);
};

/**
 * Search event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetVertical.prototype._onSearch = function(evt) {
	evt.stopPropagation();
	this.emit(this._type + ':search', evt, this._key, this._value, this._count, this);
};

/**
 * Link click event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetVertical.prototype._onLink = function(evt) {
	evt.stopPropagation();
	this.emit(this._type + ':link', evt, this._key, this._value, this._count, this);
};

/**
 * Close event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetVertical.prototype._onClose = function(evt) {
	evt.stopPropagation();
	this.emit(this._type + ':close', evt, this._key, this._value, this._count, this);
};

/**
 * Mouse enter event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetVertical.prototype._onMouseEnter = function(evt) {
	this.emit(this._type + ':mouseenter', evt, this._key, this._value, this._count, this);
};

/**
 * Mouse leave event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetVertical.prototype._onMouseLeave = function(evt) {
	this.emit(this._type + ':mouseleave', evt, this._key, this._value, this._count, this);
};

/**
 * Transition end event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
FacetVertical.prototype._handleTransitionEnd = function(evt) {
	this._updateSparkline();
	var property = evt.originalEvent.propertyName;
	if (evt.target === this._element.get(0) && property === 'opacity') {
		if (this.visible) {
			this.emit(this._type + ':animation:visible-on', evt, this._key, this._value, this._count, this);
		} else {
			this.emit(this._type + ':animation:visible-off', evt, this._key, this._value, this._count, this);
		}
	} else if (evt.target === this._iconContainer.get(0) && property === 'opacity') {
		if (this.abbreviated) {
			this.emit(this._type + ':animation:abbreviated-on', evt, this._key, this._value, this._count, this);
		} else {
			this.emit(this._type + ':animation:abbreviated-off', evt, this._key, this._value, this._count, this);
		}
	} else if (evt.target === this._barBackground.get(0) && property === 'width') {
		this.emit(this._type + ':animation:bar-width-change', evt, this._key, this._value, this._count, this);
	} else if (evt.target === this._barForeground.get(0) && property === 'width') {
		if (!this._hasEmittedSelectedEvent && this._barForeground.hasClass(SELECTED_CLASS)) {
			this.emit(this._type + ':animation:selected-on', evt, this._key, this._value, this._count, this);
			this._hasEmittedSelectedEvent = true;
		} else if (this._hasEmittedSelectedEvent && !this._barForeground.hasClass(SELECTED_CLASS)) {
			this.emit(this._type + ':animation:selected-off', evt, this._key, this._value, this._count, this);
			this._hasEmittedSelectedEvent = false;
		}
	}
};

/**
 * @export
 * @type {FacetVertical}
 */
module.exports = FacetVertical;

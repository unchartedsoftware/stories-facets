var Template = require('../templates/selectionGroup');
var SelectionBadge = require('./selectionBadge');

/**
 * Special group class used to represent the selected facets in the facets widget.
 *
 * @class SelectionGroup
 * @param {jquery} container - The container where this group will be added.
 * @param
 * @constructor
 */
function SelectionGroup(container, options) {
  this._selectionBadges = [];
  this._element = $(Template(options));
  this._container = container;
  this._container.append(this._element);

  this._badgeContainer = this._container.find('.facets-selection-group-badges');
}

/**
 * The selection badges in this group
 *
 * @property selectionBadges
 * @type {Array}
 */
Object.defineProperty(SelectionGroup.prototype, 'selectionBadges', {
	get: function () {
		return this._selectionBadges;
	}
});

SelectionGroup.prototype._add = function (key, facet) {
  var value = facet.value;
  var badgeFound = this._getBadge(key, value);

  //Avoid adding duplicates
  if (badgeFound === null) {
    var label = this._generateBadgeLabel(facet);
    var badgeSpec = {key: key, value: value, label: label};
    var badge = new SelectionBadge(this._badgeContainer, badgeSpec);
    this._selectionBadges.push(badge);
  }
};

/**
 * Creates a label to display on a badge.
 *
 * @method _generateBadgeLabel
 * @param {Object} facet - facet selection data
 * @returns {String}
 */
SelectionGroup.prototype._generateBadgeLabel = function (facet) {
  var label = facet.value;

  if ('selection' in facet) {
    var selectionData = facet.selection;

    if ('range' in selectionData) { //Range selections
      var from = selectionData.range.from;
      var to = selectionData.range.to;
      label = from +' to '+to;
    }
  }
  return label;
};

/**
 * Removes all badges in this group
 *
 */
SelectionGroup.prototype.removeAllBadges = function () {
  this._selectionBadges.forEach(function (bg) {
		bg.destroy();
	});
  this._selectionBadges = [];
};

/**
 * Removes all badges that match the provided key
 *
 * @param {*} key - The key of the badge to remove.
 */
SelectionGroup.prototype.removeBadgesByKey = function (key) {
  var badgesArr = this._selectionBadges.slice(0);

  badgesArr.forEach(function (bg) {
    if (bg.key === key) {
      this.removeBadge(bg.key, bg.value);
    }
  }, this);
};

/**
 * Removes a selection badge from this group.
 *
 * @param {*} key - The key of the badge to remove.
 * @param {*} value - The value of the badge to remove.
 */
SelectionGroup.prototype.removeBadge = function (key, value) {
	var badge = this._getBadge(key, value);
	if (badge) {
		var index = this._selectionBadges.indexOf(badge);
		if (index >= 0) {
      badge.destroy();
			this._selectionBadges.splice(index, 1);
		}
	}
};

/**
 * Gets the selection badge representing the selection with the specified key and value.
 *
 * @method _getBadge
 * @param {*} key - The key to look for.
 * @param {*} value - The value to look for.
 * @returns {SelectionBadge|null}
 */
SelectionGroup.prototype._getBadge = function (key, value) {
	var badgeObj = this._selectionBadges.filter(function (badge) {
		return badge.key === key && badge.value === value;
	});

	if (badgeObj && badgeObj.length > 0) {
		return badgeObj[0];
	} else {
		return null;
	}
};

/**
 * Sets this group to be garbage collected by removing all references to event handlers and DOM elements.
 * Calls `destroy` on its badges.
 *
 * @method destroy
 */
SelectionGroup.prototype.destroy = function () {
	this._selectionBadges.forEach(function (bg) {
		bg.destroy();
	});
	this._selectionBadges = [];
	this._element.remove();
};

/**
 * @export
 * @type {SelectionGroup}
 */
module.exports = SelectionGroup;

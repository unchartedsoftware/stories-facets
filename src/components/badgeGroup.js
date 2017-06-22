var Template = require('../templates/BadgeGroup');
var Badge = require('./badge');

/**
 * Special group class used to represent the badges in the facets widget.
 *
 * @class BadgeGroup
 * @param {jquery} container - The container where this group will be added.
 * @param
 * @constructor
 */
function BadgeGroup(container, options) {
  this._badges = [];
  this._element = $(Template(options));
  this._container = container;
  this._container.append(this._element);

  this._badgeContainer = this._container.find('.facets-badges');
}

/**
 * The badges in this group
 *
 * @property badges
 * @type {Array}
 */
Object.defineProperty(BadgeGroup.prototype, 'badges', {
	get: function () {
		return this._badges;
	}
});

/**
 * Creates a badge and adds it to this group.
 *
 * @method _createBadge
 * @param {*} key - The key of the badge to remove.
 * @param {*} value - The value of the badge to remove.
 */
BadgeGroup.prototype._createBadge = function (key, value) {
  var badgeFound = this._getBadge(key, value);

  //Avoid adding duplicates
  if (badgeFound === null) {
    var label = value;
    var badgeSpec = {key: key, value: value, label: label};
    var badge = new Badge(this._badgeContainer, badgeSpec);
    this._badges.push(badge);
  }
};

/**
 * Creates a label to display on a badge.
 *
 * @method _generateBadgeLabel
 * @param {Object} facet - facet selection data
 * @returns {String}
 */
/**SelectionGroup.prototype._generateBadgeLabel = function (facet) {
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
};*/

/**
 * Removes all badges in this group
 * @method _removeAllBadges
 */
BadgeGroup.prototype._removeAllBadges = function () {
  this._badges.forEach(function (bg) {
		bg.destroy();
	});
  this._badges = [];
};

/**
 * Removes a badge from this group.
 *
 * @method _removeBadge
 * @param {*} key - The key of the badge to remove.
 * @param {*} value - The value of the badge to remove.
 */
BadgeGroup.prototype._removeBadge = function (key, value) {
	var badge = this._getBadge(key, value);
	if (badge) {
		var index = this._badges.indexOf(badge);
		if (index >= 0) {
      badge.destroy();
			this._badges.splice(index, 1);
		}
	}
};

/**
 * Gets the badge represented with the specified key and value.
 *
 * @method _getBadge
 * @param {*} key - The key to look for.
 * @param {*} value - The value to look for.
 * @returns {Badge|null}
 */
BadgeGroup.prototype._getBadge = function (key, value) {
	var badgeObj = this._badges.filter(function (badge) {
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
BadgeGroup.prototype.destroy = function () {
	this._badges.forEach(function (bg) {
		bg.destroy();
	});
	this._badges = [];
	this._element.remove();
};

/**
 * @export
 * @type {BadgeGroup}
 */
module.exports = BadgeGroup;

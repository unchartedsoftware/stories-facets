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
function SelectionGroup(container, selectionBadges) {
  this._selectionBadges = selectionBadges || [];
  this._element = $(Template());
  this._container = container;
  this._container.append(this._element);

  this._badgeContainer = this._container.find('.facets-selection-group-badges');
}

SelectionGroup.prototype._add = function (k, v) {
  var badge = new SelectionBadge(this._badgeContainer, {key: k, value: v});
  this._selectionBadges.push(badge); //TODO: Shouldn't be allowed to add duplicates
};

SelectionGroup.prototype._remove = function (k, v) {
  var key = k || null;
  var value = v || null;
  var badges = this._selectionBadges;

  if (key === null && value === null) {  //Remove all
    this._selectionBadges = [];
  } else {
    this._selectionBadges = badges.filter(function (badge) {
      if (value !== null) { //Remove by key and value
        return !(badge.key === k && badge.value === value);
      } else { //Remove by key
        return badge.key !== k;
      }
    });
  }
  this._update();
};

SelectionGroup.prototype._update = function () {
  this._badgeContainer.empty();
  this._selectionBadges.forEach(function (badge) {
    badge._update();
  });
};

/**
 * @export
 * @type {SelectionGroup}
 */
module.exports = SelectionGroup;

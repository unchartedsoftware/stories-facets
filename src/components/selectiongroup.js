var IBindable = require('./IBindable');
var Template = require('../templates/selectionGroup');
var selectionGroup_badge = require('../templates/selectionGroup_badge');

var Handlebars = require('handlebars');

/**
 * Special group class used to represent the selected facets in the facets widget.
 *
 * @class SelectionGroup
 * @param {jquery} container - The container where this group will be added.
 * @constructor
 */
function SelectionGroup(container) {
  this._selections = [];
  this._element = $(Template(this._groups));
  this._container = container;
  this._container.append(this._element);

  this._badgeContainer = this._container.find('.facets-selection-group-badges');

  Handlebars.registerPartial('selectionGroup_badge', selectionGroup_badge);
}

SelectionGroup.prototype._add = function (k, v) {
  var badgeSpec = {key: k, value: v};
  this._selections.push(badgeSpec); //TODO: Shouldn't be allowed to add duplicates
  this._update();
};

SelectionGroup.prototype._remove = function (k, v) {
  var key = k || null;
  var value = v || null;
  var selectionsArr = this._selections;

  if (key === null && value === null) {
    this._selections = [];
  } else {
    this._selections = selectionsArr.filter(function (badge) {
      if (value !== null) {
        return !(badge.key === k && badge.value === value);
      } else {
        return badge.key !== k;
      }
    });
  }

  this._update();
};

SelectionGroup.prototype._update = function () {
  this._badgeContainer.empty();

  this._selections.forEach(function (badgeSpec) {
    this._badgeContainer.append(selectionGroup_badge(badgeSpec));
  }, this);
};

/**
 * @export
 * @type {SelectionGroup}
 */
module.exports = SelectionGroup;

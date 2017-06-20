var IBindable = require('../components/IBindable');
var Template = require('../templates/selectionGroup_badge');

/**
 * Selection badge class
 *
 * @class SelectionBadge
 * @param {jquery} container - The container element for this badge.
 * @param
 * @constructor
 */
function SelectionBadge(container, spec) {
  IBindable.call(this);

  this._container = container;
  this._spec = spec;
  this._key = spec.key;
  this._value = spec.value;
}

/**
 * @inheritance {IBindable}
 */
SelectionBadge.prototype = Object.create(IBindable.prototype);
SelectionBadge.prototype.constructor = SelectionBadge;

/**
 * This selection badge's key.
 *
 * @property key
 * @type {string}
 * @readonly
 */
Object.defineProperty(SelectionBadge.prototype, 'key', {
	get: function () {
		return this._key;
	}
});

/**
 * The value of this selection badge.
 *
 * @property value
 * @type {*}
 * @readonly
 */
Object.defineProperty(SelectionBadge.prototype, 'value', {
	get: function () {
		return this._value;
	}
});

SelectionBadge.prototype._update = function () {
  this._element = $(Template(this._spec));
  this._container.append(this._element);
  this._addHandlers();
};

/**
 * Adds the necessary event handlers for this object to function.
 *
 * @method _addHandlers
 * @private
 */
SelectionBadge.prototype._addHandlers = function () {
  this._element.find('.badge-deselect').on('click.badgeDeselect', this._onDeselect.bind(this));
};

/**
 * Removes all the event handlers added by the `_addHandlers` function.
 *
 * @method _removeHandlers
 * @private
 */
SelectionBadge.prototype._removeHandlers = function() {
	this._element.find('.badge-deselect').off('click.badgeDeselect');
};

/**
 * Search event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
SelectionBadge.prototype._onDeselect = function(evt) {
	evt.stopPropagation();
	this.emit('badge:deselect', evt, this._key, this._value);
};

/**
 * @export
 * @type {SelectionBadge}
 */
module.exports = SelectionBadge;

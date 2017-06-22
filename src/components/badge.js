var IBindable = require('../components/IBindable');
var Template = require('../templates/badge');

/**
 * Class representing a badge element.
 *
 * @class Badge
 * @param {jquery} container - The container element for this badge.
 * @param
 * @constructor
 */
function Badge(container, spec) {
  IBindable.call(this);

  this._container = container;
  this._spec = spec;
  this._key = spec.key;
  this._value = spec.value;
  this._label = spec.label;

  this._initialize();
}

/**
 * @inheritance {IBindable}
 */
Badge.prototype = Object.create(IBindable.prototype);
Badge.prototype.constructor = Badge;

/**
 * This selection badge's key.
 *
 * @property key
 * @type {string}
 * @readonly
 */
Object.defineProperty(Badge.prototype, 'key', {
	get: function () {
		return this._key;
	}
});

/**
 * The value of this selection badge.
 *
 * @property value
 * @type {string}
 * @readonly
 */
Object.defineProperty(Badge.prototype, 'value', {
	get: function () {
		return this._value;
	}
});

/**
 * This selection badge's label.
 *
 * @property label
 * @type {string}
 * @readonly
 */
Object.defineProperty(Badge.prototype, 'label', {
	get: function () {
		return this._label;
	}
});


Badge.prototype._initialize = function () {
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
Badge.prototype._addHandlers = function () {
  this._element.find('.badge-deselect').on('click.badgeDeselect', this._onDeselect.bind(this));
};

/**
 * Removes all the event handlers added by the `_addHandlers` function.
 *
 * @method _removeHandlers
 * @private
 */
Badge.prototype._removeHandlers = function() {
	this._element.find('.badge-deselect').off('click.badgeDeselect');
};

/**
 * Destroys this selection badge
 *
 * @method destroy
 */
Badge.prototype.destroy = function() {
	this._removeHandlers();
	this._element.remove();
};

/**
 * Search event handler.
 *
 * @param {Event} evt - Event to handle.
 * @private
 */
Badge.prototype._onDeselect = function(evt) {
	evt.stopPropagation();
	this.emit('badge:deselect', evt, this._key, this._value);
};

/**
 * @export
 * @type {Badge}
 */
module.exports = Badge;

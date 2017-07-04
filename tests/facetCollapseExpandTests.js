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

'use strict';

var proxyquire = require('proxyquireify')(require);
var Facets = require('../src/main');

describe('Expand and Collapse', function() {

	var facetsComponent, container, groupSpecs;

	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));

		groupSpecs = [
			{
				label: 'Phone Numbers',
				key: 'phone',
				facets: [
					{count: 10, value: '111 111 1111'},
					{count: 20, value: '222 222 2222'}
				]
			},
			{
				label: 'Names',
				key: 'name',
				facets: [
					{count: 30, value: 'Maya'}
				]
			}
		];

		facetsComponent = new Facets(container[0], groupSpecs);
	});

	afterEach(function() {
		container.remove();
	});

	it('Groups are expanded by default', function() {
		var phoneGroup = facetsComponent.getGroup('phone');
		var nameGroup = facetsComponent.getGroup('name');

		expect(phoneGroup.collapsed).to.be.false;
		expect(phoneGroup._element.hasClass('facets-group-collapsed')).to.be.false;
		expect(nameGroup.collapsed).to.be.false;
		expect(nameGroup._element.hasClass('facets-group-collapsed')).to.be.false;
	});

	it('Toggles group collapse on click', function() {
		// Given
		var phoneGroup = facetsComponent.getGroup('phone');
		var phoneGroupExpander = phoneGroup._element.find('.group-expander');

		// When
		phoneGroupExpander.trigger('click');

		// Then expect collapsed
		expect(phoneGroup.collapsed).to.be.true;
		expect(phoneGroup._element.hasClass('facets-group-collapsed')).to.be.true;

		// When
		phoneGroupExpander.trigger('click');

		// Then expect expanded
		expect(phoneGroup.collapsed).to.be.false;
		expect(phoneGroup._element.hasClass('facets-group-collapsed')).to.be.false;
	});

	it('Emits collapse and expand events with group key', function() {
		// Given
		var phoneGroup = facetsComponent.getGroup('phone'),
			phoneGroupIcon = phoneGroup._element.find('.group-expander'),
			onGroupCollapse = sinon.spy(),
			onGroupExpand = sinon.spy();

		facetsComponent.on('facet-group:collapse', onGroupCollapse);
		facetsComponent.on('facet-group:expand', onGroupExpand);

		// When (click once to expand, then again to collapse)
		phoneGroupIcon.trigger('click');
		phoneGroupIcon.trigger('click');

		// Then expect collapsed
		expect(onGroupCollapse.calledOnce).to.be.true;
		expect(onGroupCollapse.getCall(0).args[1]).to.equal('phone');

		// Then expect expanded
		expect(onGroupExpand.calledOnce).to.be.true;
		expect(onGroupExpand.getCall(0).args[1]).to.equal('phone');
	});

	it('Emits collapse and expand events for newly appended group', function() {
		// Given an initial registration of collapse events
		var onGroupCollapse = sinon.spy(),
			onGroupExpand = sinon.spy();
			facetsComponent.on('facet-group:collapse', onGroupCollapse);
			facetsComponent.on('facet-group:expand', onGroupExpand);

		// When a new group is appended...
		facetsComponent.append([
			{label: 'Foo', key: 'foo', facets: [{count: 123, value: 'somefoo'}]}
		]);

		// ... and new group is collapsed and expanded
		var fooGroup = facetsComponent.getGroup('foo'),
			fooGroupIcon = fooGroup._element.find('.group-expander');
		fooGroupIcon.trigger('click');
		fooGroupIcon.trigger('click');

		// Then expect initially registered callbacks to have been called
		expect(onGroupCollapse.calledOnce).to.be.true;
		expect(onGroupCollapse.getCall(0).args[1]).to.equal('foo');
		expect(onGroupExpand.calledOnce).to.be.true;
		expect(onGroupExpand.getCall(0).args[1]).to.equal('foo');
	});

});

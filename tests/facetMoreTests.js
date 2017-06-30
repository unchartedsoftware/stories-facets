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

describe('More', function() {

	var facetsComponent, container, groupSpecs;

	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));

		groupSpecs = [
			{
				label: 'Phone Numbers',
				more: 15,
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

	it('Displays a more link if provided', function() {
		// Phone group has more link
		var phoneGroup = facetsComponent.getGroup('phone');
		var phoneMoreCount = phoneGroup._element.find('.group-other-label-count');
		expect(phoneMoreCount.text()).to.equal('15+');

		// Name group does not have more link
		var nameGroup = facetsComponent.getGroup('name');
		var nameMoreCount = nameGroup._element.find('.group-other-label-count');
		expect(nameMoreCount.text()).to.equal('');
	});

	it('Emits more event with group key', function() {
		// Given
		var phoneGroup = facetsComponent.getGroup('phone'),
			phoneMore = phoneGroup._element.find('.group-more-target'),
			onGroupMore = sinon.spy();

		facetsComponent.on('facet-group:more', onGroupMore);

		// When
		phoneMore.trigger('click');

		// Then
		expect(onGroupMore.calledOnce).to.be.true;
		expect(onGroupMore.getCall(0).args[1]).to.equal('phone');
	});

	it('Emits more event for newly appended data', function() {
		// Given an initial registsration of more event
		var onGroupMore = sinon.spy();
		facetsComponent.on('facet-group:more', onGroupMore);

		// When names are appended with more...
		facetsComponent.append([
			{label: 'Names', key: 'name', more: 20, facets: [{count: 45, value: 'John'}]}
		]);

		// ...and the newly added more link is clicked
		var nameGroup = facetsComponent.getGroup('name'),
			nameMore = nameGroup._element.find('.group-more-target');
		nameMore.trigger('click');

		// Then expect initially registered callback to have been called
		expect(onGroupMore.calledOnce).to.be.true;
		expect(onGroupMore.getCall(0).args[1]).to.equal('name');

	});

});

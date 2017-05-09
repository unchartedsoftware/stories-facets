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

describe('Click', function() {

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

	it('Emits click event with key and value of clicked on facet', function() {
		// Given
		var onFacetClick = sinon.spy();
		facetsComponent.on('facet:click', onFacetClick);

		// When a facet is clicked
		var phoneGroup = facetsComponent._getGroup('phone');
		var secondPhoneFacet = phoneGroup._getFacet('222 222 2222');
		$(secondPhoneFacet._element).trigger('click');

		// Then
		expect(onFacetClick.calledOnce).to.be.true;
		expect(onFacetClick.getCall(0).args[1]).to.equal('phone');
		expect(onFacetClick.getCall(0).args[2]).to.equal('222 222 2222');
	});

	it('Emits click event for newly appended item', function() {
		// Given an initial registration of click events
		var onFacetClick = sinon.spy();
		facetsComponent.on('facet:click', onFacetClick);

		// When a name is appended...
		facetsComponent.append([
			{label: 'Names', key: 'name', facets: [{count: 45, value: 'John'}]}
		]);

		// ... and the modified name is clicked
		var nameGroup = facetsComponent._getGroup('name');
		var secondNameFacet = nameGroup._getFacet('John');
		$(secondNameFacet._element).trigger('click');

		// Then expect initially registered callback to have been called
		expect(onFacetClick.calledOnce).to.be.true;
		expect(onFacetClick.getCall(0).args[1]).to.equal('name');
		expect(onFacetClick.getCall(0).args[2]).to.equal('John');
	});

	it('Emits click event for modified item', function() {
		// Given an initial registration of click events
		var onFacetClick = sinon.spy();
		facetsComponent.on('facet:click', onFacetClick);

		// When an existing name is modified...
		facetsComponent.append([
			{label: 'Names', key: 'name', facets: [{count: 20, value: 'Maya'}]}
		]);

		// ... and the newly added name is clicked
		var nameGroup = facetsComponent._getGroup('name');
		var secondNameFacet = nameGroup._getFacet('Maya');
		$(secondNameFacet._element).trigger('click');

		// Then expect initially registered callback to have been called
		expect(onFacetClick.calledOnce).to.be.true;
		expect(onFacetClick.getCall(0).args[1]).to.equal('name');
		expect(onFacetClick.getCall(0).args[2]).to.equal('Maya');

	});

	it('Removes click event', function() {
		// Given
		var onFacetClick = sinon.spy();
		facetsComponent.on('facet:click', onFacetClick);

		// When event is de-registered...
		facetsComponent.off('facet:click');

		// ...and a facet is clicked
		var phoneGroup = facetsComponent._getGroup('phone');
		var secondPhoneFacet = phoneGroup._getFacet('222 222 2222');
		$(secondPhoneFacet._element).trigger('click');

		// Then handler should NOT have been called
		expect(onFacetClick.called).to.be.false;
	});

});

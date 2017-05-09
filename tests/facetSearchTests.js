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
var testSupport = require('./test-support');

describe('Search', function() {

	var facetsComponent, container, groupSpecs, querySpecs;

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
	});

	afterEach(function() {
		container.remove();
	});

	it('Displays search icon if specified in options', function() {
		// Given
		var options = {search: true};

		// When
		facetsComponent = new Facets(container[0], groupSpecs, null, options);

		// Then
		testSupport.verifySearchIconIsDisplayed(facetsComponent, 'phone', '111 111 1111');
		testSupport.verifySearchIconIsDisplayed(facetsComponent, 'phone', '222 222 2222');
		testSupport.verifySearchIconIsDisplayed(facetsComponent, 'name', 'Maya');
	});

	it('Does not display search icon if not provided any options', function() {
		// When
		facetsComponent = new Facets(container[0], groupSpecs);

		// Then
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'phone', '111 111 1111');
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'phone', '222 222 2222');
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'name', 'Maya');
	});

	it('Does not display search icon if not specified in options', function() {
		// Given
		var options = {};

		// When
		facetsComponent = new Facets(container[0], groupSpecs, null, options);

		// Then
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'phone', '111 111 1111');
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'phone', '222 222 2222');
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'name', 'Maya');
	});

	it('Does not display search icon if set to false in options', function() {
		// Given
		var options = {search: false};

		// When
		facetsComponent = new Facets(container[0], groupSpecs, null, options);

		// Then
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'phone', '111 111 1111');
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'phone', '222 222 2222');
		testSupport.verifySearchIconIsNotDisplayed(facetsComponent, 'name', 'Maya');
	});

	it('Emits search event with key and value when search icon is clicked on', function() {
		// Given
		var onFacetSearch = sinon.spy();

		facetsComponent = new Facets(container[0], groupSpecs, null, {search: true});
		facetsComponent.on('facet:search', onFacetSearch);

		// When a facet search icon is clicked on
		var searchIcon = testSupport.findSearchIcon(facetsComponent, 'name', 'Maya');
		searchIcon.trigger('click');

		// Then expect handler to be called
		expect(onFacetSearch.calledOnce).to.be.true;
		expect(onFacetSearch.getCall(0).args[1]).to.equal('name');
		expect(onFacetSearch.getCall(0).args[2]).to.equal('Maya');
	});

	it('Does not emit facet:click event when search icon is clicked on', function() {
		// Given click and search handlers
		var onFacetClick = sinon.spy();
		var onFacetSearch = sinon.spy();

		facetsComponent = new Facets(container[0], groupSpecs, null, {search: true});
		facetsComponent.on('facet:click', onFacetClick);
		facetsComponent.on('facet:search', onFacetSearch);

		// When a facet search icon is clicked on
		var searchIcon = testSupport.findSearchIcon(facetsComponent, 'name', 'Maya');
		searchIcon.trigger('click');

		// Then expect search handler to be called, but NOT click handler
		expect(onFacetSearch.calledOnce).to.be.true;
		expect(onFacetClick.called).to.be.false;

		// However, when the general area of the facet is clicked...
		var nameGroup = facetsComponent._getGroup('name');
		var secondNameFacet = nameGroup._getFacet('Maya');
		$(secondNameFacet._element).trigger('click');

		// Then expect click handler IS called
		expect(onFacetClick.calledOnce).to.be.true;
	});

});

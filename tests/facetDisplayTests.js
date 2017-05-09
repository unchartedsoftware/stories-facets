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

describe('Display', function() {

	var container;

	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));
	});

	afterEach(function() {
		container.remove();
	});

	it('Displays queries and groups', function() {
		// Given
		var queries = [
			{key: '*', value: 'test phrase', count: 4},
			{key: '*', value: 'Toronto', count: 6}
		];
		var groups = [
			{label: 'Phone Numbers', key: 'phones', facets: [
				{value: '111 111 1111', count: 10, icon : {class:'fa fa-phone',color:'orange'}},
				{value: '222 222 2222', count: 30, icon : {class:'fa fa-phone',color:'blue'}}
			]}
		];

		// When
		var facetsComponent = new Facets(container[0], groups, queries);

		// Then...
		var firstQuery = facetsComponent._getQuery('*', 'test phrase');
		var firstQueryElement = firstQuery._element;
		testSupport.verifyQuery(firstQuery, firstQueryElement, '*', 'test phrase', 4, 10, '40%');

		var secondQuery = facetsComponent._getQuery('*', 'Toronto');
		var secondQueryElement = secondQuery._element;
		testSupport.verifyQuery(secondQuery, secondQueryElement, '*', 'Toronto', 6, 10, '60%');

		var phoneGroup = facetsComponent._getGroup('phones');
		var firstFacet = phoneGroup._getFacet('111 111 1111');
		var secondFacet = phoneGroup._getFacet('222 222 2222');
		testSupport.verifyFacet(firstFacet, firstFacet._element, 'phones', '111 111 1111', 10, 40, 'orange', '25%'); // total is sum of facets in group
		testSupport.verifyFacet(secondFacet, secondFacet._element, 'phones', '222 222 2222', 30, 40, 'blue', '75%'); // total is sum of facets in group
	});

	it('Hides query section when given only groups', function() {
		// Given
		var groups = [
			{label: 'Phone Numbers', key: 'phones', facets: [
				{value: '111 111 1111', count: 10, icon : {class:'fa fa-phone',color:'orange'}},
				{value: '222 222 2222', count: 30, icon : {class:'fa fa-phone',color:'blue'}}
			]}
		];

		// When
		var facetsComponent = new Facets(container[0], groups);

		// Then expect queries section to be hidden
		expect(facetsComponent._queryGroup.visible).to.equal(false);

		// And facet groups rendered same as always
		var phoneGroup = facetsComponent._getGroup('phones');
		var firstFacet = phoneGroup._getFacet('111 111 1111');
		var secondFacet = phoneGroup._getFacet('222 222 2222');
		testSupport.verifyFacet(firstFacet, firstFacet._element, 'phones', '111 111 1111', 10, 40, 'orange', '25%'); // total is sum of facets in group
		testSupport.verifyFacet(secondFacet, secondFacet._element, 'phones', '222 222 2222', 30, 40, 'blue', '75%'); // total is sum of facets in group
	});

	it('Displays link information if provided', function() {
		// Given
		var groups = [
			{ label : 'Linked Personas', key : 'persona', facets : [
	                { icon : { class : 'fa fa-reddit-alien' }, count : 51, links : 333, value : '333 333 3333' },
	            ]
	        }
		];

		// When
		var facetsComponent = new Facets(container[0], groups);

		// Then
		var personaGroup = facetsComponent._getGroup('persona');
		var personaFacet = personaGroup._getFacet('333 333 3333');
		var personaLink = personaFacet._element.find('.facet-links');
		expect(personaLink.text().trim()).to.equal('333');
	});

});

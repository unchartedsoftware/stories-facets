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

describe('Selection', function() {

	var facetsComponent, container, groupSpecs, querySpecs;

	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));

		groupSpecs = [
			{
				label: 'Phone Numbers',
				more: 15,
				key: 'phone',
				facets: [
					{count: 10, value: '111 111 1111', icon: {class: 'fa fa-phone', color: 'orange'}},
					{count: 20, value: '222 222 2222', icon: {class: 'fa fa-phone', color: 'orange'}}
				]
			},
			{
				label: 'Names',
				key: 'name',
				facets: [
					{count: 30, value: 'Maya', icon: {class: 'fa fa-name', color: 'grey'}},
					{count: 10, value: 'Debbie', icon: {class: 'fa fa-name', color: 'grey'}}
				]
			}
		];

		querySpecs = [
	        { key: '*', value : 'test phrase', count : 2},
	        { key: 'name', value : 'Alice', count : 8}
	    ];

		facetsComponent = new Facets(container[0], groupSpecs, querySpecs);
	});

	afterEach(function() {
		container.remove();
	});

	it('Select displays matching facets with additional bar as percentage', function() {
		// Given
		var subgroups = [
			{
				label: 'Names',
				key: 'name',
				facets: [
					{selected: 4, value: 'Maya'},
					{selected: 1, value: 'Debbie'}
				]
			}
		];

		// When
		facetsComponent.select(subgroups);

		// Then name facets rendered as selected with additional bar
		var nameGroup = facetsComponent._getGroup('name');
		var mayaFacet = nameGroup._getFacet('Maya');
		var debbieFacet = nameGroup._getFacet('Debbie');
		testSupport.verifySelectedFacet(mayaFacet, mayaFacet._element, 'name', 'Maya', 30, 40, '75%', '10%');
		testSupport.verifySelectedFacet(debbieFacet, debbieFacet._element, 'name', 'Debbie', 10, 40, '25%', '2.5%');
	});

	it('Deselect removes selected bar', function() {
		// Given
		var subgroups = [
			{
				label: 'Names',
				key: 'name',
				facets: [
					{selected: 3, value: 'Maya'},
					{selected: 1, value: 'Debbie'}
				]
			}
		];

		// When
		facetsComponent.select(subgroups);
		facetsComponent.deselect(subgroups);

		// Then facets are unselected
		var nameGroup = facetsComponent._getGroup('name');
		var mayaFacet = nameGroup._getFacet('Maya');
		var debbieFacet = nameGroup._getFacet('Debbie');
		testSupport.verifyDeselectedFacet(mayaFacet, mayaFacet._element, 'name', 'Maya', 30, 40, 'grey', '75%');
		testSupport.verifyDeselectedFacet(debbieFacet, debbieFacet._element, 'name', 'Debbie', 10, 40, 'grey', '25%');
	});

	it('Selects query', function() {
		// Given
		var subgroups = [
			{
				key: 'name',
				facets: [
					{selected: 4, value: 'Alice'}
				]
			}
		];
		var isQuery = true;

		// When
		facetsComponent.select(subgroups, isQuery);

		// Then
		var queryEl = facetsComponent._getQuery('name', 'Alice');
		testSupport.verifySelectedFacet(queryEl, queryEl._element, 'name', 'Alice', 8, 10, '80%', '40%');
	});

});

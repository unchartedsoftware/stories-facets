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

describe('Append', function() {

	var facetsComponent, container, groupSpecs, querySpecs;

	/**
	 * Construct a facets component with some baseline data.
	 * Each test will append data to test different scenarios.
	 */
	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));

		groupSpecs = [
			{
				label: 'Phone Numbers', key: 'phones', facets: [
					{count: 10, value: '111 111 1111', icon: {class: 'fa fa-phone', color: 'orange'}},
					{count: 30, value: '222 222 2222', icon: {class: 'fa fa-phone', color: 'blue'}}
				]
			},
			{
				label: 'Names', key: 'names', facets: [
					{count: 20, value: 'Maya', icon: {class: 'fa fa-name', color: 'grey'}}
				]
			}
		];

		querySpecs = [
	        { key: '*', value : 'test phrase', count : 2},
	        { key: '*', value : 'second query', count : 8}
	    ];

		facetsComponent = new Facets(container[0], groupSpecs, querySpecs);

		// Verify baseline queries
		var testPhraseQuery = facetsComponent._getQuery('*', 'test phrase');
		var secondQueryQuery = facetsComponent._getQuery('*', 'second query');
		testSupport.verifyQuery(testPhraseQuery, testPhraseQuery._element, '*', 'test phrase', 2, 10, '20%');
		testSupport.verifyQuery(secondQueryQuery, secondQueryQuery._element, '*', 'second query', 8, 10, '80%');

		// Verify baseline groups/facets
		var phoneGroup = facetsComponent._getGroup('phones');
		var firstPhoneFacet = phoneGroup._getFacet('111 111 1111');
		var secondPhoneFacet = phoneGroup._getFacet('222 222 2222');
		testSupport.verifyFacet(firstPhoneFacet, firstPhoneFacet._element, 'phones', '111 111 1111', 10, 40, 'orange', '25%');
		testSupport.verifyFacet(secondPhoneFacet, secondPhoneFacet._element, 'phones', '222 222 2222', 30, 40, 'blue', '75%');

		var nameGroup = facetsComponent._getGroup('names');
		var firstNameFacet = nameGroup._getFacet('Maya');
		testSupport.verifyFacet(firstNameFacet, firstNameFacet._element, 'names', 'Maya', 20, 20, 'grey', '100%');
	});

	afterEach(function() {
		container.remove();
	});

	it('Adds a new entry to an existing group', function() {
		// Given
		var groupsToAppend = [
			{label: 'Names', key: 'names', facets: [{count: 60, value: 'John', icon: {class: 'fa fa-name', color: 'grey'}}]}
		];

		// When
		facetsComponent.append(groupsToAppend);

		// Then expect names group to be updated
		var nameGroup = facetsComponent._getGroup('names');
		var firstNameFacet = nameGroup._getFacet('Maya');
		var secondNameFacet = nameGroup._getFacet('John');
		testSupport.verifyFacet(firstNameFacet, firstNameFacet._element, 'names', 'Maya', 20, 80, 'grey', '25%');
		testSupport.verifyFacet(secondNameFacet, secondNameFacet._element, 'names', 'John', 60, 80, 'grey', '75%');
	});

	it('Adds a new group', function() {
		// Given
		var groupsToAppend = [
			{label: 'Foo', key: 'foo', facets: [{count: 60, value: 'bar', icon: {class: 'fa fa-name', color: 'grey'}}]}
		];

		// When
		facetsComponent.append(groupsToAppend);

		// Then expect new group added
		var fooGroup = facetsComponent._getGroup('foo');
		var fooFacet = fooGroup._getFacet('bar');
		testSupport.verifyFacet(fooFacet, fooFacet._element, 'foo', 'bar', 60, 60, 'grey', '100%');
	});

	it('Modifies existing entry in existing group', function() {
		// Given
		var groupsToAppend = [
			{label: 'Phone Numbers', key: 'phones', facets: [{count: 10, value: '222 222 2222'}]}
		];

		// When
		facetsComponent.append(groupsToAppend);

		// Then expect phone group modified
		var phoneGroup = facetsComponent._getGroup('phones');
		var firstPhoneFacet = phoneGroup._getFacet('111 111 1111');
		var secondPhoneFacet = phoneGroup._getFacet('222 222 2222');
		testSupport.verifyFacet(firstPhoneFacet, firstPhoneFacet._element, 'phones', '111 111 1111', 10, 50, 'orange', '20%');
		testSupport.verifyFacet(secondPhoneFacet, secondPhoneFacet._element, 'phones', '222 222 2222', 40, 50, 'blue', '80%');
	});

	it('Adds a new query', function() {
		// Given
		var queriesToAppend = [ { key: 'name', value : 'foo', count : 6 } ];

		// When
		facetsComponent.append(null, queriesToAppend);

		// Then expect existing queries to be updated...
		var testPhraseQuery = facetsComponent._getQuery('*', 'test phrase');
		var secondQueryQuery = facetsComponent._getQuery('*', 'second query');
		testSupport.verifyQuery(testPhraseQuery, testPhraseQuery._element, '*', 'test phrase', 2, 16, '12.5%');
		testSupport.verifyQuery(secondQueryQuery, secondQueryQuery._element, '*', 'second query', 8, 16, '50%');

		// ...and new query added
		var fooQuery = facetsComponent._getQuery('name', 'foo');
		testSupport.verifyQuery(fooQuery, fooQuery._element, 'name', 'foo', 6, 16, '37.5%');
	});

});

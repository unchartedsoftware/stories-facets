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

describe('Highlight', function() {

	var facetsComponent, container, groupSpecs, querySpecs;

	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));

		groupSpecs = [
			{
				label: 'Phone Numbers', key: 'phones', facets: [
					{count: 10, value: '111 111 1111', icon: {class: 'fa fa-phone', color: 'orange'}},
					{count: 30, value: '222 222 2222', icon: {class: 'fa fa-phone', color: 'blue'}},
					{count: 35, value: '333 333 3333', icon: {class: 'fa fa-phone', color: 'blue'}}
				]
			},
			{
				label: 'Names', key: 'names', facets: [
					{count: 20, value: 'Maya', icon: {class: 'fa fa-name', color: 'grey'}},
					{count: 25, value: 'Debbie', icon: {class: 'fa fa-name', color: 'grey'}}
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

	it('Adds highlight class to a group', function() {
		// Given
		var simpleGroups = [
			{key: 'phones', value: '222 222 2222'}
		];

		// When
		facetsComponent.highlight(simpleGroups);

		// Then expect given group to be higlighted...
		testSupport.verifyFacetIsHighlighted(facetsComponent, 'phones', '222 222 2222');

		// ...and the other groups are not highlighted
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '111 111 1111');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '333 333 3333');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Maya');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Debbie');
	});

	it('Adds highlight class to multiple groups', function() {
		// Given
		var simpleGroups = [
			{key: 'phones', value: '111 111 1111'},
			{key: 'phones', value: '333 333 3333'},
			{key: 'names', value: 'Debbie'}
		];

		// When
		facetsComponent.highlight(simpleGroups);

		// Then expect given groups to be higlighted...
		testSupport.verifyFacetIsHighlighted(facetsComponent, 'phones', '111 111 1111');
		testSupport.verifyFacetIsHighlighted(facetsComponent, 'phones', '333 333 3333');
		testSupport.verifyFacetIsHighlighted(facetsComponent, 'names', 'Debbie');

		// ...and the other groups are not highlighted
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '222 222 2222');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Maya');
	});

	it('Does not add highlight for unknown group', function() {
		// Given
		var simpleGroups = [
			{key: 'phone-numbers-no-such-group', value: '222 222 2222'}
		];

		// When
		facetsComponent.highlight(simpleGroups);

		// Then expect no groups are higlighted
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '111 111 1111');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '222 222 2222');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '333 333 3333');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Maya');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Debbie');
	});

	it('Unhighlight removes highlight class from a group', function() {
		// Given a highlighted group
		var simpleGroups = [
			{key: 'phones', value: '222 222 2222'}
		];
		facetsComponent.highlight(simpleGroups);

		// When highlight is removed for that group
		facetsComponent.unhighlight(simpleGroups);

		// Then
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '222 222 2222');
	});

	it('Unhighlight removes highlight class from multiple groups', function() {
		// Given a few groups that are higlighted
		var simpleGroups = [
			{key: 'phones', value: '111 111 1111'},
			{key: 'phones', value: '333 333 3333'},
			{key: 'names', value: 'Debbie'}
		];
		facetsComponent.highlight(simpleGroups);

		// When only a subset of the highlighted groups are unhighlighted
		var subset = [
			{key: 'phones', value: '111 111 1111'},
			{key: 'names', value: 'Debbie'}
		];
		facetsComponent.unhighlight(subset);

		// Then expect the subset to be unhighlighted...
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '111 111 1111');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Debbie');

		// ...and the remaining group to still be highlighted
		testSupport.verifyFacetIsHighlighted(facetsComponent, 'phones', '333 333 3333');
	});

	it('Unhighlight from a group that is not highlighted does nothing', function() {
		// When
		facetsComponent.unhighlight([{key: 'names', value: 'Maya'}]);

		// Then group remains unhighlighted
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Maya');
	});

	it('Unhighlight with no arguments removes ALL facet and query highlights', function() {
		// Given a few facets and queries that are higlighted
		var simpleGroups = [
			{key: 'phones', value: '111 111 1111'},
			{key: 'phones', value: '333 333 3333'},
			{key: 'names', value: 'Debbie'}
		];
		var simpleGroupsQ = [
			{key: 'name', value: 'Alice'},
			{key: '*', value: 'test phrase'}
		];
		facetsComponent.highlight(simpleGroups);
		facetsComponent.highlight(simpleGroupsQ, true);

		// When
		facetsComponent.unhighlight();

		// Then expect all facets are unhighlighted
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '111 111 1111');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'phones', '333 333 3333');
		testSupport.verifyFacetIsNotHighlighted(facetsComponent, 'names', 'Debbie');

		// Then expect all queries are unhighlighted
		testSupport.verifyQueryIsNotHighlighted(facetsComponent, 'name', 'Alice');
		testSupport.verifyQueryIsNotHighlighted(facetsComponent, '*', 'test phrase');
	});

	it('Returns highlight status', function() {
		// Given a highlighted group
		var simpleGroups = [
			{key: 'phones', value: '222 222 2222'}
		];
		facetsComponent.highlight(simpleGroups);

		// Then
		expect(facetsComponent.isHighlighted({key: 'phones', value: '222 222 2222'})).to.be.true;

		// When highlight is removed
		facetsComponent.unhighlight(simpleGroups);

		// Then
		expect(facetsComponent.isHighlighted({key: 'phones', value: '222 222 2222'})).to.be.false;
	});

	it('Highlights a query', function() {
		// Given
		var simpleGroups = [{key: 'name', value: 'Alice'}];
		var isQuery = true;

		// When
		facetsComponent.highlight(simpleGroups, isQuery);

		// Then
		testSupport.verifyQueryIsHighlighted(facetsComponent, 'name', 'Alice');
	})
});

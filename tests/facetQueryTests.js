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

describe('Queries', function() {

	var container;
	var queries = [
		{key: '*', value: 'test phrase', count: 2},
		{key: '*', value: 'Toronto', count: 4}
	];
	var groups = [
		{label: 'Phone Numbers', key: 'phones', facets: [
			{value: '111 111 1111', count: 10, icon : {class:'fa fa-phone',color:'orange'}},
			{value: '222 222 2222', count: 30, icon : {class:'fa fa-phone',color:'blue'}}
		]}
	];


	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));
	});

	afterEach(function() {
		container.remove();
	});

	it('Adds a query', function() {
		// Given some baseline data
		var facetsComponent = new Facets(container[0], groups, queries);

		// When
		facetsComponent.addQuery({
			key: 'phone',
			value: '333 333 3333',
			count: 2
		});

		// Then expect totals and percentages updated for existing queries...
		var testPhraseQuery = facetsComponent._getQuery('*', 'test phrase');
		var testPhraseQueryElement = testPhraseQuery._element;
		testSupport.verifyQuery(testPhraseQuery, testPhraseQueryElement, '*', 'test phrase', 2, 8, '25%');

		var torontoQuery = facetsComponent._getQuery('*', 'Toronto');
		var torontoQueryElement = torontoQuery._element;
		testSupport.verifyQuery(torontoQuery, torontoQueryElement, '*', 'Toronto', 4, 8, '50%');

		// ...and new query added
		var phoneQuery = facetsComponent._getQuery('phone', '333 333 3333');
		var phoneQueryElement = phoneQuery._element;
		testSupport.verifyQuery(phoneQuery, phoneQueryElement, 'phone', '333 333 3333', 2, 8, '25%');
	});

	it('Returns \'queries\' as the key', function() {
		// Given
		var queries = [
			{key: '*', value: 'test phrase', count: 2},
			{key: '*', value: 'Toronto', count: 4}
		];
		var groups = [
			{label: 'Phone Numbers', key: 'phones', facets: [
				{value: '111 111 1111', count: 10, icon : {class:'fa fa-phone',color:'orange'}},
				{value: '222 222 2222', count: 30, icon : {class:'fa fa-phone',color:'blue'}}
			]}
		];
		var facetsComponent = new Facets(container[0], groups, queries);

		// Then
		expect(facetsComponent._queryGroup.key).to.equal('queries');
	});

	it('Emits click event with key, value and count of clicked on query', function() {
		// Given
		var facetsComponent = new Facets(container[0], groups, queries);
		var onQueryClick = sinon.spy();
		facetsComponent.on('query:click', onQueryClick);

		// When a query is clicked
		var torontoQ = facetsComponent._getQuery('*', 'Toronto');
		$(torontoQ._element).trigger('click');

		// Then expect click handler was called with Toronto query data
		expect(onQueryClick.calledOnce).to.be.true;
		expect(onQueryClick.getCall(0).args[1]).to.equal('*');
		expect(onQueryClick.getCall(0).args[2]).to.equal('Toronto');
		expect(onQueryClick.getCall(0).args[3]).to.equal(4);
	});

	it('Emits events for newly added query', function() {
		// Given some baseline data...
		var facetsComponent = new Facets(container[0], groups, queries);
		var onQueryClick = sinon.spy();

		// ... and initial registration of click events
		facetsComponent.on('query:click', onQueryClick);

		// ... and a new query is added, note a key can also be specified here
		facetsComponent.addQuery({ key: 'phone', value: '333 333 3333', count: 2 });

		// When new query is clicked
		var queryEl = facetsComponent._getQuery('phone', '333 333 3333');
		$(queryEl._element).trigger('click');

		// Then expect click handler was called with new query data
		expect(onQueryClick.calledOnce).to.be.true;
		expect(onQueryClick.getCall(0).args[1]).to.equal('phone');
		expect(onQueryClick.getCall(0).args[2]).to.equal('333 333 3333');
		expect(onQueryClick.getCall(0).args[3]).to.equal(2);
	});

	it('Displays query with key and value', function() {
		// Given
		var queries = [
			{key: 'name', value: 'test phrase', count: 2},
		];
		var groups = [
			{label: 'Phone Numbers', key: 'phones', facets: [
				{value: '111 111 1111', count: 10, icon : {class:'fa fa-phone',color:'orange'}}
			]}
		];
		var facetsComponent = new Facets(container[0], groups, queries);

		var queryEl = facetsComponent._getQuery('name', 'test phrase');
		expect(queryEl._element.find('.facet-label').text()).to.equal('name:test phrase');
	});

	it('Displays query with only value when key is *', function() {
		// Given
		var queries = [
			{key: '*', value: 'test phrase', count: 2},
		];
		var groups = [
			{label: 'Phone Numbers', key: 'phones', facets: [
				{value: '111 111 1111', count: 10, icon : {class:'fa fa-phone',color:'orange'}}
			]}
		];
		var facetsComponent = new Facets(container[0], groups, queries);

		var queryEl = facetsComponent._getQuery('*', 'test phrase');
		expect(queryEl._element.find('.facet-label').text()).to.equal('test phrase');
	});

});

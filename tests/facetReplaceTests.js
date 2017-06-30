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

describe('Replace', function() {

	var facetsComponent, container, groupSpecs, querySpecs;

	beforeEach(function() {
		container = $('<div class="facets-container"></div>').appendTo($('body'));

		groupSpecs = [
			{
				label: 'Phone Numbers', key: 'phones', facets: [
					{count: 10, value: '111 111 1111', icon: {class: 'fa fa-phone', color: 'orange'}}
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
	        { key: '*', value : 'query text', count : 8}
	    ];

		facetsComponent = new Facets(container[0], groupSpecs, querySpecs);
	});

	afterEach(function() {
		container.remove();
	});

	it('Replaces existing facets data with new data', function() {
		// Given
		var newGroupSpecs = [
			{
				label: 'Websites', key: 'websites', facets: [
					{count: 30, value: 'www.test1.example.com', icon: {class: 'fa fa-globe', color: 'grey'}},
					{count: 30, value: 'www.test2.example.com', icon: {class: 'fa fa-globe', color: 'black'}}
				]
			}
		];

		var newQuerySpecs = [ { key: 'place', value : 'toronto', count : 6 } ];

		// When
		facetsComponent.replace(newGroupSpecs, newQuerySpecs);

		// Then expect old elements are removed...
		expect(facetsComponent._getQuery('*', 'test phrase')).to.be.null;
		expect(facetsComponent._getQuery('*', 'query text')).to.be.null;
		expect(facetsComponent.getGroup('phones')).to.be.null;
		expect(facetsComponent.getGroup('names')).to.be.null;

		// ... and new elements are added
		var torontoQuery = facetsComponent._getQuery('place', 'toronto');
		var torontoQueryElement = torontoQuery._element;
		testSupport.verifyQuery(torontoQuery, torontoQueryElement, 'place', 'toronto', 6, 6, '100%');

		var websiteGroup = facetsComponent.getGroup('websites');
		var firstFacet = websiteGroup._getFacet('www.test1.example.com');
		var secondFacet = websiteGroup._getFacet('www.test2.example.com');
		testSupport.verifyFacet(firstFacet, firstFacet._element, 'websites', 'www.test1.example.com', 30, 60, 'grey', '50%');
		testSupport.verifyFacet(secondFacet, secondFacet._element, 'websites', 'www.test2.example.com', 30, 60, 'black', '50%');

		// Should be only one Queries title
		var queryTitleElement = $('.group-header:contains("Queries")');
		expect(queryTitleElement).to.have.length(1);
	});

	it('Maintains client events', function() {
		// Given initial registration of events...
		var onMouseEnter = sinon.spy(),
			onMouseLeave = sinon.spy(),
			onFacetClick = sinon.spy(),
			onGroupCollapse = sinon.spy(),
			onGroupExpand = sinon.spy(),
			onGroupMore = sinon.spy();

		facetsComponent.on('facet:mouseenter', onMouseEnter);
		facetsComponent.on('facet:mouseleave', onMouseLeave);
		facetsComponent.on('facet:click', onFacetClick);
		facetsComponent.on('facet-group:collapse', onGroupCollapse);
		facetsComponent.on('facet-group:expand', onGroupExpand);
		facetsComponent.on('facet-group:more', onGroupMore);

		// ...and some new data
		var newGroupSpecs = [
			{
				label: 'Websites', key: 'websites', more: 14, facets: [
					{count: 30, value: 'www.test1.example.com', icon: {class: 'fa fa-globe', color: 'grey'}},
					{count: 30, value: 'www.test2.example.com', icon: {class: 'fa fa-globe', color: 'black'}}
				]
			}
		];

		var newQuerySpecs = [ { value : 'toronto', count : 6} ];

		// When data is replaced...
		facetsComponent.replace(newGroupSpecs, newQuerySpecs);

		// ...and events are triggerred
		var websiteGroup = facetsComponent.getGroup('websites'),
			websiteMore = websiteGroup._element.find('.group-more-target'),
			websiteGroupExpandIcon = websiteGroup._element.find('.group-expander'),
			websiteFacet = websiteGroup._getFacet('www.test1.example.com'),
			websiteIcon = websiteFacet._element.find('.facet-icon');

		websiteFacet._element.trigger('click');
		websiteIcon.trigger('mouseenter');
		websiteIcon.trigger('mouseleave');
		websiteGroupExpandIcon.trigger('click');
		websiteGroupExpandIcon.trigger('click');
		websiteMore.trigger('click');

		// Then initial event handlers should have been called
		expect(onMouseEnter.calledOnce).to.be.true;
		expect(onMouseEnter.getCall(0).args[1]).to.equal('websites');
		expect(onMouseEnter.getCall(0).args[2]).to.equal('www.test1.example.com');

		expect(onMouseLeave.calledOnce).to.be.true;
		expect(onMouseLeave.getCall(0).args[1]).to.equal('websites');
		expect(onMouseLeave.getCall(0).args[2]).to.equal('www.test1.example.com');

		expect(onFacetClick.calledOnce).to.be.true;
		expect(onFacetClick.getCall(0).args[1]).to.equal('websites');
		expect(onFacetClick.getCall(0).args[2]).to.equal('www.test1.example.com');

		expect(onGroupCollapse.calledOnce).to.be.true;
		expect(onGroupCollapse.getCall(0).args[1]).to.equal('websites');

		expect(onGroupExpand.calledOnce).to.be.true;
		expect(onGroupExpand.getCall(0).args[1]).to.equal('websites');

		expect(onGroupMore.calledOnce).to.be.true;
		expect(onGroupMore.getCall(0).args[1]).to.equal('websites');
	});

});

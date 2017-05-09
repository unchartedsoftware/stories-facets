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

describe('Destroy', function() {

	var facetsComponent, container, groupSpecs, querySpecs;

	beforeEach(function() {
		container = $('<div class="client-facets-container"></div>').appendTo($('body'));

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
	        { value : 'test phrase', count : 2},
	        { value : 'second query', count : 8}
	    ];

		facetsComponent = new Facets(container[0], groupSpecs, querySpecs);
	});

	afterEach(function() {
		container.remove();
	});

	it('Removes all dom elements', function() {
		// Given facetsComponent is built, expect that DOM is present
		expect(container.find('.facets-root-container')).to.have.length(1);

		// When
		facetsComponent.destroy();

		// Then
		expect(container.find('.facets-root-container')).to.have.length(0);
	});

	it('Preserves client container', function() {
		// Given facetsComponent is built, expect that client container is present
		expect($('.client-facets-container')).to.have.length(1);

		// When
		facetsComponent.destroy();

		// Then client container should be preserved (we only delete facets itself, not container client provided)
		expect($('.client-facets-container')).to.have.length(1);
	});

	it('Removes all client events', function() {
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

		// Then event handlers are persisted in component
		var phoneGroup = facetsComponent._getGroup('phones');
		var nameGroup = facetsComponent._getGroup('names');
		var phoneFacet = phoneGroup._getFacet('111 111 1111');
		var nameFacet = nameGroup._getFacet('Maya');

		testSupport.verifyClientEventsAreOn(facetsComponent, ['facet:mouseenter', 'facet:mouseleave', 'facet:click', 'facet-group:collapse', 'facet-group:expand', 'facet-group:more']);
		testSupport.verifyClientEventsAreOn(phoneGroup);
		testSupport.verifyClientEventsAreOn(nameGroup);
		testSupport.verifyClientEventsAreOn(phoneFacet);
		testSupport.verifyClientEventsAreOn(nameFacet);

		// When
		facetsComponent.destroy();

		// Then handlers are removed
		testSupport.verifyClientEventsAreOff(facetsComponent, ['facet:mouseenter', 'facet:mouseleave', 'facet:click', 'facet-group:collapse', 'facet-group:expand', 'facet-group:more']);
		testSupport.verifyClientEventsAreOff(phoneGroup);
		testSupport.verifyClientEventsAreOff(nameGroup);
		testSupport.verifyClientEventsAreOff(phoneFacet);
		testSupport.verifyClientEventsAreOff(nameFacet);
	});

});

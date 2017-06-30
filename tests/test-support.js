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

module.exports = {

	verifyQuery: function(queryObj, queryEl, expectedKey, expectedValue, expectedCount, expectedTotal, expectedBarWidth) {
		// Data
		expect(queryObj.key).to.equal(expectedKey);
		expect(queryObj.value).to.equal(expectedValue);
		expect(queryObj.count).to.equal(expectedCount);
		expect(queryObj.total).to.equal(expectedTotal);

		// Visuals
		expect(queryEl.find('.facet-icon').children().attr('style')).to.contain('color'); // color is assigned
		expect(queryEl.find('.facet-bar-background').get(0).style.width).to.equal(expectedBarWidth);
	},

	verifyFacet: function(facetObj, facetEl, expectedKey, expectedValue, expectedCount, expectedTotal, expectedColor, expectedBarWidth) {
		// Data
		expect(facetObj.key).to.equal(expectedKey);
		expect(facetObj.value).to.equal(expectedValue);
		expect(facetObj.count).to.equal(expectedCount);
		expect(facetObj.total).to.equal(expectedTotal);

		// Visuals
		expect(facetEl.find('.facet-icon').children().attr('style')).to.contain('color:' + expectedColor);
		expect(facetEl.find('.facet-bar-background').get(0).style.width).to.equal(expectedBarWidth);
	},

	verifySelectedFacet: function(facetObj, facetEl,
			expectedKey, expectedValue, expectedCount, expectedTotal,
			expectedBarWidth, expectedSelectedBarWidth) {

		// Data
		expect(facetObj.key).to.equal(expectedKey);
		expect(facetObj.value).to.equal(expectedValue);
		expect(facetObj.count).to.equal(expectedCount);
		expect(facetObj.total).to.equal(expectedTotal);

		// Visuals
		expect(facetEl.find('.facet-bar-background').get(0).style.width).to.equal(expectedBarWidth);
		expect(facetEl.find('.facet-bar-selected').get(0).style.width).to.equal(expectedSelectedBarWidth);
	},

	verifyDeselectedFacet: function(facetObj, facetEl, expectedKey, expectedValue, expectedCount, expectedTotal, expectedColor, expectedBarWidth) {
		this.verifyFacet(facetObj, facetEl, expectedKey, expectedValue, expectedCount, expectedTotal, expectedColor, expectedBarWidth);
		expect(facetEl.find('.facet-bar-selected')).to.have.length(0);
	},

	_findFacetElement: function(facetsComponent, groupKey, facetValue) {
		var group = facetsComponent.getGroup(groupKey);
		return group._getFacet(facetValue);
	},

	verifyFacetIsHighlighted: function(facetsComponent, groupKey, facetValue) {
		var facet = this._findFacetElement(facetsComponent, groupKey, facetValue);
		expect(facet.highlighted).to.be.true;
	},

	verifyFacetIsNotHighlighted: function(facetsComponent, groupKey, facetValue) {
		var facet = this._findFacetElement(facetsComponent, groupKey, facetValue);
		expect(facet.highlighted).to.be.false;
	},

	verifyQueryIsHighlighted: function(facetsComponent, key, value) {
		var queryEl = facetsComponent._getQuery(key, value);
		expect(queryEl.highlighted).to.be.true;
	},

	verifyQueryIsNotHighlighted: function(facetsComponent, key, value) {
		var queryEl = facetsComponent._getQuery(key, value);
		expect(queryEl.highlighted).to.be.false;
	},

	findSearchIcon: function(facetsComponent, groupStr, facetString) {
		var group = facetsComponent.getGroup(groupStr);
		var facet = group._getFacet(facetString);
		return facet._element.find('.facet-search');
	},

	verifySearchIconIsDisplayed: function(facetsComponent, groupStr, facetStr) {
		var searchIcon = this.findSearchIcon(facetsComponent, groupStr, facetStr);
		expect(searchIcon).to.have.length(1);
	},

	verifySearchIconIsNotDisplayed: function(facetsComponent, groupStr, facetStr) {
		var searchIcon = this.findSearchIcon(facetsComponent, groupStr, facetStr);
		expect(searchIcon).to.have.length(0);

	},

	verifyClientEventsAreOn: function(group, clientEvents) {
		if (clientEvents) {
			clientEvents.forEach(function(clientEvent) {
				expect(group._handlers[clientEvent]).to.not.be.undefined;
			});
		} else {
			expect(group._omniHandlers.length >= 1).equals(true);
		}
	},

	verifyClientEventsAreOff: function(group, clientEvents) {
		if (clientEvents) {
			if (group._handlers) {
				clientEvents.forEach(function(clientEvent) {
					expect(group._handlers[clientEvent]).to.be.undefined;
				});
			} else {
				expect(group._handlers).to.be.undefined;
			}
		}
		expect(!group._omniHandlers || !group._omniHandlers.length).equals(true);
	}
}

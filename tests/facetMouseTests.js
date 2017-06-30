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

describe('Mouse Events', function() {

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

	it('Emits mouse enter and leave events with key and value of hovered over facet icon', function() {
		// Given
		var onMouseEnter = sinon.spy(),
			onMouseLeave = sinon.spy();
		facetsComponent.on('facet:mouseenter', onMouseEnter);
		facetsComponent.on('facet:mouseleave', onMouseLeave);

		// When first phone icon is hovered over
		var phoneGroup = facetsComponent.getGroup('phone'),
			firstPhoneFacet = phoneGroup._getFacet('111 111 1111'),
			firstPhoneIcon = firstPhoneFacet._element.find('.facet-icon');
		firstPhoneIcon.trigger('mouseenter');
		firstPhoneIcon.trigger('mouseleave');

		// Then
		expect(onMouseEnter.calledOnce).to.be.true;
		expect(onMouseEnter.getCall(0).args[1]).to.equal('phone');
		expect(onMouseEnter.getCall(0).args[2]).to.equal('111 111 1111');

		expect(onMouseLeave.calledOnce).to.be.true;
		expect(onMouseLeave.getCall(0).args[1]).to.equal('phone');
		expect(onMouseLeave.getCall(0).args[2]).to.equal('111 111 1111');
	});

	it('Emits mouse events for newly appended items', function() {
		// Given an initial registsration of mouse events
		var onMouseEnter = sinon.spy(),
			onMouseLeave = sinon.spy();
		facetsComponent.on('facet:mouseenter', onMouseEnter);
		facetsComponent.on('facet:mouseleave', onMouseLeave);

		// When names are appended...
		facetsComponent.append([
			{label: 'Names', key: 'name', facets: [{count: 45, value: 'John'}]}
		]);

		// ...and the newly added name icon is hovered over
		var nameGroup = facetsComponent.getGroup('name'),
			johnFacet = nameGroup._getFacet('John'),
			johnIcon = johnFacet._element.find('.facet-icon');
		johnIcon.trigger('mouseenter');
		johnIcon.trigger('mouseleave');

		// Then expect initially registered callbacks to have been called
		expect(onMouseEnter.calledOnce).to.be.true;
		expect(onMouseEnter.getCall(0).args[1]).to.equal('name');
		expect(onMouseEnter.getCall(0).args[2]).to.equal('John');

		expect(onMouseLeave.calledOnce).to.be.true;
		expect(onMouseLeave.getCall(0).args[1]).to.equal('name');
		expect(onMouseLeave.getCall(0).args[2]).to.equal('John');
	});

	it('Removes mouse events', function() {
		// Given
		var onMouseEnter = sinon.spy(),
			onMouseLeave = sinon.spy();
		facetsComponent.on('facet:mouseenter', onMouseEnter);
		facetsComponent.on('facet:mouseleave', onMouseLeave);

		// When events are de-registered...
		facetsComponent.off('facet:mouseenter');
		facetsComponent.off('facet:mouseleave');

		// ... and a hover is triggerred
		var phoneGroup = facetsComponent.getGroup('phone'),
			firstPhoneFacet = phoneGroup._getFacet('111 111 1111'),
			firstPhoneIcon = firstPhoneFacet._element.find('.facet-icon');
		firstPhoneIcon.trigger('mouseenter');
		firstPhoneIcon.trigger('mouseleave');


		// Then handlers should NOT have been called
		expect(onMouseEnter.called).to.be.false;
		expect(onMouseLeave.called).to.be.false;
	});

});

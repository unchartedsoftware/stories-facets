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

function main() {
    var container = $('#facet-container');

    var groups = getSampleGroups();

    var facets = new Facets(container,groups);

	facets.on('facet-group:other', function (evt, key, value) {
		console.log('Clicked: ' + key);
	});

    // Respond to more event, this example demonstrates calling append on the more callback
    facets.on('facet-group:more', function(evt, key, value) {
		if (key === 'phone') {
			facets.append([
				{
					label: 'Phone Numbers',
					key: 'phone',
					more: 0,
					facets: [
						{icon: {class: 'fa fa-phone', color: 'grey'}, count: 11, value: '111 111 1111'},
						{icon: {class: 'fa fa-phone', color: 'grey'}, count: 22, value: '222 222 2222'},
						{icon: {class: 'fa fa-phone', color: 'grey'}, count: 33, value: '333 333 3333'},
						{icon: {class: 'fa fa-phone', color: 'grey'}, count: 44, value: '444 444 4444'},
						{icon: {class: 'fa fa-phone', color: 'grey'}, count: 55, value: '555 555 5555'}
					]
				}
			]);
		} else if (key === 'email') {
			facets.append([
				{
					label: 'Email Addresses',
					key: 'email',
					more: 0,
					facets: [
						{ icon : {class:'fa fa-envelope',color:'green'}, count : 5, value : 'test3@example.com' },
						{ icon : {class:'fa fa-envelope',color:'green'}, count : 3, value : 'test4@example.com', links : 6 }
					]
				}
			]);
		}
	});

    var $controls = $('<div/>').prependTo('body');

    // Test appending group data with more where previously there was no more
    var $append1 = $('<button/>')
        .text('Append name with more')
        .click(function() {
            facets.append([
                {
                    label : 'Names',
                    more : 1,
                    key : 'name',
                    facets : [
                        { icon : {class:'fa fa-male',color:'grey'}, count : 255, value : 'John' }
                    ]
                }
            ]);
        })
        .appendTo($controls);

}

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

    var searches = getSampleQueries();
    var groups = getSampleGroups();

    var $controls = $('<div/>').prependTo('body');

    var f = new Facets(container, groups, searches);

	// Register group events to demonstrate they're maintained after group replacement
	f.on('facet-group:collapse', function(e, key) {
		console.log('facet-group:collapse key = ' + key);
	});
	f.on('facet-group:expand', function(e, key) {
		console.log('facet-group:expand key = ' + key);
	});
	f.on('facet-group:more', function(e, key) {
		console.log('facet-group:more key = ' + key);
	});

	// Register facet event to demonstrate that its maintained after group replacement
	f.on('facet:click', function(e, key, value) {
		console.log('facet:click key = ' + key + ', value = ' + value);
	});

	// Demonstrate group replacement with more link
    $('<button/>')
        .text('Replace Phone Group (more true)')
        .click(function() {
			var phoneGroupReplacement =
				{
		            label: 'Phone Numbers',
		            key: 'phone',
					more: true,
					facets: [
		                {icon: {class:'fa fa-phone', color:'orange'}, count: 50, value: '555 111 1111'},
		                {icon: {class:'fa fa-phone', color:'orange'}, count: 9, value: '555 222 2222'},
		                {icon: {class:'fa fa-phone', color:'orange'}, count: 8, value: '555 333 3333'}
		            ]
		    	};
            f.replaceGroup(phoneGroupReplacement);
    	})
        .appendTo($controls);

	// Demonstsrate group replacement with no more link
    $('<button/>')
        .text('Replace Phone Group (no more)')
        .click(function() {
			var phoneGroupReplacement =
				{
		            label: 'Phone Numbers',
		            key: 'phone',
					facets: [
		                {icon: {class:'fa fa-phone', color:'orange'}, count: 550, value: '555 111 1111'},
						{icon: {class:'fa fa-phone', color:'orange'}, count: 152, value: '55 333 3333'},
		                {icon: {class:'fa fa-phone', color:'orange'}, count: 22, value: '555 222 2222'},
		                {icon: {class:'fa fa-phone', color:'orange'}, count: 15, value: '555 444 4444'}
		            ]
		    	};
            f.replaceGroup(phoneGroupReplacement);
    	})
        .appendTo($controls);

}

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

    // Register group events to demonstrate they're maintained after replacement
	f.on('facet-group:collapse', function(e, key) {
		console.log('facet-group:collapse key = ' + key);
	});
	f.on('facet-group:expand', function(e, key) {
		console.log('facet-group:expand key = ' + key);
	});
	f.on('facet-group:more', function(e, key) {
		console.log('facet-group:more key = ' + key);
	});

	// Register facet event to demonstrate that its maintained after replacement
	f.on('facet:click', function(e, key, value) {
		console.log('facet:click key = ' + key + ', value = ' + value);
	});

    $('<button/>')
        .text('Replace')
        .click(function() {
			var newQueries = [
				{ key: '*', value: 'New York', count: 10 }
			];
			var newGroups = [
				{
		            label : 'Websites',
		            key : 'website',
		            facets : [
		                { icon : {class:'fa fa-globe',color:'grey'}, count : 123, value : 'www.example.com/helloworld' },
		                { icon : {class:'fa fa-globe',color:'grey'}, count : 42, value : 'www.example.com/foobar', links : 1 }
		            ]
		        }
			];
            f.replace(newGroups, newQueries, true); //disables CSS animations during replace
        })
        .appendTo($controls);

}

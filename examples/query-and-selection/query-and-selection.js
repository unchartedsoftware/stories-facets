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

	var queries = getSampleQueries();
    var groups = getSampleGroups();

    var facets = new Facets(container,groups,queries);

    // Respond to click event
	facets.on('facet:click',function(evt, key, value) {
        if (key === '*') {
			facets.addQuery({
                key: '*',
                value : value,
                count : 5
            });
        } else {
			facets.addQuery({
                key: key,
                value : value,
                count : 10
            });
        }
    });

    // Respond to hover events
    facets.on('facet:mouseenter', function(evt, key, value) {
		console.log('=== CLIENT can respond to facet:mouseenter, key = ' + key + ', value = ' + value +
			', clientX = ' + evt.clientX + ', clientY = ' + evt.clientY);
	});
    facets.on('facet:mouseleave', function(evt, key, value) {
		console.log('=== CLIENT can respond to facet:mouseleave, key = ' + key + ', value = ' + value +
			', clientX = ' + evt.clientX + ', clientY = ' + evt.clientY);
	});

    // Respond to collapse/expand events
    facets.on('facet-group:collapse', function(evt, key) {
        console.log('=== CLIENT can respond to facet:collapse, key = ' + key);
    });
    facets.on('facet-group:expand', function(evt, key) {
        console.log('=== CLIENT can respond to facet:expand, key = ' + key);
    });

    // Selection and deselection
    var $controls = $('<div/>').prependTo('body');
    $('<button/>')
        .text('Select')
        .click(function() {
            facets.select([
                {
                    key : 'name',
                    facets : [
                        { value : 'Maya', selected : 3 },
                        { value : 'Debbie', selected : 1 }
                    ]
                },
                {
                    key : 'persona',
                    facets : [
                        { value : '555 123 4567', selected : 13 }
                    ]
                }
            ]);
        })
        .appendTo($controls);

    $('<button/>')
        .text('Deselect')
        .click(function() {
            facets.deselect();
        })
        .appendTo($controls);

    // Test events with newly appended group
    $('<button/>')
        .text('Append foo:bar 100')
        .click(function() {
            facets.append([
                {
                    label : 'Foo',
                    key : 'foo',
                    facets : [
                        { icon : {class:'fa fa-male',color:'grey'}, count : 100, value : 'bar' }
                    ]
                }
            ]);
        })
        .appendTo($controls);

        // Test events with appending a new entry to existing group
        $('<button/>')
            .text('Append name:John 255')
            .click(function() {
                facets.append([
                    {
                        label : 'Names',
                        key : 'name',
                        facets : [
                            { icon : {class:'fa fa-male',color:'grey'}, count : 255, value : 'John' }
                        ]
                    }
                ]);
            })
            .appendTo($controls);

}

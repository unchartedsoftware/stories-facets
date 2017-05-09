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

    // Include a date histogram to demonstrate that selection api will ignore it
    var groups = getSampleGroups();
    groups.push({
        label: 'Dates',
        key: 'dates',
        facets: [
            {
                histogram: {
                    slices: [
                        { label: "2015-01-20", count: 49, metadata: "This is not it!" },
                        { label: "2015-02-06", count: 48, metadata: "This is not it!" },
                        { label: "2015-02-07", count: 15, metadata: "This is not it!" }
                    ]
                }
            }
        ]
    });

    var facets = new Facets(container, groups, searches);

    var $controls = $('<div/>').prependTo('body');

    $('<button/>')
        .text('Select')
        .click(function() {
			/**
			 * Data notes:
			 * 	- John is not currently a facet value, widget should ignore unknown selections
			 * 	- There is no current 'Anchorage AK' place, widget should not render an empty place section
			 */
            facets.select([
                {
                    key : 'name',
                    facets : [
                        { value : 'Mary', selected : { count: 25, countLabel: '25/32' } },
                        { value : 'Debbie', selected : { count : 5, countLabel: '5/11'} }
                    ]
                },
				{
					key : 'place',
					facets : [
						{ value : 'Anchorage AK', selected : 5 }
					]
				}
            ]);
        })
        .appendTo($controls);


    $('<button/>')
        .text('Select Q')
        .click(function() {
            var isQuery = true;
            facets.select([
                {
                  key: '*',
                  facets: [
                      {value: 'Toronto', selected: { count: 10, countLabel: '10/16'}}
                  ]
                },
                {
                    key: 'persona',
                    facets: [
                        {value: '555 409 2938', selected: { count: 3, countLabel: '3/30'} },
                        {value: 'foo', selected: 8}     // Selection ignores non matching key/value pairs
                    ]
                },
                {
                    key: 'noSuchThing',
                    facets: [
                        {value: 'whatever', selected: 10}
                    ]
                }
            ], isQuery);
        })
        .appendTo($controls);

    $('<button/>')
        .text('Deselect')
        .click(function() {
            facets.deselect();
        })
        .appendTo($controls);
}

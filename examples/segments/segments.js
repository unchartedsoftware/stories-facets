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

    var groups = [
        {
            label : 'Places',
            key : 'place',
            facets : [
                {
                    icon : {class:'fa fa-globe',color:'darkgreen'},
                    count : 42,
                    segments: [{color: 'darkgreen', count: 20}, {color: 'green', count: 15},{color: 'lightgreen', count: 7}],
                    value : '43.6532N, 79.3832W',
                    label : 'Toronto, ON'
                },
                {
                    icon : {class:'fa fa-globe',color:'darkgreen'},
                    count : 33,
                    segments: [{color: 'darkgreen', count: 20}, {color: 'green', count: 10},{color: 'lightgreen', count: 3}],
                    value : '34.0500N, 118.2500W',
                    label : 'Los Angeles, CA'
                },
                {
                    icon : {class:'fa fa-globe',color:'darkgreen'},
                    count : 12,
                    segments: [{color: 'darkgreen', count: 8}, {color: 'green', count: 3},{color: 'lightgreen', count: 1}],
                    value : '37.8044N, 122.2708W',
                    label : 'Oakland, CA'
                }
            ]
        },
        {
            label : 'Phone Numbers',
            key : 'phone',
            facets : [
                {
                    icon : {class:'fa fa-phone'},
                    count: 60,
                    selected: { selected: 30, segments: [{color: '#2196f3', count: 20}, {color: '#03a9f4', count: 10}] },
                    segments: [{ color: 'red', count: 30 }, { color: 'hotpink', count: 10 }],
                    countLabel: '40/60',
                    value : '555 111 2222'
                },
                {
                    icon : {class:'fa fa-phone', color:'blue'},
                    count : 30,
                    selected: 20,
                    segments: [{ color: 'blue', count: 15 }, { color: 'skyblue', count: 5 }],
                    countLabel: '8/10',
                    value : '555 123 4567',
                    links : 1
                }
            ]
        }
    ];

    var facets = new Facets(container, groups);

    var $controls = $('<div/>').prependTo('body');

    $('<button/>')
        .text('Select')
        .click(function() {
            facets.select([
				{
					key : 'place',
					facets : [
						{ value : '43.6532N, 79.3832W', selected : {selected: 35, segments: [{color: '#2196f3', count: 20}, {color: '#03a9f4', count: 10},{color: '#00bcd4', count: 5}]} }
					]

				},
				{
					key : 'place',
					facets : [
						{ value : '34.0500N, 118.2500W', selected : 25  }
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
}

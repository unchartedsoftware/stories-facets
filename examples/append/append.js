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

    // Register facet event to demonstrate that its maintained after append
	facets.on('facet:click', function(e, key, value) {
		console.log('facet:click key = ' + key + ', value = ' + value);
	});

    var $controls = $('<div/>').prependTo('body');

    // Example 1: Append a new entry John, to existing group Names
    var $append1 = $('<button/>')
        .text('Append name:John 255')
        .click(function() {
            facets.append([
                {
                    label : 'Names',
                    key : 'name',
                    facets : [
                        {
                            icon : {class:'fa fa-male',color:'grey'},
                            count : 255,
                            value : 'John'
                        }
                    ]
                }
            ]);
        })
        .appendTo($controls);

    // Example 2: Append a new group foo with one entry bar
    var $append2 = $('<button/>')
        .text('Append foo:bar 100')
        .click(function() {
            facets.append([
                {
                    label : 'Foo',
                    key : 'foo',
                    facets : [
                        {
                            icon : {class:'fa fa-male',color:'grey'},
                            count : 100,
                            value : 'bar'
                        }
                    ]
                }
            ]);
        })
        .appendTo($controls);

    // Example 3: Append existing phone entry to existing phone group, i.e. update count
    var $append3 = $('<button/>')
        .text('Append phone:555 987 7234 10')
        .click(function() {
            facets.append([
                {
                    label : 'Phone Numbers',
                    key : 'phone',
                    facets : [
                        {
                            icon : {class:'fa fa-phone',color:'orange'},
                            count : 10,
                            value : '555 987 7234'
                        }
                    ]
                }
            ]);
        })
        .appendTo($controls);

    // Example 4: Append new emails section
    // Click this button twice to verify the entry can be modfied
    var $append4 = $('<button/>')
        .text('Append emails:hello@example.com 25')
        .click(function() {
            facets.append([
                {
                    label : 'Email Addresses',
                    key : 'emails',
                    facets : [
                        {
                            icon : {class:'fa fa-envelope',color:'blue'},
                            count : 25,
                            value : 'hello@example.com'
                        }
                    ]
                }
            ]);
        })
        .appendTo($controls);



}

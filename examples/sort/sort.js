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

    var $asc = $('<button/>')
        .text('Sort Key Ascending')
        .click(function() {
            facets.sort(function(a, b) {
                if (a.key < b.key) {
                    return -1;
                }
                if (a.key > b.key) {
                    return 1;
                }
                return 0;
            });
        })
        .appendTo($controls);

    var $desc = $('<button/>')
        .text('Sort Key Descending')
        .click(function() {
            facets.sort(function(a, b) {
                if (a.key > b.key) {
                    return -1;
                }
                if (a.key < b.key) {
                    return 1;
                }
                return 0;
            });
        })
        .appendTo($controls);
}

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

    var searches = getSampleQueries()
    searches.push({ key: 'name', value: 'Alice', count: 10 });

    var groups = getSampleGroups();

    var groupsToHighlight = [
        {key: 'name', value: 'Stephanie'},
        {key: 'place', value: '34.0500N, 118.2500W'}
    ];

    var queriesToHighlight = [{key: 'name', value: 'Alice'}];

    var $controls = $('<div/>').prependTo('body');

    var f = new Facets(container, groups, searches);

    var highlightedFacets = false;

    var $highlightFacets = $('<button/>')
        .text('Highlight Multiple Facets')
        .click(function() {
            if (!highlightedFacets) {
                f.highlight(groupsToHighlight);
                highlightedFacets = !highlightedFacets;
                $highlightFacets.prop('disabled', true);
                $unhighlightFacets.prop('disabled', false);
            }
        })
        .appendTo($controls);

    var $unhighlightFacets = $('<button/>')
        .text('Unhighlight Multiple Facets')
        .click(function() {
            if (highlightedFacets) {
                f.unhighlight(groupsToHighlight);
                highlightedFacets = !highlightedFacets;
                $highlightFacets.prop('disabled', false);
                $unhighlightFacets.prop('disabled', true);
            }
        })
        .appendTo($controls);

    $unhighlightFacets.prop('disabled', true);

    var highlightedQueries = false;

    var $highlightQueries = $('<button/>')
        .text('Highlight Queries')
        .click(function() {
            if (!highlightedQueries) {
                f.highlight(queriesToHighlight, true);
                highlightedQueries = !highlightedQueries;
                $highlightQueries.prop('disabled', true);
                $unhighlightQueries.prop('disabled', false);
            }
        })
        .appendTo($controls);

    var $unhighlightQueries = $('<button/>')
        .text('Unhighlight Queries')
        .click(function() {
            if (highlightedQueries) {
                // TODO Implement unhighlight for queries
                f.unhighlight(queriesToHighlight, true);
                highlightedQueries = !highlightedQueries;
                $highlightQueries.prop('disabled', false);
                $unhighlightQueries.prop('disabled', true);
            }
        })
        .appendTo($controls);

    $unhighlightQueries.prop('disabled', true);

    // Also demonstrate how click event can be used to toggle facet highlight
    f.on('facet:click', function(e, key, value) {
        if (f.isHighlighted({key: key, value: value})) {
            f.unhighlight([{key: key, value: value}]);
        } else {
            f.highlight([{key: key, value: value}]);
        }
    });

    // Also demonstrate how click event can be used to toggle query highlight
    f.on('query:click', function(e, key, value) {
        if (f.isHighlighted({key: key, value: value}, true)) {
            f.unhighlight([{key: key, value: value}], true);
        } else {
            f.highlight([{key: key, value: value}], true);
        }
    });

}

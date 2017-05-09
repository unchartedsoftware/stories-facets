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

    // Demonstrate initializing with multiple queries
    var queries = getSampleQueries();
    var groups = getSampleGroups();

    var $controls = $('<div/>').prependTo('body');

    var f = new Facets(container,groups,queries);
    f.on('facet:click',function(evt, key,value) {
        console.log("facet click: key = " + key + ", value = " + value);
        if (key === '*') {
            f.addQuery({
                key: '*',
                value : value,
                count : 21
            });
        } else {
            f.addQuery({
                key: key,
                value : value,
                count : 8
            });
        }
    });

    // demonstrate queries are also clickable
    f.on('query:click', function(evt, key, value, count) {
        console.log("query click: key = " + key + ", value = " + value + ", count = " + count);
    });

    $('<button/>')
        .text('Append searches')
        .click(function() {
            f.append(null, [
                {
                    key: '*',
                    value : 'foo',
                    count : 33
                },
                {
                    key: '*',
                    value : 'bar',
                    count : 44
                }
            ]);
        })
        .appendTo($controls);

}

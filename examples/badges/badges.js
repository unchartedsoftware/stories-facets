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

    var facets = new Facets(container, groups, searches, {enableBadges: true, badgesTitle: 'Badges:'});

    facets.on("facet:click", function(e, key, value) {
      facets.createBadges([
        {
          key: key,
          value: value
        }
      ]);
  	});

    facets.on('badge:close', function(evt, key, value) {
        console.log('Removing badge: '+key+' '+value);
        facets.removeBadges([{key: key, value: value}]);
    });

  var $controls = $('<div/>').prependTo('body');

  $('<button/>')
      .text('Multiple Badges')
      .click(function() {
        //Cannot create a badge whose key/value does not exist as a facet
        facets.createBadges([{ key : 'name', value: 'Mary'}, {key: 'name', value: 'Debbie'}, { key : 'fakeKey', value: 'fakeValue'}]);
      })
      .appendTo($controls);

  $('<button/>')
      .text('Query Badge')
      .click(function() {
        facets.createBadges([{ key : '*', value: 'Toronto'}]);
      })
      .appendTo($controls);

  $('<button/>')
      .text('Remove All')
      .click(function() {
        facets.removeBadges();
      })
      .appendTo($controls);
}

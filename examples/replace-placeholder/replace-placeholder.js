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

function getPlaceholderFacet(key) {
	return {
		key: key,
		placeholder: true,
		html: '<div class="bounce1"></div>' +
			'<div class="bounce2"></div>' +
			'<div class="bounce3"></div>'
	};
}

function getPlaceholderGroups() {
	return [
        {
            label : 'Linked Personas',
            key : 'persona',
            facets : [
                getPlaceholderFacet('persona')
            ]
        },
        {
            label : 'Phone Numbers',
            key : 'phone',
            facets : [
				getPlaceholderFacet('phone')
            ]
        },
        {
            label : 'Names',
            key : 'name',
            facets : [
				getPlaceholderFacet('name')
            ]
        },
        {
            label : 'Places',
            key : 'place',
            facets : [
                getPlaceholderFacet('place')
            ]
        }
    ];
}

function getGroupByKey(groups, key) {
	return groups.filter(function(group) {
		return group.key === key;
	})[0];
}

function main() {
    var container = $('#facet-container');

	var placeholders = getPlaceholderGroups();
    var groups = getSampleGroups();

    var f = new Facets(container, placeholders);

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

	// Register placeholder event to demonstrate that a placeholder can be replaced.
	f.on('placeholder:click', function(e, key) {
		console.log('placeholder:click key = ' + key);
		var group = getGroupByKey(groups, key);
		f.replaceGroup(group);
	});

}

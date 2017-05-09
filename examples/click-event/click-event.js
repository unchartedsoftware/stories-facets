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

	facets.on("facet:click", function(e, key, value) {
		facets.select([
			{
				key : key,
				facets : [
					{
						value : value
					}
				]
			}])
	});

	var $controls = $('<div/>').prependTo('body');


	var $deselect = $('<button/>')
		.text('Deselect')
		.click(function() {
			facets.deselect();
		})
		.appendTo($controls);
}

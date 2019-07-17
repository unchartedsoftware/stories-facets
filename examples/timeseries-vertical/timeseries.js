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
			label: 'Names',
			key: 'name',
			facets: [
				{
					icon: {class: 'fa fa-male', color: 'red'},
					count: 32,
					value: 'Mary',
					timeseries : [0,0,2,4,2,6,8,10,0,0,0]
				},
				{
					icon: {class: 'fa fa-male', color: 'green'},
					count: 28,
					value: 'Linda',
					multipleTimeseries : [
						[[0,4],[1,2],[2,0],[3,4],[4,2],[5,0],[6,8],[7,8],[8,0],[9,0],[10,0]],
						[[0,0],[2,8],[3,0],[6,4],[7,2],[8,2],[12,8],[14,0],[18,0],[19,0],[22,0]]
					],
					colors: [
						'green',
						'#3B5998',
					]
				},
				{
					icon: {class: 'fa fa-male', color: 'blue'},
					count: 24,
					value: 'Jenny',
					timeseries : [[0,0],[2,8],[3,0],[6,4],[7,2],[8,2],[12,8],[14,0],[18,0],[19,0],[22,0]]
				},
				{
					icon: {class: 'fa fa-male', color: 'lightblue'},
					count: 11,
					value: 'Debbie',
					timeseries : [0,0,1,2,0,3,0,0,0,4,1]
				},
				{
					icon: {class: 'fa fa-male', color: 'goldenrod'},
					count: 6,
					value: 'Maya',
					multipleTimeseries : [
						[0,0,0,4,2,0,0,0,0,0,0],
						[0,0,1,2,0,3,0,0,0,4,1]
					],
					colors: [
						'goldenrod',
						'#3CBA54',
					]
				},
				{
					icon: {class: 'fa fa-male', color: 'magenta'},
					count: 5,
					value: 'Stephanie',
					timeseries : [0,0,1,1,1,2,0,0,0,0,0]
				}
			]
		}
	];

	var facets = new Facets(container, groups);

	var $controls = $('<div/>').prependTo('body');

	$('<button/>')
		.text('Select')
		.click(function () {
			facets.select([
				{
					key: 'name',
					facets: [
						{
							value: 'Maya',
							selected: {
								count: 3,
								countLabel: '3/6',
								timeseries: [0,0,0,2,1,0,0,0,0,0,0]
							}
						},
						{
							value: 'Debbie',
							selected: {
								count : 1,
								countLabel : '1/11',
								timeseries : [0,0,1,0,0,0,0,0,0,0,0]
							}
						},
						{
							value: 'Mary',
							selected: {
								count : 20,
								countLabel : '20/32',
								timeseries : [0,0,1,3,1,5,2,8,0,0,0]
							}
						},
						{
							value: 'Stephanie',
							selected: {
								count : 0,
								countLabel : '0/5',
								timeseries : [0,0,0,0,0,0,0,0,0,0,0]
							}
						}
					]
				}
			]);
		})
		.appendTo($controls);


	$('<button/>')
		.text('Deselect')
		.click(function () {
			facets.deselect();
		})
		.appendTo($controls);
}

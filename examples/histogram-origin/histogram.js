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
			label : 'Start of Bar',
			key : 'start-of-bar',
			facets : [
				{
					"histogram": {
						showOrigin: true,
						"slices": [
							{
								"label": "-10",
								"toLabel": "0",
								"count": 6
							},
							{
								"label": "0",
								"toLabel": "10",
								"count": 23
							},
							{
								"label": "10",
								"toLabel": "20",
								"count": 49
							},
							{
								"label": "20",
								"toLabel": "30",
								"count": 34
							}
						]
					}
				}
			]
		},
		{
			label : 'First Quarter of Bar',
			key : 'first-quarter-of-bar',
			facets : [
				{
					"histogram": {
						showOrigin: true,
						"slices": [
							{
								"label": "-12.5",
								"toLabel": "-2.5",
								"count": 6
							},
							{
								"label": "-2.5",
								"toLabel": "7.5",
								"count": 23
							},
							{
								"label": "7.5",
								"toLabel": "17.5",
								"count": 49
							},
							{
								"label": "17.5",
								"toLabel": "27.5",
								"count": 34
							}
						]
					}
				}
			]
		},
		{
			label : 'Middle of Bar',
			key : 'middle-of-bar',
			facets : [
				{
					"histogram": {
						showOrigin: true,
						"slices": [
							{
								"label": "-15",
								"toLabel": "-5",
								"count": 6
							},
							{
								"label": "-5",
								"toLabel": "5",
								"count": 23
							},
							{
								"label": "5",
								"toLabel": "15",
								"count": 49
							},
							{
								"label": "15",
								"toLabel": "25",
								"count": 34
							}
						]
					}
				}
			]
		},
		{
			label : 'Third Quarter of Bar',
			key : 'third-quarter-of-bar',
			facets : [
				{
					"histogram": {
						showOrigin: true,
						"slices": [
							{
								"label": "-17.5",
								"toLabel": "-7.5",
								"count": 6
							},
							{
								"label": "-7.5",
								"toLabel": "2.5",
								"count": 23
							},
							{
								"label": "2.5",
								"toLabel": "12.5",
								"count": 49
							},
							{
								"label": "12.5",
								"toLabel": "22.5",
								"count": 34
							}
						]
					}
				}
			]
		},
		{
			label : 'End of Bar',
			key : 'end-of-bar',
			facets : [
				{
					"histogram": {
						showOrigin: true,
						"slices": [
							{
								"label": "-20",
								"toLabel": "-10",
								"count": 6
							},
							{
								"label": "-10",
								"toLabel": "0",
								"count": 23
							},
							{
								"label": "0",
								"toLabel": "10",
								"count": 49
							},
							{
								"label": "10",
								"toLabel": "20",
								"count": 34
							}
						]
					}
				}
			]
		},
	];

	var facets = new Facets(container, groups);
}

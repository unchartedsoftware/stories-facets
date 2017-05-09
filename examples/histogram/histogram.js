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
			label : 'Dates',
			key : 'dates',
			facets : [
				{
					"histogram": {
						"slices": [
							{
								"label": "2015-01-20",
								"count": 49,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-02-06",
								"count": 48,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-02-07",
								"count": 15,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-02-14",
								"count": 3,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-02-14",
								"count": 44,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-02-20",
								"count": 10,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-02-28",
								"count": 5,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-03-04",
								"count": 26,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-03-04",
								"count": 23,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-03-08",
								"count": 32,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-03-17",
								"count": 24,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-03-18",
								"count": 7,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-04-07",
								"count": 19,
								"metadata": "This is it!!!"
							},
							{
								"label": "2015-04-13",
								"count": 46,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-04-20",
								"count": 37,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-04-24",
								"count": 48,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-05-05",
								"count": 8,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-05-16",
								"count": 20,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-05-22",
								"count": 22,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-06-25",
								"count": 24,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-07-04",
								"count": 29,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-07-09",
								"count": 1,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-07-18",
								"count": 50,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-07-28",
								"count": 23,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-08-04",
								"count": 39,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-08-21",
								"count": 7,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-08-21",
								"count": 33,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-09-07",
								"count": 34,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-09-12",
								"count": 7,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-09-17",
								"count": 46,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-02",
								"count": 11,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-05",
								"count": 12,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-06",
								"count": 42,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-07",
								"count": 48,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-10",
								"count": 45,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-20",
								"count": 21,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-27",
								"count": 36,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-29",
								"count": 7,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-10-30",
								"count": 23,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-11-03",
								"count": 8,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-11-10",
								"count": 45,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-11-25",
								"count": 6,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-12-15",
								"count": 49,
								"metadata": "This is not it!"
							},
							{
								"label": "2015-12-22",
								"count": 46,
								"metadata": "This is not it!"
							}
						]
					}
				}
			]
		}
	];

	var selectRangeCountsData = [
		{
			key : 'dates',
			facets : [
				{
					value : 'dates',
					selection: {
						range: {
							from: 0,
							to: 4
						},
						slices: {
							"2015-01-20": 40,
							"2015-02-06": 35,
							"2015-02-07": 12,
							"2015-02-14": 3
						}
					}
				}
			]
		}
	];

	var selectRangeData = [
		{
			key : 'dates',
			facets : [
				{
					value : 'dates',
					selection: {
						range: {
							from: "2015-03-04",
							to: "2015-10-10"
						}
					}
				}
			]
		}
	];

	var selectCountsData = [
		{
			key : 'dates',
			facets : [
				{
					value : 'dates',
					selection: {
						slices: {
							"2015-05-22": 10,
							"2015-06-25": 5,
							"2015-07-04": 12,
							"2015-07-09": 1
						}
					}
				}
			]
		}
	];

	var facets = new Facets(container,groups);

	var $controls = $('<div/>').appendTo('body');

	var $selectRangeAndCounts = $('<span style="cursor: pointer; text-decoration: underline; color: #1077ff" />')
		.html('Select range and counts.<br />')
		.appendTo($controls);

	var $selectRangeOnly = $('<span style="cursor: pointer; text-decoration: underline; color: #1077ff" />')
		.html('Select range only.<br />')
		.appendTo($controls);

	var $selectCountsOnly = $('<span style="cursor: pointer; text-decoration: underline; color: #1077ff" />')
		.html('Select counts only.<br />')
		.appendTo($controls);

	var $clearSelection = $('<span style="cursor: pointer; text-decoration: underline; color: #1077ff" />')
		.html('Clear selection.<br /><br />')
		.appendTo($controls);

	var $hover = $('<span/>')
		.html(
			'<b>Hovering</b><br />' +
			'Label: N/A<br />' +
			'Count: N/A<br /><br />'
		)
		.appendTo($controls);

	var $clicked = $('<span/>')
		.html(
			'<b>Last clicked</b><br />' +
			'Label: N/A<br />' +
			'Count: N/A<br />' +
			'Metadata: N/A<br /><br />'
		)
		.appendTo($controls);

	var slices = groups[0].facets[0].histogram.slices;
	var $range = $('<span/>')
		.html(
			'<b>Selected Range</b><br />' +
			'From: ' + slices[0].label + '<br />' +
			'To: ' + slices[slices.length - 1].label + '<br /><br />'
		)
		.appendTo($controls);

	/* events */
	$selectRangeAndCounts.on('click', function() {
		facets.select(selectRangeCountsData, false);
	});

	$selectRangeOnly.on('click', function() {
		facets.select(selectRangeData, false);
	});

	$selectCountsOnly.on('click', function() {
		facets.select(selectCountsData, false);
	});

	$clearSelection.on('click', function() {
		facets.deselect();
	});

	facets.on('facet-histogram:mouseenter', function(event, key, barData) {
		$hover.html(
			'<b>Hovering</b><br />' +
			'Label: ' + barData.label[0] + '<br />' +
			'Count: ' + barData.count[0] + '<br /><br />'
		);
	});

	facets.on('facet-histogram:mouseleave', function(event, key, barData) {
		$hover.html(
			'<b>Hovering</b><br />' +
			'Label: N/A<br />' +
			'Count: N/A<br /><br />'
		);
	});

	facets.on('facet-histogram:click', function(event, key, barData) {
		$clicked.html(
			'<b>Last clicked</b><br />' +
			'Label: ' + barData.label[0] + '<br />' +
			'Count: ' + barData.count[0] + '<br />' +
			'Metadata: ' + barData.metadata[0] + '<br /><br />'
		);
	});

	facets.on('facet-histogram:rangechanged facet-histogram:rangechangeduser', function(event, key, range) {
		$range.html(
			'<b>Selected Range</b><br />' +
			'From: ' + range.from.label[0] + '<br />' +
			'To: ' + range.to.label[0] + '<br /><br />'
		);
	});
}

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
								"label": "2016-01-01",
								"toLabel": "2016-02-29",
								"count": 49,
								"metadata": "This is not it!"
							},
							{
								"label": "2016-03-01",
								"toLabel": "2016-04-30",
								"count": 48,
								"metadata": "This is not it!"
							},
							{
								"label": "2016-05-01",
								"toLabel": "2016-06-30",
								"count": 15,
								"metadata": "This is not it!"
							},
							{
								"label": "2016-07-01",
								"toLabel": "2016-08-31",
								"count": 3,
								"metadata": "This is not it!"
							},
							{
								"label": "2016-09-01",
								"toLabel": "2016-10-31",
								"count": 44,
								"metadata": "This is not it!"
							},
							{
								"label": "2016-11-01",
								"toLabel": "2016-12-30",
								"count": 10,
								"metadata": "This is not it!"
							},
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
							"2016-01-01": 40,
							"2016-03-01": 35,
							"2016-05-01": 12,
							"2016-07-01": 3
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
							from: "2016-03-01",
							to: "2016-06-30"
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
							"2016-01-01": 40,
							"2016-03-01": 35,
							"2016-05-01": 12,
							"2016-07-01": 3
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

	var hoverDefaultTemplate = '<b>Hovering</b><br />' +
						'Label: N/A<br />' +
						'To Label: N/A<br />' +
						'Count: N/A<br /><br />'
	var $hover = $('<span/>')
		.html(hoverDefaultTemplate)
		.appendTo($controls);

	var $clicked = $('<span/>')
		.html(
			'<b>Last clicked</b><br />' +
			'Label: N/A<br />' +
			'To Label: N/A<br />' +
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
			'To Label: ' + barData.toLabel[0] + '<br />' +
			'Count: ' + barData.count[0] + '<br /><br />'
		);
	});

	facets.on('facet-histogram:mouseleave', function(event, key, barData) {
		$hover.html(hoverDefaultTemplate);
	});

	facets.on('facet-histogram:click', function(event, key, barData) {
		$clicked.html(
			'<b>Last clicked</b><br />' +
			'Label: ' + barData.label[0] + '<br />' +
			'To Label: ' + barData.toLabel[0] + '<br />' +
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

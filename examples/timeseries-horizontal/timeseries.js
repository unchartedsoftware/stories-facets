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

	function generatePrices(num) {
		var res = [];
		for (var i = 0; i < num; i++) {
			res.push(Math.random());
		}
		return res;
	}

	var NUM_PRICES = 20;
	var PRICES = {
		microsoft: generatePrices(NUM_PRICES),
		amazon: generatePrices(NUM_PRICES),
		google: generatePrices(NUM_PRICES),
		facebook: generatePrices(NUM_PRICES)
	};
	var COLORS = {
		microsoft: '#F25022',
		amazon: '#FF9900',
		google: '#3CBA54',
		facebook: '#3B5998'
	};


	var groups = [
		{
			label: 'NYSE:MSFT',
			key: 'microsoft',
			facets: [
				{
					sparkline : PRICES.microsoft,
					colors: [ COLORS.microsoft ]
				}
			]
		},
		{
			label: 'Nasdaq:AMZN',
			key: 'amazon',
			facets: [
				{
					sparkline : PRICES.amazon,
					colors: [ COLORS.amazon ]
				}
			]
		},
		{
			label: 'Nasdaq:GOOG',
			key: 'google',
			facets: [
				{
					sparkline : PRICES.google,
					colors: [ COLORS.google ]
				}
			]
		},
		{
			label: 'Nasdaq:FB',
			key: 'facebook',
			facets: [
				{
					sparkline : PRICES.facebook,
					colors: [ COLORS.facebook ]
				}
			]
		},
		{
			label: 'All Stocks',
			key: 'all',
			facets: [
				{
					sparklines : [
						PRICES.microsoft,
						PRICES.amazon,
						PRICES.google,
						PRICES.facebook
					],
					colors: [
						COLORS.microsoft,
						COLORS.amazon,
						COLORS.google,
						COLORS.facebook
					]
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
					key: 'microsoft',
					facets: [
						{
							value : 'microsoft',
							selection: {
								sparkline: PRICES.microsoft.map(p => p * Math.random())
							}
						}
					]
				},
				{
					key: 'amazon',
					facets: [
						{
							value : 'amazon',
							selection: {
								sparkline: PRICES.amazon.map(p => p * Math.random())
							}
						}
					]
				},
				{
					key: 'google',
					facets: [
						{
							value : 'google',
							selection: {
								sparkline: PRICES.google.map(p => p * Math.random())
							}
						}
					]
				},
				{
					key: 'facebook',
					facets: [
						{
							value : 'facebook',
							selection: {
								sparkline: PRICES.facebook.map(p => p * Math.random())
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

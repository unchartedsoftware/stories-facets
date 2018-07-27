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

function getRemainingTotal(remaining) {
	var remainingTotal = 0;
	remaining.forEach(function(r) {
		remainingTotal += r.count;
	});
	return remainingTotal;
}

function main() {
    var container = $('#facet-container');


	var remaining = [
		{
			icon : {class:'fa fa-male',color:'pink'},
			count : 12,
			value : 'Bubbles'
		},
		{
			icon : {class:'fa fa-male',color:'lightblue'},
			count : 11,
			value : 'Debbie'
		},
		{
			icon : {class:'fa fa-male',color:'goldenrod'},
			count : 8,
			value : 'Maya'
		},
		{
			icon : {class:'fa fa-male',color:'magenta'},
			count : 7,
			value : 'Stephanie'
		}
	];

	var group = {
		label : 'Names',
		key : 'name',
		facets : [
			{
				icon : {class:'fa fa-male',color:'red'},
				count : 26,
				value : 'Mary'
			},
			{
				icon : {class:'fa fa-male',color:'green'},
				count : 25,
				value : 'John'
			},
			{
				icon : {class:'fa fa-male',color:'yellow'},
				count : 21,
				value : 'Ricky'
			}
		],
		more: remaining.length,
		moreTotal: getRemainingTotal(remaining),
		less: 0
	};

	var facets = new Facets(container, [ group ]);

	// Respond to more event, this example demonstrates calling append on the more callback
	facets.on('facet-group:more', function(evt, key, value) {
		var next = remaining.shift();
		group.facets.push(next);
		group.more = remaining.length;
		group.moreTotal = getRemainingTotal(remaining);
		group.less += 1;

		facets.replaceGroup(group);
	});

	facets.on('facet-group:less', function(evt, key, value) {
		const last = group.facets.pop();
		remaining.unshift(last);
		group.more = remaining.length;
		group.moreTotal = getRemainingTotal(remaining);
		group.less -= 1;

		facets.replaceGroup(group);
	});
}

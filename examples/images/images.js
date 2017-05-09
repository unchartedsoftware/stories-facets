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

    $('body').prepend('Basic example of creating a facets widget with images.');

    var groups = getSampleGroups()
	groups.push({
		label : 'Images',
		key : 'images',
		facets : [
			{
				icon : {class:'fa fa-file-image-o',color:'blue'},
				count : 1,
				value : '1',
				label : generateImage('./img/1.png',20)
			},
			{
				icon : {class:'fa fa-file-image-o',color:'blue'},
				count : 12,
				value : '2',
				label : generateImage('./img/2.png',20)
			},
			{
				icon : {class:'fa fa-file-image-o',color:'blue'},
				count : 36,
				value : '3',
				label : generateImage('./img/3.png',20)
			},
			{
				icon : {class:'fa fa-file-image-o',color:'blue'},
				count : 5,
				value : '4',
				label : generateImage('./img/4.png',20)
			}
		]
	});

    new Facets(container,groups);
}

function generateImage(url, dimension) {
	return $('<div>')
		.width(dimension)
		.height(dimension)
		.css({
			'background-image':'url(' + url + ')',
			'background-size' :'contain',
			'background-repeat': 'no-repeat',
			'width': '20px',
			'height': '100%',
			'position': 'relative',
			'float': 'right',
			'right': '80%'
		})
		.clone().wrap('<div/>').parent().html();	// pull out html string
}

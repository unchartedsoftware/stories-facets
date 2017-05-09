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

function getSampleGroups() {
    return [
        {
            label : 'Linked Personas',
            key : 'persona',
            facets : [
                {
                    icon : {
                        class : 'fa fa-users'
                    },
                    count : 51,
                    links : 1,
                    value : '555 123 4567'
                },
                {
                    count : 5,
                    links : 2,
                    value : '555 111 2222'
                }
            ]
        },
        {
            label : 'Phone Numbers',
            key : 'phone',
            facets : [
                {
                    icon : {class:'fa fa-phone',color:'orange'},
                    count : 60,
                    value : '555 777 5555'
                },
                {
                    icon : {class:'fa fa-phone',color:'orange'},
                    count : 10,
                    value : '1 555 222 3333',
                    links : 1
                }
            ]
        },
        {
            label : 'Names',
            key : 'name',
            facets : [
                {
                    icon : {class:'fa fa-male',color:'red'},
                    count : 32,
                    value : 'Mary'
                },
                {
                    icon : {class:'fa fa-male',color:'lightblue'},
                    count : 11,
                    value : 'Debbie'
                },
                {
                    icon : {class:'fa fa-male',color:'goldenrod'},
                    count : 6,
                    value : 'Maya'
                },
                {
                    icon : {class:'fa fa-male',color:'magenta'},
                    count : 5,
                    value : 'Stephanie'
                }
            ]
        },
        {
            label : 'Places',
            key : 'place',
            facets : [
                {
                    icon : {class:'fa fa-globe',color:'lightgreen'},
                    count : 33,
                    value : '34.0500N, 118.2500W',
                    label : 'Los Angeles, CA'
                },
                {
                    icon : {class:'fa fa-globe',color:'lightgreen'},
                    count : 12,
                    value : '37.8044N, 122.2708W',
                    label : 'Oakland, CA'
                }
            ]
        }
    ];
}

function getSampleQueries() {
    return [
        {
            key : '*',
            value : 'Toronto',
            count : 16
        },
        {
            key : 'persona',
            value : '555 409 2938',
            count : 30
        }
    ];
}
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

/* Shim for missing OwnPropertyNames when running PhantomJS tests when using proxyquireify */
/* https://github.com/thlorenz/proxyquireify/issues/35 */
require('phantom-ownpropertynames/implement');

/* bind shim */
Function.prototype.bind = function(target) {
    var f = this;
    return function() {
        return f.apply(target, arguments);
    }
};

/*
 * Copyright (c) 2014-2015 CoNWeT Lab., Universidad Politécnica de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Modified code by: EFTHYMIOS TZORTZIS (fiware user: timaris)
 * This version of the operator (0.4.4) modified the previous one (0.4.3) due to "404-conflict" error. We removed the "parameters" from the "make_request" function .
 * We added the variable "url" , where we specify the url structure of the ckan dataset .
 *
 *
 *
 */

(function () {

    'use strict';

    var MP = MashupPlatform;

    //CKAN types must be transformed in JS types
    //to be used across the different widgets
    var TYPE_MAPPING = {
        'text': 'string',
        'numeric': 'number',
        'int4': 'number',
        'timestamp': 'date'
    };


    ////////////
    //AUXILIAR//
    ////////////

    var make_request = function make_request(method, url, onSuccess, onFailure) {	// remove parameters
        var headers,
            auth_token = MP.prefs.get('auth_token').trim();

        if (auth_token !== '') {
            headers = {
                'Authorization': auth_token
            };
        } else if (MashupPlatform.context.get('fiware_token_available')) {
            headers = {
                'X-FI-WARE-OAuth-Token': 'true',
                'X-FI-WARE-OAuth-Header-Name': 'X-Auth-Token'
            };
        }

        MashupPlatform.http.makeRequest(url, {
            method: method,
            // parameters: parameters,	// deactivate parameters due to conflict 409
            onSuccess: onSuccess,
            onFailure: onFailure,
            requestHeaders: headers
        });
    };

    var logError = function logError(e, type) {
        var msg = e ? e : 'An error arised processing your request';
        type = type ? type : MashupPlatform.log.ERROR;
        MashupPlatform.operator.log(msg, type);
    };


    ///////////////////////////////////////////////
    //FUNCTIONS CALLED WHEN THE HTTP REQUEST ENDS//
    ///////////////////////////////////////////////

    var pushResourceData = function pushResourceData(response) {

        var limit = parseInt(MP.prefs.get('limit_rows'), 10);
        if (isNaN(limit) || limit < 0) {
            limit = 0;
        }
        
        var resource = JSON.parse(response.responseText);

        if (resource.success) {

            var finalData = {
                resource_id: resource.result.resource_id,
                structure: resource.result.fields,
                data: resource.result.records
            };

            // Type transformation
            for (var i = 0; i < finalData.structure.length; i++) {
                if (finalData.structure[i].type in TYPE_MAPPING) {
                    finalData.structure[i].type = TYPE_MAPPING[finalData.structure[i].type];
                }
            }

            // Push the data through the wiring
            MashupPlatform.wiring.pushEvent('resource', JSON.stringify(finalData));

            // Log warn message if limit_rows < resource elements
            var resource_total = resource.result.total;
            if (limit != 0 && resource_total > limit) {
                var msg = 'The number of records of the resource are higher than the max number of ' +
                    'elements to retrieve. If you want to retrieve all the records, increase the ' +
                    'max number of elements to retrieve by editing the operator settings';

                logError(msg, MashupPlatform.log.WARN);
            }

        } else {
            logError();
        }
    };

    var failureCb = function failureCb(e) {
        logError(e.status + ' - ' + e.statusText, MashupPlatform.log.ERROR);
    };


    ////////////////////
    //GET THE RESOURCE//
    ////////////////////

    var get_resource = function get_resource() {
        var parameters = {
            resource_id: MP.prefs.get('resource')
        };

        var limit = parseInt(MP.prefs.get('limit_rows'), 10);
        if (!isNaN(limit) && limit > 0) {
            parameters.limit_rows = limit;
        }
			
        var url = MP.prefs.get('ckan_server') + '/api/action/datastore_search?resource_id=' + MP.prefs.get('resource') + '&limit=' + limit;							// new variable url
		make_request('GET', url, pushResourceData, failureCb);		// remove parameters
    };

    MashupPlatform.prefs.registerCallback(get_resource);

    // Start the execution
    get_resource();

})();

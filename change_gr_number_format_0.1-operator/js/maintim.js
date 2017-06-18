/*
 * Copyright (c) 2016-2017 Hellenic Open University - Student: Efthymios Tzortzis
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
 */

(function () {

    "use strict";

    MashupPlatform.wiring.registerCallback("dataset", function (datasetString) {						// Register a callback for the input endpoint "dataset"
       
	   var initial_data = JSON.parse(datasetString);													// parse the data delivered in the input endpoint
        
		var stringified = JSON.stringify(initial_data);													// Stringify parsed data								
			  
		// convert the greek format number by replacing in the number fields the char "." with "" and the char "," with "."	  
			stringified = stringified.replace(/(?:(\d+)\.)?(?:(\d+)\.)?(\d+),(\d+)/g, "$1$2$3.$4");	  	
			  
		var transformed_data = JSON.parse(stringified);	
		
		
        MashupPlatform.wiring.pushEvent("output", JSON.stringify(transformed_data));					// send the converted dataset to the output endpoint "output"
    });

})();

/*
 * Copyright (c) 2016-2017 Hellenic Open University - Student: Efthymios Tzortzis
 * You may use this operator only with the acceptance of the Licences included and obtaining a copy of them.
 *
 * The created operator is based on "ckan2poi" operator from ConWet under the below Licence:
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
 */
 
 /* The code includes the Javascript Reprojection Library "Proj4js_version 2.4.3" under the below Licence:
  *
  *   http://proj4js.org/	https://github.com/proj4js/proj4js
  *
  *	Copyright (c) 2014, Mike Adair, Richard Greenwood, Didier Richard, Stephen Irons, Olivier Terral and Calvin Metcalf
  *
  * Permission is hereby granted, free of charge, to any person obtaining a
  * copy of this software and associated documentation files (the "Software"),
  * to deal in the Software without restriction, including without limitation
  * the rights to use, copy, modify, merge, publish, distribute, sublicense,
  * and/or sell copies of the Software, and to permit persons to whom the
  * Software is furnished to do so.
  */
  
  /* You can use several marker icons downloaded and licenced by the webpage "http://www.flaticon.com/" . 

/*global MashupPlatform*/

(function () {

    "use strict";

    var icon,
        GEOJSON_POINT_RE = new RegExp('POINT\\s*\\(\\s*([+-]?\\d+(\\.\\d+)?),?\\s*([+-]?\\d+(\\.\\d+)?)\\)');

    var readAttr = function readAttr(entity, attr) {
        var parts = attr.split('.');
        var value = entity[parts[0]];
        for (var i = 1; i < parts.length; i++) {
            value = value[parts[i]];
        }
        return value;
    };

    var singleAttr = function singleAttr(value) {					// get the coordinates from the columns
        var coord_parts;

        if (typeof value === 'object') {
            return value;
        } else {
            coord_parts = value.match(GEOJSON_POINT_RE);
            if (coord_parts != null) {
                return {
                    lat: parseFloat(coord_parts[3]),
                    lng: parseFloat(coord_parts[1])
                };
            } else {
                coord_parts = value.split(new RegExp(',\\s*'));
                return {
                    lat: parseFloat(coord_parts[0]),
                    lng: parseFloat(coord_parts[1])
                };
            }
        }
    };

	/* ***** Create new function "convertCoordsToWGS84" to convert coordinates from system: "EPSG:2100 - GGRS87" to global system used by Google Maps "EPSG:4326 - WGS84" *****
	   ****** If you are a developer and want to modify the function in order to convert coordinates from another system than "EPSG:2100 - GGRS87" , you only need to change the
			  variable "sourceProjection" with the desired system. You can find the code here in the url "https://epsg.io/" and copy the "Proj4js" definition.	****** */
		
    var convertCoordsToWGS84 = function convertCoordsToWGS84(coordJsonInput) 			
    {
			// convert from Greek Grid (EPSG:2100 - GGRS87)        
        var sourceProjection = "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs";  // GGRS87
			//         to  Global Grid (EPSG:4326 - WGS84)
        var targetProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";   // WGS84
		
			// use proj4js library to convert from source projection "GGRS87" to target projection "WGS84"
        var coordWgs84Array = proj4(sourceProjection, targetProjection, [coordJsonInput.lng, coordJsonInput.lat]);
        var coordWgs84JsonOut = { lng: coordWgs84Array[0], lat: coordWgs84Array[1] };

        return coordWgs84JsonOut;
    }     
    
	
	
    var topoi = function topoi(entity, id_prefix, collection) {						// prepares the coordinates to Points of Interest
        var coordinates = null;
        var coordinates_pref = MashupPlatform.prefs.get('coordinates_attr');
        var attributes = coordinates_pref.split(new RegExp(',\\s*'));
        var value = null;

															
        if (attributes.length < 1) {
            return;
        } else if (attributes.length >= 2 && entity[attributes[0]] != null && entity[attributes[1]] != null) {
            coordinates = {
                lat: parseFloat(readAttr(entity, attributes[0])),
                lng: parseFloat(readAttr(entity, attributes[1]))
            };
        } else if ((value = readAttr(entity, attributes[0]))) {
            coordinates = singleAttr(value);
        }

		/* ** check if the preference name "coordinate_system" equals to the default "GGRS87" . If so, then convert the coordinates with the function "convertCoordsToWGS84" . **
		   *** If blank, then the system is the global "WGS84" *** */
		   
		if (MashupPlatform.prefs.get('coordinate_system') === 'GGRS87') {
        coordinates = convertCoordsToWGS84(coordinates);						
		}
		
        if (coordinates) {
            coordinates.system = "WGS84";
            collection.push(entity2poi(entity, coordinates, id_prefix));
        }
    };

    MashupPlatform.wiring.registerCallback("entityInput", function (entityString) {			// get the data from the input endpoint "entityInput"
        var info = JSON.parse(entityString);
        var data = info.data;
        var id_prefix = "";
        var collection = [];

        if (info.resource_id) {
            id_prefix = info.resource_id + ':';
        }

        for (var i = 0; i < data.length; i++) {
            topoi(data[i], id_prefix, collection);
        }

        MashupPlatform.wiring.pushEvent("poiOutput", JSON.stringify(collection));			// send the coordinates to the output endpoint "poiOutput"
    });

    var entity2poi = function entity2poi(entity, coordinates, id_prefix) {					// structure of poi coordinates
        var poi = {
            id: id_prefix + entity._id,
            icon: icon,
            tooltip: "" + entity._id,
            data: entity,
            infoWindow: buildInfoWindow.call(this, entity),
            currentLocation: coordinates
        };

        return poi;
    };

    var internalUrl = function internalUrl(data) {
        var url = document.createElement("a");
        url.setAttribute('href', data);
        return url.href;
    };

    var buildInfoWindow = function buildInfoWindow(entity) {
        var infoWindow = "<div>";
        for (var attr in entity) {
            infoWindow += '<span style="font-size:12px;"><b>' + attr + ": </b> " + entity[attr] +  "</span><br />";
        }
        infoWindow += "</div>";

        return infoWindow;
    };

    var updateMarkerIcon = function updateMarkerIcon() {							// function to choose the marker icon to be displayed in the map
		if (MashupPlatform.prefs.get('marker_url-type') == 'internal_url') {
		icon = internalUrl(MashupPlatform.prefs.get('marker-icon'));				// if source of icon is an internal url, choose it
		}
        else if (MashupPlatform.prefs.get('marker_url-type') == 'absolute_url') {	// if source of icon is an absolute url, choose it
		icon = MashupPlatform.prefs.get('marker-icon');
		}
	
        if (MashupPlatform.prefs.get('marker-icon') == '') {																
            icon = internalUrl('images/poi_ckan.gif');									// default marker icon. The "marker_url_type" preference should be empty.	
        }
    };

    MashupPlatform.prefs.registerCallback(updateMarkerIcon);
    // Init initial marker icon
    updateMarkerIcon();

})();

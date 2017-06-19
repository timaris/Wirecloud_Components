											*** Description of operator with title "CKAN to PoIs - multiple geo-systems" ***
This operator transforms geo-data from a CKAN source to Points of Interest. To do so, you must set in the preferences the "Coordinates attribute", that is the columns that contain
the Latitude and the Longitude. Use this syntax (Latitude,Longitude) . If the coordinate system is the global used by Google Maps "EPSG:4326 - WGS84" , then you must leave empty
the prefernce_name "Coordinate System" . If the geo-data you want to tranfer are in the Greek System "EPSG:2100 - GGRS87" , then you must leave the default value in the prefernce,
that is "GGRS87" .

For more informations, please read the Documentation.
							
							
											*** Description of the generic operator from ConWet Lab "ckan2poi" ***
This operator transforms data from a CKAN source to Points of Interest. To be able to do so, the dataset should provide a column containing the coordinates for each row or,
alternatively, two columns, one with the latitude and another one with the longitude. Also, take into account the fact this operator is generic, so marker bubbles of the PoIs
created by this operator will be a mere composition of the attribute/value pairs.
If your are a developer, an option for improving information shown in the associated point of interest bubbles is to download this operator and use it as an skeleton for your
improved version of the operator. *Remember to change the id metadata* (vendor, name and version) before uploading it again.

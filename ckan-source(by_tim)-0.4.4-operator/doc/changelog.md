v0.4.4 (by timaris)
==================
This version of the operator (0.4.4) modifies the previous one (0.4.3) from CoNWet due to "409-conflict" error. We removed the "parameters" from the "make_request" function .
Add of the variable "url" , where we specify the url structure of the ckan dataset

v0.4.3
=====

* Support for querying the CKAN server without specifying the limit parameter

v0.4.2
=====

* Fix bug using CKAN API keys

v0.4.1
=====

* Fix bug making this operator unusable on WireCloud 0.7.0r5+

v0.4
===

* Initial documentation
* Allow to provide CKAN tokens for authentication. This token is provided
  through a new preference and if you use it will disable the athentication
  using the IdM token of the user.
* Provide resource id through wiring
* Update FIWARE Lab URLs using the new schema (fiware.org instead of
  fi-ware.org)

v0.1
===

* First version

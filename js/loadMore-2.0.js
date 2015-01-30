/*
 * Load More - Javascript Plugin
 * Plugin for load more something in elements
 *
 * 
 * Author: Igor Fernandes
 * Version:  2.0-dev
 * License: LCS
 *
 * Copyright 2015
 * 
 */

/*jslint browser:true */

function loadMore(elementGot, parameters) 
{
	"use strict";

	//Set Self
	var self = this;


	//Setting definitions of plugin
	var pluginName = 'Load More';
	var pluginVersion = '2.1';

	var requireParameters = [
		'config',
		'baseElement'
	];
	//Var of settings default
	var settings = {
		config: {
			object: '',								//Object or URL contain JSON
			method: 'GET',							//Requisition method to obatin the data
			requestData: null								//Form data to send with requisition method POST, only datMethod = POST, example: valid=submit&pass=123
		},				
		itemsInit: 1,								//Items to show in firt loadMore
		itemsPerLoad: 1,							//Items to display per load
		buttonToLoadMore: null,
		baseElement: null,
		minDelay: 0,
		effectOnLoadItems: false,
		onLoadData: function(status) {
			void(0);
		},
		onBeforeLoadMore: function() {
			void(0);
		},
		onAfterLoadMore: function() {
			void(0);
		},
		onLastLoadMore: function(itemsLoaded) {
			void(0);
		},
		onClickButtonLoadMore: function() {
			void(0);
		},
		alwaysEndLoadMore: function() {
			void(0);
		}
	}



	//Declarate private variables
	//
	//Effects available to use
	var availableEffects = [
		'fadeIn',
		'zoomIn'
	];


	var mainElement,
		url 				= null,							//Object or URL contain JSON
		object 				= new Object(),					//Variable to is use in all project
		dataMethod			= 'GET',						//Requisition method to obatin the data
		requestData 		= '',							//Form data to send with requisition method POST, only dataMethod = POST
		baseElement 		= null, 						//Template Element
		itemsInit 			= 1, 							//Items to show in firt loadMore
		buttonToLoadMore 	= null,							//Element with onclick = loadMore function
		originalElement 	= null							//Element before the loadMore transformation


	//End Private Variables -----------------------------------


	//Declarate public variables
	this.minDelay 				= 0; 							//minimun delay to show elements on screen
	this.itemsPerLoad 			= 1,							//Items to display per load
	this.specificLoad			= null; 						//Load from a key equal a value
	this.loadMoreTimes 			= 0;							//Number of times it was run loadMore function
	this.effectOnLoadItems 		= false; 						//Effect to display when you load new items


	//End Public Variables -----------------------------------


	//Declarate private functions
	//Complment of variableNotExitType
	var checkSameType = function(name, variable, value) {
		var type = typeof variable;
		variable = _.variableNotExitType(variable, value);
		if ( variable === false ) {
			throwError(2, {
				'find': ['%p%', '%t%'],
				'replace': [name, type]
			});
			return false;
		}

		return value;

	}
	
	//Adjust the variables to be able to run the plugin, also puts the settings values in the variables plugin
	var setPluginVariables = function() {

		//Adjust All
		self.minDelay 			= checkSameType('minDelay', self.minDelay, settings.minDelay);

		self.itemsPerLoad 		= checkSameType('itemsPerLoad', self.itemsPerLoad, settings.itemsPerLoad);
		
		itemsInit 				= checkSameType('itemsInit', itemsInit, settings.itemsInit);

		dataMethod 				= checkSameType('Data - Method', dataMethod, settings.config.method);


		////End Adjust All ----------------------------------


		//Adjust Data and GET JSON, 
		var typeData = typeof settings.config.object;

		if ( !_.alternateValueComparate(typeData, ['string', 'object']) ) {

			throwError(2, {
				'find': ['%p%', '%t%'],
				'replace': ['Data - URL', 'string or object']
			});

		} else if ( typeData == 'string' ) {

			var urlObject = _.urlObject(settings.config.object);


			url = urlObject['protocol'] + '//' + urlObject['host'] + urlObject['pathname'];

		} else if ( typeData == 'object' ) {

			object = settings.config.object;

		}


		//End Adjust Data -----------------------
		
		//Adjust baseElement
		var typeBaseElement = typeof settings.baseElement;
		//verify if element or string
		if ( !_.alternateValueComparate(typeBaseElement, ['string', 'object']) || typeBaseElement == 'object' && ( !_.isElement(settings.baseElement) ) ) {
			
			throwError(2, {
				'find': ['%p%', '%t%'],
				'replace': ['baseElement', 'string or element']
			});
		
		} else if ( typeBaseElement == 'string' ) {
			
			baseElement = document.querySelector(settings.baseElement);

			if ( baseElement == null ) {
				throwError(3, {
					'find': ['%s%'],
					'replace': [settings.baseElement]
				});
			}


		} else if ( typeBaseElement == 'object' ) {
			baseElement = settings.baseElement;
		}
		
		//End Adjust baseElement ------------------------
		
		
		//Adjust buttonToLoadMore
		//Not Required, but if isset buttonLoadMore... verify
		if( settings.buttonToLoadMore != null ) {

			var typeButtonLoadMore = typeof settings.buttonToLoadMore;
			//verify if element or string
			if ( typeButtonLoadMore == 'string' ) {
				
				buttonToLoadMore = document.querySelector(settings.buttonToLoadMore);

				if ( buttonToLoadMore == null ) {
					throwError(3, {
						'find': ['%s%'],
						'replace': [settings.buttonToLoadMore]
					});
				}


			} else if ( typeButtonLoadMore == 'object' ) {
				if ( !_.isElement(settings.buttonToLoadMore) ) {
					throwError(2, {
						'find': ['%p%', '%t%'],
						'replace': ['buttonToLoadMore', 'string or element']
					});
				}
				buttonToLoadMore = settings.buttonToLoadMore;
			}


		}//end settings.baseElment != null
		

		//End Adjust buttonToLoadMore ----------------------------------


		//Adjust effectOnLoadItems
		var typeofEffects = typeof settings.effectOnLoadItems;

		if ( !_.alternateValueComparate(typeofEffects, ['string', 'boolean']) ) {
			throwError(2, {
				'find': ['%p%', '%t%'],
				'replace': ['effectOnLoadItems', 'string or booelan']
			});
		} else if ( settings.effectOnLoadItems === true ) {
			throwError(4);
		} else if ( typeofEffects == 'string' && availableEffects.indexOf(settings.effectOnLoadItems) == -1 ) {
			throwError(5);
		}

		//End Adjust effectOnLoadItems----------------------------------
		
		//Adjust postData
		var typeRequestData = typeof settings.config.requestData;

		if( requestData != null ) {

			if ( typeRequestData != 'object' ) {
				throwError(2, {
					'find': ['%p%', '%t%'],
					'replace': ['postData', 'object']
				});
			} else {

				requestData =  settings.config.requestData;

			}

		}
		




		//End Adjust postData----------------------------------
		
		

	}

	//End setPluginVariables
	
	var getObjectData = function(callback) {
		
		if ( _.objLength(object) > 0 ) {
			callback();
			return true;
		
		} else {
			_.requestAJAX(url, dataMethod.toLowerCase(), requestData, function(r){
				callback(r);
			});
		}

	}

	//End getObject Data

	//List of Errors
	var errors = [
		//Code: 0
		'Not exists parameters in function loadMore',
		//Code: 1
		'The required parameters are '+requireParameters.join(', '),
		//Code: 2	
		'The parameter %p% must be of type %t%',
		//Code: 3
		'Can not find the element with selector equal: %s%',
		//Code: 4
		"Select the effect in the parameter effectOnLoadItems, the your value can't be equal true",
		//Code: 5
		"Not exists this effect, the available effects are: "+availableEffects.join(', ')
	];

	var throwError = function(code, s) {
		var mensage = ( s != undefined ) ? _.replaceArray(errors[code], s['find'], s['replace']) : errors[code];
		throw new Error( pluginName + ' - ' + mensage + '.' );
	}



	//End Private Functions -----------------------------------
	
	


	//Initialization of plugin
	var init = function(parameters) {

		if (parameters) {

			var checkedsParameters = 0;

			//checks were setted the required parameters
			for( var k in requireParameters ){

				if ( Object.keys(parameters).indexOf(requireParameters[k]) != -1 ){
					//Require Parameters with object
					//Data require propertys
					if( requireParameters[k] == 'config' ){

						//Verify if exists parameters.data.url
						if ( parameters.config.object != undefined ) {
							checkedsParameters++;
						}
						//else go to next required parameter
						continue;
					}

					checkedsParameters++;
				
				} else {
					break;
				}

			}

			//if not exists the required parameters return error
			if( checkedsParameters != requireParameters.length ){
				throwError(1);
			}

			//checks were setted the required parameters
			for (var key in parameters) {

				if ( settings.hasOwnProperty(key) ) {
					
					//if current parameter is object, do other method
					if( typeof parameters[key] == 'object' && ( !_.isElement(parameters[key]) ) ){
						
						for( var k in parameters[key] ) {
							settings[key][k] = parameters[key][k];
						}

					} else {
						settings[key] = parameters[key];
					}

				}//end if hasOwnProperty

			}//end for key in parameters

		}//end if parameters
		else {
			//If not exists parameters show error
			throwError(0);
		}

		setPluginVariables(); //Adjust the variables and put in global variables
		getObjectData(function(r){
			if( r ) {
				if ( typeof r != 'oject' ) {
					object = JSON.parse(r);
				}
			}
		});


	}//end init





	//Declarate public functions


	//Main function to load more	
	this.loadMore = function() {
		
	}

	//End Public Functions -----------------------------------

	//Callbacks
	

	//End Callbacks functions -----------------------------------

	//External Functions
	var _ = {

		isElement: function(object) {
			return !!(object && object.nodeType == 1);
		},//end isElement

		requestAJAX: function(url, method, data, callback) {

			var ajax = {};

			ajax.x = function() {
			    if (typeof XMLHttpRequest !== 'undefined') {
			        return new XMLHttpRequest();  
			    }
			    var versions = [
			        "MSXML2.XmlHttp.5.0",   
			        "MSXML2.XmlHttp.4.0",  
			        "MSXML2.XmlHttp.3.0",   
			        "MSXML2.XmlHttp.2.0",  
			        "Microsoft.XmlHttp"
			    ];

			    var xhr;
			    for(var i = 0; i < versions.length; i++) {  
			        try {  
			            xhr = new ActiveXObject(versions[i]);  
			            break;  
			        } catch (e) {
			        }  
			    }
			    return xhr;
			}

			ajax.send = function(url, callback, method, data) {
			    var x = ajax.x();
			    x.open(method, url);
			    x.onreadystatechange = function() {
			        if (x.readyState == 4) {
			            callback(x.responseText)
			        }
			    };
			    if (method == 'POST') {
			        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			    }
			    x.send(data)
			}

			ajax.get = function(url, data, callback) {
			    var query = [];
			    for (var key in data) {
			        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			    }
			    ajax.send(url + '?' + query.join('&'), callback, 'GET', null)
			}

			ajax.post = function(url, data, callback) {
			    var query = [];

			    for (var key in data) {
			        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			    }
			    ajax.send(url, callback, 'POST', query.join('&'));
			}

			ajax[method](url, data, callback);

		},//end RequestAJAX

		alternateValueComparate: function(variable, array) {
			for ( var k in array ) {

				if( variable == array[k] ){
					return true;
				}

			}

			return false;

		},//end alternateValueComparate

		//variable does not change its type
		variableNotExitType: function(variable, value) {
			if( typeof variable == typeof value )
				return value;

			return false;
		},//end Value not Exit Type

		replaceArray: function(variable, find, replace) {
			for( var i = 0; i < find.length; i++ ) {
				variable = variable.replace(find[i], replace[i]);
			}

			return variable;
		},

		objLength: function(variable) {
			return Object.keys(variable).length;
		},

		urlObject: function(url) {
			var a = document.createElement('a');

			a.setAttribute('href', url);

			var urlObj = {
		        protocol: a.protocol,
		        hostname: a.hostname,
		        host: a.host,
		        port: a.port,
		        hash: a.hash.substr(1),
		        pathname: a.pathname,
		        search: a.search
		    };

		    return urlObj;

		} 



	}

	//End External Funcion -----------------------------------


	//Initializate plugin
	init(parameters);

}

//Set Function loadMore with Element prototype
Element.prototype.loadMore = function(parameters) {
	return new loadMore(this, parameters);
}
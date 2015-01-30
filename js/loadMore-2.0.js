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

function loadMore(elementGot, parameters) {
	"use strict";

	//Setting definitions of plugin
	var pluginName = 'Load More';
	var pluginVersion = '2.1';

	var requireParameters = [
		'data',
		'baseElement'
	];
	//Var of settings default
	var settings = {
		data: '',				//Object or URL contain JSON
		dataMethod: 'GET',		//Requisition method to obatin the data
		postParameters: '',		//Form data to send with requisition method POST, only datMethod = POST, example: valid=submit&pass=123
		itemsInit: 1,			//Items to show in firt loadMore
		itemsPerLoad: 1,
		buttonToLoadMore: null,
		baseElement: '',
		minDelay: 0,
		effectOnLoadItems: '',
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
	var mainElement,
		data, 							//Object or URL contain JSON
		dataMethod = 'GET',				//Requisition method to obatin the data
		postParameters = '',			//Form data to send with requisition method POST, only datMethod = POST, example: valid=submit&pass=123
		baseElement, 					//Template Element
		itemsInit = 1, 					//Items to show in firt loadMore
		originalElement; 				//Element before the loadMore transformation


	//End Private Variables -----------------------------------


	//Declarate public variables
	this.minDelay = 1000; 						//minimun delay to show elements on screen
	this.specificLoad = null; 			//Load from a key equal a value
	this.loadMoreTimes = 0;						//Number of times it was run loadMore function
	this.effectOnLoadItems = false; 			//Effect to display when you load new items


	//End Public Variables -----------------------------------


	//Declarate private functions
	
	//Adjust the variables to be able to run the plugin, also puts the settings values in the variables plugin
	var setPluginVariables = function() {

		//Adjust Data and GET JSON, if url
		var typeData = typeof settings.data;
		var regexHTTP = /^(http:\/\/|https:\/\/)/;
		if ( (regexHTTP.exec(settings.data)) != null ) {
			_.requestAJAX(settings.data, (settings.dataMethod).toLowerCase() );
		}

	}

	//List of Errors
	var errors = [
		'Not exists parameters in function loadMore', 							//Code: 0
		'The required parameters are '+requireParameters.toString(), 			//Code: 1	
	];

	var throwError = function(code) {
		throw new Error( pluginName + ' - ' + errors[code] + '.' );
	}

	//End Private Functions -----------------------------------
	
	
	//Initialization of plugin
	var init = function(parameters) {

		if (parameters) {

			var checkedsParameters = 0;

			//checks were setted the required parameters
			for( var k in requireParameters ){
				if ( Object.keys(parameters).indexOf(requireParameters[k]) != -1 )
					checkedsParameters++;
				else
					break;
			}

			//if not exists the required parameters return error
			if( checkedsParameters != requireParameters.length )
				throwError(1);

			//checks were setted the required parameters
			for (var key in parameters) {

				if ( settings.hasOwnProperty(key) ) {

					settings[key] = parameters[key];

				}//end if hasOwnProperty

			}//end for key in parameters

		}//end if parameters
		else {
			//If not exists parameters show error
			throwError(0);
		}

		setPluginVariables();		

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

		requestAJAX: function(url, method, data, callback, sync) {

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

			ajax.send = function(url, callback, method, data, sync) {
			    var x = ajax.x();
			    x.open(method, url, sync);
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

			ajax.get = function(url, data, callback, sync) {
			    var query = [];
			    for (var key in data) {
			        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			    }
			    ajax.send(url + '?' + query.join('&'), callback, 'GET', null, sync)
			}

			ajax.post = function(url, data, callback, sync) {
			    var query = [];
			    for (var key in data) {
			        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			    }
			    ajax.send(url, callback, 'POST', query.join('&'), sync)
			}

			ajax[method](url, data, callback, sync);

		}//end RequestAJAX



	}

	//End External Funcion -----------------------------------


	//Initializate plugin
	init(parameters);

}

//Set Function loadMore with Element prototype
Element.prototype.loadMore = function(parameters) {
	return new loadMore(this, parameters);
}
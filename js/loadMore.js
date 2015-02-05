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
	var pluginDefinitions = {
		name: 'Load More',
		version: '2.1',
		//String to be replaced for key in foreach
		replacerKeys:'{{@%s%}}'
	}

	var requireParameters = [
		'config',
		'baseElement'
	];
	//Var of settings default
	var settings = {
		config: {
			object: '',								//Object or URL contain JSON
			method: 'GET',							//Requisition method to obatin the data
			requestData: null						//Form data to send with requisition method POST, only datMethod = POST, example: valid=submit&pass=123
		},		
		itemsInit: 1,								//Items to show in firt loadMore
		itemsPerLoad: 1,							//Items to display per load
		buttonToLoadMore: null,
		baseElement: null,
		scrollToLoadMore: false,
		autoScroll: false,
		minDelay: 0,
		effectOnLoadItems: false,
		specificObject: null,
		onLoadData: function(object) {
			void(0);
		},
		beforeLoadMore: function(loadMoreTimes) {
			void(0);
		},
		afterLoadMore: function(items, loadMoreTimes) {
			void(0);
		},
		lastLoadMore: function(items) {
			void(0);
		},
		clickButtonLoadMore: function() {
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

	//Events available to remove
	var availableRemoveEvents = [
		'buttonToLoadMore',
		'scrollToLoadMore'
	]; 


	var mainElement 							= elementGot,								//Element
			url 											= null,											//Object or URL contain JSON
			object 										= new Object(),							//Variable to is use in all project
			dataMethod								= 'GET',										//Requisition method to obatin the data
			requestData 							= '',												//Form data to send with requisition method POST, only dataMethod = POST
			baseElement 							= null, 										//Template Element
			itemsInit 								= 1, 												//Items to show in first loadMore
			buttonToLoadMore 					= null,											//Element with onclick = loadMore function
			remainderObject 					= null,											//Remainder Object
			originalElement 					= null,											//Element before the loadMore transformation
			lastScroll								= 0,												//Last scroll
			occurringLoadMore					= false,										//Determines whether the load more is running
			endLoadMore								= false,										//Determine whether load all object's items
			autoScrolling							= false;

	//End Private Variables -----------------------------------


	//Declarate public variables
	this.minDelay 								= 0; 							//minimun delay to show elements on screen
	this.itemsPerLoad 						= 1;							//Items to display per load
	this.loadMoreTimes 						= 0;							//Number of times it was run loadMore function
	this.scrollToLoadMore 				= false; 						//Load more when focus the end mainElement
	this.effectOnLoadItems 				= false; 						//Effect to display when you load new items
	this.autoScroll 							= false; 						//Effect to display when you load new items
	this.specificObject 					= null; 						


	//End Public Variables -----------------------------------


	//Declarate private functions
	//Complment of variableNotExitType
	var checkSameType = function(name, variable, value) {
		var type = typeof variable;

		variable = _.variableNotExitType(variable, value);
		if ( (variable === false && type != 'boolean') || ( type == 'boolean' && typeof value != 'boolean' ) ) {
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
		
		self.scrollToLoadMore 	= checkSameType('scrollToLoadMore', self.scrollToLoadMore, settings.scrollToLoadMore);

		self.autoScroll 		= checkSameType('autoScroll', self.autoScroll, settings.autoScroll);

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

		var baseElementSelector;

		//verify if element or string
		if ( !_.alternateValueComparate(typeBaseElement, ['string', 'object']) || typeBaseElement == 'object' && ( !_.isElement(settings.baseElement) ) ) {
			
			throwError(2, {
				'find': ['%p%', '%t%'],
				'replace': ['baseElement', 'string or element']
			});
		
		} else if ( typeBaseElement == 'string' ) {
			
			baseElementSelector = document.querySelector(settings.baseElement);

			if ( baseElementSelector == null ) {
				throwError(3, {
					'find': ['%s%'],
					'replace': [settings.baseElement]
				});
			}


		} else if ( typeBaseElement == 'object' ) {
			baseElementSelector = (settings.baseElement);
		}

		//remove baseElement, clone it and remove attribute id
		baseElement = baseElementSelector.cloneNode(true);
		baseElement.removeAttribute('id');
		baseElementSelector.remove();
		
		//End Adjust baseElement ------------------------
		
		
		//Adjust buttonToLoadMore
		//Not Required, but if isset buttonToLoadMore... verify
		if( settings.buttonToLoadMore != null && settings.buttonToLoadMore != undefined ) {

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


		}else {

			buttonToLoadMore = null;

		} //end settings.buttonToLoadMore != null


		

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
		} else if ( availableEffects.indexOf(settings.effectOnLoadItems) != -1 ) {
			self.effectOnLoadItems = settings.effectOnLoadItems;
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
		
		//Adjust SpecificObject
			
		
		if( settings.specificObject != null ) {

			var typeSpecificObject = typeof settings.specificObject;

			var regexpSpecificObject = /\[([^\[,\]]{1,})\]/g;

			if ( typeSpecificObject != 'string' ) {
				throwError(2, {
					'find': ['%p%', '%t%'],
					'replace': ['specificObject', 'string']
				});
			}else if ( regexpSpecificObject.exec(settings.specificObject) == null ) {
				throwError(7);
			}else {

				self.specificObject = settings.specificObject;

			}

		}
		
	
		//Set Original Element
		originalElement = mainElement.cloneNode(0);


		//Set Callbacks
		self.onLoadData 			= checkSameType('onLoadData', self.onLoadData, settings.onLoadData);

		self.beforeLoadMore 		= checkSameType('beforeLoadMore', self.beforeLoadMore, settings.beforeLoadMore);

		self.afterLoadMore 			= checkSameType('afterLoadMore', self.afterLoadMore, settings.afterLoadMore);

		self.lastLoadMore 			= checkSameType('lastLoadMore', self.lastLoadMore, settings.lastLoadMore);

		self.clickButtonLoadMore 	= checkSameType('clickButtonLoadMore', self.clickButtonLoadMore, settings.clickButtonLoadMore);

		self.alwaysEndLoadMore 		= checkSameType('alwaysEndLoadMore', self.alwaysEndLoadMore, settings.alwaysEndLoadMore);

	}

	//End setPluginVariables
	
	var autoScroll = function(){

		autoScrolling = true;

		if( self.autoScroll == false ){
			autoScrolling = false;
			return false;
		}

		var position = _.getPositionTop(mainElement.childNodes[mainElement.childNodes.length-1]);

		setTimeout(function(){

			_.scrollTo(position);

			setTimeout(function(){
				autoScrolling = false;
			}, 700);

		}, 100);


	}

	//set ScrollToLoadMore
	var setScrollToLoadMore = function() {
		window.addEventListener('scroll', function(){
			if( !self.scrollToLoadMore ) {
				return false;
			}

			var scrollTop = document.body.scrollTop;

			if( scrollTop < lastScroll ) {
				lastScroll = scrollTop;
				return false;
				
			}

			lastScroll = scrollTop;
			
			var postitionEndMainElement = _.getPositionTop(mainElement) + mainElement.getBoundingClientRect().top*-1;

			if( scrollTop >= postitionEndMainElement && occurringLoadMore == false && endLoadMore == false && autoScrolling == false ) {
				self.loadMore();
			}

		});
	}

	var functionOnClickButtonToLoadMore = function() {
		self.clickButtonLoadMore();
		self.loadMore({}, self.itemsPerLoad);
	}

	//Set On Click to button selected
	var setOnClickButton = function() {

		if ( buttonToLoadMore != null ) {

			buttonToLoadMore.addEventListener('click', functionOnClickButtonToLoadMore);


		}

	} //end SetOnClickButton
	
	
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
		"Not exists parameters in function loadMore",
		//Code: 1
		"The required parameters are "+requireParameters.join(', '),
		//Code: 2	
		"The parameter %p% must be of type %t%",
		//Code: 3
		"Can not find the element with selector equal: %s%",
		//Code: 4
		"Select the effect in the parameter effectOnLoadItems, the your value can't be equal true",
		//Code: 5
		"Not exists this effect, the available effects are: "+availableEffects.join(', '),
		//Code: 6
		"In function %f% - The %a% must be of type %t%",
		//Code: 7
		"The parameter specificObject must be build so: ' [key1][key2][key...] '",
		//Code: 8
		"Obtained object isn't two-dimensional, in this case it's mandatory to use the property specificObject"
	];

	var throwError = function(code, s) {
		var pluginName = pluginDefinitions.name + ' ' + pluginDefinitions.version;
		var mensage = ( s != undefined ) ? _.replaceArray(errors[code], s['find'], s['replace']) : errors[code];
		throw new Error( pluginName + ' - ' + mensage + '.' );
	}

	var consoleError = function(mensage) {
		var pluginName = pluginDefinitions.name + ' ' + pluginDefinitions.version;
		console.error( pluginName + ' - ' + mensage + '.' );
	}




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
					if( typeof parameters[key] == 'object' && ( !_.isElement(parameters[key]) ) && typeof settings[key] == 'object' && settings[key] != null ){
						
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
				if ( typeof r != 'object' ) {
					object = JSON.parse(r);
				}

				//verify object level
				if( !_.isBidimensionalObject(object) && self.specificObject == null ) {
					throwError(8);
				}


			}

			self.onLoadData(object);

			setOnClickButton();

			self.loadMore({}, itemsInit);

			setScrollToLoadMore();

		});


	}//end init


	var verifyBeforeLoadMore = function(specificLoad, itemsToLoad, specificObject) {
		//Initial Definitions
		
		//Checking specificObject
				
		if ( specificObject !=  undefined && specificObject !=  null && typeof specificObject != 'string' ) {
			consoleError('The argument specificObject must be type of string');
		}

		if ( specificObject == undefined || specificObject == '' || specificObject == null ) {
			specificObject = self.specificObject;
		}

		var objectInitial = (remainderObject == null) ?  object : remainderObject;

		objectInitial = ( specificObject != null ) ? _.getPartOfObject(specificObject, objectInitial) : objectInitial;

		//if not defined the specificLoad, create a empty object
		specificLoad = ( specificLoad == undefined ) ? new Object() : specificLoad;

		//if not defined the specificLoad, use the variable itemsPerLoad
		itemsToLoad = ( itemsToLoad == undefined ) ? self.itemsPerLoad : itemsToLoad

		//Verification of arguments

		if ( objectInitial.length == 0 ) {
			self.alwaysEndLoadMore();
			return false;
		}

		if ( typeof specificLoad != 'object' ) {
			throwError(6, {
				'find': ['%f%', '%a%', '%t%'],
				'replace': ['loadMore', 'first argument (specificLoad)', 'object']
			});
		}

		if ( typeof itemsToLoad != 'number' ) {
			throwError(6, {
				'find': ['%f%', '%a%', '%t%'],
				'replace': ['loadMore', 'second argument (itemsToLoad)', 'number']
			});
		}

		return {
			'objectInitial': objectInitial,
			'specificLoad': specificLoad,
			'itemsToLoad': itemsToLoad,
			'specificObject': specificObject
		}


	} //End verifyBeforeLoadMore


	var insertNewElementsInMainElement = function(html) {
		//insert new elements in main element
		mainElement.innerHTML += html;
	}

	//Effects Module
	var startEffects = function(items) {
		if ( self.effectOnLoadItems == false ) {
			return items;
		}

		//Adding predefinitions in Main Element
		mainElement.style.transition = 'height .5s';

		//Adding predefinitions
		for ( var i = 0; i < items.childNodes.length; i++ ) {
		if ( items.childNodes[i] == undefined || items.childNodes[i].style == undefined ) {
					continue;
			}
			items.childNodes[i].style.opacity = '0';
			items.childNodes[i].style.height = '0';
			items.childNodes[i].style.width = '0';
			items.childNodes[i].style.margin = '0';
			items.childNodes[i].style.padding = '0';
			items.childNodes[i].style.transition = 'height .5s, width .5s, opacity .7s, margin .5s, padding .5s';

			if ( self.effectOnLoadItems == 'zoomIn' ) {
				items.childNodes[i].style.transition = 'height .5s, width .5s, opacity .7s, margin .5s, padding .5s, transform .5s';
				items.childNodes[i].style.transform = 'scale3d(.3, .3, .3)';
			}
		}

		return items;


	} //End startEffects

	var endEffects = function(callback) {
		if( self.effectOnLoadItems == false ) {
			callback(false);
			return false;
		}

		var effects = {

			fadeIn: function() {

				for ( var i = 0; i < mainElement.childNodes.length; i++ ) {
					if ( mainElement.childNodes[i] == undefined || mainElement.childNodes[i].style == undefined ) {
						continue;
					}
					mainElement.childNodes[i].style.opacity = '';
				}

			},

			zoomIn: function() {
				for ( var i = 0; i < mainElement.childNodes.length; i++ ) {
					if ( mainElement.childNodes[i] == undefined || mainElement.childNodes[i].style == undefined ) {
						continue;
					}
					mainElement.childNodes[i].style.opacity = '';
					mainElement.childNodes[i].style.transform = '';
				}

			}



		}

		setTimeout(function(){

			for ( var i = 0; i < mainElement.childNodes.length; i++ ) {
				if ( mainElement.childNodes[i] == undefined || mainElement.childNodes[i].style == undefined ) {
					continue;
				}

				mainElement.childNodes[i].style.height = '';
				mainElement.childNodes[i].style.width = '';
				mainElement.childNodes[i].style.margin = '';
				mainElement.childNodes[i].style.padding = '';

			}

			if( typeof effects[self.effectOnLoadItems] == 'function' ){

				setTimeout(function(){
					effects[self.effectOnLoadItems]();
					mainElement.style.transition = '';
					callback(true);				
				}, 500);

			}


		}, 300);



	} //End endEffects


	//End Private Functions -----------------------------------



	//Declarate public functions


	//Main function to load more	
	this.loadMore = function(specificLoad, itemsToLoad, specificObject) {
		//Verify whether occurring a loadMore function, if yes, abort this function
		if ( occurringLoadMore ) {
			return false;
		}


		//Before LoadMore
		occurringLoadMore = true;

		self.beforeLoadMore(self.loadMoreTimes);

		//get variables after, check arguments
		var checkedArguments = verifyBeforeLoadMore(specificLoad, itemsToLoad, specificObject);

		var objectInitial = checkedArguments.objectInitial;

		var specificLoad = checkedArguments.specificLoad;

		var itemsToLoad = checkedArguments.itemsToLoad;

		var specificObject = checkedArguments.specificObject;

		if ( !checkedArguments ) {
			occurringLoadMore = false;
			return false;
		}

		//Run LoadMore
		
		var objectToFor =  new Object();

		//if exists specificLoad and it's greater than zero
		if ( _.objLength(specificLoad) > 0 ) {
			var search = _.search(objInitial, specificLoad);
			objectToFor = ( search != -1 ) ? search : objectInitial;
		}

		objectToFor = objectInitial;

		var objectsLoaded = [];

		var items = document.createElement('div');

		//for on number of items to load
		for ( var i = 0; i < itemsToLoad; i++ ) {

			var current = objectToFor[i];

			objectsLoaded.push(current);

			var item;

			var itemHTML = _.getCompleteHTML(baseElement);

			var splitReplacer = (pluginDefinitions.replacerKeys).split('%s%');

			//for in keys of each object
			for ( var k in current ) {

				//replacemen default replace for key replace
				var replacer = splitReplacer[0]+k+splitReplacer[1];

				//HTML Replace
				itemHTML = itemHTML.replace(new RegExp(replacer, 'g'), current[k]);

				//Exceptions
				//Change data-src to src
				itemHTML = itemHTML.replace(new RegExp('data-src', 'g'), 'src');

			}

			//Return the new HTML ELement
			item = _.createElementFromHTML(itemHTML);

			//Add in temporary element
			items.appendChild(item);

		}//emd for the itemsToLoad

		items = startEffects(items);
		
		//recreates the remainderObject
		remainderObject = _.severalSplice(objectInitial, objectsLoaded);

		if( specificObject != null ) {
			var regex = new RegExp(/\[([^\[,\]]{1,})\]/g);
			var keySpecificObject = regex.exec(specificObject)[1];
			var objectValue = object;

			objectValue[keySpecificObject] = remainderObject;

			remainderObject = objectValue;
		
		}

		//Add new Elements in Main Element, waiting for minDelay Time
		setTimeout(function(){
			insertNewElementsInMainElement(items.innerHTML);

			endEffects(function(){
				autoScroll();
				occurringLoadMore = false;
			});


			//After LoadMore
			//Array with all elments added this loadMore
			var itemsLoaded = [];
			for (var i = (mainElement.childNodes).length - 1; i >= (mainElement.childNodes).length - itemsToLoad; i--) {
				var currentCN = (mainElement.childNodes)[i];

				itemsLoaded.push(currentCN);

			}

			self.loadMoreTimes++;
			self.afterLoadMore(itemsLoaded, self.loadMoreTimes);

			//if it's last LoadMore, execute the callback lastLoadMore
			if( (specificObject != null) ? (_.objLength(_.getPartOfObject(specificObject, remainderObject)) == 0) : (_.objLength(remainderObject) == 0) ) {
				self.lastLoadMore(itemsLoaded);
				endLoadMore = true;
			}

		}, self.minDelay);
		


	}

	//Destroy Function mainElement turn orignalElement
	this.destroy = function() {
		mainElement.innerHTML = originalElement.innerHTML;
	}

	//Remove Events: click or scroll
	this.removeEvents = function(event) {
		
		if ( event == undefined || typeof event != 'string' || availableRemoveEvents.indexOf(event) == -1 ) {
			consoleError('Set the event to remove this event. Available events are: '+availableRemoveEvents.join(', '));
			return false;
		}

		
		if ( event == 'buttonToLoadMore' && buttonToLoadMore != null ) {
			buttonToLoadMore.removeEventListener('click', functionOnClickButtonToLoadMore);
		}

		else if ( event == 'scrollToLoadMore' ) {
			self.scrollToLoadMore = false;
		}

	}

	//Setters e Getters

	//Get Name of SpecficObject, without []
	this.getNameSpecificObject = function() {
		var regex = new RegExp(/\[([^\[,\]]{1,})\]/g);
		return regex.exec(self.specificObject)[1];
	}

	//End Setters e Getters

	//End Public Functions -----------------------------------

	//Callbacks
	this.onLoadData = function(object) {
		void(0);
	}

	this.beforeLoadMore = function(loadMoreTimes) {
		void(0);
	}

	this.afterLoadMore = function(items, loadMoreTimes) {
		void(0);
	}

	this.lastLoadMore = function(items) {
		void(0);
	}

	this.clickButtonLoadMore = function() {
		void(0);
	}

	this.alwaysEndLoadMore = function() {
		void(0);
	}





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
				variable = variable.replace(new RegExp(find[i], 'g'), replace[i]);
			}

			return variable;
		}, //end replaceArray

		objLength: function(variable) {
			if( typeof variable != 'object' || variable == null )
				return false;

			return Object.keys(variable).length;
		}, //end objLength

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

		}, //end urlObject

		//serach in a object
		search: function(a, search){

			if( !(Object.keys(search).length > 0) )
				return a;

			var r = [];

			for( var i in a ){
			
				var current = a[i];

				var n = 0;

				for( var k in search ){

					if( current[k] != search[k] )
						break;

					n++;

					if( n == (Object.keys(search).length) )
						r.push(current);
						
				}

			}

			if(r.length == 0)
				return -1;
			else
				return r;
		},//end search

		//remove item in a array with search object
		severalSplice: function(a, search){

			if( _.objLength(a) == 0 ) {
				return array;
			}

			var array = a;

			for( var k in search ){
				var index = array.indexOf(search[k]);
				if( index != -1 )
					array.splice(index, 1);

			}

			return array;

		},//end severalSplice

		getCompleteHTML: function(element) {

			var clone = element.cloneNode(true);

			var father = document.createElement('div');

			father.appendChild(clone);

			return father.innerHTML;
		},

		createElementFromHTML: function(html) {
			var father = document.createElement('div');
			father.innerHTML = html;

			return father.childNodes[0];
		},

		getPositionTop: function(element) {
			var bodyRect = document.body.getBoundingClientRect(),
			    elemRect = element.getBoundingClientRect(),
			    offset   = elemRect.top - bodyRect.top;

			    return offset;

		},
		//scroll animation
		scrollTo: function(target, duration){
			var timer, start, factor;
		
		    var offset = window.pageYOffset,
		    delta  = target - window.pageYOffset; // Y-offset difference
		    duration = 500 || 1000;              // default 1 sec animation
		    start = Date.now();                       // get start time
		    factor = 0;

		    if( timer ) {
		      clearInterval(timer); // stop any running animation
		    }

		    function step() {
		      var y;
		      factor = (Date.now() - start) / 500; // get interpolation factor
		      if( factor >= 1 ) {
		        clearInterval(timer); // stop animation
		        factor = 1;           // clip to max 1.0
		      } 
		      y = factor * delta + offset;
		      window.scrollBy(0, y - window.pageYOffset);
		    }

		    timer = setInterval(step, 10);
		    return timer; // return the interval timer, so you can clear it elsewhere
		
		},

		getPartOfObject: function(exp, object) {
			var re = /\[([^\[,\]]{1,})\]/g,
					m,
					newObject = object;

	    while ((m = re.exec(exp)) != null) {

	      var key = m[1];

	      newObject = newObject[key];
	       
	    }

	    return newObject;
		},

		isBidimensionalObject: function(object) {
			for( var key in object ) {

				for( var k in object[key]  ) {
					if( typeof object[key][k] == 'object' || typeof object[key][k] == 'array' ){
						return false;
					}
				
				}

			}

			return true;
		
		}


	} //end _ function

	//End External Funcion -----------------------------------


	//Initializate plugin
	init(parameters);

}

//Set Function loadMore with Element prototype
Element.prototype.loadMore = function(parameters) {
	return new loadMore(this, parameters);
}
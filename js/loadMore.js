/*
 * Load More - Plugin for load more after
 *
 * LCS
 *
 * Version:  1.3-dev
 *
 */


/*jslint browser:true */
'use strict';

Element.prototype.loadMore = function(param){
	if(typeof param == 'object'){
		lm.init(this, param);
		return new classLm();
	}
	else
		lm.clError('The parameters must be object.');
}

<<<<<<< HEAD
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
		minDelay: 0,
		effectOnLoadItems: false,
		onLoadData: function(object) {
=======
var lm = {
	//configurações do usario
	c: {

		//itens com *, são obrigatorios
		data: '', //onde vai ser obtido o array com os itens, pode ser um objeto ou url, caso uma url o plugin carregara-lo antes *
		itemsInit: 1, //nº itens iniciais
		itemsPerLoad: 1, //nº itens a serem adicionados sempre quando for carregar mais itens
		elementForLoad: '',//elemento para que quando for clicado carregar mais itens 
		baseElement: '', //elemento que será tomado como base para adicionar os novos itens do loadMore, "ele será apagado" *
		autoAddition: true,//default true, define se o plugin adicionará automaticamente os novos itens
		minDelay: 1000, //delay minimo para carregar o conteudo em milisegundos
		onClickForLoad: function(){ //função à ser executada com for clicado no botao: elementForLoad
>>>>>>> parent of c8b4386... 2.0
			void(0);
		},
		onLoad: function(items){ //terminar de carregar loadMore (mostrar novos itens)
			void(0);
		},
<<<<<<< HEAD
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
=======
		onCompleted: function(){ //função à ser executada quando todos os itens já foram adicionados
>>>>>>> parent of c8b4386... 2.0
			void(0);
		}

	},

<<<<<<< HEAD
<<<<<<< HEAD
	var mainElement 					= elementGot,								//Element
		url 										= null,											//Object or URL contain JSON
		object 									= new Object(),							//Variable to is use in all project
		dataMethod							= 'GET',										//Requisition method to obatin the data
		requestData 						= '',												//Form data to send with requisition method POST, only dataMethod = POST
		baseElement 						= null, 										//Template Element
		itemsInit 							= 1, 												//Items to show in first loadMore
		buttonToLoadMore 				= null,											//Element with onclick = loadMore function
		remainderObject 				= null,											//Remainder Object
		originalElement 				= null,											//Element before the loadMore transformation
		lastScroll							= 0,												//Last scroll
		occurringLoadMore				= false,										//Determines whether the load more is running
		endLoadMore							= false;										//Determine whether load all object's items
=======
	//configurações internas
	i: {
		data: '',
		attributeForKeys: 'data-loadmore',
		replacer: '{{@%s%}}',
>>>>>>> parent of c8b4386... 2.0

		getJSON: function(url, successHandler, errorHandler) {

		  var xhr = typeof XMLHttpRequest != 'undefined'
		    ? new XMLHttpRequest()
		    : new ActiveXObject('Microsoft.XMLHTTP');
		  xhr.open('get', url, true);
		  xhr.onreadystatechange = function() {
		    var status;
		    var data;
		    if (xhr.readyState == 4) { // `DONE`
		      status = xhr.status;
		      if (status == 200) {
		        data = JSON.parse(xhr.responseText);
		        successHandler && successHandler(data);
		      } else {
		        errorHandler && errorHandler(status);
		      }
		    }
		  }

		  xhr.send();

<<<<<<< HEAD
=======
	var mainElement 		= elementGot,					//Element
		url 				= null,							//Object or URL contain JSON
		object 				= new Object(),					//Variable to is use in all project
		dataMethod			= 'GET',						//Requisition method to obatin the data
		requestData 		= '',							//Form data to send with requisition method POST, only dataMethod = POST
		baseElement 		= null, 						//Template Element
		itemsInit 			= 1, 							//Items to show in firt loadMore
		buttonToLoadMore 	= null,							//Element with onclick = loadMore function
		remainderObject 	= null,							//Remainder Object
		originalElement 	= null,							//Element before the loadMore transformation
		lastScroll			= 0;							//Last scroll


	//End Private Variables -----------------------------------


>>>>>>> parent of 652acb9... Adicionado o scrollToLoadMore
	//Declarate public variables
	this.minDelay 				= 0; 							//minimun delay to show elements on screen
	this.itemsPerLoad 			= 1;							//Items to display per load
	this.loadMoreTimes 			= 0;							//Number of times it was run loadMore function
	this.scrollToLoadMore 		= false; 						//Load more when focus the end mainElement
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
		
		self.scrollToLoadMore 	= checkSameType('scrollToLoadMore', self.scrollToLoadMore, settings.scrollToLoadMore);

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
=======
		},//end getJSON


	},//end i
>>>>>>> parent of c8b4386... 2.0

	//funções simplificadas
	sF: {
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

		severalSplice: function(a, search){
			var array = a;

			for( var k in search ){
				var index = array.indexOf(search[k]);
				if( index != -1 )
					array.splice(index, 1);

			}

<<<<<<< HEAD
		}
		
		//End Adjust postData----------------------------------
		
	
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
	
	var getObjectData = function(callback) {
		
		if ( _.objLength(object) > 0 ) {
			callback();
			return true;
		
		} else {
			_.requestAJAX(url, dataMethod.toLowerCase(), requestData, function(r){
				callback(r);
			});
		}
=======
			return array;
>>>>>>> parent of c8b4386... 2.0

		}//end severalSplice

	},//end sF

<<<<<<< HEAD
	//set ScrollToLoadMore
	var setScrollToLoadMore = function() {
		window.addEventListener('scroll', function(){
			if( !self.scrollToLoadMore ) {
				return false;
			}

			var scrollTop = window.scrollTop;

			if( scrollTop < lastScroll ) {
				lastScroll = scrollTop;
				return false;
				
			}

			lastScroll = scrollTop;
			
			var postitionEndMainElement = mainElement.offsetTop + mainElement.offsetHeight;

			console.log(postitionEndMainElement);

		});
	}

	//Set On Click to button selected
	var setOnClickButton = function() {
=======
	init: function(el, params){
>>>>>>> parent of c8b4386... 2.0

		lm.c.el = el;

<<<<<<< HEAD
			buttonLoadMore.addEventListener('click', function(){
				self.clickButtonLoadMore();
				self.loadMore({}, self.itemsPerLoad);
=======
		if(params) {
>>>>>>> parent of c8b4386... 2.0
			

			for(var key in params) {
				if(lm.c.hasOwnProperty(key)) {

					lm.c[key] = params[key];

				}
			}

<<<<<<< HEAD
			self.onLoadData(object);

			setOnClickButton();

			self.loadMore({}, itemsInit);

			setScrollToLoadMore();

		});


	}//end init

=======
		}//end for
>>>>>>> parent of c8b4386... 2.0

		lm.adjustmentsInVar();
		lm.createBaseElement();

		if( lm.c.data == 'object' ){
			lm.i.data = lm.c.data;
			lm.initConfigs();
		}
		else
			lm.getArray();


	},//end init

	//faz alterações na variaveis e set erros
	adjustmentsInVar: function(){
		//ajuste no elementForLoad
		if( typeof (lm.c.elementForLoad) == 'string' && (lm.c.elementForLoad) != ''){
			(lm.c.elementForLoad) = document.querySelector(lm.c.elementForLoad);
			if(!lm.c.elementForLoad)
				lm.clError("The element setted to 'elementForLoad' doesn't exist.");
		}

		//ajuste minDelay
		if( typeof (lm.c.minDelay) != 'number' )
			lm.clError('The minDelay property must be of number type.');


		//ajuste em baseElement
		if( typeof (lm.c.baseElement) != 'string' && typeof (lm.c.baseElement) != 'object' )
			if(!lm.c.baseElement)
				lm.clError("The element to 'baseElement' wasn't setted.");

		if( typeof (lm.c.baseElement) == 'string'){
			(lm.c.baseElement) = document.querySelector(lm.c.baseElement);
			if(!lm.c.baseElement)
				lm.clError("The element setted to 'baseElement' doesn't exist.");
		}

		//itemsInit e itemsPerLoad
		if( typeof (lm.c.itemsInit) != 'number' )
			lm.clError('The itemsInit property must be of number type.');

		if( typeof (lm.c.itemsPerLoad) != 'number' )
			lm.clError('The itemsPerLoad property must be of number type.');

		//ajuste no data
		if( typeof (lm.c.data) != 'string' && typeof (lm.c.data) != 'object' )
			lm.clError('The data property must be of number type or string type(url).');

		if( typeof (lm.c.data) == 'string' ){

			if( (lm.c.data).search('http') == -1 ){
				var url = document.location;
				(lm.c.data) = url+'/'+(lm.c.data);

<<<<<<< HEAD
	var endEffects = function() {
		if( self.effectOnLoadItems == false ) {
			return false;
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

				//Effect FadeIn
				
				if( self.effectOnLoadItems == 'fadeIn' ) {

					setTimeout(function(){
						for ( var i = 0; i < mainElement.childNodes.length; i++ ) {
							if ( mainElement.childNodes[i] == undefined || mainElement.childNodes[i].style == undefined ) {
								continue;
							}
							mainElement.childNodes[i].style.opacity = '';
						}

						mainElement.style.transition = '';

					}, 500);

					//End FadeIn
				} else if ( self.effectOnLoadItems == 'zoomIn' ) {
					//Effect zoomIn
					
					setTimeout(function(){
						for ( var i = 0; i < mainElement.childNodes.length; i++ ) {
							if ( mainElement.childNodes[i] == undefined || mainElement.childNodes[i].style == undefined ) {
								continue;
							}
							mainElement.childNodes[i].style.opacity = '';
							mainElement.childNodes[i].style.transform = '';
						}

						mainElement.style.transition = '';

					}, 500);


				} 	//End zoomIn
=======
			}
			
		}

	}, //end adjustmentsInVar
>>>>>>> parent of c8b4386... 2.0

	initConfigs:  function(){
		lm.loadMore({}, lm.c.itemsInit);
		lm.insertOns();
	},

	getArray: function(){

<<<<<<< HEAD

	} //End endEffects


	//End Private Functions -----------------------------------



	//Declarate public functions


	//Main function to load more	
	this.loadMore = function(specificLoad, itemsToLoad) {

		//Before LoadMore
		self.beforeLoadMore(self.loadMoreTimes);

		//get variables after, check arguments
		var checkedArguments = verifyBeforeLoadMore(specificLoad, itemsToLoad);

		var objectInitial = checkedArguments.objectInitial;

		var specificLoad = checkedArguments.specificLoad;

		var itemsToLoad = checkedArguments.itemsToLoad;

		if( !checkedArguments ) {
			return false;
=======
		if( typeof (lm.c.data) == 'object' ){
			lm.i.data = lm.c.data;
			lm.initConfigs();
			return true;
>>>>>>> parent of c8b4386... 2.0
		}

		lm.i.getJSON(lm.c.data, function(data){
			lm.i.data = data;
			lm.initConfigs();
		}, function(status){
			lm.clError("Couldn't get the data of the file: "+lm.c.data);
		});
		
	}, //end getArray


	createBaseElement: function(){
		//clona o elemento base
		(lm.i.baseElement) = (lm.c.baseElement).cloneNode(true);

		//removendo id
		(lm.i.baseElement).removeAttribute('id');

		//apagar o elemento base
		(lm.c.baseElement).remove();


	}, //end createBaseElement

<<<<<<< HEAD

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
			if( _.objLength(remainderObject) == 0 ) {
				self.lastLoadMore(itemsLoaded);
			}
=======
	insertNewValuesOnHTML: function(v, objLength){
		//inserir no elemento pricipal todos os novos elementos
		(lm.c.el).innerHTML += v;
>>>>>>> parent of c8b4386... 2.0

		//se está mostrando todos items
		if( this.i.remainderData.length == 0 )
			lm.c.onCompleted();
	},

<<<<<<< HEAD

	}

	//Destroy Function mainElement turn orignalElement
	this.destroy = function() {
		mainElement.innerHTML = originalElement.innerHTML;
	}

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


=======
	insertOns: function(){

		if(!lm.c.elementForLoad || lm.c.elementForLoad == '')
			return false;

		(lm.c.elementForLoad).onclick = function(){
			lm.loadMore();
			lm.c.onClickForLoad();
		}

	},
>>>>>>> parent of c8b4386... 2.0

	loadMore: function(search, itemsToLoad, minDelay){

		var objInitial = (this.i.remainderData == undefined) ? this.i.data : this.i.remainderData;

		//html do elemento que vai ser inserido no final do for
		var items = document.createElement('div');

		//usando valores setados nas configurações do plugin
		if( objInitial == undefined || typeof objInitial != 'object'){
			return false;
		}
		if( objInitial.length == 0 )
			return false;

		if( !(search != undefined && typeof search == 'object') )
			search = {};

		if( !(itemsToLoad != undefined && typeof itemsToLoad == 'number') )
			itemsToLoad = lm.c.itemsPerLoad;

		if( !(minDelay != undefined && typeof minDelay == 'number') )
			minDelay = lm.c.minDelay;

		var obj;
		//se existir o search, vai ser feito uma procura para só colocar objetos com determinados value em suas keys
		if( Object.keys(search).length > 0 ){
			var newObj = lm.sF.search(objInitial, search);
			obj = (newObj != -1) ? newObj : objInitial;
		}else
			obj = objInitial;

		var objUsed = [];

		//i para index e m para numero de elementos por loadmore
		for( var i = 0; i < itemsToLoad; i++ ){

			var current = obj[i];

			//adicionando em objUsed
			objUsed.push(current);

			//split do replacer
			var spReplacer = (this.i.replacer).split('%s%');

			var item = (lm.i.baseElement).cloneNode(true);

			//elemento principal html
			var itemHTML = item.innerHTML;

			//attributes do elemento principal
			var attributes = item.attributes;

			//for das keys dentro de cada value do array
			for( var k in current ){
				
				//replacer usando o nome do objeto
				var replacer = spReplacer[0]+k+spReplacer[1];

				itemHTML = itemHTML.replace(new RegExp(replacer, 'g'), current[k]);

				//for dos attributes
					
					for( var a = 0; a < attributes.length; a++){

						var attribute = attributes[a].nodeName;
						var value = attributes[a].value;

						if( value.search(replacer) != -1 ){
							item.setAttribute(attribute, current[k]);
						}

					}
					
			}//end for das keys

			//alterando o html do item
			item.innerHTML = itemHTML;

			items.appendChild(item);

		}//for dos itemsInit

		this.i.remainderData = lm.sF.severalSplice(objInitial, objUsed);

		//delay min para inserir
		setTimeout(function(){
			if( lm.c.autoAddition == true )
				lm.insertNewValuesOnHTML(items.innerHTML, obj.length);

			//Retorna o(s) elemento(s) obitidos pelo loadMore
			var itemsOnLoad = [];
			for (var i = ((lm.c.el).childNodes).length - 1; i >= ((lm.c.el).childNodes).length - itemsToLoad; i--) {
				var currentCN = ((lm.c.el).childNodes)[i];

				itemsOnLoad.push(currentCN);

			};
			var returnOnLoad = itemsOnLoad;

			lm.c.onLoad(returnOnLoad);
		}, minDelay);

<<<<<<< HEAD
			return father.childNodes[0];
		}
=======
	},
>>>>>>> parent of c8b4386... 2.0

	clError: function(msg){
		throw new Error('loadMore - '+msg);
	}

}//end lm

//criando classe Lm, para ser possível usar a função loadMore, fora do botão
function classLm(){
	this.i = lm.i;
}

classLm.prototype.loadMore = function(search, itemsToLoad, minDelay){

	if( typeof this.i.data != 'object' ){
		
		this.i.getJSON(this.i.data, function(data){
			this.i.data = data;
			lm.loadMore(search, itemsToLoad, minDelay);
		},function(){
			console.error("loadMore - Couldn't get the data of the file: "+this.i.data);
		});

	}else
		lm.loadMore(search, itemsToLoad, minDelay);

}
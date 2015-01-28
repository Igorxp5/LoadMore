/*
 * Load More - Plugin for load more after
 *
 * LCS
 *
 * Version:  1.1-dev
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

var lm = {
	//configurações do usario
	c: {

		//itens com *, são obrigatorios
		data: '', //onde vai ser obtido o array com os itens, pode ser um objeto ou url, caso uma url o plugin carregara-lo antes *
		itemsInit: 1, //nº itens iniciais
		itemsPerLoad: 1, //nº itens a serem adicionados sempre quando for carregar mais itens
		elementForLoad: '',//elemento para que quando for clicado carregar mais itens 
		baseElement: '', //elemento que será tomado como base para adicionar os novos itens do loadMore, "ele será apagado" *
		minDelay: 1000, //delay minimo para carregar o conteudo em milisegundos
		onClickForLoad: function(){ //função à ser executada com for clicado no botao: elementForLoad
			void(0);
		},
		onLoad: function(){ //terminar de carregar loadMore (mostrar novos itens)
			void(0);
		},
		onCompleted: function(){ //função à ser executada quando todos os itens já foram adicionados
			void(0);
		}

	},

	//configurações internas
	i: {
		data: '',
		attributeForKeys: 'data-loadmore',
		replacer: '{{@%s%}}',

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

		},//end getJSON


	},//end i

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

			return array;

		}//end severalSplice

	},//end sF

	init: function(el, params){

		lm.c.el = el;

		if(params) {
			

			for(var key in params) {
				if(lm.c.hasOwnProperty(key)) {

					lm.c[key] = params[key];

				}
			}//end for

		}//end if params

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

		if( typeof (lm.c.data) != 'object' ){
			
			if( (lm.c.data).search('http') == -1 ){
				var url = document.location;
				(lm.c.data) = url+'/'+(lm.c.data);

			}
			
		}


	}, //end adjustmentsInVar

	initConfigs:  function(){
		lm.loadMore({}, lm.c.itemsInit);
		lm.insertOns();
	},

	getArray: function(){

		if( typeof (lm.c.data) == 'object' ){
			lm.i.data = lm.c.data;
			lm.initConfigs();
			return true;
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

	insertNewValuesOnHTML: function(v, objLength){
		//inserir no elemento pricipal todos os novos elementos
		(lm.c.el).innerHTML += v;

		//se está mostrando todos items
		if( this.i.remainderData.length == 0 )
			lm.c.onCompleted();
	},

	insertOns: function(){

		if(!lm.c.elementForLoad || lm.c.elementForLoad == '')
			return false;

		(lm.c.elementForLoad).onclick = function(){
			lm.loadMore();
			lm.c.onClickForLoad();
		}

	},

	loadMore: function(search, itemsToLoad, localInput, minDelay){

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

		if( !(localInput != undefined && typeof localInput == 'object') )
			localInput = lm.c.localInput;

		if( !(minDelay != undefined && typeof minDelay == 'number') )
			minDelay = lm.c.minDelay;

		var obj;
		//se existir o search, vai ser feito uma procura para só colocar objetos com determinados value em suas keys
		if( Object.keys(search).length > 0 ){
			var newObj = lm.sF.search(objInitial, search);
			obj = (newObj != -1) ? newObj : {};
		}else
			obj = objInitial;

		//se o objeto estiver vazio cancelar a função
		if( Object.keys(obj).length == 0 )
			return false;

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
			lm.insertNewValuesOnHTML(items.innerHTML, obj.length);
			lm.c.onLoad();
		}, minDelay);

	},

	clError: function(msg){
		throw new Error('loadMore - '+msg);
	}

}//end lm

//criando classe Lm, para ser possível usar a função loadMore, fora do botão
function classLm(){
	this.i = lm.i;
}

classLm.prototype.loadMore = function(search, itemsToLoad, localInput, minDelay){

	if( typeof this.i.data != 'object' ){
		
		this.i.getJSON(this.i.data, function(data){
			this.i.data = data;
			lm.loadMore(search, itemsToLoad, localInput, minDelay);
		},function(){
			console.error("loadMore - Couldn't get the data of the file: "+this.i.data);
		});

	}else
		lm.loadMore(search, itemsToLoad, localInput, minDelay);

}

# Load More 2.0

O **Load More** é um plugin que permite o desenvolvimento de um sistema em que o número de dados há ser carregados é muito grande, sendo necessário o uso de um botão para **"carregar mais"**. 

Com ele é possível criar estruturas HTML e usar variaveis para serem substituídas por algo que esteja dentro dados que foram carregados.

*O plugin não necessita do Jquery.*

## Como Usar

Para usá-lo obrigatoriamente é necessário:
### HTML

É necessário uma estratura HTML qualquer, exemplo:
```html
<!--Base Element-->
<div id="noticias">
		<div id="baseElement">
			<h1>{{@title}}</h1>
			<p>{{@description}}</p>
			<article>{{@news}}</article>
			<span>{{@date}}</span>
		</div>
</div>
```
### JS
```js
var news = document.querySelector('#noticias');

var loadMore = news.loadMore({
            config: {
                object: 'json/data.json' //local onde estão os dados
            },
			baseElement: '#baseElement' //elemento base
		});
```

### CSS

```css
#baseElement {
	display: none;
}
```

###JSON
```json
//Exemplo
[
    {
		"title"			: "Noticia 1",
		"description"	: "Descrição da notícia 1",
		"date"			: "19 de Janeiro de 2015",
		"news" 			: "Lorem ipsum dolor.",
		"author"		: "Igor Fernandes"
	},

	{
		"title"			: "Noticia 2",
		"description"	: "Descrição da notícia 2",
		"date"			: "19 de Janeiro de 2015",
		"news" 			: "Lorem ipsum dolor.",
		"author"		: "Igor Fernandes"
	}

]
```

O **Base Element** é a estrutura básica para substituir os valores pelos seus correspondentes, ou seja, no exemplo acima *A 1ª notícia*, o valor de ``{{@title}}`` será substitudo por **Notícia 1** . Assim também com os demais elementos.

As variáveis ``{{@%s%}}`` pode ser usados no meio do **texto HTML** ou em **atributos de TAG**.

## Propriedades
As propriedades com * são obrigatórios.


##config

###object
```
config: {
    object: ''
}
```

**URL** onde está o **JSON**, pode ser o caminho direto de um arquivo local ou URL externa. Portanto que retorne um JSON...

**Default:** ``object: ''``, é obrigatório

###method
```
config: {
    method: 'GET'
}
```

Qual o método vai ser usado para obter o JSON, métodos **GET** ou **POST**.

**Default:** ``method: 'GET'``

###requestData
```
config: {
    requestData: {}
}
```

Caso seja necessário o envio de dados (validção ou qualquer outra coisa), colocar em um objeto.

**Default:** ``requestData: '{}'``


##itemsInit
O Load More vai criar automaticamente um elemento de ínicio, você pode alterar este valor.

**Default:** ``itemsInit: 1``


##itemsPerLoad
Depois do primeiro será necessário o chamento da função ``loadMore`` para continuar adicionando elementos. Ao alterar este valor toda vez que a função ``loadMore`` for chamada ele vai adicionar o número de itens que estiver neste campo.

**Default:** ``itemsPerLoad: 1``


##buttonToLoadMore
Esta propriedade pode ser uma ``string`` ou ``element DOM``, o plugin adicionará um evento de **click** no elemento, para executar a função ``loadMore``.

**Default:** ``elementForLoad: ''``


##baseElement*
Esta propriedade pode ser uma ``string`` ou ``element DOM``, o plugin usará o elemento como estrutura para adicionar os valores do **data **. Para chamar a variável do **data** no HTML use a expressão: ``{{@%s%}}``, onde o **%s%** é o nome do campo para qual desejas substituir.

**Default:** ``baseElement: ''``


##minDelay
Valor númerico em ``ms``, definindo o tempo mínimo entre o chamar da função ``loadMore`` e o mostrar os itens novos.

**Default:** ``minDelay: 1000``

##effectOnLoadItems
Adicionar efeitos quando for mostrar um novo item. Efeitos disponíveis: **fadeIn**, **zoomIn**. Caso sem efeito: **false**.

**Default:** ``effectOnLoadItems: false``


##onLoadData
Propriedade do tipo ``function``, esta função será chamada quando o **object** for carregado. Ela retorna o objeto obitdo.

**Default:** 
```js
function(object){ 
	void(0);
}
```


##beforeLoadMore
Propriedade do tipo ``function``, esta função será chamada antes de mostrar os novos itens na tela, Ela retorna **loadMoreTimes**, número de vezes chamados a função **loadMore** -1. 

**Default:** 
```js
function(loadMoreTimes){ 
	void(0);
}
```


##afterLoadMore
Propriedade do tipo ``function``, esta função será chamada antes de mostrar os novos itens na tela. Ela retorna os novos elementos adicionados em um *array*, e **loadMoreTimes**, número de vezes chamados a função **loadMore**.

**Default:** 
```js
function(items, loadMoreTimes){ 
	void(0);
}
```


##lastLoadMore
Propriedade do tipo ``function``, esta função será chamada depois de executar o último **loadMore**. Ela retorna os novos elementos adicionados em um *array*.

**Default:** 
```js
function(items){ 
	void(0);
}
```

##clickButtonLoadMore
Propriedade do tipo ``function``, esta função será chamada antes do **loadMore** quando clicado no botão setado em ``buttonToLoadMore``.

**Default:** 
```js
function(){ 
	void(0);
}
```

##alwaysEndLoadMore
Propriedade do tipo ``function``, esta função será chamada sempre no final de todos os **loadMore**, ou tentar executar a função **loadMore**.

**Default:** 
```js
function(){ 
	void(0);
}
```

#A Classe
O loadMore retorna um objeto, permitindo a mudança de algumas propriedades ou uso de funçoes mais dinamicamente.

Objeto exemplo:
```js
    loadMore: {
        afterLoadMore: function(items, loadMoreTimes){},
        alwaysEndLoadMore: function(){},
        beforeLoadMore: function(items){},
        clickButtonLoadMore: function(){},
        destroy: function(){}, //remove todos os itens, zerando o elemento principal
        effectOnLoadItems: false,
        itemsPerLoad: 1,
        lastLoadMore: function(specificKeys, itemsToLoad){}, //executar função loadMore, sem a necessidade de esperar um click do botão setado em buttonToLoadMore
        loadMoreTimes: 1, //número de vezes em que foi chamado o loadMore
        minDelay: 0,
        onLoadData: function(object){}
    }
```

Author
----
Igor Fernandes


License
----
LCS

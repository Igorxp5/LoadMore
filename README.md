# Load More 1.1

O **Load More** é um plugin que permite o desenvolvimento de um sistema em que o número de dados há ser carregados é muito grande, sendo necessário o uso de um botão para **"carregar mais"**. 

Com ele é possível criar estruturas HTML e usar variaveis para serem substituídas por algo que esteja dentro dados que foram carregados.

*O plugin não necessita do Jquery.*

## Como Usar

Para usá-lo obrigatoriamente é necessário:
### HTML
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
			data: 'json/data.json', //local onde está os dados
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


##data*
**URL** onde está o **JSON**, pode ser o caminho direto de um arquivo local ou URL externa. Portanto que retorne um JSON...

**Default:** ``data: ''``


##itemsInit
O Load More vai criar automaticamente um elemento de ínicio, você pode alterar este valor.

**Default:** ``itemsInit: 1``


##itemsPerLoad
Depois do primeiro será necessário o chamento da função ``loadMore`` para continuar adicionando elementos. Ao alterar este valor toda vez que a função ``loadMore`` for chamada ele vai adicionar o número de itens que estiver neste campo.

**Default:** ``itemsPerLoad: 1``


##elementForLoad
Esta propriedade pode ser uma ``string`` ou ``element DOM``, o plugin adicionará um evento de **click** no elemento, para executar a função ``loadMore``.

**Default:** ``elementForLoad: ''``


##baseElement*
Esta propriedade pode ser uma ``string`` ou ``element DOM``, o plugin usará o elemento como estrutura para adicionar os valores do **data **. Para chamar a variável do **data** no HTML use a expressão: ``{{@%s%}}``, onde o **%s%** é o nome do campo para qual desejas substituir.

**Default:** ``baseElement: ''``


##minDelay
Valor númerico em ``ms``, definindo o tempo mínimo entre o chamar da função ``loadMore`` e o mostrar os itens novos.

**Default:** ``minDelay: 1000``



##onClickForLoad
Propriedade do tipo ``function``, esta função será chamada se o evento click do **elementForLoad** for chamado.

**Default:** 
```js
function(){ 
	void(0);
}
```


##onLoad
Propriedade do tipo ``function``, esta função será chamada assim que a função ``loadMore`` for concluída.

**Default:** 
```js
function(){ 
	void(0);
}
```


##onCompleted
Propriedade do tipo ``function``, esta função será chamada assim que a função ``loadMore`` for executada pela última vez, ou seja quando não possuir mais elementos à ser mostrados.

**Default:** 
```js
function(){ 
	void(0);
}
```


Author
----
Igor Fernandes


License
----
LCS

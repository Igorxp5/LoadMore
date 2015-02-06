# Load More 2.1

O Load More é um plugin que permite simplificar vários conteúdos, usando **JSON** e um botão para carregar mais.

Com ele é possível criar estruturas HTML e usar variáveis para serem substituídas por algo que esteja dentro dados que foram carregados.

*O plugin não necessita do **Jquery**. E não pode ser chamado usando um **elemento Jquery.***

##Novidades da verão 2.1
```

```

## Como Usar

Para o seu uso é necessário as seguintes linhade comando.

### HTML

É necessário uma estrutura HTML, onde conterá as variáveis que seram substituídas posteriormente.

**Exemplo:**

```html
<!--Base Element-->
<div id="noticias">
    <div id="baseElement">
      <h1>{{@title}}</h1>
      <img data-src="{{@img}}"/>
      <p>{{@description}}</p>
      <article>{{@news}}</article>
      <span>{{@date}}</span>
    </div>
</div>
```
**Obs.:** Para usar o atributo **src** nos elementos, ao invés de usá-lo, use **data-src**, pois ao usar o atributo src, o navegador vai escrever erros 404 no console. dizendo que não existe o caminho.

*É possível chamar a variável mais de uma vez.*

### JS

No javascript, para chamar na sua forma mais básica use:

```js
//Obtem o elemento
var news = document.querySelector('#noticias');

var content = news.loadMore({
    config: {
        object: 'json/data.json' //local onde estão os dados em JSON
    },
  baseElement: '#baseElement' //elemento de estrutra base
});
```

### CSS

```css
#baseElement {
  display: none;
}
```

### JSON
```json
//Exemplo
[
    {
    "title"     : "Noticia 1",
    "description" : "Descrição da notícia 1",
    "img"           : "img/1.jpg",
    "date"      : "19 de Janeiro de 2015",
    "news"      : "Lorem ipsum dolor.",
    "author"    : "Igor Fernandes"
  },

  {
    "title"     : "Noticia 2",
    "description" : "Descrição da notícia 2",
    "img"           : "img/2.jpg",
    "date"      : "19 de Janeiro de 2015",
    "news"      : "Lorem ipsum dolor.",
    "author"    : "Igor Fernandes"
  }

]
```

O que é plugin fará é pegar o *JSON* e substuir suas chaves com as variáveis na estrutura HTML escolhida em ``Base Element``.

## Propriedades

*As propriades que tiverem em possuírem um * * são obrigatórias

### Config

Objeto que conterá todos as propriedades para obter o JSON seja externo ou interno. 

Propriedades: **object**, **method**, **requestData**.

#### object *
Caminho (URL) onde está localizado o **JSON**. O máximo de dimensões que JSON deve possuir é **3**.

**Tipo:** ``string``.

**Default:**
```js
config: {
    object: '' //este propriedade é obrigatório para o uso do Load More
}
```

#### method
Método de requisição do JSON. Podendo ser: **GET** ou **POST**.

**Tipo:** ``string``.

**Default:**
```js
config: {
    method: 'GET'
}
```

#### requestData
Se for necessário o envio de algum parâmetro use está propriedade.

**Tipo:** ``object``.

**Default:**
```js
config: {
    requestData: {}
}
```

### itemsInit
Quantidade de itens que o Load More vai começar carregando.

**Tipo:** ``natural number``.

**Default:**
```js
itemsInit: 1
```

### itemsPerLoad
Quantidade de itens à ser carregado, quando a função ``loadMore`` for chamada.

**Tipo:** ``natural number``.

**Default:**
```js
itemsPerLoad: 1
```

### baseElement*
Elemento estrutural para para substituíção das variáveis.

**Tipo:** ``string selector``, ou ``element``.

**Default:**
```js
baseElement: '' //Está propriedade é obrigatória para o uso do Load More
```


### buttonToLoadMore
Elemento que receberá a função ``loadMore``, quando for clicado.

**Tipo:** ``string selector``, ou ``element``.

**Default:**
```js
buttonToLoadMore: 1
```

### scrollToLoadMore
Opção de chamar a função ``loadMore``, ao descer scroll até o final do elemento prinpal.

**Tipo:** ``boolean``.

**Default:**
```js
scrollToLoadMore: false
```

### effectOnLoadItems
Adicionar efeitos para quando for ser inserido os novos itens carregados pelo ``loadMore``. Caso não usar efeitos, use ``false``.

**Efeitos:** *fadeIn*, *zoomIn*.

**Tipo:** ``string``, ``boolean``.

**Default:**
```js
effectOnLoadItems: false
```

### specificObject
Caso o **JSON**, seja divido de forma diferente exemplo:

```json
{
    "corporativo": [
    {
      "title": "Corporativo 1",
      "desc": "Descrção 1",
      "img": "img/1.png"
    },

    {
      "title": "Corporativo 2",
      "desc": "Descrção 1",
      "img": "img/2.jpg"
    },

  ],

  "shows": [
    {
      "title": "Shows 1",
      "desc": "Descrção 3",
      "img": "img/3.png"
    },

    {
      "title": "Shows 2",
      "desc": "Descrção 4",
      "img": "img/4.jpg"
    },
  ]
}
```

É possível usar somente por exemplo o array **corporativo**, usando: ``[corporativo]``.

**Tipo:** ``string``.

**Default:**
```js
specificObject: null
```


### minDelay
Tempo mínimo para mostrar novos itens.

**Tipo:** ``miliseconds``.

**Default:**
```js
minDelay: 0
```


### autoScroll
Ao terminar a função ``loadMore``, descer automaticamente o scroll para onde estão os elementos recém carregados. 

**Tipo:** ``boolean``.

**Default:**
```js
autoScroll: false
```


### waitLoadMore
Esperar o término das transições antes de ser permitido ser chamada a função ``loadMore`` novamente.

**Tipo:** ``boolean``.

**Default:**
```js
waitLoadMore: true
```

## Callbacks

### onLoadData
Este callback será chamado quando terminar a requisição do **JSON**. Ele retorna o objeto obitido, como parâmetro.

**Tipo:** ``function``.

**Default:**
```js
onLoadData: function(object) {
    void(0);
}
```


### beforeLoadMore
Este callback será chamada antes de mostrar os novos itens na tela. Ele retorna o número de vezes chamado a função ``loadMore`` **-1**.

**Tipo:** ``function``.

**Default:**
```js
beforeLoadMore: function(loadMoreTimes) {
    void(0);
}
```

### afterLoadMore
Este callback será chamada depois de mostrar os novos itens na tela. Ele retorna o número de vezes chamado a função ``loadMore``, e os itens adicioandos.

**Tipo:** ``function``.

**Default:**
```js
afterLoadMore: function(items, loadMoreTimes) {
    void(0);
}
```

### lastLoadMore
Este callback será chamada depois de mostrar os últimos itens na tela. Ela retorna os itens adicionados.

**Tipo:** ``function``.

**Default:**
```js
lastLoadMore: function(items) {
    void(0);
}
```


### clickButtonLoadMore
Esta callback será chamado quando o botão declarado em ``buttonToLoadMore``.

**Tipo:** ``function``.

**Default:**
```js
clickButtonLoadMore: function() {
    void(0);
}
```

### alwaysEndLoadMore
Este callback será chamado sempre quando não houver mais itens para carregar.

**Tipo:** ``function``.

**Default:**
```js
alwaysEndLoadMore: function() {
    void(0);
}
```


## Classe

Ao chamar o plugin ``loadMore``, será retornado uma classe, permitindo a dinamicidade do mesmo. Ele possui funções que podem melhorar o seu uso.

*É possível obtê-los ou alterar-los.*

### Proprieades
* autoScroll
* effectOnLoadItems
* itemsPerLoad
* loadMoreTimes
* minDelay
* scrollToLoadMore
* specificObject
* waitLoadMore

### Funções

#### afterLoadMore
Alterar ou chamar o callback **afterLoadMore**.

#### alwaysEndLoadMore
Alterar ou chamar o callback **alwaysEndLoadMore**.

#### beforeLoadMore
Alterar ou chamar o callback **beforeLoadMore**.

#### clickButtonLoadMore
Alterar ou chamar o callback **clickButtonLoadMore**.

#### lastLoadMore
Alterar ou chamar o callback **lastLoadMore**.

#### onLoadData
Alterar ou chamar o callback **onLoadData**.

#### destroy
Todos os itens adicionados será apagado e será colocado de volta o ``baseElement``.

#### getNameSpecificObject
Obtém o valor do ``specificObject``, sem os ``[]``.

#### loadMore
Função principal do plugin, ele responsável por carregar e mostrar novos itens na tela.

##### Parâmetros:
* specificLoad
* itemsToLoad
* specificObject

###### specificLoad: 
Carrega itens com uma chave em comum, exemplo:

````js
content.loadMore({author: 'Igor Fernandes'});
````


###### itemsToLoad: 
Número de itens para carregar, ao ser declarado, este parâmetro ignorará a propriedade ``itemsToLoad`` declarada antes. Exemplo:
```js
content.loadMore(null, 3);
```

###### specificObject: 
Especifica antes de carregar mais itens, o valor de ``specificObject``, ao ser declarado, este parâmetro ignorará a propriedade ``specificObject`` declarada antes. Exemplo:
```js
content.loadMore(null, null, '[corporativo]');
```

#### restart
Reinicia o LoadMore, fazendo com que o próximo item a ser carregado, seja o primeiro do objeto novamente, e seguirá a partir daí. 

*Ou seja apagar apaga da memória os itens já carregados.*

----

Author
----
Igor Fernandes

Version
----
2.1

License
----
LCS


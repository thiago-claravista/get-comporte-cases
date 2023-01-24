## **Lista de conteúdo**

- [Introdução](#introdução)
- [Autenticação](#autenticação)
- [Formatos de Data](#formatos-de-data)
- [Consultas](#consultas)
  - [Consultando CASOS](#consultando-casos)
  - [Consultando CASOS únicos](#consultando-casos-únicos)
  - [Consultando comentários do CASO](#consultando-comentários-do-caso)
  - [Consultando ANEXOS](#consultando-anexos)
  - [Obtendo o conteúdo dos ANEXOS](#obtendo-o-conteúdo-dos-anexos)
  - [Consultando DOCUMENTOS](#consultando-documentos)
  - [Obtendo o conteúdo dos DOCUMENTOS](#obtendo-o-conteúdo-dos-documentos)

## **Introdução**

API de listagem e consultar os casos _(Cases)_, anexos _(Attachments)_ e documentos _(Documents)_ exportados da plataforma _Salesforce Sales_ da Comporte e consumidos em um banco de dados MySQL.
<br><br>

## **Autenticação**

Para realizar as requisições nos endpoints da API, é necessário se autenticar passando no cabeçalho da requisição um token fixo precedido da palavra 'Bearer'. O token é alcançado através da codificação da palavra passe 'Claravista@2022' utilizando `base64`.<br>
É recomendável utilizar o método `btoa()`, nativo do JavaScript, que codifica `utf-16` para `base64`:

```javascript
btoa("exemplo");
// 'ZXhlbXBsbw=='
```

No cabeçalho da requisição teríamos algo parecido com:

```javascript
{
  Authorization: `Bearer ${btoa("Claravista@2020")}`;
}
```

<br><br>

## **Formatos de Data**

As datas são validadas na aplicação utilizando a expressão regular `/^(\d{2,4}-?){3}(\s(\d{2}:?){3})?$/`. Sendo assim, as datas aceitas devem conter o formato ano, mês e dia (`yyyy-mm-dd`) podendo ou não conter horários (`yyyy-mm-dd hh:mm:ss`). <br>
Exemplos de algumas datas válidas e inválidas:

![Valid](https://img.shields.io/badge/-VALID-success)

- 2020-04-01
- 2020-08-01 14:00:00

![Invalid](https://img.shields.io/badge/-INVALID-critical)

- 01-01-2022
- 01-01-2022 00:00
- 01/01/2022
- 01/01/2022 00:00
- 2022/01/01
  <br><br>

## **Consultas**

Para a obtenção da lista de casos armazenados na base de dados, foram disponibilizadas as rotas **_`/cases/:id`_** e **_`/cases`_** com a possibilidade de adição de filtros através de _query params_ na requisição.

### Consultando CASOS

![GET](https://img.shields.io/badge/-GET-blue) <br>
Para obter a listagem completa dos casos, basta enviar uma requisição `GET` para o endpoint **_`/cases`_** e em caso de sucesso (_status code `200`_) uma lista paginada será retornada. É possível definir através dos _query params_ `limit` e `page` o limite de registros retornados e a página referente, exemplo _`/cases?limit=500&page=2`_. Caso esses parâmetros sejam omitidos, os valores assumidos como padrão serão `limit = 100` e `page = 1`.<br>
Outros parâmetros também são aceitos como filtro na requisição, alguns deles são:

- `email`: E-mail de contato do cliente, presente na coluna CONTACTEMAIL;
- `cpf`: CPF do cliente, presente nas colunas CPF_DO_PORTADOR\_\_C ou CPF_DO_PORTADOR_PIX\_\_C;
- `contact`: Telefone de contato do cliente, presente nas colunas CONTACTMOBILE ou CONTACTPHONE;
- `createdDate`: Data de abertura do caso, presente na coluna CREATEDDATE. Retornará todos os casos com a data de abertura maior ou igual ao valor fornecido. Leia o [formato de data](#formatos-de-data) aceito;
- `closedDate`: Data de fechamento do caso, presente na coluna CLOSEDDATE. Retornará todos os casos com a data de fechamento menor ou igual ao valor fornecido. Leia o [formato de data](#formatos-de-data) aceito;

### Consultando CASOS únicos

![GET](https://img.shields.io/badge/-GET-blue) <br>
Para uma pesquisa mais direta e objetiva, é possível efetuar uma busca por identificador para o endpoint **_`/cases/:id`_**, substituindo **_`:id`_** pelo Id do caso (_ID_) ou o número do caso (_CASENUMBER_) quando o usuário possuir essa informação. Exemplo _`/cases/5003k00001jRr11AAC`_ (Id) ou _`/cases/00050085`_ (Nº do caso).

### Consultando comentários do CASO

![GET](https://img.shields.io/badge/-GET-blue) <br>
Alguns casos possuem comentários adicionais que podem ser obtidos através do endpoint **_`/cases/:id/comments`_**, substituindo **_`:id`_** pelo Id do caso (_ID_).

### Consultando ANEXOS

![GET](https://img.shields.io/badge/-GET-blue) <br>

Para obter a listagem de anexos contendo as características, basta enviar uma requisição `GET` para o endpoint **_`/attachments`_** e em caso de sucesso (_status code `200`_) uma lista paginada será retornada. É possível definir através dos _query params_ `limit` e `page` o limite de registros retornados e a página referente, exemplo _`/attachments?limit=100&page=2`_. Caso esses parâmetros sejam omitidos, os valores assumidos como padrão serão `limit = 100` e `page = 1`.<br>
Outro parâmetro também é aceito como filtro na requisição, sendo ele:

- `sourceId`: Identificador presente no [caso](#consultando-casos) relacionado ao anexo;

### Obtendo o conteúdo dos ANEXOS

![GET](https://img.shields.io/badge/-GET-blue) <br>
Para obter o conteúdo do anexo é necessário requisitar ao endpoint **_`/attachments/:id`_**, substituindo **_`:id`_** pelo ID do anexo (obtido na [listagem anterior](#consultando-anexos)), exemplo _`/attachments/00P3k00001EKwAqEAL`_.

### Consultando DOCUMENTOS

![GET](https://img.shields.io/badge/-GET-blue) <br>

Para obter a listagem de documentos contendo as características, basta enviar uma requisição `GET` para o endpoint **_`/documents`_** e em caso de sucesso (_status code `200`_) uma lista paginada será retornada. É possível definir através dos _query params_ `limit` e `page` o limite de registros retornados e a página referente, exemplo _`/documents?limit=100&page=2`_. Caso esses parâmetros sejam omitidos, os valores assumidos como padrão serão `limit = 100` e `page = 1`.<br>

### Obtendo o conteúdo dos DOCUMENTOS

![GET](https://img.shields.io/badge/-GET-blue) <br>
Para obter o conteúdo do documents é necessário requisitar ao endpoint **_`/documents/:id`_**, substituindo **_`:id`_** pelo ID do documents (obtido na [listagem anterior](#consultando-documentos)), exemplo _`/documents/0153k000008zRY6AAM`_.

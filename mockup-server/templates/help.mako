<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
	<style>
	body {
    display: grid;
    grid-template-columns: 60%;
    justify-content: center;
    align-content: center;
    background: #e7eaeb;
  }
    .column {
      background: white;
      display: grid;
      grid-template-columns: 90%;
      justify-content: center;
      align-content: center;
      grid-template-rows: auto;
      border-radius: 20px;
    }
      .header-1 {
        text-align: center;
        margin: 0px;
      }

      .header-2 {
        margin: 0px;
      }

      .header-3 {
        margin: 0px;
       }

      .description {

      }
      .example {
        background: #e9ecee;
        border-radius: 5px;
        margin: 0px;
      }

	</style>
</head>
<body>
  <div class="column">
    <h1 class="header-1">Restfulpy Mockup Server Help Page</h1>

    <h2 class="header-2">/</h2>

    <h3 class="header-3">/index</h3>
    <p class="description">
      Index
    </p>

    <h3 class="header-3">/echo</h3>
    <p class="description">
 Return whatever you give it
    </p>
    <pre class="example">

 Example:

 $ curl $url/echo -F"a=b"

 {
 "a":"b"
 }
    </pre>

    <h3 class="header-3">/protected</h3>
    <p class="description">
      Checks if it is not logged in, return Unauthorized
    </p>
    <pre class="example">

Example:

$ curl$url/protected

nanohttp.exceptions.HTTPUnauthorized: 401 Unauthorized
    </pre>


    <h3 class="header-3">/version</h3>
    <p class="description">
      Return version
    </p>
    <pre class="example">

Example:

$ curl $url/version

{
 "version":"0.1.1"
}
    </pre>

    <h2 class="header-2">/resources</h2>

    <h3 class="header-3">/get</h3>
    <p class="description">
      Return resource based on id
    </p>
    <pre class="example">

Example-1:

$ curl $url/resources

[
{
"id":1,
"createdAt":"2018-07-24T05:37:11.262348",
"modifiedAt":null,
"title":"resource1"
}
.
.
.
{
"id":10,
"createdAt":"2018-07-24T05:37:11.262357",
"modifiedAt":null,
"title":"resource10"
}
]
    </pre>
    <pre class="example">

Example-2:

$ curl $url/resources?take=3
[
{
"id":1,
"createdAt":"2018-07-24T05:37:11.262348",
"modifiedAt":null,
"title":"resource1"
}
.
.
.
{
"id":3,
"createdAt":"2018-07-24T05:37:11.262352",
"modifiedAt":null,
"title":"resource3"
}
]
    </pre>
    <pre class="example">

Example-3:

$ curl $url/resources?skip=1

[
{
"id":2,
"createdAt":"2018-07-24T05:37:11.262351",
"modifiedAt":null,
"title":"resource2"
}
.
.
.
{
"id":10,
"createdAt":"2018-07-24T05:37:11.262357",
"modifiedAt":null,
"title":"resource10"
}
]
    </pre>
    <pre class="example">

Example-4:

$ curl $url/resources/1

{
"id":1,
"createdAt":"2018-07-24T05:37:11.262348",
"modifiedAt":null,
"title":"resource1"
}
    </pre>
    <pre class="example">

Example-5:

$ curl $url/resources?sort=-id

[
{
"id":10,
"createdAt":"2018-07-24T05:37:11.262357",
"modifiedAt":null,
"title":"resource10"
}
.
.
.
{
"id":1,
"createdAt":"2018-07-24T05:37:11.262348",
"modifiedAt":null,
"title":"resource1"
}
]

    </pre>

    <h3 class="header-3">/put</h3>
    <p class="description">
      Return updated resource
    </p>
    <pre class="example">

Example:

$ curl $url/resources/1 -XPUT -F"title=this is new title"
{
"title":"this is new title",
"createdAt":"2018-07-24T10:35:23.982643",
"id":1,
"modifiedAt":"2018-07-24T10:35:27.933934"
}
     </pre>

    <h3 class="header-3">/post</h3>
    <p class="description">
      Create new resource
    </p>
    <pre class="example">

Example:

$ curl $url/resources -XPOST -F"title=this is new resource"
 {
 "id":11,
 "title":"this is new resource",
 "createdAt":"2018-07-25T05:40:07.622461",
 "modifiedAt":null
 }
    </pre>

    <h3 class="header-3">/delete</h3>
    <p class="description">
      Delete resource based on id
    </p>
    <pre class="example">

 Example:

 $ curl $url/resources/1 -XDELETE
 {
 "createdAt":"2018-07-25T06:11:07.325754",
 "title":"resource1",
 "id":1,
 "modifiedAt":null
 }
    </pre>

    <h2 class="header-2">/sessions</h2>

    <h3 class="header-3">/post</h3>
    <p class="description">
      Get email and password if email or password not true return invalid email or password else return token
    </p>
    <pre class="example">

  Example-1:

  $ curl $url/sessions -XPOST -F"email=user1@example.com" -F"password=123456"
 {
 "token":"eyJhbGciOiJIUzI1NiIsImlhdCI6MTUzMjTMyNTAxMTQ5fQ.eSwiZW1hc2lvb0tbmo40hBNG-vmkiE5DP9p1T9Df5azOrr55Q06HdGc"
 }

 Example-2:

 $ curl $url/sessions -XPOST -i  -F"email=user1@example.com" -F"password=1234568"
 HTTP/1.0 400 Invalid email or password
 Date: Wed, 25 Jul 2018 06:43:55 GMT
 Server: WSGIServer/0.2 CPython/3.6.4
 Content-Type: application/json; charset=utf-8
    </pre>

    <h3 class="header-3">/delete</h3>
    <p class="description">
      Return {}
    </p>
    <pre class="example">

 Example:

 $ curl $url/sessions -XDELETE
    </pre>
  </div>
</body>

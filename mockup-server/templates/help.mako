<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/json.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/bash.min.js"></script>
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
      grid-row-gap: 10px;
      padding: 15px;
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

      .example {
        background: #EFEFEF;
        margin: 0px;
        padding: 0px;
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
    <p class="header-3">
      Example:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/echo -F"a=b"
    </code></pre>
    <pre class="example"><code class="json">
  {
    "a":"b"
  }
      </code></pre>

    <h3 class="header-3">/protected</h3>
    <p class="description">
      Checks if it is not logged in, return Unauthorized
    </p>
    <p class="header-3" >Example-1:</p>
    <pre class="example"><code class="bash">
  $ curl  $url/protected -H"Authorization: $Token" -i
      </code></pre>
    <pre class="example"><code class="json">
  HTTP/1.0 200 OK
  Date: Sat, 28 Jul 2018 06:33:27 GMT
  Server: WSGIServer/0.2 CPython/3.6.4
  X-Identity: 1
  Content-Type: text/plain; charset=utf-8

      </code></pre>
    <div class="description" id="note">
      <pre>Note:Click <a href="#sessionPost">here</a> to figure how do get a token? </pre>
    </div>
    <p class="header-3">
      Example-2:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/protected
      </code></pre>
    <pre class="example"><code class="json">
  nanohttp.exceptions.HTTPUnauthorized: 401 Unauthorized
      </code></pre>

    <h3 class="header-3">/version</h3>
    <p class="description">
      Return version
    </p>
    <p class="header-3">
      Example:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/version
    </code></pre>
    <pre class="example"><code class="json">
  {
      "version":"0.1.1"
  }
      </code></pre>
    <h2 class="header-2">/sessions</h2>

    <h3 class="header-3" id="sessionPost">/post</h3>
    <p class="description">
      Get email and password if email or password not true return invalid email or password else return token
    </p>
    <p class="header-3" id="sessionPost">
      Example-1:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/sessions -XPOST -F"email=user1@example.com" -F"password=123456"
      </code></pre>
    <pre class="example"><code class="json">
  {
    "token":"eyJhbGciOiJIUzI1NiIsImlhdCI6MTUzMjc1ODQ0NSwiZXhwIjoxNTMyNzU4NDY1fQ.eyJpZCI6MSwiZW1haWwiOiJ1c2VyMUBleGFtc
             GxlLmNvbSIsInJvbGVzIjpbInVzZXIiXSwic2Vzc2lvbklkIjoiMSJ9.B5Wov-m4angypeQi0T4Kjh0vNVIG6_l3gSzJaBJSweg"
  }
      </code></pre>
    <p class="header-3">
      Example-2:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/sessions -XPOST -i  -F"email=user1@example.com" -F"password=1234568"
    </code></pre>
    <pre class="example"><code class="json">
  HTTP/1.0 400 Invalid email or password
  Date: Wed, 25 Jul 2018 06:43:55 GMT
  Server: WSGIServer/0.2 CPython/3.6.4
  Content-Type: application/json; charset=utf-8
      </code></pre>

    <h3 class="header-3">/delete</h3>
    <p class="description">
      Return {}
    </p>
    <p class="header-3">
      Example:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/sessions -XDELETE
      </code></pre>

    <h2 class="header-2">/resources</h2>

    <h3 class="header-3">/get</h3>
    <p class="description">
      Return resource based on id
    </p>
    <p class="header-3">
      Example-1:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources
    </code></pre>
    <pre class="example"><code class="json">
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
      </code></pre>
    <p class="header-3">
      Example-2:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources?take=3
    </code></pre>
    <pre class="example"><code class="json">
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
      </code></pre>
    <p class="header-3">
      Example-3:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources?skip=1
      </code></pre>
    <pre class="example"><code class="json">
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
      </code></pre>
    <p class="header-3">
      Example-4:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources/1
      </code></pre>
    <pre class="example"><code class="json">
  {
    "id":1,
    "createdAt":"2018-07-24T05:37:11.262348",
    "modifiedAt":null,
    "title":"resource1"
  }
      </code></pre>
    <p class="header-3">
      Example-5:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources?sort=-id
    </code></pre>
    <pre class="example"><code class="json">
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
    </code></pre>

    <h3 class="header-3">/put</h3>
    <p class="description">
      Return updated resource
    </p>
    <p class="header-3">
      Example:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources/1 -XPUT -F"title=this is new title"
      </code></pre>
    <pre class="example"><code class="json">
  {
    "title":"this is new title",
    "createdAt":"2018-07-24T10:35:23.982643",
    "id":1,
    "modifiedAt":"2018-07-24T10:35:27.933934"
  }
    </code></pre>

    <h3 class="header-3">/post</h3>
    <p class="description">
      Create new resource
    </p>
    <p class="header-3">
      Example:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources -XPOST -F"title=this is new resource"
      </code></pre>
    <pre class="example"><code class="json">
  {
    "id":11,
    "title":"this is new resource",
    "createdAt":"2018-07-25T05:40:07.622461",
    "modifiedAt":null
  }
      </code></pre>

    <h3 class="header-3">/delete</h3>
    <p class="description">
      Delete resource based on id
    </p>
    <p class="header-3">
      Example:
    </p>
    <pre class="example"><code class="bash">
  $ curl $url/resources/1 -XDELETE
      </code></pre>
    <pre class="example"><code class="json">
  {
    "createdAt":"2018-07-25T06:11:07.325754",
    "title":"resource1",
    "id":1,
    "modifiedAt":null
  }
      </code></pre>
  </div>
<script>hljs.initHighlightingOnLoad();</script>
</body>

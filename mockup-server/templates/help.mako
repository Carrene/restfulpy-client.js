<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
	<style>
	body {background-color: #f2f2f2;}
	.header-1 {
		text-align: center;
	}

	.header-2 {
		margin-left: 30px;
	}

	.header-3 {
		margin-left: 40px;
	 }

	.description {
	    margin-left: 20px;
	}

	</style>
</head>
<body>
	<h1 class="header-1">Restfulpy Mockup Server Help Page</h1>

	<h2 class="header-2">/</h2>

	<h3 class="header-3">/index</h3>
	<pre class="description">
    Index
  </pre>

	<h3 class="header-3">/echo</h3>
	<pre class="description">
    Return whatever you give it
  </pre>
	<pre class="description">
    Example:

    $ curl $url/echo -F"a=b"

    {
      "a":"b"
    }
  </pre>

	<h3 class="header-3">/protected</h3>
	<pre class="description">
    Checks if it is not logged in, return Unauthorized
  </pre>
	<pre class="description">
    Example:

    $ curl$url/protected

    nanohttp.exceptions.HTTPUnauthorized: 401 Unauthorized
	</pre>


	<h3 class="header-3">/version</h3>
	<pre class="description">
    Return version

    Example:

    $ curl $url/version

    {
      "version":"0.1.1"
    }
  </pre>

	<h2 class="header-2">/resources</h2>

	<h3 class="header-3">/get</h3>
	<pre class="description">
    Return resource based on id
  </pre>
  <pre class="description">
    Example-1:

    $ curl $url/resources

    [
      {
      "id":1,
      "createdAt":"2018-07-24T05:37:11.262348",
      "modifiedAt":null,
      "title":"resource1"
      },
      .
      .
      .
      ,{
      "id":10,
      "createdAt":"2018-07-24T05:37:11.262357",
      "modifiedAt":null,
      "title":"resource10"
      }
    ]
  </pre>
  <pre class="description">
    Example-2:

    $ curl $url/resources?take=3
    [
    {
      "id":1,
      "createdAt":"2018-07-24T05:37:11.262348",
      "modifiedAt":null,
      "title":"resource1"
      },
      .
      .
      .
      ,{
      "id":3,
      "createdAt":"2018-07-24T05:37:11.262352",
      "modifiedAt":null,
      "title":"resource3"
    }
    ]
  </pre>
  <pre class="description">
    Example-3:

    $ curl $url/resources?skip=1

    [
      {
      "id":2,
      "createdAt":"2018-07-24T05:37:11.262351",
      "modifiedAt":null,
      "title":"resource2"
      },
      .
      .
      .
      ,{
      "id":10,
      "createdAt":"2018-07-24T05:37:11.262357",
      "modifiedAt":null,
      "title":"resource10"
      }
    ]
  </pre>
  <pre class="description">
    Example-4:

    $ curl $url/resources/1

    {
    "id":1,
    "createdAt":"2018-07-24T05:37:11.262348",
    "modifiedAt":null,
    "title":"resource1"
    }
  </pre>
  <pre class="description">
    Example-5:

    $ curl $url/resources?sort=-id

    [
    {
      "id":10,
      "createdAt":"2018-07-24T05:37:11.262357",
      "modifiedAt":null,
      "title":"resource10"
    },
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
	<pre class="description">
    Return updated resource

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
	<pre class="description">
    Return updated resource
  </pre>

	<h3 class="header-3">/delete</h3>
	<pre class="description">
    Delete resorce based on id
  </pre>

	<h2 class="header-2">/sessions</h2>

	<h3 class="header-3">/post</h3>
	<pre class="description">
    Get email and password if email or password not true return invalid email or password else return token
  </pre>

	<h3 class="header-3">/delete</h3>
	<pre class="description">
    Return {}
  </pre>

</body>

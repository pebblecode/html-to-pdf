# HTML to PDF

This is a simple service which accepts an array of urls which it converts to a merged PDF and returns the url from which it can be retrieved.

The expected payload

#### Method [POST] /
##### Payload

```
{
  urls: ['http://pebblecode.com', 'http://bing.com' ...]
}
```

# Running (requires the Docker toolbox)

To run the app locally, you need to have `docker` and `docker-compose` installed. The easiest way to get this is via: https://www.docker.com/products/docker-toolbox

* `docker-compose build` // builds the app

* `docker-compose run --service-ports web` // runs the app

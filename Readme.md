bricked
=======

Bricked is a script that polls your configured servers to check if they respond. It supports ICMP Ping, TCP socket opening, and HTTP GET.

Results are available through a JSON REST API as well as an HTML page.

![Bricked](http://aldaviva.com/portfolio/artwork/bricked.jpg)

## Requirements

* Node.js

## Installation

1. Clone or download the repository

        $ git clone https://github.com/Aldaviva/bricked.git && cd bricked

2. Install dependencies

        $ npm install

3. Configure

        $ cp config.json.example config.json
       	$ edit config.json

## Configuration

Bricked is configured using `config.json` in the installation directory.

An example configuration file is provided in `config.json.example`.

### Configuration options

<table>
  <tr>
	<td><strong>services[]</strong></td>
	<td>List of objects, configures which services to monitor.</td>
	<td><em>[{}]</em></td>
  </tr>
  <tr>
	<td><strong>services[].id</strong></td>
	<td>Descriptive name for the service.</td>
	<td><em>Apache Tomcat</em></td>
  </tr>
  <tr>
	<td><strong>services[].host</strong></td>
	<td>IP or DNS name of the service to test.</td>
	<td><em>www</em></td>
  </tr>
  <tr>
	<td><strong>services[].port</strong></td>
	<td>Optional. Port number of the service to test.</td>
	<td><em>80</em></td>
  </tr>
  <tr>
	<td><strong>services[].protocol</strong></td>
	<td>Optional. Whether to test the service using <strong>ping</strong> (ICMP Ping), <strong>tcp</strong> (try to open a TCP socket), or <strong>http</strong> (GET returning 2xx)</td>
	<td><em>http</em></td>
  </tr>
  <tr>
	<td><strong>services[].path</strong></td>
	<td>For http services, the path to GET.</td>
	<td><em>/</em></td>
  </tr>
  <tr>
	<td><strong>logLevel</strong></td>
	<td>Optional. Bricked's internal logging, which is written to stdout in <a href="https://github.com/trentm/node-bunyan">Bunyan</a> format.</td>
	<td><em>log, info, warn, error</em></td>
  </tr>
  <tr>
	<td><strong>pingInterval</strong></td>
	<td>Optional. How often to check all the services, in milliseconds.</td>
	<td><em>30000</em></td>
  </tr>
  <tr>
	<td><strong>port</strong></td>
	<td>Optional. Which port the REST server will listen on.</td>
	<td><em>8080</em></td>
  </tr>
  <tr>
	<td><strong>smtp</strong></td>
	<td>Optional. Object, configures how notification emails are sent when services go up or down.</td>
	<td><em>{}</em></td>
  <tr>
	<td><strong>smtp.from</strong></td>
	<td>Optional. From whom notification emails will be addressed.</td>
	<td><em>bricked@email.com</em></td>
  </tr>
  <tr>
	<td><strong>smtp.host</strong></td>
	<td>Optional. IP or DNS name of your SMTP server.</td>
	<td><em>smtp.gmail.com</em></td>
  </tr>
  <tr>
	<td><strong>smtp.port</strong></td>
	<td>Optional. Port your SMTP server listens on.</td>
	<td><em>25</em></td>
  </tr>
  <tr>
	<td><strong>smtp.to</strong></td>
	<td>Optional. When a service goes down or comes up, send an email to these addresses.</td>
	<td><em>[you@email.com]</em></td>
  </tr>
</table>

## Running

    $ node . | bunyan

## REST API

### listServices (GET /services)

Returns all configured services, with a boolean `isWorking` field representing the service state.

#### Inputs

None.

#### Returns

`application/json`

An array of objects, each of which is a service. The service has the same attributes as it was configured with, as well as a boolean `isWorking` field representing the service state.

#### Example Request

    GET /services

#### Example Response

`Content-Type: application/json`

```json
[{
    "id": "Rollway",
	"protocol": "http",
	"host": "logupload.bluejeans.com",
	"port": 8080,
	"path": "/ruok",
	"isWorking": true
}]
```

## Web Interface

A graphical HTML view of the service state is accessible from the root of the web server.

    http://127.0.0.1:3000/

It updates using push notifications from the server.

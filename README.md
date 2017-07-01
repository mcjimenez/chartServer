# chartServer:

Server to implement an easy way to generate Chart.

The server will return a PNG image with the chart resulting of the parameter passed on the request.

## Introduction

### Local Installation:
#### Prerequisites:
You'll need:

- NodeJS: https://nodejs.org/. This application is tested and supported on v4 LTS.
  If you use [nvm](https://github.com/creationix/nvm/) to manage your node
  installations (recommended), you can run `nvm use` in the project directory to
  select the right version.

  This server need at least the version 6 of node.

#### Installation:

Execute

```
npm install
```

## Running

```
node server
```

## Server configuration

The server can be configured to require or not authorization to generate graphics.
If you want the server to use authorization, a shared secret must be defined.

To define a shared secret, just set the SHARED_SECRET environment variable to any value. If this
variable is set, then all the requests must include the auth parameter, as described on the next section.

## Authorization

If authorization has been enabled (by defining a SHARED_SECRET environment variable) then the
query string of the requests must have the following form:

param=\<paramValue\>&auth=\<authValue\>

where:
  - paramValue: Base64 encoded string from the stringified JSON of the parameters.
  - authValue: SHA256 HMAC using the shared secret as key, and paramValue as the value, that is:
`auth = hmacSha256(paramValue, sharedSecret)`

You can find an example page for generating requests on the web directory.

If authorization is enabled, all the requests that don't pase the right authorization value will
not be executed, and a 401 error will be returned instead.

## How does it works

This server can generate five types of charts:

- Line
- Bar
- Pie
- Polar area
- Doughnut

The aspect and values of the chart is passed on the url as parameters.
All graphics can specify the parameters:
  - width: Width of the image
  - height: Height of the image
  - legend: If you want the labels on the graphics to be shown, and on what position. It should be a well formed JSON:
  - xAxis: a well formed JSON with x axis configuration
  - yAxis: a well formed JSON with y axis configuration

legend has the following possible values:
  - "display": [true|false] is the legend shown
  - "position": Position of the legend. Options are: "top", "left", "bottom", "right"
  - "labels": Well formed JSON, possible values are:
    - "fontSize": font size of text
    - "fontStyle": font style of text
    - "fontColor": Color of text (e.g. "rgb(23,21,21,1)" or "#171515")
    - "fontFamily": Font family of legend text. Default "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"

[x|y]Axis has the following possible values:
  - "display": If set to false the axis is hidden from view. Overrides gridLines.display, scaleLabel.display, and ticks.display.
  - "position": Position of the axis in the chart. Possible values are: "top", "left", "bottom", "right"
  - "gridLines": Well formed JSON, possible values are:
    - "display": If false, do not display grid lines for this axis.
    - "color": "rgba(0..255, 0..255, 0..255, 0..1)" The color of the grid lines. If specified as an array, the first color applies to the first grid line, the second to the second grid line and so on.
    - "drawTicks": If true, draw lines beside the ticks in the axis area beside the chart.
    - "lineWidth": Stroke width of grid lines.
    - "zeroLineColor": "rgba(0..255, 0..255, 0..255, 0..1)" Stroke color of the grid line for the first index (index 0).
    - "zeroLineWidth": Stroke width of the grid line for the first index (index 0).
  - "ticks": Well formed JSON, possible values are:
    - "min": User defined minimum number for the scale, overrides minimum value from data
    - "max": User defined maximum number for the scale, overrides maximum value from data.
    - "stepSize": User defined fixed step size for the scale.
    - "display": If true, display the axis title.
    - "fontColor": Font color for scale title.
    - "fontFamily": Font family for the scale title, follows CSS font-family options.
    - "fontSize": Font size for scale title.
    - "fontStyle": Font style for the scale title, follows CSS font-style options (i.e. normal, italic, oblique, initial, inherit).

The colors are especified as RGB and Alpha in decimal value of three character (if the number is
smaller than 100 you should add a 0 at the right).
For example:
- #189ACA with an alpha of 0.4 will be: 0241542020.4
- #189ACA with an alpha of 1 will be: 0241542021

### Line Chart

#### URL: /charts/line

#### Parameters
  - backgroundColor: Color to paint under the line. If you don't want to fill with any color, just specify any color with an alpha of 0.0. You have to specify as many colors as lines you're going to generate, separated with commas ','
  - borderColor: Color of the line that link the dots. You have to specify as many colors (comma ',' separated) as lines you are going to generate
  - labels: Comma (',') separated list of labels for each line
  - values: Comma (',') separated list of points in the chart. If more than one line must be generated, separete the list of points for each line with semi colons (';')
  - lineLabels: Comma (',') separated list of labels of the abscissa axis
  - disableCurve: If this parameter is included (the value doesn't matter), the lines will be generated as plain lines between each data point. Otherwise, a spline (curve) will be generated.

#### Sample:

<img src='https://chartgenerator.herokuapp.com/charts/line?param=eyJ3aWR0aCI6IjcwMCIsImhlaWdodCI6IjQwMCIsImxlZ2VuZCI6IntkaXNwbGF5OnRydWUscG9zaXRpb246XCJib3R0b21cIn0iLCJ2YWx1ZXMiOiJbWzQxMCw0MDAsNDEwLDYwMCw0MDAsNTAwLDM4MF0sWzM4MCw1ODAsNDUwLDQzMCw1NzAsNjAwLDgwMF1dIiwibGluZUxhYmVscyI6IltcIjAxXCIsXCIwNlwiLFwiMTJcIixcIjE4XCIsXCIyNFwiLFwiMzFcIixcIjM3XCJdIiwibGFiZWxzIjoiW1wiTWludXRlcyBsYXN0IG1vbnRoXCIsXCJNaW51dGVzIHRoaXMgbW9udGhcIl0iLCJiYWNrZ3JvdW5kQ29sb3IiOiJbXCIyNTUxNTMwMDAwLjBcIixcIjIxMzIzNjI0MzAuNVwiXSIsImJvcmRlckNvbG9yIjoiW1wiMTU1MDc0MTQ5MVwiLFwiMDM2MTYzMjA2MVwiXSIsImRpc2FibGVDdXJ2ZSI6IjEifQ==' alt="Line chart">

```
var params = {
  width:700,
  height:400,
  legend: {
    display:true,
    position:"bottom"
  },
  values:[[410,400,410,600,400,500,380],[380,580,450,430,570,600,800]],
  lineLabels:["01","06","12","18","24","31","37"],
  labels:["Minutes last month","Minutes this month"],
  backgroundColor:["2551530000.0","2132362430.5"],
  borderColor:["1550741491","0361632061"],
  disableCurve:"1"
};
```
Calculate query param: btoa(JSON.stringify(params))

URL:
https://chartgenerator.herokuapp.com/charts/line?param=eyJ3aWR0aCI6IjcwMCIsImhlaWdodCI6IjQwMCIsImxlZ2VuZCI6IntkaXNwbGF5OnRydWUscG9zaXRpb246XCJib3R0b21cIn0iLCJ2YWx1ZXMiOiJbWzQxMCw0MDAsNDEwLDYwMCw0MDAsNTAwLDM4MF0sWzM4MCw1ODAsNDUwLDQzMCw1NzAsNjAwLDgwMF1dIiwibGluZUxhYmVscyI6IltcIjAxXCIsXCIwNlwiLFwiMTJcIixcIjE4XCIsXCIyNFwiLFwiMzFcIixcIjM3XCJdIiwibGFiZWxzIjoiW1wiTWludXRlcyBsYXN0IG1vbnRoXCIsXCJNaW51dGVzIHRoaXMgbW9udGhcIl0iLCJiYWNrZ3JvdW5kQ29sb3IiOiJbXCIyNTUxNTMwMDAwLjBcIixcIjIxMzIzNjI0MzAuNVwiXSIsImJvcmRlckNvbG9yIjoiW1wiMTU1MDc0MTQ5MVwiLFwiMDM2MTYzMjA2MVwiXSIsImRpc2FibGVDdXJ2ZSI6IjEifQ==


### Bar Chart

#### URL: /charts/bar

#### Parameters
  - value: Comma separated list (',') of values, a value per bar.
  - label: Comma separated list (',') of labels for the bars (a label per var).
  - barLabel: Title of the chart
  - backgroundColor: Comma separated list (',') of colors of each bar.
  - borderColor: Comma separated list (',') of colors for the borders of the bar, one color per bar.
  - borderWidth: Size of the borders for all the bars.

#### Sample:

<img src="https://chartgenerator.herokuapp.com/charts/bar?param=eyJ2YWx1ZXMiOiJbMyw5LDEyLDUsNywzXSIsImxhYmVscyI6IltcIm9wLiBBXCIsXCJvcC4gQlwiLFwib3AuIENcIixcIm9wLiBEXCIsXCJvcC4gRVwiLFwib3AuIEZcIl0iLCJiYXJMYWJlbCI6IlwiUGVyY2VudGFnZSBvZiBWb3Rlc1wiIiwiYmFja2dyb3VuZENvbG9yIjoiW1wiMTM1MTI3MTYwMC4yXCIsXCIwNjYxNTkyMTQwLjJcIixcIjE5NDA1NzA0MDAuMlwiLFwiMDQ4MTcwMTkwMC4yXCIsXCIyMjYxODAwNTYwLjJcIixcIjA5NjExNDEyNzAuMlwiXSIsImJvcmRlckNvbG9yIjoiW1wiMTM1MTI3MTYwMVwiLFwiMDY2MTU5MjE0MVwiLFwiMTk0MDU3MDQwMVwiLFwiMDQ4MTcwMTkwMVwiLFwiMjI2MTgwMDU2MVwiLFwiMDk2MTE0MTI3MVwiXSIsImJvcmRlcldpZHRoIjoiMSJ9" alt="bar chart">

```
var param = {
  width:400,
  height:400,
  values:[3,9,12,5,7,3],
  labels:["op. A","op. B","op. C","op. D","op. E","op. F"],
  barLabel:"Percentage of Votes",
  backgroundColor:["1351271600.2","0661592140.2","1940570400.2","0481701900.2","2261800560.2","0961141270.2"],
  borderColor:["1351271601","0661592141","1940570401","0481701901","2261800561","0961141271"],
  borderWidth:1
};
```
Calculate query param: btoa(JSON.stringify(params))

URL:
https://chartgenerator.herokuapp.com/charts/bar?param=eyJ2YWx1ZXMiOiJbMyw5LDEyLDUsNywzXSIsImxhYmVscyI6IltcIm9wLiBBXCIsXCJvcC4gQlwiLFwib3AuIENcIixcIm9wLiBEXCIsXCJvcC4gRVwiLFwib3AuIEZcIl0iLCJiYXJMYWJlbCI6IlwiUGVyY2VudGFnZSBvZiBWb3Rlc1wiIiwiYmFja2dyb3VuZENvbG9yIjoiW1wiMTM1MTI3MTYwMC4yXCIsXCIwNjYxNTkyMTQwLjJcIixcIjE5NDA1NzA0MDAuMlwiLFwiMDQ4MTcwMTkwMC4yXCIsXCIyMjYxODAwNTYwLjJcIixcIjA5NjExNDEyNzAuMlwiXSIsImJvcmRlckNvbG9yIjoiW1wiMTM1MTI3MTYwMVwiLFwiMDY2MTU5MjE0MVwiLFwiMTk0MDU3MDQwMVwiLFwiMDQ4MTcwMTkwMVwiLFwiMjI2MTgwMDU2MVwiLFwiMDk2MTE0MTI3MVwiXSIsImJvcmRlcldpZHRoIjoiMSJ9

### Pie Chart

#### URL: /charts/pie

#### Parameters
  - values: Comma separated list (',') of the values for each section of the pie.
  - labels: Comma separated list (',') of name for each of the pie section.
  - backgroundColor: Comma separated list (',') of the colors for each of the pie section.

#### Sample:

<img src='https://chartgenerator.herokuapp.com/charts/pie?param=eyJ3aWR0aCI6IjYwMCIsImhlaWdodCI6IjQwMCIsImxlZ2VuZCI6IntcInBvc2l0aW9uXCI6XCJyaWdodFwiLFwibGFiZWxzXCI6e1wiZm9udFNpemVcIjoxNSxcImZvbnRDb2xvclwiOlwicmdiKDIzLDIxLDIxLDEpXCIsXCJmb250U3R5bGVcIjpcImJvbGRcIn19IiwieEF4aXMiOiJ7XCJkaXNwbGF5XCI6ZmFsc2UsXCJncmlkTGluZXNcIjp7XCJkaXNwbGF5XCI6ZmFsc2V9LFwiYW5nbGVMaW5lc1wiOntcImRpc3BsYXlcIjpmYWxzZX19IiwidmFsdWVzIjoiWzEyLDE5LDMzLDE3LDI4LDI0XSIsImxhYmVscyI6IltcIjEyJSBNb25kYXlcIixcIjE5JSBUdWVzZGF5XCIsXCIyMyUgV2VkbmVzZGF5XCIsXCIxNyUgVGh1cnNkYXlcIixcIjI4JSBGcmlkYXlcIixcIjI0JSBTYXR1cmRheVwiXSIsImJhY2tncm91bmRDb2xvciI6IltcIjA0NjIwNDExMzFcIixcIjA1MjE1MjIxOTFcIixcIjE0OTE2NTE2NjFcIixcIjE1NTA4OTE4MjFcIixcIjI0MTE5NjAxNTFcIixcIjIzMTA3NjA2MDFcIl0ifQ==' alt="bar chart">

```
var param = {
  width:600,
  height:400,
  legend:{
    display:true,
    position:"right",
    labels:{
      fontSize:15,
      fontColor:"rgb(23,21,21,1)",
      fontStyle:"bold"
    }
  },
  xAxis:{
    display:false,
    gridLines:{
      display:false
    },
    angleLines:{
      display:false
    }
  },
  values:[12,19,33,17,28,24],
  labels:["12% Monday","19% Tuesday","23% Wednesday","17% Thursday","28% Friday","24% Saturday"],
  backgroundColor:["0462041131","0521522191","1491651661","1550891821","2411960151","2310760601"]
}
```
Calculate query param: btoa(JSON.stringify(params))

URL:
https://chartgenerator.herokuapp.com/charts/pie?param=eyJ3aWR0aCI6IjYwMCIsImhlaWdodCI6IjQwMCIsImxlZ2VuZCI6IntcInBvc2l0aW9uXCI6XCJyaWdodFwiLFwibGFiZWxzXCI6e1wiZm9udFNpemVcIjoxNSxcImZvbnRDb2xvclwiOlwicmdiKDIzLDIxLDIxLDEpXCIsXCJmb250U3R5bGVcIjpcImJvbGRcIn19IiwieEF4aXMiOiJ7XCJkaXNwbGF5XCI6ZmFsc2UsXCJncmlkTGluZXNcIjp7XCJkaXNwbGF5XCI6ZmFsc2V9LFwiYW5nbGVMaW5lc1wiOntcImRpc3BsYXlcIjpmYWxzZX19IiwidmFsdWVzIjoiWzEyLDE5LDMzLDE3LDI4LDI0XSIsImxhYmVscyI6IltcIjEyJSBNb25kYXlcIixcIjE5JSBUdWVzZGF5XCIsXCIyMyUgV2VkbmVzZGF5XCIsXCIxNyUgVGh1cnNkYXlcIixcIjI4JSBGcmlkYXlcIixcIjI0JSBTYXR1cmRheVwiXSIsImJhY2tncm91bmRDb2xvciI6IltcIjA0NjIwNDExMzFcIixcIjA1MjE1MjIxOTFcIixcIjE0OTE2NTE2NjFcIixcIjE1NTA4OTE4MjFcIixcIjI0MTE5NjAxNTFcIixcIjIzMTA3NjA2MDFcIl0ifQ==

### Doughnut Chart

#### URL: /charts/doughnut

#### Parameters
  - values: Comma separated list (',') of values for each section of the doughnut.
  - labels: Comma separated list (',')  of name for each of the doughnut section.
  - backgroundColor: Comma separated list (',') of the colors for each of the doughnut section.

#### Sample:

<img src='https://chartgenerator.herokuapp.com/charts/doughnut?param=eyJ3aWR0aCI6IjQwMCIsImhlaWdodCI6IjIwMCIsImxlZ2VuZCI6IntcInBvc2l0aW9uXCI6XCJyaWdodFwiLFwibGFiZWxzXCI6e1wiZm9udFNpemVcIjoxNSxcImZvbnRDb2xvclwiOlwiIzgwODA4MFwiLFwiZm9udFN0eWxlXCI6XCJib2xkXCJ9fSIsInhBeGlzIjoie1wiZGlzcGxheVwiOmZhbHNlLFwiZ3JpZExpbmVzXCI6e1wiZGlzcGxheVwiOmZhbHNlfSxcImFuZ2xlTGluZXNcIjp7XCJkaXNwbGF5XCI6ZmFsc2V9fSIsInZhbHVlcyI6Ils1NiwzNCwxMF0iLCJsYWJlbHMiOiJbXCI1NiUgQW5kcm9pZFwiLFwiMzQlIGlPU1wiLFwiMTAlIFdlYlwiXSIsImJhY2tncm91bmRDb2xvciI6IltcIjAyNDE1NDIwMjFcIixcIjAwNTA2NDA5NDFcIixcIjE5NDAyMTA3NTFcIl0ifQ==' alt="doughnut chart">

```
var param = {
  width:400,
  height:200,
  legend:{
    display:true,
    position:"right",
    labels:{
      fontSize:15,
      fontColor:"#808080",
      fontStyle:"bold"
    }
  },
  xAxis:{
    display:false,
    gridLines:{
      display:false
    },
    angleLines:{
      display:false
    }
  },
  values:[56,34,10],
  labels":["56% Android","34% iOS","10% Web"],
  backgroundColor:["0241542021","0050640941","1940210751"]
};
```
Calculate query param: btoa(JSON.stringify(params))

URL:
https://chartgenerator.herokuapp.com/charts/doughnut?param=eyJ3aWR0aCI6IjQwMCIsImhlaWdodCI6IjIwMCIsImxlZ2VuZCI6IntcInBvc2l0aW9uXCI6XCJyaWdodFwiLFwibGFiZWxzXCI6e1wiZm9udFNpemVcIjoxNSxcImZvbnRDb2xvclwiOlwiIzgwODA4MFwiLFwiZm9udFN0eWxlXCI6XCJib2xkXCJ9fSIsInhBeGlzIjoie1wiZGlzcGxheVwiOmZhbHNlLFwiZ3JpZExpbmVzXCI6e1wiZGlzcGxheVwiOmZhbHNlfSxcImFuZ2xlTGluZXNcIjp7XCJkaXNwbGF5XCI6ZmFsc2V9fSIsInZhbHVlcyI6Ils1NiwzNCwxMF0iLCJsYWJlbHMiOiJbXCI1NiUgQW5kcm9pZFwiLFwiMzQlIGlPU1wiLFwiMTAlIFdlYlwiXSIsImJhY2tncm91bmRDb2xvciI6IltcIjAyNDE1NDIwMjFcIixcIjAwNTA2NDA5NDFcIixcIjE5NDAyMTA3NTFcIl0ifQ==

### Polar area Chart

#### URL: /charts/polarArea

#### Parameters

  - values: Comma separated list (',') of values for each section of the area.
  - labels: Comma separated list (',') of name for each of the polar area section.
  - backgroundColor: Comma separated list (',') of the colors for each of the polar area section.

#### Sample:

<img src='https://chartgenerator.herokuapp.com/charts/polarArea?param=eyJ3aWR0aCI6IjYwMCIsImhlaWdodCI6IjQwMCIsImxlZ2VuZCI6IntcInBvc2l0aW9uXCI6XCJsZWZ0XCIsXCJsYWJlbHNcIjp7XCJmb250U2l6ZVwiOjE1LFwiZm9udENvbG9yXCI6XCIjODA4MDgwXCIsXCJmb250U3R5bGVcIjpcImJvbGRcIn19IiwieEF4aXMiOiJ7XCJkaXNwbGF5XCI6ZmFsc2UsXCJncmlkTGluZXNcIjp7XCJkaXNwbGF5XCI6ZmFsc2V9LFwiYW5nbGVMaW5lc1wiOntcImRpc3BsYXlcIjpmYWxzZX19IiwidmFsdWVzIjoiWzEyLDE5LDMsMTcsMjgsMjQsN10iLCJsYWJlbHMiOiJbXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIixcIlN1bmRheVwiXSIsImJhY2tncm91bmRDb2xvciI6IltcIjA0NjIwNDExMzFcIixcIjA1MjE1MjIxOTFcIixcIjE0OTE2NTE2NjFcIixcIjE1NTA4OTE4MjFcIixcIjI0MTE5NjAxNTFcIixcIjIzMTA3NjA2MDFcIixcIjA1MjA3MzA5NDFcIl0ifQ==' alt="polar area chart">

```
var param = {
  width:600,
  height:400,
  legend:{
    position:"left",
    labels:{
      fontSize:15,
      fontColor:"#808080",
      fontStyle:"bold"
    }
  },
  xAxis:{
    display:false,
    gridLines:{
      display:false
    },
    angleLines:{
      display:false
    }
  },
  values:[12,19,3,17,28,24,7],
  labels:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
  backgroundColor:["0462041131","0521522191","1491651661","1550891821","2411960151","2310760601","0520730941"]
}
```
Calculate query param: btoa(JSON.stringify(params))

URL:
https://chartgenerator.herokuapp.com/charts/polarArea?param=eyJ3aWR0aCI6IjYwMCIsImhlaWdodCI6IjQwMCIsImxlZ2VuZCI6IntcInBvc2l0aW9uXCI6XCJsZWZ0XCIsXCJsYWJlbHNcIjp7XCJmb250U2l6ZVwiOjE1LFwiZm9udENvbG9yXCI6XCIjODA4MDgwXCIsXCJmb250U3R5bGVcIjpcImJvbGRcIn19IiwieEF4aXMiOiJ7XCJkaXNwbGF5XCI6ZmFsc2UsXCJncmlkTGluZXNcIjp7XCJkaXNwbGF5XCI6ZmFsc2V9LFwiYW5nbGVMaW5lc1wiOntcImRpc3BsYXlcIjpmYWxzZX19IiwidmFsdWVzIjoiWzEyLDE5LDMsMTcsMjgsMjQsN10iLCJsYWJlbHMiOiJbXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIixcIlN1bmRheVwiXSIsImJhY2tncm91bmRDb2xvciI6IltcIjA0NjIwNDExMzFcIixcIjA1MjE1MjIxOTFcIixcIjE0OTE2NTE2NjFcIixcIjE1NTA4OTE4MjFcIixcIjI0MTE5NjAxNTFcIixcIjIzMTA3NjA2MDFcIixcIjA1MjA3MzA5NDFcIl0ifQ==

## Testing

You can generate and test those charts on https://chartgenerator.herokuapp.com server
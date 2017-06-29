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
    - "fontColor": Color of text (e.g. "rgb(23,21,21,1)")
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

Axes Configuration:

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

<img src="https://chartgenerator.herokuapp.com/charts/line?backgroundColor=2551530000.0,2132362430.5&borderColor=1550741491,0361632061&values=410,400,410,600,400,500,380;380,580,450,430,570,600,800&labels=Minutes%20last%20month,Minutes%20this%20month&lineLabels=01,06,12,18,24,31,37&legend=display:true,position:bottom&disableCurve=1&width=700&heigth=400" alt="Line chart">

https://chartgenerator.herokuapp.com/charts/line?backgroundColor=2551530000.0,2132362430.5&borderColor=1550741491,0361632061&values=410,400,410,600,400,500,380;380,580,450,430,570,600,800&labels=Minutes%20last%20month,Minutes%20this%20month&lineLabels=01,06,12,18,24,31,37&legend=display:true,position:bottom&disableCurve=1&width=700&heigth=400


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

<img src="https://chartgenerator.herokuapp.com/charts/bar?values=3,9,12,5,7,3&labels=op.%20A,op.%20B,op.%20C,op.%20D,op.%20E,op.%20F&barLabel=Percentage%20of%20Votes&backgroundColor=1351271600.2,0661592140.2,1940570400.2,0481701900.2,2261800560.2,0961141270.2&borderColor=1351271601,0661592141,1940570401,0481701901,2261800561,0961141271&borderWidth=1" alt="bar chart">

https://chartgenerator.herokuapp.com/charts/bar?values=3,9,12,5,7,3&labels=op.%20A,op.%20B,op.%20C,op.%20D,op.%20E,op.%20F&barLabel=Percentage%20of%20Votes&backgroundColor=1351271600.2,0661592140.2,1940570400.2,0481701900.2,2261800560.2,0961141270.2&borderColor=1351271601,0661592141,1940570401,0481701901,2261800561,0961141271&borderWidth=1


### Pie Chart

#### URL: /charts/generic/pie

#### Parameters
  - values: Comma separated list (',') of the values for each section of the pie.
  - labels: Comma separated list (',') of name for each of the pie section.
  - backgroundColor: Comma separated list (',') of the colors for each of the pie section.

#### Sample:

<img src='https://chartgenerator.herokuapp.com/charts/pie?values=12,19,33,17,28,24&labels=12%25%20Monday,19%25%20Tuesday,23%25%20Wednesday,17%25%20Thursday,28%25%20Friday,24%25%20Saturday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601&width=600&heigth=400&legend={%22display%22:true,%22position%22:%22right%22,"labels":{"fontSize":15,"fontColor":"rgb(23,21,21,1)","fontStyle":"bold"}}&xAxis={%22display%22:false,%22gridLines%22:{%22display%22:false},%22angleLines%22:{%22display%22:false}}&yAxis={%22display%22:false,%22gridLines%22:{%22display%22:false},%22angleLines%22:{%22display%22:false}}' alt="bar chart">

https://chartgenerator.herokuapp.com/charts/pie?values=12,19,33,17,28,24&labels=12%25%20Monday,19%25%20Tuesday,23%25%20Wednesday,17%25%20Thursday,28%25%20Friday,24%25%20Saturday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601&width=600&heigth=400&legend={%22display%22:true,%22position%22:%22right%22,"labels":{"fontSize":15,"fontColor":"rgb(23,21,21,1)","fontStyle":"bold"}}&xAxis={%22display%22:false,%22gridLines%22:{%22display%22:false},%22angleLines%22:{%22display%22:false}}&yAxis={%22display%22:false,%22gridLines%22:{%22display%22:false},%22angleLines%22:{%22display%22:false}}

### Doughnut Chart

#### URL: /charts/generic/doughnut

#### Parameters
  - values: Comma separated list (',') of values for each section of the doughnut.
  - labels: Comma separated list (',')  of name for each of the doughnut section.
  - backgroundColor: Comma separated list (',') of the colors for each of the doughnut section.

#### Sample:

<img src="https://chartgenerator.herokuapp.com/charts/generic/doughnut?values=56,34,10&labels=56%25%20Android,34%25%20iOS,10%25%20Web&backgroundColor=0241542021,0050640941,1940210751&width=400&height=200&legend=position:right" alt="doughnut chart">

https://chartgenerator.herokuapp.com/charts/generic/doughnut?values=56,34,10&labels=56%25%20Android,34%25%20iOS,10%25%20Web&backgroundColor=0241542021,0050640941,1940210751&width=400&height=200&legend=position:right


### Polar area Chart

#### URL: /charts/generic/polarArea

#### Parameters

  - values: Comma separated list (',') of values for each section of the area.
  - labels: Comma separated list (',') of name for each of the polar area section.
  - backgroundColor: Comma separated list (',') of the colors for each of the polar area section.

#### Sample:

<img src="https://chartgenerator.herokuapp.com/charts/generic/polarArea?values=12,19,3,17,28,24,7&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601,0520730941&width=700&heigth=400&legend=position:left" alt="polar area chart">

https://chartgenerator.herokuapp.com/charts/generic/polarArea?values=12,19,3,17,28,24,7&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601,0520730941&width=700&heigth=400&legend=position:left


## Testing

You can generate and test this chart on https://chartgenerator.herokuapp.com server
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

## How it work

This server can generate four types of charts:

- Line
- Bar
- Pie
- Polar area
- Doughnut

The aspect and values of the chart is passed on the url as parameters.
All graphics can especify the parameters:
  - width: Width of the image
  - height: Height of the image
  - legend: If you want that the labels of the graphics will be shown and the position.

    legend=[display:[true|false],][position:[top|right|bottom|left]]

The colours are especified as RGB and Aplha in decimal value of three character (if the number is
smaller than 100 you should add a 0 at the right).
For example:
- #189ACA with an alpha of 0.4 will be: 0241542020.4
- #189ACA with an alpha of 1 will be: 0241542021

### Line Chart

URL: https://chartgenerator.herokuapp.com/charts/line?backgroundColor=2551530000.0,2132362430.5&borderColor=1550741491,0361632061&values=410,400,410,600,400,500,380;380,580,450,430,570,600,800&labels=Minutes%20last%20mounth,Minutes%20this%20mounth&lineLabels=01,06,12,18,24,31,37&legend=display:true,position:bottom&disableCurve=1&width=700&heigth=400

<img src="https://chartgenerator.herokuapp.com/charts/line?backgroundColor=2551530000.0,2132362430.5&borderColor=1550741491,0361632061&values=410,400,410,600,400,500,380;380,580,450,430,570,600,800&labels=Minutes%20last%20mounth,Minutes%20this%20mounth&lineLabels=01,06,12,18,24,31,37&legend=display:true,position:bottom&disableCurve=1&width=700&heigth=400" alt="Line chart">

- URL:
  - /charts/line
- Parameters:
  - backgroundColor: Colour under the line, if you don't want fill colour especify whatever colour with an alpha of 0.0. You have to specify as many colours as chart you are going to generate, this colour should be separated with commas ','
  - borderColor: Colour of the line that link the dots. You have to especify as colours (comma ',' separated) as graphics you are going to generate
  - value: Points of the graphic. If you want to generate more than one chart, separate its values with commas ','
  - labes: Label of each graphics (comma separate)
  - values: Values of the graphics. If you want more than one graphics separate the values of one graphic with comma and the values of one graphic from other with semicolon ';'
  - lineLabels: Label of the abscissa axis
  - disableCurve: If this parameter is included (doesn't matter its value) the graphics will be shown without curve in the values.

### Bar Chart

URL: https://chartgenerator.herokuapp.com/charts/bar?values=3,9,12,5,7,3&labels=op.%20A,op.%20B,op.%20C,op.%20D,op.%20E,op.%20F&barLabel=Percentage%20of%20Votes&backgroundColor=1351271600.2,0661592140.2,1940570400.2,0481701900.2,2261800560.2,0961141270.2&borderColor=1351271601,0661592141,1940570401,0481701901,2261800561,0961141271&borderWidth=1

<img src="https://chartgenerator.herokuapp.com/charts/bar?values=3,9,12,5,7,3&labels=op.%20A,op.%20B,op.%20C,op.%20D,op.%20E,op.%20F&barLabel=Percentage%20of%20Votes&backgroundColor=1351271600.2,0661592140.2,1940570400.2,0481701900.2,2261800560.2,0961141270.2&borderColor=1351271601,0661592141,1940570401,0481701901,2261800561,0961141271&borderWidth=1" alt="bar chart">

- URL:
  - /charts/bar

- Parameters:
  - value: Values of each bar, comma separate.
  - label: Name of each bar, comma separate.
  - barLabel: Title of the chart
  - backgroundColor: colours of each bar, comma separate
  - borderColor: border colour of each bar, comma separete
  - borderWidth: Size of the border of the each bar.

### Pie Chart

URL: https://chartgenerator.herokuapp.com/charts/generic/pie?values=12,19,3,17,28,24&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601&width=700&heigth=400&legend=position:bottom

<img src="https://chartgenerator.herokuapp.com/charts/generic/pie?values=12,19,3,17,28,24&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601&width=700&heigth=400&legend=position:bottom" alt="bar chart">

- URL:
  - /charts/generic/pie

- Parameters:
  - values: Values of each section of the pie, comma separate.
  - labels: Name of each bar, comma separate.
  - backgroundColor: colours of each pie section, comma separate

### Doughnut Chart

URL: https://chartgenerator.herokuapp.com/charts/generic/doughnut?values=56,34,10&labels=56%25%20Android,34%25%20iOS,10%25%20Web&backgroundColor=0241542021,0050640941,1940210751&width=400&height=200&legend=position:right

<img src="https://chartgenerator.herokuapp.com/charts/generic/doughnut?values=56,34,10&labels=56%25%20Android,34%25%20iOS,10%25%20Web&backgroundColor=0241542021,0050640941,1940210751&width=400&height=200&legend=position:right" alt="doughnut chart">

- URL:
  - /charts/generic/doughnut

- Parameters:
  - values: Values of each section of the doughnut, comma separate.
  - labels: Name of each section of the doughnut, comma separate.
  - backgroundColor: colours of each doughnut section, comma separate

### Polar area Chart

URL: https://chartgenerator.herokuapp.com/charts/generic/polarArea?values=12,19,3,17,28,24,7&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601,0520730941&width=700&heigth=400&legend=position:left

<img src="https://chartgenerator.herokuapp.com/charts/generic/polarArea?values=12,19,3,17,28,24,7&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601,0520730941&width=700&heigth=400&legend=position:left" alt="polar area chart">

- URL:
  - /charts/generic/polarArea

- Parameters:
  - values: Values of each section of the area, comma separate.
  - labels: Name of each section of the area, comma separate.
  - backgroundColor: colours of each area section, comma separate

## Testing

You can generate and test this chart on https://chartgenerator.herokuapp.com server
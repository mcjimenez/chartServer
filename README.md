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
  - legend: If you want that the labels of the graphics will be shown and the position
    legend=[display:[true|false],][position:[top|right|bottom|left]]

The colours are especified as RGB and Aplha in decimal value of three character (if the number is
smaller than 100 you should add a 0 at the right).
For example:
- #189ACA with an alpha of 0.4 will be: 0241542020.4
- #189ACA with an alpha of 1 will be: 0241542021

### Line Chart

<img src="https://chartgenerator.herokuapp.com/charts/line?backgroundColor=2551530000.0,2132362430.5&borderColor=1550741491,0361632061&values=410,400,410,600,400,500,380;380,580,450,430,570,600,800&labels=Minutes%20last%20mounth,Minutes%20this%20mounth&lineLabels=01,06,12,18,24,31,37&legend=display:true,position:bottom&disableCurve=1&width=700&heigth=400" alt="Line chart">

- Parameters:
  - backgroundColor: Colour under the line, if you don't want fill colour especify whatever colour with an alpha of 0.0. You have to specify as many colours as chart you are going to generate, this colour should be separated with commas ','
  - borderColor: Colour of the line that link the dots. You have to especify as colours (comma ',' separated) as graphics you are going to generate
  - value: Points of the graphic. If you want to generate more than one chart, separate its values with commas ','
  - labes: Label of each graphics (comma separate)
  - values: Values of the graphics. If you want more than one graphics separate the values of one graphic with comma and the values of one graphic from other with semicolon ';'
  - lineLabels: Label of the abscissa axis
  - disableCurve: If this parameter is included (doesn't matter its value) the graphics will be shown without curve in the values
## Testing

You can test this server
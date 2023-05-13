
var arrGraphX = [0];
var arrGraphY1 = [0];
var arrGraphY2 = [1];

var arrGraphX_old = [];
var arrGraphY1_old = [];
var arrGraphY2_old = [];

var trace1, trace2, data1, data2, source;

var updateData = true;
var displayGraph1 = true;
var displayGraph2 = true;  

if(typeof(EventSource) !== "undefined") 
{
  source = new EventSource("https://old.iolab.sk/evaluation/sse/sse.php");  
  source.addEventListener("message", function(e)
  {
    listenerFunctionContent(e);    
    });
}
else 
{
  document.getElementById("fetchedData").innerHTML = "Prehliadac nepodporuje poslane eventy";
}

function obnova()
{
  updateData = true;
  document.getElementById("terminovanie").style.display = "block";
  document.getElementById("obnova").style.display = "none";
  
  drawGraphs(); 
}

function terminovanie()
{
  updateData = false;
  document.getElementById("terminovanie").style.display = "none";
  document.getElementById("obnova").style.display = "block";
  
  arrGraphX_old = arrGraphX.slice();
  arrGraphY1_old = arrGraphY1.slice();
  arrGraphY2_old = arrGraphY2.slice();
}

function drawGraphs()
{
  trace1 = {
    x: (updateData == true) ? arrGraphX : arrGraphX_old,
    y: (updateData == true) ? arrGraphY1 : arrGraphY1_old,
    type: 'scatter',
    name: 'Zašumený sínus',
    line: {
      color: 'rgb(255, 153, 0)',
      width: 2
    }
  };
  
  trace2 = {
    x: (updateData == true) ? arrGraphX : arrGraphX_old,
    y: (updateData == true) ? arrGraphY2 : arrGraphY2_old,
    type: 'scatter',
    name: 'Zašumený kosínus',
    line: {
      color: 'rgb(153, 153, 255)',
      width: 2
    }
  };


  data1 = [trace1];
  data2 = [trace2];
  
  var layout = {
    title: 'Graf zašumeného sínusu a kosínusu',
    showlegend: true,
    yaxis: {fixedrange: true},
    xaxis: {fixedrange: true},
  };

  if (updateData == false) {
    layout.xaxis.fixedrange = false;
  }
  
  Plotly.newPlot(graph, [], layout);     
  
  if(displayGraph1 == true && displayGraph2 == true)
  {
    Plotly.addTraces(graph, data1);
    Plotly.addTraces(graph, data2);
  }
  else if(displayGraph1 == true && displayGraph2 == false)
  {
    Plotly.addTraces(graph, data1); 
  }
  else if(displayGraph1 == false && displayGraph2 == true)
  {
    Plotly.addTraces(graph, data2);  
  }  
}




function zasumenyCos()
{
  if(displayGraph2 == true)
  {
    displayGraph2 = false;
  }
  else
  {
    displayGraph2 = true;
  } 
  
  drawGraphs();
}

function zasumenySin()
{
  if(displayGraph1 == true)
  {
    displayGraph1 = false;
  }
  else
  {
    displayGraph1 = true;
  } 
  
  drawGraphs();
}

function listenerFunctionContent(e)
{
  var data = JSON.parse(e.data);
  document.getElementById("fetchedData").innerHTML = e.data;
  
  //ak sa zachyti aj (x = 0) tak prepis inicializacne hodnoty, inac vykresluj az od (x = 1)
  if(+data.x == 0)
  {
    arrGraphY1[0] = data.y1;
    arrGraphY2[0] = data.y2;    
  }
  else
  {
    arrGraphX.push(data.x);
    arrGraphY1.push(data.y1);
    arrGraphY2.push(data.y2);
  }
  
//   if(updateData == true)
//   {
//     drawGraphs();  
//   }  
    drawGraphs();
}



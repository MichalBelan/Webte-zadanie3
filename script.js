$(document).ready(function(){
   
    corporateData();
});

function test(xmlDocument) {
    // vytvorenie grafu
    var $xml = $(xmlDocument);

    $xml.find('zaznam').each(function () {
        var year;

        $(this).find('rok').each(function () {
            console.log(this);
            stlpcovyGraf.xaxis.categories.unshift(this.textContent);
            kolacGraf.subtitle.text = this.textContent;
            year = this.textContent.slice(-4);
            // console.log(year);
            plosnyGraf.xaxis.categories.unshift(this.textContent);
        })

        $(this).find('hodnotenie').each(function () {
            var vsetci = 0;
            var maliB = 0;

            $(this).children().each(function () {
                var aktualny = parseInt(this.textContent);

                if (this.tagName == 'B')
                    maliB += aktualny;

                vsetci += aktualny;

                kolacGraf.series.push(aktualny);
                kolacGraf.labels.push(this.tagName);

                stlpcovyGraf.series.find((x, i) => {
                    if (x.name == this.tagName) {
                        stlpcovyGraf.series[i].data.unshift(aktualny);
                        return;
                    }
                })   
            });

            //vlastny graf
            plosnyGraf.series[0].data.unshift(+(100 - (maliB / vsetci * 100)).toFixed(2));
        })
        

        //kolacovy
        let name = "#kolacovy" + year;
        // console.log(name);
        let div = document.querySelector(name);
        // console.log(div);
        var chart = new ApexCharts(div, kolacGraf);
        chart.render();
        kolacGraf.series = [];
        kolacGraf.labels = [];
    });

//stlpcovy
var chart2 = new ApexCharts(document.querySelector("#stlpcovy"), stlpcovyGraf);
chart2.render();

var chart3 = new ApexCharts(document.querySelector("#plosny"), plosnyGraf);
chart3.render();

};


//$(window).on('load', function () {
function corporateData() {

    $.ajax({
        url: 'data.xml',
        dataType: 'xml',
        success: function (xmlDocument) {
            test(xmlDocument)
        },
        error: function () {
            console.log('Nenacitalo xml document');
        }
    });

}
//});

var stlpcovyGraf = {

    chart: {
        type: 'bar',
        height: 500
    },

    series: [
        { name: 'A', data: [] },
        { name: 'B', data: [] },
        { name: 'C', data: [] },
        { name: 'D', data: [] },
        { name: 'E', data: [] },
        { name: 'FX', data: [] },
        { name: 'FN', data: [] },

    ],
    xaxis: {
        title:{
            text: 'Školský rok'
        },
        categories: []
          
    },
    yaxis: {
        title: {
            text: 'Študenti'
        }

    },
    legend: {
        position: 'top'
      },
    title: {
        text: 'Známky študentov',
        align: 'center'
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 0,
    },
    tooltip: {
        y: {
            formatter: function (value1) {
                if (value1 == 1) {
                    return value1 + "študent";
                } else {
                    return value1 + "študenti";
                }
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        position: 'front'
    },
    fill: {
        opacity: 1
    },
    legend: {
        show: false
    },
    responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 650
            },
            plotOptions: {
              bar: {
                horizontal: true
              }
            },
            xaxis: {
              title: {
                text: 'Počet študentov'
              }
            },
            yaxis: {
              title: {
                text: ''
              }
            },
            legend: {
              position: 'right',
            }
          }
        }
      ]

};


var kolacGraf = {
    chart: {
        type: 'pie',
        width: 380,
    },
    series: [],

    title: {
        text: 'Známky študentov',
        align: 'center'
    },
    tooltip: {
        y: {
            formatter: function (value1) {
                if (value1 == 1) {
                    return value1 + "študent";
                } else {
                    return value1 + "študenti";
                }
            }
        }
    },
    legend: {
        position: 'top'
    },
    subtitle: {
        text: '',
        align: 'center'
    },
    labels: []

};

var plosnyGraf = {
    chart: {
        height: 280,
        type: "area"
    },
    dataLabels: {
        enabled: false
    },
    series: [{ name: "Študentov", data: [] }],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
        }
    },
    xaxis: {
        categories: [],
    },
    yaxis: {
        labels: {
            formatter: function (value1) {

                return value1;

            }
        }
    },
    title: {
        text: 'Študenti ktorí mali B',
        align: 'left'
    },
    stroke: {
        curve: 'smooth',
    }


}



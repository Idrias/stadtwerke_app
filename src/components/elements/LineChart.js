import {Line} from 'vue-chartjs'

let timeFormat = 'DD/MM/YYYY';

function getCssVar(name) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(name);
}
let ct1 = getCssVar("--ct1")
let c2 = getCssVar("--c2");


export default {
  extends: Line,
  mounted () {
    this.renderChart({
        datasets: [
            /* 
                {
                    // Dataset
                    label: "Titel"
                    data: [
                        {x:0, y:0},
                        ...
                    ]
                    fill: false
                }
            */
            {

                label: "US Dates",
                data: [{
                    x: "04/01/2014", y: 175
                }, {
                    x: "10/01/2014", y: 175
                }, {
                    x: "04/01/2015", y: 178
                }, {
                    x: "10/01/2015", y: 17800
                }],
                fill: false,
                borderColor: c2,
            },
            {
                label: "UK Dates",
                data:  [{
                    x: "01/04/2014", y: 175
                }, {
                    x: "01/10/2014", y: 175
                }, {
                    x: "01/04/2015", y: 178
                }, {
                    x: "01/10/2090", y: 178
                }],
                fill:  false,
                borderColor: 'blue'
            }
        ]
    },
    {
        responsive: true,
        title:      {
            display: true,
            text:    "Chart.js Time Scale"
        },
        scales:     {
            xAxes: [{
                type:       "time",
                time:       {
                    format: timeFormat,
                    tooltipFormat: 'll'
                },
                scaleLabel: {
                    display:     true,
                    labelString: 'Date'
                },
                ticks: {
                    fontColor: ct1,

                }
            }],
            yAxes: [{
                scaleLabel: {
                    display:     true,
                    labelString: 'value'
                },
                ticks: {
                    fontColor: ct1,
                }
            }]
        }
    })}};




/* 

import {Line} from 'vue-chartjs'

export default {
  extends: Line,
  mounted () {
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#ffff00aa',
          data: [40, 39, 10, 40, 39, 80, 40]
        },{
          label: 'Data Two',
          backgroundColor: '#05CBE1',
          data: [60, 55, 32, 10, 2, 12, 53]
        }
      ]
    }, {responsive: true, maintainAspectRatio: false})

  }
}


*/
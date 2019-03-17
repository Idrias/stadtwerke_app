import { Line } from "vue-chartjs";

let timeFormat = "DD/MM/YYYY";

export default {
  extends: Line,
  props: {
    selectedMeter: Object,
    displayConsumption: Boolean,
    displayCost: Boolean,
  },
  data() {return({...this.$root.$data.sharedState})},

  mounted() {

    let ct1 = this.$root.getCssVar("--ct1");

    let data = {
      datasets: this.getData(),
    };

    let options = {
      
      // Responsiveness
      responsive: true,
      maintainAspectRatio: false,
      
      // Title
      title: {
        display: true,
        text: "Visualisierung der vorhandenen Daten für Zähler " + this.selectedMeter.mid + ".",
      },

      // Axes
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll"
            },
            scaleLabel: {
              display: true,
              labelString: "Datum"
            },
            ticks: {
              fontColor: ct1,
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Wert"
            },
            ticks: {
              fontColor: ct1,
            }
          }
        ]
      },

      // Straight lines
      // elements: {line: { tension: 0 }},
    };

    this.renderChart(data, options);
  },

  methods: {
    getData() {
      let returns = [];
      let datapoints = [];
      let relevantReadings = this.readings.filter(
        reading => reading.m_uuid == this.selectedMeter.uuid
      ).sort((a,b) => new Date(a.date) > new Date(b.date));

      if ( this.displayConsumption ) {
        // Get absolute reading values
        for (let reading of relevantReadings) {
          datapoints.push({
            x: new Date(reading.date),
            y: reading.value,
          })
        }
        returns.push({
          label: "Zählerstände absolut",
          data: datapoints,
          fill: false,
          borderColor: this.$root.getCssVar("--c2"),
        });
        datapoints = [];

        // Get consumption
        let startingVal = relevantReadings[0].value;
        for(let dp of returns[0].data) {
          datapoints.push({
            x: dp.x,
            y: dp.y - startingVal
          })
        }
        returns.push({
          label: "Verbrauch kumuliert",
          data: datapoints,
          fill: false,
          borderColor: this.$root.getCssVar("--c2high"),
        });
        datapoints = [];

        // Get consumption per timeframe
        for(let i in relevantReadings) {
          let current = relevantReadings[i];
          let next = relevantReadings[parseInt(i)+1];

          if(next) {
            datapoints.push({
              x: new Date(current.date),
              y: (next.value - current.value) / (new Date(next.date) - new Date(current.date)) * (1000*60*60*24*365)
            })
          }
          else
            datapoints.push({x: new Date(current.date), y: datapoints[datapoints.length-1].y});
        }
        returns.push({
          label: "Verbrauch pro Jahr",
          data: datapoints,
          fill: false,
          borderColor: "#7cd67c",
          steppedLine: true,
        });
        datapoints = [];
      }

      if ( this.displayCost ) {
        let relevantContracts = this.contracts.filter(contract => contract.m_uuid == this.selectedMeter.uuid).sort( (a,b) => new Date(a.start) > new Date(b.start));
        for(let event of [...relevantContracts, ...relevantReadings]) {
          let date = event.start ? event.start : event.date;
          date = new Date(date);

          let contract = this.getCurrentContract(date);
          let cons = this.getCurrentYearlyConsumption(date);

          /*
          console.log("---")
          console.log("Current contract")
          console.log(contract)
          console.log("Current consumption")
          console.log(cons)
          console.log(event)
          */
          let y = parseFloat(contract.costfix) + parseFloat(contract.costvar) * parseFloat(cons);
          console.log([y, date, contract.costfix, contract.costvar, cons]);
          if(cons) datapoints.push({x: date, y: y});
        }
        datapoints.push({x: new Date(/*current.date*/), y: datapoints[datapoints.length-1].y});
        returns.push({
          label: "Aktueller jährlicher Verbrauch",
          data: datapoints.sort( (a,b) => a.x > b.x),
          fill: false,
          borderColor: "#7cd67c",
          steppedLine: true,
        });

        datapoints = [];
        
        
      }
      return returns;
    },


    getCurrentContract(date) {
      return this.contracts.find(contract => new Date(contract.start) <= date && new Date(contract.end) >= date);
    },

    getCurrentYearlyConsumption(date) {
      
      let readings = this.readings.sort( (a,b) => new Date(a.date) > new Date(b.date));
      let r1 = readings.find(reading => new Date(reading.date) >= date);
      let r2 = readings.find(reading => new Date(reading.date) >= date && reading != r1);

      if(r2) {
        let cons = (r2.value - r1.value) / (new Date(r2.date) - new Date(r1.date)) * (365*24*60*60*1000)
        return cons;
      } 

    },
  }
};

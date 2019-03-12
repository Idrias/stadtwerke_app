<template>
	<ContentWrapper id="billing" :useInnerBox="false">

        <template #inner> 
            <div id="gridContainer">
                
                <div id="billSelectContainer" class="container shadow">
                    <h2> Abrechnungsauswahl </h2>
                </div>

                <div id="billContainer" class="container shadow">
                    <h2> Abrechnung </h2>
                    <p> Zeitraum: {{input.start}} - {{input.end}}</p>
                    <p> ({{getBillingDuration()}} Tage) </p>

                    <table>
                        <tr>
                            <td></td>
                            <td> Vertrag </td>
                            <td> Fixkosten </td>
                            <td> Variable Kosten </td>
                            <td> Gesamte Kosten </td>
                        </tr>

                        <tr v-for="(contract, index) of getAllData()" v-bind:key="index" v-bind:class="{noBorder: contract.categoryName != null}">
                            <td> {{contract.categoryName}} </td>
                            <td> {{contract.contract.cid}} <br> (Zähler {{contract.meter.mid}})</td>
                            <td> {{contract.fixCostPartial}} €</td>
                            <td> {{contract.estimatedVariableCost}} € <br> ({{contract.estimatedConsumption}} {{contract.unit}}) </td>
                            <td> {{contract.costTotal}} €</td>
                        </tr>
                    </table>

                    <h3> Gesamt </h3>
                </div>

                <div id="settingsContainer" class="container shadow">
                    <h2> Einstellungen </h2>

                    <form v-on:submit.prevent>
                        Abrechnungszeitraum
                        <table>
                            <tr>
                                <td>Start</td>
                                <td><input class="textinput" type="date" v-model="input.start" /></td>
                            </tr>
                            <tr>
                                <td>Ende</td>
                                <td><input class="textinput" type="date" v-model="input.end" /></td>
                            </tr>
                        </table>
                    </form> 
                </div>

            </div>
        </template>

	</ContentWrapper>
</template>

<script>
    import ContentWrapper from "./ContentWrapper.vue";

	export default {
		name: "ContentBilling",
		props: {},
		components: { ContentWrapper },
		data() {
			let el = {
                ...this.$root.$data.sharedState,
                input: {
                    end: new Date().toISOString().slice(0,10),
                    start: new Date((new Date()-(365*24*60*60*1000))).toISOString().slice(0,10),
                },
            };
			return el;
        },
        computed: {
            currentBill() {
                
            }
        },
		methods: {
            
            handleCategorySelected(category) {
                this.selectedCategory = category;
            },

            getBillingDuration() {
                return (new Date(this.input.end)- new Date(this.input.start)) / (60*60*24*1000);
            },

            getAllData() {
                console.log("executed 2");
                let data = []
                for(let category of this.categories) {
                    console.log(category);
                    let newData = this.getData(category.id);
                    if(newData.length > 0) newData[0].categoryName = category.name;
                    data = [...data, ...newData];
                }
                console.log(data);
                return data;
            },

            getData(category){
                console.log("executed")
                let contracts = []
                let billingStart =  new Date(this.input.start);
                let billingEnd = new Date(this.input.end);

                /* Get all contracts of category */ 
                /* Sort by beginDate & Filter: only contracts with start before billingEnd and end after billingStart */
                let filteredContracts = this.contracts
                                    .filter(
                                        contract => contract.category == category 
                                        && new Date(contract.start) < billingEnd 
                                        && new Date(contract.end) > billingStart
                                    )
                                    .sort( (a,b) => new Date(a.start)-new Date(b.start) );

                /* For each relevant contract */
                for(let contract of filteredContracts) {
                    // Get contract duration during billing time
                    let validFrom = Math.max(billingStart, new Date(contract.start));
                    let validTo = Math.min(billingEnd, new Date(contract.end));
                    let activeTime =  validTo - validFrom;

                    // Get connected meter
                    let meter = this.meters.find(meter => meter.uuid == contract.m_uuid);

                    // Get relevant readings
                    let readings = this.readings
                                    .filter(reading => reading.m_uuid == meter.uuid)
                                    .sort( (a,b) => new Date(a.date) - new Date(b.date) );

                    // ToDo better method
                    // Get average consumption
                    let firstReading = readings[0];
                    let lastReading = readings[readings.length-1];
                    let avgConsumption = (lastReading.value-firstReading.value) / ( new Date(lastReading.date) - new Date(firstReading.date) );
                    console.log(contract.costvar + " " + "?");
                    // Get estimated consumption
                    let estimatedConsumption = activeTime * avgConsumption;

                    // Get estimated variable cost
                    let estimatedVariableCost = estimatedConsumption * contract.costvar;

                    // Get fix cost
                    let fixCostPartial = activeTime / (365*24*60*60*1000) * contract.costfix;

                    contracts.push(
                        {
                            contract: contract,
                            meter: meter,
                            activeTime: activeTime,
                            estimatedConsumption: estimatedConsumption.toFixed(2),
                            estimatedVariableCost: estimatedVariableCost.toFixed(2),
                            fixCostPartial: fixCostPartial.toFixed(2),
                            costTotal: (fixCostPartial+estimatedVariableCost).toFixed(2),
                            validTo: new Date(validTo),
                            validFrom: new Date(validFrom),
                            unit: this.categories[category].unit
                        }
                    )
                }

                console.log(contracts);
                return contracts;

            },

		}
	};
</script>

<style scoped>
    
    #gridContainer {
        display: grid;
        width: 100%;
        height: 100%;

        grid-template-areas: "settings bill" "selector bill";        		
		grid-gap: 1%;
		grid-template-columns:  25% 75%;
        grid-template-rows: auto auto;
    }

    .container {
        background: var(--c4);
        color: var(--ct1);
        padding: 30px;
        width: 100%; 
        height: 100%;
        overflow: auto;
    }

    #billSelectContainer {
        grid-area: selector;
    }

    #billContainer {
        grid-area: bill;
    }

    #settingsContainer {
        grid-area: settings;
    }

    h3 {
        padding-top: 30px;
        color: var(--ct1);
    }

    table,tr,td {
        border: none;
    }

    .noBorder {
        border-top: solid 1px;
    }




</style>

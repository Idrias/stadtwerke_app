<template>
	<ContentWrapper id="billing" :useInnerBox="true">
        
        <template #outer>
            <ButtonBar
				v-bind:selectedCategory="selectedCategory"
				v-on:categorySelected="handleCategorySelected"
                v-bind:categories="categories"
			></ButtonBar>
        </template>

        <template #inner> 
                <h3> Einstellungen </h3>

                <p> Abrechnungszeitraum </p> <br>
                <form v-on:submit.prevent>
                    Start <input class="textinput" type="date" v-model="input.start"/>
                    <br>Ende <input class="textinput" type="date" v-model="input.end"/>
                </form>

                <p>{{getBillingDuration()}} Tage</p>
                <p>{{getData(0)}}</p>
                <br>
                
                <h3>Strom</h3>
                <h3>Gas</h3>
                <h3>Wasser</h3>
                <h3>Abwasser</h3>
        </template>
	</ContentWrapper>
</template>

<script>
    import ContentWrapper from "./ContentWrapper.vue";
    import ButtonBar from "../elements/ButtonBar.vue";

	export default {
		name: "ContentBilling",
		props: {},
		components: { ContentWrapper, ButtonBar },
		data() {
			let el = {
                ...this.$root.$data.sharedState,
                input: {
                    end: new Date().toISOString().slice(0,10),
                    start: new Date((new Date()-(365*24*60*60*1000))).toISOString().slice(0,10),
                },
            };
            el.categories = [{id:-1, name: "Einstellungen"}, ...el.categories, {id:5, name:"Gesamt"}];
            el.selectedCategory = el.categories[0];
			return el;
		},
		methods: {
            
            handleCategorySelected(category) {
                this.selectedCategory = category;
            },

            getBillingDuration() {
                return (new Date(this.input.end)- new Date(this.input.start)) / (60*60*24*1000);
            },

            getData(category){
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
                    let activeTime = Math.min(billingEnd, new Date(contract.end)) - Math.max(billingStart, new Date(contract.start));

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
                            estimatedConsumption: estimatedConsumption,
                            estimatedVariableCost: estimatedVariableCost,
                            fixCostPartial: fixCostPartial,
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
    
    #billingInner {
        height: 100%;
        width: 100%;
        background-color: var(--c4);
        color: var(--ct1);
        padding: 3%;
        overflow: auto;
    }
    
</style>

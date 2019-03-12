<template>
	<ContentWrapper id="meters" :useInnerBox="false">
		<template #outer>
			<ButtonBar
				v-bind:selectedCategory="selectedCategory"
				v-bind:categories="getCategories()"
				v-on:categorySelected="handleCategorySelected"
			></ButtonBar>
		</template>

		<template #inner>
			<div class="gridContainer">
				<div id="metersContainer" class="shadow">
					<h2>Zählerauswahl</h2>
					<br>
					<table v-if="getMeters().length > 0" id="metersTable">
						<tr>
							<th>Zählernummer</th>
							<th>Bemerkung</th>
							<!--<th> </th>-->
						</tr>
						<tr
							v-for="meter of getMeters()"
							v-bind:key="meter.uuid"
							v-on:click="selectMeter(meter)"
							v-bind:class="{selected: meter===selectedMeter}"
							@contextmenu="$refs.addMeter.openForChange(meter)"
						>
							<td>{{meter.mid}}</td>
							<td>{{meter.comment}}</td>
							<!--<td><i class="fas fa-pencil-alt"></i></td>-->
						</tr>
					</table>
					<p v-else>Noch keine Zähler hinzugefügt.</p>

					<AddButton v-on:click="addMeter"/>
				</div>

				<div id="readings" class="shadow">
					<h2>Ablesungen</h2>
					
					<br>


					<div v-if="selectedMeter != null && getReadings().length > 0">
						<table>
							<tr>
								<th>Datum</th>
								<th>Zählerstand</th>
								<th>Bemerkung</th>
							</tr>

							<tr
								v-for="reading of getReadings()"
								v-bind:key="reading.uuid"
								v-on:click="$refs.addReading.openForChange(reading)"
							>
								<td>{{reading.date}}</td>
								<td>{{reading.value}}</td>
								<td>{{reading.comment}}</td>
							</tr>
						</table>
					</div>
					<p v-if="selectedMeter == null">Bitte zunächst einen Zähler auswählen.</p>
					<p
						v-else-if="getReadings().length == 0"
					>Noch keine Ablesung für Zähler {{selectedMeter.mid}} eingetragen.</p>
					<AddButton v-if="selectedMeter != null" v-on:click="addReading"/>

					<p v-if="selectedMeter && selectedMeter.producesDirtyWater" id="abwasserNotice">Eingetragene Zählerstände werden für Abwasserkosten berücksichtigt.</p> 
					
					
				
				</div>
			</div>

			<AddMeter
				ref="addMeter"
				v-on:meterDeleted="handleMeterDeleted"
				v-on:meterChanged="handleMeterChanged"
			/>
			<AddReading ref="addReading"/>
		</template>
	</ContentWrapper>
</template>

<script>
	import ButtonBar from "../elements/ButtonBar.vue";
	import ContentWrapper from "./ContentWrapper.vue";
	import AddButton from "../elements/AddButton.vue";
	import AddMeter from "../dialogues/AddMeter.vue";
	import AddReading from "../dialogues/AddReading.vue";

	export default {
		name: "ContentMeters",
		props: {},
		components: { ButtonBar, ContentWrapper, AddButton, AddMeter, AddReading },
		data() {
			let el = {
				...this.$root.$data.sharedState,
				selectedMeter: null
			};
			el.selectedCategory = el.categories[0];
			return el;
		},
		methods: {
			handleCategorySelected(category) {
				this.selectedCategory = category;
				this.selectedMeter = null;
			},

			handleMeterDeleted(uuid) {
				console.log("look");
				if (uuid == this.selectedMeter.uuid) this.selectedMeter = null;
			},

			handleMeterChanged(data) {
				if (data.uuid_old == this.selectedMeter.uuid) {
					let newMeter = this.meters.find(
						meter => meter.uuid == data.uuid_new
					);
					if (newMeter) this.selectedMeter = newMeter;
				}
			},

			addMeter() {
				this.$refs.addMeter.openNewMeter(this.selectedCategory.id);
			},

			addReading() {
				this.$refs.addReading.openNewReading(this.selectedMeter.uuid);
			},

			getMeters() {
				return this.meters.filter(m => m.category == this.selectedCategory.id || this.selectedCategory.id==3 && m.producesDirtyWater)
			},

			getReadings() {
				let returns = [];
				for (let reading of this.readings) {
					if (reading.m_uuid == this.selectedMeter.uuid)
						returns.push(reading);
				}
				return returns;
			},

			selectMeter(meter) {
				console.log("Selecting " + meter);
				this.selectedMeter = meter;
			},

			getCategories() {
				return this.categories.filter(cat => cat.meterRelevant);
			}
		}
	};
</script>

<style scoped>
	#metersContainer {
		width: 100%;
		min-width: 30%;
		grid-row: 1;
		grid-column: 1;
		background-color: var(--c4);
		justify-self: center;
		padding: 30px;
		/*resize: horizontal;
	  overflow: auto;*/
	}

	#readings {
		width: 100%;
		min-width: 100%;
		justify-self: center;
		background-color: var(--c4);
		padding: 30px;
	}

	#abwasserNotice {
		margin-top: 30px;
	}

	#metersTable {
		table-layout: fixed;
	}

	table {
		width: 100%;
	}

	td {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.gridContainer {
		height: 95%;
		width: 100%;
		color: var(--ct1);

		overflow: auto;
		display: grid;

		grid-template-rows: auto;
		grid-gap: 1%;
		grid-template-columns: minmax(332px, 35%) auto;
		/*grid-template-columns: 0.3fr auto;*/
	}

	.selected {
		background-color: var(--c3) !important;
	}

	tr:not(:first-child):hover {
		background-color: var(--cm34);
	}
</style>

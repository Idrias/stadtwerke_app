<template>
  <div id="darkOverlay" v-if="show" v-on:click="$emit('close')">
    <div id="dialogueWindow" class="shadow" v-on:click.stop>
      
      <h2 v-if="title" id="title"> {{title}} </h2>
      <slot></slot>

    </div>
  </div>
</template>

<script>

export default {
  name: "DialogueWrapper",

  props: {
    title: String,
    show: Boolean
  },

  data() {
    return {
      
    }
  },

  methods: {
  }
};
</script>

<style scoped>
#darkOverlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
}

#dialogueWindow {
  width: 50%;
  max-height: 80%;
  background-color: var(--c3);
  color: var(--ct1);
  padding: 30px;
  box-sizing: border-box;
  margin-left: 32.5%;
  margin-top: 5%;
  overflow-y: auto;
}



input {
  background-color: var(--c4);
  border: none;
}

table {
  margin: 0px auto;
  width: 70%;
  
}

button {
  background-color: var(--c2);
  border: 0;
  width: 30%;
  height: 30px;
  margin: 8px;
}

button:hover {
  background-color: var(--c2hover);
  cursor: pointer;
}

tr,
td {
  height: 40px;
}

tr,td,th {
  border-bottom: none;
}

tr:hover,td:hover,th:hover {
  background-color: var(--c3);
  cursor: auto;
}

form {
  margin: 10px;
}

.textinput {
  height: 25px;
  width: 100%;
  color: var(--c2);
}

.radiotd {
  width: 70px;
  max-width: 70px;
}

#buttonBar {
  margin-top: 20px;
}

select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 25px;
  color: var(--c2);
  background-color: var(--c4);
}

select::-ms-expand {
  display: none;
}

</style>

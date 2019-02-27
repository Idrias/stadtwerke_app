<template>
  <div id="contracts">
      <div class="shadow" id="buttonbar">
        <div class="button" id="strombutton">Strom</div>
        <div class="button" id="gasbutton">Gas</div>
        <div class="button" id="wasserbutton">Wasser</div>
        <div class="button" id="abwasserbutton">Abwasser</div>
      </div>


      <div class="shadow" id="content">
        <h2>Verträge</h2>
        <table>
          <tr><td>Vertrag 1</td><td>1245123</td><td>3€/kwh</td></tr>
          <tr>Vertrag 2</tr>
          <tr>Vertrag 3</tr>
        </table>
      </div>

  </div>
</template>

<script>
let categories = [
  {name: "Strom", color: ""}
]


export default {
  name: "ContentContracts",
  props: {},
  data() {
    return {
      apple: "red",
    }
  }
};
</script>

<style scoped>
#contracts {
  width: 100%;
  height: 100%;
  padding: 2%;
  box-sizing: border-box;
  
}

#buttonbar {
  height: 5%;
  width: 100%;
  background-color: green;
  display: flex;
  margin-bottom: 10px;
}

#content {
  height: 95%;
  width: 100%;
  background-color: lightyellow;
}

/*
#strombutton {background-color: lightyellow;}
#gasbutton {background-color: darkgray;}
#wasserbutton {background-color: lightblue;}
#abwasserbutton {background-color: burlywood;}
*/
#strombutton {background-color: rgb(155, 236, 68);}
#gasbutton {background-color: #70ad47;}
#wasserbutton {background-color: #70ad47;}
#abwasserbutton {background-color: #70ad47; border-right: 0px}

.shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.button {
  width: 25%;
  float: left;
  border-right: 1px solid;
  display: grid;
  align-content: center;
  transition: background-color .4s ease-in-out;
}

.button:hover {
  background-color: rgb(146, 208, 80) !important;
  cursor: pointer;
}

table {width: 100%;}

</style>

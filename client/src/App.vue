<template>
  <div id="app">
    <web-map id="mapComponent" ref="map" :coords="coords"/>

    <div class="datediv">
     <b-form-datepicker id="datepicker" v-model="date" class="mb-2"></b-form-datepicker>
     </div>
            <div class="maincontent">
         
                    <b-form-input class="mainItem" type="text" placeholder="fish type" v-model="fishType"></b-form-input>
                    <b-button class="btn-block center" @click="updateCenter()" variant="primary">log new fish</b-button>
              </div>
         </div>
</template>

<script>
import WebMap from "./components/webmap";
const axios = require('axios').default;

export default {
  name: "App",
  components: {
    WebMap
  },
  data: () => ({
    coords: {
      latitude: -76.7688704,
      longitude: 36.403330,
    },

    date: '',
    fishType: '',
    allFish: []

  }),

  methods: {

     fetchFishLocations(){
         const that = this
         axios.get('http://localhost:3000/allFish')
            .then(function (response) {
              // handle success
              console.log(response.data.fish);
              that.allFish = response.data.fish
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .finally(()=>console.log('fetched fish successfully'))
    },

     addFishToDb(){
       console.log(this.coords.latitude,this.coords.longitude)
       fetch('http://localhost:3000/addFish',{
         method: 'POST', 
         headers: {
            'Content-Type': 'application/json',
          },
       
       body: JSON.stringify({
            coords: [this.coords.latitude,this.coords.longitude],
            date: this.date,
            species: this.fishType
         }) 
      })
       .then((response)=>{
         console.log(response)
         return response
       })
    },
  
    async updateCenter() {
      await this.getLocation();
      this.addFishToDb()
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
        
            this.coords.latitude = position.coords.latitude,
            this.coords.longitude = position.coords.longitude
         
        });
      } else {
        console.log("Geolocation not supported by your browser.");
      }
    }
  },
};
</script>
<style lang="scss" src="bootstrap-scss/bootstrap.scss"></style>
<style lang="scss">
#app {
  display: flex;
  min-height: 100vh;
  width: 65%;
  margin: 2em auto;
  flex-direction: column;
  > *:first-child {
    flex-grow: 1;
  }
  #mapComponent{
    border: 1px solid black;
    margin: 0 auto;
    margin-bottom: 1em;
    width: 50%;
  }
  #datepicker{
    width: 20%;
  }
 
  .maincontent{
    width: 50%;
    margin: 0 auto;
    display: block;
    padding: 1em;
  }
  .datediv{
    width: 50%;
    margin: 0 auto;
  }
  .maincontent div{
    justify-content: center;
  }
  .mainItem{
    width: 100%;
    margin: 0 auto;
    margin-bottom: .7em;
  }
}
</style>
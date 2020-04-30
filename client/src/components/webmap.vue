<template>
  <div></div>
</template>

<script>
import { loadModules } from "esri-loader";
const axios = require('axios').default;
let E = {}; // placeholder for Esri modules
// (could have used `this`, but it didn't feel right...)
export default {
  name: "web-map",
  props: {
    coords: {
      type: Object,
      required: true
    },
  },
  data: function() {
    return {
      view: null,   
    };
  },
  mounted() {
      
    loadModules([
        "esri/Map", 
        "esri/views/MapView", 
        "esri/geometry/Point", 
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
        ], {
      css: true
    })
  
    .then(([ArcGISMap, MapView, Point, Graphic, GraphicsLayer]) => {
      E.ArcGISMap = ArcGISMap;
      E.MapView = MapView;
      E.Point = Point;
      E.Graphic = Graphic;
      E.GraphicsLayer = GraphicsLayer

      const map = new E.ArcGISMap({
        basemap: "topo-vector"
      });

      this.view = new E.MapView({
        container: this.$el,
        map: map,
        center: [this.coords.latitude, this.coords.longitude],
        zoom: 4
      })
 
             
      this.view.when(function(){
              var fish = null
             axios.get('http://localhost:3000/allFish')
                  .then(function (response) {
                    fish = response.data.fish
                  })
             
                  .then(()=>{
                      console.log('map loaded',fish)
                      var graphicsLayer = new E.GraphicsLayer()
                    
                        for(let i = 0; i < fish.length; i++){
                             let point = {type: "point", longitude: fish[i].coords[0], latitude: fish[i].coords[1] };
                                  var simpleMarkerSymbol = {
                                      type: "simple-marker",
                                      color: [226, 119, 40],  // orange
                                      outline: { color: [255, 255, 255], width: 1 }
                                  };

                                let graphic = new E.Graphic({ geometry: point, symbol: simpleMarkerSymbol}); //graphics need unique names
                    
                                graphicsLayer.add(graphic);       
                            }
                        map.add(graphicsLayer);
                  })
         
          }, 

          function(error){
            console.log("The view's resources failed to load: ", error);
          });
                      
    })
   
  },
  watch: {
    coords() {
      this.showPos();
    },
  },
  beforeDestroy() {
    if (this.view) {
      this.view.container = null;
    }
  },
  methods: {
    showPos() {
      if (E.Point) {
        const point = new E.Point(this.coords.longitude, this.coords.latitude);
        this.view.goTo({ center: point });
      } else {
        console.log("Map modules are still loading...");
      }
    },
  }
};
</script>


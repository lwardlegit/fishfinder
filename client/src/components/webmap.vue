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
      fish: []      
    };
  },
  mounted() {
      const that = this

    axios.get('http://localhost:3000/allFish')
            .then(function (response) {
              that.fish = response.data.fish
            })
            .then(()=>{

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

      //make axios call
  
      const map = new E.ArcGISMap({
        basemap: "topo-vector"
      });

      this.view = new E.MapView({
        container: this.$el,
        map: map,
        center: [this.coords.latitude, this.coords.longitude],
        zoom: 3
      })
        var graphicsLayer = new GraphicsLayer(); 

      for(let i = 0; i < this.fish.length; i++){
        console.log('fish[i]',this.fish[i].coords[0],this.fish[i].coords[1], i)

                 let point = {type: "point", longitude: this.fish[i].coords[0], latitude: this.fish[i].coords[1] };

                  var simpleMarkerSymbol = {
                      type: "simple-marker",
                      color: [226, 119, 40],  // orange
                      outline: { color: [255, 255, 255], width: 1 }
                  };

                 window['graphic'+i] = new Graphic({ geometry: point, symbol: simpleMarkerSymbol}); //graphics need unique names
                graphicsLayer.add(window['graphic'+i]);        
            }
            map.add(graphicsLayer); 
             
               
    })
  });
   
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


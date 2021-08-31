class store{
  constructor(city,name,country,longitude,latitude,store_id) {
    this.city=city;
    this.name=name;
    this.country=country;
    this.longitude=longitude;
    this.latitude=latitude;
    this.store_id=store_id;
    }
  }

var source= new ol.source.Vector({
});
var vector= new ol.layer.Vector({
  source:source
});


var tileLayer = new ol.layer.Tile({
  source: new ol.source.OSM({
    wrapX: false,
  }),
});


var map = new ol.Map({
  target: 'map',
  layers:[tileLayer,vector],

  view: new ol.View({
    center: ol.proj.fromLonLat([114.20169067382812,22.340700149536133]),
    zoom: 15

  })
});

countryAfterFilter=[]
 var locations  = [] 

async function fetchDataAsync(url) {
   const response = await fetch(url);
  // console.log(await response.json());
   myJson = await response.json()
   var k=0
   for( var i=0 ; i<myJson.length ; i++){
     locations.push({city: myJson[i].city, name:myJson[i].name,country: myJson[i].country,longitude: myJson[i].longitude,
      latitude: myJson[i].latitude,store_id: myJson[i].store_id});
      DrawPoints(locations[i].longitude,locations[i].latitude);
      if(!countryAfterFilter.includes(locations[i].country)){
         countryAfterFilter[k]=locations[i].country;
         k++
       }

   }
  updateweb()
}

function updateweb(){
  
 for (let i=0; i<countryAfterFilter.length;i++){
   console.log(countryAfterFilter[i]);
   var optionText=countryAfterFilter[i];
   $('#countries').append(new Option(optionText, i));
 }
 const sb = document.querySelector('#countries')
 btn.onclick = (event) => {
    
     event.preventDefault();
     chanceCenter(countryAfterFilter[sb.selectedIndex])

 };
}


function printBtn() {
   fetchDataAsync('https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json');
  
}

var pointStyle= new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({
      color: 'rgb(255,0,0)'
    }),
    stroke: new ol.style.Stroke({
      color: 'rgb(255,0,0)',
     width: 0.5   
     }),
  })
});



function DrawPoints(x,y){
        console.log(x+","+y)
        var geom= new ol.geom.Point(ol.proj.fromLonLat([x,y]));
        var feat= new ol.Feature(geom);
        feat.setStyle(pointStyle);
        source.addFeature(feat);
  
}


function chanceCenter(selected_country){
  let sumX=0;
  let sumY=0;
  let counter=0;
    for(let i=0;i<locations.length;i++){
      if(locations[i].country == selected_country){
        console.log(locations[i].longitude+" and "+locations[i].latitude)
         sumX=sumX+ locations[i].longitude;
         sumY=sumY+ locations[i].latitude;
         counter=counter+1;
         
     
      }
     
    }
    console.log("sumx is= "+sumX/counter+"and"+"sumY is:"+sumY/counter)
    map.getView().setCenter(ol.proj.transform([(sumX/counter), (sumY/counter)], 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(5.55);
    
}
  


///////////////// Bonus
function CheckCordinate() {
  var retVal = prompt("Enter longitude  : ", "");
  var retVal2 = prompt("Enter latitude : ", "");
  var retVal3 = prompt(" 3-letter code of a country: ", "");

  flag=0;
  for(let i=0;i<locations.length;i++){
    if(locations[i].longitude==retVal && locations[i].latitude==retVal2 && retVal3.includes(locations[i].country)){
      alert("Starbacks Store in the given location")
      flag=1;
    }
  }
  if(flag==0){
    alert("Starbacks Store in not in the given location")
  }

  
}




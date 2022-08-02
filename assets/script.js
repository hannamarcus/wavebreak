

// loc ---> store loc ---> get data ---> check lat/lon ---> compare ----> return top 5
var beachList = [];
var poslat= ""
var poslon= ""

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}
//finding the entered lat/lon

$("#searchBeach").on("click", function (){
    var searchVal=$("#searchVal").val();
    var weatherAPIurl="http://api.openweathermap.org/geo/1.0/direct?q="+searchVal+"&appid=d572ae73424a51099cdef316a3e66b68"
    fetch(weatherAPIurl).then(function(res){
      return res.json();
    }).then(function(data){
      poslat= data[0].lat
      poslon= data[0].lon
      getBeachdata();
    })
      
   });

// function fetchCoords(url){

// }

//pulling data from the coastal api
function getBeachdata(){

$.ajax({
    url: "https://api.coastal.ca.gov/access/v1/locations/",
    method: "GET"    
}).then (function (res){
    

    
   

    for (var i = 0; i < res.length ; i++) {
        // if this location is within 0.1KM of the user, add it to the list
        if (distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K") <= 20) {
            // text += '<p>' + res[i].NameMobileWeb + " "+ distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K") +'</p>';
            // console.log(text)
            var beach= {
              beachName: res[i].NameMobileWeb,
              beachDistance: distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K"),            
            }
            beachList.push(beach);
        }
    }
    beachList.sort(function(a,b){
    return a.beachDistance-b.beachDistance
    })

  console.log(beachList)
  var text = ""
  for (var i = 0; i < 4 ; i++){
    text += '<div>' + beachList[i].beachName + " "+ beachList[i].beachDistance + '<img src='+ res[i].Photo_1 + '>' + '</div>';
  }

 $('#tempDisplay').append(text);   

  })};

 
  const swiper = new Swiper('.swiper', {
    // Optional parameters

  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });

var selectAreaList = document.getElementById("selectArea");
var bikeStopList = document.querySelector('.bikeStopMessage');
//map
var map = L.map("map", {
  center: [22.62094199479303, 120.31185614733077],
  zoom: 17,
});
map.locate({
  setView: true,
  maxZoom: 17,
});
map.on('locationfound' , function(e){
  L.marker(e.latlng).addTo(map).bindPopup('目前位置');
});
map.on('locationerror' , function(e){
  console.log("無法定位" , e);
})
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
}).addTo(map);
L.Control.geocoder().addTo(map);

//icon
var greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var greyIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var markers = new L.MarkerClusterGroup().addTo(map);

//data
var bikeStop = [];
var selectArea = [];
var xhr = new XMLHttpRequest();
xhr.open('get','https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092',true);
xhr.send(null);
xhr.onload = function(){
  const data = JSON.parse(xhr.responseText);
  bikeStop = data.data.retVal;
  // console.log(bikeStop);
  getBikeStopList();
  getAreaList();
}
function getAreaList(){
  let areaList = [];
  let str = `<option value="請選擇行政區">-----請選擇行政區-----</option>`;
  for(let i = 0 ; i < bikeStop.length ; i++){
    areaList.push(bikeStop[i].sarea);
  }
  areaList.forEach(function(value){
    if(selectArea.indexOf(value) == -1){
      selectArea.push(value);
    };
  });
  for(let j = 0 ; j < selectArea.length ; j++){
    str += `<option value="${selectArea[j]}">${selectArea[j]}</option>`;
  }
  selectAreaList.innerHTML = str;
};


function getBikeStopList(){
  let str = '';
  let bikeIcon;
  for (let i = 0; i < bikeStop.length; i++) {
    str += `<div class="card bikeStopList">
              <div class="card-body">
                <div class="bike-stop-name">
                  <h5 class="card-title">${bikeStop[i].sna.substring(11, 30)}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${bikeStop[i].ar}</h6>
                  <a class="card-text checkLocation" data-name="${bikeStop[i].sna.substring(11,30)}" data-location="${bikeStop[i].lat},${bikeStop[i].lng}" data-sbi="${bikeStop[i].sbi}" data-bemp="${bikeStop[i].bemp}">查看位置
                </a>
                </div>
                <div class="row bikeAccount justify-content-center">
                  <div class="bike-rent">
                    <h5>可借</h5><h3>${bikeStop[i].sbi}</h3>
                  </div>
                  <div class="bike-stop">
                    <h5>可停</h5><h3>${bikeStop[i].bemp}</h3>
                  </div>
                </div>
              </div>
            </div>`;
    
    bikeStopList.innerHTML = str;
    if (bikeStop[i].bemp == 0) {
      bikeIcon = redIcon;
    } else if (bikeStop[i].sbi == 0) {
      bikeIcon = greyIcon;
    } else {
      bikeIcon = greenIcon;
    };
    markers.addLayer(L.marker([bikeStop[i].lat, bikeStop[i].lng], { icon: bikeIcon }).stopPropagetion().bindPopup(`<span>${bikeStop[i].sna.substring(11, 30)}</span><br/><span>可借：${bikeStop[i].sbi}</span><span>可停：${bikeStop[i].bemp}</span>`).openPopup());
  };
  map.addLayer(markers);
}

for(let n = 0 ; n < bikeStop.length ; n++){
  if(bikeStop[i].sbi == 0){
    document.getElementById('bike-rent').style.background="#7B7B7B";
  };
}

//下拉式選單
selectAreaList.addEventListener('change' , areaSelected , false);
function areaSelected(){
  let select = selectAreaList.value;
  let len = bikeStop.length;
  let str = '';
  for(let i = 0 ; i < len ; i++){
    if(select == bikeStop[i].sarea){
      console.log(select);
      str += `<div class="card bikeStopList">
                <div class="card-body">
                  <div class="bike-stop-name">
                    <h5 class="card-title">${bikeStop[i].sna.substring(11, 30)}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${bikeStop[i].ar}</h6>
                    <a class="card-text checkLocation" data-name="${bikeStop[i].sna.substring(11, 30)}" data-location="${bikeStop[i].lat},${bikeStop[i].lng}" data-sbi="${bikeStop[i].sbi}" data-bemp="${bikeStop[i].bemp}">查看位置
                  </a>
                  </div>
                  <div class="row bikeAccount justify-content-center">
                    <div class="bike-rent">
                      <h5>可借</h5><h3>${bikeStop[i].sbi}</h3>
                    </div>
                    <div class="bike-stop">
                      <h5>可停</h5><h3>${bikeStop[i].bemp}</h3>
                    </div>
                  </div>
                </div>
              </div>`;
      bikeStopList.innerHTML = str;
      map.setView([bikeStop[i].lat , bikeStop[i].lng]);
    };
    
  };
};

//查看位置click function
bikeStopList.addEventListener('click' , updateData , false);
function updateData(e){
  let select = e.target.dataset.location;
  let str = select.split(`,`);
  let lat = parseFloat(str[0]);
  let lng = parseFloat(str[1]);
  let tempName = e.target.dataset.name;
  let location = [lat , lng];
  let sbi = e.target.dataset.sbi;
  let bemp = e.target.dataset.bemp;
  let bikeIcon;
  map.setView(location , 20);
  if (bemp == 0) {
    bikeIcon = redIcon;

  } else if (sbi == 0) {
    bikeIcon = greyIcon;
  } else {
    bikeIcon = greenIcon;
  };
  L.marker(location,{ icon: bikeIcon }).addTo(map).bindPopup(`<span>${tempName}</span><br/><span>可借：${sbi}</span><span>可停：${bemp}</span>`).openPopup();
};

var selectArea = document.getElementById("selectArea");
var bikeStopMessage = document.querySelector('.bikeStopMessage');


//map
var map = L.map('map', {
  center: [22.62094199479303, 120.31185614733077],
  zoom: 16
});
map.on('click' , stopPop);
function stopPop(){
  map.originalEvent.preventDefault();

}
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
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
var bikeStopList = [];
var selectAreaList = []

var xhr = new XMLHttpRequest();
xhr.open('get', 'https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092' , true);
xhr.send(null);
xhr.onload = function(){
  const data = JSON.parse(xhr.responseText);
  bikeStopList = data.data.retVal;
  //console.log(bikeStopList);
  getAreaList();
  getBikeStopList();
}
//下拉式選單
function getAreaList(){
  let areaList = [];
  let str = `<option value="請選擇行政區">-----請選擇行政區-----</option>`;
  for (let i = 0; i < bikeStopList.length; i++) {
    areaList.push(bikeStopList[i].sarea);
  }
  areaList.forEach(function (value) {
    if (selectAreaList.indexOf(value) == -1) {
      selectAreaList.push(value);
    };
  });
  for (let j = 0; j < selectAreaList.length; j++) {
    str += `<option value="${selectAreaList[j]}">${selectAreaList[j]}</option>`;
  }
  selectArea.innerHTML = str;
};
//列表
function getBikeStopList(){
  let str = '';
  let bikeIcon;
  for (let i = 0; i < bikeStopList.length; i++) {
    str += `<div class="card bikeStopList">
              <div class="card-body">
                <div class="bike-stop-name">
                  <h5 class="card-title">${bikeStopList[i].sna.substring(11, 30)}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${bikeStopList[i].ar}</h6>
                  <a class="card-text checkLocation" data-name="${bikeStopList[i].sna.substring(11, 30)}" data-location="${bikeStopList[i].lat},${bikeStopList[i].lng}" data-sbi="${bikeStopList[i].sbi}" data-bemp="${bikeStopList[i].bemp}">查看位置
                </a>
                </div>
                <div class="row bikeAccount justify-content-center">
                  <div class="bike-rent">
                    <h5>可借</h5><h3>${bikeStopList[i].sbi}</h3>
                  </div>
                  <div class="bike-stop">
                    <h5>可停</h5><h3>${bikeStopList[i].bemp}</h3>
                  </div>
                </div>
              </div>
            </div>`;
    bikeStopMessage.innerHTML = str;
    if (bikeStopList[i].bemp == 0) {
      bikeIcon = redIcon;
    } else if (bikeStopList[i].sbi == 0) {
      bikeIcon = greyIcon;
    } else {
      bikeIcon = greenIcon;
    };
    markers.addLayer(L.marker([bikeStopList[i].lat, bikeStopList[i].lng], { icon: bikeIcon }).bindPopup(`<h5>${bikeStopList[i].sna.substring(11, 30)}</h5><br/><span>可借：${bikeStopList[i].sbi}</span><span>可停：${bikeStopList[i].bemp}</span>`));
    
  };
};

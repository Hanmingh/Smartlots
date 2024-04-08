document.getElementById('findParkingBtn').addEventListener('click', function() {
    const url = 'https://park.mydawg.top/park/nearby?latitude=1.287688&longitude=103.792252';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            
            //console.log(data);
            fetch(url, {
                method: 'GET',
                header:{
                    "latitude" : lat,
                    "longitude": long
                }
            })
            .then(response => response.json())
            .then(lists => {
                const parkingList = document.getElementById('parkingLotsList');
                parkingList.innerHTML = '';
                lists.info.forEach(parking => {
                    const div = document.createElement('div');
                    div.className = 'parkingLot';
                    div.textContent = `${parking.name} - ${parking.distance} away`;
                    div.onclick = () => selectParking(parking.id, parking.name, parking.rate);
                    parkingList.appendChild(div);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

});

function selectParking(id, name, rate) {
    console.log(id);
    document.getElementById('parkingName').textContent = name;
    document.getElementById('parkingRate').textContent = rate;
    const selectedParkingDiv = document.getElementById('selectedParking');
    selectedParkingDiv.style.display = 'block';

    document.getElementById('calculateCostBtn').onclick = () => calculateCost(id);
}
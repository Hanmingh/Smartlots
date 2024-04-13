const slideValue = document.querySelector("span");
const inputSlider = document.querySelector('input[type="range"]');
inputSlider.oninput = (()=>{
    let value = inputSlider.value/2 + " hour";
    slideValue.textContent = value;
    slideValue.style.left = (value/2) + "%";
    slideValue.classList.add("show");
});
inputSlider.onblur = (()=>{
    slideValue.classList.remove("show");
});


document.getElementById('searchBttn').addEventListener('click', function() {        
    const url = 'https://park.mydawg.top/park/nearby?latitude=1.287688&longitude=103.792252'; //api url
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            
            const carType = document.getElementById('vehicle_type').value;
            const startTime = document.getElementById('startTime').value;
            const parkingTime = document.getElementById('parkingTime').value/2;

            fetch(url, {
                method: 'GET',
                header:{
                    "latitude" : lat,
                    "longitude": long,
                    "car_type": carType,
                    "start_time": startTime,
                    "parking_time": parkingTime
                }
            })
            .then(response => response.json())
            .then(lists => {
                const container1 = document.getElementById('container1');
                
                const container2 = document.createElement('section');
                container2.className = "container";
                container2.id = "container2";
                container2.innerHTML = `<pre>
                <header>Lots Recommendation</header>
                <div class="gallery" id="gallery"></div>
                </pre>`;
                container1.append(container2);
                
                const parkingList = document.getElementById('gallery');
                parkingList.innerHTML = '';

                lists.info.forEach(parking => {
                    const content = document.createElement('div');
                    content.className = "content";

                    const iframe = document.createElement('iframe');
                    const mapUrl = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3ayi6JhrwzOgwx6eBrRM4Lnxb-ylaSzQ&origin="+lat+","+long+"&destination="+parking.latitude+","+parking.longitude;
                    iframe.src = mapUrl;
                    content.appendChild(iframe);

                    const h3 = document.createElement('h3');
                    h3.textContent = parking.name;
                    content.appendChild(h3);

                    const h5 = document.createElement('h5');
                    h5.textContent = parking.distance;
                    content.appendChild(h5);
                    
                    content.onclick = () => selectParking(parking.id, parkingTime);
                    parkingList.append(content);
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

function selectParking(id, parkingTime) {
    const url = 'https://park.mydawg.top/park/predict?id=362&from=1679965200&to=1679976000';

    fetch(url, {
        method: 'GET',
        header:{
            "id" : id,
            "parking_time": parkingTime
        }
    })
    .then(response => response.json())
    .then(info => {
        console.log(info);
    });
}
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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            
            const carType = document.getElementById('vehicle_type').value;
            const startTime = document.getElementById('startTime').value;
            const parkingTime = document.getElementById('parkingTime').value/2;

            //lat = 1.234222;
            //long = 103.615090; //test location

            const url = 'https://park.mydawg.top/park/nearby?latitude=' + lat + '&longitude='+ long; //api url

            fetch(url, {
                method: 'GET',
                header:{
                    "car_type": carType,
                    "start_time": startTime,
                    "parking_time": parkingTime
                }
            })
            .then(response => response.json())
            .then(lists => {
                const container1 = document.getElementById('container1');
                //container1.removeChild;
                
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
                    const placeUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyD3ayi6JhrwzOgwx6eBrRM4Lnxb-ylaSzQ&q="+parking.latitude+","+parking.longitude;
                    const direcUrl = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3ayi6JhrwzOgwx6eBrRM4Lnxb-ylaSzQ&origin="+lat+","+long+"&destination="+parking.latitude+","+parking.longitude;
                    iframe.src = placeUrl;
                    content.appendChild(iframe);

                    const h3 = document.createElement('h3');
                    h3.textContent = parking.name;
                    content.appendChild(h3);

                    const h5 = document.createElement('h5');
                    h5.textContent = parking.distance;
                    content.appendChild(h5);

                    const sh5 = document.createElement('h5');
                    sh5.textContent = "Rate: " + parking.rate;
                    content.appendChild(sh5);
                    
                    content.onclick = () => selectParking(parking.id, parkingTime, direcUrl);
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

function selectParking(id, parkingTime, mapUrl) {
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
        const container2 = document.getElementById('container2');
        const previous = document.getElementById("container3");
        if(previous != null) previous.remove(previous);
                
        const container3 = document.createElement('section');
        container3.className = "container";
        container3.id = "container3";
        container3.innerHTML = `<pre>
        <header>Lot's Detail</header>
        <div class="gallery" id="detail"></div>
        </pre>`;
        container2.append(container3);

        const detail = document.getElementById("detail");

        const iframe = document.createElement('iframe');
        iframe.src = mapUrl;
        detail.appendChild(iframe);

        const content = document.createElement('div');
        content.className = "content";
        detail.appendChild(content);

        const p1 = document.createElement("p");
        p1.textContent = "Price: " + info.info.amount;
        content.appendChild(p1);

        const p2 = document.createElement("p");
        p2.textContent = "Available: " + info.info.available;
        content.appendChild(p2);
        
        const p = document.createElement("p");
        p.textContent = info.info.reason;
        content.appendChild(p);

    });
}
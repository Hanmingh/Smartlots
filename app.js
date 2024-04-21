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
    if(document.getElementById('startTime').value == ""){
        alert("Please enter start time!");
    }else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            
            const carType = document.getElementById('vehicle_type').value;
            const startTime = document.getElementById('startTime').value;
            const parkingTime = document.getElementById('parkingTime').value/2;

            let url = null;
            if(carType == "Car"){
                url = 'https://park.mydawg.top/park/nearby?latitude=' + lat + '&longitude='+ long + '&type=' + carType; //api url
            }else{
                url = 'https://park.mydawg.top/park/nearbyNew?latitude=' + lat + '&longitude='+ long + '&type=' + carType;
            }

            fetch(url, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(lists => {
                const container1 = document.getElementById('container1');
                if(document.getElementById("container2") != null) document.getElementById("container2").remove();
                if(document.getElementById("container3") != null) document.getElementById("container3").remove();
                
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
                    if(carType == "Car"){
                        h5.textContent = "Distance: " + parking.distance;
                    }else{
                        h5.textContent = "Distance: " + parking.distance + "km";
                    }
                    content.appendChild(h5);
                    
                    let id = null;
                    if(carType == 'Car'){
                        id = parking.id;
                    }else{
                        id = parking.ppCode;
                    }
                    content.onclick = () => selectParking(id, startTime, parkingTime, direcUrl);
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

function selectParking(id, startTime, parkingTime, mapUrl) {
    const [hours, minutes] = startTime.split(':');
    var start = new Date(2024, 4, 15, hours, minutes);
    const fromTimeStamp = Math.floor(start.getTime() / 1000);
    const toTimeStamp = Math.floor((start.getTime() + parkingTime * 60 * 60 * 1000) / 1000);

    let url = null;
    const carType = document.getElementById('vehicle_type').value;
    if(carType == "Car"){
        url = 'https://park.mydawg.top/park/predict?id='+ id +'&from='+ fromTimeStamp + '&to=' + toTimeStamp;
    }else{
        url = 'https://park.mydawg.top/park/predictNew?id='+ id +'&from='+ fromTimeStamp + '&to=' + toTimeStamp;
    }

    console.log(url);

    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(info => {
        const container2 = document.getElementById('container2');
        const previous = document.getElementById("container3");
        if(previous != null) previous.remove();
                
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
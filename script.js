//function to get IP and Details of the IP
async function getIP() {
  let reqIPrsponse = await fetch("https://api.ipify.org/?format=json");
  let ipAddress = await reqIPrsponse.json();

  setIpOnPage(ipAddress.ip);

  let ipDetailsResponse = await fetch(
    `https://ipinfo.io/${ipAddress.ip}?token=8ca1b212d0e7f7`
  );
  let ipDetails = await ipDetailsResponse.json();

  let officeListResponse = await fetch(
    `https://api.postalpincode.in/pincode/${ipDetails.postal}`
  );
  let officeList = await officeListResponse.json();

  console.log(officeListResponse);
  console.log(officeList);

  //Error Handling if any of the fetch gives proper response alert and reloading the page.
  if (ipDetailsResponse.ok && officeList[0].Status == "Success") {
    setButtonFunctionToChangeUI(ipDetails, officeList);
  } else {
    alert("Can't find required details of your IP.");
    location.reload();
  }
}

//setting IP on the main page
function setIpOnPage(ipAddress) {
  let ipElement = document.getElementById("right-title");
  ipElement.innerText = `Your Current IP Address is: ${ipAddress}`;

  ipElement = document.getElementById("heading");
  ipElement.innerHTML = `IP Address : <span>${ipAddress}</span>`;
}

//onclick event of button
function setButtonFunctionToChangeUI(ipDetails, officeList) {
  let btn = document.getElementById("btn");
  btn.addEventListener("click", () => {
    addINFOtoUI(ipDetails);
    addMapFrameToUI(ipDetails);
    addMoreInfotoUI(ipDetails, officeList[0]);
    addOfficeList(officeList[0]);

    document.querySelector(".main").style.display = "none";

    document.querySelector(".result-Section").style.display = "block";
  });
}

function addINFOtoUI(ipDetails) {
  let locArray = ipDetails.loc.split(",");
  let lat = locArray[0];
  let long = locArray[1];
  let city = ipDetails.city;
  let region = ipDetails.region;
  let organisation = ipDetails.org;
  let hostName = ipDetails.hostname || "Not available";
  let infoElement = `
        <div id="lat-long" class="gapColumn">
          <h1 class="side-heading">Lat: <span>${lat}</span></h1>
          <h1 class="side-heading">Long: <span>${long}</span></h1>
        </div>
        <div id="address" class="gapColumn">
          <h1 class="side-heading">City: <span>${city}</span></h1>
          <h1 class="side-heading">Region: <span>${region}</span></h1>
        </div>
        <div id="host-org" class="gapColumn">
          <h1 class="side-heading">Organisation: <span>${organisation}</span></h1>
          <h1 class="side-heading">Hostname: <span>${hostName}</span></h1>
        </div>`;

  document.getElementById("info").innerHTML = infoElement;
}

function addMapFrameToUI(ipDetails) {
  let locArray = ipDetails.loc.split(",");
  let lat = locArray[0];
  let long = locArray[1];
  let mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = `
        <iframe
            src="//maps.google.com/maps?q=${lat},${long}&z=18&output=embed"
          ></iframe>`;
}

function addMoreInfotoUI(ipDetails, officeList) {
  let timeZone = ipDetails.timezone;
  let dateTime = new Date().toLocaleString("en-US", { timeZone: timeZone });
  let pincode = ipDetails.postal;
  let message = officeList.Message;
  let moreInfoElement = `
        <h1 id="about-heading">More Information About You</h1>
        <h1 class="side-heading">Timezone: <span>${timeZone}</span></h1>
        <h1 class="side-heading">Date & Time: <span>${dateTime}</span></h1>
        <h1 class="side-heading">Pincode: <span>${pincode}</span></h1>
        <h1 class="side-heading">Message: <span>${message}</span></h1>`;
  document.getElementById("about").innerHTML = moreInfoElement;
}

//adding list of post offices to UI
function addOfficeList(officeList) {
  let postOfficesList = officeList.PostOffice;
  let itemsElement = "";
  postOfficesList.forEach((office) => {
    let name = office.Name;
    let branchType = office.BranchType;
    let deliveryStatus = office.DeliveryStatus;
    let district = office.District;
    let division = office.Division;
    itemsElement += `
                <div class="item">
                    <h1>Name: ${name}</h1>
                    <h1>Branch Type: ${branchType}</h1>
                    <h1>Delivery Status: ${deliveryStatus}</h1>
                    <h1>District: ${district}</h1>
                    <h1>Division: ${division}</h1>
                </div>`;
  });
  document.querySelector(".items").innerHTML = itemsElement;
}

document.getElementById("search").onkeyup = search;

function search() {
  let searchItem = document.getElementById("search").value.toLowerCase();
  let officeItems = document.querySelectorAll(".item");
  officeItems.forEach((officeElement) => {
    let officeName = officeElement.childNodes[1].innerText.toLowerCase();
    if (officeName.indexOf(searchItem) > -1) {
      officeElement.style.display = "";
    } else {
      officeElement.style.display = "none";
    }
  });
}

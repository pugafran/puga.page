
function dox(){


      
      


    
        fetch("https://ipapi.co/json/")
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if(isVPN(data.ip)){
                document.getElementById("ip").innerHTML += data.ip + "(VPN Detectada)";
                document.getElementById("provider").innerHTML += data.org + "(VPN Detectada)";
                document.getElementById("country").innerHTML += data.country_name + "(VPN Detectada)";
                document.getElementById("region").innerHTML += data.region + "(VPN Detectada)";
                document.getElementById("city").innerHTML += data.city + "(VPN Detectada)";
                document.getElementById("postal").innerHTML += data.postal + "(VPN Detectada)";
            }
            else{
                document.getElementById("ip").innerHTML += data.ip;
                document.getElementById("provider").innerHTML += data.org;
                document.getElementById("country").innerHTML += data.country_name;
                document.getElementById("region").innerHTML += data.region;
                document.getElementById("city").innerHTML += data.city;
                document.getElementById("postal").innerHTML += data.postal;
            }

          })
          .catch(error => console.error(error));
      
        
    


      
}


function isVPN(ipAddress) {
    const octets = ipAddress.split('.');
    if (octets.length !== 4) {
      return false;
    }
    const firstOctet = parseInt(octets[0], 10);
    const secondOctet = parseInt(octets[1], 10);
    switch (firstOctet) {
      case 10:
        return true;
      case 172:
        return secondOctet >= 16 && secondOctet <= 31;
      case 192:
        return secondOctet === 168;
      default:
        return false;
    }
  }
  
 
  
  
  
  
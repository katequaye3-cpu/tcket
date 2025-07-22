//Global Declarations
const name_on_ticket = document.getElementById('name')
const buyer_email = document.getElementById('email')
const buyer_number = document.getElementById('number')
const para = document.getElementById('code');
const purch = document.getElementById('purch')
const QRspace = document.getElementById("qrcode");
const qr = document.createElement('div'); qr.className = "qr"; QRspace.appendChild(qr);

// Function to verify payment reference
function verifyPayment(reference) {
const paystackSecretKey = 'sk_test_65b426e3ed57bad58395a500bf68f17cf50e3df4'; // Replace with your Paystack secret key
const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
//Fetch Transaction Data
fetch(url, {
  method: 'GET',
  headers: {
  Authorization: `Bearer ${paystackSecretKey}`,
  },
  })
 .then((response) => response.json())//Convert Response into JSON
 //Recieving and parsing data
 .then((data) => {//Get data from JSON
    const paymentInfo = document.getElementById('payment-info');//Declaration of space to display payment info
    //If trasaction id returns data
    if (data.status === true) {//Take action
      const paymentData = data.data;//Assigning data to local scoped variable
      const time = new Date(paymentData.paidAt)
      function generateticketCode(){//Generate Unique Ticket Code
        const ticketCode = 'BM - ' + (parseFloat(paymentData.id+paymentData.reference)).toString().slice(-6);
       ticketCode;
        const path =  (paymentData.customer.first_name + ' ' + paymentData.customer.last_name) + "'s ticket ID " + ((parseFloat(paymentData.id+paymentData.reference)).toString().slice(-6))
        para.textContent = ticketCode;
        addDataToDatabase(path , DBdata);
        //Testing variables
        console.log(info.key)
        console.log(encryptedCode);
        console.log(CryptoJS.AES.decrypt(encryptedCode,secrekey).toString(CryptoJS.enc.Utf8));
        return encryptedCode;
      }
       const info = {
        key: 'BM - ' + (parseFloat(paymentData.id+paymentData.reference)).toString().slice(-6),
        name: paymentData.customer.first_name + ' ' + paymentData.customer.last_name,
        number: paymentData.customer.phone,
        email: paymentData.customer.email
      };
      const DBdata = {//Database Declaration
        code: code = info
      }
      const secrekey = "Made_By_BM";
      const key = JSON.stringify(info) ;
      const encryptedCode = CryptoJS.AES.encrypt(key, secrekey).toString()
     
      //Generate QR Code
      function generateQR (arg) {
        while(qr.firstChild){
          qr.removeChild(qr.firstChild)
        }
        //QR Code Values
        var qrcode = new QRCode(qr,{
          width: 200,
          height: 200,
          colorDark: 'black',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H})
        qrcode.makeCode(arg)
        };
      //Assignements
      name_on_ticket.textContent = (paymentData.customer.first_name + ' ' + paymentData.customer.last_name)
      buyer_email.textContent = paymentData.customer.email;
      buyer_number.textContent = "+233 " + paymentData.customer.phone.toString().slice(1,4) +' '+ paymentData.customer.phone.toString().slice(4,7) +' ' + paymentData.customer.phone.toString().slice(7,10);
      purch.textContent = 'Purchased at ' + time.toLocaleString();
      const tictype = document.getElementById('tictype')
      if((paymentData.amount / 100).toFixed(2) == 200){
        tictype.textContent = "V.I.P"
        tictype.style.transform = "scaleX(2)"
        tictype.style.transform = "scaleY(1)"
      }else if((paymentData.amount / 100).toFixed(2) == 100){
        tictype.textContent = "REGULAR"
      }
      //Displaying Payment Info On Screen
      paymentInfo.innerHTML = `
        <p>Customer Name: ${paymentData.customer.first_name} ${paymentData.customer.last_name}</p>
        <p>Customer Email: ${paymentData.customer.email}</p>
        <p>Payment Amount: ₵${(paymentData.amount / 100).toFixed(2)}</p>
        <p>Payment Number: ${paymentData.customer.phone}<p>
        <p>Payment Refrence: ${paymentData.reference}<p>
        <p>Payment ID: ${paymentData.id}<p>
        <p>Payment Time: ${time.toString()}<p>
      `;
      //Running...
      generateQR(generateticketCode());
      }else {//Return error if no data is found in response
        alert('Payment not found or invalid reference');
      }
  })
  .catch((error) => {
    alert(error.message);
  });
}

function addDataToDatabase(path, data) {
  dbRef = ref(db, path);//adds only one refrence(ticket)
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      alert('Data already exists!');
    } else {
      set(dbRef, data);
      alert('data added to database')
    }
  }).catch((error) => {
    alert('Error checking data:', error.message);
  });
}


// Event listener for generate ticket button
document.getElementById('generate-ticket').addEventListener('click', () => {
  const reference = document.getElementById('ref').value;
  console.log(reference)
  verifyPayment(reference);  
});


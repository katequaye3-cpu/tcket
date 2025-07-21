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

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const paymentInfo = document.getElementById('payment-info');
      if (data.status === true) {
        const paymentData = data.data;
        const time = new Date(paymentData.paidAt)
        console.log(paymentData)
        function generateticketCode(){
    // if(numberBox.value.length < 10 || numberBox.value.length >10){
        // alert("Number length must be ten")
    // }else{
    ticketCode = 'BM - ' + (paymentData.id+paymentData.reference).toString().slice(-6);
    para.textContent = ticketCode;
    const info = {
      key: ticketCode,
      name: paymentData.customer.first_name + ' ' + paymentData.customer.last_name,
      number: paymentData.customer.phone,
      email: paymentData.customer.email
    }
    console.log(info.key)
    const secrekey = "Made_By_BM";
    const key = JSON.stringify(info) ;
    const encryptedCode = CryptoJS.AES.encrypt(key, secrekey).toString()
    console.log(encryptedCode);
    console.log(CryptoJS.AES.decrypt(encryptedCode,secrekey).toString(CryptoJS.enc.Utf8))
    
      const data = {
       code: code = info
};
    addDataToDatabase('tickets', data)
    return encryptedCode;
    // }
}
function generateTicket (arg) {
    while(qr.firstChild){
        qr.removeChild(qr.firstChild)
    }
    var qrcode = new QRCode(qr,{
    width: 200,
    height: 200,
    colorDark: 'black',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H})
    qrcode.makeCode(arg)
   }
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
        paymentInfo.innerHTML = `
          <p>Customer Name: ${paymentData.customer.first_name} ${paymentData.customer.last_name}</p>
          <p>Customer Email: ${paymentData.customer.email}</p>
          <p>Payment Amoun  t: ₵${(paymentData.amount / 100).toFixed(2)}</p>
          <p>Payment Number: ${paymentData.customer.phone}<p>
          <p>Payment Refrence: ${paymentData.reference}<p>
          <p>Payment ID: ${paymentData.id}<p>
           <p>Payment Time: ${time.toString()}<p>
        `;
        generateTicket(generateticketCode());
      } else {
        alert('Payment not found or invalid reference');
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}

function addDataToDatabase(path, data) {
  dbRef = ref(db, path);
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log('Data already exists!');
    } else {
      set(dbRef, data);
    }
  }).catch((error) => {
    console.error('Error checking data:', error);
  });
}


// Event listener for generate ticket button
document.getElementById('generate-ticket').addEventListener('click', () => {
  const reference = document.getElementById('ref').value;
  console.log(reference)
  verifyPayment(reference);
  alert('encrypted added to database')
  
  
});


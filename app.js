let accessToken = "";
let currentEmail = ""; // OTP için saklanıyor

// Register function
function register() {
  // Collect user and merchant info from the form
  const firstname = document.getElementById("reg-firstname").value.trim();
  const lastname = document.getElementById("reg-lastname").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const merchantName = document.getElementById("reg-merchant-name").value.trim();
  const merchantCompany = document.getElementById("reg-merchant-company").value.trim();
  const merchantEmail = document.getElementById("reg-merchant-email").value.trim();
  const merchantPhone = document.getElementById("reg-merchant-phone").value.trim();
  const merchantWeb = document.getElementById("reg-merchant-web").value.trim();
  const merchantCountry = document.getElementById("reg-merchant-country").value.trim();

  const body = {
    user: {
      firstname,
      lastname,
      phone,
      email,
      password
    },
    merchant: {
      program_id: 1,
      name: merchantName,
      company: merchantCompany,
      email: merchantEmail,
      phone: merchantPhone,
      web: merchantWeb,
      country: merchantCountry,
      lang: "tr_TR"
    }
  };

  fetch("https://api.paythor.com/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(({ status, data }) => {
      if (status === 201) {
        // Registration successful, go to login
        document.getElementById("step-register").style.display = "none";
        document.getElementById("step-1").style.display = "block";
      } else {
        document.getElementById("error-register").innerText = data.message || "Kayıt başarısız.";
      }
    })
    .catch(() => {
      document.getElementById("error-register").innerText = "Sunucu hatası.";
    });
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  currentEmail = email;

  const body = {
    auth_query: {
      auth_method: "email_password_panel",
      email: email,
      password: password,
      program_id: 1,
      app_id: 102,
      store_url: ""
    }
  };

  fetch("https://api.paythor.com/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(({ status, data }) => {
      if (status === 200 && data.data.token_string) {
        accessToken = data.data.token_string;
        document.getElementById("step-1").style.display = "none";
        document.getElementById("step-2").style.display = "block";
      } else {
        document.getElementById("error-login").innerText = data.message || "Giriş başarısız.";
      }
    })
    .catch(() => {
      document.getElementById("error-login").innerText = "Sunucu hatası.";
    });
}

function verifyOtp() {
  const otp = document.getElementById("otp").value.trim();
  const body = {
    target: currentEmail,
    otp: otp
  };

  fetch("https://api.paythor.com/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(({ status, data }) => {
      if (status === 200) {
        document.getElementById("step-2").style.display = "none";
        document.getElementById("step-3").style.display = "block";
      } else {
        document.getElementById("error-otp").innerText = data.message || "OTP doğrulama başarısız.";
      }
    })
    .catch(() => {
      document.getElementById("error-otp").innerText = "Sunucu hatası.";
    });
}

function createPayment() {
  // Collect payment and payer info from the form
  const amount = document.getElementById("amount").value.trim();
  const currency = document.getElementById("currency").value.trim() || "TRY";
  const payerFirstName = document.getElementById("payer-firstname").value.trim();
  const payerLastName = document.getElementById("payer-lastname").value.trim();
  const payerEmail = document.getElementById("payer-email").value.trim();
  const payerPhone = document.getElementById("payer-phone").value.trim();
  const payerAddress = document.getElementById("payer-address").value.trim();
  const payerCity = document.getElementById("payer-city").value.trim();
  const payerState = document.getElementById("payer-state").value.trim();
  const payerPostal = document.getElementById("payer-postal").value.trim();
  const payerCountry = document.getElementById("payer-country").value.trim() || "TR";
  const merchantReference = document.getElementById("merchant-reference").value.trim();

  // Cart inputları
  const prdId = document.getElementById("prd-id") ? document.getElementById("prd-id").value.trim() : "PRD-123";
  const prdName = document.getElementById("prd-name") ? document.getElementById("prd-name").value.trim() : "Product Name";
  const prdPrice = document.getElementById("prd-price") ? document.getElementById("prd-price").value.trim() : "76.00";
  const prdQty = document.getElementById("prd-qty") ? document.getElementById("prd-qty").value.trim() : "1";
  const dscId = document.getElementById("dsc-id") ? document.getElementById("dsc-id").value.trim() : "DSC-SUMMER2024";
  const dscName = document.getElementById("dsc-name") ? document.getElementById("dsc-name").value.trim() : "SUMMER2024 (10%)";
  const dscPrice = document.getElementById("dsc-price") ? document.getElementById("dsc-price").value.trim() : "5.00";
  const dscQty = document.getElementById("dsc-qty") ? document.getElementById("dsc-qty").value.trim() : "1";
  const shipId = document.getElementById("ship-id") ? document.getElementById("ship-id").value.trim() : "SHIP-1234";
  const shipName = document.getElementById("ship-name") ? document.getElementById("ship-name").value.trim() : "Shipping";
  const shipPrice = document.getElementById("ship-price") ? document.getElementById("ship-price").value.trim() : "10.00";
  const shipQty = document.getElementById("ship-qty") ? document.getElementById("ship-qty").value.trim() : "1";
  const taxId = document.getElementById("tax-id") ? document.getElementById("tax-id").value.trim() : "TAX-TOTAL-5678";
  const taxName = document.getElementById("tax-name") ? document.getElementById("tax-name").value.trim() : "Tax";
  const taxPrice = document.getElementById("tax-price") ? document.getElementById("tax-price").value.trim() : "19.00";
  const taxQty = document.getElementById("tax-qty") ? document.getElementById("tax-qty").value.trim() : "1";

  // Sepet bilgisini güncel cartItems üzerinden oluştur
  const cart = [];
  let cartTotal = 0;
  cartItems.forEach(function(item) {
    cart.push({
      id: item.id || item.name || "",
      name: item.name,
      type: item.type,
      price: item.price,
      quantity: Number(item.quantity)
    });
    if (item.type === "discount") {
      cartTotal -= Number(item.price) * Number(item.quantity);
    } else {
      cartTotal += Number(item.price) * Number(item.quantity);
    }
  });

  // Sepet toplamı ile ödeme tutarını eşitle
  let paymentAmount = cartTotal;
  if (document.getElementById("amount")) {
    document.getElementById("amount").value = cartTotal.toFixed(2);
  }

  const body = {
    payment: {
      amount: paymentAmount.toFixed(2),
      currency: currency,
      buyer_fee: "0",
      method: "creditcard",
      merchant_reference: merchantReference
    },
    payer: {
      first_name: payerFirstName,
      last_name: payerLastName,
      email: payerEmail,
      phone: payerPhone,
      address: {
        line_1: payerAddress,
        city: payerCity,
        state: payerState,
        postal_code: payerPostal,
        country: payerCountry
      },
      ip: "127.0.0.1"
    },
    order: {
      cart: cart,
      shipping: {
        first_name: payerFirstName,
        last_name: payerLastName,
        phone: payerPhone,
        email: payerEmail,
        address: {
          line_1: payerAddress,
          city: payerCity,
          state: payerState,
          postal_code: payerPostal,
          country: payerCountry
        }
      },
      invoice: {
        id: merchantReference || "cart_hash_123",
        first_name: payerFirstName,
        last_name: payerLastName,
        price: paymentAmount.toFixed(2),
        quantity: 1
      }
    }
  };

  fetch("https://api.paythor.com/payment/create", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    redirect: "follow"
  })
    .then(response => response.json())
    .then(data => {
      const urlElem = document.getElementById("payment-url");
      if (data && data.data && data.data.payment_link) {
        urlElem.innerText = data.data.payment_link;
        urlElem.href = data.data.payment_link;
        urlElem.style.display = "inline-block";
        document.getElementById("error-payment").innerText = "";
      } else {
        urlElem.style.display = "none";
        document.getElementById("error-payment").innerText = (data && data.message) || "Ödeme oluşturulamadı.";
      }
    })
    .catch(() => {
      document.getElementById("error-payment").innerText = "Sunucu hatası.";
    });
}

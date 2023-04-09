import { request } from "https";

const options = {
  "method": "POST",
  "hostname": "test.api.dibspayment.eu",
  "port": null,
  "path": "/v1/payments",
  "headers": {
    "content-type": "application/*+json",
    "Authorization": "YOUR_TEST_NETS_EASY_KEY"
  },
};

const req = request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({
    order: {
        items: [
            {
                reference: "1",
                name: "Told til Pakke",
                quantity: 1,
                unit: "pcs",
                unitPrice: 1000,
                grossTotalAmount: 1000,
                netTotalAmount: 1000,
            }
        ],
        amount: 1000,
        currency: "DKK",
    },
    checkout: {
        returnUrl: "https://toldjs.dk",
        integrationType: "HostedPaymentPage",
        termsUrl: "https://toldjs.dk/legal/servicevilkår",
    }
}));
req.end();
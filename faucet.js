const axios = require('axios');
const fs = require('fs');

fs.readFile('address.txt', 'utf8', (err, address) => {
    if (err) {
        console.error('Gagal membaca file:', err);
        return;
    }
    address = address.trim();
    const url = `https://faucet.ping.pub/stargaze/send/${address}`;

    axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',  // Menyamarkan sebagai browser
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.data && response.data.status === "ok" && response.data.result) {
            console.log(`Tx Hash: https://testnet.ping.pub/stargaze/tx/${response.data.result.txhash}`);
        } else {
            console.log('Gagal mendapatkan txhash, respons tidak sesuai:', response.data);
        }
    })
    .catch(error => {
        if (error.response) {
            console.error(`Error ${error.response.status}: ${error.response.data}`);
        } else {
            console.error('Error:', error.message);
        }
    });
});

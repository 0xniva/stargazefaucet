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
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://testnet.ping.pub',
            'Priority': 'u=1, i',
            'Referer': 'https://testnet.ping.pub/',
            'Sec-Ch-Ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
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

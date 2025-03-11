const axios = require('axios');
const fs = require('fs');

const MAX_RETRIES = 5; // Maksimum percobaan ulang
const RETRY_DELAY = 10000; // Delay 10 detik

// Fungsi untuk menunggu (delay) sebelum retry
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk mengirim request dengan retry
async function requestFaucet(address, attempt = 1) {
    const url = `https://faucet.ping.pub/stargaze/send/${address}`;

    try {
        const response = await axios.get(url, {
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
        });

        if (response.data && response.data.status === "ok" && response.data.result) {
            console.log(`✅ Tx Hash: https://testnet.ping.pub/stargaze/tx/${response.data.result.txhash}`);
        } else if (
            response.data.status === "error" && 
            (response.data.message.includes("account sequence mismatch") || 
             response.data.message.includes("context deadline exceeded"))
        ) {
            if (attempt < MAX_RETRIES) {
                console.warn(`⚠️ Error terdeteksi: "${response.data.message}". Retry ${attempt}/${MAX_RETRIES} setelah 10 detik...`);
                await delay(RETRY_DELAY);
                return requestFaucet(address, attempt + 1); // Retry request
            } else {
                console.error("❌ Maksimum retry tercapai. Gagal melakukan request.");
            }
        } else {
            console.log('⚠️ Gagal mendapatkan txhash, respons tidak sesuai:', response.data);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Membaca address dari file dan memulai request
fs.readFile('address.txt', 'utf8', (err, address) => {
    if (err) {
        console.error('❌ Gagal membaca file:', err);
        return;
    }

    address = address.trim();
    console.log(`🚀 Mengirim request faucet untuk address: ${address}`);
    requestFaucet(address);
});

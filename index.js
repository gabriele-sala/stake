const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Use the port Vercel assigns, or 3000 locally

const infuraId = 'faf348e8e5554ff0a870792631b24807';
const address = '0x4ab6FFa52460979DdE1E442FB95F8BaC56C3AdC3';
const tokenAddress = '0x940a2dB1B7008B6C776d4faaCa729d6d4A4AA551';
const contractData = `0x70a08231000000000000000000000000${address.substring(2)}`;
const infuraEndpoint = `https://mainnet.infura.io/v3/${infuraId}`;

app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/apr', async (req, res) => {
    const response = await fetch(infuraEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [{ to: tokenAddress, data: contractData }, "latest"],
            id: 1
        })
    });

    const data = await response.json();
    const balance = parseInt(data.result, 16);
    const balanceInEther = balance / Math.pow(10, 18); // Assuming 18 decimal places
    const apr = (2500000 / balanceInEther) * (365 / 44);

    res.json({ APR: apr.toFixed(2) });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

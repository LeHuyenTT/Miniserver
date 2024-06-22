const axios = require('axios');

const loginUrl = 'http://127.0.0.1:9000/api/v1/auth/login';
const your_username = '18520651';
const your_password = '18520651';

const requestData = {
    username: your_username,
    password: your_password
};

const numRequests = 100; // Số lượng yêu cầu muốn gửi
const delays = []; // Mảng lưu trữ độ trễ của mỗi yêu cầu

async function sendRequest() {
    const startTime = performance.now();
    try {
        const response = await axios.post(loginUrl, requestData);
        const endTime = performance.now();
        const delay = endTime - startTime;
        delays.push(delay);
        console.log('Response:', response.data);
        console.log('Delay:', delay);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function stressTest() {
    for (let i = 0; i < numRequests; i++) {
        await sendRequest();
    }
    const averageDelay = delays.reduce((acc, curr) => acc + curr, 0) / numRequests;
    console.log('Average Delay:', averageDelay);
}

stressTest();

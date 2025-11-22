// Вставьте ваш токен
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGI1Yzg2ZS1hMmVkLTQ0OWEtOWIyNy05ZDM1MzkyMjljM2EiLCJlbWFpbCI6ImFzZGFzMjJAZ21haWwuY29tIiwianRpIjoiM2VjYTJkMDAtNDdjZC00YWE5LWI0ODUtMTVkN2VjMzVlM2RkIiwid2FsbGV0X2FkZHJlc3MiOiIiLCJ3YWxsZXRfdHlwZSI6IiIsImV4cCI6MTc2MzUwNTc1MywiaXNzIjoiQmlub21vQmFja2VuZCIsImF1ZCI6IkJpbm9tb0JhY2tlbmQifQ.loJNe2DV-dVqbf8VWZFRAfQgJ2Sua3b3Axm5XCip5bw";

// Тестируем endpoint /api/Auth/me
fetch('http://localhost:5207/api/Auth/me', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    return response.json();
})
.then(data => {
    console.log('Response Data:', data);
})
.catch(error => {
    console.error('Error:', error);
});
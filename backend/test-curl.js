const data = {"roomId":"a18d21f9-ca5c-4c05-b1ad-7363a328a5c9","checkIn":"2026-08-18","checkOut":"2026-08-19","roomQuantity":1,"discountCode":"HOST1"};

fetch('http://localhost:3000/api/v1/bookings/calculate-price', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNjY3YjgzNS1mNWYzLTQ3ZDEtYmUyOS1kZjYyYmM2OGE3MWUiLCJlbWFpbCI6InVzZXJjQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg2OTUwMjMwLCJleHAiOjE3ODcwMzY2MzB9.RC9X53F0HmTRSkjPbfnhrY4OOYZDwzfJCJYbH9tTwiU'
  },
  body: JSON.stringify(data)
})
.then(res => res.json().then(json => ({ status: res.status, body: json })))
.then(console.log)
.catch(console.error);

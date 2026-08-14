const axios = require('axios');

async function test() {
  try {
    const resAll = await axios.get('http://localhost:3000/api/v1/admin/hotels?page=1&limit=10', {
      headers: { Authorization: 'Bearer test' } // token is required but let's see if we can bypass or we get 401
    });
    console.log('ALL:', resAll.data);
  } catch(e) {
    console.log(e.response ? e.response.data : e.message);
  }
}
test();

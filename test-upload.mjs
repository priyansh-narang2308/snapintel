import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function testUpload() {
  const formData = new FormData();
  const fileData = fs.readFileSync('public/loader.gif'); // wait, loader.gif is 500KB+ maybe? Let's make a tiny image
  const blob = new Blob([fileData]);
  formData.append('image', blob, 'test.gif');
  formData.append('api_key', process.env.SERPAPI_API_KEY);

  const res = await fetch('https://serpapi.com/image', {
    method: 'POST',
    body: formData
  });
  console.log(await res.json());
}
testUpload();

import fs from 'fs';

async function testApi() {
  const fileData = fs.readFileSync('public/loader.gif');
  const base64 = fileData.toString('base64');
  const imageBase64 = `data:image/gif;base64,${base64}`;

  const res = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      scanTier: 'quick'
    })
  });
  console.log(res.status);
  console.log(await res.text());
}
testApi();

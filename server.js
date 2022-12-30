const express = require('express');
const app = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL
const port = externalUrl && process.env.port ? parseInt(process.env.port) : 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});




if(externalUrl){
  const hostname= '127.0.0.1';
  app.listen(port, ()=>{
    console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`)
  })
}else{
  app.listen(port,()=>console.info(`Listening on port ${port}`))
}

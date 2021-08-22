const express = require('express')
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));

let threePath = path.join(__dirname, 'node_modules/three');
app.use('/three/', express.static(threePath))

app.listen(3000, () => {
    console.log("Success")
})
const http = require("http");
const fs = require("fs");

var requests = require("requests");
 
const homedata = fs.readFileSync("home.html" , "utf-8");
const replaceVal = (tempval , orgval) => {
    let temperature = tempval.replace("{%tempVal%}" , orgval.main.temp);
    temperature = temperature.replace("{%tempMin%}" , orgval.main.temp_min);
    temperature = temperature.replace("{%tempMax%}" , orgval.main.temp_max);
    temperature = temperature.replace("{%location%}" , orgval.name);
    temperature = temperature.replace("{%country%}" , orgval.sys.country);
    return temperature;
}

const server = http.createServer((req , res) => {
    if(req.url ==="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=3b9bb21bd167aefc5fe4724e2460ce45')
.on("data", (chunk) => {
    const objdata = JSON.parse(chunk);
    const arrdata = [objdata];
    // console.log(arrdata[0].main.temp);
    const realtimedata = arrdata.map((val) => replaceVal( homedata , val )).join("");
    res.write(realtimedata);
})
.on('end', (err) => {
  if (err) return console.log('connection closed due to errors', err);
 
  res.end();
});
}
});
server.listen(5000,"127.0.0.1",() => {
    console.log("listening to the port 5000");
});

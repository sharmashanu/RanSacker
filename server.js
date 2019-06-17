const axios = require('axios');
const fs = require('fs');
const Sequelize = require("sequelize");
const elasticsearch = require('elasticsearch')
const uuidv5 = require('uuid/v5');
const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
const sequelize = new Sequelize('mydatabase', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});;

const User = sequelize.define('myUrls', {
    DB: Sequelize.STRING
});

const {crawlData }  = require('./crawler')

try {
    if(fs.statSync('dummy.txt')){
        fs.unlinkSync('dummy.txt')
    } 
} catch (error) {
    
}
fs.writeFileSync('dummy.txt','')



const handleUrl = async (url)=>{
    const text = await crawlData(url)
    // fs.appendFileSync('dummy.txt', url+"\n"+text)
    await esClient.create({
        index: 'myindex',
        type: 'mytype',
        id: uuidv5(url, uuidv5.URL),
        body: {
            url: url,
            data: text
        }
      })
}

const startProcess = async () => {

   const data = JSON.parse(JSON.stringify(await User.findAll({ limit: 10, attributes: ['DB'] })))
    // console.log('data', data)
    const urls = data.map(({DB})=> DB)
    console.log('urls', urls)
    urls.map(async (url)=>{
        await handleUrl(url);
    })
}

startProcess()



 
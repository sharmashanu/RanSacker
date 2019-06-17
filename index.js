const fs = require('fs');
const axios = require('axios');
const readline = require("readline")

const getRobotsFile = async (url) => {
    const data = await axios.get(url);
    console.log(data.data);
    fs.writeFileSync("robots.txt", data.data);
    console.log("rgrtgb");
}
const readRobotsFile = async () => {
  const promise = new Promise((resolve, reject)=>{
    const readLineStream = readline.createInterface({
        input: fs.createReadStream("./robots.txt")
    });
    readLineStream.on('line', (line) => {
        console.log('line', line);  
        if(line.includes("Sitemap:")){
            line = line.replace("Sitemap:","").trim();
            console.log('url line', line);
        }


    })
    readLineStream.on('close', () => {
        console.log('close');
        resolve()
    })
    readLineStream.on('end', () => {
        console.log('end');
    })
  })
  return promise
}
const readSiteMapUrl = async(url)=>{
    let urls=[];
    try {
        const sitemapXmlReader = require("./getMeURls" );
         urls = await sitemapXmlReader(url);
        // console.log('urls1',urls)
        for(let i=0;i<urls.length;i++){
            const itemUrl  = urls[i]
            if(itemUrl.endsWith(".xml")){
                const nestedUrls = await readSiteMapUrl(itemUrl)
                urls.push(...nestedUrls)
            }
        }  
    } catch (error) {
        console.error(error)
    }
    return urls.filter((item)=>item.endsWith(".xml")===false)
}
const dumpDataToMySql = async(urls)=>{
    const Sequelize = require("sequelize");
    const sequelize = new Sequelize('mydatabase','root','',{
        host:'localhost',
        dialect:'mysql'
    });
    // sequelize
    //     .authenticate()
    //     .then(()=>{
    //         console.log("connection established succesfully");
    //     })
    //     .catch(err=>{
    //         console.error("unable to connect the database",err);
    //     });
    
    const User = sequelize.define('myUrls',{
        DB:Sequelize.STRING
    });
    
    let notes = urls.map((item)=> ({DB: item}));

    sequelize.sync({force:true}).then(()=>{
        User.bulkCreate(notes,{ validate:true }).then(()=>{
            console.log("data table created");
        }).catch((err)=>{
            console.error("unable to create bulk");
        }).finally(()=>{
            sequelize.close();
        });
    });

}
(async function scope() {
    await getRobotsFile("https://www.thehindu.com/robots.txt");
    console.log("heeheyey")
    await readRobotsFile()
    const urls = await readSiteMapUrl("https://www.thehindu.com/sitemap/googlenews.xml")
    console.log('urls',urls)
    dumpDataToMySql(urls)
})()

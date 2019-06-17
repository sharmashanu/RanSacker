const elasticsearch= require('elasticsearch')
const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
  });

  esClient.search({
    index: 'myindex',
    type: 'mytype',
    body : {
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "data": "class"
                }
              }
            ]
          }
        }
      }
  }).then((data)=>{
    // console.log(JSON.stringify(data,null,4))
    console.log(data.hits.hits.map((item)=> item._source.url))
  }).catch(console.error)
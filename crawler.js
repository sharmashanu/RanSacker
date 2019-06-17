const axios = require('axios');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const crawlData = async (pageUrl) => {
    try {
        const { data } = await axios.get(pageUrl)
        const dom = new JSDOM(data);
        const contentIdRegex = `div[id^='content-body']`;
        const {textContent=""} = dom.window.document.querySelector(contentIdRegex)
        return textContent
    } catch (e) {

    }
}

module.exports ={
    crawlData
}
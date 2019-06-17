( function() {
    'use strict';

    var xmlParser = require( 'xml-parser' );
    var fs = require( 'fs' );
    var axios  = require('axios')
    var getSitemapUrls = async function( sitemapUrl, options ) {
        if ( sitemapUrl.match( /^https?\:\/\// ) ) {
            var res = await axios.get(sitemapUrl);
            // console.log('res', res)
            var sitemap = xmlParser( res.data.toString() );
            var urls = sitemap.root.children.map( function( url ) {
                var loc = url.children.filter( function( item ) {
                    return item.name === 'loc';
                } )[ 0 ];
                return loc.content;
            } );
            return urls;
        }

        throw new Error( 'Please specify a valid URL' );
    };

    module.exports = getSitemapUrls;
} () );
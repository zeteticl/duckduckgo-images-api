# duckduckgo-images-api

A lightweight node package to programmatically obtain image search results from DuckDuckGo search engine.

The method used is inspired from [python package](https://github.com/deepanprabhu/duckduckgo-images-api) with same name. Thanks to, [deepanprabhu](https://github.com/deepanprabhu) for original source. This is my first node package and it was fun to write.

## usage

To install, run:
```
npm i duckduckgo-images-api
```
When using TypeScript, run:
```
npm i @types/duckduckgo-images-api
```

The package provides simple async api. And uses following config object as input:
```javascript
{ 
    query: "search term", 
    moderate : false,   
    iterations : 2 ,
    retries  : 2
}
```
- query param is mandatory
- moderate (optional) to moderate search results if none provided defaults to moderation off (false)
- iterations (optional) limit the number of result sets fetched,  default 2
- retries (optional) limit retries per iteration, default 2

image_search function return a promise that resolves to array of complete results.
```javascript
image_search({ query: "birds", moderate: true }).then(results=>console.log(results))
```
image_search_generator function is a async generator that yield promise of result set on each iteration. Useful for large iterations. Please check the node version compatability for this syntax.

```javascript
async function main(){
    for await (let resultSet of image_search_generator({ query: "birds", moderate: true ,iterations :4})){
      console.log(resultSet)
    }
  }
  
main().catch(console.log);
```

Please feel free to report any issues or feature requests.


### note

DuckDuckGo provides an instant answer API. This package does not use this route. This package mocks the browser behaviour using the same request format. Use it wisely.

### 已發佈到NPMJS 上
參考這教學 https://blog.pulipuli.info/2019/06/npm-how-to-create-anpmscoped-package.html
npm adduser
npm publish --access public
const environment = process.env.NODE_ENV || 'dev';
console.log(environment,"environment*************888");

const config=require(`./config/${environment}.json`);
console.log(config,"config*************888");

module.exports=config;
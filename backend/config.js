const environment = process.env.NODE_ENV || 'dev';
console.log(environment);

const config=require(`./config/${environment}.json`);

module.exports=config;
const environment = process.env.NODE_ENV || 'local';
console.log(environment);

const config=require(`./config/${environment}.json`);

module.exports=config;
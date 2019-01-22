const env = process.env.NODE_ENV || "development";
console.log(`***** Environment: ${env} ******`);

if (env === "development" || env === "test") {
  const config = require("./config.json");
  const envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}

export default () => {
  const config: any = {};

  config.contractAddress = process.env.CONTRACT;
  config.port = process.env.PORT;
  config.pk = process.env.PK;
  config.cid = process.env.CID;

  return config;
};

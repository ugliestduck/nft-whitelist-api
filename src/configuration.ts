import * as fs from 'fs';
import * as yaml from 'js-yaml';

const ENV = process.env.NODE_ENV;

export default () => {
  const config: any = yaml.load(
    fs.readFileSync(`config/config.${ENV ? ENV : 'goerli'}.yml`),
  );

  config.port = process.env.PORT;
  config.pk = process.env.PK;

  return config;
};

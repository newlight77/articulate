import {
    AUTH_ENABLED,
    AUTH_PROVIDERS
} from '../../../util/env';
import Simple from './simple';

const logger = require('../../../util/logger')({ name: `server:strategy` });

module.exports = () => {
    if (!AUTH_ENABLED) {
        return [];
    }
    const strategies = [Simple];
    AUTH_PROVIDERS.map((provider) => {
        let p;
        try {
            p = require(`./${provider}`);
            const key = p.options.clientId;
            const secret = p.options.clientSecret;
            if (key && secret) {
                return strategies.push(p);
            }
            throw new Error(`Provider [${provider}] is missing the Key or Secret values`);
        }
        catch (e) {
            logger.error(e);
        }
    });
    return strategies;
};

const Joi = require('joi');

const schemaName = 'MultipleRequiredAuth';

function collectScopeFrom(credentials, scopes) {
    if (credentials.scope) {
        scopes.push(...[].concat(credentials.scope))
    }
}

const scheme = (_, schemeOptions) => {
    Joi.assert(schemeOptions, Joi.object({
        strategies: Joi
            .array()
            .items(Joi.string().description('Auth strategy name'))
            .min(1)
            .required()
            .description('Auth strategies')
    }))

    const scopes = []
    const artifacts = {}
    const credentials = {}

    return {
        async authenticate(request, h) {
            return await Promise.all(
                schemeOptions.strategies.map(async (strategy) => {
                    const result = await request.server.auth.test(strategy, request)
                    const { credentials: creds, artifacts: arts } = result
                    artifacts[strategy] = arts
                    credentials[strategy] = creds
                    collectScopeFrom(creds, scopes)
                })
            )
                .then(() => {
                    return h.authenticated({
                        credentials: { scope: scopes, ...credentials },
                        artifacts
                    })
                })
                .catch(err => {
                    return h.unauthenticated(err)
                });
        }
    }
}

module.exports = {
    name: 'multiple-required-auth',
    register: (server) => {
        server.auth.scheme(schemaName, scheme)
    },
    schemaName,
};

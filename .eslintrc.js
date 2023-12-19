module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true
    },
    extends: ['@chenqi_uu/uu-client'],
    rules: {
        'no-restricted-properties': [2, {
            object: 'disallowedObjectName',
            property: 'disallowedPropertyName'
        }]
    }
};

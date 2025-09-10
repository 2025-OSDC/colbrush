// svgr.config.cjs
/** @type {import('@svgr/core').Config} */
module.exports = {
    typescript: true,
    expandProps: 'end',
    svgo: true,
    svgoConfig: {
        plugins: [
            {
                name: 'preset-default',
                params: { overrides: { removeViewBox: false } },
            },
            { name: 'removeDimensions', active: true },
        ],
    },
};
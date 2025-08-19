export default {
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // fill/stroke 보존
                    removeUselessStrokeAndFill: false,
                    removeUnknownsAndDefaults: false,
                    // 도형을 path로 바꾸지 않음(속성 날아감 방지)
                    convertShapeToPath: false,
                    // 그룹/상속 정리로 속성 끌올되는 것도 막음
                    moveGroupAttrsToElems: false,
                    cleanupAttrs: false,
                },
            },
        },
    ],
};

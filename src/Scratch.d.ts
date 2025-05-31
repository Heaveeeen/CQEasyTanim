// 只是我随手写的些注释，仅供自用，不全，不保证准确。想要可以随便拿去用，但出错了别赖我。

/** 这里我只写了一小部分，差了很多很多。 */
type RuntimeEventName ="RUNTIME_DISPOSED" | "KEY_PRESSED" | "PROJECT_STOP_ALL" | "targetWasRemoved" | "SAY" | "STOP_FOR_TARGET" | "PROJECT_START" |
"targetWasCreated" | "ANSWER" | "SCRIPT_GLOW_ON" | "SCRIPT_GLOW_OFF" | "BLOCK_GLOW_ON" | "BLOCK_GLOW_OFF" | "PROJECT_RUN_START" | "PROJECT_RUN_STOP" |
"PROJECT_CHANGED" | "VISUAL_REPORT" | "TARGETS_UPDATE" | "MONITORS_UPDATE" | "BLOCK_DRAG_UPDATE" | "BLOCK_DRAG_END" | "EXTENSION_ADDED" |
"EXTENSION_FIELD_ADDED" | "BLOCKSINFO_UPDATE" | "BLOCKS_NEED_UPDATE" | "TOOLBOX_EXTENSIONS_NEED_UPDATE" | "PERIPHERAL_LIST_UPDATE" |
"USER_PICKED_PERIPHERAL" | "PERIPHERAL_CONNECTED" | "PERIPHERAL_REQUEST_ERROR" | "PERIPHERAL_DISCONNECTED" | "PERIPHERAL_CONNECTION_LOST_ERROR" |
"PERIPHERAL_SCAN_TIMEOUT" | "MIC_LISTENING" | "RUNTIME_STARTED" | "HAS_CLOUD_DATA_UPDATE" | "QUESTION" | "PROJECT_LOADED" ;

declare interface ScratchComment {
    id: string,
    blockId: string | null,
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    minimized: boolean,
}

declare interface costume {
    asset: {
        assetId: string,
        assetType: any,// 懒得写这个，反正我估计用不上
        clean: true,
        data: Uint8Array,
        dataFormat: string,
        /**
        * @param {string} [contentType] - Optionally override the content type to be included in the data URI.
        * @returns {string} - A data URI representing the asset's data.
        */
        encodeDataURI(contentType?: string): string,
    },
    assetId: string,
    dataFormat: string,
    md5: string,
    name: string,
    rotationCenterX: number,
    rotationCenterY: number,
    size: [number, number],
    skinId: number,
}

declare interface Sprite {
    blocks: any,
    clones: RenderedTarget[],
    costumes: costume[],
    name: string,
    runtime: typeof Scratch.vm.runtime,
    soundBank: any,
    sounds: any[],
}

declare interface RenderedTarget {
    blocks: any,
    comments: {[key: string]: ScratchComment},
    /**
     * 为角色创建一个注释。  
     * 不会立即显示，需要重新加载积木区才能显示。
     * @param id 注释内部ID。貌似可以是任意字符串，但不能与已有注释重合。如果重合，则该函数不会创建注释。
     * @param blockId 貌似是注释附着的积木ID，null代表不附着。
     * @param text 注释内容文本
     * @param x 注释横坐标
     * @param y 注释纵坐标
     * @param width 注释宽度
     * @param height 注释高度
     * @param minimized 是否最小化
     */
    createComment(id: string, blockId: string | null, text: string, x: number, y: number, width: number, height: number, minimized: boolean): void,
    sprite: Sprite,

    getCostumes(): costume[],
    getCostumeIndexByName(name: string): number,
    getCurrentCostume(): costume,
}

declare const Scratch: {

    ArgumentType: {
        /** 角度 */
        ANGLE: "angle",
        /** 布尔值 */
        BOOLEAN: "Boolean",
        /** 颜色 */
        COLOR: "color",
        /** 造型 */
        COSTUME: "costume",
        IMAGE: "image",
        MATRIX: "matrix",
        NOTE: "note",
        /** 数字 */
        NUMBER: "number",
        /** 声音 */
        SOUND: "sound",
        /** 字符串 */
        STRING: "string",
    },

    BlockType: {
        /** 布尔值 */
        BOOLEAN: "Boolean",
        /** 侧栏里用的按钮 */
        BUTTON: "button",
        /** 方积木 */
        COMMAND: "command",
        /** 条件，大概是ifelse那样的东西 */
        CONDITIONAL: "conditional",
        /** 事件 */
        EVENT: "event",
        /** 帽子，大概是像定义函数之类的东西 */
        HAT: "hat",
        /** 侧栏用的文本标签 */
        LABEL: "label",
        /** 循环 */
        LOOP: "loop",
        /** 返回任意值的那种圆积木 */
        REPORTER: "reporter",
        /** 这个貌似是tw新加的，arkos解释说：可以用xml往积木栏塞积木 */
        XML: "xml",
    },

    TargetType: {
        SPRITE: "sprite",
        STAGE: "stage",
    },

    /** 这里我直接照搬了从 tw 源码里翻出来的 jsdoc ，非常感谢开发者留下的详尽注释！ */
    Cast: {
        /**
         * Scratch cast to number.
         * Treats NaN as 0.
         * In Scratch 2.0, this is captured by `interp.numArg.`
         * @param {*} value Value to cast to number.
         * @return {number} The Scratch-casted number value.
         */
        toNumber(value: any): number,

        /**
         * Scratch cast to boolean.
         * In Scratch 2.0, this is captured by `interp.boolArg.`
         * Treats some string values differently from JavaScript.
         * @param {*} value Value to cast to boolean.
         * @return {boolean} The Scratch-casted boolean value.
         */
        toBoolean(value: any): boolean,

        /**
         * Scratch cast to string.
         * @param {*} value Value to cast to string.
         * @return {string} The Scratch-casted string value.
         */
        toString(value: any): string,

        /**
         * Cast any Scratch argument to an RGB color array to be used for the renderer.
         * @param {*} value Value to convert to RGB color array.
         * @return {Array.<number>} [r,g,b], values between 0-255.
         */
        toRgbColorList(value: any): number[],

        /**
         * Cast any Scratch argument to an RGB color object to be used for the renderer.
         * @param {*} value Value to convert to RGB color object.
         * @return {RGBOject} [r,g,b], values between 0-255.
         * 
         * 备注：此处的返回类型是我猜的，原文写得不是很清楚。  
         * jsdoc 说它返回 [r,g,b] ，但从函数名和源码来推测，并不是这样。  
         * 这个 a 的问号也是我猜测着加上去的。
         */
        toRgbColorObject(value: any): {r: number, g: number, b: number, a?: number}

        /**
         * Determine if a Scratch argument is a white space string (or null / empty).
         * @param {*} val value to check.
         * @return {boolean} True if the argument is all white spaces or null / empty.
         */
        isWhiteSpace(val: any): boolean,

        /**
         * Compare two values, using Scratch cast, case-insensitive string compare, etc.
         * In Scratch 2.0, this is captured by `interp.compare.`
         * @param {*} v1 First value to compare.
         * @param {*} v2 Second value to compare.
         * @returns {number} Negative number if v1 < v2; 0 if equal; positive otherwise.
         */
        compare(v1: any, v2: any): number,

        /**
         * Determine if a Scratch argument number represents a round integer.
         * @param {*} val Value to check.
         * @return {boolean} True if number looks like an integer.
         */
        isInt(val: any): boolean,

        readonly LIST_INVALID: 'INVALID',

        readonly LIST_ALL: 'ALL',

        /**
         * Compute a 1-based index into a list, based on a Scratch argument.
         * Two special cases may be returned:
         * LIST_ALL: if the block is referring to all of the items in the list.
         * LIST_INVALID: if the index was invalid in any way.
         * @param {*} index Scratch arg, including 1-based numbers or special cases.
         * @param {number} length Length of the list.
         * @param {boolean} acceptAll Whether it should accept "all" or not.
         * @return {(number|string)} 1-based index for list, LIST_ALL, or LIST_INVALID.
         */
        toListIndex(index: any, length: number, acceptAll: boolean): number | string,
    },

    /** Gandi 会在扩展加载结束后，将 Scratch.vm 替换为 null，务必自行保留 vm 的引用 */
    vm: {
        runtime: {
            /** 添加一个事件监听器 */
            addListener(type: RuntimeEventName, listener: Function): any,
            /** 添加一个事件监听器 */
            on(type: RuntimeEventName, listener: Function): any,
            /** 触发一个事件，如果触发成功则返回 true */
            emit(type: RuntimeEventName): boolean,
            targets: RenderedTarget[];
            /** 我只知道这个似乎可以用于判断是否为 Gandi */
            gandi?: any,
            getSpriteTargetByName(name: string): RenderedTarget | undefined,
        },
    },

    extensions: {
        /**
         * 登记一个扩展。
         * @param extension 扩展实例
         */
        register(extension: any): any,
        /** 用以检查是否为非沙盒模式 */
        unsandboxed: boolean,
    },

    translate: {
        (message: any, args: any): string;
        /** 我只敢说可以这么用，不保证全不全、对不对 */
        (message: { id: string, default?: string }): string;
        /** 当前用户语言 */
        language: string,
        setup(newTranslations: any): void,
    },

};

declare const vm: typeof Scratch.vm;

interface MenuItem {
    text: string;
    value: string;
}
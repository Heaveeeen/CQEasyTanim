// 只是我随手写的些注释，仅供自用，不全，不保证准确。想要可以随便拿去用，但出错了别赖我。

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

declare interface Target {
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
    createComment: (id: string, blockId: string | null, text: string, x: number, y: number, width: number, height: number, minimized: boolean) => void,
}

declare const Scratch: {
    ArgumentType: {
        ANGLE: "angle",
        BOOLEAN: "Boolean",
        COLOR: "color",
        COSTUME: "costume",
        IMAGE: "image",
        MATRIX: "matrix",
        NOTE: "note",
        NUMBER: "number",
        SOUND: "sound",
        STRING: "string",
    },
    BlockType: {
        BOOLEAN: "Boolean",
        BUTTON: "button",
        COMMAND: "command",
        CONDITIONAL: "conditional",
        EVENT: "event",
        HAT: "hat",
        LABEL: "label",
        LOOP: "loop",
        REPORTER: "reporter",
        /** 这个貌似是tw新加的，arkos解释说：可以用xml往积木栏塞积木 */
        XML: "xml",
    },
    TargetType: {
        SPRITE: "sprite",
        STAGE: "stage",
    },
    vm: {
        runtime: {
            /** 添加一个事件监听器 */
            addListener: (type: RuntimeEventName, listener: Function) => any,
            /** 添加一个事件监听器 */
            on: (type: RuntimeEventName, listener: Function) => any,
            /** 触发一个事件，如果触发成功则返回 true */
            emit: (type: RuntimeEventName) => boolean,
            targets: Target[];
            /** 我只知道这个似乎可以用于判断是否为 Gandi */
            gandi?: any;
        },
    },
    extensions: {
        /**
         * 登记一个扩展。
         * @param extension 扩展实例
         */
        register: (extensionObject: any) => any;
        /** 用以检查是否为非沙盒模式 */
        unsandboxed: boolean;
    }
    translate: (message: any, args: any) => any;
};

declare const vm: typeof Scratch.vm;
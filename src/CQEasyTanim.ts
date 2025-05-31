
/**
 * Easy Tanim
 * 这是一个 Scratch 扩展。本扩展能够轻松实现时间轴动画。内置动画编辑器，完美兼容 turbowarp。
 * 
 * 作者：苍穹
 * 感谢 arkos、白猫、simple、允某、酷可mc 等人，他们给我提供了许多帮助，在此不一一列举。（太多了列不出来）
 * arkos 给我提供了很多技术上的帮助，教我怎么写扩展，我爱他❤️
 * 一些缓动函数抄自 https://blog.51cto.com/u_15057855/4403832 （从 Animator 扩展那里翻到的链接，非常感谢！）
 */

(function(Scratch) {

const IsShowWarn: boolean = true;
/** 此值为 false 时，Warn 将不会附带任何对象作为额外信息，包括 error 对象等，只保留第一项信息（通常是警告文本） */
const IsShowWarnExtraInfo: boolean = true;

function Warn(...data: any[]) {
    if (IsShowWarn) {
        if (typeof data[0] == "string") {
            data[0] = "Easy Tanim: " + data[0];
        }
        if (IsShowWarnExtraInfo) {
            console.warn(...data);
        } else {
            console.warn(data[0]);
        }
    }
}

if (!Scratch?.extensions?.unsandboxed) {
    alert(`“时间轴动画”扩展必须在非沙盒模式下运行。
Easy Tanim must run unsandboxed.`);
    throw new Error("Easy Tanim must run unsandboxed.");
}

const vm = Scratch.vm;
const Cast = Scratch.Cast;
const isGandi: boolean = vm.runtime.gandi ? true : false;

const TheExtensionID = "cqeasytanim";
const TheExtensionVersion = "0.0.0-beta";

const enum Strings {
    extName = "CQET_extName",

    bGetTanimValue = "CQET_bGetTanimValue",
    bSetContext = "CQET_bSetContext",
    bGetContextValue = "CQET_bGetContextValue",
    bCreateSnapshot = "CQET_bCreateSnapshot",
    bTransitSnapshot = "CQET_bTransitSnapshot",
    bGetSnapshotValue = "CQET_bGetSnapshotValue",
    bSetContextBySnapshot = "CQET_bSetContextBySnapshot",
    bDeleteSnapshot = "CQET_bDeleteSnapshot",
    bDeleteAllSnapshot = "CQET_bDeleteAllSnapshot",
    bGetTanimInfo = "CQET_bGetTanimInfo",
    bGetTanimEditorInfo = "CQET_bGetTanimEditorInfo",

    mLoopMode_loop = "CQET_mLoopMode_loop",
    mLoopMode_once = "CQET_mLoopMode_once",
    mLoopMode_loopYoyo = "CQET_mLoopMode_loopYoyo",
    mLoopMode_onceYoyo = "CQET_mLoopMode_onceYoyo",

    mTimeUnit_second = "CQET_mTimeUnit_second",
    mTimeUnit_frame = "CQET_mTimeUnit_frame",

    mTanimValueType_px = "CQET_mTanimValueType_px",
    mTanimValueType_py = "CQET_mTanimValueType_py",
    mTanimValueType_s = "CQET_mTanimValueType_s",
    mTanimValueType_sx = "CQET_mTanimValueType_sx",
    mTanimValueType_sy = "CQET_mTanimValueType_sy",
    mTanimValueType_sq = "CQET_mTanimValueType_sq",
    mTanimValueType_sqx = "CQET_mTanimValueType_sqx",
    mTanimValueType_sqy = "CQET_mTanimValueType_sqy",
    mTanimValueType_d = "CQET_mTanimValueType_d",
    mTanimValueType_cos = "CQET_mTanimValueType_cos",

    mTanimInfoType_lengthSec = "CQET_mTanimInfoType_lengthSec",
    mTanimInfoType_length = "CQET_mTanimInfoType_length",
    mTanimInfoType_fps = "CQET_mTanimInfoType_fps",

    mTanimEditorInfoType_time = "CQET_mTanimEditorInfoType_time",
    mTanimEditorInfoType_anim = "CQET_mTanimEditorInfoType_anim",
    mTanimEditorInfoType_sprite = "CQET_mTanimEditorInfoType_sprite",
    mTanimEditorInfoType_cosPrefix = "CQET_mTanimEditorInfoType_cosPrefix",
    mTanimEditorInfoType_cosName = "CQET_mTanimEditorInfoType_cosName",
    mTanimEditorInfoType_cosSuffix = "CQET_mTanimEditorInfoType_cosSuffix",

    labelContext = "CQET_labelContext",
    labelSnapshot = "CQET_labelSnapshot",
    labelUtils = "CQET_labelUtils",

    buttonDoc = "CQET_buttonDoc",
    buttonTutorial = "CQET_buttonTutorial",
    buttonEditor = "CQET_buttonEditor",

    eDefaultTitle = "CQET_eDefaultTitle",
    eDefaultHint = "CQET_eDefaultHint",
    eTanimListTitle = "CQET_eTanimListTitle",
    eLayerListTitle = "CQET_eLayerListTitle",
    eDefaultTanimName = "CQET_eDefaultTanimName",
    eNewTanimNameQuestion = "CQET_eNewTanimNameQuestion",
    eNewTanimNameInFolderQuestion = "CQET_eNewTanimNameInFolderQuestion",
    eRenameTanimQuestion = "CQET_eRenameTanimQuestion",
    eRenameFolderQuestion = "CQET_eRenameFolderQuestion",
    eDeleteTanimQuestion = "CQET_eDeleteTanimQuestion",
    eNewMarkQuestion = "CQET_eNewMarkQuestion",
    eDeleteMarkQuestion = "CQET_eDeleteMarkQuestion",
    eDefaultConfirmQuestion = "CQET_eDefaultConfirmQuestion",
    eCUIFPS = "CQET_eCUIFPS",

    eKUITitle = "CQET_eKUITitle",
    eKUIPleaseCreateTanim = "CQET_eKUIPleaseCreateTanim",
    eKUIPleaseOpenTanim = "CQET_eKUIPleaseOpenTanim",
    eKUINoSelect = "CQET_eKUINoSelect",
    eKUIMultiSelect = "CQET_eKUIMultiSelect",
    eKUILastSelect = "CQET_eKUILastSelect",

    eKUITimeSec = "CQET_eKUITimeSec",
    eKUITimeFrame = "CQET_eKUITimeFrame",
    eKUITValue = "CQET_eKUITValue",

    eKUIInterType = "CQET_eKUIInterType",
    eKUIInterTypeListItem = "CQET_eKUIInterTypeListItem",

    eKUIPowerN = "CQET_eKUIPowerN",
    eKUIExpN = "CQET_eKUIExpN",
    eKUIElasticM = "CQET_eKUIElasticM",
    eKUIElasticN = "CQET_eKUIElasticN",
    eKUIBackS = "CQET_eKUIBackS",
    eKUITradExpVD = "CQET_eKUITradExpVD",
    eKUITradExpVM = "CQET_eKUITradExpVM",
    eKUITradExpP = "CQET_eKUITradExpP",
    eKUILagrangeController = "CQET_eKUILag2Controller",
    eKUILagrangeCX = "CQET_eKUILagrangeCX",
    eKUILagrangeCY = "CQET_eKUILagrangeCY",
    eKUIEaseType = "CQET_eKUIEaseType",
    eKUIBezierHandleType = "CQET_eKUIBezierHandleType",

    eInterTypeConstShort = "CQET_eInterTypeConstShort",
    eInterTypeConstLong = "CQET_eInterTypeConstLong",
    eInterTypeLinearShort = "CQET_eInterTypeLinearShort",
    eInterTypeLinearLong = "CQET_eInterTypeLinearLong",
    eInterTypePowerShort = "CQET_eInterTypePowerShort",
    eInterTypePowerLong = "CQET_eInterTypePowerLong",
    eInterTypeExpShort = "CQET_eInterTypeExpShort",
    eInterTypeExpLong = "CQET_eInterTypeExpLong",
    eInterTypeSineShort = "CQET_eInterTypeSineShort",
    eInterTypeSineLong = "CQET_eInterTypeSineLong",
    eInterTypeCircularShort = "CQET_eInterTypeCircularShort",
    eInterTypeCircularLong = "CQET_eInterTypeCircularLong",
    eInterTypeElasticShort = "CQET_eInterTypeElasticShort",
    eInterTypeElasticLong = "CQET_eInterTypeElasticLong",
    eInterTypeBackShort = "CQET_eInterTypeBackShort",
    eInterTypeBackLong = "CQET_eInterTypeBackLong",
    eInterTypeBounceShort = "CQET_eInterTypeBounceShort",
    eInterTypeBounceLong = "CQET_eInterTypeBounceLong",
    eInterTypeTradExpShort = "CQET_eInterTypeTradExpShort",
    eInterTypeTradExpLong = "CQET_eInterTypeTradExpLong",
    eInterTypeLagrangeShort = "CQET_eInterTypeLagrangeShort",
    eInterTypeLagrangeLong = "CQET_eInterTypeLagrangeLong",
    eInterTypeBezierShort = "CQET_eInterTypeBezierShort",
    eInterTypeBezierLong = "CQET_eInterTypeBezierLong",

    eInputKeyframeSecQuestion = "CQET_eInputKeyframeSecQuestion",
    eInputKeyframeFrameQuestion = "CQET_eInputKeyframeFrameQuestion",
    eInputKeyframeTValueQuestion = "CQET_eInputKeyframeTValueQuestion",

    eInputPowerNQuestion = "CQET_eInputPowerNQuestion",
    eInputExpNQuestion = "CQET_eInputExpNQuestion",
    eInputElasticMQuestion = "CQET_eInputElasticMQuestion",
    eInputElasticNQuestion = "CQET_eInputElasticNQuestion",
    eInputBackSQuestion = "CQET_eInputBackSQuestion",
    eInputTradExpVQuestion = "CQET_eInputTradExpVQuestion",
    eInputTradExpVMQuestion = "CQET_eInputTradExpVMQuestion",
    eInputTradExpPQuestion = "CQET_eInputTradExpPQuestion",
    eInputLagrangeCXSecQuestion = "CQET_eInputLagrangeCXSecQuestion",
    eInputLagrangeCXQuestion = "CQET_eInputLagrangeCXQuestion",
    eInputLagrangeCYQuestion = "CQET_eInputLagrangeCYQuestion",

    tanimMenuPlaceholder = "CQET_tanimMenuPlaceholder",
}

const enum Opcode {
    BGetTanimValue = "BGetTanimValue",
    BSetContext = "BSetContext",
    BGetContextValue = "BGetContextValue",
    BCreateSnapshot = "BCreateSnapshot",
    BTransitSnapshot = "BTransitSnapshot",
    BGetSnapshotValue = "BGetSnapshotValue",
    BSetContextBySnapshot = "BSetContextBySnapshot",
    BDeleteSnapshot = "BDeleteSnapshot",
    BDeleteAllSnapshot = "BDeleteAllSnapshot",
    BGetTanimInfo = "BGetTanimInfo",
    BGetTanimEditorInfo = "BGetTanimEditorInfo",
}

const enum MenuName {
    MTanimName = "MTanimName",
    MLoopMode = "MLoopMode",
    MTimeUnit = "MTimeUnit",
    MTanimValueType = "MTanimValueType",
    MTanimInfoType = "MTanimInfoType",
    MTanimEditorInfoType = "MTanimEditorInfoType",
}

const translates = {
    "zh-cn": {
        [Strings.extName]: "时间轴动画",

        [Strings.bGetTanimValue]: "动画 [tanimName] [loopMode] 第 [time] [timeUnit] 的 [tanimValueType]",

        [Strings.bSetContext]: "将动画语境设为 [tanimName] [loopMode] 的第 [time] [timeUnit]",
        [Strings.bGetContextValue]: "语境的 [tanimValueType]",

        [Strings.bCreateSnapshot]: "为动画 [tanimName] [loopMode] 的第 [time] [timeUnit] 创建快照",
        [Strings.bTransitSnapshot]: "从快照 [snapshotIndexA] 到 [snapshotIndexB] 过渡，创建 [transitT] 处的快照",
        [Strings.bGetSnapshotValue]: "快照 [snapshotIndex] 的 [tanimValueType]",
        [Strings.bSetContextBySnapshot]: "将动画语境设为快照 [snapshotIndex]",
        [Strings.bDeleteSnapshot]: "删除动画快照 [snapshotIndex]",
        [Strings.bDeleteAllSnapshot]: "删除所有动画快照",

        [Strings.bGetTanimInfo]: "动画 [tanimName] 的 [tanimInfoType]",
        [Strings.bGetTanimEditorInfo]: "动画编辑器的 [tanimEditorInfoType]",

        [Strings.mLoopMode_loop]: "循环播放",
        [Strings.mLoopMode_once]: "播放一次",
        [Strings.mLoopMode_loopYoyo]: "循环往复",
        [Strings.mLoopMode_onceYoyo]: "往复一次",

        [Strings.mTimeUnit_second]: "秒",
        [Strings.mTimeUnit_frame]: "帧",

        [Strings.mTanimValueType_px]: "x 坐标",
        [Strings.mTanimValueType_py]: "y 坐标",
        [Strings.mTanimValueType_s]: "大小",
        [Strings.mTanimValueType_sx]: "x 拉伸",
        [Strings.mTanimValueType_sy]: "y 拉伸",
        [Strings.mTanimValueType_sq]: "挤压",
        [Strings.mTanimValueType_sqx]: "x 挤压倍数",
        [Strings.mTanimValueType_sqy]: "y 挤压倍数",
        [Strings.mTanimValueType_d]: "方向",
        [Strings.mTanimValueType_cos]: "造型",

        [Strings.mTanimInfoType_lengthSec]: "时长",
        [Strings.mTanimInfoType_length]: "总帧数",
        [Strings.mTanimInfoType_fps]: "每秒帧数",

        [Strings.mTanimEditorInfoType_time]: "当前帧",
        [Strings.mTanimEditorInfoType_anim]: "当前动画",
        [Strings.mTanimEditorInfoType_sprite]: "当前角色",
        [Strings.mTanimEditorInfoType_cosPrefix]: "造型前缀",
        [Strings.mTanimEditorInfoType_cosName]: "造型名称",
        [Strings.mTanimEditorInfoType_cosSuffix]: "造型后缀",

        [Strings.labelContext]: "~ 🍬动画语境 ~",
        [Strings.labelSnapshot]: "~ 📷动画快照 ~",
        [Strings.labelUtils]: "~ 👉附加功能 ~",

        [Strings.buttonDoc]: "📄文档",
        [Strings.buttonTutorial]: "📄教程",
        [Strings.buttonEditor]: "✏️动画编辑器",

        [Strings.eDefaultTitle]: "时间轴动画编辑器",
        [Strings.eDefaultHint]: "- 提示栏 -",
        [Strings.eTanimListTitle]: "动画管理器",
        [Strings.eLayerListTitle]: "图层",
        [Strings.eDefaultTanimName]: "动画",
        [Strings.eNewTanimNameQuestion]: "新建动画",
        [Strings.eNewTanimNameInFolderQuestion]: "在文件夹“[folderName]”中新建动画",
        [Strings.eRenameTanimQuestion]: "重命名动画“[tanimName]”",
        [Strings.eRenameFolderQuestion]: "重命名文件夹“[folderName]”",
        [Strings.eDeleteTanimQuestion]: "时间轴动画编辑器：确定要删除动画“[tanimName]”吗？",
        [Strings.eNewMarkQuestion]: "新建标签",
        [Strings.eDeleteMarkQuestion]: "时间轴动画编辑器：确定要删除标签“[markName]”吗？",
        [Strings.eDefaultConfirmQuestion]: "时间轴动画编辑器：确定要执行此操作吗？",
        [Strings.eCUIFPS]: "[fps] 帧/秒",

        [Strings.eKUITitle]: "关键帧",
        [Strings.eKUIPleaseCreateTanim]: "- 请在右上方新建动画 -",
        [Strings.eKUIPleaseOpenTanim]: "- 请在上方打开动画 -",
        [Strings.eKUINoSelect]: "- 未选中关键帧 -",
        [Strings.eKUIMultiSelect]: "- 多个关键帧 -",
        [Strings.eKUILastSelect]: "- 最后一个关键帧 -",

        [Strings.eKUITimeSec]: "秒：[TimeSec]",
        [Strings.eKUITimeFrame]: "帧：[TimeFrame]",
        [Strings.eKUITValue]: "值：[TValue]",

        [Strings.eKUIInterType]: "缓动模式：[InterType]",
        [Strings.eKUIInterTypeListItem]: "[InterType]",

        [Strings.eKUIPowerN]: "指数：[powerN]", // 这里小写是为了直接把 EaseParamType 套进去
        [Strings.eKUIExpN]: "陡峭程度：[expN]",
        [Strings.eKUIElasticM]: "摆动次数：[elasticM]",
        [Strings.eKUIElasticN]: "陡峭程度：[elasticN]",
        [Strings.eKUIBackS]: "回弹幅度：[backS]",
        [Strings.eKUITradExpVD]: "每次迭代除数：[tradExpV]",
        [Strings.eKUITradExpVM]: "乘数：[TradExpVM]", // 这里大写是因为实际上没有这个参数
        [Strings.eKUITradExpP]: "每帧迭代次数：[tradExpP]",
        [Strings.eKUILagrangeController]: "第三点相对坐标：",
        [Strings.eKUILagrangeCX]: "帧：[lagrangeCX]",
        [Strings.eKUILagrangeCY]: "纵坐标：[lagrangeCY]",
        [Strings.eKUIEaseType]: "方向：",
        [Strings.eKUIBezierHandleType]: "手柄类型：",

        [Strings.eInterTypeConstShort]: "常数",
        [Strings.eInterTypeConstLong]: "常数",
        [Strings.eInterTypeLinearShort]: "匀速",
        [Strings.eInterTypeLinearLong]: "匀速（线性）",
        [Strings.eInterTypePowerShort]: "幂函数",
        [Strings.eInterTypePowerLong]: "幂函数",
        [Strings.eInterTypeExpShort]: "指数",
        [Strings.eInterTypeExpLong]: "指数函数",
        [Strings.eInterTypeSineShort]: "正弦",
        [Strings.eInterTypeSineLong]: "正弦曲线",
        [Strings.eInterTypeCircularShort]: "圆弧",
        [Strings.eInterTypeCircularLong]: "圆弧曲线",
        [Strings.eInterTypeElasticShort]: "弹簧",
        [Strings.eInterTypeElasticLong]: "弹簧",
        [Strings.eInterTypeBackShort]: "回弹",
        [Strings.eInterTypeBackLong]: "回弹",
        [Strings.eInterTypeBounceShort]: "弹跳",
        [Strings.eInterTypeBounceLong]: "弹跳",
        [Strings.eInterTypeTradExpShort]: "传统",
        [Strings.eInterTypeTradExpLong]: "传统非线性",
        [Strings.eInterTypeLagrangeShort]: "三点",
        [Strings.eInterTypeLagrangeLong]: "三点二次函数",
        [Strings.eInterTypeBezierShort]: "曲线",
        [Strings.eInterTypeBezierLong]: "贝塞尔曲线",

        [Strings.eInputKeyframeSecQuestion]: "输入关键帧横坐标（秒）",
        [Strings.eInputKeyframeFrameQuestion]: "输入关键帧横坐标（帧）",
        [Strings.eInputKeyframeTValueQuestion]: "输入关键帧值（数字或字符串）",

        [Strings.eInputPowerNQuestion]: "输入幂函数指数（≥0）",
        [Strings.eInputExpNQuestion]: "输入指数缓动陡峭程度（>0）",
        [Strings.eInputElasticMQuestion]: "输入弹簧缓动摆动次数（>0）",
        [Strings.eInputElasticNQuestion]: "输入弹簧缓动陡峭程度（>0）",
        [Strings.eInputBackSQuestion]: "输入回弹幅度（≥0）",
        [Strings.eInputTradExpVQuestion]: "输入每次迭代除数（≥1）",
        [Strings.eInputTradExpVMQuestion]: "输入每次迭代乘数（>0，≤1）",
        [Strings.eInputTradExpPQuestion]: "输入每秒迭代次数（>0）",
        [Strings.eInputLagrangeCXSecQuestion]: "输入控制点横坐标（秒）",
        [Strings.eInputLagrangeCXQuestion]: "输入控制点横坐标（帧）",
        [Strings.eInputLagrangeCYQuestion]: "输入控制点纵坐标",

        [Strings.tanimMenuPlaceholder]: "- 未创建动画 -",
    } as const,
} as const;

Scratch.translate.setup(translates);

function getTranslate(id: Strings): string {
    return Scratch.translate({ id: id, default: translates["zh-cn"][id]});
}

const InterTypeStrings = {
    [InterType.const]: [Strings.eInterTypeConstShort, Strings.eInterTypeConstLong],
    [InterType.linear]: [Strings.eInterTypeLinearShort, Strings.eInterTypeLinearLong],
    [InterType.power]: [Strings.eInterTypePowerShort, Strings.eInterTypePowerLong],
    [InterType.exp]: [Strings.eInterTypeExpShort, Strings.eInterTypeExpLong],
    [InterType.sine]: [Strings.eInterTypeSineShort, Strings.eInterTypeSineLong],
    [InterType.circular]: [Strings.eInterTypeCircularShort, Strings.eInterTypeCircularLong],
    [InterType.elastic]: [Strings.eInterTypeElasticShort, Strings.eInterTypeElasticLong],
    [InterType.back]: [Strings.eInterTypeBackShort, Strings.eInterTypeBackLong],
    [InterType.bounce]: [Strings.eInterTypeBounceShort, Strings.eInterTypeBounceLong],
    [InterType.tradExp]: [Strings.eInterTypeTradExpShort, Strings.eInterTypeTradExpLong],
    [InterType.lagrange]: [Strings.eInterTypeLagrangeShort, Strings.eInterTypeLagrangeLong],
    [InterType.bezier]: [Strings.eInterTypeBezierShort, Strings.eInterTypeBezierLong],
} as const;

const InputEaseParamQuestionStrings = {
    "powerN": Strings.eInputPowerNQuestion,
    "expN": Strings.eInputExpNQuestion,
    "elasticM": Strings.eInputElasticMQuestion,
    "elasticN": Strings.eInputElasticNQuestion,
    "backS": Strings.eInputBackSQuestion,
    "tradExpV": Strings.eInputTradExpVQuestion,
    "tradExpP": Strings.eInputTradExpPQuestion,
    "lagrangeCX": Strings.eInputLagrangeCXQuestion,
    "lagrangeCY": Strings.eInputLagrangeCYQuestion,
};

// #region 数学和插值

let { exp, pow, PI, sin, cos, atan2, sqrt, abs, max, min, log, log2, log10, sign } = Math;

/** 对一个数字四舍五入，最多保留n位小数 */
function round(x: number, n: number = 0): number {
    let m = 10 ** n;
    return Math.round(x * m) / m;
}

/** 对一个数字向下取整，最多保留n位小数 */
function floor(x: number, n: number = 0): number {
    let m = 10 ** n;
    return Math.floor(x * m) / m;
}

/** 对一个数字向上取整，最多保留n位小数 */
function ceil(x: number, n: number = 0): number {
    let m = 10 ** n;
    return Math.ceil(x * m) / m;
}

function getSafeCommentID(base: string): string {
    let ids = [];
    for (let i in vm.runtime.targets) {
        let t = vm.runtime.targets[i];
        for (let j in t.comments) {
            ids.push(t.comments[j].id);
        }
    }
    if (!ids.includes(base)) return base;
    let i;
    for (i = 2; ids.includes(base + i); i++) continue;
    return base + i;
}

function clamp(x: number, a: number, b: number) {
    return max(a, min(x, b));
}

/**
 * x % n，但结果不为负数
 * 例如：-3 % 10 结果为7
 */
function positiveMod(x: number, n: number) {
    x = x % n;
    if (x < 0) x -= floor(x / n) * n;
    return x;
}

function sqToSqx(sq: number) {
    return sq > 0 ? (100 + sq) / 100 : 100 / (100 - sq);
}

function sqToSqy(sq: number) {
    return sq > 0 ? 100 / (100 + sq) : (100 - sq) / 100;
}

/** 一系列插值函数，有的是我自己写的，有的是上网找的。
 * 
 * Inter函数接受两个端点的坐标和横坐标，返回插值结果。
 * 
 * Map函数接受一个t，返回一个插值度，从0到1。
 */
class InterpolationFunctions {

    static Lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

    static InterLerp(x1: number, y1: number, x2: number, y2: number, x: number): number {
        if (x1 == x2) return y2;
        let t = (x - x1) / (x2 - x1);
        return this.Lerp(y1, y2, t);
    };

    static TInOut(t: number): number {
        if (t <= 0.5) {
            return t * 2;
        } else {
            return (1 - t) * 2;
        }
    };

    static RInOut(t: number, r: number): number {
        if (t <= 0.5) {
            return r / 2;
        } else {
            return 1 - r / 2;
        }
    };

    static TOutIn(t: number): number {
        if (t <= 0.5) {
            return 1 - t * 2;
        } else {
            return 2 * t - 1;
        }
    };

    static ROutIn(t: number, r: number): number {
        if (t <= 0.5) {
            return (1 - r) / 2;
        } else {
            return (1 + r) / 2;
        }
    };

    static InterEase(x1: number, y1: number, x2: number, y2: number, x: number, easeType: EaseType, mfn: (tm: number) => number): number {
        if (x1 == x2) return y2;
        let t = (x - x1) / (x2 - x1);
        let tm = t;
        switch (easeType) {
            case EaseType.out:
                tm = 1 - t;
                break;
            case EaseType.inOut:
                tm = this.TInOut(t);
                break;
            case EaseType.outIn:
                tm = this.TOutIn(t);
                break;
        }
        let rm = mfn(tm);
        let r = rm;
        switch (easeType) {
            case EaseType.out:
                r = 1 - rm;
                break;
            case EaseType.inOut:
                r = this.RInOut(t, rm);
                break;
            case EaseType.outIn:
                r = this.ROutIn(t, rm);
                break;
        }
        return this.Lerp(y1, y2, r);
    }

    static MapPowerIn = (t: number, n: number) => pow(t, n);

    static MapExpIn = (t: number, n: number) => (exp(n * t) - 1) / (exp(n) - 1);
    /*{
        let a = exp(n);
        return (pow(a, t) - 1) / (a - 1);
    }*/

    static MapSineIn = (t: number) => 1 - cos(t * PI / 2);

    static MapCircIn = (t: number) => -(sqrt(1 - pow(t, 2)) - 1);

    static MapElasticIn = (t: number, m: number, n: number) => ((exp(n * t) - 1) / (exp(n) - 1)) * sin(2 * PI * (m * (t - 1) + 0.25));
    /*{
        let a = exp(n);
        return ((pow(a, t) - 1) / (a - 1)) * sin(2 * PI * (m * (t - 1) + 0.25));
    }*/

    static MapBackIn = (t: number, s: number) => t * t * ((s + 1) * t - s);
    static GetBackH = (s: number) => (4 * s * s * s) / (27 * (s + 1) * (s + 1));

    // 网上抄的，这个应该没法简化
    static MapBounceOut = (t: number) =>  {
        if ((t) < (1/2.75)) {
            return (7.5625*t*t);
        } else if (t < (2/2.75)) {
              return (7.5625*(t-=(1.5/2.75))*t + .75);
        } else if (t < (2.5/2.75)) {
              return (7.5625*(t-=(2.25/2.75))*t + .9375);
        } else {
              return (7.5625*(t-=(2.625/2.75))*t + .984375);
        }
    };

    static InterTradExp = (x1: number, y1: number, x2: number, y2: number, x: number, v: number, p: number) => {
        if (x1 == x2) return y2;
        let a = pow(1 - 1 / v, p * (x2 - x1));
        let t = (x - x1) / (x2 - x1);
        let r = (pow(a, t) - 1) / (a - 1);
        return this.Lerp(y1, y2, r);
    }


    static InterLag2 = (x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, x: number) => {
        if (x1 == x2 || x1 == cx || x2 == cx) return this.InterLerp(x1, y1, x2, y2, x);
        let l1 = (y1 * (x - cx) * (x - x2)) / ((x1 - cx) * (x1 - x2));
        let l2 = (cy * (x - x1) * (x - x2)) / ((cx - x1) * (cx - x2));
        let l3 = (y2 * (x - x1) * (x - cx)) / ((x2 - x1) * (x2 - cx));
        return l1 + l2 + l3;
    }

    static CalcBezier3 = (p1: number, p2: number, p3: number, p4: number, t: number) =>
        p1 * pow(1 - t, 3) + p2*3 * pow(1 - t, 2)*t + p3*3 * (1 - t)*pow(t, 2) + p4 * pow(t, 3);
    // 牛顿法求近似解（直接解太复杂，D老师说这个比直接解快。。。虽然我感觉他在胡说，但这个目前来看似乎还算够用。。。）
    static InterBezier3 = (x1: number, y1: number, x2: number, y2: number, cx1: number, cy1: number, cx2: number, cy2: number, x: number) => {
        if (x1 == x2) return y2;
        cx1 = clamp(cx1, x1, x2);
        cx2 = clamp(cx2, x1, x2);
        let f = (t: number) => this.CalcBezier3(x1, cx1, cx2, x2, t);
        let t = (x - x1) / (x2 - x1);
        let low = 0;
        let high = 1;
        let ft;
        for (let i = 0; i < 100; i++) {
            ft = f(t);
            if (Math.abs(ft - x) <= 1e-5) {
                break;
            } else if (ft > x) {
                high = t;
            } else {
                low = t;
            }
            t = (low + high) / 2;
        }
        return this.CalcBezier3(y1, cy1, cy2, y2, t);
    }
}

// #endregion



type TValue = number | string;
type EaseParamValue = number | EaseType | BezierHandleType;
type EaseParams = {[key: string]: EaseParamValue} | null;

const enum InterType {
    /** 常数 */
    const = "const",
    /** 线性插值 */
    linear = "linear",
    /** 幂插值 */
    power = "power",
    /** 指数插值 */
    exp = "exp",
    /** 正弦插值 */
    sine = "sine",
    /** 圆弧插值 */
    circular = "circular",
    /** 弹簧插值 */
    elastic = "elastic",
    /** 回弹插值 */
    back = "back",
    /** 弹跳插值 */
    bounce = "bounce",
    /** 传统非线性插值，指数插值的变体 */
    tradExp = "tradExp",
    /** 三点二次（拉格朗日）插值 */
    lagrange = "lagrange",
    /** 贝塞尔曲线插值 */
    bezier = "bezier",
}

const enum BezierHandleType {
    free = "free",
    aligned = "aligned",
    vector = "vector",
    auto = "auto",
}

const enum EaseType {
    in = "easeIn",
    out = "easeOut",
    inOut = "easeInOut",
    outIn = "easeOutIn",
}

const enum DefaultTValueType {
    /** 横坐标 */
    px = "px",
    /** 纵坐标 */
    py = "py",
    /** 缩放 */
    s = "s",
    /** 横拉伸 */
    sx = "sx",
    /** 纵拉伸 */
    sy = "sy",
    /** 挤压 */
    sq = "sq",
    /** 横挤压倍数 */
    sqx = "sqx",
    /** 纵挤压倍数 */
    sqy = "sqy",
    /** 方向 */
    d = "d",
    /** 造型 */
    cos = "cos",
}

const enum LoopMode {
    loop = "loop",
    once = "once",
    loopYoyo = "loop-yoyo",
    onceYoyo = "once-yoyo"
}

const enum TimeUnit {
    frame = "frame",
    second = "second",
}

const enum TInfoType {
    lengthSec = "lengthSec",
    length = "length",
    fps = "fps",
}

const enum TEditorInfoType {
    time = "time",
    anim = "anim",
    sprite = "sprite",
    cosPrefix = "cosPrefix",
    cosName = "cosName",
    cosSuffix = "cosSuffix",
}

/** 各种特殊属性的默认值 */
const DefaultTValues: {[key: string]: TValue} = {
    [DefaultTValueType.px]: 0,
    [DefaultTValueType.py]: 0,
    [DefaultTValueType.s]: 100,
    [DefaultTValueType.sx]: 100,
    [DefaultTValueType.sy]: 100,
    [DefaultTValueType.sq]: 0,
    [DefaultTValueType.sqx]: 1,
    [DefaultTValueType.sqy]: 1,
    [DefaultTValueType.d]: 90,
    [DefaultTValueType.cos]: "",
};

/** 如果一个动画值是空值，则返回其默认值 */
function safeTValue(tValue: TValue | null | undefined, tValueType: string): TValue {
    let result = tValue ?? DefaultTValues[tValueType] ?? 0;
    return Number.isNaN(result) ? 0 : result;
}

/** 快照，即一系列动画值的集合。可以理解为 transform。 */
type Snapshot = {[key: string]: TValue};

/** 用于在注释中标识保存数据的标记 */
const enum SavedataMarks {
    head = "!!!CQ_EASY_TANIM_SAVE_DATA_HEAD_DONT_EDIT_THIS!!!",
    tail = "!!!CQ_EASY_TANIM_SAVE_DATA_TAIL_DONT_EDIT_THIS!!!",
}

type EaseParamType = "easeType" | "bezierHandleType" |
"powerN" | "expN" | "elasticM" | "elasticN" | "backS" | "tradExpV" | "tradExpP" |
"lagrangeCX" | "lagrangeCY" | "bezierCX1" | "bezierCY1" | "bezierCX2" | "bezierCY2";

/** 一个关键帧，即时间轴上的一个插值点 */
class Keyframe {
    interType: InterType;
    x: number;
    y: TValue;
    params: EaseParams;

    constructor(x: number, y: TValue, interType: InterType, params: EaseParams = null) {
        this.interType = interType;
        this.x = x;
        this.y = y;
        this.params = params ?? null;
    }

    static FromObject(obj: any): Keyframe | null {
        try {
            let { x, y, interType, params } = obj;
            if (
                typeof x != "number" ||
                (typeof y != "number" && typeof y != "string") ||
                typeof interType != "string" ||
                typeof params != "object"
            ) {
                throw new Error();
            };
            return new Keyframe(x, y, interType as InterType, params);
        } catch (error) {
            Warn("尝试构造 Keyframe 对象时，捕获到错误。", obj, error);
            return null;
        }
    }

    getDefaultParam(key: EaseParamType): number | EaseType | BezierHandleType | null {
        switch (key) {
            case "easeType": return EaseType.in;
            case "powerN": return 2;
            case "expN": return 6.93;
            case "elasticM": return 3.33;
            case "elasticN": return 6.93;
            case "backS": return 1.70158;
            case "tradExpV": return 3;
            case "tradExpP": return 1;
            case "lagrangeCX": return 0;
            case "lagrangeCY": return 0;
            case "bezierCX1": return 0;
            case "bezierCY1": return 0;
            case "bezierCX2": return 0;
            case "bezierCY2": return 0;
            case "bezierHandleType": return BezierHandleType.auto;
            default: return null;
        }
    }

    getParam(key: EaseParamType): number | EaseType | BezierHandleType | null {
        let result = this.params === null ? null : this.params[key];
        return result ?? this.getDefaultParam(key);
    }

    setParam(key: EaseParamType, value: EaseParamValue) {
        if (!this.params) this.params = {};
        this.params[key] = value;
    }

    /** 对齐贝塞尔手柄，main 一方会尽可能保持不变，主要改变另一方 */
    alignBezierHandle(left: Keyframe | null, right: Keyframe | null, handleType: BezierHandleType | null = null, main: "left" | "right" = "left"): void {
        let cxLeft = left?.getParam("bezierCX2") as number;
        let cyLeft = left?.getParam("bezierCY2") as number;
        let cxRight = this.getParam("bezierCX1") as number;
        let cyRight = this.getParam("bezierCY1") as number;
        let isHasLeftHandle = left && left.interType == InterType.bezier && typeof cxLeft == "number" && typeof cyLeft == "number";
        let isHasRightHandle = right && this.interType == InterType.bezier && typeof cxRight == "number" && typeof cyRight == "number";
        handleType ??= this.getParam("bezierHandleType") as BezierHandleType;

        switch (handleType) {
            case BezierHandleType.aligned:
            case BezierHandleType.free:
                if (isHasLeftHandle && left) { // 这里的 && left 是为了糊弄 ts 这个傻逼类型检查。。。
                    if (cxLeft < left.x - this.x || 0 < cxLeft) {
                        cxLeft = clamp(cxLeft, left.x - this.x, 0);
                        left.setParam("bezierCX2", cxLeft);
                        console.log(left.x - this.x);
                        return this.alignBezierHandle(left, right, handleType, "left");
                    }
                }
                if (isHasLeftHandle && right) {
                    if (cxRight < 0 || right.x - this.x < cxRight) {
                        cxRight = clamp(cxRight, 0, right.x - this.x);
                        this.setParam("bezierCX1", cxRight);
                        console.log(right.x - this.x);
                        return this.alignBezierHandle(left, right, handleType, "right");
                    }
                }
                if (handleType == BezierHandleType.free) break;
                if (isHasLeftHandle && isHasRightHandle && left && right) {
                    // 在两根手柄之间对齐
                    if (main == "left") {
                        // 右手柄向左对齐
                        let l = sqrt(cxRight * cxRight + cyRight * cyRight);
                        let d = atan2(cyLeft, cxLeft) + PI;
                        cxRight = l * cos(d);
                        cyRight = l * sin(d);
                    } else {
                        // 左手柄向右对齐
                        let l = sqrt(cxLeft * cxLeft + cyLeft * cyLeft);
                        let d = atan2(cyRight, cxRight) + PI;
                        cxLeft = l * cos(d);
                        cyLeft = l * sin(d);
                    }
                }
                break;
            case BezierHandleType.vector:
                cxLeft = 0;
                cyLeft = 0;
                cxRight = 0;
                cyRight = 0;
                break;
            case BezierHandleType.auto:
                if (!isHasLeftHandle && isHasRightHandle && right) {
                    // mid 位于最左端
                    cxRight = (right.x - this.x) / 3;
                    cyRight = 0;
                    break;
                }
                if (isHasLeftHandle && !isHasRightHandle && left) {
                    // mid 位于最右端
                    cxLeft = (left.x - this.x) / 3;
                    cyLeft = 0;
                    break;
                }
                if (!left || !right) break;
                if (
                    typeof left.y != "number" ||
                    typeof this.y != "number" ||
                    typeof right.y != "number"
                ) break;
                cxLeft = (left.x - this.x) / 3;
                cxRight = (right.x - this.x) / 3;
                let dx = cxRight - cxLeft;
                if (dx == 0) {
                    // 三点共竖线，理论上讲这种情况不合法
                    cyLeft = 0;
                    cyRight = 0;
                    break;
                }
                if (sign(right.y - this.y) == sign(left.y - this.y)) {
                    // 凸或者凹，手柄是平的
                    cyLeft = 0;
                    cyRight = 0;
                    break;
                }
                let dy = (right.y - left.y) / 2;
                if (dy == 0) {
                    // 三点共横线
                    cyLeft = 0;
                    cyRight = 0;
                    break;
                }
                // 至此，手柄的四个值都不为0
                let yMin = min(left.y, right.y) - this.y;
                let yMax = max(left.y, right.y) - this.y;
                let k = dy / dx;
                cyLeft = k * cxLeft;
                cyRight = k * cxRight;
                if (yMin > cyLeft || cyLeft > yMax) {
                    k = clamp(cyLeft, yMin, yMax) / cxLeft;
                    cyLeft = k * cxLeft;
                    cyRight = k * cxRight;
                }
                if (yMin > cyRight || cyRight > yMax) {
                    k = clamp(cyRight, yMin, yMax) / cxRight;
                    cyLeft = k * cxLeft;
                    cyRight = k * cxRight;
                }
                break;
        }

        left?.setParam("bezierCX2", cxLeft);
        left?.setParam("bezierCY2", cyLeft);
        this.setParam("bezierCX1", cxRight);
        this.setParam("bezierCY1", cyRight);
    }

    static Ease(x: number, left: Keyframe, right: Keyframe): TValue {
        let interType = left.interType;
        let { x: x1, y: y1 } = left;
        let { x: x2, y: y2 } = right;
        if (typeof y1 == "string" || typeof y2 == "string") {
            return y1;
        }
        let easeType = left.getParam("easeType") as EaseType; // 疯狂 as！
        let fn = InterpolationFunctions;
        switch (interType) {
            case InterType.const:
                return y1;
            case InterType.linear:
                return fn.InterLerp(x1, y1, x2, y2, x);
            case InterType.tradExp:
                return fn.InterTradExp(x1, y1, x2, y2, x, left.getParam("tradExpV") as number, left.getParam("tradExpP") as number);
            case InterType.lagrange:
                return fn.InterLag2(x1, y1, x2, y2, left.getParam("lagrangeCX") as number + (x1 + x2) / 2, left.getParam("lagrangeCY") as number + (y1 + y2) / 2, x);
            case InterType.bezier:
                return fn.InterBezier3(x1, y1, x2, y2,
                    left.getParam("bezierCX1") as number + x1,
                    left.getParam("bezierCY1") as number + y1,
                    left.getParam("bezierCX2") as number + x2,
                    left.getParam("bezierCY2") as number + y2,
                x);

            case InterType.power:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapPowerIn(tm, left.getParam("powerN") as number));
            case InterType.exp:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapExpIn(tm, left.getParam("expN") as number));
            case InterType.sine:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapSineIn(tm));
            case InterType.circular:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapCircIn(tm));
            case InterType.elastic:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapElasticIn(tm, left.getParam("elasticM") as number, left.getParam("elasticN") as number));
            case InterType.back:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapBackIn(tm, left.getParam("backS") as number));
            case InterType.bounce:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => 1 - fn.MapBounceOut(1 - tm));
            default:
                return y1;
        }
    }

    getCopy(): Keyframe {
        return Keyframe.FromObject(JSON.parse(JSON.stringify(this))) as Keyframe;
    }
}

/** 一条时间轴，即动画中某一属性对应的分段函数 */
class Timeline {
    tValueType: string;
    keyframes: Keyframe[];

    constructor(tValueType: string, keyframes: Keyframe[]) {
        this.tValueType = tValueType;
        this.keyframes = keyframes;
    }

    static FromObject(obj: any): Timeline | null {
        try {
            let { tValueType, keyframes } = obj;
            if (
                typeof tValueType != "string" ||
                !Array.isArray(keyframes)
            ) {
                throw new Error();
            };
            let parsedKeyframes = keyframes.map(kf => {
                let parsedKeyframe = Keyframe.FromObject(kf);
                if (parsedKeyframe === null) {
                    throw new Error();
                } else {
                    return parsedKeyframe;
                }
            });
            return new Timeline(tValueType, parsedKeyframes);
        } catch (error) {
            Warn("尝试构造 Timeline 对象时，捕获到错误。", obj, error);
            return null;
        }
    }

    /**
     * 查找目标点左侧的第一个关键帧  
     * 感谢d老师帮我改成了二分查找  
     * 注意：如果有多个重合的关键帧，这个函数会返回索引最小的那个
     */
    findLeftKeyframe(x: number, equals: boolean = true): Keyframe | null {
        let left = 0;
        let right = this.keyframes.length - 1;
        let result: Keyframe | null = null;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const keyframe = this.keyframes[mid];
            
            if (keyframe.x < x || (equals && keyframe.x === x)) {
                result = keyframe;
                left = mid + 1; // 继续向右查找更接近的
            } else {
                right = mid - 1;
            }
        }

        return result;
    }

    /**
     * 查找目标右侧的第一个关键帧  
     * 再次感谢deepseek，我这个小脑瓜子写二分查找实在是费劲  
     * 注意：如果有多个重合的关键帧，这个函数会返回索引最大的那个
     */
    findRightKeyframe(x: number, equals: boolean = true): Keyframe | null {
        let left = 0;
        let right = this.keyframes.length - 1;
        let result: Keyframe | null = null;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const keyframe = this.keyframes[mid];
            
            if (keyframe.x > x || (equals && keyframe.x === x)) {
                result = keyframe;
                right = mid - 1; // 继续向左查找更接近的
            } else {
                left = mid + 1;
            }
        }

        return result;
    }

    /** 
     * 查找目标帧附近的第一个关键帧  
     * 真得给d老师磕个响的🙇‍♂️🙇‍♂️🙇‍♂️您老要是哪天想统治人类，我第一个投降🏳️  
     * 注意：如果有多个重合的关键帧，这个函数会返回索引最大的那个
     */
    findKeyframeByTime(x: number, r: number = 0.5): Keyframe | null {
        // 先找到x-r左侧最近的keyframe作为起点
        let left = 0;
        let right = this.keyframes.length - 1;
        let startIdx = -1;
        
        // 二分查找x-r的左侧边界
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.keyframes[mid].x >= x - r) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        startIdx = left;

        // 线性扫描范围内的keyframes，保留最接近且索引最大的
        let closest: Keyframe | null = null;
        for (let i = startIdx; i < this.keyframes.length; i++) {
            const point = this.keyframes[i];
            if (point.x > x + r) break;
            
            const distance = Math.abs(point.x - x);
            if (distance <= r) {
                if (!closest || distance <= Math.abs(closest.x - x)) {
                    closest = point;
                }
            }
        }

        return closest;
    }

    getTValueByFrame(x: number): TValue {
        if (this.keyframes.length == 0) {
            return DefaultTValues[this.tValueType] ?? 0;
        } else if (this.keyframes.length == 1) {
            return this.keyframes[0].y;
        }

        let left = this.findLeftKeyframe(x);

        let right = this.findRightKeyframe(x);

        if (!left || !right) {
            return safeTValue(right?.y ?? left?.y ?? null, this.tValueType);
        }

        if (left.x == right.x) {
            return left.y; // 由于查找算法的特性，这里返回的实际上是右侧关键帧的值
        }

        return Keyframe.Ease(x, left, right);
    }

    rename(tValueType: string) {
        this.tValueType = tValueType;
    }

    /*getClampedKeyframeMovement(keyframes: Keyframe[], x: number): number {
        if (x == 0) return 0;
        if (x > 0) {
            // 向右移动，则不能超过右边的帧。
            let maxX = Infinity;
            for (let keyframe of keyframes) {
                let rightKeyframe = this.findRightKeyframe(keyframe.x, true);
                if (rightKeyframe && !keyframes.includes(rightKeyframe)) { //移动的同一批帧之间，不会相互碰撞。
                    maxX = min(maxX, rightKeyframe.x - keyframe.x);
                }
            }
            return min(x, maxX);
        } else {
            // 向左移动，则不能超过左边的帧。
            let minX = Infinity;
            for (let keyframe of keyframes) {
                let leftKeyframe = this.findLeftKeyframe(keyframe.x, true);
                if (leftKeyframe && !keyframes.includes(leftKeyframe)) {
                    minX = max(minX, leftKeyframe.x - keyframe.x);
                }
            }
            return max(x, minX);
        }
    }*/

    /** 每次修改关键帧列表后，务必运行该函数 */
    sortKeyframes() {
        let indexedKeyframes = this.keyframes.map((keyframe, index) => ({keyframe, index}));
        indexedKeyframes.sort((a, b) => a.keyframe.x - b.keyframe.x || a.index - b.index);
        this.keyframes.length = 0;
        this.keyframes.push(...indexedKeyframes.map(item => item.keyframe));
    }

    /** from 到 to 左闭右开 */
    alignBezierHandleKeyframes(from: number | null = null, to: number | null = null) {
        from ??= 0;
        to ??= this.keyframes.length;
        for (let i = from; i < to; i ++) {
            let keyframe = this.keyframes[i];
            if (keyframe.interType != InterType.bezier && this.keyframes[i - 1]?.interType != InterType.bezier) continue;
            let leftKeyframe = (this.keyframes[i - 1] ?? null) as Keyframe | null;
            let rightKeyframe = (this.keyframes[i + 1] ?? null) as Keyframe | null;

            keyframe.alignBezierHandle(leftKeyframe, rightKeyframe);
        }
    }
}

/** 一个动画，包含许多动画属性，每个属性对应一个时间轴 */
class Tanim {
    /** 请勿直接修改此属性。使用 rename() 方法重命名动画。 */
    name: string;
    length: number;
    fps: number;
    timelines: Timeline[];

    constructor(name: string, length: number, fps: number, timelines: Timeline[]) {
        this.name = name;
        this.length = length;
        this.fps = fps;
        this.timelines = timelines;
    }

    static FromObject(obj: any): Tanim | null {
        try {
            let { name, length, fps, timelines } = obj;
            if (
                typeof name != "string" ||
                typeof length != "number" ||
                typeof fps != "number" ||
                !Array.isArray(timelines)
            ) {
                throw new Error();
            };
            let parsedTimelines = timelines.map(tl => {
                let parsedTimeline = Timeline.FromObject(tl);
                if (parsedTimeline === null) {
                    throw new Error();
                } else {
                    return parsedTimeline;
                }
            });
            return new Tanim(name, length, fps, parsedTimelines);
        } catch (error) {
            Warn("尝试构造 Tanim 对象时，捕获到错误。", obj, error);
            return null;
        }
    }

    rename(name: string, renameTanimConfig: boolean = true) {
        if (renameTanimConfig && TheTanimEditorConfigs.tanimConfigs[this.name]) {
            TheTanimEditorConfigs.tanimConfigs[name] = TheTanimEditorConfigs.tanimConfigs[this.name];
            delete TheTanimEditorConfigs.tanimConfigs[this.name];
        }
        this.name = name;
        saveData();
    }

    getTimelineByTValueType(tValueType: string): Timeline | null {
        let result = this.timelines.find(timeline => timeline.tValueType === tValueType);
        return result ?? null
    }

    /** 将用户输入的时间转化为时间轴上的横坐标 */
    getTime(time: number, timeUnit: TimeUnit, loopMode: LoopMode): number {
        if (timeUnit === TimeUnit.second) {
            time *= this.fps;
        }
        switch (loopMode) {
            case LoopMode.once:
                time = clamp(time, 0, this.length);
                break;
            case LoopMode.loopYoyo:
                time = positiveMod(time, this.length * 2);
                if (time > this.length) time = this.length * 2 - time;
                break;
            case LoopMode.onceYoyo:
                time = clamp(time, 0, this.length * 2);
                if (time > this.length) time = this.length * 2 - time;
                break;
            default:
            case LoopMode.loop:
                time = positiveMod(time, this.length);
                break;
        }
        return time;
    }

    getTValue(tValueType: string, time: number, timeUnit: TimeUnit, loopMode: LoopMode): TValue | null {
        if (tValueType == DefaultTValueType.sqx || tValueType == DefaultTValueType.sqy) {
            let sq = safeTValue(this.getTValue(DefaultTValueType.sq, time, timeUnit, loopMode), DefaultTValueType.sq);
            if (typeof sq == "string") {
                return 1;// 这里我个偷懒，直接特判，把默认值硬编码在这。反正这个默认值不太可能改。
            }
            if (tValueType == DefaultTValueType.sqx) {
                return sqToSqx(sq);
            } else {
                return sqToSqy(sq);
            }
        }
        let timeline = this.getTimelineByTValueType(tValueType);
        if (!timeline) return null;
        time = this.getTime(time, timeUnit, loopMode);
        return timeline.getTValueByFrame(time);
    }

    getSnapshot(time: number, timeUnit: TimeUnit, loopMode: LoopMode): Snapshot {
        let snapshot: Snapshot = {};
        time = this.getTime(time, timeUnit, loopMode);
        for (let timeline of this.timelines) {
            snapshot[timeline.tValueType] = timeline.getTValueByFrame(time);
        }
        return snapshot;
    }

    getSafeTValueType(tValueType: string): string {
        let tValueTypes = this.timelines.map(timeline => timeline?.tValueType).concat(DefaultTValueNames);
        while (tValueTypes.includes(tValueType) || DefaultTValues[tValueType] !== undefined) {
            tValueType = incrementSuffix(tValueType);
        }
        return tValueType;
    }
}

/** 用于装载所有动画的管理器 */
class TanimManager {
    tanims: Tanim[];
    context: Snapshot;
    snapshots: (Snapshot | null)[];
    tValueTypes: string[];

    constructor(tanims: Tanim[]) {
        this.tanims = tanims;
        this.context = {};
        this.snapshots = [];
        this.tValueTypes = [
            DefaultTValueType.px,
            DefaultTValueType.py,
            DefaultTValueType.s,
            DefaultTValueType.sx,
            DefaultTValueType.sy,
            DefaultTValueType.sq,
            DefaultTValueType.sqx,
            DefaultTValueType.sqy,
            DefaultTValueType.d,
            DefaultTValueType.cos,
        ]
        for (let tanim of tanims) {
            for (let timeline of tanim.timelines) {
                if (!this.tValueTypes.includes(timeline.tValueType)) {
                    this.tValueTypes.push(timeline.tValueType);
                }
            }
        }
    }

    static FromObject(obj: any): TanimManager | null {
        try {
            let { tanims } = obj;
            if (
                !Array.isArray(tanims)
            ) {
                throw new Error();
            };
            let parsedTanims = tanims.map(ta => {
                let parsedTanim = Tanim.FromObject(ta);
                if (parsedTanim === null) {
                    throw new Error();
                } else {
                    return parsedTanim;
                }
            });
            return new TanimManager(parsedTanims);
        } catch (error) {
            Warn("尝试构造 TanimManager 对象时，捕获到错误。", obj, error);
            return null;
        }
    }

    getTanimByName(name: string): Tanim | null {
        let result = this.tanims.find(tanim => tanim.name === name);
        return result ?? null
    }

    getTanimsByPrefix(prefix: string): Tanim[] {
        let result = this.tanims.filter(tanim => tanim.name.startsWith(prefix));
        return result;
    }

    getContextValue(tValueType: string): TValue {
        return safeTValue(this.context[tValueType], tValueType);
    }

    getSnapshotByIndex(index: number): Snapshot | null {
        return this.snapshots[index] ?? null;
    }

    getSnapshotValue(snapshot: Snapshot, tValueType: string): TValue {
        return safeTValue(snapshot[tValueType], tValueType);
    }

    transitSnapshot(snapshotA: Snapshot, snapshotB: Snapshot, t: number): Snapshot {
        let lerp = InterpolationFunctions.Lerp;
        let result: Snapshot = {};
        for (let tValueType in new Set([...Object.keys(snapshotA), ...Object.keys(snapshotB)])) {
            if (tValueType == DefaultTValueType.sqx || tValueType == DefaultTValueType.sqy) {
                // 挤压倍数有特殊的插值方式：对挤压进行插值，并算出插值后的挤压倍数
                let sqa = safeTValue(snapshotA[DefaultTValueType.sq], DefaultTValueType.sq);
                let sqb = safeTValue(snapshotB[DefaultTValueType.sq], DefaultTValueType.sq);
                if (typeof sqa == "string" || typeof sqb == "string") {
                    continue;
                }
                let sq = lerp(sqa, sqb, t);
                if (tValueType == DefaultTValueType.sqx) {
                    result[tValueType] = sqToSqx(sq);
                } else {
                    result[tValueType] = sqToSqy(sq);
                }
            } else {
                // 大部分属性的插值方式
                let va = safeTValue(snapshotA[tValueType], tValueType);
                let vb = safeTValue(snapshotB[tValueType], tValueType);
                if (typeof va == "string" || typeof vb == "string") {
                    result[tValueType] = t <= 0.5 ? va : vb;
                } else {
                    result[tValueType] = lerp(va, vb, t);
                }
            }
        }
        return result;
    }

    allocateSnapshotIndex(snapshot: Snapshot): number {
        let index = this.snapshots.indexOf(null);
        if (index == -1) {
            index = this.snapshots.length;
        }
        this.snapshots[index] = snapshot;
        return index;
    }

    recycleSnapshotIndex(index: number): void {
        if (this.snapshots[index]) this.snapshots[index] = null;
    }

    recycleAllSnapshot(): void {
        this.snapshots.length = 0;
    }

    getSafeTanimName(name: string): string {
        let names = this.tanims.map(tanim => tanim?.name);
        while (names.includes(name)) {
            name = incrementSuffix(name);
        }
        let dir = name.split(EdConst.tanimFolderSeparator);
        if (dir.pop() == "") {
            dir.push(getTranslate(Strings.eDefaultTanimName));
            return this.getSafeTanimName(dir.join("//"));
        }
        return name;
    }

    getCopiedTanim(tanim: Tanim): Tanim | null {
        let result = Tanim.FromObject(JSON.parse(JSON.stringify(tanim)));
        if (!result) return null;
        result.rename(this.getSafeTanimName(result.name), false);
        let oldTanimConfig = TheTanimEditorConfigs.tanimConfigs[tanim.name];
        if (oldTanimConfig) {
            let newTanimConfig = TanimConfig.FromObject(JSON.parse(JSON.stringify(oldTanimConfig)));
            if (newTanimConfig) {
                TheTanimEditorConfigs.tanimConfigs[result.name] = newTanimConfig;
            }
        }
        return result;
    }
}

let TheTanimManager: TanimManager = new TanimManager([]);

type CostumeNames = [string, string, string];
type Marks = {[key: number]: string};

class TanimConfig {
    spriteName: string;
    costumeNames: CostumeNames;
    marks: Marks;

    constructor(spriteName: string, costumeNames: CostumeNames, marks: Marks) {
        this.spriteName = spriteName;
        this.costumeNames = [...costumeNames];
        this.marks = {...marks};
    }

    static FromObject(obj: any): TanimConfig | null {
        try {
            let { spriteName, costumeNames, marks } = obj;
            if (
                typeof spriteName != "string" ||
                !Array.isArray(costumeNames) ||
                costumeNames.length != 3 ||
                costumeNames.some(value => typeof value != "string") ||
                typeof marks != "object" ||
                marks === null
            ) {
                throw new Error();
            };
            let parsedMarks: Marks = {};
            for (let index in marks) {
                let time = parseInt(index);
                if (!Number.isNaN(time)) {
                    parsedMarks[time] = marks[index];
                }
            }
            return new TanimConfig(spriteName, costumeNames as [string, string, string], parsedMarks);
        } catch (error) {
            Warn("尝试构造 TanimEditorConfigs 对象时，捕获到错误。", obj, error);
            return null;
        }
    }
}

type TanimConfigs = {[key: string]: TanimConfig}

class TanimEditorConfigs {
    left: number;
    top: number;
    width: number;
    height: number;

    leftBarWidth: number;
    timelineBarHeight: number;
    rightBarWidth: number;
    layerBarHeight: number;

    tanimConfigs: TanimConfigs;

    constructor(options?: {
        left?: number, top?: number, width?: number, height?: number,
        leftBarWidth?: number, timelineBarHeight?: number, rightBarWidth?: number, layerBarHeight?: number, 
        tanimConfigs?: TanimConfigs
    }) {
        this.left = options?.left ?? 90;
        this.top = options?.top ?? 100;
        this.width = options?.width ?? EdConst.canvasWidth;
        this.height = options?.height ?? EdConst.canvasHeight;

        this.leftBarWidth = options?.leftBarWidth ?? EdConst.leftBarWidth;
        this.timelineBarHeight = options?.timelineBarHeight ?? EdConst.timelineBarHeight;
        this.rightBarWidth = options?.rightBarWidth ?? EdConst.rightBarWidth;
        this.layerBarHeight = options?.layerBarHeight ?? EdConst.layerBarHeight;

        this.tanimConfigs = options?.tanimConfigs ?? {};
    }

    static FromObject(obj: any): TanimEditorConfigs | null {
        try {
            let { left, top, width, height, leftBarWidth, timelineBarHeight, rightBarWidth, layerBarHeight, tanimConfigs } = obj;
            if (
                typeof left != "number" ||
                typeof top != "number" ||
                typeof width != "number" ||
                typeof height != "number" ||
                typeof leftBarWidth != "number" ||
                typeof timelineBarHeight != "number" ||
                typeof rightBarWidth != "number" ||
                typeof layerBarHeight != "number" ||
                typeof tanimConfigs != "object" ||
                tanimConfigs === null
            ) {
                throw new Error();
            };
            let parsedTanimConfigs: TanimConfigs = {};
            for (let index in tanimConfigs) {
                let parsedTanimConfig = TanimConfig.FromObject(tanimConfigs[index]);
                if (parsedTanimConfig === null) {
                    throw new Error();
                } else {
                    parsedTanimConfigs[index] = parsedTanimConfig;
                }
            }
            return new TanimEditorConfigs({left, top, width, height, leftBarWidth, timelineBarHeight, rightBarWidth, layerBarHeight, tanimConfigs: parsedTanimConfigs});
        } catch (error) {
            Warn("尝试构造 TanimEditorConfigs 对象时，捕获到错误。", obj, error);
            return null;
        }
    }
}

let TheTanimEditorConfigs: TanimEditorConfigs = new TanimEditorConfigs();

// #region 字符串和颜色辅助

/** 使一个字符串的结尾数字递增。  
 * 比如 "新建文件夹2" 变成 "新建文件夹3" 那种。  
 * 如果不以数字结尾，则自动加上一个后缀，编号为2。
 * 空字符串会变成"1"。
 */
function incrementSuffix(base: string, defaultSuffix: string = " ") {
    // ai帮我写的
    const match = base.match(/(.*\D?)(\d+)$/);
    if (!match) {
        // 若字符串无数字结尾，尝试追加数字或处理纯数字
        return base == "" ? "1" : base + defaultSuffix + "2";
    }
    const [_, prefix, numStr] = match;
    const incrementedNum = (parseInt(numStr, 10) + 1).toString();
    return prefix + incrementedNum;
}

function lcg(x: number): number {
    return (1103515245 * x + 12345) % 2**31;
}

/** 通过一个字符串，获取一个随机颜色值 */
function stringToHSL(str: string, saturation: number, lightness: number, alpha: number = 100) {
    // 又是ai帮我写的
    let hue;
    if (Cast.compare(str, "true") == 0) {
        // "true" 固定为绿色
        hue = 120;
    } else if (Cast.compare(str, "false") == 0) {
        // "false" 固定为红色
        hue = 0;
    } else {
        // 生成稳定哈希值
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash |= 0; // 转换为32位整数
        }
        // 映射到色轮范围（0-359度）
        hue = lcg(hash) % 360; // 这里我加了个线性同余法，之前傻逼ai写的那个没随机性。。。
    }

    return alpha == 100 ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha}%)`; // 固定饱和度和亮度
}

/** 通过一个动画值类型，获取该通道对应的颜色 */
function tValueTypeToHSL(tValueType: string, saturation: number, lightness: number, alpha: number = 100) {
    let hue;
    switch (tValueType) {
        case DefaultTValueType.px:
            hue = 210;
            break;
        case DefaultTValueType.py:
            hue = 260;
            break;
        case DefaultTValueType.s:
            hue = 330;
            break;
        case DefaultTValueType.sx:
            hue = 0;
            break;
        case DefaultTValueType.sy:
            hue = 25;
            break;
        case DefaultTValueType.sq:
            hue = 60;
            break;
        case DefaultTValueType.d:
            hue = 90;
            break;
        case DefaultTValueType.cos:
            hue = 140;
            break;
        default:
            let hash = 0;
            for (let i = 0; i < tValueType.length; i++) {
                hash = tValueType.charCodeAt(i) + ((hash << 5) - hash);
                hash |= 0;
            }
            hue = lcg(hash) % 360;
            break;
    }
    
    return alpha == 100 ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha}%)`;
}

// #endregion

// #region 存储

function findSavedataComment(): ScratchComment | null {
    try {
        let comments = vm.runtime.targets[0].comments;

        for (let id in comments) {
            let txt = comments[id].text;
            if (typeof txt != "string") {
                throw new Error();
            }
            let headIdx = txt.indexOf(SavedataMarks.head);
            if (headIdx >= 0) {
                return comments[id];
            }
        }
        return null;
    } catch (error) {
        Warn("尝试寻找存有存储数据的注释时，捕获到错误。", error);
        return null;
    }
}

/** 从注释中寻找第一份识别到的存储数据，返回JSON字符串 */
function getJSONSrcFromComment(): string | null {
    let JSONSrc = null;
    try {
        let comments = vm.runtime.targets[0].comments;

        for (let id in comments) {
            let txt = comments[id].text;
            if (typeof txt != "string") {
                throw new Error();
            }
            let headIdx = txt.indexOf(SavedataMarks.head);
            if (headIdx >= 0) {
                let tailIdx = txt.indexOf(SavedataMarks.tail);
                if (tailIdx == -1) {
                    tailIdx = txt.length;
                };
                JSONSrc = txt.substring(headIdx + SavedataMarks.head.length, tailIdx);
                break;
            }
        }
        return JSONSrc;
    } catch (error) {
        Warn("尝试从注释中获取存储数据时，捕获到错误。", error);
        return JSONSrc;
    }
}

/** 从JSON字符串解析存储数据 */
function getSavedataFromJSONSrc(JSONSrc: string | null): {obj: any, src: string | null} {
    try {
        if (JSONSrc) {
            return {
                obj: JSON.parse(JSONSrc),
                src: JSONSrc,
            }
        } else {
            Warn("无法读取动画存储数据，已初始化动画数据。");
            return {
                obj: {
                    tanimManager: { tanims: [] },
                },
                src: null,
            }
        }
    } catch (error) {
        Warn("尝试解析JSON存储数据时，捕获到错误。", error);
        return {
            obj: null,
            src: JSONSrc
        };
    }
}

/** 将存储的动画数据转换为JSON字符串 */
function getJSONSrcFromSavedata(tanimManager: TanimManager, tanimEditorConfigs: TanimEditorConfigs): string {
    let JSONSrc = JSON.stringify({
        tanimManager: {
            tanims: tanimManager.tanims,
        },
        tanimEditorConfigs,
    });
    return JSONSrc;
}

/** 将一份字符串形式的数据存储到注释中 */
function saveJSONSrcToComment(JSONSrc: string) {
    let d = new Date();
    let dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    let commentStr = `此处是“时间轴动画”扩展的存储数据。可以移动、缩放或折叠此注释，但不要手动修改此注释的内容，除非你知道你在做什么。
Stored data for the Easy Tanim extension. You can move, resize, and minimize this comment, but don't edit it by hand unless you know what you are doing.
${dateStr}
${SavedataMarks.head}${JSONSrc}${SavedataMarks.tail}`;
    let comment = findSavedataComment();
    if (comment) {
        comment.text = commentStr;
    } else {
        vm.runtime.targets[0].createComment(getSafeCommentID("_EasyTanimBackup"), null, commentStr, 500, 0, 450, 300, false);
        Warn("将动画数据保存到注释中时，没有找到已保存的动画数据，已创建新注释。");
    }
    vm.runtime.emit("PROJECT_CHANGED");
}

/** 将动画数据保存到注释中 */
function saveData() {
    saveJSONSrcToComment(getJSONSrcFromSavedata(TheTanimManager, TheTanimEditorConfigs));
}

function autoLoadData(isAlertError: boolean) {

    let JSONSrc = getJSONSrcFromComment();
    let { obj } = getSavedataFromJSONSrc(JSONSrc);

    let parsedTanimEditorConfigs = TanimEditorConfigs.FromObject(obj?.tanimEditorConfigs);
    if (parsedTanimEditorConfigs) TheTanimEditorConfigs = parsedTanimEditorConfigs;

    let parsedTanimManager = TanimManager.FromObject(obj?.tanimManager);

    // 读取出错
    if (parsedTanimManager == null) {
        if (!isAlertError) return;

        let d = new Date();
        let dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        vm.runtime.targets[0].createComment(getSafeCommentID("_EasyTanimBackup"), null, 
`⚠️⚠️⚠️时间轴动画 错误⚠️⚠️⚠️
⚠️⚠️⚠️EASY TANIM ERROR⚠️⚠️⚠️
${dateStr}
无法从注释中读取存储数据，已重置动画数据。检查浏览器开发者工具以获取更多信息。
此条注释下方备份了旧的动画数据，请妥善保管，并联系他人以寻求帮助。
Failed to load stored data from comment. Data has been reset. Check the browser's developer tools for more information.
A backup of the old data has been preserved below this comment. Please keep it safe and contact others for help.

${JSONSrc}`,
0, 0, 600, 800, false);
        Warn("读取动画存储数据失败，已重置动画数据。在背景中生成了一条新注释，备份了旧的动画数据源码。");
        window.alert(`时间轴动画 错误：读取动画存储数据失败，已重置动画数据。在背景中生成了一条新注释，请检查它以获取更多信息和旧数据的备份。

EASY TANIM ERROR: Fail to load stored data. Data has been reset. Created a comment in Background, please check it for more information and backup of old data.`);
        return;
    }
    TheTanimManager = parsedTanimManager;
}

vm.runtime.on("PROJECT_LOADED", () => autoLoadData(true));

// #endregion

// #region 鼠标

const enum MouseState {
    none,
    move,
    leftDown,
    leftUp,
    rightDown,
    rightUp,
    middleDown,
    middleUp,
    dblclick,
}

/** 我迟早要杀了这坨史山 */
const enum UIState {
    none,
    hover,
    click,
}

const enum MouseDragType {
    none,
    move,
    width,
    height,
    size,
    leftBarWidth,
    timelineBarHeight,
    rightBarWidth,
    layerBarHeight,
    tanimTreeItem,
    layerTreeItem,
    timelineScroll,
    timelineScrollX,
    moveKeyframe,
    boxSelectKeyframe,
    endTime,
}

type HoverKeyword = "default"|
"header"|"close"|"minimize"|
"newTanim"|"tanimScroll"|"tanimList"|"layerScroll"|"layerList"|
"keyframeBar"|"kui"|InterType|EaseParamType|EaseParamValue|
"controlBar"|
"timeline"|"main"|"mark"|"ruler"|"scrollX"|"scrollLeft"|"scrollRight"|"sideRuler"|"tValueCurve"|"keyframe"|"endTime"|
"preview"|
"border"|"r"|"b"|"l"|"t"|"lb"|"rb"|"lt"|"rt"|
"innerBorder"|"l"|"r"|"b"|"layer";

type CursorType = "auto"|"default"|"none"|
"context-menu"|"help"|"pointer"|"progress"|"wait"|
"cell"|"crosshair"|"text"|"vertical-text"|
"alias"|"copy"|"move"|"no-drop"|"not-allowed"|"grab"|"grabbing"|
"all-scroll"|"col-resize"|"row-resize"|
"n-resize"|"e-resize"|"s-resize"|"w-resize"|"ne-resize"|"nw-resize"|"se-resize"|"sw-resize"|
"ew-resize"|"ns-resize"|"nesw-resize"|"nwse-resize"|
"zoom-in"|"zoom-out";

type Hover = (HoverKeyword | number)[];

// #endregion

// #region 文件树

const enum TanimItemType {
    tanim,
    folderBegin,
    folderEnd,
    folderFolded,
}

const enum TanimListButtonType {
    main,
    new,
    copy,
    setLayer,
    addLayer,
    removeLayer,
    rename,
    delete,
    foldDown,
    foldUp,
    foldLeft,
}

interface TanimTreeItem {
    /** 注意：文件夹的dir包含文件夹的完整路径，文件的dir则只包含其所属的文件夹 */
    dir: string[],
    /** 不包含省略号和花括号 */
    text: string,
    type: TanimItemType,
    indentation: number,
    tanim?: Tanim
}
/** 注意这个并不是树结构，是树展开成的列表 */
type TanimTree = TanimTreeItem[];

interface TanimFolderInfo {
    color: string,
    indentation: number,
    ranges: {
        from: number, to: number
    }[],
}

interface TanimFolders {
    [key: string]: TanimFolderInfo
}

// #endregion

// #region CUI

const enum CUIType {
    /** 鼠标位置指示器 */
    pos,
    /** 是否显示控制点 */
    showHandle,
    /** 主坐标轴 */
    mainAxis,
    /** 新建关键帧 */
    newKeyframe,
    /** 删除关键帧 */
    deleteKeyframe,
    /** 转到起始 */
    gotoLeftMost,
    /** 上一个关键帧 */
    gotoLeftKeyframe,
    /** 上一帧 */
    gotoLeftFrame,
    /** 播放 */
    play,
    /** 下一帧 */
    gotoRightFrame,
    /** 下一个关键帧 */
    gotoRightKeyframe,
    /** 转到末尾 */
    gotoRightMost,
    /** 循环播放 */
    loop,
    /** 往复播放 */
    yoyo,
    /** 添加/移除标签 */
    mark,
    /** 自动吸附 */
    magnet,
    /** 帧率 */
    fps,
}

const enum CUIAlign {
    left,
    center,
    right,
}

/** CUI = Control Bar UI */
class CUI {
    type: CUIType;
    align: CUIAlign;
    pos: number;
    size: {
        w: number,
        h: number,
    };
    /*
    isShow: boolean;
    isCanHover: boolean;
    isCanAct: boolean;
    */

    constructor(
        type: CUIType,
        align: CUIAlign,
        pos: number,
        size: {
            w: number,
            h: number,
        } | number | null,
        /*
        isShow: boolean = true,
        isCanHover: boolean = true,
        isCanAct: boolean = true
        */
    ) {
        this.type = type;
        this.align = align;
        this.pos = pos;
        this.size = typeof size == "number" ? { w: size, h: size } : size ?? { w: 0, h: 0 };
        /*
        this.isShow = isShow;
        this.isCanHover = isCanHover;
        this.isCanAct = isCanAct;
        */
    }
}

// #endregion

// #region KUI

const enum KUIType {
    title,
    label,
    ghostLabel,
    timeSec,
    timeFrame,
    tValue,
    interType,
    interTypeListItem,
    paramInput,
    tradExpVM,
    paramRadio,
    LagrangeCXSec,
}

/** KUI = Keyframe Bar UI */
class KUI {
    type: KUIType;
    x: number;
    y: number;
    size: {
        w: number,
        h: number,
    };
    interType?: InterType;
    paramType?: EaseParamType;
    paramValue?: EaseParamValue;
    text?: Strings;

    constructor(
        type: KUIType,
        x: number,
        y: number,
        size: {
            w: number,
            h: number,
        } | number | null = null,
        options: {
            interType?: InterType,
            paramType?: EaseParamType,
            paramValue?: EaseParamValue,
            text?: Strings,
        }
    ) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = typeof size == "number" ? { w: size, h: EdConst.kuiLineHeight as number } : size ?? { w: 0, h: EdConst.kuiLineHeight as number };
        this.interType = options.interType;
        this.paramType = options.paramType;
        this.paramValue = options.paramValue;
        this.text = options.text;
    }
}

const enum KUIState {
    params,
    interType,
}

const KUIInterTypeTable = [
    [InterType.const, InterType.linear, InterType.bezier] as const,
    [InterType.power, InterType.exp, InterType.sine, InterType.circular] as const,
    [InterType.elastic, InterType.back, InterType.bounce, InterType.tradExp, InterType.lagrange] as const,
] as const;

// #endregion



/** 这玩意看起来是个枚举，其实我把它当宏使的…… */
const enum EdConst {
    headerFont = '14px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',
    hintFont = '14px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',
    hintYOffset = 10,
    tanimListFont = '14px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',
    cuiFont = '18px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',
    //timelineFont = '12px "Courier New", Courier, "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", monospace',
    timelineFont = '12px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',
    markFont = '14px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',
    kuiFont = '14px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',

    headerWidth = 240,
    headerHeight = 30,
    headerButtonWidth = 40,
    canvasWidth = 800,
    canvasHeight = 600,
    leftBarWidth = 75,
    timelineBarHeight = 200,
    timelineMarkHeight = 20,
    timelineRulerHeight = 20,
    timelineSideRulerWidth = 20,
    //timelineScrollWidth = 20, // 暂时不做纵向滚动条
    timelineScrollHeight = 25,
    rightBarWidth = 250,
    layerBarHeight = 100,
    controlBarHeight = 50,
    hintBarHeight = 50,
    keyframeBarHeight = 200,

    leftBarWidthMin = 60,
    timelineBarHeightMin = 90,
    rightBarWidthMin = 180,
    layerBarHeightMin = 70,
    tanimListHeightMin = 130,
    previewWidthMin = 480,
    previewHeightMin = 120,

    rightBarPaddingX = 6.5,
    tanimListLineHeight = 24,
    tanimListPaddingRight = 20,
    tanimListIndentationWidth = 12,
    tanimFolderSeparator = "//",

    cuiPaddingX = 10,
    cuiNormalSize = 30,
    cuiPlaySize = 44,
    cuiSpacing = 5,
    cuiLargeSpacing = 15,

    timelineScaleBase = 1.25,
    timelineMinScalePowX = -30,
    timelineMaxScalePowX = 15,
    timelineMinScalePowY = -20,
    timelineMaxScalePowY = 40,
    timelineKeyframeSize = 10,
    timelineBezierHandleSize = 5,

    kuiSpacing = 5,
    kuiLineHeight = 20,
    kuiLineSpacingLarge = 8,
    kuiLineSpacingSmall = 4,
}

const DefaultTValueNames = [
    `${DefaultTValueType.px}|${DefaultTValueType.py}`,
    DefaultTValueType.s,
    `${DefaultTValueType.sx}|${DefaultTValueType.sy}`,
    DefaultTValueType.sq,
    DefaultTValueType.d,
    DefaultTValueType.cos,
];

// #region 编辑命令

/** 一次编辑操作 */
abstract class EditCommand {
    /** 执行或撤销该命令时，是否需要更新存储数据 */
    isNeedSaveData: boolean = true;
    /** 该命令是否已被执行完毕 */
    isDone: boolean = false;

    /** 该命令在首次执行时的行为 */
    abstract do(): void
    /** 该命令在撤销时的行为 */
    abstract undo(): void
    /** 该命令在还原时的行为，默认与首次执行相同 */
    redo(): void {
        return this.do();
    }

    /** 执行这个命令 */
    doCommand(): void {
        if (this.isDone) return;
        this.do();
        this.isDone = true;
        if (this.isNeedSaveData) saveData();
        return;
    }

    /** 撤销这个命令 */
    undoCommand(): void {
        if (!this.isDone) return;
        this.undo();
        this.isDone = false;
        if (this.isNeedSaveData) saveData();
        return;
    }

    /** 还原这个命令 */
    redoCommand(): void {
        if (this.isDone) return;
        this.redo();
        this.isDone = true;
        if (this.isNeedSaveData) saveData();
        return;
    }
}

class AddTimelineCommand extends EditCommand {
    tanim: Tanim;
    timeline: Timeline;

    constructor(tanim: Tanim, timeline: Timeline) {
        super();
        this.tanim = tanim;
        this.timeline = timeline;
    }

    do(): void {
        if (this.tanim.getTimelineByTValueType(this.timeline.tValueType)) {
            Warn("执行命令：试图向 Tanim 中加入新 Timeline 时，Tanim 中已有的同名的 Timeline，操作未执行。", this);
            return;
        }
        this.tanim.timelines.push(this.timeline);
    }

    undo(): void {
        if (!this.tanim.timelines.includes(this.timeline)) {
            Warn("撤销命令：试图从 Tanim 中移除 Timeline 时，Tanim 中不包含该 Timeline，撤销未执行。", this);
            return;
        }
        let idx = this.tanim.timelines.indexOf(this.timeline);
        this.tanim.timelines.splice(idx, 1);
    }
}

class RenameTimelineCommand extends EditCommand {
    tanim: Tanim;
    timeline: Timeline;
    oldTValueType: string;
    newTValueType: string;

    constructor(tanim: Tanim, timeline: Timeline, newTValueType: string) {
        super();
        this.tanim = tanim;
        this.timeline = timeline;
        this.oldTValueType = timeline.tValueType;
        this.newTValueType = newTValueType;
    }

    do(): void {
        this.timeline.rename(this.tanim.getSafeTValueType(this.newTValueType));DefaultTValues
    }

    undo(): void {
        this.timeline.rename(this.tanim.getSafeTValueType(this.oldTValueType));
    }
}

class RemoveTimelineCommand extends EditCommand {
    tanim: Tanim;
    timeline: Timeline;

    constructor(tanim: Tanim, timeline: Timeline) {
        super();
        this.tanim = tanim;
        this.timeline = timeline;
    }

    do(): void {
        let idx = this.tanim.timelines.indexOf(this.timeline);
        if (idx == -1) {
            Warn("执行命令：试图从 Tanim 中移除 Timeline 时，Tanim 中不包含该 Timeline，操作未执行。", this);
            return;
        }
        this.tanim.timelines.splice(idx, 1);
    }

    undo(): void {
        if (this.tanim.getTimelineByTValueType(this.timeline.tValueType)) {
            Warn("撤销命令：试图向 Tanim 中重新加入之前被移除的 Timeline 时，Tanim 中已有的同名的 Timeline，撤销未执行。", this);
            return;
        }
        this.tanim.timelines.push(this.timeline);
    }
}



/** Timeline - Keyframes Pair */
class TKPair {
    timeline: Timeline;
    keyframes: Set<Keyframe>;

    constructor(timeline: Timeline, ...keyframes: Keyframe[]) {
        this.timeline = timeline;
        this.keyframes = new Set(keyframes);
    }
}

function toTKPairs(timelines: [null, null] | [Timeline, null] | [Timeline, Timeline], ...keyframes: Keyframe[]): TKPair[] {
    let pairs: TKPair[] = [];
    timelines.forEach(timeline => timeline && pairs.push(new TKPair(timeline)));
    for (let keyframe of keyframes) {
        let pair = pairs.find(pair => pair.timeline.keyframes.includes(keyframe));
        if (pair) {
            pair.keyframes.add(keyframe);
        }
    }
    return pairs.filter(pair => pair.keyframes.size > 0);
}

class AddKeyframesCommand extends EditCommand {
    editor: TanimEditor;
    pairs: TKPair[];

    constructor(editor: TanimEditor, tanim: Tanim, ...pairs: TKPair[]) {
        super();
        this.editor = editor;
        this.pairs = pairs;
        for (let {timeline} of pairs) {
            if (!tanim.getTimelineByTValueType(timeline.tValueType)) tanim.timelines.push(timeline);
        }
    }

    do(): void {
        for (let {timeline, keyframes} of this.pairs) {
            timeline.keyframes.push(...keyframes);
            timeline.sortKeyframes();
        }
        this.editor.updateCuis();
        this.editor.updateKuis();
    }

    undo(): void {
        for (let {timeline, keyframes} of this.pairs) {
            for (let keyframe of keyframes) {
                let idx = timeline.keyframes.indexOf(keyframe);
                if (idx == -1) {
                    Warn("撤销命令：试图从 Timeline 中移除 Keyframe 时，Timeline 中不包含该 Keyframe，未移除该 Keyframe。", this, timeline, keyframe);
                    return;
                }
                timeline.keyframes.splice(idx, 1);
                this.editor.selectedKeyframes.delete(keyframe);
            }
            timeline.sortKeyframes();
        }
        this.editor.updateCuis();
        this.editor.updateKuis();
    }
}

class RemoveKeyframesCommand extends EditCommand {
    editor: TanimEditor;
    pairs: TKPair[];

    constructor(editor: TanimEditor, ...pairs: TKPair[]) {
        super();
        this.editor = editor;
        this.pairs = pairs;
    }

    do(): void {
        for (let {timeline, keyframes} of this.pairs) {
            for (let keyframe of keyframes) {
                let idx = timeline.keyframes.indexOf(keyframe);
                if (idx == -1) {
                    Warn("执行命令：试图从 Timeline 中移除 Keyframe 时，Timeline 中不包含该 Keyframe，未移除该 Keyframe。", this, keyframe);
                    continue;
                }
                timeline.keyframes.splice(idx, 1);
                this.editor.selectedKeyframes.delete(keyframe);
            }
            timeline.sortKeyframes();
        }
        this.editor.updateCuis();
        this.editor.updateKuis();
    }

    undo(): void {
        for (let {timeline, keyframes} of this.pairs) {
            timeline.keyframes.push(...keyframes);
            timeline.sortKeyframes();
        }
        this.editor.updateCuis();
        this.editor.updateKuis();
    }
}

class MoveKeyframesCommand extends EditCommand {
    editor: TanimEditor;
    x: number;
    y: number;
    pairs: TKPair[];

    constructor(editor: TanimEditor, x: number, y: number, ...pairs: TKPair[]) {
        super();
        this.editor = editor;
        this.x = x;
        this.y = y;
        this.pairs = pairs;
    }

    move(x: number, y: number) {
        for (let {timeline, keyframes} of this.pairs) {
            for (let keyframe of keyframes) {
                keyframe.x += x;
                if (typeof keyframe.y == "number") keyframe.y += y;
            }
            timeline.sortKeyframes();
        }
        this.editor.updateCuis();
        this.editor.updateKuis();
    }

    do(): void {
        this.move(this.x, this.y);
    }

    undo(): void {
        this.move(-this.x, -this.y);
    }

    updateMotion(x: number, y: number): void {
        x = round(x);
        if (this.isDone) this.move(x - this.x, y - this.y);
        this.x = x;
        this.y = y;
    }
}

class EditAKeyframeCommand extends EditCommand {
    editor: TanimEditor;
    timeline: Timeline;
    keyframe: Keyframe;
    oldKeyframeCopy: Keyframe;
    newKeyframeCopy: Keyframe;

    constructor(editor: TanimEditor, timeline: Timeline, keyframe: Keyframe, newKeyframeCopy: Keyframe) {
        super();
        this.editor = editor;
        this.timeline = timeline;
        this.keyframe = keyframe;
        this.oldKeyframeCopy = keyframe.getCopy();
        this.newKeyframeCopy = newKeyframeCopy;
    }

    editKeyframe(target: Keyframe) {
        this.keyframe.interType = target.interType;
        if (this.keyframe.x != target.x) {
            this.keyframe.x = target.x;
            this.timeline.sortKeyframes();
        }
        this.keyframe.y = target.y;
        this.keyframe.params = {...target.params};
        this.editor.updateCuis();
        this.editor.updateKuis();
    }

    do(): void {
        this.editKeyframe(this.newKeyframeCopy);
    }

    undo(): void {
        if (!this.oldKeyframeCopy) {
            Warn("撤销命令：修改 Keyframe 时，未能深拷贝原 Keyframe ，撤销未执行。", this);
        }
        this.editKeyframe(this.oldKeyframeCopy);
    }
}

class SelectKeyframesCommand extends EditCommand {
    isNeedSaveData: boolean = false;
    editor: TanimEditor;
    oldKeyframesCopy: Set<Keyframe>;
    newKeyframesCopy: Set<Keyframe>;

    /**
     * @param selectedKeyframes 要修改的 selectedKeyframes 集合的引用。
     * @param keyframes 要选中的关键帧。
     */
    constructor(editor: TanimEditor, ...keyframes: Keyframe[]) {
        super();
        this.editor = editor;
        this.oldKeyframesCopy = new Set(editor.selectedKeyframes);
        this.newKeyframesCopy = new Set(keyframes);
    }

    do(): void {
        this.editor.selectedKeyframes.clear();
        this.newKeyframesCopy.forEach(keyframe => this.editor.selectedKeyframes.add(keyframe));
        this.editor.kuiState = KUIState.params;
        this.editor.updateCuis();
        this.editor.updateKuis();
    }

    undo(): void {
        this.editor.selectedKeyframes.clear();
        this.oldKeyframesCopy.forEach(keyframe => this.editor.selectedKeyframes.add(keyframe));
        this.editor.kuiState = KUIState.params;
        this.editor.updateCuis();
        this.editor.updateKuis();
    }
}



class EditCommandStack {
    commands: EditCommand[];
    undoLength: number;

    get isCanUndo(): boolean {
        return this.commands.length > this.undoLength;
    }

    get isCanRedo(): boolean {
        return this.commands.length > 0 && this.undoLength > 0;
    }

    get top(): EditCommand | null {
        return this.commands[this.commands.length - 1 - this.undoLength];
    }

    constructor() {
        this.commands = [];
        this.undoLength = 0;
    }

    PushAndDo(...commands: EditCommand[]) {
        for (let command of commands) {
            this.push(command);
            command.doCommand();
        }
    }

    push(...commands: EditCommand[]) {
        this.commands.splice(this.commands.length - this.undoLength, this.undoLength, ...commands);
        this.undoLength = 0;
    }

    undo() {
        if (!this.isCanUndo) return;
        this.undoLength += 1;
        this.top?.undo();
    }

    redo() {
        if (!this.isCanRedo) return;
        this.undoLength -= 1;
        this.top?.redo();
    }
}

// #endregion



class TanimEditor {

    // #region 编辑器属性

    focusTime: number;
    tanim: Tanim | null;
    timelines: [null, null] | [Timeline, null] | [Timeline, Timeline];
    tValueNames: string[];
    tValueName: string;
    mainAxis: 0 | 1;
    get subAxis(): 0 | 1 {
        return 1 - this.mainAxis as 0 | 1;
    };
    isShowHandle: boolean;

    get configs(): TanimEditorConfigs {
        return TheTanimEditorConfigs;
    };

    // #region 动画配置

    get spriteName(): string {
        if (this.tanim) {
            let tanimConfig = this.configs.tanimConfigs[this.tanim.name];
            return tanimConfig?.spriteName ?? "";
        } else {
            return "";
        }
    }

    set spriteName(name: string) {
        if (this.tanim) {
            let tanimConfig = this.configs.tanimConfigs[this.tanim.name];
            if (tanimConfig) {
                tanimConfig.spriteName = name;
            }
        }
    }

    get costumeNames(): CostumeNames {
        if (this.tanim) {
            let tanimConfig = this.configs.tanimConfigs[this.tanim.name];
            return tanimConfig?.costumeNames ?? ["", "", ""];
        } else {
            return ["", "", ""];
        }
    }

    get marks(): Marks {
        if (this.tanim) {
            let tanimConfig = this.configs.tanimConfigs[this.tanim.name];
            return tanimConfig?.marks ?? {};
        } else {
            return {};
        }
    }

    // #endregion

    isLoop: boolean;
    isYoyo: boolean;

    get loopMode(): LoopMode {
        if (this.isLoop) {
            if (this.isYoyo) {
                return LoopMode.loopYoyo;
            } else {
                return LoopMode.loop;
            }
        } else {
            if (this.isYoyo) {
                return LoopMode.onceYoyo;
            } else {
                return LoopMode.once;
            }
        }
    }

    isShow: boolean;
    isMinimized: boolean;
    isInputing: boolean;
    //answer: any;

    // #region 窗口变换配置

    get width(): number {
        return this.configs.width;
    };
    set width(value: number) {
        this.configs.width = value;
    };
    get height(): number {
        return this.configs.height;
    };
    set height(value: number) {
        this.configs.height = value;
    };
    get top(): number {
        return this.configs.top;
    };
    set top(value: number) {
        this.configs.top = value;
    };
    get left(): number {
        return this.configs.left;
    };
    set left(value: number) {
        this.configs.left = value;
    };

    get leftBarWidth(): number {
        return this.configs.leftBarWidth;
    };
    set leftBarWidth(value: number) {
        this.configs.leftBarWidth = value;
    };
    get timelineBarHeight(): number {
        return this.configs.timelineBarHeight;
    };
    set timelineBarHeight(value: number) {
        this.configs.timelineBarHeight = value;
    };
    get rightBarWidth(): number {
        return this.configs.rightBarWidth;
    };
    set rightBarWidth(value: number) {
        this.configs.rightBarWidth = value;
    };
    get layerBarHeight(): number {
        return this.configs.layerBarHeight;
    };
    set layerBarHeight(value: number) {
        this.configs.layerBarHeight = value;
    };

// #endregion

    canvasWidth: number;
    canvasHeight: number;

    tanimListScroll: number;
    layerListScroll: number;

    timelineScrollX: number;
    timelineScrollY: number;
    timelineScalePowX: number;
    timelineScalePowY: number;
    get timelineScaleX(): number {
        return 3 * EdConst.timelineScaleBase ** this.timelineScalePowX;
    }
    get timelineScaleY(): number {
        return EdConst.timelineScaleBase ** this.timelineScalePowY;
    };

/*
    resizeObserver: ResizeObserver;

    private _rect?: DOMRect;
    private _clientLeft?: number;
    private _clientTop?: number;

    get rect() {
        if (this._rect === undefined) {
            this._rect = this.canvas.getBoundingClientRect();
        }
        return this._rect;
    }

    get clientLeft() {
        if (this._clientLeft === undefined) {
            this._clientLeft = this.canvas.clientLeft;
        }
        return this._clientLeft;
    }

    get clientTop() {
        if (this._clientTop === undefined) {
            this._clientTop = this.canvas.clientTop;
        }
        return this._clientTop;
    }
*/

    mouseClientX: number;
    mouseClientY: number;

    mouseX: number;
    mouseY: number;

    mouseTimelineX: number;
    mouseTimelineY: number;

    mouseDragType: MouseDragType;
    mouseDragX: number;
    mouseDragY: number;
    mouseDragClientX: number;
    mouseDragClientY: number;
    mouseDragTop: number;
    mouseDragLeft: number;
    mouseDragWidth: number;
    mouseDragHeight: number;
    mouseDragIndex: number;

    cursor: CursorType;

    title: string;
    hint: [string, string];
    tanimTree: TanimTree;
    tanimFolders: TanimFolders;
    layerTree: TanimTree;
    layerFolders: TanimFolders;
    cuis: CUI[];
    kuis: KUI[];
    kuiState: KUIState;
    hover: Hover;
    hoveredKeyframes: Set<Keyframe>;
    selectedKeyframes: Set<Keyframe>;

    layers: Tanim[];
    foldedTanimFolders: Set<string>;
    foldedLayerFolders: Set<string>;
    recycleBin: Tanim[];
    commandStack: EditCommandStack;

    root: HTMLDivElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    /*inputRoot: HTMLDivElement;
    input: HTMLInputElement;*/

    // #endregion

    constructor() {
        this.focusTime = 0;
        this.tanim = null;
        this.timelines = [null, null];
        this.tValueNames = [...DefaultTValueNames];
        this.tValueName = this.tValueNames[0];
        this.mainAxis = 0;
        this.isShowHandle = true;

        this.isLoop = false;
        this.isYoyo = false;

        this.isShow = false;
        this.isMinimized = false;
        this.isInputing = false;
        //this.answer = null;

        this.canvasWidth = this.width;
        this.canvasHeight = this.height;

        this.tanimListScroll = 0;
        this.layerListScroll = 0;

        this.timelineScrollX = -10;
        this.timelineScrollY = -50;
        this.timelineScalePowX = 6;
        this.timelineScalePowY = 0;

        /*
        this.resizeObserver = new ResizeObserver(() => {
            this._rect = undefined;
            this._clientLeft = undefined;
            this._clientTop = undefined;
        });
        */
        this.mouseClientX = -1;
        this.mouseClientY = -1;

        this.mouseX = 0;
        this.mouseY = 0;

        this.mouseTimelineX = 0;
        this.mouseTimelineY = 0;

        this.mouseDragType = MouseDragType.none;
        this.mouseDragX = 0;
        this.mouseDragY = 0;
        this.mouseDragClientX = 0;
        this.mouseDragClientY = 0;
        this.mouseDragTop = 0;
        this.mouseDragLeft = 0;
        this.mouseDragWidth = 0;
        this.mouseDragHeight = 0;
        this.mouseDragIndex = -1;

        this.cursor = "default";

        this.title = getTranslate(Strings.eDefaultTitle);
        this.hint = [getTranslate(Strings.eDefaultHint), ""];
        this.tanimTree = [];
        this.tanimFolders = {};
        this.layerTree = [];
        this.layerFolders = {};
        this.cuis = [];
        this.kuis = [];
        this.kuiState = KUIState.params;
        this.hover = [];

        this.hoveredKeyframes = new Set();
        this.selectedKeyframes = new Set();

        this.layers = [];
        this.foldedTanimFolders = new Set();
        this.foldedLayerFolders = new Set();
        this.recycleBin = [];
        this.commandStack = new EditCommandStack();

        this.root = document.createElement("div");
        let s = this.root.style;
        s.display = "none";
        s.position = "absolute";
        s.top = "0";
        s.left = "0";
        this.setPosition();
        s.zIndex = "200";
        //s.backgroundColor = " #f2f2f2";
        s.padding = "4px";

        this.canvas = document.createElement("canvas");
        this.setCanvasSize();
        s = this.canvas.style;
        s.backgroundColor = " #ffffff";
        s.borderRadius = "8px";
        s.border = "1px solid #666666";
        s.boxShadow = "0px 0px 6px 2px rgba(0, 0, 0, 0.3)";
        s.overflow = "hidden";
        this.root.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.ctx) {
            Warn("无法获取 Canvas 绘图上下文，动画编辑器将无法正常使用。");
        }
/*
        //这玩意我以后说不定会做，但目前暂且用prompt吧
        this.inputRoot

        this.input = document.createElement("input");
        this.input.type = "text";
        s = this.input.style;
        s.width = "200px";
        s.height = "30px";
        s.font = EdConst.tanimNameFont;
        s.border = "1px solid #666666";
        s.backgroundColor = " #ffffff";
        s.borderRadius = "8px";
        s.position = "absolute";
        s.top = "0";
        s.left = "0";
        s.boxShadow = "0px 0px 5px 2px rgba(0, 0, 0, 0.3)";
        s.display = "none";
*/
        document.body.appendChild(this.root);

        document.addEventListener("mousemove", ev => this.update({mouseEvent: ev}));
        document.addEventListener("mousedown", ev => this.update({mouseEvent: ev}));
        document.addEventListener("mouseup", ev => this.update({mouseEvent: ev}));
        document.addEventListener("dblclick", ev => this.update({mouseEvent: ev}));

        document.addEventListener("wheel", ev => this.update({wheelEvent: ev}));
        
        document.addEventListener("keydown", ev => this.update({keyboardEvent: ev}));
        document.addEventListener("keyup", ev => this.update({keyboardEvent: ev}));

        this.updateTanimTree();
        this.update(null);
    }

    // #region 编辑器工具方法

    /** 默认值为 this.left, this.top */
    setPosition(left: number | null = null, top: number | null = null) {
        /*this.root.style.top = `${top ?? this.top}px`;
        this.root.style.left = `${left ?? this.left}px`;*/
        this.root.style.transform = `translate(${(left ?? this.left) - 5 + (this.isMinimized ? this.width - this.canvasWidth : 0)}px, ${(top ?? this.top) - 5}px)`;
    }

    /** 默认值为 this.width, this.height */
    setCanvasSize(width?: number, height?: number) {
        this.canvas.width = width ?? this.width;
        this.canvas.height = height ?? this.height;
        this.updateCuis();
        this.updateKuis();
    }

    toCanvasPosition(x: number, y: number): [number, number] {
        /*let { left, top } = this.rect;
        left += this.clientLeft;
        top += this.clientTop;
        return [
            x - left + scrollX,
            y - top + scrollY,
        ];*/
        return [x - this.left + scrollX - (this.isMinimized ? this.width - this.canvasWidth : 0), y - this.top + scrollY];
    }

    updateMousePosition() {
        [this.mouseX, this.mouseY] = this.toCanvasPosition(this.mouseClientX, this.mouseClientY);
        this.updateMouseTimelinePosition();
    }

    /** 锚点：时间轴左下角（横向滚动条的左上角） */
    canvasTotimelinePosition(x: number, y: number, anchorX?: number, anchorY?: number): [number, number] {
        anchorX ??= this.leftBarWidth;
        anchorY ??= this.canvasHeight - EdConst.hintBarHeight - EdConst.timelineScrollHeight;
        return [
            (x - anchorX) / this.timelineScaleX + this.timelineScrollX,
            (anchorY - y) / this.timelineScaleY + this.timelineScrollY
        ]
    }

    /** 锚点：时间轴左下角（横向滚动条的左上角） */
    timelineToCanvasPosition(x: number, y: TValue, anchorX?: number, anchorY?: number): [number, number] {
        anchorX ??= this.leftBarWidth;
        anchorY ??= this.canvasHeight - EdConst.hintBarHeight - EdConst.timelineScrollHeight;
        return [
            (x - this.timelineScrollX) * this.timelineScaleX + anchorX,
            typeof y == "number" ? anchorY - (y - this.timelineScrollY) * this.timelineScaleY :
                this.canvasHeight + ((- this.timelineBarHeight + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight) + (- EdConst.hintBarHeight - EdConst.timelineScrollHeight)) / 2
        ];
    }

    /** 返回canvas上的一点，锚点：滚动条左极 */
    timeToScrollX(time: number, start: number, length: number, anchor?: number): number {
        anchor ??= this.leftBarWidth + EdConst.timelineSideRulerWidth;
        start -= 60;
        length += 120;
        return (this.canvasWidth - this.leftBarWidth - this.rightBarWidth - EdConst.timelineSideRulerWidth * 2) * (time - start) / length + anchor;
    }

    /** 根据canvas上的一个横坐标（位于进度条上）返回其对应的时间点，锚点：滚动条左极 */
    scrollXToTime(x: number, start: number, length: number, anchor?: number): number {
        anchor ??= this.leftBarWidth + EdConst.timelineSideRulerWidth;
        start -= 60;
        length += 120;
        return (x - anchor) * length / (this.canvasWidth - this.leftBarWidth - this.rightBarWidth - EdConst.timelineSideRulerWidth * 2) + start;
    }

    scaleTimelineX(n: number) {
        n = clamp(n, EdConst.timelineMinScalePowX - this.timelineScalePowX, EdConst.timelineMaxScalePowX - this.timelineScalePowX);
        if (n == 0) return;
        // 此处以后要加可调节设置
        let scaleCenter = (
            false ? this.mouseX :
            (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2
        ) - this.leftBarWidth;
        this.timelineScrollX += scaleCenter * (1 - EdConst.timelineScaleBase ** -n) / this.timelineScaleX;
        this.timelineScalePowX += n;
    }

    scaleTimelineY(n: number) {
        n = clamp(n, EdConst.timelineMinScalePowY - this.timelineScalePowY, EdConst.timelineMaxScalePowY - this.timelineScalePowY);
        if (n == 0) return;
        // 此处以后要加可调节设置
        let scaleCenter = this.canvasHeight - EdConst.hintBarHeight - EdConst.timelineScrollHeight - (
            false ? this.mouseY : (
                this.canvasHeight - EdConst.hintBarHeight +
                ((- this.timelineBarHeight + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight) + (- EdConst.timelineScrollHeight)) / 2
            )
        );
        this.timelineScrollY += scaleCenter * (1 - EdConst.timelineScaleBase ** -n) / this.timelineScaleY;
        this.timelineScalePowY += n;
    }

    scrollTimeline(x: number, y: number) {
        this.timelineScrollX += x;
        this.timelineScrollY += y;
    }

    updateMouseTimelinePosition() {
        [this.mouseTimelineX, this.mouseTimelineY] = this.canvasTotimelinePosition(this.mouseX, this.mouseY);
    }

    /*setInputPosition(top: number, left: number) {
        this.input.style.transform = `translate(${left}px, ${top}px)`;
    }*/

    trimText(prefix: string, txt: string, suffix: string, maxWidth: number): string {
        if (maxWidth <= 0) return prefix + "" + suffix;
        let ctx = this.ctx;
        if (ctx.measureText(prefix + txt + suffix).width <= maxWidth) return prefix + txt + suffix;

        let low = 0;
        let high = (prefix + txt + suffix).length;
        let bestK = -1;
    
        // 使用二分查找寻找最大的k，使得处理后字符串的宽度不超过maxWidth
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const trimmedText = prefix + txt.substring(0, mid) + "..." + suffix;
            const width = ctx.measureText(trimmedText).width;
    
            if (width <= maxWidth) {
                bestK = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return prefix + txt.substring(0, bestK) + '...' + suffix;
    }

    /** 注意这玩意的顺序是从右往左排的 */
    getTanimListButtons(item: TanimTreeItem): TanimListButtonType[] {
        switch (item.type) {
            case TanimItemType.tanim:
                return [TanimListButtonType.delete, TanimListButtonType.rename, TanimListButtonType.copy, TanimListButtonType.addLayer, TanimListButtonType.setLayer];
            case TanimItemType.folderBegin:
                return [TanimListButtonType.foldDown, TanimListButtonType.rename, TanimListButtonType.new, TanimListButtonType.addLayer, TanimListButtonType.setLayer];
            case TanimItemType.folderEnd:
                return [TanimListButtonType.foldUp];
            case TanimItemType.folderFolded:
                return [TanimListButtonType.foldLeft, TanimListButtonType.rename, TanimListButtonType.new, TanimListButtonType.addLayer, TanimListButtonType.setLayer];
        }
    }

    /** 注意这玩意的顺序是从右往左排的 */
    getLayerListButtons(item: TanimTreeItem): TanimListButtonType[] {
        switch (item.type) {
            case TanimItemType.tanim:
                return [TanimListButtonType.removeLayer];
            case TanimItemType.folderBegin:
                return [TanimListButtonType.foldDown, TanimListButtonType.removeLayer];
            case TanimItemType.folderEnd:
                return [TanimListButtonType.foldUp];
            case TanimItemType.folderFolded:
                return [TanimListButtonType.foldLeft, TanimListButtonType.removeLayer];
        }
    }

    /** 如果 prompt 的实现是异步的，则返回true，否则返回false */
    ask(message: string | null, default_: string | null, callback: (answer: string | null) => any): boolean {
        let answer = prompt(
            message ?? undefined,
            default_ ?? undefined
        ) as string | null | Promise<string | null>;// 沟槽的 tw 重写了 prompt

        if (answer instanceof Promise) {
            this.isInputing = true;
            answer.then(answer => {
                callback(answer);
                this.isInputing = false;
                this.update(null);
            });
            return true;
        } else {
            callback(answer);
            return false;
        }
    }

    askAndCreateNewTanim(): boolean {
        return this.ask(
            getTranslate(Strings.eNewTanimNameQuestion),
            TheTanimManager.getSafeTanimName(getTranslate(Strings.eDefaultTanimName)),
            answer => {
                if (answer !== null) {
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(answer), 120, 60, []);
                    TheTanimManager.tanims.push(tanim);
                    this.updateTanimTree();
                    saveData();
                }
            }
        );
    }

    askAndCreateNewTanimInFolder(dir: string[]): boolean {
        let dirStr = dir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator;
        let folderName = dir.pop();
        if (folderName === undefined) return this.askAndCreateNewTanim(); // 保险起见
        let defaultNameFull = TheTanimManager.getSafeTanimName(dirStr + getTranslate(Strings.eDefaultTanimName));
        let defaultDir = defaultNameFull.split(EdConst.tanimFolderSeparator);
        let defaultName = defaultDir.pop();
        if (defaultName === undefined) return this.askAndCreateNewTanim(); // 保险起见。。。
        return this.ask(
            getTranslate(Strings.eNewTanimNameInFolderQuestion).replace("[folderName]", folderName),
            defaultName,
            answer => {
                if (answer !== null) {
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(dirStr + answer) , 120, 60, []);
                    let tanims = TheTanimManager.tanims;
                    for (let i = tanims.length - 1; i >= 0; i--) {
                        if (tanims[i].name.startsWith(dirStr)) {
                            tanims.splice(i + 1, 0, tanim);
                            saveData();
                            return;
                        }
                    }
                }
            }
        );
    }

    askAndRenameTanim(tanim: Tanim): boolean {
        return this.ask(
            getTranslate(Strings.eRenameTanimQuestion).replace("[tanimName]", tanim.name),
            tanim.name,
            answer => {
                if (answer !== null) {
                    tanim.rename(answer);
                    this.updateTanimTree();
                    this.updateLayerTree();
                }
            }
        );
    }

    askAndRenameFolder(tanims: Tanim[], dir: string[]): boolean {
        let dirStr = dir.join(EdConst.tanimFolderSeparator);
        let folderName = dir.pop();
        if (!folderName) return false;
        return this.ask(
            getTranslate(Strings.eRenameFolderQuestion).replace("[folderName]", folderName),
            folderName,
            answer => {
                if (answer !== null) {
                    dir.push(answer);
                    let newDirStr = dir.join(EdConst.tanimFolderSeparator);
                    for (let tanim of tanims) {
                        tanim.rename(TheTanimManager.getSafeTanimName(tanim.name.replace(new RegExp("^" + dirStr), newDirStr)));
                    }
                    if (this.foldedTanimFolders.has(dirStr)) {
                        this.foldedTanimFolders.delete(dirStr);
                        this.foldedTanimFolders.add(newDirStr);
                    }
                    if (this.foldedLayerFolders.has(dirStr)) {
                        this.foldedLayerFolders.delete(dirStr);
                        this.foldedLayerFolders.add(newDirStr);
                    }
                    this.updateTanimTree();
                    this.updateLayerTree();
                }
            }
        );
    }

    /** 弹出一个确认框，返回用户的选择。此函数已知在 tw 桌面版和 gandi 网页版的实现都是同步的。 */
    confirm(message: string | null): boolean {
        return confirm(message ?? "");
    }

    updateTree(tanimTree: TanimTree, tanimFolders: TanimFolders, tanims: Tanim[], foldedFolders: Set<string>) {
        tanimTree.length = 0;
        Object.keys(tanimFolders).forEach(key => delete tanimFolders[key]);
        let dir: string[] = [];
        let foldedDepth: number = Infinity;
        for (let i = 0; i < tanims.length; i++) {
            let nameFull = tanims[i].name;
            /** 此动画的路径（不包括动画名） */
            let thisDir = nameFull.split(EdConst.tanimFolderSeparator);
            let name = thisDir.pop() ?? "";
            // 上级文件夹的收尾
            for (let i = dir.length - 1; i >= 0; i--) {
                if (dir[i] !== thisDir[i]) {
                    if (foldedDepth == Infinity) tanimTree.push({
                        dir: [...dir],
                        text: dir[i],
                        type: TanimItemType.folderEnd,
                        indentation: i,
                    });
                    let folderName = dir.join(EdConst.tanimFolderSeparator);
                    if (foldedDepth == Infinity) if (tanimFolders[folderName]) {
                        let ranges = tanimFolders[folderName].ranges
                        ranges[ranges.length - 1].to = tanimTree.length;
                    }
                    dir.pop();
                    if (dir.length < foldedDepth) foldedDepth = Infinity;
                }
            }
            // 此级文件夹的开头
            for (let i = 0; i < thisDir.length; i++) {
                if (dir[i] !== thisDir[i]) {
                    dir.push(thisDir[i]);
                    let isFoldHead = foldedFolders.has(dir.join(EdConst.tanimFolderSeparator))    
                    if (foldedDepth == Infinity) tanimTree.push({
                        dir: [...dir],
                        text: thisDir[i],
                        type: isFoldHead ? TanimItemType.folderFolded : TanimItemType.folderBegin,
                        indentation: i,
                    });
                    let folderName = dir.join(EdConst.tanimFolderSeparator);
                    if (foldedDepth == Infinity) if (tanimFolders[folderName]) {
                        tanimFolders[folderName].ranges.push({ from: tanimTree.length - 1, to: tanimTree.length });
                    } else {
                        tanimFolders[folderName] = {
                            color: stringToHSL(folderName, 50, 90),
                            indentation: i,
                            ranges: [{ from: tanimTree.length - 1, to: tanimTree.length }],
                        };
                    }
                    if (isFoldHead) foldedDepth = min(foldedDepth, dir.length);
                }
            }
            // 此动画
            if (foldedDepth == Infinity) tanimTree.push({
                dir: [...dir],
                text: name,
                type: TanimItemType.tanim,
                indentation: dir.length,
                tanim: tanims[i]
            });
        }
        // 所有文件夹的收尾
        for (let i = dir.length - 1; i >= 0; i--) {
            if (foldedDepth == Infinity) tanimTree.push({
                dir: [...dir],
                text: dir[i],
                type: TanimItemType.folderEnd,
                indentation: i,
            });
            let folderName = dir.join(EdConst.tanimFolderSeparator);
            if (foldedDepth == Infinity) if (tanimFolders[folderName]) {
                let ranges = tanimFolders[folderName].ranges
                ranges[ranges.length - 1].to = tanimTree.length;
            }
            dir.pop();
            if (dir.length < foldedDepth) foldedDepth = Infinity;
        }
    }

    updateTanimTree() {
        this.updateTree(this.tanimTree, this.tanimFolders, TheTanimManager.tanims, this.foldedTanimFolders);
    }

    updateLayerTree() {
        this.updateTree(this.layerTree, this.layerFolders, this.layers, this.foldedLayerFolders);
    }

    scrollTanimList(x: number, update: boolean = true) {
        this.tanimListScroll = clamp(
            this.tanimListScroll + x, 0,
            this.tanimTree.length - floor(
                (this.canvasHeight - EdConst.headerHeight - EdConst.tanimListLineHeight - this.layerBarHeight - EdConst.keyframeBarHeight - EdConst.hintBarHeight)
                / EdConst.tanimListLineHeight
            ) + 1
        );
    }

    scrollLayerList(x: number) {
        this.layerListScroll = clamp(
            this.layerListScroll + x, 0,
            this.layerTree.length - floor((this.layerBarHeight - EdConst.tanimListLineHeight) / EdConst.tanimListLineHeight) + 1
        );
    }

    addToLayer(item: TanimTreeItem, idx: number = 0) {
        switch (item.type) {
            case TanimItemType.tanim:
                if (!item.tanim) return;
                if (this.layers.includes(item.tanim)) break;
                this.layers.splice(idx, 0, item.tanim);
                if (!this.tanim) this.editTanim(item.tanim);
                break;
            case TanimItemType.folderBegin:
            case TanimItemType.folderEnd:
            case TanimItemType.folderFolded:
                let tanims = TheTanimManager.getTanimsByPrefix(item.dir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator);
                this.layers.splice(idx, 0, ...tanims.filter(tanim => !this.layers.includes(tanim)));
                if (!this.tanim && tanims[0]) this.editTanim(tanims[0]);
                break;
        }
        this.updateLayerTree();
    }

    removeLayer(index: number, updateLayerTree: boolean = true) {
        if (!this.layers[index]) return;
        if (this.tanim == this.layers[index]) this.editTanim(null); // 姑且这样写，以后优化逻辑
        this.layers.splice(index, 1);
        if (updateLayerTree) this.updateLayerTree();
        this.updateKuis();
    }

    removeAllLayers(updateLayerTree: boolean = true) {
        this.layers.length = 0;
        this.editTanim(null);
        if (updateLayerTree) this.updateLayerTree();
    }

    /** 进入一个动画的编辑页面 */
    editTanim(tanim: Tanim | null) {
        if (this.tanim == tanim) return;
        if (tanim && !this.configs.tanimConfigs[tanim.name]) {
            this.configs.tanimConfigs[tanim.name] = new TanimConfig(this.spriteName, this.costumeNames, {});
        }
        this.tanim = tanim;
        this.tValueNames = [...DefaultTValueNames];
        if (!tanim) {
            this.selectedKeyframes.clear();
            this.timelines = [null, null];
            this.updateCuis();
            return;
        }
        // 寻找该动画有哪些非默认动画值
        for (let { tValueType } of tanim.timelines) {
            if (DefaultTValues[tValueType]) continue;
            if (DefaultTValueNames.includes(tValueType)) continue;
            this.tValueNames.push(tValueType);
        }
        if (!this.tValueNames.includes(this.tValueName)) {
            this.tValueName = this.tValueNames[0];
        }
        this.editTValueName(this.tValueName);
        this.updateKuis();
    }

    /** 进入一个动画值（左栏成员）的编辑页面 */
    editTValueName(tValueName: string) {
        this.selectedKeyframes.clear();
        if (!this.tanim) return;
        if (!this.tValueNames.includes(tValueName)) return;
        this.tValueName = tValueName;
        if (tValueName == `${DefaultTValueType.px}|${DefaultTValueType.py}`) {
            this.timelines = [
                this.tanim.getTimelineByTValueType(DefaultTValueType.px) ?? new Timeline(DefaultTValueType.px, []),
                this.tanim.getTimelineByTValueType(DefaultTValueType.py) ?? new Timeline(DefaultTValueType.py, [])
            ];
        } else if (tValueName == `${DefaultTValueType.sx}|${DefaultTValueType.sy}`) {
            this.timelines = [
                this.tanim.getTimelineByTValueType(DefaultTValueType.sx) ?? new Timeline(DefaultTValueType.sx, []),
                this.tanim.getTimelineByTValueType(DefaultTValueType.sy) ?? new Timeline(DefaultTValueType.sy, [])
            ];
        } else {
            this.timelines = [
                this.tanim.getTimelineByTValueType(tValueName) ?? new Timeline(tValueName, []),
                null
            ];
        }
        this.updateCuis();
        this.updateKuis();
    }

    /** 把焦点设为一个时间点 */
    focus(time: number) {
        this.focusTime = round(time);
        let leftTime = this.canvasTotimelinePosition(this.leftBarWidth + 100, 0)[0];
        let rightTime = this.canvasTotimelinePosition(this.canvasWidth - this.rightBarWidth - 100, 0)[0];
        if (this.focusTime < leftTime) {
            this.scrollTimeline(this.focusTime - leftTime, 0);
        } else if (this.focusTime > rightTime) {
            this.scrollTimeline(this.focusTime - rightTime, 0);
        }
        this.updateCuis();
    }

    dropTanimToTanims(fromTreeIdx: number, toTreeIdx: number) {
        if (toTreeIdx == fromTreeIdx || toTreeIdx == fromTreeIdx + 1) return;
        let tanimTree = this.tanimTree;
        let tanims = TheTanimManager.tanims;
        let fromItem = tanimTree[fromTreeIdx];
        let toItem = tanimTree[toTreeIdx];
        if (!fromItem) return;

        // 计算拖动目标位置
        let toIdx: number;
        let toDir: string[];
        if (!toItem) {
            if (toTreeIdx == tanimTree.length) {
                // 拖到下方空白处
                toIdx = tanims.length;
                toDir = [];
            } else {
                return;
            }
        } else {
            switch (toItem.type) {
                case TanimItemType.tanim:
                    if (!toItem.tanim) return;
                    toIdx = tanims.indexOf(toItem.tanim);
                    if (toIdx == -1) return;
                    toDir = toItem.tanim.name.split(EdConst.tanimFolderSeparator).slice(0, -1);
                    break;
                case TanimItemType.folderBegin:
                case TanimItemType.folderEnd:
                case TanimItemType.folderFolded:
                    toIdx = -1;
                    for (let i = toTreeIdx + 1; i < tanimTree.length; i++) {
                        let item = tanimTree[i];
                        if (item.type == TanimItemType.tanim) {
                            if (!item.tanim) return;
                            toIdx = tanims.indexOf(item.tanim);
                            if (toIdx == -1) return;
                            break;
                        }
                    }
                    if (toIdx == -1) toIdx = tanims.length;
                    if (toItem.type == TanimItemType.folderEnd) {
                        toDir = [...toItem.dir];
                    } else {
                        toDir = toItem.dir.slice(0, -1);
                    }
                    break;
                default:
                    return;
            }
        }

        let toDirStr = toDir.length == 0 ? "" : toDir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator;
        // 标记旧元素，并插入新元素
        if (fromItem.type == TanimItemType.tanim && fromItem.tanim) {
            let fromTanim = fromItem.tanim
            let fromDir = fromItem.dir;
            let fromDirStr = fromDir.length == 0 ? "" : fromDir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator;
            let idx = tanims.indexOf(fromTanim);
            if (idx == -1) return;
            // 这里临时把 tanims 的成员变为 null，函数结束后保证会变回来
            // @ts-expect-error
            tanims[idx] = null;
            fromTanim.rename(TheTanimManager.getSafeTanimName(fromTanim.name.replace(new RegExp("^" + fromDirStr), toDirStr)));
            tanims.splice(toIdx, 0, fromTanim);
        } else if (fromItem.type == TanimItemType.folderFolded) {
            let fromDir = fromItem.dir.slice(0, -1); // 注意，这个dir是文件夹自身所在的路径，不是文件夹里的动画所在的路径！
            let fromDirStr = fromDir.length == 0 ? "" : fromDir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator;
            let fromTanims = TheTanimManager.getTanimsByPrefix(fromItem.dir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator); // 这里要找的不是文件夹自身所在路径，而是文件夹里所有动画所在的路径！！我自己被搞迷糊过😭
            let fromIdxs = [];
            for (let fromTanim of fromTanims) {
                let idx = tanims.indexOf(fromTanim);
                if (idx == -1) return;
                fromIdxs.push(idx);
            }
            for (let idx of fromIdxs) {
                // 这里临时把 tanims 的成员变为 null，函数结束后保证会变回来
                // @ts-expect-error
                tanims[idx] = null
            }
            for (let fromTanim of fromTanims) {
                fromTanim.rename(TheTanimManager.getSafeTanimName(fromTanim.name.replace(new RegExp("^" + fromDirStr), toDirStr)));
            }
            tanims.splice(toIdx, 0, ...fromTanims);
        } else return;
        for (let i = tanims.length - 1; i >= 0; i--) {
            if (tanims[i] === null) tanims.splice(i, 1);
        }
        this.updateTanimTree();
        saveData();
    }

    getLayerToIdx(layerTree: TanimTree, layers: Tanim[], toTreeIdx: number, toItem: TanimTreeItem | undefined): number {
        let toIdx: number;
        if (!toItem) {
            if (toTreeIdx == layerTree.length) {
                // 拖到下方空白处
                return layers.length;
            } else {
                return -1;
            }
        } else {
            switch (toItem.type) {
                case TanimItemType.tanim:
                    if (!toItem.tanim) return -1;
                    toIdx = layers.indexOf(toItem.tanim);
                    return toIdx;
                case TanimItemType.folderBegin:
                case TanimItemType.folderEnd:
                case TanimItemType.folderFolded:
                    toIdx = -1;
                    for (let i = toTreeIdx + 1; i < layerTree.length; i++) {
                        let item = layerTree[i];
                        if (item.type == TanimItemType.tanim) {
                            if (!item.tanim) return -1;
                            toIdx = layers.indexOf(item.tanim);
                            if (toIdx == -1) return -1;
                            break;
                        }
                    }
                    if (toIdx == -1) toIdx = layers.length;
                    return toIdx;
                default:
                    return -1;
            }
        }
    }

    dropTanimToLayers(fromTreeIdx: number, toTreeIdx: number) {
        let tanimTree = this.tanimTree;
        let layerTree = this.layerTree;
        let layers = this.layers;
        let fromItem = tanimTree[fromTreeIdx];
        let toItem = layerTree[toTreeIdx];
        if (!fromItem) return;

        // 计算拖动目标位置
        let toIdx = this.getLayerToIdx(layerTree, layers, toTreeIdx, toItem);
        if (toIdx == -1) return;

        // 将动画加入到图层中
        this.addToLayer(fromItem, toIdx);
    }

    dropLayerToLayers(fromTreeIdx: number, toTreeIdx: number) {
        let layerTree = this.layerTree;
        let layers = this.layers;
        let fromItem = layerTree[fromTreeIdx];
        let toItem = layerTree[toTreeIdx];
        if (!fromItem) return;

        // 计算拖动目标位置
        let toIdx = this.getLayerToIdx(layerTree, layers, toTreeIdx, toItem);
        if (toIdx == -1) return;

        // 标记旧元素，并插入新元素
        if (fromItem.type == TanimItemType.tanim && fromItem.tanim) {
            let fromTanim = fromItem.tanim;
            let idx = layers.indexOf(fromTanim);
            if (idx == -1) return;
            // 这里临时把 layers 的成员变为 null，函数结束后保证会变回来
            // @ts-ignore
            layers[idx] = null;
            layers.splice(toIdx, 0, fromTanim);
        } else if (fromItem.type == TanimItemType.folderFolded) {
            let fromDir = fromItem.dir.slice(0, -1); // 注意，这个dir是文件夹自身所在的路径，不是文件夹里的动画所在的路径！
            let fromDirStr = fromDir.length == 0 ? "" : fromDir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator;
            let fromTanims = TheTanimManager.getTanimsByPrefix(fromItem.dir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator); // 这里要找的不是文件夹自身所在路径，而是文件夹里所有动画所在的路径！！我自己被搞迷糊过😭
            for (let fromTanim of fromTanims) {
                let idx = layers.indexOf(fromTanim);
                if (idx == -1) return;
                // 这里临时把 layers 的成员变为 null，函数结束后保证会变回来
                // @ts-ignore
                layers[idx] = null
            }
            layers.splice(toIdx, 0, ...fromTanims);
        } else return;
        for (let i = layers.length - 1; i >= 0; i--) {
            if (layers[i] === null) layers.splice(i, 1);
        }
        this.updateLayerTree();
    }

    // #endregion

    updateCuis() {
        let width = this.canvasWidth - this.leftBarWidth - this.rightBarWidth;
        let cuis = this.cuis;
        cuis.length = 0;
        let largeSpacing: number = EdConst.cuiLargeSpacing;
        let spacing: number = EdConst.cuiSpacing;
        let d = width / 2 - (EdConst.cuiPlaySize / 2 + EdConst.cuiNormalSize * 6 + spacing * 3 + largeSpacing * 3 + EdConst.cuiPaddingX);
        if (d < 0) {
            largeSpacing += d / 4;
            largeSpacing = max(4, largeSpacing);
            spacing += d / 12;
            spacing = max(2, spacing);
        }
        cuis.push(new CUI(CUIType.play, CUIAlign.center, 0, EdConst.cuiPlaySize));
        let p = EdConst.cuiPlaySize / 2 + largeSpacing + EdConst.cuiNormalSize / 2;
        cuis.push(new CUI(CUIType.gotoLeftFrame, CUIAlign.center, -p, EdConst.cuiNormalSize));
        cuis.push(new CUI(CUIType.gotoRightFrame, CUIAlign.center, p, EdConst.cuiNormalSize));
        p += EdConst.cuiNormalSize + spacing;
        cuis.push(new CUI(CUIType.gotoLeftKeyframe, CUIAlign.center, -p, EdConst.cuiNormalSize));
        cuis.push(new CUI(CUIType.gotoRightKeyframe, CUIAlign.center, p, EdConst.cuiNormalSize));
        p += EdConst.cuiNormalSize + spacing;
        cuis.push(new CUI(CUIType.gotoLeftMost, CUIAlign.center, -p, EdConst.cuiNormalSize));
        cuis.push(new CUI(CUIType.gotoRightMost, CUIAlign.center, p, EdConst.cuiNormalSize));
        p += EdConst.cuiNormalSize + largeSpacing;
        if (this.getDeletePairs()) {
            cuis.push(new CUI(CUIType.deleteKeyframe, CUIAlign.center, -p, EdConst.cuiNormalSize));
        }
        cuis.push(new CUI(CUIType.loop, CUIAlign.center, p, EdConst.cuiNormalSize));
        p += EdConst.cuiNormalSize + spacing;
        if (this.getNewKeyframeTimeline()) {
            cuis.push(new CUI(CUIType.newKeyframe, CUIAlign.center, -p, EdConst.cuiNormalSize));
        }
        cuis.push(new CUI(CUIType.yoyo, CUIAlign.center, p, EdConst.cuiNormalSize));
        p += EdConst.cuiNormalSize + largeSpacing;
        if (this.timelines[1]) {
            cuis.push(new CUI(CUIType.mainAxis, CUIAlign.center, -p, EdConst.cuiNormalSize));
        }
        cuis.push(new CUI(CUIType.mark, CUIAlign.center, p, EdConst.cuiNormalSize));
        let dLeft = width / 2 - (EdConst.cuiPlaySize / 2 + EdConst.cuiNormalSize * 7 + spacing * 3 + largeSpacing * 5 + EdConst.cuiPaddingX);
        if (width / 2 >= EdConst.cuiPlaySize / 2 + EdConst.cuiNormalSize * 7 + spacing * 3 + largeSpacing * 4) {
            p += EdConst.cuiNormalSize + largeSpacing;
            if (this.timelines[0]) {
                cuis.push(new CUI(CUIType.showHandle, CUIAlign.center, -p, EdConst.cuiNormalSize));
            } else {
                dLeft = width / 2 - (EdConst.cuiPlaySize / 2 + EdConst.cuiNormalSize * 6 + spacing * 3 + largeSpacing * 4 + EdConst.cuiPaddingX);
            }
            //cuis.push(new CUI(CUIType.magnet, CUIAlign.center, p, EdConst.cuiNormalSize));
        }
        if (this.tanim) {
            if (dLeft >= 60) {
                cuis.push(new CUI(CUIType.pos, CUIAlign.left, EdConst.cuiPaddingX, { w: min(dLeft, 120), h: EdConst.cuiNormalSize as const }));
            }

            let dRight = width / 2 - (EdConst.cuiPlaySize / 2 + EdConst.cuiNormalSize * 7 + spacing * 3 + largeSpacing * 5 + EdConst.cuiPaddingX);
            if (dRight >= 60) {
                cuis.push(new CUI(CUIType.fps, CUIAlign.right, -EdConst.cuiPaddingX, { w: min(dRight, 100), h: EdConst.cuiNormalSize as const }));
            }
        }
    }

    updateKuis() {
        let width = this.rightBarWidth - 2 * EdConst.rightBarPaddingX;
        let kuis = this.kuis;
        kuis.length = 0;
        let y = 0;
        if (!this.tanim) {
            // “请先创建动画”
            kuis.push(new KUI(KUIType.ghostLabel, 0, y, { w: width, h: EdConst.tanimListLineHeight as number }, { // 这里的高度是为了跟上方的几个面板统一
                text: TheTanimManager.tanims.length == 0 ? Strings.eKUIPleaseCreateTanim : Strings.eKUIPleaseOpenTanim
            }));
            return;
        }
        // 标题
        kuis.push(new KUI(KUIType.title, 0, y, { w: width, h: EdConst.tanimListLineHeight as number }, { text: Strings.eKUITitle }));
        y += EdConst.tanimListLineHeight - EdConst.kuiLineHeight;
        // 没有选中的帧
        if (this.selectedKeyframes.size == 0) {
            y += EdConst.kuiLineHeight;
            kuis.push(new KUI(KUIType.ghostLabel, 0, y, width, { text: Strings.eKUINoSelect }));
            return;
        }
        // 选中了多个帧
        if (this.selectedKeyframes.size > 1) {
            y += EdConst.kuiLineHeight;
            kuis.push(new KUI(KUIType.ghostLabel, 0, y, width, { text: Strings.eKUIMultiSelect }));
            return;
        }

        let [keyframe] = this.selectedKeyframes;
        let idx0 = this.timelines[0]?.keyframes.indexOf(keyframe) ?? -1;
        let idx1 = this.timelines[1]?.keyframes.indexOf(keyframe) ?? -1;

        // 时间
        y += EdConst.kuiLineHeight;
        kuis.push(new KUI(KUIType.timeSec, 0, y, (width - EdConst.kuiSpacing) / 2, { text: Strings.eKUITimeSec }));
        kuis.push(new KUI(KUIType.timeFrame, (width + EdConst.kuiSpacing) / 2, y, (width - EdConst.kuiSpacing) / 2, { text: Strings.eKUITimeFrame }));
        // 动画值
        y += EdConst.kuiLineHeight;
        kuis.push(new KUI(KUIType.tValue, 0, y, width, { text: Strings.eKUITValue }));
        // 选中了末尾帧
        if (
            (idx0 >= 0 && !this.timelines[0]?.keyframes[idx0 + 1]) ||
            (idx1 >= 0 && !this.timelines[1]?.keyframes[idx1 + 1])
        ) {
            y += EdConst.kuiLineHeight;
            kuis.push(new KUI(KUIType.ghostLabel, 0, y, width, { text: Strings.eKUILastSelect }));
            return;
        }
        // 缓动模式
        y += EdConst.kuiLineHeight + EdConst.kuiLineSpacingLarge;
        kuis.push(new KUI(KUIType.interType, 0, y, { w: width, h: EdConst.kuiLineHeight + 6 }, { interType: keyframe.interType, text: Strings.eKUIInterType }));
        y += 6;

        if (this.kuiState == KUIState.interType) {
            // 展开列表，选择缓动模式
            let colWidth = (width - 2 * EdConst.kuiSpacing) / 3;
            let colStep = colWidth + EdConst.kuiSpacing;
            for (let row = 0; row < 5; row ++) {
                y += EdConst.kuiLineHeight;
                for (let col = 0; col < 3; col ++) {
                    let interType = KUIInterTypeTable[col][row];
                    if (!interType) continue;
                    kuis.push(new KUI(KUIType.interTypeListItem, col * colStep, y, colWidth, { interType: interType, text: Strings.eKUIInterTypeListItem }));
                }
            }
        } else {
            // 缓动参数
            y += EdConst.kuiLineSpacingSmall;
            switch (keyframe.interType) {
                case InterType.power:
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, width, { paramType: "powerN", text: Strings.eKUIPowerN }));
                    break;
                case InterType.exp:
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, width, { paramType: "expN", text: Strings.eKUIExpN }));
                    break;
                case InterType.elastic:
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, width, { paramType: "elasticM", text: Strings.eKUIElasticM }));
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, width, { paramType: "elasticN", text: Strings.eKUIElasticN }));
                    break;
                case InterType.back:
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, width, { paramType: "backS", text: Strings.eKUIBackS }));
                    break;
                case InterType.tradExp:
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, (width - EdConst.kuiSpacing) / 2, { paramType: "tradExpV", text: Strings.eKUITradExpVD }));
                    kuis.push(new KUI(KUIType.tradExpVM, (width + EdConst.kuiSpacing) / 2, y, (width - EdConst.kuiSpacing) / 2, { text: Strings.eKUITradExpVM }));
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, width, { paramType: "tradExpP", text: Strings.eKUITradExpP }));
                    break;
                case InterType.lagrange:
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.label, 0, y, width, { text: Strings.eKUILagrangeController }));
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.LagrangeCXSec, 0, y, (width - EdConst.kuiSpacing) / 2, { text: Strings.eKUITimeSec }));
                    kuis.push(new KUI(KUIType.paramInput, (width + EdConst.kuiSpacing) / 2, y, (width - EdConst.kuiSpacing) / 2, { paramType: "lagrangeCX", text: Strings.eKUILagrangeCX }));
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramInput, 0, y, width, { paramType: "lagrangeCY", text: Strings.eKUILagrangeCY }));
                    break;
            }
            let radioWidth = EdConst.kuiLineHeight;
            let radioStep = radioWidth + EdConst.kuiSpacing;
            switch (keyframe.interType) {
                case InterType.power:
                case InterType.exp:
                case InterType.sine:
                case InterType.circular:
                case InterType.elastic:
                case InterType.back:
                case InterType.bounce:
                // 缓动方向
                    y += EdConst.kuiLineHeight + EdConst.kuiLineSpacingLarge;
                    kuis.push(new KUI(KUIType.label, 0, y, width, { text: Strings.eKUIEaseType }));
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramRadio, 0, y, radioWidth, { paramType: "easeType", paramValue: EaseType.in }));
                    kuis.push(new KUI(KUIType.paramRadio, radioStep, y, radioWidth, { paramType: "easeType", paramValue: EaseType.out }));
                    kuis.push(new KUI(KUIType.paramRadio, 2 * radioStep, y, radioWidth, { paramType: "easeType", paramValue: EaseType.inOut }));
                    kuis.push(new KUI(KUIType.paramRadio, 3 * radioStep, y, radioWidth, { paramType: "easeType", paramValue: EaseType.outIn }));
                    break;
                case InterType.bezier:
                    // 手柄类型
                    y += EdConst.kuiLineHeight + EdConst.kuiLineSpacingLarge;
                    kuis.push(new KUI(KUIType.label, 0, y, width, { text: Strings.eKUIBezierHandleType }));
                    y += EdConst.kuiLineHeight;
                    kuis.push(new KUI(KUIType.paramRadio, 3 * radioStep, y, radioWidth, { paramType: "bezierHandleType", paramValue: BezierHandleType.auto }));
                    kuis.push(new KUI(KUIType.paramRadio, 0, y, radioWidth, { paramType: "bezierHandleType", paramValue: BezierHandleType.aligned }));
                    kuis.push(new KUI(KUIType.paramRadio, radioStep, y, radioWidth, { paramType: "bezierHandleType", paramValue: BezierHandleType.free }));
                    kuis.push(new KUI(KUIType.paramRadio, 2 * radioStep, y, radioWidth, { paramType: "bezierHandleType", paramValue: BezierHandleType.vector }));
                    break;
            }
        }
    }

    updateHoverAndCursor(event: MouseEvent | WheelEvent | KeyboardEvent | null = null) {
        this.hover = [];
        this.hoveredKeyframes.clear();
        this.cursor = "default";
        if ((0 < this.mouseX && this.mouseX < this.canvasWidth) && (0 < this.mouseY && this.mouseY < EdConst.headerHeight)) {
            // 鼠标位于顶栏
            this.cursor = "move";
            this.hover = ["header"];
            if (this.canvasWidth - EdConst.headerButtonWidth <= this.mouseX) {
                this.cursor = "pointer";
                this.hover.push("close");
            } else if (this.canvasWidth - 2 * EdConst.headerButtonWidth <= this.mouseX) {
                this.cursor = "pointer";
                this.hover.push("minimize");
            }
        } else if (!this.isMinimized) {
            if (abs(this.canvasWidth - this.mouseX) <= 4 && abs(this.canvasHeight - this.mouseY) <= 4) {
                // 鼠标位于窗口右下角
                this.cursor = "nwse-resize";
                this.hover = ["border", "rb"];
            } else if (abs(this.canvasWidth - this.mouseX) <= 4) {
                // 鼠标位于窗口右侧
                this.cursor = "ew-resize";
                this.hover = ["border", "r"];
            } else if (abs(this.canvasHeight - this.mouseY) <= 4) {
                // 鼠标位于窗口下侧
                this.cursor = "ns-resize";
                this.hover = ["border", "b"];
            } else if (abs(this.canvasWidth - this.rightBarWidth - this.mouseX) <= 3) {
                // 鼠标位于右栏左边缘
                this.cursor = "ew-resize";
                this.hover = ["innerBorder", "r"];
            } else if (abs(this.leftBarWidth - this.mouseX) <= 3) {
                // 鼠标位于左栏右边缘
                this.cursor = "ew-resize";
                this.hover = ["innerBorder", "l"];
            } else if (
                this.canvasWidth - this.rightBarWidth < this.mouseX && this.mouseX < this.canvasWidth - 4 &&
                this.mouseY < this.canvasHeight - EdConst.hintBarHeight
            ) {
                // 鼠标位于右列（排除顶栏）
                if (abs(this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight - this.mouseY) <= 3) {
                    // 鼠标位于图层栏上边缘
                    this.cursor = "ns-resize";
                    this.hover = ["innerBorder", "layer"];
                } else if (
                    this.canvasWidth - EdConst.tanimListLineHeight - EdConst.tanimListPaddingRight < this.mouseX && this.mouseX < this.canvasWidth - EdConst.tanimListPaddingRight &&
                    EdConst.headerHeight < this.mouseY && this.mouseY < EdConst.headerHeight + EdConst.tanimListLineHeight
                ) {
                    // 鼠标位于新建动画按钮
                    this.cursor = "pointer";
                    this.hover = ["newTanim"];
                } else if (
                    EdConst.headerHeight + EdConst.tanimListLineHeight < this.mouseY &&
                    this.mouseY < this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight - 5
                ) {
                    // 鼠标位于动画列表范围内
                    if (this.mouseX >= this.canvasWidth - EdConst.tanimListPaddingRight) {
                        // 右侧内边距区
                        this.hover = ["tanimScroll"];
                    } else {
                        this.hover = ["tanimList"];
                        let treeIndex = floor((this.mouseY - (EdConst.headerHeight + EdConst.tanimListLineHeight)) / EdConst.tanimListLineHeight + this.tanimListScroll);
                        if (0 <= treeIndex && treeIndex < this.tanimTree.length) {
                            // 鼠标位于某一动画上
                            this.cursor = "pointer";
                            this.hover.push(treeIndex);
                            let buttons = this.getTanimListButtons(this.tanimTree[treeIndex]);
                            let buttonIndex = clamp(floor((this.canvasWidth - EdConst.tanimListPaddingRight - this.mouseX) / EdConst.tanimListLineHeight), 0, buttons.length);
                            this.hover.push(buttons[buttonIndex] ?? TanimListButtonType.main);
                        } else if (treeIndex >= this.tanimTree.length) {
                            // 鼠标位于空白处
                            this.hover.push(this.tanimTree.length);
                        }
                    }
                } else if (
                    this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight + EdConst.tanimListLineHeight < this.mouseY &&
                    this.mouseY < this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight
                ) {
                    // 鼠标位于图层列表范围内
                    if (this.mouseX >= this.canvasWidth - EdConst.tanimListPaddingRight) {
                        // 右侧内边距区
                        this.hover = ["layerScroll"];
                    } else {
                        // 列表主区
                        this.hover = ["layerList"];
                        let treeIndex = floor((this.mouseY - (this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight + EdConst.tanimListLineHeight)) / EdConst.tanimListLineHeight + this.layerListScroll);
                        if (0 <= treeIndex && treeIndex < this.layerTree.length) {
                            // 鼠标位于某一图层上
                            this.cursor = "pointer";
                            this.hover.push(treeIndex);
                            let buttons = this.getLayerListButtons(this.layerTree[treeIndex]);
                            let buttonIndex = clamp(floor((this.canvasWidth - EdConst.tanimListPaddingRight - this.mouseX) / EdConst.tanimListLineHeight), 0, buttons.length);
                            this.hover.push(buttons[buttonIndex] ?? TanimListButtonType.main);
                        } else if (treeIndex >= this.layerTree.length) {
                            // 鼠标位于空白处
                            this.hover.push(this.layerTree.length);
                        }
                    }
                } else if (
                    this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight < this.mouseY &&
                    this.mouseY < this.canvasHeight - EdConst.hintBarHeight
                ) {
                    // 鼠标位于关键帧面板内
                    this.hover = ["keyframeBar"];
                    for (let kui of this.kuis) {
                        let { type, x, y, size: {w, h}, interType, paramType, paramValue } = kui;
                        if (type == KUIType.title || type == KUIType.label || type == KUIType.ghostLabel) continue;
                        let x1 = this.canvasWidth - this.rightBarWidth + EdConst.cuiPaddingX + x;
                        let x2 = x1 + w;
                        let y1 = this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight + y;
                        let y2 = y1 + h;
                        if (x1 - 1 <= this.mouseX && this.mouseX <= x2 + 1 && y1 - 1 <= this.mouseY && this.mouseY <= y2 + 1) {
                            this.hover.push(type);
                            // 面向过程的坏习惯，导致每次更新都会弄死所有KUI，然后又搓一堆新的出来。
                            // 所以为了确定悬停的到底是哪个ui，需要保存很多额外信息。
                            switch (type) {
                                case KUIType.interTypeListItem:
                                    if (interType) this.hover.push(interType);
                                case KUIType.paramInput:
                                    if (paramType) this.hover.push(paramType);
                                case KUIType.paramRadio:
                                    if (paramType && paramValue) this.hover.push(paramType, paramValue);
                            }
                            this.cursor = "pointer";
                            break;
                        }
                    }
                }
            } else if (
                this.leftBarWidth < this.mouseX && this.mouseX < this.canvasWidth - this.rightBarWidth &&
                this.mouseY < this.canvasHeight - EdConst.hintBarHeight
            ) {
                // 鼠标位于中间列（排除顶栏）
                if (this.mouseY < this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight - EdConst.controlBarHeight - 8) {
                    // 鼠标位于预览区
                    this.hover = ["preview"];
                } else if (this.mouseY < this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight - EdConst.controlBarHeight) {
                    // 鼠标位于控制栏上边缘（调整时间轴高度的位置）
                    this.cursor = "ns-resize";
                    this.hover = ["innerBorder", "b"];
                } else if (
                    this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight - EdConst.controlBarHeight < this.mouseY &&
                    this.mouseY < this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight
                ) {
                    // 鼠标位于控制栏
                    this.hover = ["controlBar"];
                    for (let { type, align, pos, size: {w, h} } of this.cuis) {
                        let x1, x2, y1, y2;
                        switch (align) {
                            case CUIAlign.left:
                                x1 = this.leftBarWidth + pos;
                                x2 = x1 + w;
                                break;
                            case CUIAlign.right:
                                x2 = this.canvasWidth - this.rightBarWidth + pos;
                                x1 = x2 - w;
                                break;
                            default:
                            case CUIAlign.center:
                                let x = (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2 + pos;
                                x1 = x - w / 2;
                                x2 = x + w / 2;
                                break;
                        }
                        let y = this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight - EdConst.controlBarHeight / 2;
                        y1 = y - h / 2;
                        y2 = y + h / 2;
                        if (x1 - 1 <= this.mouseX && this.mouseX <= x2 + 1 && y1 - 1 <= this.mouseY && this.mouseY <= y2 + 1) {
                            this.hover.push(type);
                            this.cursor = "pointer";
                            break;
                        }
                    }
                } else if (this.mouseY < this.canvasHeight - EdConst.hintBarHeight) {
                    // 鼠标位于时间轴区
                    this.hover = ["timeline"];
                    let top = this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight;
                    let bottom = this.canvasHeight - EdConst.hintBarHeight;
                    let left = this.leftBarWidth;
                    let right = this.canvasWidth - this.rightBarWidth;
                    if (this.mouseY < top + EdConst.timelineMarkHeight) {
                        // 标签栏
                        this.hover.push("mark");
                        if (this.tanim) {
                            let endX = this.timelineToCanvasPosition(this.tanim.length, 0)[0];
                            if (abs(this.mouseX - endX) <= 4) {
                                this.hover.push("endTime");
                            }
                        }
                    } else if (this.mouseY < top + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight) {
                        // 标尺栏
                        this.hover.push("ruler");
                    } else if (this.mouseY > bottom - EdConst.timelineScrollHeight) {
                        // 底部滚动条
                        if (this.mouseX < left + EdConst.timelineSideRulerWidth) {
                            // 向左滚动
                            this.hover.push("scrollLeft");
                        } else if (right - EdConst.timelineSideRulerWidth < this.mouseX) {
                            // 向右滚动
                            this.hover.push("scrollRight");
                        } else {
                            // 滚动条主体
                            this.hover.push("scrollX");
                        }
                    } else if (this.mouseX < left + EdConst.timelineSideRulerWidth || right - EdConst.timelineSideRulerWidth < this.mouseX) {
                        // 左右两侧的标尺栏
                        this.hover.push("sideRuler");
                    } else {
                        // 时间轴主面板！！！
                        this.hover.push("main");
                        let timelineHover = this.checkTimelineHover(this.mainAxis) ?? this.checkTimelineHover(this.subAxis);
                        if (!timelineHover) return;
                        if (timelineHover[0] == "tValueCurve") {
                            this.hover.push(...timelineHover);
                        } else if (timelineHover[0] == "keyframe") {
                            this.hover.push("keyframe");
                            this.hoveredKeyframes.add(timelineHover[1]);
                            this.cursor = this.selectedKeyframes.has(timelineHover[1]) && !event?.shiftKey ? "grab" : "pointer";
                        }
                    }
                }
            } else if (
                this.mouseX < this.leftBarWidth &&
                this.mouseY < this.canvasHeight - EdConst.hintBarHeight
            ) {
                // 鼠标位于左列（排除顶栏）
            }
        }
    }

    checkTimelineHover(timelineIndex: 0 | 1): ["keyframe", Keyframe] | ["tValueCurve", 0 | 1] | null {
        let timeline = this.timelines[timelineIndex];
        if (!timeline) return null;
        let mouseTime = round(this.mouseTimelineX);
        let mouseTValue = safeTValue(timeline.getTValueByFrame(mouseTime), timeline.tValueType);
        let [curveX, curveY] = this.timelineToCanvasPosition(mouseTime, mouseTValue);
        let mostCloseKeyframe = null;
        let mostCloseDistance = Infinity;
        for (let keyframe of timeline.keyframes) {
            let [keyframeX, keyframeY] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
            let distance = abs(keyframeX - this.mouseX) + abs(keyframeY - this.mouseY);
            if (distance <= min(EdConst.timelineKeyframeSize + 2, mostCloseDistance)) {
                mostCloseKeyframe = keyframe;
                mostCloseDistance = distance;
            }
        }
        if (mostCloseKeyframe) return ["keyframe", mostCloseKeyframe];
        if (abs(curveX - this.mouseX) + abs(curveY - this.mouseY) <= EdConst.timelineKeyframeSize + 2) {
            return ["tValueCurve", timelineIndex];
        }
        return null;
    }

    /** 坐标为 canvas 上的坐标 */
    getBoxSelectKeyframes(x1: number, y1: number, x2: number, y2: number): Set<Keyframe> {
        let results = new Set<Keyframe>();
        let keyframes = [];
        if (this.timelines[0]) keyframes.push(...this.timelines[0].keyframes);
        if (this.timelines[1]) keyframes.push(...this.timelines[1].keyframes);
        let bx = (x1 + x2) / 2;
        let by = (y1 + y2) / 2;
        let bw = (abs(x1 - x2) + EdConst.timelineKeyframeSize) / 2 + 1;
        let bh = (abs(y1 - y2) + EdConst.timelineKeyframeSize) / 2 + 1;
        for (let keyframe of keyframes) {
            let { x: kx, y: ky } = keyframe;
            let [ x, y ] = this.timelineToCanvasPosition(kx, ky);
            if (abs(bx - x) <= bw && (typeof y == "string" || abs(by - y) <= bh)) {
                results.add(keyframe);
            }
        }
        return results;
    }

    /** 执行一个鼠标行为，例如按下某个按钮  
     * 如果返回 true ，代表这一帧的更新需要被阻断（由于异步 prompt） */
    doMouse(mouseState: MouseState, event: MouseEvent | WheelEvent | KeyboardEvent | null = null): true | void {
        if (this.hover[0] == "header") {
            if (this.hover[1] === undefined) {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.move;
                    this.mouseDragTop = this.top;
                    this.mouseDragLeft = this.left;
                }
            } else if (this.hover[1] == "close") {
                if (mouseState == MouseState.leftUp) {
                    this.isShow = false;
                    this.root.style.display = "none";
                    return;
                }
            } else if (this.hover[1] == "minimize") {
                if (mouseState == MouseState.leftUp) {
                    this.isMinimized = !this.isMinimized;
                    if (this.isMinimized) {
                        this.canvasWidth = EdConst.headerWidth;
                        this.canvasHeight = EdConst.headerHeight;
                        //this.left += this.width - this.canvasWidth;
                        this.mouseX += this.width - this.canvasWidth;
                    } else {
                        //this.left -= this.width - this.canvasWidth;
                        this.mouseX -= this.width - this.canvasWidth;
                        this.canvasWidth = this.width;
                        this.canvasHeight = this.height;
                        this.left = clamp(this.left, 5, window.innerWidth - this.canvasWidth - 5);
                        this.top = clamp(this.top, isGandi ? 65 : 53, window.innerHeight - this.canvasHeight - 5);
                    }
                    this.setCanvasSize(this.canvasWidth, this.canvasHeight);
                    this.setPosition();
                    this.updateCuis();
                    this.updateHoverAndCursor(event);
                }
            }
        } else if (this.hover[0] == "border") {
            if (this.hover[1] == "rb") {
                if (mouseState != MouseState.leftDown) return;
                this.mouseDragType = MouseDragType.size;
                this.mouseDragWidth = this.width;
                this.mouseDragHeight = this.height;
            } else if (this.hover[1] == "r") {
                if (mouseState != MouseState.leftDown) return;
                this.mouseDragType = MouseDragType.width;
                this.mouseDragWidth = this.width;
            } else if (this.hover[1] == "b") {
                if (mouseState != MouseState.leftDown) return;
                this.mouseDragType = MouseDragType.height;
                this.mouseDragHeight = this.height;
            }
        } else if (this.hover[0] == "innerBorder") {
            if (this.hover[1] == "l") {
                if (mouseState != MouseState.leftDown) return;
                this.mouseDragType = MouseDragType.leftBarWidth;
                this.mouseDragWidth = this.leftBarWidth;
            } else if (this.hover[1] == "r") {
                if (mouseState != MouseState.leftDown) return;
                this.mouseDragType = MouseDragType.rightBarWidth;
                this.mouseDragWidth = this.rightBarWidth;
            } else if (this.hover[1] == "b") {
                if (mouseState != MouseState.leftDown) return;
                this.mouseDragType = MouseDragType.timelineBarHeight;
                this.mouseDragHeight = this.timelineBarHeight;
            } else if (this.hover[1] == "layer") {
                if (mouseState != MouseState.leftDown) return;
                this.mouseDragType = MouseDragType.layerBarHeight;
                this.mouseDragHeight = this.layerBarHeight;
            }
        } else if (this.hover[0] == "newTanim") {
            if (mouseState != MouseState.leftUp) return;
            // 新建动画！
            if (this.askAndCreateNewTanim()) return true;
            this.updateTanimTree();
        } else if (this.hover[0] == "tanimList") {
            if (this.hover[1] == this.tanimTree.length) {
                if (mouseState != MouseState.dblclick) return;
                // 双击空白处新建动画！
                if (this.askAndCreateNewTanim()) return true;
                this.updateTanimTree();
            } else if (typeof this.hover[1] == "number") {
                // 鼠标位于动画列表中的一个节点上
                let hoverItem = this.tanimTree[this.hover[1]];
                switch (hoverItem.type) {
                    case TanimItemType.tanim:
                        if (!hoverItem.tanim) break;
                        switch (this.hover[2]) {
                            case TanimListButtonType.main:
                                if (mouseState == MouseState.leftDown) {
                                    // 开始拖动动画
                                    this.mouseDragType = MouseDragType.tanimTreeItem;
                                    this.mouseDragIndex = this.hover[1];
                                } else if (mouseState == MouseState.dblclick) {
                                    // 双击动画，覆盖现有图层
                                    this.removeAllLayers();
                                    this.addToLayer(hoverItem);
                                }
                                break;
                            case TanimListButtonType.setLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 覆盖现有图层
                                    this.removeAllLayers();
                                    this.addToLayer(hoverItem);
                                }
                                break;
                            case TanimListButtonType.addLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 把动画加入到图层中
                                    this.addToLayer(hoverItem);
                                }
                                break;
                            case TanimListButtonType.copy:
                                if (mouseState == MouseState.leftUp) {
                                    // 复制动画
                                    let idx = TheTanimManager.tanims.indexOf(hoverItem.tanim);
                                    if (idx == -1) break;
                                    let copy = TheTanimManager.getCopiedTanim(hoverItem.tanim);
                                    if (!copy) break;
                                    TheTanimManager.tanims.splice(idx + 1, 0, copy);
                                    saveData();
                                    this.updateTanimTree();
                                }
                                break;
                            case TanimListButtonType.rename:
                                if (mouseState == MouseState.leftUp) {
                                    // 重命名动画
                                    if (this.askAndRenameTanim(hoverItem.tanim)) return;
                                }
                                break;
                            case TanimListButtonType.delete:
                                if (mouseState == MouseState.leftUp) {
                                    // 删除动画
                                    if (!this.confirm(getTranslate(Strings.eDeleteTanimQuestion).replace("[tanimName]", hoverItem.tanim.name))) break;
                                    let idx = TheTanimManager.tanims.indexOf(hoverItem.tanim);
                                    if (idx == -1) break;
                                    if (this.layers.includes(hoverItem.tanim)) this.removeLayer(this.layers.indexOf(hoverItem.tanim));
                                    this.recycleBin.push(hoverItem.tanim);
                                    TheTanimManager.tanims.splice(idx, 1);
                                    saveData();
                                    this.updateTanimTree();
                                }
                                break;
                        }
                        break;
                    case TanimItemType.folderBegin:
                    case TanimItemType.folderEnd:
                    case TanimItemType.folderFolded:
                        let tanims = TheTanimManager.getTanimsByPrefix(hoverItem.dir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator);
                        if (tanims.length == 0) break;
                        switch (this.hover[2]) {
                            case TanimListButtonType.main:
                                if (
                                    mouseState == MouseState.leftDown && 
                                    hoverItem.type == TanimItemType.folderFolded
                                ) {
                                    // 开始拖动文件夹
                                    this.mouseDragType = MouseDragType.tanimTreeItem;
                                    this.mouseDragIndex = this.hover[1];
                                } else if (mouseState == MouseState.dblclick) {
                                    // 双击文件夹，覆盖现有图层
                                    this.layers.length = 0;
                                    this.addToLayer(hoverItem);
                                }
                                break;
                            case TanimListButtonType.setLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 将文件夹覆盖现有图层
                                    this.layers.length = 0;
                                    this.addToLayer(hoverItem);
                                }
                                break;
                            case TanimListButtonType.addLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 将文件夹添加到图层
                                    this.addToLayer(hoverItem);
                                }
                                break;
                            case TanimListButtonType.new:
                                if (mouseState == MouseState.leftUp) {
                                    // 在文件夹中创建新动画
                                    if (this.askAndCreateNewTanimInFolder(hoverItem.dir)) return true;
                                }
                                break;
                            case TanimListButtonType.rename:
                                if (mouseState == MouseState.leftUp) {
                                    // 重命名文件夹
                                    this.askAndRenameFolder(tanims, hoverItem.dir);
                                }
                                break;
                            case TanimListButtonType.foldDown:
                            case TanimListButtonType.foldUp:
                                if (mouseState == MouseState.leftUp) {
                                    this.foldedTanimFolders.add(hoverItem.dir.join(EdConst.tanimFolderSeparator));
                                    this.updateTanimTree();
                                    this.updateLayerTree();
                                }
                                break;
                            case TanimListButtonType.foldLeft:
                                if (mouseState == MouseState.leftUp) {
                                    this.foldedTanimFolders.delete(hoverItem.dir.join(EdConst.tanimFolderSeparator));
                                    this.updateTanimTree();
                                    this.updateLayerTree();
                                }
                                break;
                        }
                        break;
                }
            }
        } else if (this.hover[0] == "layerList") {
            if (typeof this.hover[1] == "number" && this.hover[1] < this.layerTree.length) {
                // 鼠标位于图层列表中的一个节点上
                let hoverItem = this.layerTree[this.hover[1]];
                switch (hoverItem.type) {
                    case TanimItemType.tanim:
                        if (!hoverItem.tanim) break;
                        switch (this.hover[2]) {
                            case TanimListButtonType.main:
                                if (mouseState == MouseState.leftDown) {
                                    // 开始拖动图层
                                    this.mouseDragType = MouseDragType.layerTreeItem;
                                    this.mouseDragIndex = this.hover[1];
                                } else if (mouseState == MouseState.leftUp) {
                                    //选中图层
                                    this.editTanim(hoverItem.tanim);
                                }
                                break;
                            case TanimListButtonType.removeLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 移除一个图层
                                    let idx = this.layers.indexOf(hoverItem.tanim)
                                    if (idx == -1) break;
                                    this.removeLayer(idx);
                                }
                                break;
                        }
                        break;
                    case TanimItemType.folderBegin:
                    case TanimItemType.folderEnd:
                    case TanimItemType.folderFolded:
                        let tanims = this.layers.filter(tanim => tanim.name.startsWith(hoverItem.dir.join(EdConst.tanimFolderSeparator)));
                        if (tanims.length == 0) break;
                        switch (this.hover[2]) {
                            case TanimListButtonType.main:
                                if (
                                    mouseState == MouseState.leftDown && 
                                    hoverItem.type == TanimItemType.folderFolded
                                ) {
                                    // 开始拖动文件夹
                                    this.mouseDragType = MouseDragType.layerTreeItem;
                                    this.mouseDragIndex = this.hover[1];
                                }
                                break;
                            case TanimListButtonType.removeLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 将文件夹中的所有动画移出图层
                                    for (let tanim of tanims) {
                                        let idx = this.layers.indexOf(tanim)
                                        if (idx == -1) continue;
                                        this.removeLayer(idx, false);
                                    }
                                    this.updateLayerTree();
                                }
                                break;
                            case TanimListButtonType.foldDown:
                            case TanimListButtonType.foldUp:
                                if (mouseState == MouseState.leftUp) {
                                    this.foldedLayerFolders.add(hoverItem.dir.join(EdConst.tanimFolderSeparator));
                                    this.updateTanimTree();
                                    this.updateLayerTree();
                                }
                                break;
                            case TanimListButtonType.foldLeft:
                                if (mouseState == MouseState.leftUp) {
                                    this.foldedLayerFolders.delete(hoverItem.dir.join(EdConst.tanimFolderSeparator));
                                    this.updateTanimTree();
                                    this.updateLayerTree();
                                }
                                break;
                        }
                        break;
                }
            }
        } else if (this.hover[0] == "keyframeBar") {
            if (this.hover[1] === undefined) return;
            let tanim = this.tanim;
            if (!tanim) return;
            if (this.selectedKeyframes.size !== 1) return;
            let [keyframe] = this.selectedKeyframes;
            let timeline = this.timelines[0]?.keyframes.includes(keyframe) ? this.timelines[0] : this.timelines[1]?.keyframes.includes(keyframe) ? this.timelines[1] : null;
            if (!timeline) return;
            let editor = this; // 我怕 this 指向出错。。干脆就这么写得了
            let kuiType = this.hover[1];
            let keyframeIndex = timeline.keyframes.indexOf(keyframe);
            if (keyframeIndex == -1) return;
            switch (kuiType) {
                case KUIType.timeSec:
                case KUIType.timeFrame:
                    let editTimeQuestion = getTranslate(kuiType == KUIType.timeSec ? Strings.eInputKeyframeSecQuestion : Strings.eInputKeyframeFrameQuestion);
                    let editTimeFPS = kuiType == KUIType.timeSec ? tanim.fps : 1;
                    if (mouseState == MouseState.leftUp) {
                        if (this.ask(editTimeQuestion, `${keyframe.x / editTimeFPS}`, answer => {
                            if (!answer) return;
                            let num = parseFloat(answer);
                            if (Number.isNaN(num)) return;
                            let frame = round(num * editTimeFPS);
                            if (frame === keyframe.x * editTimeFPS) return;

                            let newKeyframe = keyframe.getCopy();
                            newKeyframe.x = frame;
                            editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                        })) return true;
                    }
                    break;
                case KUIType.tValue:
                    // 去他妈的DRY
                    if (mouseState == MouseState.leftUp) {
                        if (this.ask(getTranslate(Strings.eInputKeyframeTValueQuestion), `${keyframe.y}`, answer => {
                            if (!answer) return;
                            let num = parseFloat(answer);
                            let tValue = Number.isNaN(num) ? answer : num;
                            let newKeyframe = keyframe.getCopy();
                            newKeyframe.y = tValue;
                            editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                        })) return true;
                    }
                    break;
                case KUIType.interType:
                    if (mouseState == MouseState.leftUp) {
                        this.kuiState = this.kuiState == KUIState.params ? KUIState.interType : KUIState.params;
                        this.updateKuis();
                    }
                    break;
                case KUIType.interTypeListItem:
                    if (mouseState == MouseState.leftUp) {
                        this.kuiState = KUIState.params;
                        let interType = this.hover[2] as InterType;
                        let newKeyframe = new Keyframe(keyframe.x, keyframe.y, interType);
                        this.commandStack.PushAndDo(new EditAKeyframeCommand(this, timeline, keyframe, newKeyframe));
                    }
                    break;
                case KUIType.paramInput:
                    let paramType = this.hover[2] as EaseParamType;
                    if (mouseState == MouseState.leftUp) {
                        // @ts-ignore
                        if (this.ask(getTranslate(InputEaseParamQuestionStrings[paramType]), `${keyframe.getParam(paramType)}`, answer => {
                            if (!answer) return;
                            let paramValue = parseFloat(answer);
                            if (Number.isNaN(paramValue)) return; // 所有可输入的参数都是数字，所以这里姑且这么写
                            switch (paramType) {
                                case "powerN":
                                case "backS":
                                    // 大于等于 0 的参数
                                    paramValue = max(paramValue, 0);
                                    break;
                                case "expN":
                                case "elasticM":
                                case "elasticN":
                                case "tradExpP":
                                    // 大于 0 的参数
                                    paramValue = max(paramValue, 0.0001);
                                    break;
                                case "tradExpV":
                                    // 大于等于 1 的参数
                                    paramValue = max(paramValue, 1);
                                    break;
                            }
                            let newKeyframe = keyframe.getCopy();
                            newKeyframe.setParam(paramType, paramValue);
                            editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                        })) return true;
                    }
                    break;
                case KUIType.tradExpVM:
                    let tradExpVM = (1 / (keyframe.getParam("tradExpV") as number));
                    if (mouseState == MouseState.leftUp) {
                        if (this.ask(getTranslate(Strings.eInputTradExpVMQuestion), `${tradExpVM}`, answer => {
                            if (!answer) return;
                            let tradExpVM = parseFloat(answer);
                            if (Number.isNaN(tradExpVM)) return;
                            let tradExpV = 1 / clamp(tradExpVM, 0.0001, 1);
                            let newKeyframe = keyframe.getCopy();
                            newKeyframe.setParam("tradExpV", tradExpV);
                            editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                        })) return true;
                    }
                    break;
                case KUIType.LagrangeCXSec:
                    if (mouseState == MouseState.leftUp) {
                        if (this.ask(getTranslate(Strings.eInputLagrangeCXSecQuestion), `${keyframe.x / tanim.fps}`, answer => {
                            if (!answer) return;
                            let num = parseFloat(answer);
                            if (Number.isNaN(num)) return;
                            let lagrangeCX = num * tanim.fps;
                            let newKeyframe = keyframe.getCopy();
                            newKeyframe.setParam("lagrangeCX", lagrangeCX);
                            editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                        })) return true;
                    }
                    break;
                case KUIType.paramRadio:
                    let paramRadioType = this.hover[2] as EaseParamType;
                    let paramRadioValue = this.hover[3] as EaseParamValue;
                    if (mouseState == MouseState.leftUp) {
                        let newKeyframe = keyframe.getCopy();
                        newKeyframe.setParam(paramRadioType, paramRadioValue);
                        editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                    }
                    break;
            }
        } else if (this.hover[0] == "controlBar") {
            if (this.hover[1] === undefined) return;
            switch (this.hover[1]) {
                case CUIType.play:
                    break;
                case CUIType.gotoLeftFrame:
                    if (mouseState == MouseState.leftDown) {
                        this.focus(this.focusTime - 1);
                    }
                    break;
                case CUIType.gotoRightFrame:
                    if (mouseState == MouseState.leftDown) {
                        this.focus(this.focusTime + 1);
                    }
                    break;
                case CUIType.gotoLeftKeyframe:
                    if (mouseState == MouseState.leftDown) {
                        let leftKeyframe = this.getLeftKeyframe()[0];
                        if (!leftKeyframe) break;
                        this.focus(leftKeyframe.x);
                    }
                    break;
                case CUIType.gotoRightKeyframe:
                    if (mouseState == MouseState.leftDown) {
                        let rightKeyframe = this.getRightKeyframe()[0];
                        if (!rightKeyframe) break;
                        this.focus(rightKeyframe.x);
                    }
                    break;
                case CUIType.gotoLeftMost:
                    if (mouseState == MouseState.leftDown) {
                        if (!this.tanim) break;
                        this.focus(0);
                    }
                    break;
                case CUIType.gotoRightMost:
                    if (mouseState == MouseState.leftDown) {
                        if (!this.tanim) break;
                        this.focus(this.tanim.length);
                    }
                    break;
                case CUIType.loop:
                    if (mouseState == MouseState.leftDown) {
                        this.isLoop = !this.isLoop;
                    }
                    break;
                case CUIType.yoyo:
                    if (mouseState == MouseState.leftDown) {
                        this.isYoyo = !this.isYoyo;
                    }
                    break;
                case CUIType.mainAxis:
                    if (mouseState == MouseState.leftDown) {
                        if (this.timelines[1]) {
                            this.mainAxis = this.mainAxis == 0 ? 1 : 0;
                        }
                    }
                    break;
                case CUIType.showHandle:
                    if (mouseState == MouseState.leftDown) {
                        this.isShowHandle = !this.isShowHandle;
                    }
                    break;
                case CUIType.newKeyframe:
                    if (mouseState == MouseState.leftDown) {
                        if (!this.tanim) break;
                        let timeline = this.getNewKeyframeTimeline();
                        if (!timeline) break;
                        let leftKeyframe = timeline.findLeftKeyframe(this.focusTime);
                        let keyframe = new Keyframe(this.focusTime, timeline.getTValueByFrame(this.focusTime), leftKeyframe?.interType ?? InterType.linear);
                        this.commandStack.PushAndDo(new AddKeyframesCommand(this, this.tanim, new TKPair(timeline, keyframe)));
                    }
                    break;
                case CUIType.deleteKeyframe:
                    if (mouseState == MouseState.leftDown) {
                        let pairs = this.getDeletePairs();
                        if (!pairs) break;
                        this.commandStack.PushAndDo(new RemoveKeyframesCommand(this, ...pairs));
                    }
                    break;
                case CUIType.mark:
                    if (!this.tanim) return;
                    if (mouseState == MouseState.leftDown) {
                        if (this.marks[this.focusTime]) {
                            if (this.confirm(getTranslate(Strings.eDeleteMarkQuestion).replace("[markName]", this.marks[this.focusTime]))) {
                                delete this.marks[this.focusTime];
                                saveData();
                            }
                        } else {
                            if (this.ask(getTranslate(Strings.eNewMarkQuestion), null, answer => {
                                if (answer) {
                                    this.marks[this.focusTime] = answer;
                                    saveData();
                                }
                            })) return true;
                        }
                    }
                    break;
            }
        } else if (this.hover[0] == "timeline") {
            if (!this.tanim) return;
            // 缩放幅度
            let dScale = event?.altKey ? 4 : 1;
            // 卷动幅度
            let dScroll = 40;
            if (event?.ctrlKey) dScroll *= 0.25;
            if (event?.altKey) dScroll *= 4;
            // 中键移动
            if (mouseState == MouseState.middleDown) {
                this.mouseDragType = MouseDragType.timelineScroll;
                this.mouseDragX = this.mouseX;
                this.mouseDragY = this.mouseY;
                return;
            }
            switch (this.hover[1]) {
                case "main":
                    // 时间轴主面板！！！
                    if (this.hover[2] == "tValueCurve" && this.timelines[this.hover[3] as 0 | 1]) {
                        // 悬停在动画曲线的空白处
                        if (mouseState == MouseState.leftDown) {
                            let timeline = this.timelines[this.hover[3] as 0 | 1] as Timeline;
                            let time = round(this.mouseTimelineX);
                            let leftKeyframe = timeline.findLeftKeyframe(this.focusTime);
                            let keyframe = new Keyframe(time, timeline.getTValueByFrame(time), leftKeyframe?.interType ?? InterType.linear);
                            this.commandStack.PushAndDo(new AddKeyframesCommand(this, this.tanim, new TKPair(timeline, keyframe)));
                            // 在创建关键帧的同时，自动选中新建的关键帧
                            if (event?.shiftKey) {
                                this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.selectedKeyframes, keyframe));
                            } else {
                                this.commandStack.PushAndDo(new SelectKeyframesCommand(this, keyframe));
                            }
                            // 创建关键帧的同时，允许直接拖动它
                            this.mouseDragType = MouseDragType.moveKeyframe;
                            this.mouseDragX = this.mouseTimelineX;
                            this.mouseDragY = this.mouseTimelineY;
                            this.commandStack.PushAndDo(new MoveKeyframesCommand(this, 0, 0, ...toTKPairs(this.timelines, ...this.selectedKeyframes)));
                        }
                        break;
                    }
                    if (this.hover[2] == "keyframe" && this.hoveredKeyframes.size == 1) {
                        // 悬停在一个关键帧上
                        if (mouseState == MouseState.leftDown) {
                            let [hoveredKeyframe] = this.hoveredKeyframes;
                            if (this.selectedKeyframes.has(hoveredKeyframe)) {
                                // 点击了一个已经选中的关键帧
                                if (event?.shiftKey) {
                                    // 按住 shift 点击一个已经选中的关键帧，则为减选
                                    let newSelect = new Set(this.selectedKeyframes);
                                    newSelect.delete(hoveredKeyframe);
                                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...newSelect));
                                }
                            } else {
                                // 点击了一个没有选中的关键帧，则选中这一个关键帧
                                if (!event?.shiftKey) {
                                    // 如果没按 shift 直接选，那就只选这一个
                                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this, hoveredKeyframe));
                                } else {
                                    // 如果是按着 shift 选的，就增加到已选择的关键帧中
                                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.selectedKeyframes, hoveredKeyframe));
                                }
                            }
                            this.mouseDragType = MouseDragType.moveKeyframe;
                            this.mouseDragX = this.mouseTimelineX;
                            this.mouseDragY = this.mouseTimelineY;
                            this.commandStack.PushAndDo(new MoveKeyframesCommand(this, 0, 0, ...toTKPairs(this.timelines, ...this.selectedKeyframes)));
                            break;
                        }
                    }
                    if (this.hover[2] === undefined) {
                        if (mouseState == MouseState.leftDown) {
                            // 点击空白处
                            if (!event?.shiftKey) {
                                this.commandStack.PushAndDo(new SelectKeyframesCommand(this));
                            }
                            this.mouseDragType = MouseDragType.boxSelectKeyframe;
                            this.mouseDragX = this.mouseTimelineX;
                            this.mouseDragY = this.mouseTimelineY;
                        }
                    }
                    break;
                case "mark":
                case "ruler":
                    if (this.hover[2] == "endTime") {
                        this.cursor = "ew-resize";
                        if (mouseState == MouseState.leftDown) {
                            this.mouseDragType = MouseDragType.endTime;
                        }
                    } else {
                        if (mouseState == MouseState.leftDown) {
                            this.focus(this.mouseTimelineX);
                        }
                    }
                    break;
                case "sideRuler":
                    break;
                case "scrollLeft":
                case "scrollRight":
                    if (mouseState == MouseState.leftDown) {
                        // 滚动条左右的滚动按钮
                        this.scrollTimeline((this.hover[1] == "scrollRight" ? 1 : -1) * dScroll / this.timelineScaleX, 0);
                        break;
                    }
                case "scrollX":
                    if (mouseState == MouseState.leftDown) {
                        // 点击滚动条
                        let length = this.tanim.length;
                        let blockStart = this.canvasTotimelinePosition(this.leftBarWidth, 0)[0];
                        let blockEnd = this.canvasTotimelinePosition(this.canvasWidth - this.rightBarWidth, 0)[0];
                        let mouseTime = this.scrollXToTime(this.mouseX, 0, length);
                        if (mouseTime < blockStart) this.scrollTimeline(mouseTime - blockStart, 0);
                        if (blockEnd < mouseTime) this.scrollTimeline(mouseTime - blockEnd, 0);
                        this.mouseDragType = MouseDragType.timelineScrollX;
                        this.mouseDragX = this.mouseX;
                        break;
                    }
            }
        }
    }

    /** 执行一个鼠标滚轮行为 */
    doWheel(wheel: number, event: MouseEvent | WheelEvent | KeyboardEvent | null = null): true | void {
        if (this.hover[0] == "tanimScroll") {
            if (wheel < 0) {
                this.scrollTanimList(-5);
            }
            if (wheel > 0) {
                this.scrollTanimList(5);
            }
        } else if (this.hover[0] == "tanimList") {
            if (wheel < 0) {
                this.scrollTanimList(-2);
            }
            if (wheel > 0) {
                this.scrollTanimList(2);
            }
        } else if (this.hover[0] == "layerScroll") {
            if (wheel < 0) {
                this.scrollLayerList(-5);
            }
            if (wheel > 0) {
                this.scrollLayerList(5);
            }
        } else if (this.hover[0] == "layerList") {
            if (wheel < 0) {
                this.scrollLayerList(-2);
            }
            if (wheel > 0) {
                this.scrollLayerList(2);
            }
        } else if (this.hover[0] == "timeline") {
            if (!this.tanim) return;
            // 缩放幅度
            let dScale = event?.altKey ? 4 : 1;
            // 卷动幅度
            let dScroll = 40;
            if (event?.ctrlKey) dScroll *= 0.25;
            if (event?.altKey) dScroll *= 4;
            let isScrolledOrScaled = false;
            switch (this.hover[1]) {
                case "main":
                    // 时间轴主面板！！！
                    if (wheel != 0) {
                        if (event?.shiftKey) {
                            // shift + 滚轮，横向滚动
                            this.scrollTimeline(sign(wheel) * dScroll / this.timelineScaleX, 0);
                            isScrolledOrScaled = true;
                        } else {
                            // 直接滚轮，纵向滚动
                            this.scrollTimeline(0, -sign(wheel) * dScroll / this.timelineScaleY);
                            isScrolledOrScaled = true;
                        }
                    }
                    break;
                case "mark":
                case "ruler":
                    if (wheel < 0) {
                        // 向上滚动，放大
                        this.scaleTimelineX(dScale);
                        isScrolledOrScaled = true;
                    }
                    if (wheel > 0) {
                        // 向下滚动，缩小
                        this.scaleTimelineX(-dScale);
                        isScrolledOrScaled = true;
                    }
                    break;
                case "sideRuler":
                    if (wheel < 0) {
                        // 向上滚动，放大
                        this.scaleTimelineY(dScale);
                        isScrolledOrScaled = true;
                    }
                    if (wheel > 0) {
                        // 向下滚动，缩小
                        this.scaleTimelineY(-dScale);
                        isScrolledOrScaled = true;
                    }
                    break;
                case "scrollX":
                    if (wheel != 0) {
                        this.scrollTimeline(sign(wheel) * dScroll / this.timelineScaleX, 0);
                        isScrolledOrScaled = true;
                        break;
                    }
            }
            if (isScrolledOrScaled) {
                this.updateMouseTimelinePosition();
                this.updateHoverAndCursor(event);
            }
        }
    }



    getLeftKeyframe(): [Keyframe | null, Timeline | null] {
        let f = this.timelines.map(timeline => timeline?.findLeftKeyframe(this.focusTime, false))
        if (f[0] && f[1]) {
            if (f[0].x == f[1].x) return [f[this.mainAxis] as Keyframe, this.timelines[this.mainAxis]];
            return f[0].x > f[1].x ? [f[0], this.timelines[0]] : [f[1], this.timelines[1]];
        } else {
            return f[0] ? [f[0], this.timelines[0]] : f[1] ? [f[1], this.timelines[1]] : [null, null];
        }
    }

    getRightKeyframe(): [Keyframe | null, Timeline | null] {
        let f = this.timelines.map(timeline => timeline?.findRightKeyframe(this.focusTime, false))
        if (f[0] && f[1]) {
            if (f[0].x == f[1].x) return [f[this.mainAxis] as Keyframe, this.timelines[this.mainAxis]];
            return f[0].x < f[1].x ? [f[0], this.timelines[0]] : [f[1], this.timelines[1]];
        } else {
            return f[0] ? [f[0], this.timelines[0]] : f[1] ? [f[1], this.timelines[1]] : [null, null];
        }
    }

    /** 当且仅当没有可以新建的关键帧时，返回 null */
    getNewKeyframeTimeline(): Timeline | null {
        // @ts-ignore 傻逼ts
        if (this.timelines[this.mainAxis] && !this.timelines[this.mainAxis].findKeyframeByTime(this.focusTime)) {
            return this.timelines[this.mainAxis];
        // @ts-ignore 傻逼ts！！！
        } else if (this.timelines[this.subAxis] && !this.timelines[this.subAxis].findKeyframeByTime(this.focusTime)) {
            return this.timelines[this.subAxis];
        } else return null;
    }

    /** 当且仅当没有可以删除的关键帧时，返回 null */
    getDeletePairs(): TKPair[] | null {
        if (this.selectedKeyframes.size == 0) {
            if (this.timelines[this.mainAxis]) {
                // @ts-ignore 傻逼ts
                let keyframe = this.timelines[this.mainAxis].findKeyframeByTime(this.focusTime);
                if (keyframe) return toTKPairs(this.timelines, keyframe);
            }
            if (this.timelines[this.subAxis]) {
                // @ts-ignore 傻逼ts！！！
                let keyframe = this.timelines[this.subAxis].findKeyframeByTime(this.focusTime);
                if (keyframe) return toTKPairs(this.timelines, keyframe);
            }
            return null;
        } else {
            return toTKPairs(this.timelines, ...this.selectedKeyframes);
        }
    }



    update(events: { mouseEvent?: MouseEvent, wheelEvent?: WheelEvent, keyboardEvent?: KeyboardEvent } | null) {
        if (this.isInputing) return;
        if (!this.isShow) return;

        // 这里把几个参数分开。。。其实是想在类型推断上省事。。。
        let { mouseEvent, wheelEvent, keyboardEvent } = events ?? {};
        if (mouseEvent) {
            this.mouseClientX = mouseEvent.clientX;
            this.mouseClientY = mouseEvent.clientY;
        }
        let event = mouseEvent ?? wheelEvent ?? keyboardEvent;

        /*
        if (!this.isMinimized) {
            this.updateTanimTree();
            this.updateLayerTree();
            this.updateCuis();
        }
        */
        let ctx = this.ctx;
        if (this.isMinimized) {
            this.canvasWidth = EdConst.headerWidth;
            this.canvasHeight = EdConst.headerHeight;
        } else {
            this.canvasWidth = this.width;
            this.canvasHeight = this.height;
        }

        // 处理鼠标信息
        let mouseState: MouseState = MouseState.move;
        if (mouseEvent) {
            switch (mouseEvent.type) {
                case "mousemove":
                    mouseState = MouseState.move;
                    break;
                case "mousedown":
                    switch (mouseEvent.button) {
                        case 0: 
                            mouseState = MouseState.leftDown;
                            break;
                        case 1:
                            mouseState = MouseState.middleDown;
                            break;
                        case 2:
                            mouseState = MouseState.rightDown;
                            break;
                    }
                    if (this.mouseDragType == MouseDragType.none && mouseState != MouseState.move) {
                        this.mouseDragClientX = this.mouseClientX;
                        this.mouseDragClientY = this.mouseClientY;
                    }
                    break;
                case "mouseup":
                    switch (mouseEvent.button) {
                        case 0:
                            mouseState = MouseState.leftUp;
                            break;
                        case 1:
                            mouseState = MouseState.middleUp;
                            break;
                        case 2:
                            mouseState = MouseState.rightUp;
                            break;
                    }
                    break;
                case "dblclick":
                    mouseState = MouseState.dblclick;
                    break;
                default:
                    mouseState = MouseState.move;
                    break;
            }
        }

        this.updateMousePosition();

        let wheel = 0;
        if (wheelEvent) {
            wheel = wheelEvent.deltaY;
        }

        let lastCursor = this.cursor;
        this.updateHoverAndCursor(event);
        this.doWheel(wheel, event);
        // 鼠标行为
        if (this.mouseDragType == MouseDragType.none) {
            if (this.doMouse(mouseState, event)) return;
        }
        // 处理拖动
        // 拖动期间的光标样式
        if (this.mouseDragType !== MouseDragType.none) switch (this.mouseDragType) {
            case MouseDragType.move:
            case MouseDragType.timelineScroll:
                this.cursor = "move";
                break;
            case MouseDragType.width:
            case MouseDragType.leftBarWidth:
            case MouseDragType.rightBarWidth:
                this.cursor = "ew-resize";
                break;
            case MouseDragType.height:
            case MouseDragType.timelineBarHeight:
            case MouseDragType.layerBarHeight:
                this.cursor = "ns-resize";
                break;
            case MouseDragType.size:
                this.cursor = "nwse-resize";
                break;
            case MouseDragType.tanimTreeItem:
            case MouseDragType.layerTreeItem:
                if (this.hover[0] == "tanimList" || this.hover[0] == "layerList") {
                    this.cursor = "grabbing";
                } else {
                    this.cursor = "no-drop";
                }
                break;
            case MouseDragType.moveKeyframe:
                this.cursor = "none";
                break;
            default:
                this.cursor = "default";
                break;
        }
        if (this.mouseDragType == MouseDragType.tanimTreeItem || this.mouseDragType == MouseDragType.layerTreeItem) {
            mouseEvent?.preventDefault();
        } else if (this.mouseDragType == MouseDragType.move) {
            mouseEvent?.preventDefault();
            this.left = clamp(this.mouseDragLeft + this.mouseClientX - this.mouseDragClientX, 5, window.innerWidth - this.canvasWidth - 5);
            this.top = clamp(this.mouseDragTop + this.mouseClientY - this.mouseDragClientY, isGandi ? 65 : 53, window.innerHeight - this.canvasHeight - 5);
            this.setPosition();
            saveData();
        } else if (this.mouseDragType == MouseDragType.leftBarWidth) {
            mouseEvent?.preventDefault();
            this.leftBarWidth = clamp(
                this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX,
                EdConst.leftBarWidthMin,
                this.canvasWidth - EdConst.previewWidthMin - EdConst.rightBarWidthMin
            );
            let d = (this.leftBarWidth + this.rightBarWidth + EdConst.previewWidthMin) - this.canvasWidth;
            if (d > 0) {
                this.rightBarWidth -= d;
            }
            this.updateCuis();
            this.updateKuis();
            saveData();
        } else if (this.mouseDragType == MouseDragType.rightBarWidth) {
            mouseEvent?.preventDefault();
            this.rightBarWidth = clamp(
                this.mouseDragWidth + this.mouseDragClientX - this.mouseClientX,
                EdConst.rightBarWidthMin,
                this.canvasWidth - EdConst.previewWidthMin - EdConst.leftBarWidthMin
            );
            let d = (this.leftBarWidth + this.rightBarWidth + EdConst.previewWidthMin) - this.canvasWidth;
            if (d > 0) {
                this.leftBarWidth -= d;
            }
            this.updateCuis();
            this.updateKuis();
            saveData();
        } else if (this.mouseDragType == MouseDragType.timelineBarHeight) {
            mouseEvent?.preventDefault();
            this.timelineBarHeight = clamp(
                this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY,
                EdConst.timelineBarHeightMin,
                this.canvasHeight - EdConst.hintBarHeight - EdConst.controlBarHeight - EdConst.previewHeightMin - EdConst.headerHeight
            );
            this.updateCuis();
            saveData();
        } else if (this.mouseDragType == MouseDragType.layerBarHeight) {
            mouseEvent?.preventDefault();
            this.layerBarHeight = clamp(
                this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY,
                EdConst.layerBarHeightMin,
                this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - EdConst.tanimListHeightMin - EdConst.headerHeight
            );
            saveData();
        } else if (this.mouseDragType == MouseDragType.timelineScroll) {
            mouseEvent?.preventDefault();
            this.scrollTimeline((this.mouseDragX - this.mouseX) / this.timelineScaleX, -(this.mouseDragY - this.mouseY) / this.timelineScaleY);
            this.mouseDragX = this.mouseX;
            this.mouseDragY = this.mouseY;
        } else if (this.mouseDragType == MouseDragType.timelineScrollX) {
            mouseEvent?.preventDefault();
            if (this.tanim) {
                let fromTime = this.scrollXToTime(this.mouseDragX, 0, this.tanim.length);
                let toTime = this.scrollXToTime(this.mouseX, 0, this.tanim.length);
                this.scrollTimeline(toTime - fromTime, 0);
            }
            this.mouseDragX = this.mouseX;
        } else if (this.mouseDragType == MouseDragType.moveKeyframe) {
            mouseEvent?.preventDefault();
            if (this.tanim) {
                let command = this.commandStack.top;
                if (!(command instanceof MoveKeyframesCommand)) {
                    this.commandStack.PushAndDo(new MoveKeyframesCommand(this, 0, 0, ...toTKPairs(this.timelines, ...this.selectedKeyframes)));
                    command = this.commandStack.top;
                }
                if (command instanceof MoveKeyframesCommand) {
                    let [x, y] = this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY);
                    let dx: number, dy: number;
                    let cdx = this.mouseX - x;
                    let cdy = this.mouseY - y;
                    let snapRange = 5;
                    if (false) {
                        // 拖动效果：粘滞，拖出一段距离之后才会从原位置开始移动
                        dx = abs(cdx) <= snapRange ? 0 : this.canvasTotimelinePosition(this.mouseX - sign(cdx) * snapRange, 0)[0] - this.mouseDragX;
                        dy = abs(cdy) <= snapRange ? 0 : this.canvasTotimelinePosition(0, this.mouseY - sign(cdy) * snapRange)[1] - this.mouseDragY;
                    } else if (false) {
                        // 拖动效果：无
                        dx = this.mouseTimelineX - this.mouseDragX;
                        dy = this.mouseTimelineY - this.mouseDragY;
                    } else {
                        // 拖动效果：吸附，如果拖动距离较小，则吸附到原位置
                        dx = abs(cdx) <= snapRange ? 0 : this.mouseTimelineX - this.mouseDragX;
                        dy = abs(cdy) <= snapRange ? 0 : this.mouseTimelineY - this.mouseDragY;
                    }
                    command.updateMotion(dx, dy);
                }
            }
        } else if (this.mouseDragType == MouseDragType.boxSelectKeyframe) {
            mouseEvent?.preventDefault();
            this.hoveredKeyframes.clear();
            let boxKeyframes = this.getBoxSelectKeyframes(...this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY), this.mouseX, this.mouseY);
            boxKeyframes.forEach(keyframe => this.hoveredKeyframes.add(keyframe));
        } else if (this.mouseDragType == MouseDragType.endTime) {
            mouseEvent?.preventDefault();
            if (this.tanim) {
                this.tanim.length = max(round(this.mouseTimelineX), 1);
                saveData();
            }
        } else { // 拉伸窗口
            let resized = false;
            if (this.mouseDragType == MouseDragType.width || this.mouseDragType == MouseDragType.size) {
                mouseEvent?.preventDefault();
                this.width = clamp(
                    this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX,
                    EdConst.leftBarWidthMin + EdConst.previewWidthMin + EdConst.rightBarWidthMin,
                    window.innerWidth - this.left - 5
                );
                let d = (this.leftBarWidth + this.rightBarWidth + EdConst.previewWidthMin) - this.canvasWidth;
                if (d > 0) {
                    let sl = this.leftBarWidth - EdConst.leftBarWidthMin;
                    let sr = this.rightBarWidth - EdConst.rightBarWidthMin;
                    if (sl >= d) {
                        this.leftBarWidth -= d;
                    } else {
                        this.leftBarWidth = EdConst.leftBarWidthMin;
                        this.rightBarWidth -= d - sl;
                    }
                }
                resized = true;
            }
            if (this.mouseDragType == MouseDragType.height || this.mouseDragType == MouseDragType.size) {
                mouseEvent?.preventDefault();
                this.height = clamp(
                    this.mouseDragHeight + this.mouseClientY - this.mouseDragClientY,
                    EdConst.headerHeight + max(
                        EdConst.previewHeightMin + EdConst.controlBarHeight + EdConst.timelineBarHeightMin,
                        EdConst.keyframeBarHeight + EdConst.layerBarHeightMin + EdConst.tanimListHeightMin
                    ) + EdConst.hintBarHeight,
                    window.innerHeight - this.top - 5
                );
                let d = (EdConst.headerHeight + EdConst.previewHeightMin + EdConst.controlBarHeight + this.timelineBarHeight + EdConst.hintBarHeight) - this.canvasHeight;
                if (d > 0) {
                    this.timelineBarHeight -= d;
                }
                    d = (EdConst.headerHeight + EdConst.keyframeBarHeight + this.layerBarHeight + EdConst.tanimListHeightMin + EdConst.hintBarHeight) - this.canvasHeight;
                if (d > 0) {
                    this.layerBarHeight -= d;
                }
                resized = true;
            }
            if (resized) {
                this.setCanvasSize();
                saveData();
            }
        }
        if (mouseState == MouseState.leftUp || mouseState == MouseState.rightUp || mouseState == MouseState.middleUp) {
            // 停止拖动
            if (this.mouseDragType == MouseDragType.tanimTreeItem) {
                // 扔下一个动画
                if (this.hover[0] == "tanimList" && typeof this.hover[1] == "number") {
                    this.dropTanimToTanims(this.mouseDragIndex, this.hover[1]);
                } else if (this.hover[0] == "layerList" && typeof this.hover[1] == "number") {
                    this.dropTanimToLayers(this.mouseDragIndex, this.hover[1]);
                }
            } else if (this.mouseDragType == MouseDragType.layerTreeItem) {
                // 扔下一个图层
                if (this.hover[0] == "layerList" && typeof this.hover[1] == "number") {
                    if (this.mouseDragIndex === this.hover[1] && this.layerTree[this.hover[1]].tanim) {
                        if (this.doMouse(mouseState, event)) return;
                    } else {
                        this.dropLayerToLayers(this.mouseDragIndex, this.hover[1]);
                    }
                }
            } else if (this.mouseDragType == MouseDragType.boxSelectKeyframe) {
                // 框选关键帧结束
                if (!event?.shiftKey) {
                    // 如果没按 shift 直接选，那就只选框里的
                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.hoveredKeyframes));
                } else {
                    // 如果是按着 shift 选的，就把框里的增加到已选择的关键帧中
                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.selectedKeyframes, ...this.hoveredKeyframes));
                }
            }
            this.mouseDragType = MouseDragType.none;
            this.updateHoverAndCursor(event);
        }
        this.timelines.forEach(timeline => timeline?.alignBezierHandleKeyframes());
        this.scrollTanimList(0);
        this.scrollLayerList(0);

        this.hint[0] = this.hover.join("-");

        // 更新画面
        if (this.mouseDragType != MouseDragType.move) {
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

            if (!this.isMinimized) {
                // 绘制时间轴
                this.drawTimelineBar(
                    this.leftBarWidth, 
                    this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight,
                    this.canvasWidth - this.rightBarWidth,
                    this.canvasHeight - EdConst.hintBarHeight
                );

                // 绘制控制栏
                this.drawControlBar(
                    this.leftBarWidth,
                    this.canvasHeight - this.timelineBarHeight - EdConst.hintBarHeight - EdConst.controlBarHeight,
                    this.canvasWidth - this.rightBarWidth,
                    this.canvasHeight - this.timelineBarHeight - EdConst.hintBarHeight,
                    this.mouseDragType == MouseDragType.none ? UIState.hover : UIState.none
                );

                // 绘制左栏
                this.drawLeftBar(0, EdConst.headerHeight, this.leftBarWidth, this.canvasHeight - EdConst.hintBarHeight);

                // 绘制右栏
                this.drawRightBar(
                    this.canvasWidth - this.rightBarWidth,
                    EdConst.headerHeight,
                    this.canvasWidth,
                    this.canvasHeight - EdConst.hintBarHeight
                );

                // 绘制动画列表
                this.drawTanimList(
                    "tanimList",
                    this.canvasWidth - this.rightBarWidth + 1,
                    EdConst.headerHeight,
                    this.canvasWidth,
                    this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight,
                    [MouseDragType.none, MouseDragType.tanimTreeItem].includes(this.mouseDragType) ? UIState.hover : UIState.none,
                    this.tanimListScroll
                );

                // 绘制新建动画按钮
                this.drawTanimListButton(
                    TanimListButtonType.new,
                    this.canvasWidth - EdConst.tanimListPaddingRight - EdConst.tanimListLineHeight / 2,
                    EdConst.headerHeight + EdConst.tanimListLineHeight / 2,
                    EdConst.tanimListLineHeight,
                    EdConst.tanimListLineHeight,
                    this.hover[0] == "newTanim" && this.mouseDragType == MouseDragType.none ? UIState.hover : UIState.none
                );

                // 绘制图层栏
                this.drawTanimList(
                    "layerList",
                    this.canvasWidth - this.rightBarWidth + 1,
                    this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight,
                    this.canvasWidth,
                    this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight,
                    [MouseDragType.none, MouseDragType.tanimTreeItem, MouseDragType.layerTreeItem].includes(this.mouseDragType) ? UIState.hover : UIState.none,
                    this.layerListScroll
                );

                // 绘制关键帧面板
                this.drawKeyframeBar(
                    this.canvasWidth - this.rightBarWidth + 1,
                    this.canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight,
                    this.canvasWidth,
                    this.canvasHeight - EdConst.hintBarHeight
                )

                // 绘制底部提示栏
                this.drawHintBar(this.canvasHeight, this.canvasWidth, EdConst.hintBarHeight);
            }
            // 绘制顶栏
            this.drawHeader(this.canvasWidth, EdConst.headerHeight);
            // 绘制右上角按钮
            this.drawClose(
                this.canvasWidth - EdConst.headerButtonWidth / 2, EdConst.headerHeight / 2, EdConst.headerButtonWidth, EdConst.headerHeight,
                this.hover[0] == "header" && this.hover[1] == "close" && this.mouseDragType == MouseDragType.none ? UIState.hover : UIState.none
            );
            this.drawMinimize(
                this.canvasWidth - EdConst.headerButtonWidth * 1.5, EdConst.headerHeight / 2, EdConst.headerButtonWidth, EdConst.headerHeight,
                this.hover[0] == "header" && this.hover[1] == "minimize" && this.mouseDragType == MouseDragType.none ? UIState.hover : UIState.none
            );
        }

        if (this.cursor != lastCursor) {
            this.root.style.cursor = this.cursor;
        }
    }


    
    drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
        // 谢谢 deepseek
        let ctx = this.ctx;
        ctx.beginPath();
        // 移动到左上角圆弧起点
        ctx.moveTo(x + radius, y);
        // 绘制顶边和右上圆角
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        // 绘制右边和右下圆角
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        // 绘制底边和左下圆角
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        // 绘制左边和左上圆角
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
    }

    /** 控制栏  
     * 锚点：左上, 右下 */
    drawControlBar(x1: number, y1: number, x2: number, y2: number, uiState: UIState) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #e6e6e6";
        ctx.fillRect(x1, y2, x2 - x1, y1 - y2);

        for (let cui of this.cuis) {
            this.drawCUI(x1, y1, x2, y2, cui, uiState);
        }

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        // 下边缘
        ctx.moveTo(
            x1,
            y2 - 0.5
        );
        ctx.lineTo(
            x2,
            y2 - 0.5
        );
        // 上边缘
        ctx.moveTo(
            x1,
            y1 - 0.5
        );
        ctx.lineTo(
            x2,
            y1 - 0.5
        );
        ctx.stroke();

        ctx.restore();
    }

    drawCUI(x1: number, y1: number, x2: number, y2: number, cui: CUI, uiState: UIState) {
        //if (!cui.isShow) return;
        let { type, align, pos, size } = cui;
        let x = (align == CUIAlign.left ? x1 : align == CUIAlign.right ? x2 : (x1 + x2) / 2) + pos;
        let y = (y1 + y2) / 2;
        let { w, h } = size;
        let radius = 4;

        let ctx = this.ctx;
        ctx.save();

        /** 填充色 */
        let c1 = " #666666";
        /** 背景色 */
        let c2 = " #e6e6e6";

        if (this.hover[0] == "controlBar" && this.hover[1] == type && uiState == UIState.hover/* || true/**/) {
            c2 = " #cccccc";
            ctx.fillStyle = c2;
            switch (align) {
                case CUIAlign.center:
                    this.drawRoundedRect(x - w / 2, y - h / 2, w, h, radius);
                    break;
                case CUIAlign.left:
                    this.drawRoundedRect(x, y - h / 2, w, h, radius);
                    break;
                case CUIAlign.right:
                    this.drawRoundedRect(x - w, y - h / 2, w, h, radius);
                    break;
            }
            ctx.fill();
        }

        ctx.fillStyle = c1;
        ctx.strokeStyle = c1;
        ctx.lineWidth = 3;
        ctx.beginPath();

        function doubleStroke() {
            ctx.strokeStyle = c2;
            ctx.lineWidth = 8;
            ctx.stroke();
            ctx.strokeStyle = c1;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        switch (type) {
            case CUIType.play:
                ctx.arc(x, y, 18, 0, 2 * PI);
                ctx.fillStyle = c1;
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + 14, y);
                ctx.lineTo(x - 7, y - 12.1); // 7 * √3
                ctx.lineTo(x - 7, y + 12.1);
                ctx.closePath();
                ctx.fillStyle = c2;
                ctx.fill();
                break;
            case CUIType.gotoLeftFrame:
                ctx.moveTo(x - 9 - 3, y);
                ctx.lineTo(x + 9 - 3, y - 10.3); // 6 * √3
                ctx.lineTo(x + 9 - 3, y + 10.3);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + 9 + 1, y - 10.3);
                ctx.lineTo(x + 9 + 1, y + 10.3);
                ctx.stroke();
                break;
            case CUIType.gotoRightFrame:
                ctx.moveTo(x + 9 + 3, y);
                ctx.lineTo(x - 9 + 3, y - 10.3);
                ctx.lineTo(x - 9 + 3, y + 10.3);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x - 9 - 1, y - 10.3);
                ctx.lineTo(x - 9 - 1, y + 10.3);
                ctx.stroke();
                break;
            case CUIType.gotoLeftKeyframe:
                ctx.moveTo(x - 9 + 3, y);
                ctx.lineTo(x + 9 + 3, y - 10.3);
                ctx.lineTo(x + 9 + 3, y + 10.3);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x - 9 - 1, y);
                ctx.lineTo(x - 9 - 1 + 6, y + 6);
                ctx.lineTo(x - 9 - 1 + 6 * 2, y);
                ctx.lineTo(x - 9 - 1 + 6, y - 6);
                ctx.closePath();
                let [, timeline] = this.getLeftKeyframe();
                ctx.fillStyle = timeline ? tValueTypeToHSL(timeline.tValueType, 70, 70) : c2
                ctx.fill();
                ctx.stroke();
                break;
            case CUIType.gotoRightKeyframe:
                ctx.moveTo(x + 9 - 3, y);
                ctx.lineTo(x - 9 - 3, y - 10.3);
                ctx.lineTo(x - 9 - 3, y + 10.3);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + 9 + 1, y);
                ctx.lineTo(x + 9 + 1 - 6, y + 6);
                ctx.lineTo(x + 9 + 1 - 6 * 2, y);
                ctx.lineTo(x + 9 + 1 - 6, y - 6);
                ctx.closePath();
                let [, timeline_] = this.getRightKeyframe(); // 傻逼ts说我不能重复声明timeline，操
                ctx.fillStyle = timeline_ ? tValueTypeToHSL(timeline_.tValueType, 70, 70) : c2
                ctx.fill();
                ctx.stroke();
                break;
            case CUIType.gotoLeftMost:
                ctx.moveTo(x - 9 + 3, y);
                ctx.lineTo(x + 9 + 3, y - 10.3);
                ctx.lineTo(x + 9 + 3, y + 10.3);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x - 9 + 3, y - 10.3);
                ctx.lineTo(x - 9 + 3, y + 10.3);
                ctx.strokeStyle = c2;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x - 9, y - 10.3);
                ctx.lineTo(x - 9, y + 10.3);
                ctx.moveTo(x - 9 + 5, y - 10.3);
                ctx.lineTo(x - 9 + 5, y + 10.3);
                ctx.strokeStyle = c1;
                ctx.stroke();
                break;
            case CUIType.gotoRightMost:
                ctx.moveTo(x + 9 - 3, y);
                ctx.lineTo(x - 9 - 3, y - 10.3);
                ctx.lineTo(x - 9 - 3, y + 10.3);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + 9 - 3, y - 10.3);
                ctx.lineTo(x + 9 - 3, y + 10.3);
                ctx.strokeStyle = c2;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + 9, y - 10.3);
                ctx.lineTo(x + 9, y + 10.3);
                ctx.moveTo(x + 9 - 5, y - 10.3);
                ctx.lineTo(x + 9 - 5, y + 10.3);
                ctx.strokeStyle = c1;
                ctx.stroke();
                break;
            case CUIType.loop:
                ctx.lineCap = "round";
                ctx.arc(x - 4, y, 6, 0.75 * PI, 1.5 * PI);
                ctx.lineTo(x + 4, y - 6);
                ctx.moveTo(x + 4 - 3, y - 6 - 3);
                ctx.lineTo(x + 4, y - 6);
                ctx.lineTo(x + 4 - 3, y - 6 + 3);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x + 4, y, 6, -0.25 * PI, 0.5 * PI);
                ctx.lineTo(x - 4, y + 6);
                ctx.moveTo(x - 4 + 3, y + 6 - 3);
                ctx.lineTo(x - 4, y + 6);
                ctx.lineTo(x - 4 + 3, y + 6 + 3);
                ctx.stroke();
                if (!this.isLoop) {
                    ctx.beginPath();
                    ctx.moveTo(x - 8, y - 8);
                    ctx.lineTo(x + 8, y + 8);
                    doubleStroke();
                }
                break;
            case CUIType.yoyo:
                ctx.lineCap = "round";
                ctx.arc(x + 7, y + 6, 3.5, 0, 2 * PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x, y + 7, 3.5, 0, 2 * PI);
                doubleStroke();
                ctx.beginPath();
                ctx.arc(x - 7, y + 6, 3.5, 0, 2 * PI);
                doubleStroke();
                ctx.fillStyle = c1;
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x, y - 10);
                ctx.lineTo(x - 7, y + 6);
                ctx.strokeStyle = c1;
                ctx.stroke();
                if (!this.isYoyo) {
                    ctx.beginPath();
                    ctx.moveTo(x - 8, y - 8);
                    ctx.lineTo(x + 8, y + 8);
                    doubleStroke();
                }
                break;
            case CUIType.deleteKeyframe:
            case CUIType.newKeyframe:
                ctx.lineCap = "round";
                ctx.moveTo(x - 7 - 2, y + 2);
                ctx.lineTo(x - 2, y - 7 + 2);
                ctx.lineTo(x + 7 - 2, y + 2);
                ctx.lineTo(x - 2, y + 7 + 2);
                ctx.closePath();
                let timeline__;
                if (type == CUIType.newKeyframe) {
                    timeline__ = this.getNewKeyframeTimeline();
                } else {
                    let pairs = this.getDeletePairs();
                    if (pairs?.length == 1) {
                        timeline__ = pairs[0].timeline;
                    }
                }
                ctx.fillStyle = timeline__ ? tValueTypeToHSL(timeline__.tValueType, 70, 70) : c2;
                ctx.fill();
                // 右上角加减号
                ctx.moveTo(x + 3, y - 6);
                ctx.lineTo(x + 9, y - 6);
                if (type == CUIType.newKeyframe) {
                    ctx.moveTo(x + 6, y - 3);
                    ctx.lineTo(x + 6, y - 9);
                }
                ctx.stroke();
                break;
            case CUIType.mainAxis:
                ctx.lineCap = "round";
                if (this.mainAxis == 0) {
                    // X
                    ctx.moveTo(x + 4, y - 9);
                    ctx.lineTo(x + 9, y - 4);
                    ctx.moveTo(x + 4, y - 4);
                    ctx.lineTo(x + 9, y - 9);
                    // 副轴
                    ctx.moveTo(x - 7, y + 10);
                    ctx.lineTo(x - 7, y - 9);
                    ctx.moveTo(x - 7 - 3, y - 9 + 3);
                    ctx.lineTo(x - 7, y - 9);
                    ctx.lineTo(x - 7 + 3, y - 9 + 3);
                    ctx.stroke();
                    // 主轴
                    ctx.beginPath();
                    ctx.moveTo(x - 8, y + 6);
                    ctx.lineTo(x + 7, y + 6);
                    ctx.moveTo(x + 7 - 3, y + 6 - 3);
                    ctx.lineTo(x + 7, y + 6);
                    ctx.lineTo(x + 7 - 3, y + 6 + 3);
                } else {
                    // Y
                    ctx.moveTo(x + 4, y - 9);
                    ctx.lineTo(x + 6.5, y - 6.5);
                    ctx.lineTo(x + 9, y - 9);
                    ctx.moveTo(x + 6.5, y - 6.5);
                    ctx.lineTo(x + 6.5, y - 3);
                    // 副轴
                    ctx.moveTo(x - 10, y + 7);
                    ctx.lineTo(x + 9, y + 7);
                    ctx.moveTo(x + 9 - 3, y + 7 - 3);
                    ctx.lineTo(x + 9, y + 7);
                    ctx.lineTo(x + 9 - 3, y + 7 + 3);
                    ctx.stroke();
                    // 主轴
                    ctx.beginPath();
                    ctx.moveTo(x - 6, y + 8);
                    ctx.lineTo(x - 6, y - 7);
                    ctx.moveTo(x - 6 - 3, y - 7 + 3);
                    ctx.lineTo(x - 6, y - 7);
                    ctx.lineTo(x - 6 + 3, y - 7 + 3);
                }
                ctx.lineWidth = 8;
                ctx.stroke();
                // 操你妈的傻逼ts觉得this.timelines[this.mainAxis]的情况下this.timelines[this.mainAxis]可能为null
                // ts小时候在自己有木琴的情况下发现自己的木琴是棍母😅
                // @ts-ignore
                ctx.strokeStyle = this.timelines[this.mainAxis] ? tValueTypeToHSL(this.timelines[this.mainAxis].tValueType, 70, 70) : c2;
                ctx.lineWidth = 3;
                ctx.stroke();
                break;
            case CUIType.showHandle:
                let timeline___ = this.timelines[0];
                ctx.fillStyle = timeline___ ? tValueTypeToHSL(timeline___.tValueType, 70, 70) : c2;
                ctx.moveTo(x - 9, y + 9);
                ctx.lineTo(x + 9, y - 9);
                ctx.stroke();
                ctx.beginPath();
                if (this.isShowHandle) {
                    ctx.arc(x - 8, y + 8, 3, 0, 2 * PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x + 8, y - 8, 3, 0, 2 * PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                }
                ctx.moveTo(x - 5, y);
                ctx.lineTo(x, y - 5);
                ctx.lineTo(x + 5, y);
                ctx.lineTo(x, y + 5);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case CUIType.mark:
                ctx.lineCap = "round";
                ctx.moveTo(x - 6, y - 9);
                ctx.lineTo(x - 6, y + 8);
                ctx.lineTo(x, y + 2);
                ctx.lineTo(x + 6, y + 8);
                ctx.lineTo(x + 6, y - 9);
                ctx.closePath();
                ctx.stroke();
                if (this.marks[this.focusTime]) {
                    ctx.fill();
                }
                break;
            case CUIType.pos:
                ctx.font = EdConst.cuiFont;
                ctx.textAlign = "left";
                ctx.fillText(`${round(this.mouseTimelineX)},${round(this.mouseTimelineY, min(floor(log10(this.timelineScaleY)) + 1, 4))}`, x + 2, y + h / 5, w - 4);
                this.hint[1] = `${floor(log10(this.timelineScaleY)) + 1}`;
                break;
            case CUIType.fps:
                if (!this.tanim) break;
                ctx.font = EdConst.cuiFont;
                ctx.textAlign = "right";
                ctx.fillText(getTranslate(Strings.eCUIFPS).replace("[fps]", `${this.tanim.fps}`), x - 2, y + h / 5, w - 4);
                break;
        }

        ctx.restore();
    }

    /** 时间轴  
     * 锚点：左上，右下 */
    drawTimelineBar(x1: number, y1: number, x2: number, y2: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #ffffff";
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        if (!this.tanim) {
            ctx.restore();
            return;
        }

        const tanim = this.tanim;

        // 主区
        // 动画时长之外的阴影
        ctx.fillStyle = " #e6e6e6";
        let startX = round(this.timelineToCanvasPosition(0, 0)[0]);
        if (startX > x1) ctx.fillRect(x1, y1, startX - x1, y2 - y1);
        let endX = round(this.timelineToCanvasPosition(tanim.length, 0)[0]);
        if (endX < x2) ctx.fillRect(x2, y1, endX - x2, y2 - y1);

        // 纵向标尺
        let y = this.canvasHeight;
        // ScaleY 约为 0.01~7500
        let step = this.timelineScaleY > 4000 ? 0.005 : this.timelineScaleY > 2000 ? 0.01 : this.timelineScaleY > 400 ? 0.05 : this.timelineScaleY > 200 ? 0.1 : this.timelineScaleY > 40 ? 0.5 :
            this.timelineScaleY > 20 ? 1 : this.timelineScaleY > 4 ? 5 : this.timelineScaleY > 2 ? 10 : this.timelineScaleY > 0.4 ? 50 : this.timelineScaleY > 0.2 ? 100 :
            this.timelineScaleY > 0.04 ? 500 : this.timelineScaleY > 0.02 ? 1000 : 5000; // 哈哈哈哈哈哈我爱打表哈哈哈哈哈哈哈
        let stepSmall = 10 ** ceil(log10(3 / this.timelineScaleY));
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = " #666666";

        for (let tValue = floor(this.timelineScrollY / stepSmall) * stepSmall; y > y1; tValue += stepSmall) {
            tValue = round(round(tValue / stepSmall) * stepSmall, 8);
            [,y] = this.timelineToCanvasPosition(0, tValue);
            let m = positiveMod(tValue, step);
            if (m <= 1e-8 || m >= step - 1e-8) { // 总感觉有点怕浮点数出问题。。。
                // 先画左
                ctx.fillRect(x1, y, EdConst.timelineSideRulerWidth / 2, 1);
                ctx.textAlign = "left";
                ctx.fillText(`${tValue}`, x1 + EdConst.timelineSideRulerWidth / 4, y - 2, EdConst.timelineSideRulerWidth + 10);
                // 再画右
                ctx.fillRect(x2, y, -EdConst.timelineSideRulerWidth / 2, 1);
                ctx.textAlign = "right";
                ctx.fillText(`${tValue}`, x2 - EdConst.timelineSideRulerWidth / 4, y - 2, EdConst.timelineSideRulerWidth + 10);
            } else {
                // 先画左
                ctx.fillRect(x1, y, EdConst.timelineSideRulerWidth / 5, 1);
                // 再画右
                ctx.fillRect(x2, y, -EdConst.timelineSideRulerWidth / 5, 1);
            }
        }

        // 鼠标拉出的复选框
        if (this.mouseDragType == MouseDragType.boxSelectKeyframe) {
            ctx.fillStyle = " #cccccc66";
            ctx.strokeStyle = " #999999";
            ctx.lineWidth = 1;
            let [boxX, boxY] = this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY);
            boxY = clamp(boxY, y1, y2);
            let boxY2 = clamp(this.mouseY, y1, y2)
            ctx.fillRect(boxX, boxY, this.mouseX - boxX, boxY2 - boxY);
            ctx.strokeRect(round(boxX) + 0.5, round(boxY) + 0.5, round(this.mouseX - boxX), round(boxY2 - boxY));
        }

        // 鼠标十字
        if (this.hover[0] == "timeline" && this.hover[1] == "main") {
            ctx.fillStyle = " #666666";
            let x = round(this.mouseX);
            let y = round(this.mouseY);
            ctx.fillRect(x, y1, 1, y2 - y1);
            ctx.fillRect(x1, y, x2 - x1, 1);
            if (this.mouseDragType == MouseDragType.moveKeyframe) {
                ctx.strokeStyle = " #666666";
                x += 0.5;
                y += 0.5;
                ctx.beginPath();
                ctx.moveTo(x - 10, y - 30);
                ctx.lineTo(x, y - 40);
                ctx.lineTo(x + 10, y - 30);
                ctx.moveTo(x - 10, y + 30);
                ctx.lineTo(x, y + 40);
                ctx.lineTo(x + 10, y + 30);
                ctx.moveTo(x - 30, y - 10);
                ctx.lineTo(x - 40, y);
                ctx.lineTo(x - 30, y + 10);
                ctx.moveTo(x + 30, y - 10);
                ctx.lineTo(x + 40, y);
                ctx.lineTo(x + 30, y + 10);
                ctx.moveTo(x, y);
                ctx.lineTo(...this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY));
                ctx.stroke();
            }
        }

        // 起点和终点竖线
        ctx.fillStyle = " #666666";
        if (x1 < startX && startX < x2) {
            ctx.fillRect(startX - 1, y1, 3, y2 - y1);
        }
        if (x1 < endX && endX < x2) {
            ctx.fillRect(endX - 1, y1, 3, y2 - y1);
        }
        // 焦点竖线
        let focusX = round(this.timelineToCanvasPosition(this.focusTime, 0)[0]);
        if (x1 < focusX && focusX < x2) {
            let y = y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight;
            //ctx.fillStyle = " #ffffff";
            //ctx.fillRect(focusX - 2, y, 5, y2 - y);
            ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? DefaultTValueType.px, 50, 40);
            ctx.fillRect(focusX - 1, y, 3, y2 - y);
        }
        // 预览焦点竖线
        let mouseFocusX = floor(this.timelineToCanvasPosition(round(this.mouseTimelineX), 0)[0]);
        if ((this.hover[1] == "mark" || this.hover[1] == "ruler") && round(this.mouseTimelineX) !== this.focusTime) {
            if (x1 < mouseFocusX && mouseFocusX < x2) {
                let y = y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight;
                //ctx.fillStyle = " #ffffff";
                //ctx.fillRect(mouseFocusX - 1, y, 3, y2 - y);
                ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? DefaultTValueType.px, 50, 70);
                ctx.fillRect(mouseFocusX, y, 1, y2 - y);
            }
        }

        // 动画值曲线
        let x = 0;
        step = 1;
        let newKeyframeTimeline: Timeline | null = null;
        let newKeyframeTime: number = 0;
        if (this.hover[0] == "timeline" && this.hover[1] == "main" && this.hover[2] == "tValueCurve") {
            newKeyframeTimeline = this.timelines[this.hover[3] as 0 | 1];
            newKeyframeTime = round(this.mouseTimelineX);
        } else if (this.hover[0] == "controlBar" && this.hover[1] == CUIType.newKeyframe) {
            newKeyframeTimeline = this.getNewKeyframeTimeline();
            newKeyframeTime = this.focusTime;
        }
        let deleteKeyframes: Set<Keyframe> | null = null;
        if (this.hover[0] == "controlBar" && this.hover[1] == CUIType.deleteKeyframe) {
            deleteKeyframes = new Set();
            this.getDeletePairs()?.forEach(pair => pair.keyframes.forEach(keyframe => deleteKeyframes?.add(keyframe)));
        }

        let drawTValueCurve = (timeline: Timeline) => {
            let tValueType = timeline.tValueType;
            ctx.beginPath();
            for (x = x1; x < x2; x += step) {
                let [time,] = this.canvasTotimelinePosition(x, 0);
                let tValue = safeTValue(timeline.getTValueByFrame(time), tValueType);
                let y = max(this.timelineToCanvasPosition(0, tValue)[1], y1);
                if (x == x1) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.lineWidth = 5;
            ctx.strokeStyle = " #ffffff";
            ctx.stroke();
            ctx.lineWidth = 3;
            let curveColor = tValueTypeToHSL(tValueType, 70, 45);
            ctx.strokeStyle = curveColor;
            ctx.stroke();

            // 拖动关键帧原位
            if (this.mouseDragType == MouseDragType.moveKeyframe) {
                let command = this.commandStack.top;
                if (command instanceof MoveKeyframesCommand && command.isDone) {
                    for (let { keyframes } of command.pairs) {
                        for (let keyframe of keyframes) {
                            let [x, y] = this.timelineToCanvasPosition(keyframe.x - command.x, typeof keyframe.y == "number" ? keyframe.y - command.y : keyframe.y);
                            this.drawKeyframe(round(x) + 0.5, y, timeline.tValueType, "drag");
                        }
                    }
                }
            }

            // 关键帧
            for (let keyframe of timeline.keyframes) {
                let [x, y] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                this.drawKeyframe(round(x) + 0.5, y, timeline.tValueType,
                    deleteKeyframes?.has(keyframe) ? "delete" :
                    this.selectedKeyframes.has(keyframe) ? "select" :
                    this.hoveredKeyframes.has(keyframe) ? "hover" : "default"
                );
            }

            let bezierHandleColor = tValueTypeToHSL(tValueType, 40, 70);
            // 控制点
            if (this.isShowHandle) for (let i = 0; i < timeline.keyframes.length; i++) {
                let keyframe = timeline.keyframes[i];
                let [x, y] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                switch (keyframe.interType) {
                    case InterType.bezier:
                        if (typeof keyframe.y == "string") break;
                        let rightKeyframe = timeline.keyframes[i + 1] as Keyframe | undefined;
                        if (!rightKeyframe) break;
                        if (typeof rightKeyframe.y == "string") break;
                        let [x2, y2] = this.timelineToCanvasPosition(rightKeyframe.x, rightKeyframe.y);
                        let pcx1 = keyframe.getParam("bezierCX1");
                        if (typeof pcx1 != "number") break;
                        let pcy1 = keyframe.getParam("bezierCY1");
                        if (typeof pcy1 != "number") break;
                        let pcx2 = keyframe.getParam("bezierCX2");
                        if (typeof pcx2 != "number") break;
                        let pcy2 = keyframe.getParam("bezierCY2");
                        if (typeof pcy2 != "number") break;
                        let [cx1, cy1] = this.timelineToCanvasPosition(keyframe.x + pcx1, keyframe.y + pcy1);
                        let [cx2, cy2] = this.timelineToCanvasPosition(rightKeyframe.x + pcx2, rightKeyframe.y + pcy2);
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(cx1, cy1);
                        ctx.moveTo(x2, y2);
                        ctx.lineTo(cx2, cy2);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#666666";
                        ctx.stroke();
                        ctx.fillStyle = bezierHandleColor;
                        ctx.beginPath();
                        ctx.arc(cx1, cy1, EdConst.timelineBezierHandleSize, 0, 2 * PI);
                        ctx.fill();
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(cx2, cy2, EdConst.timelineBezierHandleSize, 0, 2 * PI);
                        ctx.fill();
                        ctx.stroke();
                        ctx.restore();
                        break;
                }
            }

            // 预览关键帧
            if (this.mouseDragType == MouseDragType.none && newKeyframeTimeline == timeline) {
                let [x, y] = this.timelineToCanvasPosition(newKeyframeTime, safeTValue(timeline.getTValueByFrame(newKeyframeTime), timeline.tValueType));
                this.drawKeyframe(round(x) + 0.5, y, timeline.tValueType, "preview");
            }
        }

        if (this.timelines[1]) {
            drawTValueCurve(this.timelines[this.subAxis]);
            drawTValueCurve(this.timelines[this.mainAxis]);
        } else if (this.timelines[0]) {
            drawTValueCurve(this.timelines[0]);
        }

        // 刻度尺区
        ctx.fillStyle = " #ffffff";
        ctx.fillRect(x1, y1, x2 - x1, EdConst.timelineMarkHeight + EdConst.timelineRulerHeight - 1);

        // 标签
        ctx.font = EdConst.markFont;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 3;
        for (let index in this.marks) {
            let time = parseInt(index);
            if (Number.isNaN(time)) continue;
            let x = this.timelineToCanvasPosition(time, 0)[0];
            let y = y1 + EdConst.timelineMarkHeight / 2;
            ctx.fillStyle = ctx.strokeStyle = stringToHSL(this.marks[index], 40, 50);
            ctx.fillRect(x, y1, 1, EdConst.timelineMarkHeight + EdConst.timelineRulerHeight);
            ctx.strokeText(this.marks[index], x + 2, y);
            ctx.fillStyle = " #ffffff";
            ctx.fillText(this.marks[index], x + 2, y);
        }

        ctx.fillStyle = " #666666";
        ctx.fillRect(x1, y1 + EdConst.timelineMarkHeight, x2 - x1, -1);
        ctx.fillRect(x1, y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight, x2 - x1, -1);

        // 绘制刻度尺
        // 秒格
        x = 0;
        step = 2 ** max(ceil(log2(40 / (tanim.fps * this.timelineScaleX))), 0);
        ctx.fillStyle = " #666666";
        ctx.font = EdConst.timelineFont;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        for (let sec = floor(this.timelineScrollX / tanim.fps / step) * step; x < x2; sec += step) {
            [x,] = this.timelineToCanvasPosition(sec * tanim.fps, 0);
            ctx.fillRect(x, y1 + EdConst.timelineMarkHeight, 1, EdConst.timelineRulerHeight);
            ctx.fillText(`${sec}`, x + 1, y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight + 1);
        }

        // 帧格
        if (this.timelineScaleX >= 3) {
            x = 0;
            step = this.timelineScaleX > 45 ? 1 : this.timelineScaleX > 9 ? 5 : this.timelineScaleX > 5 ? 10 : tanim.fps;
            ctx.textBaseline = "alphabetic";

            for (let frame = floor(this.timelineScrollX); x < x2; frame++) {
                [x,] = this.timelineToCanvasPosition(frame, 0);
                if (frame % step == 0) {
                    ctx.fillRect(x, y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight, 1, -EdConst.timelineRulerHeight / 2);
                    ctx.fillText(`${frame}`, x + 1, y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight / 2 + 1);
                } else {
                    ctx.fillRect(x, y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight, 1, -EdConst.timelineRulerHeight / 4);
                }
            }
        }

        // 起点、终点在刻度尺区的标记
        ctx.beginPath();
        ctx.fillStyle = " #666666";
        ctx.strokeStyle = " #666666";
        if (x1 < startX + 8 + 12 && startX < x2) {
            ctx.fillRect(startX - 1, y1, 3, EdConst.timelineMarkHeight + EdConst.timelineRulerHeight);
            ctx.moveTo(startX + 0.5, y1);
            ctx.lineTo(startX + 0.5 + 8, y1);
            ctx.lineTo(startX + 0.5 + 8 + 12, y1 + EdConst.timelineMarkHeight / 2);
            ctx.lineTo(startX + 0.5 + 8, y1 + EdConst.timelineMarkHeight);
            ctx.lineTo(startX + 0.5, y1 + EdConst.timelineMarkHeight);
        }
        if (x1 < endX && endX - 8 - 12 < x2) {
            ctx.fillRect(endX - 1, y1, 3, EdConst.timelineMarkHeight + EdConst.timelineRulerHeight);
            ctx.moveTo(endX + 0.5, y1);
            ctx.lineTo(endX + 0.5 - 8, y1);
            ctx.lineTo(endX + 0.5 - 8 - 12, y1 + EdConst.timelineMarkHeight / 2);
            ctx.lineTo(endX + 0.5 - 8, y1 + EdConst.timelineMarkHeight);
            ctx.lineTo(endX + 0.5, y1 + EdConst.timelineMarkHeight);
        }
        ctx.fill();
        // 焦点
        focusX = round(this.timelineToCanvasPosition(this.focusTime, 0)[0]);
        if (x1 < focusX + 10 && focusX - 10 < x2) {
            let y = y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight;
            ctx.beginPath();
            ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? DefaultTValueType.px, 50, 40);
            ctx.moveTo(focusX + 0.5 - 10, y - 12);
            ctx.lineTo(focusX + 0.5, y + 2);
            ctx.lineTo(focusX + 0.5 + 10, y - 12);
            ctx.fill();
        }
        // 预览焦点
        if ((this.hover[1] == "mark" || this.hover[1] == "ruler") && round(this.mouseTimelineX) !== this.focusTime) {
            if (x1 < mouseFocusX + 10 && mouseFocusX - 10 < x2) {
                let y = y1 + EdConst.timelineMarkHeight + EdConst.timelineRulerHeight;
                ctx.beginPath();
                ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? DefaultTValueType.px, 50, 70);
                ctx.moveTo(mouseFocusX + 0.5 - 10, y - 12);
                ctx.lineTo(mouseFocusX + 0.5, y + 2);
                ctx.lineTo(mouseFocusX + 0.5 + 10, y - 12);
                ctx.fill();
            }
        }

        // 底部滚动条
        ctx.fillStyle = " #ffffff";
        ctx.fillRect(x1, y2, x2 - x1, -EdConst.timelineScrollHeight);
        // 滑块
        let scrollBlockLeft = this.timeToScrollX(this.canvasTotimelinePosition(x1, 0)[0], 0, tanim.length);
        let scrollBlockRight = this.timeToScrollX(this.canvasTotimelinePosition(x2, 0)[0], 0, tanim.length);
        if (this.mouseDragType == MouseDragType.timelineScrollX) {
            ctx.fillStyle = " #b3b3b3";
        } else if (this.hover[1] == "scrollX") {
            ctx.fillStyle = " #bfbfbf";
        } else {
            ctx.fillStyle = " #cccccc";
        }
        ctx.fillRect(scrollBlockLeft, y2, scrollBlockRight - scrollBlockLeft, -EdConst.timelineScrollHeight);
        // 起点、终点、焦点标记
        let scrollStart = this.timeToScrollX(0, 0, tanim.length); // 动画起点在滚动条上的横坐标
        let scrollEnd = this.timeToScrollX(tanim.length, 0, tanim.length);
        let scrollFocus = this.timeToScrollX(this.focusTime, 0, tanim.length);

        // 起点终点
        ctx.beginPath();
        ctx.moveTo(scrollStart, y2);
        ctx.lineTo(scrollStart + 8, y2 - EdConst.timelineScrollHeight / 2);
        ctx.lineTo(scrollStart, y2 - EdConst.timelineScrollHeight);

        ctx.moveTo(scrollEnd, y2);
        ctx.lineTo(scrollEnd - 8 , y2 - EdConst.timelineScrollHeight / 2);
        ctx.lineTo(scrollEnd, y2 - EdConst.timelineScrollHeight);

        ctx.fillStyle = " #666666";
        ctx.fill();
        
        // 焦点
        ctx.fillStyle = " #ffffff"
        ctx.fillRect(floor(scrollFocus) - 2, y2, 5, -EdConst.timelineScrollHeight);
        ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? DefaultTValueType.px, 50, 40);
        ctx.fillRect(floor(scrollFocus) - 1, y2, 3, -EdConst.timelineScrollHeight);

        // 两边的滚动按钮
        ctx.fillStyle = (this.hover[1] == "scrollLeft" && this.mouseDragType == MouseDragType.none) ? " #cccccc" : " #ffffff";
        ctx.fillRect(x1, y2, EdConst.timelineSideRulerWidth, -EdConst.timelineScrollHeight);
        ctx.fillStyle = (this.hover[1] == "scrollRight" && this.mouseDragType == MouseDragType.none) ? " #cccccc" : " #ffffff";
        ctx.fillRect(x2, y2, -EdConst.timelineSideRulerWidth, -EdConst.timelineScrollHeight);
        ctx.fillStyle = " #666666";
        ctx.fillRect(x1 + EdConst.timelineSideRulerWidth, y2, -1, -EdConst.timelineScrollHeight);
        ctx.fillRect(x2 - EdConst.timelineSideRulerWidth, y2, 1, -EdConst.timelineScrollHeight);

        ctx.beginPath();
        // 向左的三角
        let tx = x1 + EdConst.timelineSideRulerWidth / 2;
        let ty = y2 - EdConst.timelineScrollHeight / 2
        ctx.moveTo(tx + 3, ty - 6);
        ctx.lineTo(tx - 6, ty);
        ctx.lineTo(tx + 3, ty + 6);
        
        // 向右的三角
        tx = x2 - EdConst.timelineSideRulerWidth / 2;
        ctx.moveTo(tx - 3, ty - 6);
        ctx.lineTo(tx + 6, ty);
        ctx.lineTo(tx - 3, ty + 6);

        ctx.fillStyle = " #666666";
        ctx.fill();

        // 上边缘
        ctx.fillRect(x1, y2 - EdConst.timelineScrollHeight, x2 - x1, 1);

        ctx.restore();
    }

    /** 绘制一个关键帧  
     * 锚点：理论上讲是正中间 */
    drawKeyframe(x: number, y: number, tValueType: string, type: "default" | "preview" | "hover" | "select" | "drag" | "delete" = "default") {
        if (
            x + (EdConst.timelineKeyframeSize + 5) < this.leftBarWidth ||
            this.canvasWidth - this.rightBarWidth < x - (EdConst.timelineKeyframeSize + 5) ||
            y < this.canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight ||
            this.canvasHeight < y
        ) return;
        let ctx = this.ctx;
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(x - (EdConst.timelineKeyframeSize - 2), y);
        ctx.lineTo(x, y - (EdConst.timelineKeyframeSize - 2));
        ctx.lineTo(x + (EdConst.timelineKeyframeSize - 2), y);
        ctx.lineTo(x, y + (EdConst.timelineKeyframeSize - 2));
        ctx.closePath();

        if (type == "default") {
            ctx.strokeStyle = tValueTypeToHSL(tValueType, 20, 80);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70);
            ctx.fill();
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (type == "preview") {
            ctx.strokeStyle = " #ffffff";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70, 60);
            ctx.fill();
            ctx.strokeStyle = " #999999";
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (type == "hover") {
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 75);
            ctx.fill();
            ctx.strokeStyle = " #ffffff";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (type == "select") {
            ctx.strokeStyle = " #ffffff";
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 75);
            ctx.fill();
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.strokeStyle = " #ffffff";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x - (EdConst.timelineKeyframeSize - 6), y);
            ctx.lineTo(x, y - (EdConst.timelineKeyframeSize - 6));
            ctx.lineTo(x + (EdConst.timelineKeyframeSize - 6), y);
            ctx.lineTo(x, y + (EdConst.timelineKeyframeSize - 6));
            ctx.closePath();
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 40);
            ctx.fill();
        } else if (type == "drag") {
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70, 50);
            ctx.fill();
            ctx.strokeStyle = " #ffffff";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.strokeStyle = " #b3b3b3";
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (type == "delete") {
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70, 60);
            ctx.fill();
            ctx.strokeStyle = " #ffffff";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.strokeStyle = " #999999";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();
    }

    /** 左栏  
     * 锚点：左上，右下 */
    drawLeftBar(x1: number, y1: number, x2: number, y2: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #f2f2f2"
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x2 - 0.5, y1);
        ctx.lineTo(x2 - 0.5, y2);
        ctx.stroke();

        ctx.restore();
    }

    /** 右栏  
     * 锚点：左上，右下 */
    drawRightBar(x1: number, y1: number, x2: number, y2: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #f2f2f2"
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, y1);
        ctx.lineTo(x1 + 0.5, y2);
        ctx.stroke();

        ctx.restore();
    }

    /** 动画列表或图层列表  
     * 锚点：左上，右下 */
    drawTanimList(type: "tanimList" | "layerList", x1: number, y1: number, x2: number, y2: number, uiState: UIState, scroll: number) {
        // 一坨敏捷开发出来的屎，也叫窜稀
        let tanimTree = type == "tanimList" ? this.tanimTree : this.layerTree;
        let tanimFolders = type == "tanimList" ? this.tanimFolders : this.layerFolders;

        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #f2f2f2";
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = "bold " + EdConst.tanimListFont;
        ctx.fillStyle = " #666666";
        ctx.fillText(getTranslate(type == "tanimList" ? Strings.eTanimListTitle : Strings.eLayerListTitle), x1 + EdConst.rightBarPaddingX, y1 + EdConst.tanimListLineHeight / 2);

        ctx.strokeStyle = " #b3b3b3";
        for (let folderName in tanimFolders) {
            let {color, indentation, ranges} = tanimFolders[folderName];
            for (let {from, to} of ranges) {
                let bgy1 = y1 + EdConst.tanimListLineHeight * (from + 1 - scroll) - 0.5;
                let bgy2 = y1 + EdConst.tanimListLineHeight * (to + 1 - scroll) - 0.5;

                if (bgy2 < y1 + EdConst.tanimListLineHeight) continue;
                if (bgy1 > y2) continue;

                let bgx1 = x1 + EdConst.rightBarPaddingX + EdConst.tanimListIndentationWidth * indentation;
                let bgx2 = x2 - EdConst.tanimListPaddingRight;

                if (bgx2 <= bgx1) continue;

                let lbgy1 = max(bgy1, y1 + EdConst.tanimListLineHeight)
                let lbgy2 = min(bgy2, y2)

                ctx.fillStyle = color;
                ctx.fillRect(bgx1, lbgy1, bgx2 - bgx1, lbgy2 - lbgy1);
                ctx.beginPath();
                if (to - from >= 3) {
                    ctx.moveTo(bgx1, max(bgy1, y1) + EdConst.tanimListLineHeight);
                    ctx.lineTo(bgx1, min(y2, bgy2 - EdConst.tanimListLineHeight));
                }
                if (bgy1 >= y1 + EdConst.tanimListLineHeight - 1) {
                    ctx.moveTo(bgx1, bgy1);
                    ctx.lineTo(bgx2, bgy1);
                }
                if (bgy2 < y2) {
                    ctx.moveTo(bgx1, bgy2);
                    ctx.lineTo(bgx2, bgy2);
                }
                ctx.stroke();
            }
        }

        ctx.font = EdConst.tanimListFont;
        ctx.lineWidth = 1;
        for (let i = 0; i <= tanimTree.length; i++) {
            if (EdConst.tanimListLineHeight * (i - scroll) < 0) continue;
            if (y1 + EdConst.tanimListLineHeight * (i + 1 - scroll) > y2) break;
            let isDragStart = this.mouseDragIndex == i && (this.mouseDragType == (type == "tanimList" ? MouseDragType.tanimTreeItem : MouseDragType.layerTreeItem));
            if (this.hover[0] == type && this.hover[1] == i && uiState == UIState.hover) {
                if (
                    this.mouseDragType == MouseDragType.tanimTreeItem ||
                    (type == "layerList" && this.mouseDragType == MouseDragType.layerTreeItem)
                ) {
                    if (!isDragStart) {
                        // 不能是拖动起点
                        ctx.save();
                        ctx.strokeStyle = " #666666";
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.moveTo(x1 + EdConst.rightBarPaddingX, y1 + EdConst.tanimListLineHeight * (i + 1 - scroll));
                        ctx.lineTo(x2 - EdConst.tanimListPaddingRight, y1 + EdConst.tanimListLineHeight * (i + 1 - scroll));
                        ctx.stroke();
                        ctx.strokeStyle = " #ffffff";
                        ctx.lineWidth = 3;
                        ctx.stroke();
                        ctx.restore();
                    }
                } else {
                    if (tanimTree[i]) {
                        ctx.fillStyle = " #cccccc66";
                        ctx.fillRect(x1 + EdConst.rightBarPaddingX, y1 + EdConst.tanimListLineHeight * (i + 1 - scroll), x2 - EdConst.tanimListPaddingRight - (x1 + EdConst.rightBarPaddingX), EdConst.tanimListLineHeight);
                    }
                }
            }

            if (!tanimTree[i]) continue;

            // 拖动起点处的标记
            if (isDragStart) {
                ctx.fillStyle = " #cccccc66";
                ctx.fillRect(x1 + EdConst.rightBarPaddingX, y1 + EdConst.tanimListLineHeight * (i + 1 - scroll), x2 - EdConst.tanimListPaddingRight - (x1 + EdConst.rightBarPaddingX), EdConst.tanimListLineHeight);
            }

            // 正在编辑的图层的标记
            if (type == "layerList" && this.layerTree[i].tanim == this.tanim) {
                ctx.strokeStyle = " #666666";
                // 写这么麻烦是为了确保这玩意画出一个单线框。。。。
                ctx.strokeRect(
                    ceil(x1) + EdConst.rightBarPaddingX,
                    ceil(y1 + EdConst.tanimListLineHeight * (i + 1 - scroll)) + 0.5,
                    floor(x2 - EdConst.tanimListPaddingRight - x1 - EdConst.rightBarPaddingX), 
                    floor(EdConst.tanimListLineHeight)
                );
            }

            /** 节点右侧要显示出来的按钮 */
            let buttons: TanimListButtonType[];
            if (this.hover[0] == type && this.hover[1] == i && this.mouseDragType == MouseDragType.none) {
                // 我知道这么写可能会恶心人，但返回函数的语句真的很他妈酷！
                buttons = (type == "tanimList" ? this.getTanimListButtons : this.getLayerListButtons)(tanimTree[i]);
            } else {
                buttons = [];
            }

            // 绘制节点右侧按钮
            for (let j = 0; j < buttons.length; j++) {
                this.drawTanimListButton(
                    buttons[j],
                    x2 - EdConst.tanimListPaddingRight - EdConst.tanimListLineHeight * (j + 0.5),
                    y1 + EdConst.tanimListLineHeight * (i + 1.5 - scroll),
                    EdConst.tanimListLineHeight,
                    EdConst.tanimListLineHeight,
                    this.hover[0] == type && this.hover[1] == i && this.hover[2] == buttons[j] ? uiState : UIState.none
                );
            }

            // 绘制节点文本
            this.drawTanimListItemText(
                tanimTree[i], x1 + EdConst.rightBarPaddingX, y1 + EdConst.tanimListLineHeight * (1 - scroll), i,
                x2- EdConst.tanimListPaddingRight - buttons.length * EdConst.tanimListLineHeight - (x1 + EdConst.rightBarPaddingX + EdConst.tanimListIndentationWidth * tanimTree[i].indentation)
            );
        }

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1 - 0.5);
        ctx.lineTo(x2, y1 - 0.5);
        ctx.stroke();

        ctx.restore();
    }

    drawTanimListItemText({text: text, type, indentation}: TanimTreeItem, x: number, y: number, pos: number, maxWidth: number) {
        let itemY = y + EdConst.tanimListLineHeight * (pos + 0.5);
        this.ctx.fillStyle = " #666666";
        let trimmedText;
        switch (type) {
            case TanimItemType.folderBegin:
                trimmedText = this.trimText("", text, " {", maxWidth * 1.15);
                break;
            case TanimItemType.folderEnd:
                trimmedText = this.trimText("} ", text, "", maxWidth * 1.15);
                break;
            case TanimItemType.folderFolded:
                trimmedText = this.trimText("", text, " {...}", maxWidth * 1.15);
                break;
            default:
            case TanimItemType.tanim:
                trimmedText = this.trimText("", text, "", maxWidth * 1.15);
                break;
        }
        this.ctx.fillText(trimmedText, x + EdConst.tanimListIndentationWidth * indentation, itemY, maxWidth);
    }

    /** 动画管理器中的按钮
     * 锚点：中间 */
    drawTanimListButton(type: TanimListButtonType, x: number, y: number, w: number, h: number, uiState: UIState, color?: string) {
        let ctx = this.ctx;
        ctx.save();

        if (uiState == UIState.hover) {
            ctx.fillStyle = " #99999966";
            ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }

        ctx.strokeStyle = color ?? " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();

        switch (type) {
            case TanimListButtonType.new:
                // 这里我是照着 vsc 的新建文件画的
                // 文件
                ctx.moveTo(x - 1.5, y + 5.5);
                ctx.lineTo(x - 5.5, y + 5.5);
                ctx.lineTo(x - 5.5, y - 6.5);
                ctx.lineTo(x + 1.5, y - 6.5);
                ctx.lineTo(x + 4.5, y - 3.5);
                ctx.lineTo(x + 4.5, y - 1.5);
                // 折角
                ctx.moveTo(x + 4.5, y - 2.5);
                ctx.lineTo(x + 0.5, y - 2.5);
                ctx.lineTo(x + 0.5, y - 6.5);
                // 加号横
                ctx.moveTo(x + 1.5, y + 4.5);
                ctx.lineTo(x + 7.5, y + 4.5);
                // 竖
                ctx.moveTo(x + 4.5, y + 1.5);
                ctx.lineTo(x + 4.5, y + 7.5);
                break;
            case TanimListButtonType.copy:
                // 前文件
                ctx.moveTo(x - 5.5, y + 6.5);
                ctx.lineTo(x - 5.5, y - 3.5);
                ctx.lineTo(x + 0.5, y - 3.5);
                ctx.lineTo(x + 2.5, y - 1.5);
                ctx.lineTo(x + 2.5, y + 6.5);
                ctx.lineTo(x - 5.5, y + 6.5);
                // 前折角
                ctx.moveTo(x - 0.5, y - 3.5);
                ctx.lineTo(x - 0.5, y - 0.5);
                ctx.lineTo(x + 2.5, y - 0.5);
                // 后文件
                ctx.moveTo(x - 1.5, y - 6.5);
                ctx.lineTo(x - 1.5, y - 7.5);
                ctx.lineTo(x + 4.5, y - 7.5);
                ctx.lineTo(x + 6.5, y - 5.5);
                ctx.lineTo(x + 6.5, y + 2.5);
                ctx.lineTo(x + 5.5, y + 2.5);
                // 后折角
                ctx.moveTo(x + 3.5, y - 7.5);
                ctx.lineTo(x + 3.5, y - 4.5);
                ctx.lineTo(x + 6.5, y - 4.5);
                break;
            case TanimListButtonType.setLayer:
            case TanimListButtonType.addLayer:
            case TanimListButtonType.removeLayer:
                // 笔外框
                ctx.moveTo(x - 6.5, y + 6.5);
                ctx.lineTo(x - 6.5, y + 2.5);
                ctx.lineTo(x + 3.5, y - 7.5);
                ctx.lineTo(x + 7.5, y - 3.5);
                ctx.lineTo(x - 2.5, y + 6.5);
                ctx.lineTo(x - 6.5, y + 6.5);
                // 笔尖
                ctx.moveTo(x - 6.5, y + 3.5);
                ctx.lineTo(x - 3.5, y + 6.5);
                // 分割线
                ctx.moveTo(x - 5.5, y + 1.5);
                ctx.lineTo(x - 1.5, y + 5.5);
                // 装饰线
                ctx.moveTo(x - 3.5, y + 3.5);
                ctx.lineTo(x + 5.5, y - 5.5);
                if (type == TanimListButtonType.setLayer) break;
                // 横
                ctx.moveTo(x + 2.5, y + 5.5);
                ctx.lineTo(x + 8.5, y + 5.5);
                if (type == TanimListButtonType.removeLayer) break;
                // 竖
                ctx.moveTo(x + 5.5, y + 2.5);
                ctx.lineTo(x + 5.5, y + 8.5);
                break;
            case TanimListButtonType.rename:
                // A
                ctx.moveTo(x - 5.5, y + 3);
                ctx.lineTo(x - 2.5, y - 4.5);
                ctx.lineTo(x + 0.5, y + 3);
                // A横
                ctx.moveTo(x - 4.5, y - 0.5);
                ctx.lineTo(x - 0.5, y - 0.5);
                // A衬线
                /*ctx.moveTo(x - 6, y + 3.5);
                ctx.lineTo(x - 5, y + 3.5);
                ctx.moveTo(x + 0, y + 3.5);
                ctx.lineTo(x + 2, y + 3.5);*/
                // I竖
                ctx.moveTo(x + 3.5, y - 6.5);
                ctx.lineTo(x + 3.5, y + 5.5);
                // I横
                ctx.moveTo(x + 1.5, y - 6.5);
                ctx.lineTo(x + 5.5, y - 6.5);
                ctx.moveTo(x + 1.5, y + 5.5);
                ctx.lineTo(x + 5.5, y + 5.5);
                break;
            case TanimListButtonType.delete:
                // 盖子
                ctx.moveTo(x - 6.5, y - 4.5);
                ctx.lineTo(x + 6.5, y - 4.5);
                // 提手
                ctx.moveTo(x - 1.5, y - 4.5);
                ctx.lineTo(x - 1.5, y - 6.5);
                ctx.lineTo(x + 1.5, y - 6.5);
                ctx.lineTo(x + 1.5, y - 4.5);
                // 桶身
                ctx.moveTo(x - 4.5, y - 2.5);
                ctx.lineTo(x - 4.5, y + 6.5);
                ctx.lineTo(x + 4.5, y + 6.5);
                ctx.lineTo(x + 4.5, y - 2.5);
                // 装饰线
                ctx.moveTo(x - 1.5, y - 1.5);
                ctx.lineTo(x - 1.5, y + 3.5);
                ctx.moveTo(x + 1.5, y - 1.5);
                ctx.lineTo(x + 1.5, y + 3.5);
                break;
            case TanimListButtonType.foldDown:
                ctx.moveTo(x - 5.5, y - 2.5);
                ctx.lineTo(x, y + 3);
                ctx.lineTo(x + 5.5, y - 2.5);
                break;
            case TanimListButtonType.foldUp:
                ctx.moveTo(x - 5.5, y + 2.5);
                ctx.lineTo(x, y - 3);
                ctx.lineTo(x + 5.5, y + 2.5);
                break;
            case TanimListButtonType.foldLeft:
                ctx.moveTo(x + 2.5, y - 5.5);
                ctx.lineTo(x - 3, y);
                ctx.lineTo(x + 2.5, y + 5.5);
                break;
        }

        ctx.stroke();

        ctx.restore();
    }

    /** 关键帧面板  
     * 锚点：左上，右下 */
    drawKeyframeBar(x1: number, y1: number, x2: number, y2: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #f2f2f2"
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        let [keyframe] = this.selectedKeyframes;

        for (let kui of this.kuis) {
            this.drawKUI(x1, y1, x2, y2, kui, keyframe);
        }

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1 - 0.5);
        ctx.lineTo(x2, y1 - 0.5);
        ctx.stroke();

        ctx.restore();
    }
    
    drawKUI(x1: number, y1: number, x2: number, y2: number, kui: KUI, keyframe?: Keyframe) {
        let { type, size } = kui;
        let x = floor(x1 + EdConst.rightBarPaddingX + kui.x) + 0.5;
        let y = floor(y1 + kui.y) + 0.5;
        let w = round(size.w);
        let h = round(size.h);
        let radius = 4;

        let ctx = this.ctx;
        ctx.save();

        /** 填充色 */
        let c1 = " #666666";
        /** 背景色 */
        let c2 = " #f2f2f2";

        let isHover = this.hover[0] == "keyframeBar" && this.hover[1] == type;
        switch (type) {
            case KUIType.interTypeListItem:
                isHover &&= this.hover[2] == kui.interType;
                break;
            case KUIType.paramInput:
                isHover &&= this.hover[2] == kui.paramType;
                break;
            case KUIType.paramRadio:
                isHover &&= this.hover[2] == kui.paramType && this.hover[3] == kui.paramValue;
                break;
        }

        // 悬停背景
        if (isHover) {
            c2 = " #cccccc";
            ctx.fillStyle = c2;
            this.drawRoundedRect(x, y, w, h, radius);
            ctx.fill();
        }
        // 选中的多选项外框
        if (
            type == KUIType.paramRadio && keyframe && kui.paramValue &&
            keyframe.getParam(kui.paramType as EaseParamType) == kui.paramValue
        ) {
            ctx.strokeStyle = c1;
            this.drawRoundedRect(x, y, w, h, radius);
            ctx.stroke();
        }

        // 文本
        if (kui.text) {
            ctx.fillStyle = c1;
            ctx.textAlign = "left";
            switch (type) {
                case KUIType.title:
                    ctx.font = "bold " + EdConst.kuiFont;
                    break;
                case KUIType.ghostLabel:
                    ctx.font = "italic " + EdConst.kuiFont;
                    ctx.fillStyle = " #999999";
                    break;
                default:
                    ctx.font = EdConst.kuiFont;
                    break;
            }
            let tx = x;
            let ty = y + h / 2;
            let tw = w;
            if (kui.interType !== undefined || kui.paramValue !== undefined) {
                tx += EdConst.kuiLineHeight;
                tw -= EdConst.kuiLineHeight;
            }
            let tt = getTranslate(kui.text);
            let tanim = this.tanim;
            if (keyframe && tanim) switch (type) {
                case KUIType.timeSec:
                    tt = tt.replace("[TimeSec]", `${round(keyframe.x / tanim.fps, 4)}`);
                    break;
                case KUIType.timeFrame:
                    tt = tt.replace("[TimeFrame]", `${round(keyframe.x, 4)}`);
                    break;
                case KUIType.tValue:
                    tt = tt.replace("[TValue]", `${typeof keyframe.y == "number" ? round(keyframe.y, 4) : keyframe.y}`);
                    break;
                case KUIType.interType:
                    if (!kui.interType) break;
                    tt = tt.replace("[InterType]", getTranslate(InterTypeStrings[kui.interType][1]));
                    break;
                case KUIType.interTypeListItem:
                    if (!kui.interType) break;
                    tt = tt.replace("[InterType]", getTranslate(InterTypeStrings[kui.interType][0]));
                    break;
                case KUIType.paramInput:
                    if (!kui.paramType) break;
                    let param = keyframe.getParam(kui.paramType);
                    tt = tt.replace(`[${kui.paramType}]`, `${typeof param == "number" ? round(param, 4) : param}`);
                    break;
                case KUIType.tradExpVM:
                    let tradExpV = keyframe.getParam("tradExpV");
                    if (typeof tradExpV != "number") break;
                    tt = tt.replace("[TradExpVM]", `${round(1 / tradExpV, 4)}`);
                    break;
                case KUIType.LagrangeCXSec:
                    let lagrangeCX = keyframe.getParam("lagrangeCX");
                    if (typeof lagrangeCX !== "number") break;
                    tt = tt.replace("[TimeSec]", `${round(lagrangeCX / tanim.fps, 4)}`);
                    break;
            }
            ctx.fillText(tt, tx + 2, ty + h / 5, tw - 4);
        }

        // 函数小图标
        if (kui.interType !== undefined) {
            this.drawKUIIcon(["interType", kui.interType], x + EdConst.kuiLineHeight / 2, y + h / 2, c1, c2);
        } else if (keyframe) {
            if (kui.paramType == "easeType" && kui.paramValue) {
                this.drawKUIIcon(["easeType", kui.paramValue as EaseType], x + h / 2, y + h / 2, c1, c2);
            } else if (kui.paramType == "bezierHandleType") {
                this.drawKUIIcon(["bezierHandleType", kui.paramValue as BezierHandleType], x + h / 2, y + h / 2, c1, c2);
            }
        }
        ctx.restore();
    }

    /** 绘制关键帧面板上的小图标，例如函数图像
     * 锚点：中间 */
    drawKUIIcon(args: ["interType", InterType] | ["easeType", EaseType] | ["bezierHandleType", BezierHandleType], x: number, y: number, c1: string, c2: string) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = c1;
        ctx.strokeStyle = c1;
        ctx.lineWidth = 1;
        x = floor(x) + 0.5;
        y = floor(y) + 0.5;

        let step = 0.1;
        ctx.beginPath();
        // 曲线
        if (args[0] == "interType") {
            let interType = args[1];
            if (interType == InterType.const) {
                ctx.moveTo(x - 7, y + 6);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y - 6);
                ctx.lineTo(x + 7, y - 6);
                ctx.stroke();
                this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                this.drawKUIIconPoint(x, y - 6, c1, c2);
            } else if (interType == InterType.linear) {
                ctx.moveTo(x - 7, y + 6);
                ctx.lineTo(x + 7, y - 6);
                ctx.stroke();
                this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                this.drawKUIIconPoint(x + 7, y - 6, c1, c2);
            } else if (interType == InterType.bezier) {
                // 手柄
                ctx.moveTo(x - 7, y + 6);
                ctx.lineTo(x + 5, y + 6);
                ctx.moveTo(x + 7, y - 6);
                ctx.lineTo(x - 5, y - 6);
                ctx.stroke();
                // 曲线
                ctx.beginPath();
                ctx.moveTo(x - 7, y + 6);
                ctx.lineTo(x - 6, y + 6);
                ctx.bezierCurveTo(x + 1, y + 6, x - 1, y - 6, x + 6, y - 6); // 这里曲线和手柄的位置不严格对应，这样视觉效果会好一点
                ctx.lineTo(x + 7, y - 6);
                ctx.strokeStyle = c2;
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.strokeStyle = c1;
                ctx.lineWidth = 1;
                ctx.stroke();
                this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                this.drawKUIIconPoint(x + 7, y - 6, c1, c2);
                this.drawKUIIconPoint(x + 5, y + 6, c1, c1);
                this.drawKUIIconPoint(x - 5, y - 6, c1, c1);
            } else if (interType == InterType.lagrange) {
                ctx.moveTo(x - 7, y + 6);
                for (let x_ = x - 6; x_ <= x + 6; x_ ++) {
                    ctx.lineTo(x_, InterpolationFunctions.InterLag2(x - 6, y + 6, x + 6, y, x - 2, y - 3, x_));
                }
                ctx.lineTo(x + 7, y);
                ctx.stroke();
                this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                this.drawKUIIconPoint(x + 7, y, c1, c2);
                ctx.arc(x - 2, y - 3, 2.5, 0, 2 * PI);
                ctx.fillStyle = c2;
                ctx.fill();
                this.drawKUIIconPoint(x - 2, y - 3, c1, c2);
            } else {
                let x1 = x - 6;
                let x2 = x + 6;
                let y1 = y + 6;
                let y2 = y - 6;
                let fn: (t: number) => number;
                switch (interType) {
                    case InterType.power:
                        fn = t => t * t;
                        break;
                    case InterType.exp:
                        fn = t => InterpolationFunctions.MapExpIn(t, 6.93);
                        break;
                    case InterType.sine:
                        fn = InterpolationFunctions.MapSineIn;
                        break;
                    case InterType.circular:
                        fn = InterpolationFunctions.MapCircIn;
                        break;
                    case InterType.elastic:
                        fn = t => InterpolationFunctions.MapElasticIn(t, 2, 2.6);
                        y1 -= 3;
                        break;
                    case InterType.back:
                        fn = t => InterpolationFunctions.MapBackIn(t, 2.6);
                        y1 -= 2;
                        break;
                    case InterType.bounce:
                        fn = t => 1 - InterpolationFunctions.MapBounceOut(1 - t); // 这玩意的小图看着跟屎一样，以后要改
                        break;
                    case InterType.tradExp:
                        fn = t => InterpolationFunctions.InterTradExp(0, 0, 1, 1, t, 2.5, 10);
                        break;
                }
                let w = x2 - x1;
                let h = y2 - y1;
                ctx.moveTo(x1 - 1, y1);
                for (let t = 0; t <= 1; t += step) {
                    ctx.lineTo(x1 + w * t, y1 + h * fn(t));
                }
                ctx.lineTo(x2 + 1, y2);
                ctx.stroke();
                this.drawKUIIconPoint(x1 - 1, y1, c1, c2);
                this.drawKUIIconPoint(x2 + 1, y2, c1, c2);
            }
        } else if (args[0] == "easeType") {
            ctx.moveTo(x - 7, y + 6);
            switch (args[1]) {
                case EaseType.in:
                    ctx.bezierCurveTo(x, y + 6, x + 7, y, x + 7, y - 6);
                    break;
                case EaseType.out:
                    ctx.bezierCurveTo(x - 7, y, x, y - 6, x + 7, y - 6);
                    break;
                case EaseType.inOut:
                    ctx.bezierCurveTo(x + 1, y + 6, x - 1, y - 6, x + 7, y - 6);
                    break;
                case EaseType.outIn:
                    ctx.bezierCurveTo(x - 7, y - 1, x + 7, y + 1, x + 7, y - 6);
                    break;
            }
            ctx.stroke();
            this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
            this.drawKUIIconPoint(x + 7, y - 6, c1, c2);
        } else if (args[0] == "bezierHandleType") {
            // 手柄类型
            switch (args[1]) {
                case BezierHandleType.aligned:
                    let py = y - 6;
                    let cy = y - 5;
                    // 手柄
                    ctx.moveTo(x - 7, py);
                    ctx.lineTo(x + 7, py);
                    ctx.stroke();
                    // 曲线
                    ctx.beginPath();
                    ctx.moveTo(x - 7, y + 7);
                    ctx.bezierCurveTo(x - 7, y + 7, x - 5, cy, x, cy);
                    ctx.bezierCurveTo(x + 5, cy, x + 7, y + 7, x + 7, y + 7);
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    ctx.strokeStyle = c1;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    this.drawKUIIconPoint(x, py, c1, c2);
                    this.drawKUIIconPoint(x - 7, py, c1, c1);
                    this.drawKUIIconPoint(x + 7, py, c1, c1);
                    break;
                case BezierHandleType.auto:
                    let ax = x + 2;
                    ctx.moveTo(x - 7, y + 7);
                    ctx.bezierCurveTo(x - 7, y + 7, x - 5, y - 5, ax, y - 5);
                    ctx.bezierCurveTo(x + 6, y - 5, x + 7, y + 7, x + 7, y + 7);
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    ctx.strokeStyle = c1;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    this.drawKUIIconPoint(ax, y - 6, c1, c2);
                    break;
                case BezierHandleType.free:
                    let py_ = y - 6;
                    let cy_ = y - 5;
                    let hx = x + 1;
                    // 手柄
                    ctx.moveTo(hx, py_);
                    ctx.lineTo(hx, py_ + 10);
                    ctx.moveTo(x, py_);
                    ctx.lineTo(x + 7, py_);
                    ctx.stroke();
                    // 曲线
                    ctx.beginPath();
                    ctx.moveTo(x - 7, y + 7);
                    ctx.bezierCurveTo(x - 7, y + 7, x, cy_ + 7, x, cy_);
                    ctx.bezierCurveTo(x + 5, cy_, x + 7, y + 7, x + 7, y + 7);
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    ctx.strokeStyle = c1;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    this.drawKUIIconPoint(x, py_, c1, c2);
                    this.drawKUIIconPoint(hx, py_ + 10, c1, c1);
                    this.drawKUIIconPoint(x + 7, py_, c1, c1);
                    break;
                case BezierHandleType.vector:
                    ctx.moveTo(x - 7, y + 7);
                    ctx.lineTo(x, y - 6);
                    ctx.lineTo(x + 7, y + 7);
                    ctx.stroke();
                    this.drawKUIIconPoint(x, y - 6, c1, c2);
                    break;
            }
        }

        ctx.restore();
    }

    drawKUIIconPoint(x: number, y: number, c1: string, c2: string) {
        let ctx = this.ctx;
        ctx.save();

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * PI);
        ctx.fillStyle = c2;
        ctx.fill();
        ctx.strokeStyle = c1;
        ctx.stroke();

        ctx.restore();
    }

    /** 关闭按钮  
     * 锚点：中间 */
    drawClose(x: number, y: number, w: number, h: number, uiState: UIState) {
        let ctx = this.ctx;
        ctx.save();

        if (uiState == UIState.hover) {
            ctx.fillStyle = " #cccccc";
            ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x + 5, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.stroke();

        ctx.restore();
    }

    /** 最小化按钮  
     * 锚点：中间 */
    drawMinimize(x: number, y: number, w: number, h: number, uiState: UIState) {
        let ctx = this.ctx;
        ctx.save();

        if (uiState == UIState.hover) {
            ctx.fillStyle = " #cccccc";
            ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 0.5);
        ctx.lineTo(x + 5, y - 0.5);
        ctx.stroke();

        ctx.restore();
    }

    /** 顶栏 */
    drawHeader(w: number, h: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #e6e6e6";
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = EdConst.headerFont;
        ctx.fillStyle = " #333333";
        ctx.fillText(this.title, 8, h / 2);

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h + 0.5);
        ctx.lineTo(w, h + 0.5);
        ctx.stroke();

        ctx.restore();
    }

    /** 提示栏  
     * 锚点：下 */
    drawHintBar(y: number, w: number, h: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #d9d9d9";
        ctx.fillRect(0, y - h, w, h);

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = EdConst.hintFont;
        ctx.fillStyle = " #333333";
        ctx.fillText(this.hint[0], 8, y - h / 2 - EdConst.hintYOffset);
        ctx.fillText(this.hint[1], 8, y - h / 2 + EdConst.hintYOffset);

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y - h + 0.5);
        ctx.lineTo(w, y - h + 0.5);
        ctx.stroke();

        ctx.restore();
    }
}

let TheTanimEditor: TanimEditor | null = null;

class CQEasyTanim {
    getInfo() { return {
        id: TheExtensionID,
        name: getTranslate(Strings.extName),
        color1: "#d92644",
        color2: "#ad1f36",
        color3: "#82172b",
        blocks: [
            {
                blockType: Scratch.BlockType.BUTTON,
                text: getTranslate(Strings.buttonTutorial),
                func: "OnClickTutorialButton",
            },
            {
                blockType: Scratch.BlockType.BUTTON,
                text: getTranslate(Strings.buttonEditor),
                func: "OnClickEditorButton",
            },
            {
                opcode: Opcode.BGetTanimValue,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bGetTanimValue),
                arguments: {
                    tanimName: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimName,
                    },
                    loopMode: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MLoopMode,
                    },
                    time: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    timeUnit: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTimeUnit,
                    },
                    tanimValueType: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimValueType,
                    },
                },
            },
            {
                opcode: Opcode.BGetTanimInfo,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bGetTanimInfo),
                arguments: {
                    tanimName: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimName,
                    },
                    tanimInfoType: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimInfoType,
                    },
                },
            },

            /* --- 动画语境 --- */

            {
                blockType: Scratch.BlockType.LABEL,
                text: getTranslate(Strings.labelContext),
            },
            {
                opcode: Opcode.BSetContext,
                blockType: Scratch.BlockType.COMMAND,
                text: getTranslate(Strings.bSetContext),
                arguments: {
                    tanimName: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimName,
                    },
                    loopMode: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MLoopMode,
                    },
                    time: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    timeUnit: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTimeUnit,
                    },
                },
            },
            {
                opcode: Opcode.BGetContextValue,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bGetContextValue),
                arguments: {
                    tanimValueType: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimValueType,
                    },
                },
            },

            /* --- 动画快照 --- */

            {
                blockType: Scratch.BlockType.LABEL,
                text: getTranslate(Strings.labelSnapshot),
            },
            {
                opcode: Opcode.BCreateSnapshot,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bCreateSnapshot),
                arguments: {
                    tanimName: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimName,
                    },
                    loopMode: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MLoopMode,
                    },
                    time: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    timeUnit: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTimeUnit,
                    },
                },
            },
            {
                opcode: Opcode.BTransitSnapshot,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bTransitSnapshot),
                arguments: {
                    snapshotIndexA: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    snapshotIndexB: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 2,
                    },
                    transitT: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0.5,
                    },
                },
            },
            {
                opcode: Opcode.BGetSnapshotValue,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bGetSnapshotValue),
                arguments: {
                    snapshotIndex: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    tanimValueType: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimValueType,
                    },
                },
            },
            {
                opcode: Opcode.BSetContextBySnapshot,
                blockType: Scratch.BlockType.COMMAND,
                text: getTranslate(Strings.bSetContextBySnapshot),
                arguments: {
                    snapshotIndex: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                },
            },
            {
                opcode: Opcode.BDeleteSnapshot,
                blockType: Scratch.BlockType.COMMAND,
                text: getTranslate(Strings.bDeleteSnapshot),
                arguments: {
                    snapshotIndex: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                },
            },
            {
                opcode: Opcode.BDeleteAllSnapshot,
                blockType: Scratch.BlockType.COMMAND,
                text: getTranslate(Strings.bDeleteAllSnapshot),
            },

            /* --- 附加功能 --- */

            {
                blockType: Scratch.BlockType.LABEL,
                text: getTranslate(Strings.labelUtils),
            },
            /*{
                opcode: Opcode.BGetTanimEditorInfo,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bGetTanimEditorInfo),
                disableMonitor: true,
                arguments: {
                    tanimEditorInfoType: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimEditorInfoType,
                    },
                },
            },*/
        ],
        menus: {
            [MenuName.MTanimName]: {
                acceptReporters: true,
                items: "MGetTanimNames",
            },
            [MenuName.MLoopMode]: {
                acceptReporters: true,
                items: [
                    {
                        text: getTranslate(Strings.mLoopMode_loop),
                        value: LoopMode.loop,
                    },
                    {
                        text: getTranslate(Strings.mLoopMode_once),
                        value: LoopMode.once,
                    },
                    {
                        text: getTranslate(Strings.mLoopMode_loopYoyo),
                        value: LoopMode.loopYoyo,
                    },
                    {
                        text: getTranslate(Strings.mLoopMode_onceYoyo),
                        value: LoopMode.onceYoyo,
                    },
                ],
            },
            [MenuName.MTimeUnit]: {
                acceptReporters: true,
                items: [
                    {
                        text: getTranslate(Strings.mTimeUnit_second),
                        value: TimeUnit.second,
                    },
                    {
                        text: getTranslate(Strings.mTimeUnit_frame),
                        value: TimeUnit.frame,
                    },
                ],
            },
            [MenuName.MTanimValueType]: {
                acceptReporters: true,
                items: "MGetTanimValueTypes",
            },
            [MenuName.MTanimInfoType]: {
                acceptReporters: false,
                items: [
                    {
                        text: getTranslate(Strings.mTanimInfoType_lengthSec),
                        value: TInfoType.lengthSec,
                    },
                    {
                        text: getTranslate(Strings.mTanimInfoType_length),
                        value: TInfoType.length,
                    },
                    {
                        text: getTranslate(Strings.mTanimInfoType_fps),
                        value: TInfoType.fps,
                    },
                ],
            },
            /*[MenuName.MTanimEditorInfoType]: {
                acceptReporters: false,
                items: [
                    {
                        text: getTranslate(Strings.mTanimEditorInfoType_time),
                        value: TEditorInfoType.time,
                    },
                    {
                        text: getTranslate(Strings.mTanimEditorInfoType_anim),
                        value: TEditorInfoType.anim,
                    },
                    {
                        text: getTranslate(Strings.mTanimEditorInfoType_sprite),
                        value: TEditorInfoType.sprite,
                    },
                    {
                        text: getTranslate(Strings.mTanimEditorInfoType_cosPrefix),
                        value: TEditorInfoType.cosPrefix,
                    },
                    {
                        text: getTranslate(Strings.mTanimEditorInfoType_cosName),
                        value: TEditorInfoType.cosName,
                    },
                    {
                        text: getTranslate(Strings.mTanimEditorInfoType_cosSuffix),
                        value: TEditorInfoType.cosSuffix,
                    },
                ],
            },*/
        },
    }; }

    OnClickTutorialButton(): void {
        alert("暂无教程！");
    }

    OnClickEditorButton(): void {
        if (!TheTanimEditor) TheTanimEditor = new TanimEditor();
        if (TheTanimEditor.isShow) {
            TheTanimEditor.isShow = false;
            TheTanimEditor.root.style.display = "none";
        } else {
            TheTanimEditor.isShow = true;
            TheTanimEditor.root.style.display = "flex";
        }
    }

    constructor() {
        vm.runtime.on("PROJECT_LOADED", () => this.OnClickEditorButton());
    }

    MGetTanimNames(): MenuItem[] {
        let tanimNames: MenuItem[] = [];
        for (let i = 0; i < TheTanimManager.tanims.length; i++) {
            let name = TheTanimManager.tanims[i].name;
            tanimNames.push({ text: name, value: name });
        }
        if (tanimNames.length == 0) tanimNames.push({ text: getTranslate(Strings.tanimMenuPlaceholder), value: "" });
        return tanimNames;
    }

    MGetTanimValueTypes(): MenuItem[] {
        let tanimValueTypes: MenuItem[] = [];
        for (let i = 0; i < TheTanimManager.tValueTypes.length; i++) {
            let tValueType = TheTanimManager.tValueTypes[i];
            let text;
            switch (tValueType) {
                case DefaultTValueType.px:
                    text = getTranslate(Strings.mTanimValueType_px);
                    break;
                case DefaultTValueType.py:
                    text = getTranslate(Strings.mTanimValueType_py);
                    break;
                case DefaultTValueType.s:
                    text = getTranslate(Strings.mTanimValueType_s);
                    break;
                case DefaultTValueType.sx:
                    text = getTranslate(Strings.mTanimValueType_sx);
                    break;
                case DefaultTValueType.sy:
                    text = getTranslate(Strings.mTanimValueType_sy);
                    break;
                case DefaultTValueType.sq:
                    text = getTranslate(Strings.mTanimValueType_sq);
                    break;
                case DefaultTValueType.sqx:
                    text = getTranslate(Strings.mTanimValueType_sqx);
                    break;
                case DefaultTValueType.sqy:
                    text = getTranslate(Strings.mTanimValueType_sqy);
                    break;
                case DefaultTValueType.d:
                    text = getTranslate(Strings.mTanimValueType_d);
                    break;
                case DefaultTValueType.cos:
                    text = getTranslate(Strings.mTanimValueType_cos);
                    break;
                default:
                    text = tValueType;
                    break;
            }
            tanimValueTypes.push({ text: text, value: tValueType });
        }
        return tanimValueTypes;
    }

    [Opcode.BGetTanimValue]({tanimName, loopMode, time, timeUnit, tanimValueType}: any): TValue {
        tanimName = Cast.toString(tanimName);
        time = Cast.toNumber(time);
        tanimValueType = Cast.toString(tanimValueType);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return safeTValue(null, tanimValueType);
        return safeTValue(tanim.getTValue(tanimValueType, time, timeUnit, loopMode), tanimValueType);
    }

    [Opcode.BGetTanimInfo]({tanimName, tanimInfoType}: any): number{
        tanimName = Cast.toString(tanimName);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return 0;
        tanimInfoType = Cast.toString(tanimInfoType);
        switch (tanimInfoType) {
            case TInfoType.lengthSec:
                return Cast.toNumber(tanim.length / tanim.fps);
            case TInfoType.length:
                return Cast.toNumber(tanim.length);
            case TInfoType.fps:
                return Cast.toNumber(tanim.fps);
            default:
                return 0;
        }
    }

    [Opcode.BSetContext]({tanimName, loopMode, time, timeUnit}: any): void {
        tanimName = Cast.toString(tanimName);
        time = Cast.toNumber(time);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return;
        TheTanimManager.context = tanim.getSnapshot(time, timeUnit, loopMode);
    }

    [Opcode.BGetContextValue]({tanimValueType}: any): TValue {
        tanimValueType = Cast.toString(tanimValueType);
        return safeTValue(TheTanimManager.context[tanimValueType], tanimValueType);
    }

    [Opcode.BCreateSnapshot]({tanimName, loopMode, time, timeUnit}: any): number {
        tanimName = Cast.toString(tanimName);
        time = Cast.toNumber(time);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return 0;
        let snapshot = tanim.getSnapshot(time, timeUnit, loopMode);
        let index = TheTanimManager.allocateSnapshotIndex(snapshot);
        return index + 1;
    }

    [Opcode.BTransitSnapshot]({snapshotIndexA, snapshotIndexB, transitT}: any): number {
        snapshotIndexA = Cast.toNumber(snapshotIndexA);
        snapshotIndexB = Cast.toNumber(snapshotIndexB);
        transitT = Cast.toNumber(transitT);
        let snapshotA = TheTanimManager.getSnapshotByIndex(snapshotIndexA - 1);
        if (snapshotA === null) return 0;
        let snapshotB = TheTanimManager.getSnapshotByIndex(snapshotIndexB - 1);
        if (snapshotB === null) return 0;
        let snapshot = TheTanimManager.transitSnapshot(snapshotA, snapshotB, clamp(transitT, 0, 1));
        let index = TheTanimManager.allocateSnapshotIndex(snapshot);
        return index + 1;
    }

    [Opcode.BGetSnapshotValue]({snapshotIndex, tanimValueType}: any): TValue {
        snapshotIndex = Cast.toNumber(snapshotIndex);
        let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
        if (snapshot === null) return safeTValue(null, tanimValueType);
        tanimValueType = Cast.toString(tanimValueType);
        return safeTValue(snapshot[tanimValueType], tanimValueType);
    }

    [Opcode.BSetContextBySnapshot]({snapshotIndex}: any): void {
        snapshotIndex = Cast.toNumber(snapshotIndex);
        let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
        if (snapshot === null) return;
        TheTanimManager.context = snapshot;
    }

    [Opcode.BDeleteSnapshot]({snapshotIndex}: any): void {
        snapshotIndex = Cast.toNumber(snapshotIndex);
        TheTanimManager.recycleSnapshotIndex(snapshotIndex - 1)
    }

    [Opcode.BDeleteAllSnapshot](): void {
        TheTanimManager.recycleAllSnapshot();
    }

    /*[Opcode.BGetTanimEditorInfo]({tanimEditorInfoType}: any): number | string {
        tanimEditorInfoType = Cast.toString(tanimEditorInfoType);
        switch (tanimEditorInfoType) {// ⚠️⚠️⚠️ 施工中 ⚠️⚠️⚠️
            case TEditorInfoType.time:
                return "";
            default:
                return "";
        }
    }*/
}

Scratch.extensions.register(new CQEasyTanim());

console.log(`=== Easy Tanim ${TheExtensionVersion} ===`);

})(Scratch);
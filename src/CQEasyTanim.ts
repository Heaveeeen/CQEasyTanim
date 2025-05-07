/**
 * Easy Tanim  v0.0.0-beta
 * 本扩展能够轻松实现时间轴动画。内置动画编辑器，完美兼容 turbowarp。
 * 
 * 作者：苍穹
 * 感谢 arkos、白猫、simple、允某、酷可mc 等人，他们给我提供了许多帮助，在此不一一列举。（太多了列不出来）
 * arkos 真的给我提供了很多技术上的帮助，教我怎么写扩展，我爱他❤️
 * 一些缓动函数抄自 https://blog.51cto.com/u_15057855/4403832 （从 Animator 扩展那里翻到的链接，非常感谢！）
 */

(function(Scratch) {

const IsShowWarn: boolean = true;

function Warn(...data: any[]) {
    if (IsShowWarn) {
        if (typeof data[0] == "string") {
            data[0] = "Easy Tanim: " + data[0];
        }
        console.warn(...data);
    }
}

if (!Scratch?.extensions?.unsandboxed) {
    throw new Error('Easy Tanim must run unsandboxed!');
}

const vm = Scratch.vm;
const Cast = Scratch.Cast;
const isGandi: boolean = vm.runtime.gandi ? true : false;

const TheExtensionID = "cqeasytanim"

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
    eDefaultConfirmQuestion = "CQET_eDefaultConfirmQuestion",

    noTanim = "CQET_noTanimPleaseCreate",
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
        [Strings.eDefaultConfirmQuestion]: "时间轴动画编辑器：确定要执行此操作吗？",

        [Strings.noTanim]: "- 未创建动画 -",
    },
}

Scratch.translate.setup(translates);

function getTranslate(id: Strings): string {
    return Scratch.translate({ id: id, default: translates["zh-cn"][id], });
}

let { exp, pow, PI, sin, sqrt, abs, max, min, round, floor, ceil } = Math;

function GetSafeCommentID(base: string): string {
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

    static InterEase(x1: number, y1: number, x2: number, y2: number, x: number, easeType: any, mfn: (tm: number) => number): number {
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

    static MapSineIn = (t: number) => sin(t * 2 / PI);

    static MapCircIn = (t: number) => sqrt(1 - pow(t, 2));

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
        let a = pow(1 - 1 / v, p * (x2 - x1));
        let t = (x - x1) / (x2 - x1);
        let r = (pow(a, t) - 1) / (a - 1);
        return this.Lerp(y1, y2, t);
    }


    static InterLag2 = (x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, x: number) => {
        let l1 = (y1 * (x - cx) * (x - x2)) / ((x1 - cx) * (x1 - x2));
        let l2 = (cy * (x - x1) * (x - x2)) / ((cx - x1) * (cx - x2));
        let l3 = (y2 * (x - x1) * (x - cx)) / ((x2 - x1) * (x2 - cx));
        return l1 + l2 + l3;
    }

    static CalcBezier3 = (p1: number, p2: number, p3: number, p4: number, t: number) =>
        p1 * pow(1 - t, 3) + p2*3 * pow(1 - t, 2)*t + p3*3 * (1 - t)*pow(t, 2) + p4 * pow(t, 3);
    // 牛顿法求近似解（直接解太复杂，D老师说这个比直接解快。。。虽然我感觉他在胡说，但这个目前来看似乎还算够用。。。）
    static InterBezier3 = (x1: number, y1: number, x2: number, y2: number, cx1: number, cy1: number, cx2: number, cy2: number, x: number) => {
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



type TValue = number | string;
type EaseParams = {[key: string]: any} | null;

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

const enum EaseType {
    in = "in",
    out = "out",
    inOut = "inOut",
    outIn = "outIn",
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
}

/** 如果一个动画值是空值，则返回其默认值 */
function SafeTValue(tValue: TValue | null | undefined, tValueType: string): TValue {
    return tValue ?? DefaultTValues[tValueType] ?? 0
}

/** 快照，即一系列动画值的集合。可以理解为 transform 。 */
type Snapshot = {[key: string]: TValue};

/** 用于在注释中标识保存数据的标记 */
const enum SavedataMarks {
    head = "!!!CQ_EASY_TANIM_SAVE_DATA_HEAD_DONT_EDIT_THIS!!!",
    tail = "!!!CQ_EASY_TANIM_SAVE_DATA_TAIL_DONT_EDIT_THIS!!!",
}

/** 一个关键帧，即时间轴上的一个插值点 */
class Keyframe {
    interType: string;
    x: number;
    y: TValue;
    params: EaseParams;

    constructor(x: number, y: TValue, interType: string, params: EaseParams = null) {
        this.interType = interType;
        this.x = x;
        this.y = y;
        this.params = params ?? null;
    }

    static FromObject(obj: any): Keyframe | null {
        try {
            let { x, y, type, params } = obj;
            if (
                typeof x != "number" ||
                (typeof y != "number" && typeof y != "string") ||
                typeof type != "string" ||
                typeof params != "object"
            ) {
                throw new Error();
            };
            return new Keyframe(x, y, type, params);
        } catch (error) {
            Warn("尝试构造 Keyframe 对象时，捕获到错误。", error);
            return null;
        }
    }

    static GetDefaultParam(interType: string, key: string): any {
        switch (interType) {
            case InterType.power:
                if (key == "n") return 2;
                break;
            case InterType.exp:
                if (key == "n") return 6.93;
                break;
            case InterType.elastic:
                if (key == "m") return 3.33;
                if (key == "n") return 6.93;
                break;
            case InterType.back:
                if (key == "s") return 1.70158;
                break;
            case InterType.tradExp:
                if (key == "v") return 3;
                if (key == "p") return 1;
                break;
        }
        return undefined;
    }

    getParam(key: string): any {
        let result = this.params === null ? undefined : this.params[key];
        if (result === undefined) {
            return Keyframe.GetDefaultParam(this.interType, key);
        }
        return result;
    }

    static Ease(x: number, left: Keyframe, right: Keyframe): TValue {
        let interType = left.interType;
        let { x: x1, y: y1 } = left;
        let { x: x2, y: y2 } = right;
        if (typeof y1 == "string" || typeof y2 == "string") {
            return y1;
        }
        let params = left.params ?? {};
        let easeType = params["easeType"];
        let fn = InterpolationFunctions;
        switch (interType) {
            case InterType.const:
                return y1;
            case InterType.linear:
                return fn.InterLerp(x1, y1, x2, y2, x);
            case InterType.tradExp:
                return fn.InterTradExp(x1, y1, x2, y2, x, left.getParam("v"), left.getParam("p"));
            case InterType.lagrange:
                return fn.InterLag2(x1, y1, x2, y2, params["cx"] ?? x1, params["cy"] ?? y1, x);
            case InterType.bezier:
                return fn.InterBezier3(x1, y1, x1 + (params["cx1"] ?? 0), y1 + (params["cy1"] ?? 0), x2 + (params["cx2"] ?? 0), y2 + (params["cy2"] ?? 0), x2, y2, x);

            case InterType.power:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapPowerIn(tm, left.getParam("n")));
            case InterType.exp:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapExpIn(tm, left.getParam("n")));
            case InterType.sine:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapSineIn(tm));
            case InterType.circular:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapCircIn(tm));
            case InterType.elastic:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapElasticIn(tm, left.getParam("m"), left.getParam("n")));
            case InterType.back:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapBackIn(tm, left.getParam("s")));
            case InterType.bounce:
                return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapBounceOut(1 - tm));
            default:
                return y1;
        }
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
            Warn("尝试构造 Timeline 对象时，捕获到错误。", error);
            return null;
        }
    }

    getTValueByFrame(x: number): TValue {
        if (this.keyframes.length == 0) {
            return DefaultTValues[this.tValueType] ?? 0;
        } else if (this.keyframes.length == 1) {
            return this.keyframes[0].y;
        }

        let left;
        // 从右往左，查找目标左侧的第一个关键帧
        for (let i = this.keyframes.length - 1; i > 0; i--) {
            let point = this.keyframes[i];
            if (point.x <= x) {
                // 检验这个关键帧是否是合法的关键帧（例如：Z形曲线左下角那个点不合法）
                let pre = this.keyframes[i - 1];
                if (pre.x <= point.x) {
                    left = point;
                    break;
                }
            }
        }

        let right;
        // 从左往右，查找目标右侧的第一个关键帧
        for (let i = 0; i < this.keyframes.length; i++) {
            let point = this.keyframes[i];
            if (point.x >= x) {
                // 检验这个关键帧是否是合法的关键帧（例如：Z形曲线左下角那个点不合法）
                let pre = this.keyframes[i - 1];
                if (pre.x <= point.x) {
                    right = point;
                    break;
                }
            }
        }

        if (!left) {
            return SafeTValue(null, this.tValueType);
        }
        if (!right) {
            return SafeTValue(left.y, this.tValueType);
        }

        return Keyframe.Ease(x, left, right);
    }
}

/** 一个动画，包含许多动画属性，每个属性对应一个时间轴 */
class Tanim {
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
            return new Tanim(name, length, fps, timelines);
        } catch (error) {
            Warn("尝试构造 Tanim 对象时，捕获到错误。", error);
            return null;
        }
    }

    rename(name: string) {
        this.name = name;
    }

    getTimelineByTValueType(tValueType: string): Timeline | null {
        let result = this.timelines.find(timeline => timeline.tValueType === tValueType);
        return result ?? null
    }

    /** 将用户输入的时间转化为时间轴上的横坐标 */
    getTime(time: number, timeUnit: TimeUnit, loopMode: LoopMode): number {
        if (timeUnit === TimeUnit.second) {
            time /= this.fps;
        }
        switch (loopMode) {
            case LoopMode.once:
                time = clamp(time, 0, this.length);
                break;
            case LoopMode.loopYoyo:
                time = time % this.length * 2;
                if (time > this.length) time = this.length * 2 - time;
                break;
            case LoopMode.onceYoyo:
                time = clamp(time, 0, this.length * 2);
                if (time > this.length) time = this.length * 2 - time;
                break;
            default:
            case LoopMode.loop:
                time = time % this.length;
                break;
        }
        return time;
    }

    getTValue(tValueType: string, time: number, timeUnit: TimeUnit, loopMode: LoopMode): TValue | null {
        if (tValueType == DefaultTValueType.sqx || tValueType == DefaultTValueType.sqy) {
            let sq = SafeTValue(this.getTValue(DefaultTValueType.sq, time, timeUnit, loopMode), DefaultTValueType.sq);
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
            Warn("尝试构造 TanimManager 对象时，捕获到错误。", error);
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
        return SafeTValue(this.context[tValueType], tValueType);
    }

    getSnapshotByIndex(index: number): Snapshot | null {
        return this.snapshots[index] ?? null;
    }

    getSnapshotValue(snapshot: Snapshot, tValueType: string): TValue {
        return SafeTValue(snapshot[tValueType], tValueType);
    }

    transitSnapshot(snapshotA: Snapshot, snapshotB: Snapshot, t: number): Snapshot {
        let lerp = InterpolationFunctions.Lerp;
        let result: Snapshot = {};
        for (let tValueType in new Set([...Object.keys(snapshotA), ...Object.keys(snapshotB)])) {
            if (tValueType == DefaultTValueType.sqx || tValueType == DefaultTValueType.sqy) {
                // 挤压倍数有特殊的插值方式：对挤压进行插值，并算出插值后的挤压倍数
                let sqa = SafeTValue(snapshotA[DefaultTValueType.sq], DefaultTValueType.sq);
                let sqb = SafeTValue(snapshotB[DefaultTValueType.sq], DefaultTValueType.sq);
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
                let va = SafeTValue(snapshotA[tValueType], tValueType);
                let vb = SafeTValue(snapshotB[tValueType], tValueType);
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
        result.rename(this.getSafeTanimName(result.name));
        return result;
    }
}

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
function stringToHSL(str: string, saturation: number, lightness: number) {
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

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // 固定饱和度和亮度
}

/** 从注释中寻找第一份识别到的存储数据，返回JSON字符串 */
function GetJSONSrcFromComment(): string | null {
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
function GetSavedataFromJSONSrc(JSONSrc: string | null): {obj: any, src: string | null} {
    try {
        if (JSONSrc) {
            return {
                obj: JSON.parse(JSONSrc),
                src: JSONSrc,
            }
        } else {
            Warn("无法读取动画存储数据，已初始化动画数据。");
            return {
                obj: { tanims: [], },
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

let TheTanimManager: TanimManager = new TanimManager([]);

function AutoLoadData(isAlertError: boolean) {

    let JSONSrc = GetJSONSrcFromComment();
    let {obj: savedata, src} = GetSavedataFromJSONSrc(JSONSrc);
    let _parsedTanimManager = TanimManager.FromObject(savedata);

    // 读取出错
    if (_parsedTanimManager == null) {
        if (!isAlertError) return;

        let d = new Date();
        let dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        vm.runtime.targets[0].createComment(GetSafeCommentID("_EasyTanimBackup"), null, 
`⚠️⚠️⚠️时间轴动画 错误⚠️⚠️⚠️
⚠️⚠️⚠️EASY TANIM ERROR⚠️⚠️⚠️
${dateStr}
无法从注释中读取存储数据，已重置动画数据。检查浏览器开发者工具以获取更多信息。
此条注释下方备份了旧的动画数据，请妥善保管，并联系他人以寻求帮助。
Failed to load stored data from comment. Data has been reset. Check the browser's developer tools for more information.
A backup of the old data has been preserved below this comment. Please keep it safe and contact others for help.

${SavedataMarks.head}${JSONSrc}${SavedataMarks.tail}
`, 0, 0, 600, 800, false);
        Warn("读取动画存储数据失败，已重置动画数据。在背景中生成了一条新注释，备份了旧的动画数据源码。");
        window.alert(`时间轴动画 错误：读取动画存储数据失败，已重置动画数据。在背景中生成了一条新注释，请检查它以获取更多信息和旧数据的备份。

EASY TANIM ERROR: Fail to load stored data. Data has been reset. Created a comment in Background, please check it for more information and backup of old data.`);
        return;
    }
    TheTanimManager = _parsedTanimManager;
}

vm.runtime.on("PROJECT_LOADED", () => AutoLoadData(true));

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

const enum UIState {
    none,
    hover,
    click,
}

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
}

const enum EdConst {
    headerFont = '14px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',
    tanimNameFont = '14px "MicrosoftYaHei", "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", Arial, sans-serif',

    headerWidth = 240,
    headerHeight = 30,
    headerButtonWidth = 40,
    canvasWidth = 800,
    canvasHeight = 600,
    leftBarWidth = 75,
    timelineBarHeight = 150,
    rightBarWidth = 250,
    layerBarHeight = 80,
    controlBarHeight = 50,
    hintBarHeight = 30,
    keyframeBarHeight = 200,

    leftBarWidthMin = 60,
    timelineBarHeightMin = 60,
    rightBarWidthMin = 200,
    layerBarHeightMin = 50,
    tanimListHeightMin = 100,
    previewWidthMin = 340,
    previewHeightMin = 170,

    tanimListLineHeight = 24,
    tanimListPaddingRight = 20,
    tanimListIndentationWidth = 12,
    tanimFolderSeparator = "//",
}

type Hover = (string | number)[];
type TanimTreeItem = {dir: string[], text: string, type: TanimItemType, indentation: number, tanim?: Tanim}; // 这里应该interface，但我懒了
/** 注意这个并不是树结构，是树展开成的列表 */
type TanimTree = TanimTreeItem[];
type TanimFolderInfo = {color: string, indentation: number, ranges: {from: number, to: number}[]};
type TanimFolders = {[key: string]: TanimFolderInfo};

class TanimEditor {
    time: number;
    tanim: Tanim | null;
    sprite: Target | null;
    costumeName: [string, string, string];

    isShow: boolean;
    isMinimized: boolean;
    isInputing: boolean;
    //answer: any;

    width: number;
    height: number;
    top: number;
    left: number;

    tanimListScroll: number;
    layerListScroll: number;

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

    mouseDragType: MouseDragType;
    mouseDragClientX: number;
    mouseDragClientY: number;
    mouseDragTop: number;
    mouseDragLeft: number;
    mouseDragWidth: number;
    mouseDragHeight: number;
    mouseDragIndex: number;

    cursor: string;

    leftBarWidth: number;
    timelineBarHeight: number;
    rightBarWidth: number;
    layerBarHeight: number;

    title: string;
    hint: string;
    tanimTree: TanimTree;
    tanimFolders: TanimFolders;
    layerTree: TanimTree;
    layerFolders: TanimFolders;

    layers: Tanim[];
    foldedTanimFolders: Set<string>;
    foldedLayerFolders: Set<string>;
    recycleBin: Tanim[];

    root: HTMLDivElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    /*inputRoot: HTMLDivElement;
    input: HTMLInputElement;*/

    constructor() {
        this.time = 0;
        this.tanim = null;
        this.sprite = null;
        this.costumeName = ["", "", ""];

        this.isShow = false;
        this.isMinimized = false;
        this.isInputing = false;
        //this.answer = null;

        this.width = EdConst.canvasWidth;
        this.height = EdConst.canvasHeight;
        this.top = 90;
        this.left = 100;

        this.tanimListScroll = 0;
        this.layerListScroll = 0;
/*
        this.resizeObserver = new ResizeObserver(() => {
            this._rect = undefined;
            this._clientLeft = undefined;
            this._clientTop = undefined;
        });
*/
        this.mouseClientX = -1;
        this.mouseClientY = -1;

        this.mouseDragType = MouseDragType.none;
        this.mouseDragClientX = 0;
        this.mouseDragClientY = 0;
        this.mouseDragTop = 0;
        this.mouseDragLeft = 0;
        this.mouseDragWidth = 0;
        this.mouseDragHeight = 0;
        this.mouseDragIndex = -1;

        this.cursor = "default";

        this.leftBarWidth = EdConst.leftBarWidth;
        this.timelineBarHeight = EdConst.timelineBarHeight;
        this.rightBarWidth = EdConst.rightBarWidth;
        this.layerBarHeight = EdConst.layerBarHeight;
        this.title = getTranslate(Strings.eDefaultTitle);
        this.hint = getTranslate(Strings.eDefaultHint);
        this.tanimTree = [];
        this.tanimFolders = {};
        this.layerTree = [];
        this.layerFolders = {};

        this.layers = [];
        this.foldedTanimFolders = new Set();
        this.foldedLayerFolders = new Set();
        this.recycleBin = [];

        this.root = document.createElement("div");
        let s = this.root.style;
        s.display = "none";
        s.position = "absolute";
        s.top = "0";
        s.left = "0";
        this.setPosition();
        s.zIndex = "200";
        s.borderRadius = "8px";
        s.backgroundColor = " #f2f2f2";
        s.border = "1px solid #666666";
        s.boxShadow = "0px 0px 5px 2px rgba(0, 0, 0, 0.3)"
        s.overflow = "hidden";

        this.canvas = document.createElement("canvas");
        this.setCanvasSize();
        s = this.canvas.style;
        s.backgroundColor = " #ffffff"
        this.root.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.ctx) {
            Warn("无法获取 Canvas 绘图上下文，动画编辑器将无法正常使用");
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

        this.update(null);
    }

    /** 默认值为 this.left, this.top */
    setPosition(top?: number, left?: number) {
        /*this.root.style.top = `${top ?? this.top}px`;
        this.root.style.left = `${left ?? this.left}px`;*/
        this.root.style.transform = `translate(${left ?? this.left}px, ${top ?? this.top}px)`;
    }

    /** 默认值为 this.width, this.height */
    setCanvasSize(width?: number, height?: number) {
        this.canvas.width = width ?? this.width;
        this.canvas.height = height ?? this.height;
    }

    toCanvasPosition(x: number, y: number): [number, number] {
        /*let { left, top } = this.rect;
        left += this.clientLeft;
        top += this.clientTop;
        return [
            x - left + scrollX,
            y - top + scrollY,
        ];*/
        return [x - this.left - 1 + scrollX, y - this.top - 1 + scrollY];
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
    ask(message: string | null, _default: string | null, callback: (answer: string | null) => any): boolean {
        let answer = prompt(
            message ?? undefined,
            _default ?? undefined
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
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(answer) , 60, 30, []);
                    TheTanimManager.tanims.push(tanim);
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
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(dirStr + answer) , 60, 30, []);
                    let tanims = TheTanimManager.tanims;
                    for (let i = tanims.length - 1; i >= 0; i--) {
                        if (tanims[i].name.startsWith(dirStr)) {
                            tanims.splice(i + 1, 0, tanim);
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
                }
            }
        );
    }

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

    scrollTanimList(x: number, canvasHeight: number) {
        this.tanimListScroll = clamp(
            this.tanimListScroll + x, 0,
            this.tanimTree.length - floor(
                (canvasHeight - EdConst.headerHeight - EdConst.tanimListLineHeight - this.layerBarHeight - EdConst.keyframeBarHeight - EdConst.hintBarHeight)
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
                break;
            case TanimItemType.folderBegin:
            case TanimItemType.folderEnd:
            case TanimItemType.folderFolded:
                let tanims = TheTanimManager.getTanimsByPrefix(item.dir.join(EdConst.tanimFolderSeparator) + EdConst.tanimFolderSeparator);
                this.layers.splice(idx, 0, ...tanims.filter(tanim => !this.layers.includes(tanim)));
                break;
        }
        this.updateLayerTree();
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
            // @ts-ignore
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
                // @ts-ignore
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
    }

    update(events: { mouseEvent?: MouseEvent, wheelEvent?: WheelEvent } | null) {
        let { mouseEvent, wheelEvent } = events ?? {};
        if (mouseEvent) {
            this.mouseClientX = mouseEvent.clientX;
            this.mouseClientY = mouseEvent.clientY;
        }
        if (this.isInputing) return;

        if (!this.isMinimized) {
            this.updateTanimTree();
            this.updateLayerTree();
        }

        let ctx = this.ctx;
        let canvasWidth: number, canvasHeight: number;
        if (this.isMinimized) {
            canvasWidth = EdConst.headerWidth;
            canvasHeight = EdConst.headerHeight;
        } else {
            canvasWidth = this.width;
            canvasHeight = this.height;
        }

        // 处理鼠标信息
        let mouseState: MouseState = MouseState.none;
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
                    if (this.mouseDragType == MouseDragType.none && mouseState != MouseState.none) {
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

        let [mouseX, mouseY] = this.toCanvasPosition(this.mouseClientX, this.mouseClientY);

        let wheel = 0;
        if (wheelEvent) {
            wheel = wheelEvent.deltaY;
        }

        let cursor: string = "default";
        let hover: Hover = [];
        // 计算鼠标悬停元素
        if ((0 < mouseX && mouseX < canvasWidth) && (0 < mouseY && mouseY < EdConst.headerHeight)) {
            // 鼠标位于顶栏
            cursor = "move";
            hover = ["header"];
            if (canvasWidth - EdConst.headerButtonWidth <= mouseX) {
                cursor = "pointer";
                hover.push("close");
            } else if (canvasWidth - 2 * EdConst.headerButtonWidth <= mouseX) {
                cursor = "pointer";
                hover.push("minimize");
            }
        } else if (!this.isMinimized) {
            if (
                canvasWidth - EdConst.tanimListLineHeight - EdConst.tanimListPaddingRight < mouseX && mouseX < canvasWidth - EdConst.tanimListPaddingRight &&
                EdConst.headerHeight < mouseY && mouseY < EdConst.headerHeight + EdConst.tanimListLineHeight
            ) {
                // 鼠标位于新建动画按钮
                cursor = "pointer";
                hover = ["newTanim"];
            } else if (
                canvasWidth - this.rightBarWidth < mouseX && mouseX < canvasWidth - 8 &&
                EdConst.headerHeight + EdConst.tanimListLineHeight < mouseY && mouseY < canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight - 5
            ) {
                // 鼠标位于动画列表范围内
                if (mouseX >= canvasWidth - EdConst.tanimListPaddingRight) {
                    // 右侧内边距区
                    if (wheel < 0) {
                        this.scrollTanimList(-5, canvasHeight);
                    }
                    if (wheel > 0) {
                        this.scrollTanimList(5, canvasHeight);
                    }
                    hover = ["tanimScroll"];
                } else {
                    // 列表主区
                    if (wheel < 0) {
                        this.scrollTanimList(-2, canvasHeight);
                    }
                    if (wheel > 0) {
                        this.scrollTanimList(2, canvasHeight);
                    }
                    hover = ["tanimList"];
                    let treeIndex = floor((mouseY - (EdConst.headerHeight + EdConst.tanimListLineHeight)) / EdConst.tanimListLineHeight + this.tanimListScroll);
                    if (0 <= treeIndex && treeIndex < this.tanimTree.length) {
                        // 鼠标位于某一动画上
                        cursor = "pointer";
                        hover.push(treeIndex);
                        let buttons = this.getTanimListButtons(this.tanimTree[treeIndex]);
                        let buttonIndex = clamp(floor((canvasWidth - EdConst.tanimListPaddingRight - mouseX) / EdConst.tanimListLineHeight), 0, buttons.length);
                        hover.push(buttons[buttonIndex] ?? TanimListButtonType.main);
                    } else if (treeIndex >= this.tanimTree.length) {
                        // 鼠标位于空白处
                        hover.push(this.tanimTree.length);
                    }
                }
            } else if (
                canvasWidth - this.rightBarWidth < mouseX && mouseX < canvasWidth - 8 &&
                canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight + EdConst.tanimListLineHeight + 5 < mouseY && mouseY < canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight
            ) {
                // 鼠标位于图层列表范围内
                if (mouseX >= canvasWidth - EdConst.tanimListPaddingRight) {
                    // 右侧内边距区
                    if (wheel < 0) {
                        this.scrollLayerList(-5);
                    }
                    if (wheel > 0) {
                        this.scrollLayerList(5);
                    }
                    hover = ["layerScroll"];
                } else {
                    // 列表主区
                    if (wheel < 0) {
                        this.scrollLayerList(-2);
                    }
                    if (wheel > 0) {
                        this.scrollLayerList(2);
                    }
                    hover = ["layerList"];
                    let treeIndex = floor((mouseY - (canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight + EdConst.tanimListLineHeight)) / EdConst.tanimListLineHeight + this.layerListScroll);
                    if (0 <= treeIndex && treeIndex < this.layerTree.length) {
                        // 鼠标位于某一图层上
                        cursor = "pointer";
                        hover.push(treeIndex);
                        let buttons = this.getLayerListButtons(this.layerTree[treeIndex]);
                        let buttonIndex = clamp(floor((canvasWidth - EdConst.tanimListPaddingRight - mouseX) / EdConst.tanimListLineHeight), 0, buttons.length);
                        hover.push(buttons[buttonIndex] ?? TanimListButtonType.main);
                    } else if (treeIndex >= this.layerTree.length) {
                        // 鼠标位于空白处
                        hover.push(this.layerTree.length);
                    }
                }
            } else if (abs(canvasWidth - 4 - mouseX) <= 8 && abs(canvasHeight - 4 - mouseY) <= 8) {
                // 鼠标位于窗口右下角
                cursor = "nwse-resize";
                hover = ["border", "rb"];
            } else if (abs(canvasWidth - 4 - mouseX) <= 8) {
                // 鼠标位于窗口右侧
                cursor = "ew-resize";
                hover = ["border", "r"];
            } else if (abs(canvasHeight - 4 - mouseY) <= 8) {
                // 鼠标位于窗口下侧
                cursor = "ns-resize";
                hover = ["border", "b"];
            } else if (abs(this.leftBarWidth - mouseX) <= 3) {
                // 鼠标位于左栏右边缘
                cursor = "ew-resize";
                hover = ["innerBorder", "l"];
            } else if (abs(canvasWidth - this.rightBarWidth - mouseX) <= 3) {
                // 鼠标位于右栏左边缘
                cursor = "ew-resize";
                hover = ["innerBorder", "r"];
            } else if (
                abs(canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight - EdConst.controlBarHeight - mouseY) <= 3 &&
                this.leftBarWidth < mouseX && mouseX < canvasWidth - this.rightBarWidth
            ) {
                // 鼠标位于控制栏上边缘（调整时间轴高度的位置）
                cursor = "ns-resize";
                hover = ["innerBorder", "b"];
            } else if (
                abs(canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight - mouseY) <= 3 &&
                canvasWidth - this.rightBarWidth < mouseX && mouseX < canvasWidth
            ) {
                // 鼠标位于图层栏上边缘
                cursor = "ns-resize";
                hover = ["innerBorder", "layer"];
            }
        }
        // 鼠标行为
        if (this.mouseDragType != MouseDragType.none) {
            if (this.mouseDragType == MouseDragType.tanimTreeItem && mouseState == MouseState.leftUp) {
                // 扔下一个动画
                if (hover[0] == "tanimList" && typeof hover[1] == "number") {
                    this.dropTanimToTanims(this.mouseDragIndex, hover[1]);
                } else if (hover[0] == "layerList" && typeof hover[1] == "number") {
                    this.dropTanimToLayers(this.mouseDragIndex, hover[1])
                }
            } else if (this.mouseDragType == MouseDragType.layerTreeItem && mouseState == MouseState.leftUp) {
                // 扔下一个图层
                if (hover[0] == "layerList" && typeof hover[1] == "number") {
                    this.dropLayerToLayers(this.mouseDragIndex, hover[1])
                }
            }
        } else if (hover[0] == "header") {
            if (!hover[1]) {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.move;
                    this.mouseDragTop = this.top;
                    this.mouseDragLeft = this.left;
                }
            } else if (hover[1] == "close") {
                if (mouseState == MouseState.leftUp) {
                    this.isShow = false;
                    this.root.style.display = "none";
                    return;
                }
            } else if (hover[1] == "minimize") {
                if (mouseState == MouseState.leftUp) {
                    this.isMinimized = !this.isMinimized;
                    if (this.isMinimized) {
                        canvasWidth = EdConst.headerWidth;
                        canvasHeight = EdConst.headerHeight;
                    } else {
                        canvasWidth = this.width;
                        canvasHeight = this.height;
                    }
                    this.setCanvasSize(canvasWidth, canvasHeight);
                }
            }
        } else if (hover[0] == "border") {
            if (hover[1] == "rb") {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.size;
                    this.mouseDragWidth = this.width;
                    this.mouseDragHeight = this.height;
                }
            } else if (hover[1] == "r") {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.width;
                    this.mouseDragWidth = this.width;
                }
            } else if (hover[1] == "b") {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.height;
                    this.mouseDragHeight = this.height;
                }
            }
        } else if (hover[0] == "innerBorder") {
            if (hover[1] == "l") {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.leftBarWidth;
                    this.mouseDragWidth = this.leftBarWidth;
                }
            } else if (hover[1] == "r") {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.rightBarWidth;
                    this.mouseDragWidth = this.rightBarWidth;
                }
            } else if (hover[1] == "b") {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.timelineBarHeight;
                    this.mouseDragHeight = this.timelineBarHeight;
                }
            } else if (hover[1] == "layer") {
                if (mouseState == MouseState.leftDown) {
                    this.mouseDragType = MouseDragType.layerBarHeight;
                    this.mouseDragHeight = this.layerBarHeight;
                }
            }
        } else if (hover[0] == "newTanim") {
            if (mouseState == MouseState.leftUp) {
                // 新建动画！
                if (this.askAndCreateNewTanim()) return;
                this.updateTanimTree();
            }
        } else if (hover[0] == "tanimList") {
            if (hover[1] == this.tanimTree.length) {
                if (mouseState == MouseState.dblclick) {
                    // 双击空白处新建动画！
                    if (this.askAndCreateNewTanim()) return;
                    this.updateTanimTree();
                }
            } else if (typeof hover[1] == "number") {
                // 鼠标位于动画列表中的一个节点上
                let hoverItem = this.tanimTree[hover[1]];
                switch (hoverItem.type) {
                    case TanimItemType.tanim:
                        if (!hoverItem.tanim) break;
                        switch (hover[2]) {
                            case TanimListButtonType.main:
                                if (mouseState == MouseState.leftDown) {
                                    // 开始拖动动画
                                    this.mouseDragType = MouseDragType.tanimTreeItem;
                                    this.mouseDragIndex = hover[1];
                                } else if (mouseState == MouseState.dblclick) {
                                    // 双击动画，覆盖现有图层
                                    this.layers.length = 0;
                                    this.addToLayer(hoverItem);
                                }
                                break;
                            case TanimListButtonType.setLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 覆盖现有图层
                                    this.layers.length = 0;
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
                                    this.recycleBin.push(hoverItem.tanim);
                                    TheTanimManager.tanims.splice(idx, 1);
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
                        switch (hover[2]) {
                            case TanimListButtonType.main:
                                if (
                                    mouseState == MouseState.leftDown && 
                                    hoverItem.type == TanimItemType.folderFolded
                                ) {
                                    // 开始拖动文件夹
                                    this.mouseDragType = MouseDragType.tanimTreeItem;
                                    this.mouseDragIndex = hover[1];
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
                                    this.askAndCreateNewTanimInFolder(hoverItem.dir);
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
        } else if (hover[0] == "layerList") {
            if (typeof hover[1] == "number" && hover[1] < this.layerTree.length) {
                // 鼠标位于图层列表中的一个节点上
                let hoverItem = this.layerTree[hover[1]];
                switch (hoverItem.type) {
                    case TanimItemType.tanim:
                        if (!hoverItem.tanim) break;
                        switch (hover[2]) {
                            case TanimListButtonType.main:
                                if (mouseState == MouseState.leftDown) {
                                    // 开始拖动图层
                                    this.mouseDragType = MouseDragType.layerTreeItem;
                                    this.mouseDragIndex = hover[1];
                                }
                                break;
                            case TanimListButtonType.removeLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 移除一个图层
                                    let idx = this.layers.indexOf(hoverItem.tanim)
                                    if (idx == -1) break;
                                    this.layers.splice(idx, 1);
                                    this.updateLayerTree();
                                }
                                break;
                        }
                        break;
                    case TanimItemType.folderBegin:
                    case TanimItemType.folderEnd:
                    case TanimItemType.folderFolded:
                        let tanims = this.layers.filter(tanim => tanim.name.startsWith(hoverItem.dir.join(EdConst.tanimFolderSeparator)));
                        if (tanims.length == 0) break;
                        switch (hover[2]) {
                            case TanimListButtonType.main:
                                if (
                                    mouseState == MouseState.leftDown && 
                                    hoverItem.type == TanimItemType.folderFolded
                                ) {
                                    // 开始拖动文件夹
                                    this.mouseDragType = MouseDragType.tanimTreeItem;
                                    this.mouseDragIndex = hover[1];
                                }
                                break;
                            case TanimListButtonType.removeLayer:
                                if (mouseState == MouseState.leftUp) {
                                    // 将文件夹中的所有动画移出图层
                                    for (let tanim of tanims) {
                                        let idx = this.layers.indexOf(tanim)
                                        if (idx == -1) continue;
                                        this.layers.splice(idx, 1);
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
        }
        // 处理拖动
        if (mouseEvent && mouseState == MouseState.move) {
            switch (this.mouseDragType) {
                case MouseDragType.move:
                    cursor = "move";
                    break;
                case MouseDragType.width:
                case MouseDragType.leftBarWidth:
                case MouseDragType.rightBarWidth:
                    cursor = "ew-resize";
                    break;
                case MouseDragType.height:
                case MouseDragType.timelineBarHeight:
                case MouseDragType.layerBarHeight:
                    cursor = "ns-resize";
                    break;
                case MouseDragType.size:
                    cursor = "nwse-resize";
                    break;
                case MouseDragType.tanimTreeItem:
                case MouseDragType.layerTreeItem:
                    if (hover[0] == "tanimList" || hover[0] == "layerList") {
                        cursor = "grabbing";
                    } else {
                        cursor = "no-drop";
                    }
                    break;
            }
            if (this.mouseDragType == MouseDragType.tanimTreeItem || this.mouseDragType == MouseDragType.layerTreeItem) {
                mouseEvent.preventDefault();
            } else if (this.mouseDragType == MouseDragType.move) {
                mouseEvent.preventDefault();
                this.left = clamp(this.mouseDragLeft + this.mouseClientX - this.mouseDragClientX, 5, window.innerWidth - canvasWidth - 5);
                this.top = clamp(this.mouseDragTop + this.mouseClientY - this.mouseDragClientY, isGandi ? 65 : 53, window.innerHeight - canvasHeight - 5);
                this.setPosition();
            } else {
                let resized = false;
                if (this.mouseDragType == MouseDragType.width || this.mouseDragType == MouseDragType.size) {
                    mouseEvent.preventDefault();
                    this.width = clamp(
                        this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX,
                        EdConst.leftBarWidthMin + EdConst.previewWidthMin + EdConst.rightBarWidthMin,
                        window.innerWidth - this.left - 5
                    );
                    let d = (this.leftBarWidth + this.rightBarWidth + EdConst.previewWidthMin) - canvasWidth;
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
                    mouseEvent.preventDefault();
                    this.height = clamp(
                        this.mouseDragHeight + this.mouseClientY - this.mouseDragClientY,
                        EdConst.headerHeight + max(
                            EdConst.previewHeightMin + EdConst.controlBarHeight + EdConst.timelineBarHeightMin,
                            EdConst.keyframeBarHeight + EdConst.layerBarHeightMin + EdConst.tanimListHeightMin
                        ) + EdConst.hintBarHeight,
                        window.innerHeight - this.top - 5
                    );
                    let d = (EdConst.headerHeight + EdConst.previewHeightMin + EdConst.controlBarHeight + this.timelineBarHeight + EdConst.hintBarHeight) - canvasHeight;
                    if (d > 0) {
                        this.timelineBarHeight -= d;
                    }
                     d = (EdConst.headerHeight + EdConst.keyframeBarHeight + this.layerBarHeight + EdConst.tanimListHeightMin + EdConst.hintBarHeight) - canvasHeight;
                    if (d > 0) {
                        this.layerBarHeight -= d;
                    }
                    resized = true;
                }
                if (this.mouseDragType == MouseDragType.leftBarWidth) {
                    mouseEvent.preventDefault();
                    this.leftBarWidth = clamp(
                        this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX,
                        EdConst.leftBarWidthMin,
                        canvasWidth - EdConst.previewWidthMin - EdConst.rightBarWidthMin
                    );
                    let d = (this.leftBarWidth + this.rightBarWidth + EdConst.previewWidthMin) - canvasWidth;
                    if (d > 0) {
                        this.rightBarWidth -= d;
                    }
                } else if (this.mouseDragType == MouseDragType.rightBarWidth) {
                    mouseEvent.preventDefault();
                    this.rightBarWidth = clamp(
                        this.mouseDragWidth + this.mouseDragClientX - this.mouseClientX,
                        EdConst.rightBarWidthMin,
                        canvasWidth - EdConst.previewWidthMin - EdConst.leftBarWidthMin
                    );
                    let d = (this.leftBarWidth + this.rightBarWidth + EdConst.previewWidthMin) - canvasWidth;
                    if (d > 0) {
                        this.leftBarWidth -= d;
                    }
                } else if (this.mouseDragType == MouseDragType.timelineBarHeight) {
                    mouseEvent.preventDefault();
                    this.timelineBarHeight = clamp(
                        this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY,
                        EdConst.timelineBarHeightMin,
                        canvasHeight - EdConst.hintBarHeight - EdConst.controlBarHeight - EdConst.previewHeightMin - EdConst.headerHeight
                    );
                } else if (this.mouseDragType == MouseDragType.layerBarHeight) {
                    mouseEvent.preventDefault();
                    this.layerBarHeight = clamp(
                        this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY,
                        EdConst.layerBarHeightMin,
                        canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - EdConst.tanimListHeightMin - EdConst.headerHeight
                    );
                }
                if (resized) this.setCanvasSize();
            }
        }
        if (mouseState == MouseState.leftUp || mouseState == MouseState.rightUp || mouseState == MouseState.middleUp) {
            this.mouseDragType = MouseDragType.none;
        }
        this.scrollTanimList(0, canvasHeight);
        this.scrollLayerList(0);


        if (this.mouseDragType != MouseDragType.move) {
            // 更新画面
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            if (!this.isMinimized) {
                // 绘制时间轴
                this.drawTimelineBar(
                    this.leftBarWidth, 
                    canvasHeight - EdConst.hintBarHeight,
                    canvasWidth - this.rightBarWidth,
                    canvasHeight - EdConst.hintBarHeight - this.timelineBarHeight
                );

                // 绘制控制栏
                this.drawControlBar(
                    this.leftBarWidth,
                    canvasHeight - this.timelineBarHeight - EdConst.hintBarHeight,
                    canvasWidth - this.rightBarWidth,
                    canvasHeight - this.timelineBarHeight - EdConst.hintBarHeight - EdConst.controlBarHeight
                );

                // 绘制属性栏
                this.drawTValueBar(0, EdConst.headerHeight, this.leftBarWidth, canvasHeight - EdConst.hintBarHeight);

                // 绘制右栏
                this.drawRightBar(
                    canvasWidth - this.rightBarWidth,
                    EdConst.headerHeight,
                    canvasWidth,
                    canvasHeight - EdConst.hintBarHeight
                );

                // 绘制动画列表
                this.drawTanimList(
                    "tanimList",
                    canvasWidth - this.rightBarWidth + 1,
                    EdConst.headerHeight,
                    canvasWidth,
                    canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight,
                    hover,
                    [MouseDragType.none, MouseDragType.tanimTreeItem].includes(this.mouseDragType) ? UIState.hover : UIState.none,
                    this.tanimListScroll
                );

                // 绘制新建动画按钮
                this.drawTanimListButton(
                    TanimListButtonType.new,
                    canvasWidth - EdConst.tanimListPaddingRight - EdConst.tanimListLineHeight / 2,
                    EdConst.headerHeight + EdConst.tanimListLineHeight / 2,
                    EdConst.tanimListLineHeight,
                    EdConst.tanimListLineHeight,
                    hover[0] == "newTanim" && this.mouseDragType == MouseDragType.none ? UIState.hover : UIState.none
                );

                // 绘制图层栏
                this.drawTanimList(
                    "layerList",
                    canvasWidth - this.rightBarWidth + 1,
                    canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight - this.layerBarHeight,
                    canvasWidth,
                    canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight,
                    hover,
                    [MouseDragType.none, MouseDragType.tanimTreeItem, MouseDragType.layerTreeItem].includes(this.mouseDragType) ? UIState.hover : UIState.none,
                    this.layerListScroll
                );

                // 绘制关键帧面板
                this.drawKeyframeBar(
                    canvasWidth - this.rightBarWidth + 1,
                    canvasHeight - EdConst.hintBarHeight - EdConst.keyframeBarHeight,
                    canvasWidth,
                    canvasHeight - EdConst.hintBarHeight
                );

                // 绘制底部提示栏
                this.drawHintBar(canvasHeight, canvasWidth, EdConst.hintBarHeight);
            }
            // 绘制顶栏
            this.drawHeader(canvasWidth, EdConst.headerHeight);
            // 绘制右上角按钮
            this.drawClose(
                canvasWidth - EdConst.headerButtonWidth / 2, EdConst.headerHeight / 2, EdConst.headerButtonWidth, EdConst.headerHeight,
                hover[0] == "header" && hover[1] == "close" && this.mouseDragType == MouseDragType.none ? UIState.hover : UIState.none
            );
            this.drawMinimize(
                canvasWidth - EdConst.headerButtonWidth * 1.5, EdConst.headerHeight / 2, EdConst.headerButtonWidth, EdConst.headerHeight,
                hover[0] == "header" && hover[1] == "minimize" && this.mouseDragType == MouseDragType.none ? UIState.hover : UIState.none
            );
        }

        if (cursor != this.cursor) {
            this.cursor = cursor;
            this.root.style.cursor = cursor;
        }
    }

    

    /** 控制栏  
     * 锚点：左下, 右上 */
    drawControlBar(x1: number, y1: number, x2: number, y2: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #e6e6e6"
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        // 下边缘
        ctx.moveTo(
            x1,
            y1 - 0.5
        );
        ctx.lineTo(
            x2,
            y1 - 0.5
        );
        // 上边缘
        ctx.moveTo(
            x1,
            y2 - 0.5
        );
        ctx.lineTo(
            x2,
            y2 - 0.5
        );
        ctx.stroke();

        ctx.restore();
    }

    /** 时间轴  
     * 锚点：左上，右下 */
    drawTimelineBar(x1: number, y1: number, x2: number, y2: number) {
        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #ffffff"
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.restore();
    }

    /** 属性栏  
     * 锚点：左上，右下 */
    drawTValueBar(x1: number, y1: number, x2: number, y2: number) {
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
    drawTanimList(type: "tanimList" | "layerList", x1: number, y1: number, x2: number, y2: number, hover: Hover, uiState: UIState, scroll: number) {
        // 一坨敏捷开发出来的屎，也叫窜稀
        let tanimTree = type == "tanimList" ? this.tanimTree : this.layerTree;
        let tanimFolders = type == "tanimList" ? this.tanimFolders : this.layerFolders;

        let ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = " #f2f2f2";
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = "bold " + EdConst.tanimNameFont;
        ctx.fillStyle = " #666666";
        ctx.fillText(getTranslate(type == "tanimList" ? Strings.eTanimListTitle : Strings.eLayerListTitle), x1 + 6.5, y1 + EdConst.tanimListLineHeight / 2);

        ctx.strokeStyle = " #b3b3b3";
        for (let folderName in tanimFolders) {
            let {color, indentation, ranges} = tanimFolders[folderName];
            for (let {from, to} of ranges) {
                let bgy1 = y1 + EdConst.tanimListLineHeight * (from + 1 - scroll) - 0.5;
                let bgy2 = y1 + EdConst.tanimListLineHeight * (to + 1 - scroll) - 0.5;

                if (bgy2 < y1 + EdConst.tanimListLineHeight) continue;
                if (bgy1 > y2) continue;

                let bgx1 = x1 + 6.5 + EdConst.tanimListIndentationWidth * indentation;
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

        ctx.font = EdConst.tanimNameFont;
        ctx.lineWidth = 1;
        for (let i = 0; i <= tanimTree.length; i++) {
            if (EdConst.tanimListLineHeight * (i - scroll) < 0) continue;
            if (y1 + EdConst.tanimListLineHeight * (i + 1 - scroll) > y2) break;
            let isDragStart = this.mouseDragIndex == i && (this.mouseDragType == (type == "tanimList" ? MouseDragType.tanimTreeItem : MouseDragType.layerTreeItem));
            if (hover[0] == type && hover[1] == i && uiState == UIState.hover) {
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
                        ctx.moveTo(x1 + 6.5, y1 + EdConst.tanimListLineHeight * (i + 1 - scroll));
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
                        ctx.fillRect(x1 + 6.5, y1 + EdConst.tanimListLineHeight * (i + 1 - scroll), x2 - EdConst.tanimListPaddingRight - (x1 + 6.5), EdConst.tanimListLineHeight);
                    }
                }
            }

            if (!tanimTree[i]) continue;

            // 拖动起点处的标记
            if (isDragStart) {
                ctx.fillStyle = " #cccccc66";
                ctx.fillRect(x1 + 6.5, y1 + EdConst.tanimListLineHeight * (i + 1 - scroll), x2 - EdConst.tanimListPaddingRight - (x1 + 6.5), EdConst.tanimListLineHeight);
            }

            // 获取节点右侧都有哪些按钮。我知道这么写可能会恶心人，但返回函数的语句真的很他妈酷！
            let buttons = (type == "tanimList" ? this.getTanimListButtons : this.getLayerListButtons)(tanimTree[i]);

            // 绘制节点主体
            this.drawTanimListItem(
                tanimTree[i], x1 + 6.5, y1 + EdConst.tanimListLineHeight * (1 - scroll), i,
                x2- EdConst.tanimListPaddingRight - buttons.length * EdConst.tanimListLineHeight - (x1 + 6.5 + EdConst.tanimListIndentationWidth * tanimTree[i].indentation)
            );

            // 绘制节点右侧按钮
            for (let j = 0; j < buttons.length; j++) {
                this.drawTanimListButton(
                    buttons[j],
                    x2 - EdConst.tanimListPaddingRight - EdConst.tanimListLineHeight * (j + 0.5),
                    y1 + EdConst.tanimListLineHeight * (i + 1.5 - scroll),
                    EdConst.tanimListLineHeight,
                    EdConst.tanimListLineHeight,
                    hover[0] == type && hover[1] == i && hover[2] == buttons[j] ? uiState : UIState.none
                );
            }
        }

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1 - 0.5);
        ctx.lineTo(x2, y1 - 0.5);
        ctx.stroke();

        ctx.restore();
    }

    drawTanimListItem({text: text, type, indentation}: TanimTreeItem, x: number, y: number, pos: number, maxWidth: number) {
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
    drawTanimListButton(type: TanimListButtonType,x: number, y: number, w: number, h: number, uiState: UIState) {
        let ctx = this.ctx;
        ctx.save();

        if (uiState == UIState.hover) {
            ctx.fillStyle = " #99999966";
            ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }

        ctx.strokeStyle = " #666666";
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
            default:
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

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1 - 0.5);
        ctx.lineTo(x2, y1 - 0.5);
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
        ctx.fillStyle = " #666666";
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
        ctx.font = EdConst.headerFont;
        ctx.fillStyle = " #666666";
        ctx.fillText(this.hint, 8, y - h / 2);

        ctx.strokeStyle = " #666666";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y - h + 0.5);
        ctx.lineTo(w, y - h + 0.5);
        ctx.stroke();

        ctx.restore();
    }
}

let TheTanimEditor: TanimEditor | undefined;



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
                text: getTranslate(Strings.buttonDoc),
                func: "OnClickDocButton",
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

    OnClickDocButton(): void {

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
        if (tanimNames.length == 0) tanimNames.push({ text: getTranslate(Strings.noTanim), value: "" });
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
        if (!tanim) return SafeTValue(null, tanimValueType);
        return SafeTValue(tanim.getTValue(tanimValueType, time, timeUnit, loopMode), tanimValueType);
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
        return SafeTValue(TheTanimManager.context[tanimValueType], tanimValueType);
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
        if (snapshot === null) return SafeTValue(null, tanimValueType);
        tanimValueType = Cast.toString(tanimValueType);
        return SafeTValue(snapshot[tanimValueType], tanimValueType);
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

})(Scratch);
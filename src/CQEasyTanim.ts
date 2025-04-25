/**
 * Easy Tanim  beta0.0.0
 * 本扩展能够轻松实现时间轴动画。内置动画编辑器，完美兼容turbowarp。
 * 
 * 作者：苍穹
 * 感谢 arkos、白猫、simple、允某、酷可mc 等人，他们给我提供了许多帮助，在此不一一列举。（太多了列不出来）
 * arkos 真的给我提供了很多技术上的帮助，教我怎么写扩展，我爱他❤️
 * 一些缓动函数抄自https://blog.51cto.com/u_15057855/4403832 （从Animator扩展那里翻到的链接，非常感谢！）
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

if (!Scratch.extensions.unsandboxed) {
    throw new Error('Easy Tanim must run unsandboxed!');
}

const vm = Scratch.vm;
const isGandi: boolean = vm.runtime.gandi ? true : false;

const theExtID = "cqeasytanim"

const enum Strings {
    extName = "CQEasyTanim_extName",

    bGetTanimValue = "CQEasyTanim_bGetTanimValue",
    bSetContext = "CQEasyTanim_bSetContext",
    bGetContextValue = "CQEasyTanim_bGetContextValue",
    bCreateSnapshot = "CQEasyTanim_bCreateSnapshot",
    bTransitSnapshot = "CQEasyTanim_bTransitSnapshot",
    bGetSnapshotValue = "CQEasyTanim_bGetSnapshotValue",
    bSetContextBySnapshot = "CQEasyTanim_bSetContextBySnapshot",
    bDeleteSnapshot = "CQEasyTanim_bDeleteSnapshot",
    bDeleteAllSnapshot = "CQEasyTanim_bDeleteAllSnapshot",
    bGetTanimInfo = "CQEasyTanim_bGetTanimInfo",
    bGetTanimEditorInfo = "CQEasyTanim_bGetTanimEditorInfo",

    mLoopMode_loop = "mLoopMode_loop",
    mLoopMode_once = "mLoopMode_once",
    mLoopMode_loopYoyo = "mLoopMode_loopYoyo",
    mLoopMode_onceYoyo = "mLoopMode_onceYoyo",

    mTimeUnit_second = "mTimeUnit_second",
    mTimeUnit_frame = "mTimeUnit_frame",

    mTanimValueType_px = "mTanimValueType_px",
    mTanimValueType_py = "mTanimValueType_py",
    mTanimValueType_s = "mTanimValueType_s",
    mTanimValueType_sx = "mTanimValueType_sx",
    mTanimValueType_sy = "mTanimValueType_sy",
    mTanimValueType_sq = "mTanimValueType_sq",
    mTanimValueType_sqx = "mTanimValueType_sqx",
    mTanimValueType_sqy = "mTanimValueType_sqy",
    mTanimValueType_d = "mTanimValueType_d",
    mTanimValueType_cos = "mTanimValueType_cos",

    mTanimInfoType_lengthSec = "mTanimInfoType_lengthSec",
    mTanimInfoType_length = "mTanimInfoType_length",
    mTanimInfoType_fps = "mTanimInfoType_fps",

    mTanimEditorInfoType_time = "mTanimEditorInfoType_time",
    mTanimEditorInfoType_anim = "mTanimEditorInfoType_anim",
    mTanimEditorInfoType_sprite = "mTanimEditorInfoType_sprite",
    mTanimEditorInfoType_cosPrefix = "mTanimEditorInfoType_cosPrefix",
    mTanimEditorInfoType_cosName = "mTanimEditorInfoType_cosName",
    mTanimEditorInfoType_cosSuffix = "mTanimEditorInfoType_cosSuffix",

    labelContext = "labelContext",
    labelSnapshot = "labelSnapshot",
    labelUtils = "labelUtils",

    buttonDoc = "buttonDoc",
    buttonEditor = "buttonEditor",

    noTanimPleaseCreate = "CQEasyTanim_noTanimPleaseCreate",
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

        [Strings.bSetContext]: "将语境设为 [tanimName] [loopMode] 的第 [time] [timeUnit]",
        [Strings.bGetContextValue]: "语境的 [tanimValueType]",

        [Strings.bCreateSnapshot]: "为动画 [tanimName] [loopMode] 的第 [time] [timeUnit] 创建快照",
        [Strings.bTransitSnapshot]: "从快照 [snapshotIndexA] 到 [snapshotIndexB] 过渡，创建 [transitT] 处的快照",
        [Strings.bGetSnapshotValue]: "快照 [snapshotIndex] 的 [tanimValueType]",
        [Strings.bSetContextBySnapshot]: "将语境设为快照 [snapshotIndex]",
        [Strings.bDeleteSnapshot]: "删除快照 [snapshotIndex]",
        [Strings.bDeleteAllSnapshot]: "删除所有快照",

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

        [Strings.noTanimPleaseCreate]: "- 未创建动画 -",
    },
}

Scratch.translate.setup(translates);

function getTranslate(id: Strings): string {
    return Scratch.translate({ id: id, default: translates["zh-cn"][id], });
}

function GetSafeCommentID(base: string): string {
    let ids = [];
    for (let i in vm.runtime.targets) {
        let t = vm.runtime.targets[i];
        for (let j in t.comments) {
            ids.push(t.comments[j].id);
        }
    }
    if (ids.indexOf(base) < 0) return base;
    for (let i = 2; ids.indexOf(base + i) < 0; i++) continue;
    return base;
}

function clamp(x: number, a: number, b: number) {
    return Math.max(a, Math.min(x, b));
}

function sqToSqx(sq: number) {
    return sq > 0 ? (100 + sq) / 100 : 100 / (100 - sq);
}

function sqToSqy(sq: number) {
    return sq > 0 ? 100 / (100 + sq) : (100 - sq) / 100;
}

let { exp, pow, PI, sin, sqrt } = Math;

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
                if (this.tValueTypes.indexOf(timeline.tValueType) == -1) {
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

class TanimEditor {
    time: number;
    tanim: Tanim | null;
    sprite: Target | null;
    costume: [string, string, string];

    constructor() {
        this.time = 0;
        this.tanim = null;
        this.sprite = null;
        this.costume = ["", "", ""];
    }
}

const TheTanimEditor = new TanimEditor();



class CQEasyTanim {
    getInfo() { return {
        id: theExtID,
        name: getTranslate(Strings.extName),
        color1: "#12b322",
        color2: "#0e8c1b",
        color3: "#0a6613",
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
            {
                opcode: Opcode.BGetTanimEditorInfo,
                blockType: Scratch.BlockType.REPORTER,
                text: getTranslate(Strings.bGetTanimEditorInfo),
                arguments: {
                    tanimEditorInfoType: {
                        type: Scratch.ArgumentType.STRING,
                        menu: MenuName.MTanimEditorInfoType,
                    },
                },
            },
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
            [MenuName.MTanimEditorInfoType]: {
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
            },
        },
    }; }

    OnClickDocButton(): void {

    }

    OnClickEditorButton(): void {

    }

    MGetTanimNames(): MenuItem[] {
        let tanimNames: MenuItem[] = [];
        for (let i = 0; i < TheTanimManager.tanims.length; i++) {
            let name = TheTanimManager.tanims[i].name;
            tanimNames.push({ text: name, value: name });
        }
        if (tanimNames.length == 0) tanimNames.push({ text: getTranslate(Strings.noTanimPleaseCreate), value: "" });
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
        tanimName = Scratch.Cast.toString(tanimName);
        time = Scratch.Cast.toNumber(time);
        tanimValueType = Scratch.Cast.toString(tanimValueType);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return SafeTValue(null, tanimValueType);
        return SafeTValue(tanim.getTValue(tanimValueType, time, timeUnit, loopMode), tanimValueType);
    }

    [Opcode.BSetContext]({tanimName, loopMode, time, timeUnit}: any): void {
        tanimName = Scratch.Cast.toString(tanimName);
        time = Scratch.Cast.toNumber(time);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return;
        TheTanimManager.context = tanim.getSnapshot(time, timeUnit, loopMode);
    }

    [Opcode.BGetContextValue]({tanimValueType}: any): TValue {
        tanimValueType = Scratch.Cast.toString(tanimValueType);
        return SafeTValue(TheTanimManager.context[tanimValueType], tanimValueType);
    }

    [Opcode.BCreateSnapshot]({tanimName, loopMode, time, timeUnit}: any): number {
        tanimName = Scratch.Cast.toString(tanimName);
        time = Scratch.Cast.toNumber(time);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return 0;
        let snapshot = tanim.getSnapshot(time, timeUnit, loopMode);
        let index = TheTanimManager.allocateSnapshotIndex(snapshot);
        return index + 1;
    }

    [Opcode.BTransitSnapshot]({snapshotIndexA, snapshotIndexB, transitT}: any): number {
        snapshotIndexA = Scratch.Cast.toNumber(snapshotIndexA);
        snapshotIndexB = Scratch.Cast.toNumber(snapshotIndexB);
        transitT = Scratch.Cast.toNumber(transitT);
        let snapshotA = TheTanimManager.getSnapshotByIndex(snapshotIndexA - 1);
        if (snapshotA === null) return 0;
        let snapshotB = TheTanimManager.getSnapshotByIndex(snapshotIndexB - 1);
        if (snapshotB === null) return 0;
        let snapshot = TheTanimManager.transitSnapshot(snapshotA, snapshotB, clamp(transitT, 0, 1));
        let index = TheTanimManager.allocateSnapshotIndex(snapshot);
        return index + 1;
    }

    [Opcode.BGetSnapshotValue]({snapshotIndex, tanimValueType}: any): TValue {
        snapshotIndex = Scratch.Cast.toNumber(snapshotIndex);
        let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
        if (snapshot === null) return SafeTValue(null, tanimValueType);
        tanimValueType = Scratch.Cast.toString(tanimValueType);
        return SafeTValue(snapshot[tanimValueType], tanimValueType);
    }

    [Opcode.BSetContextBySnapshot]({snapshotIndex}: any): void {
        snapshotIndex = Scratch.Cast.toNumber(snapshotIndex);
        let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
        if (snapshot === null) return;
        TheTanimManager.context = snapshot;
    }

    [Opcode.BDeleteSnapshot]({snapshotIndex}: any): void {
        snapshotIndex = Scratch.Cast.toNumber(snapshotIndex);
        TheTanimManager.recycleSnapshotIndex(snapshotIndex - 1)
    }

    [Opcode.BDeleteAllSnapshot](): void {
        TheTanimManager.recycleAllSnapshot();
    }

    [Opcode.BGetTanimInfo]({tanimName, tanimInfoType}: any): number{
        tanimName = Scratch.Cast.toString(tanimName);
        let tanim = TheTanimManager.getTanimByName(tanimName);
        if (!tanim) return 0;
        tanimInfoType = Scratch.Cast.toString(tanimInfoType);
        switch (tanimInfoType) {
            case TInfoType.lengthSec:
                return Scratch.Cast.toNumber(tanim.length / tanim.fps);
            case TInfoType.length:
                return Scratch.Cast.toNumber(tanim.length);
            case TInfoType.fps:
                return Scratch.Cast.toNumber(tanim.fps);
            default:
                return 0;
        }
    }

    [Opcode.BGetTanimEditorInfo]({tanimEditorInfoType}: any): number | string {
        tanimEditorInfoType = Scratch.Cast.toString(tanimEditorInfoType);
        switch (tanimEditorInfoType) {// ⚠️⚠️⚠️ 施工中 ⚠️⚠️⚠️
            case TEditorInfoType.time:
                return "";
            default:
                return 0;
        }
    }
}

Scratch.extensions.register(new CQEasyTanim());

})(Scratch);
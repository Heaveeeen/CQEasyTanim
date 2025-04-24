/**
 * Easy Tanim  beta0.0.0
 * 本扩展能够轻松实现时间轴动画。内置动画编辑器，完美兼容turbowarp。
 * 
 * 作者：苍穹
 * 感谢 arkos、白猫、simple 等人，他们给我提供了许多帮助。
 * 本扩展从 Animator 扩展中找来了一些参考资料和插值函数，非常感谢。
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

const vm = Scratch.vm;
const isGandi: boolean = vm.runtime.gandi ? true : false;

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

let { exp, pow, PI, sin, sqrt } = Math;

type Interfn = (x1: number, y1: number, x2: number, y2: number, x: number, ...args: any[]) => number;
type Mapfn = (t: number, ...args: any[]) => number;

class InterpolationFactory {
    static InterMap(mfn: Mapfn): Interfn {
        return (x1: number, y1: number, x2: number, y2: number, x: number, ...args: any[]) => {
            let t = (x - x1) / (x2 - x1);
            let r = mfn(t, ...args);
            return (1 - r) * y1 + r * y2;
        };
    };

    static MapReverse(mfn: Mapfn): Mapfn {
        return (t: number, ...args: any[]) => 1 - mfn(1 - t, ...args);
    };
    static MapForwardReverse(mfn: Mapfn): Mapfn {
        return (t: number, ...args: any[]) => {
            if (t <= 0.5) {
                return mfn(t * 2, ...args) / 2;
            } else {
                return 1 - mfn((1 - t) * 2, ...args) / 2;
            }
        }
    };
    static MapReverseForward(mfn: Mapfn): Mapfn {
        return (t: number, ...args: any[]) => {
            if (t <= 0.5) {
                return (1 - mfn(1 - t * 2, ...args)) / 2;
            } else {
                return (1 + mfn(2 * t - 1, ...args)) / 2;
            }
        }
    };
}

/**
 * 一些缓动函数抄自https://blog.51cto.com/u_15057855/4403832 （从Animator扩展那里翻到的链接）
 * 这些ease函数都接受四个参数，转换为我使用的Inter函数即为：
 * t = x - x1
 * b = y1
 * c = y2
 * d = x2 - x1
 * 可以直接修改参数使其从(0,0)指向(1,1)，变为我Map函数：
 * t = t
 * b = 0
 * c = 1
 * d = 1
 */

/** 一系列插值函数，有的是我自己写的，有的是上网找的。
 * 
 * Inter函数接受两个端点的坐标和横坐标，返回插值结果。
 * 
 * Map函数接受一个t，返回一个插值度，从0到1。
 */

class InterpolationFunctions {

    static InterLerp = InterpolationFactory.InterMap(t => t);


    static MapPowerF = (t: number, n: number) => pow(t, n);
    static MapPowerR = InterpolationFactory.MapReverse(this.MapPowerF);
    static MapPowerFR = InterpolationFactory.MapForwardReverse(this.MapPowerF);
    static MapPowerRF = InterpolationFactory.MapReverseForward(this.MapPowerF);

    static InterPowerF = InterpolationFactory.InterMap(this.MapPowerF);
    static InterPowerR = InterpolationFactory.InterMap(this.MapPowerR);
    static InterPowerFR = InterpolationFactory.InterMap(this.MapPowerFR);
    static InterPowerRF = InterpolationFactory.InterMap(this.MapPowerRF);


    static MapExpIn = (t: number, n: number) => (exp(n * t) - 1) / (exp(n) - 1);
    /*{
        let a = exp(n);
        return (pow(a, t) - 1) / (a - 1);
    }*/
    static MapExpOut = InterpolationFactory.MapReverse(this.MapExpIn);
    static MapExpInOut = InterpolationFactory.MapForwardReverse(this.MapExpIn);
    static MapExpOutIn = InterpolationFactory.MapReverseForward(this.MapExpIn);

    static InterExpIn = InterpolationFactory.InterMap(this.MapExpIn);
    static InterExpOut = InterpolationFactory.InterMap(this.MapExpOut);
    static InterExpInOut = InterpolationFactory.InterMap(this.MapExpInOut);
    static InterExpOutIn = InterpolationFactory.InterMap(this.MapExpOutIn);


    static MapSineIn = (t: number) => sin(t * 2 / PI);
    static MapSineOut = InterpolationFactory.MapReverse(this.MapSineIn);
    static MapSineInOut = InterpolationFactory.MapForwardReverse(this.MapSineIn);
    static MapSineOutIn = InterpolationFactory.MapReverseForward(this.MapSineIn);

    static InterSineIn = InterpolationFactory.InterMap(this.MapSineIn);
    static InterSineOut = InterpolationFactory.InterMap(this.MapSineOut);
    static InterSineInOut = InterpolationFactory.InterMap(this.MapSineInOut);
    static InterSineOutIn = InterpolationFactory.InterMap(this.MapSineOutIn);


    static MapCircIn = (t: number) => sqrt(1 - pow(t, 2));
    static MapCircOut = InterpolationFactory.MapReverse(this.MapCircIn);
    static MapCircInOut = InterpolationFactory.MapForwardReverse(this.MapCircIn);
    static MapCircOutIn = InterpolationFactory.MapReverseForward(this.MapCircIn);

    static InterCircIn = InterpolationFactory.InterMap(this.MapCircIn);
    static InterCircOut = InterpolationFactory.InterMap(this.MapCircOut);
    static InterCircInOut = InterpolationFactory.InterMap(this.MapCircInOut);
    static InterCircOutIn = InterpolationFactory.InterMap(this.MapCircOutIn);


    static MapElasticIn = (t: number, m: number, n: number) => ((exp(n * t) - 1) / (exp(n) - 1)) * sin(2 * PI * (m * (t - 1) + 0.25));
    /*{
        let a = exp(n);
        return ((pow(a, t) - 1) / (a - 1)) * sin(2 * PI * (m * (t - 1) + 0.25));
    }*/
    static MapElasticOut = InterpolationFactory.MapReverse(this.MapElasticIn);
    static MapElasticInOut = InterpolationFactory.MapForwardReverse(this.MapElasticIn);
    static MapElasticOutIn = InterpolationFactory.MapReverseForward(this.MapElasticIn);

    static InterElasticIn = InterpolationFactory.InterMap(this.MapElasticIn);
    static InterElasticOut = InterpolationFactory.InterMap(this.MapElasticOut);
    static InterElasticInOut = InterpolationFactory.InterMap(this.MapElasticInOut);
    static InterElasticOutIn = InterpolationFactory.InterMap(this.MapElasticOutIn);


    static MapBackIn = (t: number, s: number) => t * t * ((s + 1) * t - s);
    static MapBackOut = InterpolationFactory.MapReverse(this.MapBackIn);
    static MapBackInOut = InterpolationFactory.MapForwardReverse(this.MapBackIn);
    static MapBackOutIn = InterpolationFactory.MapReverseForward(this.MapBackIn);

    static InterBackIn = InterpolationFactory.InterMap(this.MapBackIn);
    static InterBackOut = InterpolationFactory.InterMap(this.MapBackOut);
    static InterBackInOut = InterpolationFactory.InterMap(this.MapBackInOut);
    static InterBackOutIn = InterpolationFactory.InterMap(this.MapBackOutIn);

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
    static MapBounceIn = InterpolationFactory.MapReverse(this.MapBounceOut);
    static MapBounceInOut = InterpolationFactory.MapForwardReverse(this.MapBounceIn);
    static MapBounceOutIn = InterpolationFactory.MapReverseForward(this.MapBounceIn);

    static InterBounceIn = InterpolationFactory.InterMap(this.MapBounceIn);
    static InterBounceOut = InterpolationFactory.InterMap(this.MapBounceOut);
    static InterBounceInOut = InterpolationFactory.InterMap(this.MapBounceInOut);
    static InterBounceOutIn = InterpolationFactory.InterMap(this.MapBounceOutIn);


    static InterTradExp = (x1: number, y1: number, x2: number, y2: number, x: number, v: number, p: number) => {
        let a = pow(1 - 1 / v, p * (x2 - x1));
        let t = (x - x1) / (x2 - x1);
        let r = (pow(a, t) - 1) / (a - 1);
        return (1 - r) * y1 + r * y2;
    }


    static InterLag2 = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x: number) => {
        let l1 = (y1 * (x - x2) * (x - x3)) / ((x1 - x2) * (x1 - x3));
        let l2 = (y2 * (x - x1) * (x - x3)) / ((x2 - x1) * (x2 - x3));
        let l3 = (y3 * (x - x1) * (x - x2)) / ((x3 - x1) * (x3 - x2));
        return l1 + l2 + l3;
    }

    static CalcBezier3 = (p1: number, p2: number, p3: number, p4: number, t: number) =>
        p1 * pow(1 - t, 3) + p2*3 * pow(1 - t, 2)*t + p3*3 * (1 - t)*pow(t, 2) + p4 * pow(t, 3);
    // 牛顿法求近似解
    static InterBezier3 = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, x: number) => {
        let f = (t: number) => this.CalcBezier3(x1, x2, x3, x4, t);
        let t = (x - x1) / (x4 - x1);
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
        return this.CalcBezier3(y1, y2, y3, y4, t);
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

/** 各种特殊属性的默认值 */
const DefaultTValues: {[key: string]: TValue} = {
    px: 0,
    py: 0,
    s: 100,
    sx: 100,
    sy: 100,
    sq: 0,
    sqx: 1,
    sqy: 1,
    d: 90,
    cos: "",
}

/** 如果一个动画值是空值，则返回其默认值 */
function SafeGetTValue(tValue: TValue | null | undefined, tValueType: string): TValue {
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

    static Ease(x: number, left: Keyframe, right: Keyframe): TValue {
        let interType = left.interType;
        let { x: x1, y: y1 } = left;
        let { x: x2, y: y2 } = right;
        if (typeof y1 == "string" || typeof y2 == "string") {
            return y1;
        }
        let params = left.params ?? {};
        let fn = InterpolationFunctions;
        switch (interType) {
            case InterType.const:
                return y1;
                break;
            case InterType.linear:
                return fn.InterLerp(x1, y1, x2, y2, x);
                break;
            case InterType.power:
                switch (params["easeType"]) {
                    case EaseType.out:
                        return fn.InterPowerF
                        break;
                
                    default:
                    case EaseType.in:
                        break;
                }
            default:
                return y1;
                break;
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
            return SafeGetTValue(null, this.tValueType);
        }
        if (!right) {
            return SafeGetTValue(left.y, this.tValueType);
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

    getTValue(tValueType: string, time: number, timeUnit: TimeUnit, loopMode: LoopMode): TValue | null {
        let timeline = this.getTimelineByTValueType(tValueType);
        if (!timeline) return null;
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
        return timeline.getTValueByFrame(time);
    }
}

/** 用于装载所有动画的管理器 */
class TanimManager {
    tanims: Tanim[];
    context: Snapshot;
    snapshots: Snapshot[];

    constructor(tanims: Tanim[]) {
        this.tanims = tanims;
        this.context = {};
        this.snapshots = [];
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

    getContextValue(tValueType: string) {
        return SafeGetTValue(this.context[tValueType], tValueType);
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

}

const TheTanimEditor = new TanimEditor();



class CQEasyTanim {
    getInfo() { return {
        id: "cqeasytanim",
        name: "Easy Tanim",
        color1: "#12b322",
        color2: "#0e8c1b",
        color3: "#0a6613",
        blocks: [
            {
                opcode: "SPEAK",
                blockType: Scratch.BlockType.COMMAND,
                text: "[VOICE] speaks [TEXT] P [PITCH] R [RATE] V [VOLUME]",
                arguments: {
                    VOICE: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "",
                    },
                    TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "啤酒挺凉，我就坐在大钟旁，真吊。",
                    },
                    PITCH: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    RATE: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    VOLUME: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                },
            },
            {
                opcode: "GETVOICE",
                blockType: Scratch.BlockType.REPORTER,
                text: "voice [IDX]",
                arguments: {
                    IDX: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    }
                }
            },
            {
                opcode: "ISSPEAKING",
                blockType: Scratch.BlockType.BOOLEAN,
                text: "is speaking?",
            },
            {
                opcode: "STOP",
                blockType: Scratch.BlockType.COMMAND,
                text: "stop voice",
            },
        ],
    }; }

    SPEAK({VOICE, TEXT, PITCH, RATE, VOLUME}: any) {
        speechSynthesis.cancel();
        let u = new SpeechSynthesisUtterance(TEXT);
        u.lang = this.Lang;
        u.voice = speechSynthesis.getVoices().find(voice => voice.name == VOICE);
        u.pitch = PITCH;
        u.rate = RATE;
        u.volume = VOLUME;
        speechSynthesis.speak(u);
    }

    GETVOICE({IDX}) {
        let voices = speechSynthesis.getVoices();
        if (IDX < voices.length) { return voices[IDX].name; };
    }

    ISSPEAKING() {
        return speechSynthesis.speaking;
    }

    STOP() {
        speechSynthesis.cancel();
    }
}

Scratch.extensions.register(new CQEasyTanim());

})(Scratch);
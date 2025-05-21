"use strict";
(function (Scratch) {
    var _a;
    var _b;
    const IsShowWarn = true;
    function Warn(...data) {
        if (IsShowWarn) {
            if (typeof data[0] == "string") {
                data[0] = "Easy Tanim: " + data[0];
            }
            console.warn(...data);
        }
    }
    if (!((_a = Scratch === null || Scratch === void 0 ? void 0 : Scratch.extensions) === null || _a === void 0 ? void 0 : _a.unsandboxed)) {
        throw new Error('Easy Tanim must run unsandboxed!');
    }
    const vm = Scratch.vm;
    const Cast = Scratch.Cast;
    const isGandi = vm.runtime.gandi ? true : false;
    const TheExtensionID = "cqeasytanim";
    const translates = {
        "zh-cn": {
            ["CQET_extName"]: "时间轴动画",
            ["CQET_bGetTanimValue"]: "动画 [tanimName] [loopMode] 第 [time] [timeUnit] 的 [tanimValueType]",
            ["CQET_bSetContext"]: "将动画语境设为 [tanimName] [loopMode] 的第 [time] [timeUnit]",
            ["CQET_bGetContextValue"]: "语境的 [tanimValueType]",
            ["CQET_bCreateSnapshot"]: "为动画 [tanimName] [loopMode] 的第 [time] [timeUnit] 创建快照",
            ["CQET_bTransitSnapshot"]: "从快照 [snapshotIndexA] 到 [snapshotIndexB] 过渡，创建 [transitT] 处的快照",
            ["CQET_bGetSnapshotValue"]: "快照 [snapshotIndex] 的 [tanimValueType]",
            ["CQET_bSetContextBySnapshot"]: "将动画语境设为快照 [snapshotIndex]",
            ["CQET_bDeleteSnapshot"]: "删除动画快照 [snapshotIndex]",
            ["CQET_bDeleteAllSnapshot"]: "删除所有动画快照",
            ["CQET_bGetTanimInfo"]: "动画 [tanimName] 的 [tanimInfoType]",
            ["CQET_bGetTanimEditorInfo"]: "动画编辑器的 [tanimEditorInfoType]",
            ["CQET_mLoopMode_loop"]: "循环播放",
            ["CQET_mLoopMode_once"]: "播放一次",
            ["CQET_mLoopMode_loopYoyo"]: "循环往复",
            ["CQET_mLoopMode_onceYoyo"]: "往复一次",
            ["CQET_mTimeUnit_second"]: "秒",
            ["CQET_mTimeUnit_frame"]: "帧",
            ["CQET_mTanimValueType_px"]: "x 坐标",
            ["CQET_mTanimValueType_py"]: "y 坐标",
            ["CQET_mTanimValueType_s"]: "大小",
            ["CQET_mTanimValueType_sx"]: "x 拉伸",
            ["CQET_mTanimValueType_sy"]: "y 拉伸",
            ["CQET_mTanimValueType_sq"]: "挤压",
            ["CQET_mTanimValueType_sqx"]: "x 挤压倍数",
            ["CQET_mTanimValueType_sqy"]: "y 挤压倍数",
            ["CQET_mTanimValueType_d"]: "方向",
            ["CQET_mTanimValueType_cos"]: "造型",
            ["CQET_mTanimInfoType_lengthSec"]: "时长",
            ["CQET_mTanimInfoType_length"]: "总帧数",
            ["CQET_mTanimInfoType_fps"]: "每秒帧数",
            ["CQET_mTanimEditorInfoType_time"]: "当前帧",
            ["CQET_mTanimEditorInfoType_anim"]: "当前动画",
            ["CQET_mTanimEditorInfoType_sprite"]: "当前角色",
            ["CQET_mTanimEditorInfoType_cosPrefix"]: "造型前缀",
            ["CQET_mTanimEditorInfoType_cosName"]: "造型名称",
            ["CQET_mTanimEditorInfoType_cosSuffix"]: "造型后缀",
            ["CQET_labelContext"]: "~ 🍬动画语境 ~",
            ["CQET_labelSnapshot"]: "~ 📷动画快照 ~",
            ["CQET_labelUtils"]: "~ 👉附加功能 ~",
            ["CQET_buttonDoc"]: "📄文档",
            ["CQET_buttonEditor"]: "✏️动画编辑器",
            ["CQET_eDefaultTitle"]: "时间轴动画编辑器",
            ["CQET_eDefaultHint"]: "- 提示栏 -",
            ["CQET_eTanimListTitle"]: "动画管理器",
            ["CQET_eLayerListTitle"]: "图层",
            ["CQET_eDefaultTanimName"]: "动画",
            ["CQET_eNewTanimNameQuestion"]: "新建动画",
            ["CQET_eNewTanimNameInFolderQuestion"]: "在文件夹“[folderName]”中新建动画",
            ["CQET_eRenameTanimQuestion"]: "重命名动画“[tanimName]”",
            ["CQET_eRenameFolderQuestion"]: "重命名文件夹“[folderName]”",
            ["CQET_eDeleteTanimQuestion"]: "时间轴动画编辑器：确定要删除动画“[tanimName]”吗？",
            ["CQET_eDefaultConfirmQuestion"]: "时间轴动画编辑器：确定要执行此操作吗？",
            ["CQET_eCUIFPS"]: "[fps] 帧/秒",
            ["CQET_noTanimPleaseCreate"]: "- 未创建动画 -",
        },
    };
    Scratch.translate.setup(translates);
    function getTranslate(id) {
        return Scratch.translate({ id: id, default: translates["zh-cn"][id], });
    }
    let { exp, pow, PI, sin, sqrt, abs, max, min, round, floor, ceil, log, log2, log10, sign } = Math;
    function getSafeCommentID(base) {
        let ids = [];
        for (let i in vm.runtime.targets) {
            let t = vm.runtime.targets[i];
            for (let j in t.comments) {
                ids.push(t.comments[j].id);
            }
        }
        if (!ids.includes(base))
            return base;
        let i;
        for (i = 2; ids.includes(base + i); i++)
            continue;
        return base + i;
    }
    function clamp(x, a, b) {
        return max(a, min(x, b));
    }
    function positiveMod(x, n) {
        x = x % n;
        if (x < 0)
            x -= floor(x / n) * n;
        return x;
    }
    function sqToSqx(sq) {
        return sq > 0 ? (100 + sq) / 100 : 100 / (100 - sq);
    }
    function sqToSqy(sq) {
        return sq > 0 ? 100 / (100 + sq) : (100 - sq) / 100;
    }
    class InterpolationFunctions {
        static InterLerp(x1, y1, x2, y2, x) {
            let t = (x - x1) / (x2 - x1);
            return this.Lerp(y1, y2, t);
        }
        ;
        static TInOut(t) {
            if (t <= 0.5) {
                return t * 2;
            }
            else {
                return (1 - t) * 2;
            }
        }
        ;
        static RInOut(t, r) {
            if (t <= 0.5) {
                return r / 2;
            }
            else {
                return 1 - r / 2;
            }
        }
        ;
        static TOutIn(t) {
            if (t <= 0.5) {
                return 1 - t * 2;
            }
            else {
                return 2 * t - 1;
            }
        }
        ;
        static ROutIn(t, r) {
            if (t <= 0.5) {
                return (1 - r) / 2;
            }
            else {
                return (1 + r) / 2;
            }
        }
        ;
        static InterEase(x1, y1, x2, y2, x, easeType, mfn) {
            let t = (x - x1) / (x2 - x1);
            let tm = t;
            switch (easeType) {
                case "out":
                    tm = 1 - t;
                    break;
                case "inOut":
                    tm = this.TInOut(t);
                    break;
                case "outIn":
                    tm = this.TOutIn(t);
                    break;
            }
            let rm = mfn(tm);
            let r = rm;
            switch (easeType) {
                case "out":
                    r = 1 - rm;
                    break;
                case "inOut":
                    r = this.RInOut(t, rm);
                    break;
                case "outIn":
                    r = this.ROutIn(t, rm);
                    break;
            }
            return this.Lerp(y1, y2, r);
        }
    }
    _b = InterpolationFunctions;
    InterpolationFunctions.Lerp = (a, b, t) => (1 - t) * a + t * b;
    InterpolationFunctions.MapPowerIn = (t, n) => pow(t, n);
    InterpolationFunctions.MapExpIn = (t, n) => (exp(n * t) - 1) / (exp(n) - 1);
    InterpolationFunctions.MapSineIn = (t) => sin(t * 2 / PI);
    InterpolationFunctions.MapCircIn = (t) => sqrt(1 - pow(t, 2));
    InterpolationFunctions.MapElasticIn = (t, m, n) => ((exp(n * t) - 1) / (exp(n) - 1)) * sin(2 * PI * (m * (t - 1) + 0.25));
    InterpolationFunctions.MapBackIn = (t, s) => t * t * ((s + 1) * t - s);
    InterpolationFunctions.GetBackH = (s) => (4 * s * s * s) / (27 * (s + 1) * (s + 1));
    InterpolationFunctions.MapBounceOut = (t) => {
        if ((t) < (1 / 2.75)) {
            return (7.5625 * t * t);
        }
        else if (t < (2 / 2.75)) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        }
        else if (t < (2.5 / 2.75)) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        }
        else {
            return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
        }
    };
    InterpolationFunctions.InterTradExp = (x1, y1, x2, y2, x, v, p) => {
        let a = pow(1 - 1 / v, p * (x2 - x1));
        let t = (x - x1) / (x2 - x1);
        let r = (pow(a, t) - 1) / (a - 1);
        return _b.Lerp(y1, y2, t);
    };
    InterpolationFunctions.InterLag2 = (x1, y1, x2, y2, cx, cy, x) => {
        let l1 = (y1 * (x - cx) * (x - x2)) / ((x1 - cx) * (x1 - x2));
        let l2 = (cy * (x - x1) * (x - x2)) / ((cx - x1) * (cx - x2));
        let l3 = (y2 * (x - x1) * (x - cx)) / ((x2 - x1) * (x2 - cx));
        return l1 + l2 + l3;
    };
    InterpolationFunctions.CalcBezier3 = (p1, p2, p3, p4, t) => p1 * pow(1 - t, 3) + p2 * 3 * pow(1 - t, 2) * t + p3 * 3 * (1 - t) * pow(t, 2) + p4 * pow(t, 3);
    InterpolationFunctions.InterBezier3 = (x1, y1, x2, y2, cx1, cy1, cx2, cy2, x) => {
        let f = (t) => _b.CalcBezier3(x1, cx1, cx2, x2, t);
        let t = (x - x1) / (x2 - x1);
        let low = 0;
        let high = 1;
        let ft;
        for (let i = 0; i < 100; i++) {
            ft = f(t);
            if (Math.abs(ft - x) <= 1e-5) {
                break;
            }
            else if (ft > x) {
                high = t;
            }
            else {
                low = t;
            }
            t = (low + high) / 2;
        }
        return _b.CalcBezier3(y1, cy1, cy2, y2, t);
    };
    const DefaultTValues = {
        ["px"]: 0,
        ["py"]: 0,
        ["s"]: 100,
        ["sx"]: 100,
        ["sy"]: 100,
        ["sq"]: 0,
        ["sqx"]: 1,
        ["sqy"]: 1,
        ["d"]: 90,
        ["cos"]: "",
    };
    function safeTValue(tValue, tValueType) {
        var _a;
        return (_a = tValue !== null && tValue !== void 0 ? tValue : DefaultTValues[tValueType]) !== null && _a !== void 0 ? _a : 0;
    }
    class Keyframe {
        constructor(x, y, interType, params = null) {
            this.interType = interType;
            this.x = x;
            this.y = y;
            this.params = params !== null && params !== void 0 ? params : null;
        }
        static FromObject(obj) {
            try {
                let { x, y, type, params } = obj;
                if (typeof x != "number" ||
                    (typeof y != "number" && typeof y != "string") ||
                    typeof type != "string" ||
                    typeof params != "object") {
                    throw new Error();
                }
                ;
                return new Keyframe(x, y, type, params);
            }
            catch (error) {
                Warn("尝试构造 Keyframe 对象时，捕获到错误。", error);
                return null;
            }
        }
        static GetDefaultParam(interType, key) {
            switch (interType) {
                case "power":
                    if (key == "n")
                        return 2;
                    break;
                case "exp":
                    if (key == "n")
                        return 6.93;
                    break;
                case "elastic":
                    if (key == "m")
                        return 3.33;
                    if (key == "n")
                        return 6.93;
                    break;
                case "back":
                    if (key == "s")
                        return 1.70158;
                    break;
                case "tradExp":
                    if (key == "v")
                        return 3;
                    if (key == "p")
                        return 1;
                    break;
            }
            return undefined;
        }
        getParam(key) {
            let result = this.params === null ? undefined : this.params[key];
            if (result === undefined) {
                return Keyframe.GetDefaultParam(this.interType, key);
            }
            return result;
        }
        static Ease(x, left, right) {
            var _a, _c, _d, _e, _f, _g, _h;
            let interType = left.interType;
            let { x: x1, y: y1 } = left;
            let { x: x2, y: y2 } = right;
            if (typeof y1 == "string" || typeof y2 == "string") {
                return y1;
            }
            let params = (_a = left.params) !== null && _a !== void 0 ? _a : {};
            let easeType = params["easeType"];
            let fn = InterpolationFunctions;
            switch (interType) {
                case "const":
                    return y1;
                case "linear":
                    return fn.InterLerp(x1, y1, x2, y2, x);
                case "tradExp":
                    return fn.InterTradExp(x1, y1, x2, y2, x, left.getParam("v"), left.getParam("p"));
                case "lagrange":
                    return fn.InterLag2(x1, y1, x2, y2, (_c = params["cx"]) !== null && _c !== void 0 ? _c : x1, (_d = params["cy"]) !== null && _d !== void 0 ? _d : y1, x);
                case "bezier":
                    return fn.InterBezier3(x1, y1, x1 + ((_e = params["cx1"]) !== null && _e !== void 0 ? _e : 0), y1 + ((_f = params["cy1"]) !== null && _f !== void 0 ? _f : 0), x2 + ((_g = params["cx2"]) !== null && _g !== void 0 ? _g : 0), y2 + ((_h = params["cy2"]) !== null && _h !== void 0 ? _h : 0), x2, y2, x);
                case "power":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapPowerIn(tm, left.getParam("n")));
                case "exp":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapExpIn(tm, left.getParam("n")));
                case "sine":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapSineIn(tm));
                case "circular":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapCircIn(tm));
                case "elastic":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapElasticIn(tm, left.getParam("m"), left.getParam("n")));
                case "back":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapBackIn(tm, left.getParam("s")));
                case "bounce":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapBounceOut(1 - tm));
                default:
                    return y1;
            }
        }
    }
    class Timeline {
        constructor(tValueType, keyframes) {
            this.tValueType = tValueType;
            this.keyframes = keyframes;
        }
        static FromObject(obj) {
            try {
                let { tValueType, keyframes } = obj;
                if (typeof tValueType != "string" ||
                    !Array.isArray(keyframes)) {
                    throw new Error();
                }
                ;
                let parsedKeyframes = keyframes.map(kf => {
                    let parsedKeyframe = Keyframe.FromObject(kf);
                    if (parsedKeyframe === null) {
                        throw new Error();
                    }
                    else {
                        return parsedKeyframe;
                    }
                });
                return new Timeline(tValueType, parsedKeyframes);
            }
            catch (error) {
                Warn("尝试构造 Timeline 对象时，捕获到错误。", error);
                return null;
            }
        }
        findLeftKeyframe(x, equals = true) {
            for (let i = this.keyframes.length - 1; i > 0; i--) {
                let point = this.keyframes[i];
                if (point.x < x || (equals && point.x == x)) {
                    let pre = this.keyframes[i - 1];
                    if (pre.x <= point.x) {
                        return point;
                    }
                }
            }
            return null;
        }
        findRightKeyframe(x, equals = true) {
            for (let i = 0; i < this.keyframes.length; i++) {
                let point = this.keyframes[i];
                if (point.x > x || (equals && point.x == x)) {
                    let pre = this.keyframes[i - 1];
                    if (pre.x <= point.x) {
                        return point;
                    }
                }
            }
            return null;
        }
        findKeyframeByTime(x) {
            for (let i = 0; i < this.keyframes.length; i++) {
                let point = this.keyframes[i];
                if (point.x == x) {
                    let pre = this.keyframes[i - 1];
                    if (pre.x <= point.x) {
                        return point;
                    }
                }
            }
            return null;
        }
        getTValueByFrame(x) {
            var _a;
            if (this.keyframes.length == 0) {
                return (_a = DefaultTValues[this.tValueType]) !== null && _a !== void 0 ? _a : 0;
            }
            else if (this.keyframes.length == 1) {
                return this.keyframes[0].y;
            }
            let left = this.findLeftKeyframe(x);
            let right = this.findRightKeyframe(x);
            if (!left) {
                return safeTValue(null, this.tValueType);
            }
            if (!right) {
                return safeTValue(left.y, this.tValueType);
            }
            return Keyframe.Ease(x, left, right);
        }
    }
    class Tanim {
        constructor(name, length, fps, timelines) {
            this.name = name;
            this.length = length;
            this.fps = fps;
            this.timelines = timelines;
        }
        static FromObject(obj) {
            try {
                let { name, length, fps, timelines } = obj;
                if (typeof name != "string" ||
                    typeof length != "number" ||
                    typeof fps != "number" ||
                    !Array.isArray(timelines)) {
                    throw new Error();
                }
                ;
                let parsedTimelines = timelines.map(tl => {
                    let parsedTimeline = Timeline.FromObject(tl);
                    if (parsedTimeline === null) {
                        throw new Error();
                    }
                    else {
                        return parsedTimeline;
                    }
                });
                return new Tanim(name, length, fps, timelines);
            }
            catch (error) {
                Warn("尝试构造 Tanim 对象时，捕获到错误。", error);
                return null;
            }
        }
        rename(name) {
            this.name = name;
        }
        getTimelineByTValueType(tValueType) {
            let result = this.timelines.find(timeline => timeline.tValueType === tValueType);
            return result !== null && result !== void 0 ? result : null;
        }
        getTime(time, timeUnit, loopMode) {
            if (timeUnit === "second") {
                time /= this.fps;
            }
            switch (loopMode) {
                case "once":
                    time = clamp(time, 0, this.length);
                    break;
                case "loop-yoyo":
                    time = positiveMod(time, this.length * 2);
                    if (time > this.length)
                        time = this.length * 2 - time;
                    break;
                case "once-yoyo":
                    time = clamp(time, 0, this.length * 2);
                    if (time > this.length)
                        time = this.length * 2 - time;
                    break;
                default:
                case "loop":
                    time = positiveMod(time, this.length);
                    break;
            }
            return time;
        }
        getTValue(tValueType, time, timeUnit, loopMode) {
            if (tValueType == "sqx" || tValueType == "sqy") {
                let sq = safeTValue(this.getTValue("sq", time, timeUnit, loopMode), "sq");
                if (typeof sq == "string") {
                    return 1;
                }
                if (tValueType == "sqx") {
                    return sqToSqx(sq);
                }
                else {
                    return sqToSqy(sq);
                }
            }
            let timeline = this.getTimelineByTValueType(tValueType);
            if (!timeline)
                return null;
            time = this.getTime(time, timeUnit, loopMode);
            return timeline.getTValueByFrame(time);
        }
        getSnapshot(time, timeUnit, loopMode) {
            let snapshot = {};
            time = this.getTime(time, timeUnit, loopMode);
            for (let timeline of this.timelines) {
                snapshot[timeline.tValueType] = timeline.getTValueByFrame(time);
            }
            return snapshot;
        }
    }
    class TanimManager {
        constructor(tanims) {
            this.tanims = tanims;
            this.context = {};
            this.snapshots = [];
            this.tValueTypes = [
                "px",
                "py",
                "s",
                "sx",
                "sy",
                "sq",
                "sqx",
                "sqy",
                "d",
                "cos",
            ];
            for (let tanim of tanims) {
                for (let timeline of tanim.timelines) {
                    if (!this.tValueTypes.includes(timeline.tValueType)) {
                        this.tValueTypes.push(timeline.tValueType);
                    }
                }
            }
        }
        static FromObject(obj) {
            try {
                let { tanims } = obj;
                if (!Array.isArray(tanims)) {
                    throw new Error();
                }
                ;
                let parsedTanims = tanims.map(ta => {
                    let parsedTanim = Tanim.FromObject(ta);
                    if (parsedTanim === null) {
                        throw new Error();
                    }
                    else {
                        return parsedTanim;
                    }
                });
                return new TanimManager(parsedTanims);
            }
            catch (error) {
                Warn("尝试构造 TanimManager 对象时，捕获到错误。", error);
                return null;
            }
        }
        getTanimByName(name) {
            let result = this.tanims.find(tanim => tanim.name === name);
            return result !== null && result !== void 0 ? result : null;
        }
        getTanimsByPrefix(prefix) {
            let result = this.tanims.filter(tanim => tanim.name.startsWith(prefix));
            return result;
        }
        getContextValue(tValueType) {
            return safeTValue(this.context[tValueType], tValueType);
        }
        getSnapshotByIndex(index) {
            var _a;
            return (_a = this.snapshots[index]) !== null && _a !== void 0 ? _a : null;
        }
        getSnapshotValue(snapshot, tValueType) {
            return safeTValue(snapshot[tValueType], tValueType);
        }
        transitSnapshot(snapshotA, snapshotB, t) {
            let lerp = InterpolationFunctions.Lerp;
            let result = {};
            for (let tValueType in new Set([...Object.keys(snapshotA), ...Object.keys(snapshotB)])) {
                if (tValueType == "sqx" || tValueType == "sqy") {
                    let sqa = safeTValue(snapshotA["sq"], "sq");
                    let sqb = safeTValue(snapshotB["sq"], "sq");
                    if (typeof sqa == "string" || typeof sqb == "string") {
                        continue;
                    }
                    let sq = lerp(sqa, sqb, t);
                    if (tValueType == "sqx") {
                        result[tValueType] = sqToSqx(sq);
                    }
                    else {
                        result[tValueType] = sqToSqy(sq);
                    }
                }
                else {
                    let va = safeTValue(snapshotA[tValueType], tValueType);
                    let vb = safeTValue(snapshotB[tValueType], tValueType);
                    if (typeof va == "string" || typeof vb == "string") {
                        result[tValueType] = t <= 0.5 ? va : vb;
                    }
                    else {
                        result[tValueType] = lerp(va, vb, t);
                    }
                }
            }
            return result;
        }
        allocateSnapshotIndex(snapshot) {
            let index = this.snapshots.indexOf(null);
            if (index == -1) {
                index = this.snapshots.length;
            }
            this.snapshots[index] = snapshot;
            return index;
        }
        recycleSnapshotIndex(index) {
            if (this.snapshots[index])
                this.snapshots[index] = null;
        }
        recycleAllSnapshot() {
            this.snapshots.length = 0;
        }
        getSafeTanimName(name) {
            let names = this.tanims.map(tanim => tanim === null || tanim === void 0 ? void 0 : tanim.name);
            while (names.includes(name)) {
                name = incrementSuffix(name);
            }
            let dir = name.split("//");
            if (dir.pop() == "") {
                dir.push(getTranslate("CQET_eDefaultTanimName"));
                return this.getSafeTanimName(dir.join("//"));
            }
            return name;
        }
        getCopiedTanim(tanim) {
            let result = Tanim.FromObject(JSON.parse(JSON.stringify(tanim)));
            if (!result)
                return null;
            result.rename(this.getSafeTanimName(result.name));
            return result;
        }
    }
    function incrementSuffix(base, defaultSuffix = " ") {
        const match = base.match(/(.*\D?)(\d+)$/);
        if (!match) {
            return base == "" ? "1" : base + defaultSuffix + "2";
        }
        const [_, prefix, numStr] = match;
        const incrementedNum = (parseInt(numStr, 10) + 1).toString();
        return prefix + incrementedNum;
    }
    function lcg(x) {
        return (1103515245 * x + 12345) % 2 ** 31;
    }
    function stringToHSL(str, saturation, lightness, alpha = 100) {
        let hue;
        if (Cast.compare(str, "true") == 0) {
            hue = 120;
        }
        else if (Cast.compare(str, "false") == 0) {
            hue = 0;
        }
        else {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
                hash |= 0;
            }
            hue = lcg(hash) % 360;
        }
        return alpha == 100 ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha}%)`;
    }
    function tValueTypeToHSL(tValueType, saturation, lightness, alpha = 100) {
        let hue;
        switch (tValueType) {
            case "px":
                hue = 210;
                break;
            case "py":
                hue = 260;
                break;
            case "s":
                hue = 330;
                break;
            case "sx":
                hue = 0;
                break;
            case "sy":
                hue = 25;
                break;
            case "sq":
                hue = 60;
                break;
            case "d":
                hue = 90;
                break;
            case "cos":
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
    function getJSONSrcFromComment() {
        let JSONSrc = null;
        try {
            let comments = vm.runtime.targets[0].comments;
            for (let id in comments) {
                let txt = comments[id].text;
                if (typeof txt != "string") {
                    throw new Error();
                }
                let headIdx = txt.indexOf("!!!CQ_EASY_TANIM_SAVE_DATA_HEAD_DONT_EDIT_THIS!!!");
                if (headIdx >= 0) {
                    let tailIdx = txt.indexOf("!!!CQ_EASY_TANIM_SAVE_DATA_TAIL_DONT_EDIT_THIS!!!");
                    if (tailIdx == -1) {
                        tailIdx = txt.length;
                    }
                    ;
                    JSONSrc = txt.substring(headIdx + "!!!CQ_EASY_TANIM_SAVE_DATA_HEAD_DONT_EDIT_THIS!!!".length, tailIdx);
                    break;
                }
            }
            return JSONSrc;
        }
        catch (error) {
            Warn("尝试从注释中获取存储数据时，捕获到错误。", error);
            return JSONSrc;
        }
    }
    function getSavedataFromJSONSrc(JSONSrc) {
        try {
            if (JSONSrc) {
                return {
                    obj: JSON.parse(JSONSrc),
                    src: JSONSrc,
                };
            }
            else {
                Warn("无法读取动画存储数据，已初始化动画数据。");
                return {
                    obj: { tanims: [], },
                    src: null,
                };
            }
        }
        catch (error) {
            Warn("尝试解析JSON存储数据时，捕获到错误。", error);
            return {
                obj: null,
                src: JSONSrc
            };
        }
    }
    let TheTanimManager = new TanimManager([]);
    function autoLoadData(isAlertError) {
        let JSONSrc = getJSONSrcFromComment();
        let { obj: savedata, src } = getSavedataFromJSONSrc(JSONSrc);
        let _parsedTanimManager = TanimManager.FromObject(savedata);
        if (_parsedTanimManager == null) {
            if (!isAlertError)
                return;
            let d = new Date();
            let dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
            vm.runtime.targets[0].createComment(getSafeCommentID("_EasyTanimBackup"), null, `⚠️⚠️⚠️时间轴动画 错误⚠️⚠️⚠️
⚠️⚠️⚠️EASY TANIM ERROR⚠️⚠️⚠️
${dateStr}
无法从注释中读取存储数据，已重置动画数据。检查浏览器开发者工具以获取更多信息。
此条注释下方备份了旧的动画数据，请妥善保管，并联系他人以寻求帮助。
Failed to load stored data from comment. Data has been reset. Check the browser's developer tools for more information.
A backup of the old data has been preserved below this comment. Please keep it safe and contact others for help.

${"!!!CQ_EASY_TANIM_SAVE_DATA_HEAD_DONT_EDIT_THIS!!!"}${JSONSrc}${"!!!CQ_EASY_TANIM_SAVE_DATA_TAIL_DONT_EDIT_THIS!!!"}
`, 0, 0, 600, 800, false);
            Warn("读取动画存储数据失败，已重置动画数据。在背景中生成了一条新注释，备份了旧的动画数据源码。");
            window.alert(`时间轴动画 错误：读取动画存储数据失败，已重置动画数据。在背景中生成了一条新注释，请检查它以获取更多信息和旧数据的备份。

EASY TANIM ERROR: Fail to load stored data. Data has been reset. Created a comment in Background, please check it for more information and backup of old data.`);
            return;
        }
        TheTanimManager = _parsedTanimManager;
    }
    vm.runtime.on("PROJECT_LOADED", () => autoLoadData(true));
    class CUI {
        constructor(type, align, pos, size) {
            this.type = type;
            this.align = align;
            this.pos = pos;
            this.size = typeof size == "number" ? { w: size, h: size } : size !== null && size !== void 0 ? size : { w: 0, h: 0 };
        }
    }
    const DefaultTValueNames = [
        `${"px"}|${"py"}`,
        "s",
        `${"sx"}|${"sy"}`,
        "sq",
        "d",
        "cos",
    ];
    class TanimEditor {
        get subAxis() {
            return 1 - this.mainAxis;
        }
        ;
        get loopMode() {
            if (this.isLoop) {
                if (this.isYoyo) {
                    return "loop-yoyo";
                }
                else {
                    return "loop";
                }
            }
            else {
                if (this.isYoyo) {
                    return "once-yoyo";
                }
                else {
                    return "once";
                }
            }
        }
        get timelineScaleX() {
            return 3 * 1.25 ** this.timelineScalePowX;
        }
        get timelineScaleY() {
            return 1.25 ** this.timelineScalePowY;
        }
        ;
        constructor() {
            this.focusTime = 0;
            this.tanim = null;
            this.timelines = [null, null];
            this.tValueNames = [...DefaultTValueNames];
            this.tValueName = this.tValueNames[0];
            this.mainAxis = 0;
            this.sprite = null;
            this.costumeName = ["", "", ""];
            this.isLoop = false;
            this.isYoyo = false;
            this.marks = {};
            this.isShow = false;
            this.isMinimized = false;
            this.isInputing = false;
            this.width = 1100;
            this.height = 700;
            this.top = 90;
            this.left = 100;
            this.canvasWidth = 1100;
            this.canvasHeight = 700;
            this.tanimListScroll = 0;
            this.layerListScroll = 0;
            this.timelineScrollX = -10;
            this.timelineScrollY = -10;
            this.timelineScalePowX = 6;
            this.timelineScalePowY = 0;
            this.mouseClientX = -1;
            this.mouseClientY = -1;
            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseTimelineX = 0;
            this.mouseTimelineY = 0;
            this.mouseDragType = 0;
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
            this.leftBarWidth = 75;
            this.timelineBarHeight = 200;
            this.rightBarWidth = 250;
            this.layerBarHeight = 100;
            this.title = getTranslate("CQET_eDefaultTitle");
            this.hint = [getTranslate("CQET_eDefaultHint"), ""];
            this.tanimTree = [];
            this.tanimFolders = {};
            this.layerTree = [];
            this.layerFolders = {};
            this.cuis = [];
            this.hover = [];
            this.hoveredKeyframes = [];
            this.selectedKeyframes = [];
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
            this.ctx = this.canvas.getContext("2d");
            if (!this.ctx) {
                Warn("无法获取 Canvas 绘图上下文，动画编辑器将无法正常使用");
            }
            document.body.appendChild(this.root);
            document.addEventListener("mousemove", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("mousedown", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("mouseup", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("dblclick", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("wheel", ev => this.update({ wheelEvent: ev }));
            this.update(null);
        }
        setPosition(top, left) {
            this.root.style.transform = `translate(${(left !== null && left !== void 0 ? left : this.left) - 5}px, ${(top !== null && top !== void 0 ? top : this.top) - 5}px)`;
        }
        setCanvasSize(width, height) {
            this.canvas.width = width !== null && width !== void 0 ? width : this.width;
            this.canvas.height = height !== null && height !== void 0 ? height : this.height;
            this.updateCuis();
        }
        toCanvasPosition(x, y) {
            return [x - this.left + scrollX, y - this.top + scrollY];
        }
        updateMousePosition() {
            [this.mouseX, this.mouseY] = this.toCanvasPosition(this.mouseClientX, this.mouseClientY);
            this.updateMouseTimelinePosition();
        }
        canvasTotimelinePosition(x, y, anchorX, anchorY) {
            anchorX !== null && anchorX !== void 0 ? anchorX : (anchorX = this.leftBarWidth);
            anchorY !== null && anchorY !== void 0 ? anchorY : (anchorY = this.canvasHeight - 50 - 20);
            return [
                (x - anchorX) / this.timelineScaleX + this.timelineScrollX,
                (anchorY - y) / this.timelineScaleY + this.timelineScrollY
            ];
        }
        timelineToCanvasPosition(x, y, anchorX, anchorY) {
            anchorX !== null && anchorX !== void 0 ? anchorX : (anchorX = this.leftBarWidth);
            anchorY !== null && anchorY !== void 0 ? anchorY : (anchorY = this.canvasHeight - 50 - 20);
            return [
                (x - this.timelineScrollX) * this.timelineScaleX + anchorX,
                typeof y == "number" ? anchorY - (y - this.timelineScrollY) * this.timelineScaleY :
                    this.canvasHeight + ((-this.timelineBarHeight + 18 + 18) + (-50 - 20)) / 2
            ];
        }
        timeToScrollX(time, start, length, anchor) {
            anchor !== null && anchor !== void 0 ? anchor : (anchor = this.leftBarWidth + 20);
            start -= 30;
            length += 60;
            return (this.canvasWidth - this.leftBarWidth - this.rightBarWidth - 20 * 2) * (time - start) / length + anchor;
        }
        scrollXToTime(x, start, length, anchor) {
            anchor !== null && anchor !== void 0 ? anchor : (anchor = this.leftBarWidth + 20);
            start -= 30;
            length += 60;
            return (x - anchor) * length / (this.canvasWidth - this.leftBarWidth - this.rightBarWidth - 20 * 2) + start;
        }
        scaleTimelineX(n) {
            n = clamp(n, 0 - this.timelineScalePowX, 15 - this.timelineScalePowX);
            if (n == 0)
                return;
            let scaleCenter = (false ? this.mouseX :
                (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2) - this.leftBarWidth;
            this.hint[1] = `时间轴横向缩放中心：${scaleCenter}`;
            this.timelineScrollX += scaleCenter * (1 - 1.25 ** -n) / this.timelineScaleX;
            this.timelineScalePowX += n;
        }
        scaleTimelineY(n) {
            n = clamp(n, -20 - this.timelineScalePowY, 40 - this.timelineScalePowY);
            if (n == 0)
                return;
            let scaleCenter = this.canvasHeight - 50 - 20 - (false ? this.mouseY : (this.canvasHeight - 50 +
                ((-this.timelineBarHeight + 18 + 18) + (-20)) / 2));
            this.hint[1] = `时间轴纵向缩放中心：${scaleCenter}`;
            this.timelineScrollY += scaleCenter * (1 - 1.25 ** -n) / this.timelineScaleY;
            this.timelineScalePowY += n;
        }
        scrollTimeline(x, y) {
            this.timelineScrollX += x;
            this.timelineScrollY += y;
        }
        updateMouseTimelinePosition() {
            [this.mouseTimelineX, this.mouseTimelineY] = this.canvasTotimelinePosition(this.mouseX, this.mouseY);
        }
        trimText(prefix, txt, suffix, maxWidth) {
            if (maxWidth <= 0)
                return prefix + "" + suffix;
            let ctx = this.ctx;
            if (ctx.measureText(prefix + txt + suffix).width <= maxWidth)
                return prefix + txt + suffix;
            let low = 0;
            let high = (prefix + txt + suffix).length;
            let bestK = -1;
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const trimmedText = prefix + txt.substring(0, mid) + "..." + suffix;
                const width = ctx.measureText(trimmedText).width;
                if (width <= maxWidth) {
                    bestK = mid;
                    low = mid + 1;
                }
                else {
                    high = mid - 1;
                }
            }
            return prefix + txt.substring(0, bestK) + '...' + suffix;
        }
        getTanimListButtons(item) {
            switch (item.type) {
                case 0:
                    return [7, 6, 2, 4, 3];
                case 1:
                    return [8, 6, 1, 4, 3];
                case 2:
                    return [9];
                case 3:
                    return [10, 6, 1, 4, 3];
            }
        }
        getLayerListButtons(item) {
            switch (item.type) {
                case 0:
                    return [5];
                case 1:
                    return [8, 5];
                case 2:
                    return [9];
                case 3:
                    return [10, 5];
            }
        }
        ask(message, default_, callback) {
            let answer = prompt(message !== null && message !== void 0 ? message : undefined, default_ !== null && default_ !== void 0 ? default_ : undefined);
            if (answer instanceof Promise) {
                this.isInputing = true;
                answer.then(answer => {
                    callback(answer);
                    this.isInputing = false;
                    this.update(null);
                });
                return true;
            }
            else {
                callback(answer);
                return false;
            }
        }
        askAndCreateNewTanim() {
            return this.ask(getTranslate("CQET_eNewTanimNameQuestion"), TheTanimManager.getSafeTanimName(getTranslate("CQET_eDefaultTanimName")), answer => {
                if (answer !== null) {
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(answer), 60, 30, []);
                    TheTanimManager.tanims.push(tanim);
                    this.updateTanimTree();
                }
            });
        }
        askAndCreateNewTanimInFolder(dir) {
            let dirStr = dir.join("//") + "//";
            let folderName = dir.pop();
            if (folderName === undefined)
                return this.askAndCreateNewTanim();
            let defaultNameFull = TheTanimManager.getSafeTanimName(dirStr + getTranslate("CQET_eDefaultTanimName"));
            let defaultDir = defaultNameFull.split("//");
            let defaultName = defaultDir.pop();
            if (defaultName === undefined)
                return this.askAndCreateNewTanim();
            return this.ask(getTranslate("CQET_eNewTanimNameInFolderQuestion").replace("[folderName]", folderName), defaultName, answer => {
                if (answer !== null) {
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(dirStr + answer), 60, 30, []);
                    let tanims = TheTanimManager.tanims;
                    for (let i = tanims.length - 1; i >= 0; i--) {
                        if (tanims[i].name.startsWith(dirStr)) {
                            tanims.splice(i + 1, 0, tanim);
                            return;
                        }
                    }
                }
            });
        }
        askAndRenameTanim(tanim) {
            return this.ask(getTranslate("CQET_eRenameTanimQuestion").replace("[tanimName]", tanim.name), tanim.name, answer => {
                if (answer !== null) {
                    tanim.rename(answer);
                }
            });
        }
        askAndRenameFolder(tanims, dir) {
            let dirStr = dir.join("//");
            let folderName = dir.pop();
            if (!folderName)
                return false;
            return this.ask(getTranslate("CQET_eRenameFolderQuestion").replace("[folderName]", folderName), folderName, answer => {
                if (answer !== null) {
                    dir.push(answer);
                    let newDirStr = dir.join("//");
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
            });
        }
        confirm(message) {
            return confirm(message !== null && message !== void 0 ? message : "");
        }
        updateTree(tanimTree, tanimFolders, tanims, foldedFolders) {
            var _a;
            tanimTree.length = 0;
            Object.keys(tanimFolders).forEach(key => delete tanimFolders[key]);
            let dir = [];
            let foldedDepth = Infinity;
            for (let i = 0; i < tanims.length; i++) {
                let nameFull = tanims[i].name;
                let thisDir = nameFull.split("//");
                let name = (_a = thisDir.pop()) !== null && _a !== void 0 ? _a : "";
                for (let i = dir.length - 1; i >= 0; i--) {
                    if (dir[i] !== thisDir[i]) {
                        if (foldedDepth == Infinity)
                            tanimTree.push({
                                dir: [...dir],
                                text: dir[i],
                                type: 2,
                                indentation: i,
                            });
                        let folderName = dir.join("//");
                        if (foldedDepth == Infinity)
                            if (tanimFolders[folderName]) {
                                let ranges = tanimFolders[folderName].ranges;
                                ranges[ranges.length - 1].to = tanimTree.length;
                            }
                        dir.pop();
                        if (dir.length < foldedDepth)
                            foldedDepth = Infinity;
                    }
                }
                for (let i = 0; i < thisDir.length; i++) {
                    if (dir[i] !== thisDir[i]) {
                        dir.push(thisDir[i]);
                        let isFoldHead = foldedFolders.has(dir.join("//"));
                        if (foldedDepth == Infinity)
                            tanimTree.push({
                                dir: [...dir],
                                text: thisDir[i],
                                type: isFoldHead ? 3 : 1,
                                indentation: i,
                            });
                        let folderName = dir.join("//");
                        if (foldedDepth == Infinity)
                            if (tanimFolders[folderName]) {
                                tanimFolders[folderName].ranges.push({ from: tanimTree.length - 1, to: tanimTree.length });
                            }
                            else {
                                tanimFolders[folderName] = {
                                    color: stringToHSL(folderName, 50, 90),
                                    indentation: i,
                                    ranges: [{ from: tanimTree.length - 1, to: tanimTree.length }],
                                };
                            }
                        if (isFoldHead)
                            foldedDepth = min(foldedDepth, dir.length);
                    }
                }
                if (foldedDepth == Infinity)
                    tanimTree.push({
                        dir: [...dir],
                        text: name,
                        type: 0,
                        indentation: dir.length,
                        tanim: tanims[i]
                    });
            }
            for (let i = dir.length - 1; i >= 0; i--) {
                if (foldedDepth == Infinity)
                    tanimTree.push({
                        dir: [...dir],
                        text: dir[i],
                        type: 2,
                        indentation: i,
                    });
                let folderName = dir.join("//");
                if (foldedDepth == Infinity)
                    if (tanimFolders[folderName]) {
                        let ranges = tanimFolders[folderName].ranges;
                        ranges[ranges.length - 1].to = tanimTree.length;
                    }
                dir.pop();
                if (dir.length < foldedDepth)
                    foldedDepth = Infinity;
            }
        }
        updateTanimTree() {
            this.updateTree(this.tanimTree, this.tanimFolders, TheTanimManager.tanims, this.foldedTanimFolders);
        }
        updateLayerTree() {
            this.updateTree(this.layerTree, this.layerFolders, this.layers, this.foldedLayerFolders);
        }
        scrollTanimList(x) {
            this.tanimListScroll = clamp(this.tanimListScroll + x, 0, this.tanimTree.length - floor((this.canvasHeight - 30 - 24 - this.layerBarHeight - 200 - 50)
                / 24) + 1);
        }
        scrollLayerList(x) {
            this.layerListScroll = clamp(this.layerListScroll + x, 0, this.layerTree.length - floor((this.layerBarHeight - 24) / 24) + 1);
        }
        addToLayer(item, idx = 0) {
            switch (item.type) {
                case 0:
                    if (!item.tanim)
                        return;
                    if (this.layers.includes(item.tanim))
                        break;
                    this.layers.splice(idx, 0, item.tanim);
                    if (!this.tanim)
                        this.editTanim(item.tanim);
                    break;
                case 1:
                case 2:
                case 3:
                    let tanims = TheTanimManager.getTanimsByPrefix(item.dir.join("//") + "//");
                    this.layers.splice(idx, 0, ...tanims.filter(tanim => !this.layers.includes(tanim)));
                    if (!this.tanim && tanims[0])
                        this.editTanim(tanims[0]);
                    break;
            }
            this.updateLayerTree();
        }
        removeLayer(index, update = true) {
            if (!this.layers[index])
                return;
            if (this.tanim == this.layers[index])
                this.editTanim(null);
            this.layers.splice(index, 1);
            if (update)
                this.updateLayerTree();
        }
        editTanim(tanim) {
            if (this.tanim == tanim)
                return;
            this.tanim = tanim;
            this.tValueNames = [...DefaultTValueNames];
            if (!tanim) {
                this.timelines = [null, null];
                this.updateCuis();
                return;
            }
            for (let { tValueType } of tanim.timelines) {
                if (DefaultTValues[tValueType])
                    continue;
                if (DefaultTValueNames.includes(tValueType))
                    continue;
                this.tValueNames.push(tValueType);
            }
            if (!this.tValueNames.includes(this.tValueName)) {
                this.tValueName = this.tValueNames[0];
            }
            this.editTValueName(this.tValueName);
        }
        editTValueName(tValueName) {
            var _a, _c, _d, _e, _f;
            if (!this.tanim)
                return;
            if (!this.tValueNames.includes(tValueName))
                return;
            this.tValueName = tValueName;
            if (tValueName == `${"px"}|${"py"}`) {
                this.timelines = [
                    (_a = this.tanim.getTimelineByTValueType("px")) !== null && _a !== void 0 ? _a : new Timeline("px", []),
                    (_c = this.tanim.getTimelineByTValueType("py")) !== null && _c !== void 0 ? _c : new Timeline("py", [])
                ];
            }
            else if (tValueName == `${"sx"}|${"sy"}`) {
                this.timelines = [
                    (_d = this.tanim.getTimelineByTValueType("sx")) !== null && _d !== void 0 ? _d : new Timeline("sx", []),
                    (_e = this.tanim.getTimelineByTValueType("sy")) !== null && _e !== void 0 ? _e : new Timeline("sy", [])
                ];
            }
            else {
                this.timelines = [
                    (_f = this.tanim.getTimelineByTValueType(tValueName)) !== null && _f !== void 0 ? _f : new Timeline(tValueName, []),
                    null
                ];
            }
            this.updateCuis();
        }
        focus(time) {
            this.focusTime = round(time);
        }
        dropTanimToTanims(fromTreeIdx, toTreeIdx) {
            if (toTreeIdx == fromTreeIdx || toTreeIdx == fromTreeIdx + 1)
                return;
            let tanimTree = this.tanimTree;
            let tanims = TheTanimManager.tanims;
            let fromItem = tanimTree[fromTreeIdx];
            let toItem = tanimTree[toTreeIdx];
            if (!fromItem)
                return;
            let toIdx;
            let toDir;
            if (!toItem) {
                if (toTreeIdx == tanimTree.length) {
                    toIdx = tanims.length;
                    toDir = [];
                }
                else {
                    return;
                }
            }
            else {
                switch (toItem.type) {
                    case 0:
                        if (!toItem.tanim)
                            return;
                        toIdx = tanims.indexOf(toItem.tanim);
                        if (toIdx == -1)
                            return;
                        toDir = toItem.tanim.name.split("//").slice(0, -1);
                        break;
                    case 1:
                    case 2:
                    case 3:
                        toIdx = -1;
                        for (let i = toTreeIdx + 1; i < tanimTree.length; i++) {
                            let item = tanimTree[i];
                            if (item.type == 0) {
                                if (!item.tanim)
                                    return;
                                toIdx = tanims.indexOf(item.tanim);
                                if (toIdx == -1)
                                    return;
                                break;
                            }
                        }
                        if (toIdx == -1)
                            toIdx = tanims.length;
                        if (toItem.type == 2) {
                            toDir = [...toItem.dir];
                        }
                        else {
                            toDir = toItem.dir.slice(0, -1);
                        }
                        break;
                    default:
                        return;
                }
            }
            let toDirStr = toDir.length == 0 ? "" : toDir.join("//") + "//";
            if (fromItem.type == 0 && fromItem.tanim) {
                let fromTanim = fromItem.tanim;
                let fromDir = fromItem.dir;
                let fromDirStr = fromDir.length == 0 ? "" : fromDir.join("//") + "//";
                let idx = tanims.indexOf(fromTanim);
                if (idx == -1)
                    return;
                tanims[idx] = null;
                fromTanim.rename(TheTanimManager.getSafeTanimName(fromTanim.name.replace(new RegExp("^" + fromDirStr), toDirStr)));
                tanims.splice(toIdx, 0, fromTanim);
            }
            else if (fromItem.type == 3) {
                let fromDir = fromItem.dir.slice(0, -1);
                let fromDirStr = fromDir.length == 0 ? "" : fromDir.join("//") + "//";
                let fromTanims = TheTanimManager.getTanimsByPrefix(fromItem.dir.join("//") + "//");
                let fromIdxs = [];
                for (let fromTanim of fromTanims) {
                    let idx = tanims.indexOf(fromTanim);
                    if (idx == -1)
                        return;
                    fromIdxs.push(idx);
                }
                for (let idx of fromIdxs) {
                    tanims[idx] = null;
                }
                for (let fromTanim of fromTanims) {
                    fromTanim.rename(TheTanimManager.getSafeTanimName(fromTanim.name.replace(new RegExp("^" + fromDirStr), toDirStr)));
                }
                tanims.splice(toIdx, 0, ...fromTanims);
            }
            else
                return;
            for (let i = tanims.length - 1; i >= 0; i--) {
                if (tanims[i] === null)
                    tanims.splice(i, 1);
            }
            this.updateTanimTree();
        }
        getLayerToIdx(layerTree, layers, toTreeIdx, toItem) {
            let toIdx;
            if (!toItem) {
                if (toTreeIdx == layerTree.length) {
                    return layers.length;
                }
                else {
                    return -1;
                }
            }
            else {
                switch (toItem.type) {
                    case 0:
                        if (!toItem.tanim)
                            return -1;
                        toIdx = layers.indexOf(toItem.tanim);
                        return toIdx;
                    case 1:
                    case 2:
                    case 3:
                        toIdx = -1;
                        for (let i = toTreeIdx + 1; i < layerTree.length; i++) {
                            let item = layerTree[i];
                            if (item.type == 0) {
                                if (!item.tanim)
                                    return -1;
                                toIdx = layers.indexOf(item.tanim);
                                if (toIdx == -1)
                                    return -1;
                                break;
                            }
                        }
                        if (toIdx == -1)
                            toIdx = layers.length;
                        return toIdx;
                    default:
                        return -1;
                }
            }
        }
        dropTanimToLayers(fromTreeIdx, toTreeIdx) {
            let tanimTree = this.tanimTree;
            let layerTree = this.layerTree;
            let layers = this.layers;
            let fromItem = tanimTree[fromTreeIdx];
            let toItem = layerTree[toTreeIdx];
            if (!fromItem)
                return;
            let toIdx = this.getLayerToIdx(layerTree, layers, toTreeIdx, toItem);
            if (toIdx == -1)
                return;
            this.addToLayer(fromItem, toIdx);
        }
        dropLayerToLayers(fromTreeIdx, toTreeIdx) {
            let layerTree = this.layerTree;
            let layers = this.layers;
            let fromItem = layerTree[fromTreeIdx];
            let toItem = layerTree[toTreeIdx];
            if (!fromItem)
                return;
            let toIdx = this.getLayerToIdx(layerTree, layers, toTreeIdx, toItem);
            if (toIdx == -1)
                return;
            if (fromItem.type == 0 && fromItem.tanim) {
                let fromTanim = fromItem.tanim;
                let idx = layers.indexOf(fromTanim);
                if (idx == -1)
                    return;
                layers[idx] = null;
                layers.splice(toIdx, 0, fromTanim);
            }
            else if (fromItem.type == 3) {
                let fromDir = fromItem.dir.slice(0, -1);
                let fromDirStr = fromDir.length == 0 ? "" : fromDir.join("//") + "//";
                let fromTanims = TheTanimManager.getTanimsByPrefix(fromItem.dir.join("//") + "//");
                for (let fromTanim of fromTanims) {
                    let idx = layers.indexOf(fromTanim);
                    if (idx == -1)
                        return;
                    layers[idx] = null;
                }
                layers.splice(toIdx, 0, ...fromTanims);
            }
            else
                return;
            for (let i = layers.length - 1; i >= 0; i--) {
                if (layers[i] === null)
                    layers.splice(i, 1);
            }
            this.updateLayerTree();
        }
        updateCuis() {
            let width = this.canvasWidth - this.leftBarWidth - this.rightBarWidth;
            let cuis = this.cuis;
            cuis.length = 0;
            let largeSpacing = 15;
            let spacing = 5;
            let d = width / 2 - (44 / 2 + 30 * 6 + spacing * 3 + largeSpacing * 3 + 10);
            if (d < 0) {
                largeSpacing += d / 4;
                largeSpacing = max(4, largeSpacing);
                spacing += d / 12;
                spacing = max(2, spacing);
            }
            cuis.push(new CUI(7, 1, 0, 44));
            let p = 44 / 2 + largeSpacing + 30 / 2;
            cuis.push(new CUI(6, 1, -p, 30));
            cuis.push(new CUI(8, 1, p, 30));
            p += 30 + spacing;
            cuis.push(new CUI(5, 1, -p, 30));
            cuis.push(new CUI(9, 1, p, 30));
            p += 30 + spacing;
            cuis.push(new CUI(4, 1, -p, 30));
            cuis.push(new CUI(10, 1, p, 30));
            p += 30 + largeSpacing;
            if (this.timelines.some(timeline => timeline && timeline.findKeyframeByTime(this.focusTime))) {
                cuis.push(new CUI(3, 1, -p, 30));
            }
            cuis.push(new CUI(11, 1, p, 30));
            p += 30 + spacing;
            if (this.timelines.some(timeline => timeline && !timeline.findKeyframeByTime(this.focusTime))) {
                cuis.push(new CUI(2, 1, -p, 30));
            }
            cuis.push(new CUI(12, 1, p, 30));
            let dLeft = width / 2 - (44 / 2 + 30 * 6 + spacing * 3 + largeSpacing * 4 + 10);
            if (width / 2 >= 44 / 2 + 30 * 6 + spacing * 3 + largeSpacing * 3) {
                p += 30 + largeSpacing;
                if (this.timelines[1]) {
                    cuis.push(new CUI(1, 1, -p, 30));
                }
                else {
                    dLeft = width / 2 - (44 / 2 + 30 * 5 + spacing * 3 + largeSpacing * 3 + 10);
                }
                cuis.push(new CUI(13, 1, p, 30));
            }
            if (dLeft >= 60) {
                cuis.push(new CUI(0, 0, 10, { w: min(dLeft, 120), h: 30 }));
            }
            let dRight = width / 2 - (44 / 2 + 30 * 6 + spacing * 3 + largeSpacing * 4 + 10);
            if (dRight >= 60) {
                cuis.push(new CUI(14, 2, -10, { w: min(dRight, 100), h: 30 }));
            }
        }
        updateHoverAndCursor() {
            var _a, _c, _d;
            this.hover = [];
            this.hoveredKeyframes.length = 0;
            this.cursor = "default";
            if ((0 < this.mouseX && this.mouseX < this.canvasWidth) && (0 < this.mouseY && this.mouseY < 30)) {
                this.cursor = "move";
                this.hover = ["header"];
                if (this.canvasWidth - 40 <= this.mouseX) {
                    this.cursor = "pointer";
                    this.hover.push("close");
                }
                else if (this.canvasWidth - 2 * 40 <= this.mouseX) {
                    this.cursor = "pointer";
                    this.hover.push("minimize");
                }
            }
            else if (!this.isMinimized) {
                if (abs(this.canvasWidth - this.mouseX) <= 4 && abs(this.canvasHeight - this.mouseY) <= 4) {
                    this.cursor = "nwse-resize";
                    this.hover = ["border", "rb"];
                }
                else if (abs(this.canvasWidth - this.mouseX) <= 4) {
                    this.cursor = "ew-resize";
                    this.hover = ["border", "r"];
                }
                else if (abs(this.canvasHeight - this.mouseY) <= 4) {
                    this.cursor = "ns-resize";
                    this.hover = ["border", "b"];
                }
                else if (abs(this.canvasWidth - this.rightBarWidth - this.mouseX) <= 3) {
                    this.cursor = "ew-resize";
                    this.hover = ["innerBorder", "r"];
                }
                else if (abs(this.leftBarWidth - this.mouseX) <= 3) {
                    this.cursor = "ew-resize";
                    this.hover = ["innerBorder", "l"];
                }
                else if (this.canvasWidth - this.rightBarWidth < this.mouseX &&
                    this.mouseY < this.canvasHeight - 50) {
                    if (abs(this.canvasHeight - 50 - 200 - this.layerBarHeight - this.mouseY) <= 3 &&
                        this.canvasWidth - this.rightBarWidth < this.mouseX && this.mouseX < this.canvasWidth) {
                        this.cursor = "ns-resize";
                        this.hover = ["innerBorder", "layer"];
                    }
                    else if (this.canvasWidth - 24 - 20 < this.mouseX && this.mouseX < this.canvasWidth - 20 &&
                        30 < this.mouseY && this.mouseY < 30 + 24) {
                        this.cursor = "pointer";
                        this.hover = ["newTanim"];
                    }
                    else if (this.canvasWidth - this.rightBarWidth < this.mouseX && this.mouseX < this.canvasWidth - 8 &&
                        30 + 24 < this.mouseY && this.mouseY < this.canvasHeight - 50 - 200 - this.layerBarHeight - 5) {
                        if (this.mouseX >= this.canvasWidth - 20) {
                            this.hover = ["tanimScroll"];
                        }
                        else {
                            this.hover = ["tanimList"];
                            let treeIndex = floor((this.mouseY - (30 + 24)) / 24 + this.tanimListScroll);
                            if (0 <= treeIndex && treeIndex < this.tanimTree.length) {
                                this.cursor = "pointer";
                                this.hover.push(treeIndex);
                                let buttons = this.getTanimListButtons(this.tanimTree[treeIndex]);
                                let buttonIndex = clamp(floor((this.canvasWidth - 20 - this.mouseX) / 24), 0, buttons.length);
                                this.hover.push((_a = buttons[buttonIndex]) !== null && _a !== void 0 ? _a : 0);
                            }
                            else if (treeIndex >= this.tanimTree.length) {
                                this.hover.push(this.tanimTree.length);
                            }
                        }
                    }
                    else if (this.canvasWidth - this.rightBarWidth < this.mouseX && this.mouseX < this.canvasWidth - 8 &&
                        this.canvasHeight - 50 - 200 - this.layerBarHeight + 24 < this.mouseY && this.mouseY < this.canvasHeight - 50 - 200) {
                        if (this.mouseX >= this.canvasWidth - 20) {
                            this.hover = ["layerScroll"];
                        }
                        else {
                            this.hover = ["layerList"];
                            let treeIndex = floor((this.mouseY - (this.canvasHeight - 50 - 200 - this.layerBarHeight + 24)) / 24 + this.layerListScroll);
                            if (0 <= treeIndex && treeIndex < this.layerTree.length) {
                                this.cursor = "pointer";
                                this.hover.push(treeIndex);
                                let buttons = this.getLayerListButtons(this.layerTree[treeIndex]);
                                let buttonIndex = clamp(floor((this.canvasWidth - 20 - this.mouseX) / 24), 0, buttons.length);
                                this.hover.push((_c = buttons[buttonIndex]) !== null && _c !== void 0 ? _c : 0);
                            }
                            else if (treeIndex >= this.layerTree.length) {
                                this.hover.push(this.layerTree.length);
                            }
                        }
                    }
                }
                else if (this.leftBarWidth < this.mouseX && this.mouseX < this.canvasWidth - this.rightBarWidth &&
                    this.mouseY < this.canvasHeight - 50) {
                    if (this.mouseY < this.canvasHeight - 50 - this.timelineBarHeight - 50 - 8) {
                        this.hover = ["preview"];
                    }
                    else if (this.mouseY < this.canvasHeight - 50 - this.timelineBarHeight - 50) {
                        this.cursor = "ns-resize";
                        this.hover = ["innerBorder", "b"];
                    }
                    else if (this.canvasHeight - 50 - this.timelineBarHeight - 50 < this.mouseY &&
                        this.mouseY < this.canvasHeight - 50 - this.timelineBarHeight) {
                        this.hover = ["controlBar"];
                        for (let { type, align, pos, size: { w, h } } of this.cuis) {
                            let x1, x2, y1, y2;
                            switch (align) {
                                case 0:
                                    x1 = this.leftBarWidth + pos;
                                    x2 = x1 + w;
                                    break;
                                case 2:
                                    x2 = this.canvasWidth - this.rightBarWidth + pos;
                                    x1 = x2 - w;
                                    break;
                                default:
                                case 1:
                                    let x = (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2 + pos;
                                    x1 = x - w / 2;
                                    x2 = x + w / 2;
                                    break;
                            }
                            let y = this.canvasHeight - 50 - this.timelineBarHeight - 50 / 2;
                            y1 = y - h / 2;
                            y2 = y + h / 2;
                            if (x1 <= this.mouseX && this.mouseX <= x2 && y1 <= this.mouseY && this.mouseY <= y2) {
                                this.hover.push(type);
                                this.cursor = "pointer";
                                break;
                            }
                        }
                    }
                    else if (this.mouseY < this.canvasHeight - 50) {
                        this.hover = ["timeline"];
                        let top = this.canvasHeight - 50 - this.timelineBarHeight;
                        let bottom = this.canvasHeight - 50;
                        let left = this.leftBarWidth;
                        let right = this.canvasWidth - this.rightBarWidth;
                        if (this.mouseY < top + 18) {
                            this.hover.push("mark");
                        }
                        else if (this.mouseY < top + 18 + 18) {
                            this.hover.push("ruler");
                        }
                        else if (this.mouseY > bottom - 20) {
                            if (this.mouseX < left + 20) {
                                this.hover.push("scrollLeft");
                            }
                            else if (right - 20 < this.mouseX) {
                                this.hover.push("scrollRight");
                            }
                            else {
                                this.hover.push("scrollX");
                            }
                        }
                        else if (this.mouseX < left + 20 || right - 20 < this.mouseX) {
                            this.hover.push("sideRuler");
                        }
                        else {
                            this.hover.push("main");
                            let timelineHover = (_d = this.checkTimelineHover(this.mainAxis)) !== null && _d !== void 0 ? _d : this.checkTimelineHover(this.subAxis);
                            if (!timelineHover)
                                return;
                            if (timelineHover[0] == "tValueCurve") {
                                this.hover.push(...timelineHover);
                            }
                            else if (timelineHover[0] == "keyframe") {
                                this.hover.push("keyframe");
                                this.hoveredKeyframes.push(timelineHover[1]);
                            }
                        }
                    }
                }
                else if (this.mouseX < this.leftBarWidth &&
                    this.mouseY < this.canvasHeight - 50) {
                }
            }
        }
        checkTimelineHover(timelineIndex) {
            let timeline = this.timelines[timelineIndex];
            if (!timeline)
                return null;
            let mouseTime = round(this.mouseTimelineX);
            let mouseTValue = safeTValue(timeline.getTValueByFrame(mouseTime), timeline.tValueType);
            let [curveX, curveY] = this.timelineToCanvasPosition(mouseTime, mouseTValue);
            for (let keyframe of timeline.keyframes) {
                let [keyframeX, keyframeY] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                if (abs(keyframeX - this.mouseX) + abs(keyframeY - this.mouseY) <= 10) {
                    return ["keyframe", keyframe];
                }
            }
            if (abs(curveX - this.mouseX) + abs(curveY - this.mouseY) <= 10) {
                return ["tValueCurve", timelineIndex];
            }
            return null;
        }
        doMouse(hover, mouseState, wheel, event = null) {
            if (hover[0] == "header") {
                if (!hover[1]) {
                    if (mouseState == 2) {
                        this.mouseDragType = 1;
                        this.mouseDragTop = this.top;
                        this.mouseDragLeft = this.left;
                    }
                }
                else if (hover[1] == "close") {
                    if (mouseState == 3) {
                        this.isShow = false;
                        this.root.style.display = "none";
                        return;
                    }
                }
                else if (hover[1] == "minimize") {
                    if (mouseState == 3) {
                        this.isMinimized = !this.isMinimized;
                        if (this.isMinimized) {
                            this.canvasWidth = 240;
                            this.canvasHeight = 30;
                            this.left += this.width - this.canvasWidth;
                            this.mouseX += this.width - this.canvasWidth;
                        }
                        else {
                            this.left -= this.width - this.canvasWidth;
                            this.mouseX -= this.width - this.canvasWidth;
                            this.canvasWidth = this.width;
                            this.canvasHeight = this.height;
                            this.left = clamp(this.left, 5, window.innerWidth - this.canvasWidth - 5);
                            this.top = clamp(this.top, isGandi ? 65 : 53, window.innerHeight - this.canvasHeight - 5);
                        }
                        this.setCanvasSize(this.canvasWidth, this.canvasHeight);
                        this.setPosition();
                        this.updateCuis();
                        this.updateHoverAndCursor();
                    }
                }
            }
            else if (hover[0] == "border") {
                if (hover[1] == "rb") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 4;
                    this.mouseDragWidth = this.width;
                    this.mouseDragHeight = this.height;
                }
                else if (hover[1] == "r") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 2;
                    this.mouseDragWidth = this.width;
                }
                else if (hover[1] == "b") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 3;
                    this.mouseDragHeight = this.height;
                }
            }
            else if (hover[0] == "innerBorder") {
                if (hover[1] == "l") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 5;
                    this.mouseDragWidth = this.leftBarWidth;
                }
                else if (hover[1] == "r") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 7;
                    this.mouseDragWidth = this.rightBarWidth;
                }
                else if (hover[1] == "b") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 6;
                    this.mouseDragHeight = this.timelineBarHeight;
                }
                else if (hover[1] == "layer") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 8;
                    this.mouseDragHeight = this.layerBarHeight;
                }
            }
            else if (hover[0] == "newTanim") {
                if (mouseState != 3)
                    return;
                if (this.askAndCreateNewTanim())
                    return;
                this.updateTanimTree();
            }
            else if (hover[0] == "tanimScroll") {
                if (wheel < 0) {
                    this.scrollTanimList(-5);
                }
                if (wheel > 0) {
                    this.scrollTanimList(5);
                }
            }
            else if (hover[0] == "tanimList") {
                if (wheel < 0) {
                    this.scrollTanimList(-2);
                }
                if (wheel > 0) {
                    this.scrollTanimList(2);
                }
                if (hover[1] == this.tanimTree.length) {
                    if (mouseState != 8)
                        return;
                    if (this.askAndCreateNewTanim())
                        return;
                    this.updateTanimTree();
                }
                else if (typeof hover[1] == "number") {
                    let hoverItem = this.tanimTree[hover[1]];
                    switch (hoverItem.type) {
                        case 0:
                            if (!hoverItem.tanim)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2) {
                                        this.mouseDragType = 9;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    else if (mouseState == 8) {
                                        this.layers.length = 0;
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 3:
                                    if (mouseState == 3) {
                                        this.layers.length = 0;
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 4:
                                    if (mouseState == 3) {
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 2:
                                    if (mouseState == 3) {
                                        let idx = TheTanimManager.tanims.indexOf(hoverItem.tanim);
                                        if (idx == -1)
                                            break;
                                        let copy = TheTanimManager.getCopiedTanim(hoverItem.tanim);
                                        if (!copy)
                                            break;
                                        TheTanimManager.tanims.splice(idx + 1, 0, copy);
                                        this.updateTanimTree();
                                    }
                                    break;
                                case 6:
                                    if (mouseState == 3) {
                                        if (this.askAndRenameTanim(hoverItem.tanim))
                                            return;
                                    }
                                    break;
                                case 7:
                                    if (mouseState == 3) {
                                        if (!this.confirm(getTranslate("CQET_eDeleteTanimQuestion").replace("[tanimName]", hoverItem.tanim.name)))
                                            break;
                                        let idx = TheTanimManager.tanims.indexOf(hoverItem.tanim);
                                        if (idx == -1)
                                            break;
                                        if (this.layers.includes(hoverItem.tanim))
                                            this.removeLayer(this.layers.indexOf(hoverItem.tanim));
                                        this.recycleBin.push(hoverItem.tanim);
                                        TheTanimManager.tanims.splice(idx, 1);
                                        this.updateTanimTree();
                                    }
                                    break;
                            }
                            break;
                        case 1:
                        case 2:
                        case 3:
                            let tanims = TheTanimManager.getTanimsByPrefix(hoverItem.dir.join("//") + "//");
                            if (tanims.length == 0)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2 &&
                                        hoverItem.type == 3) {
                                        this.mouseDragType = 9;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    else if (mouseState == 8) {
                                        this.layers.length = 0;
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 3:
                                    if (mouseState == 3) {
                                        this.layers.length = 0;
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 4:
                                    if (mouseState == 3) {
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 1:
                                    if (mouseState == 3) {
                                        this.askAndCreateNewTanimInFolder(hoverItem.dir);
                                    }
                                    break;
                                case 6:
                                    if (mouseState == 3) {
                                        this.askAndRenameFolder(tanims, hoverItem.dir);
                                    }
                                    break;
                                case 8:
                                case 9:
                                    if (mouseState == 3) {
                                        this.foldedTanimFolders.add(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                                case 10:
                                    if (mouseState == 3) {
                                        this.foldedTanimFolders.delete(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                            }
                            break;
                    }
                }
            }
            else if (hover[0] == "layerScroll") {
                if (wheel < 0) {
                    this.scrollLayerList(-5);
                }
                if (wheel > 0) {
                    this.scrollLayerList(5);
                }
            }
            else if (hover[0] == "layerList") {
                if (wheel < 0) {
                    this.scrollLayerList(-2);
                }
                if (wheel > 0) {
                    this.scrollLayerList(2);
                }
                if (typeof hover[1] == "number" && hover[1] < this.layerTree.length) {
                    let hoverItem = this.layerTree[hover[1]];
                    switch (hoverItem.type) {
                        case 0:
                            if (!hoverItem.tanim)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2) {
                                        this.mouseDragType = 10;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    else if (mouseState == 3) {
                                        this.editTanim(hoverItem.tanim);
                                    }
                                    break;
                                case 5:
                                    if (mouseState == 3) {
                                        let idx = this.layers.indexOf(hoverItem.tanim);
                                        if (idx == -1)
                                            break;
                                        this.removeLayer(idx);
                                    }
                                    break;
                            }
                            break;
                        case 1:
                        case 2:
                        case 3:
                            let tanims = this.layers.filter(tanim => tanim.name.startsWith(hoverItem.dir.join("//")));
                            if (tanims.length == 0)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2 &&
                                        hoverItem.type == 3) {
                                        this.mouseDragType = 10;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    break;
                                case 5:
                                    if (mouseState == 3) {
                                        for (let tanim of tanims) {
                                            let idx = this.layers.indexOf(tanim);
                                            if (idx == -1)
                                                continue;
                                            this.removeLayer(idx, false);
                                        }
                                        this.updateLayerTree();
                                    }
                                    break;
                                case 8:
                                case 9:
                                    if (mouseState == 3) {
                                        this.foldedLayerFolders.add(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                                case 10:
                                    if (mouseState == 3) {
                                        this.foldedLayerFolders.delete(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                            }
                            break;
                    }
                }
            }
            else if (hover[0] == "controlBar") {
                if (!hover[1])
                    return;
                switch (hover[1]) {
                    case 7:
                        break;
                    case 11:
                        if (mouseState == 2) {
                            this.isLoop = !this.isLoop;
                        }
                        break;
                    case 12:
                        if (mouseState == 2) {
                            this.isYoyo = !this.isYoyo;
                        }
                        break;
                    case 1:
                        if (mouseState == 2) {
                            if (this.timelines[1]) {
                                this.mainAxis = this.mainAxis == 0 ? 1 : 0;
                            }
                        }
                        break;
                }
            }
            else if (hover[0] == "timeline") {
                if (!this.tanim)
                    return;
                let dScale = (event === null || event === void 0 ? void 0 : event.altKey) ? 4 : 1;
                let dScroll = 40;
                if (event === null || event === void 0 ? void 0 : event.ctrlKey)
                    dScroll *= 0.25;
                if (event === null || event === void 0 ? void 0 : event.altKey)
                    dScroll *= 4;
                if (mouseState == 6) {
                    this.mouseDragType = 11;
                    this.mouseDragX = this.mouseX;
                    this.mouseDragY = this.mouseY;
                    return;
                }
                switch (hover[1]) {
                    case "main":
                        if (wheel != 0) {
                            if (event === null || event === void 0 ? void 0 : event.shiftKey) {
                                this.scrollTimeline(sign(wheel) * dScroll / this.timelineScaleX, 0);
                            }
                            else {
                                this.scrollTimeline(0, -sign(wheel) * dScroll / this.timelineScaleY);
                            }
                        }
                        break;
                    case "mark":
                    case "ruler":
                        if (wheel < 0) {
                            this.scaleTimelineX(dScale);
                        }
                        if (wheel > 0) {
                            this.scaleTimelineX(-dScale);
                        }
                        if (mouseState == 2) {
                            this.focus(this.mouseTimelineX);
                        }
                        break;
                    case "sideRuler":
                        if (wheel < 0) {
                            this.scaleTimelineY(dScale);
                        }
                        if (wheel > 0) {
                            this.scaleTimelineY(-dScale);
                        }
                        break;
                    case "scrollLeft":
                    case "scrollRight":
                        if (mouseState == 2) {
                            this.scrollTimeline((hover[1] == "scrollRight" ? 1 : -1) * dScroll / this.timelineScaleX, 0);
                            break;
                        }
                    case "scrollX":
                        if (wheel != 0) {
                            this.scrollTimeline(sign(wheel) * dScroll / this.timelineScaleX, 0);
                            break;
                        }
                        if (mouseState == 2) {
                            let length = this.tanim.length;
                            let blockStart = this.canvasTotimelinePosition(this.leftBarWidth, 0)[0];
                            let blockEnd = this.canvasTotimelinePosition(this.canvasWidth - this.rightBarWidth, 0)[0];
                            let mouseTime = this.scrollXToTime(this.mouseX, 0, length);
                            if (mouseTime < blockStart)
                                this.scrollTimeline(mouseTime - blockStart, 0);
                            if (blockEnd < mouseTime)
                                this.scrollTimeline(mouseTime - blockEnd, 0);
                            this.mouseDragType = 12;
                            this.mouseDragX = this.mouseX;
                            break;
                        }
                }
            }
        }
        getLeftKeyframe() {
            var _a, _c;
            let f0 = (_a = this.timelines[0]) === null || _a === void 0 ? void 0 : _a.findLeftKeyframe(this.focusTime, false);
            let f1 = (_c = this.timelines[1]) === null || _c === void 0 ? void 0 : _c.findLeftKeyframe(this.focusTime, false);
            if (f0 && f1) {
                return f0.x > f1.x ? [f0, this.timelines[0]] : [f1, this.timelines[1]];
            }
            else {
                return f0 ? [f0, this.timelines[0]] : f1 ? [f1, this.timelines[1]] : [null, null];
            }
        }
        getRightKeyframe() {
            var _a, _c;
            let f0 = (_a = this.timelines[0]) === null || _a === void 0 ? void 0 : _a.findRightKeyframe(this.focusTime, false);
            let f1 = (_c = this.timelines[1]) === null || _c === void 0 ? void 0 : _c.findRightKeyframe(this.focusTime, false);
            if (f0 && f1) {
                return f0.x < f1.x ? [f0, this.timelines[0]] : [f1, this.timelines[1]];
            }
            else {
                return f0 ? [f0, this.timelines[0]] : f1 ? [f1, this.timelines[1]] : [null, null];
            }
        }
        getNewKeyframeTimeline() {
            if (this.timelines[this.mainAxis] && !this.timelines[this.mainAxis].findKeyframeByTime(this.focusTime)) {
                return this.timelines[this.mainAxis];
            }
            else if (this.timelines[this.subAxis] && !this.timelines[this.subAxis].findKeyframeByTime(this.focusTime)) {
                return this.timelines[this.subAxis];
            }
            else
                return null;
        }
        getDeleteKeyframeTimeline() {
            if (this.timelines[this.mainAxis] && this.timelines[this.mainAxis].findKeyframeByTime(this.focusTime)) {
                return this.timelines[this.mainAxis];
            }
            else if (this.timelines[this.subAxis] && this.timelines[this.subAxis].findKeyframeByTime(this.focusTime)) {
                return this.timelines[this.subAxis];
            }
            else
                return null;
        }
        update(events) {
            var _a;
            let { mouseEvent, wheelEvent, keyboardEvent } = events !== null && events !== void 0 ? events : {};
            if (mouseEvent) {
                this.mouseClientX = mouseEvent.clientX;
                this.mouseClientY = mouseEvent.clientY;
            }
            let event = (_a = mouseEvent !== null && mouseEvent !== void 0 ? mouseEvent : wheelEvent) !== null && _a !== void 0 ? _a : keyboardEvent;
            if (this.isInputing)
                return;
            let ctx = this.ctx;
            if (this.isMinimized) {
                this.canvasWidth = 240;
                this.canvasHeight = 30;
            }
            else {
                this.canvasWidth = this.width;
                this.canvasHeight = this.height;
            }
            let mouseState = 0;
            if (mouseEvent) {
                switch (mouseEvent.type) {
                    case "mousemove":
                        mouseState = 1;
                        break;
                    case "mousedown":
                        switch (mouseEvent.button) {
                            case 0:
                                mouseState = 2;
                                break;
                            case 1:
                                mouseState = 6;
                                break;
                            case 2:
                                mouseState = 4;
                                break;
                        }
                        if (this.mouseDragType == 0 && mouseState != 0) {
                            this.mouseDragClientX = this.mouseClientX;
                            this.mouseDragClientY = this.mouseClientY;
                        }
                        break;
                    case "mouseup":
                        switch (mouseEvent.button) {
                            case 0:
                                mouseState = 3;
                                break;
                            case 1:
                                mouseState = 7;
                                break;
                            case 2:
                                mouseState = 5;
                                break;
                        }
                        break;
                    case "dblclick":
                        mouseState = 8;
                        break;
                    default:
                        mouseState = 1;
                        break;
                }
            }
            this.updateMousePosition();
            let wheel = 0;
            if (wheelEvent) {
                wheel = wheelEvent.deltaY;
            }
            let lastCursor = this.cursor;
            this.updateHoverAndCursor();
            if (this.mouseDragType != 0) {
                if (this.mouseDragType == 9 && mouseState == 3) {
                    if (this.hover[0] == "tanimList" && typeof this.hover[1] == "number") {
                        this.dropTanimToTanims(this.mouseDragIndex, this.hover[1]);
                    }
                    else if (this.hover[0] == "layerList" && typeof this.hover[1] == "number") {
                        this.dropTanimToLayers(this.mouseDragIndex, this.hover[1]);
                    }
                }
                else if (this.mouseDragType == 10 && mouseState == 3) {
                    if (this.hover[0] == "layerList" && typeof this.hover[1] == "number") {
                        if (this.mouseDragIndex === this.hover[1] && this.layerTree[this.hover[1]].tanim) {
                            this.doMouse(this.hover, mouseState, wheel, event);
                        }
                        else {
                            this.dropLayerToLayers(this.mouseDragIndex, this.hover[1]);
                        }
                    }
                }
            }
            else
                this.doMouse(this.hover, mouseState, wheel, event);
            if (mouseEvent && mouseState == 1) {
                switch (this.mouseDragType) {
                    case 1:
                    case 11:
                        this.cursor = "move";
                        break;
                    case 2:
                    case 5:
                    case 7:
                        this.cursor = "ew-resize";
                        break;
                    case 3:
                    case 6:
                    case 8:
                        this.cursor = "ns-resize";
                        break;
                    case 4:
                        this.cursor = "nwse-resize";
                        break;
                    case 9:
                    case 10:
                        if (this.hover[0] == "tanimList" || this.hover[0] == "layerList") {
                            this.cursor = "grabbing";
                        }
                        else {
                            this.cursor = "no-drop";
                        }
                        break;
                }
                if (this.mouseDragType == 9 || this.mouseDragType == 10) {
                    mouseEvent.preventDefault();
                }
                else if (this.mouseDragType == 1) {
                    mouseEvent.preventDefault();
                    this.left = clamp(this.mouseDragLeft + this.mouseClientX - this.mouseDragClientX, 5, window.innerWidth - this.canvasWidth - 5);
                    this.top = clamp(this.mouseDragTop + this.mouseClientY - this.mouseDragClientY, isGandi ? 65 : 53, window.innerHeight - this.canvasHeight - 5);
                    this.setPosition();
                }
                else {
                    let resized = false;
                    if (this.mouseDragType == 2 || this.mouseDragType == 4) {
                        mouseEvent.preventDefault();
                        this.width = clamp(this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX, 60 + 380 + 200, window.innerWidth - this.left - 5);
                        let d = (this.leftBarWidth + this.rightBarWidth + 380) - this.canvasWidth;
                        if (d > 0) {
                            let sl = this.leftBarWidth - 60;
                            let sr = this.rightBarWidth - 200;
                            if (sl >= d) {
                                this.leftBarWidth -= d;
                            }
                            else {
                                this.leftBarWidth = 60;
                                this.rightBarWidth -= d - sl;
                            }
                        }
                        resized = true;
                    }
                    if (this.mouseDragType == 3 || this.mouseDragType == 4) {
                        mouseEvent.preventDefault();
                        this.height = clamp(this.mouseDragHeight + this.mouseClientY - this.mouseDragClientY, 30 + max(120 + 50 + 90, 200 + 70 + 130) + 50, window.innerHeight - this.top - 5);
                        let d = (30 + 120 + 50 + this.timelineBarHeight + 50) - this.canvasHeight;
                        if (d > 0) {
                            this.timelineBarHeight -= d;
                        }
                        d = (30 + 200 + this.layerBarHeight + 130 + 50) - this.canvasHeight;
                        if (d > 0) {
                            this.layerBarHeight -= d;
                        }
                        resized = true;
                    }
                    if (this.mouseDragType == 5) {
                        mouseEvent.preventDefault();
                        this.leftBarWidth = clamp(this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX, 60, this.canvasWidth - 380 - 200);
                        let d = (this.leftBarWidth + this.rightBarWidth + 380) - this.canvasWidth;
                        if (d > 0) {
                            this.rightBarWidth -= d;
                        }
                        this.updateCuis();
                    }
                    else if (this.mouseDragType == 7) {
                        mouseEvent.preventDefault();
                        this.rightBarWidth = clamp(this.mouseDragWidth + this.mouseDragClientX - this.mouseClientX, 200, this.canvasWidth - 380 - 60);
                        let d = (this.leftBarWidth + this.rightBarWidth + 380) - this.canvasWidth;
                        if (d > 0) {
                            this.leftBarWidth -= d;
                        }
                        this.updateCuis();
                    }
                    else if (this.mouseDragType == 6) {
                        mouseEvent.preventDefault();
                        this.timelineBarHeight = clamp(this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY, 90, this.canvasHeight - 50 - 50 - 120 - 30);
                        this.updateCuis();
                    }
                    else if (this.mouseDragType == 8) {
                        mouseEvent.preventDefault();
                        this.layerBarHeight = clamp(this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY, 70, this.canvasHeight - 50 - 200 - 130 - 30);
                    }
                    else if (this.mouseDragType == 11) {
                        mouseEvent.preventDefault();
                        this.scrollTimeline((this.mouseDragX - this.mouseX) / this.timelineScaleX, -(this.mouseDragY - this.mouseY) / this.timelineScaleY);
                        this.mouseDragX = this.mouseX;
                        this.mouseDragY = this.mouseY;
                    }
                    else if (this.mouseDragType == 12) {
                        mouseEvent.preventDefault();
                        if (this.tanim) {
                            let fromTime = this.scrollXToTime(this.mouseDragX, 0, this.tanim.length);
                            let toTime = this.scrollXToTime(this.mouseX, 0, this.tanim.length);
                            this.scrollTimeline(toTime - fromTime, 0);
                        }
                        this.mouseDragX = this.mouseX;
                    }
                    if (resized)
                        this.setCanvasSize();
                }
            }
            if (mouseState == 3 || mouseState == 5 || mouseState == 7) {
                this.mouseDragType = 0;
            }
            this.scrollTanimList(0);
            this.scrollLayerList(0);
            this.hint[0] = this.hover.join("-");
            if (this.mouseDragType != 1) {
                ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                if (!this.isMinimized) {
                    this.drawTimelineBar(this.leftBarWidth, this.canvasHeight - 50 - this.timelineBarHeight, this.canvasWidth - this.rightBarWidth, this.canvasHeight - 50);
                    this.drawControlBar(this.leftBarWidth, this.canvasHeight - this.timelineBarHeight - 50 - 50, this.canvasWidth - this.rightBarWidth, this.canvasHeight - this.timelineBarHeight - 50, this.cuis, this.hover, this.mouseDragType == 0 ? 1 : 0);
                    this.drawTValueBar(0, 30, this.leftBarWidth, this.canvasHeight - 50);
                    this.drawRightBar(this.canvasWidth - this.rightBarWidth, 30, this.canvasWidth, this.canvasHeight - 50);
                    this.drawTanimList("tanimList", this.canvasWidth - this.rightBarWidth + 1, 30, this.canvasWidth, this.canvasHeight - 50 - 200 - this.layerBarHeight, this.hover, [0, 9].includes(this.mouseDragType) ? 1 : 0, this.tanimListScroll);
                    this.drawTanimListButton(1, this.canvasWidth - 20 - 24 / 2, 30 + 24 / 2, 24, 24, this.hover[0] == "newTanim" && this.mouseDragType == 0 ? 1 : 0);
                    this.drawTanimList("layerList", this.canvasWidth - this.rightBarWidth + 1, this.canvasHeight - 50 - 200 - this.layerBarHeight, this.canvasWidth, this.canvasHeight - 50 - 200, this.hover, [0, 9, 10].includes(this.mouseDragType) ? 1 : 0, this.layerListScroll);
                    this.drawKeyframeBar(this.canvasWidth - this.rightBarWidth + 1, this.canvasHeight - 50 - 200, this.canvasWidth, this.canvasHeight - 50);
                    this.drawHintBar(this.canvasHeight, this.canvasWidth, 50);
                }
                this.drawHeader(this.canvasWidth, 30);
                this.drawClose(this.canvasWidth - 40 / 2, 30 / 2, 40, 30, this.hover[0] == "header" && this.hover[1] == "close" && this.mouseDragType == 0 ? 1 : 0);
                this.drawMinimize(this.canvasWidth - 40 * 1.5, 30 / 2, 40, 30, this.hover[0] == "header" && this.hover[1] == "minimize" && this.mouseDragType == 0 ? 1 : 0);
            }
            if (this.cursor != lastCursor) {
                this.root.style.cursor = this.cursor;
            }
        }
        drawRoundedRect(x, y, width, height, radius) {
            let ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.lineTo(x + radius, y + height);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.closePath();
        }
        drawControlBar(x1, y1, x2, y2, cuis, hover, uiState) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #e6e6e6";
            ctx.fillRect(x1, y2, x2 - x1, y1 - y2);
            for (let cui of this.cuis) {
                this.drawCUI(x1, y1, x2, y2, cui, hover, uiState);
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y2 - 0.5);
            ctx.lineTo(x2, y2 - 0.5);
            ctx.moveTo(x1, y1 - 0.5);
            ctx.lineTo(x2, y1 - 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawCUI(x1, y1, x2, y2, cui, hover, uiState) {
            var _a;
            let { type, align, pos, size } = cui;
            let x = (align == 0 ? x1 : align == 2 ? x2 : (x1 + x2) / 2) + pos;
            let y = (y1 + y2) / 2;
            let { w, h } = size;
            let radius = 4;
            let ctx = this.ctx;
            ctx.save();
            let c1 = " #666666";
            let c2 = " #e6e6e6";
            if (hover[0] == "controlBar" && hover[1] == type && uiState == 1) {
                c2 = " #cccccc";
                ctx.fillStyle = c2;
                switch (align) {
                    case 1:
                        this.drawRoundedRect(x - w / 2, y - h / 2, w, h, radius);
                        break;
                    case 0:
                        this.drawRoundedRect(x, y - h / 2, w, h, radius);
                        break;
                    case 2:
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
                case 7:
                    ctx.arc(x, y, 18, 0, 2 * PI);
                    ctx.fillStyle = c1;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x + 14, y);
                    ctx.lineTo(x - 7, y - 12.1);
                    ctx.lineTo(x - 7, y + 12.1);
                    ctx.closePath();
                    ctx.fillStyle = c2;
                    ctx.fill();
                    break;
                case 6:
                    ctx.moveTo(x - 9 - 3, y);
                    ctx.lineTo(x + 9 - 3, y - 10.3);
                    ctx.lineTo(x + 9 - 3, y + 10.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x + 9 + 1, y - 10.3);
                    ctx.lineTo(x + 9 + 1, y + 10.3);
                    ctx.stroke();
                    break;
                case 8:
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
                case 5:
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
                    ctx.fillStyle = timeline ? tValueTypeToHSL(timeline.tValueType, 70, 70) : c2;
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 9:
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
                    let [, timeline_] = this.getRightKeyframe();
                    ctx.fillStyle = timeline_ ? tValueTypeToHSL(timeline_.tValueType, 70, 70) : c2;
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 4:
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
                case 10:
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
                case 11:
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
                case 12:
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
                case 3:
                case 2:
                    ctx.lineCap = "round";
                    ctx.moveTo(x - 7 - 2, y + 2);
                    ctx.lineTo(x - 2, y - 7 + 2);
                    ctx.lineTo(x + 7 - 2, y + 2);
                    ctx.lineTo(x - 2, y + 7 + 2);
                    ctx.closePath();
                    ctx.fillStyle = this.timelines[this.mainAxis] ? tValueTypeToHSL((_a = this.timelines[this.mainAxis]) === null || _a === void 0 ? void 0 : _a.tValueType, 70, 70) : c2;
                    ctx.fill();
                    ctx.moveTo(x + 3, y - 6);
                    ctx.lineTo(x + 9, y - 6);
                    if (type == 2) {
                        ctx.moveTo(x + 6, y - 3);
                        ctx.lineTo(x + 6, y - 9);
                    }
                    ctx.stroke();
                    break;
                case 1:
                    ctx.lineCap = "round";
                    if (this.mainAxis == 0) {
                        ctx.moveTo(x + 4, y - 9);
                        ctx.lineTo(x + 9, y - 4);
                        ctx.moveTo(x + 4, y - 4);
                        ctx.lineTo(x + 9, y - 9);
                        ctx.moveTo(x - 7, y + 10);
                        ctx.lineTo(x - 7, y - 9);
                        ctx.moveTo(x - 7 - 3, y - 9 + 3);
                        ctx.lineTo(x - 7, y - 9);
                        ctx.lineTo(x - 7 + 3, y - 9 + 3);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x - 8, y + 6);
                        ctx.lineTo(x + 7, y + 6);
                        ctx.moveTo(x + 7 - 3, y + 6 - 3);
                        ctx.lineTo(x + 7, y + 6);
                        ctx.lineTo(x + 7 - 3, y + 6 + 3);
                    }
                    else {
                        ctx.moveTo(x + 4, y - 9);
                        ctx.lineTo(x + 6.5, y - 6.5);
                        ctx.lineTo(x + 9, y - 9);
                        ctx.moveTo(x + 6.5, y - 6.5);
                        ctx.lineTo(x + 6.5, y - 3);
                        ctx.moveTo(x - 10, y + 7);
                        ctx.lineTo(x + 9, y + 7);
                        ctx.moveTo(x + 9 - 3, y + 7 - 3);
                        ctx.lineTo(x + 9, y + 7);
                        ctx.lineTo(x + 9 - 3, y + 7 + 3);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x - 6, y + 8);
                        ctx.lineTo(x - 6, y - 7);
                        ctx.moveTo(x - 6 - 3, y - 7 + 3);
                        ctx.lineTo(x - 6, y - 7);
                        ctx.lineTo(x - 6 + 3, y - 7 + 3);
                    }
                    ctx.lineWidth = 8;
                    ctx.stroke();
                    ctx.strokeStyle = this.timelines[this.mainAxis] ? tValueTypeToHSL(this.timelines[this.mainAxis].tValueType, 70, 70) : c2;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    break;
                case 13:
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
                case 0:
                    ctx.font = "18px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                    ctx.textAlign = "left";
                    ctx.fillText(`${round(this.mouseTimelineX)},${round(this.mouseTimelineY * 10000) / 10000}`, x + 2, y + h / 5, w - 4);
                    break;
                case 14:
                    if (!this.tanim)
                        break;
                    ctx.font = "18px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                    ctx.textAlign = "right";
                    ctx.fillText(getTranslate("CQET_eCUIFPS").replace("[fps]", `${this.tanim.fps}`), x - 2, y + h / 5, w - 4);
                    break;
            }
            ctx.restore();
        }
        drawTimelineBar(x1, y1, x2, y2) {
            var _a, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            if (!this.tanim) {
                ctx.restore();
                return;
            }
            const tanim = this.tanim;
            ctx.fillStyle = " #e6e6e6";
            let startX = floor(this.timelineToCanvasPosition(0, 0)[0]);
            if (startX > x1)
                ctx.fillRect(x1, y1, startX - x1, y2 - y1);
            let endX = ceil(this.timelineToCanvasPosition(tanim.length, 0)[0]);
            if (endX < x2)
                ctx.fillRect(x2, y1, endX - x2, y2 - y1);
            let y = this.canvasHeight;
            let step = this.timelineScaleY > 4000 ? 0.005 : this.timelineScaleY > 2000 ? 0.01 : this.timelineScaleY > 400 ? 0.05 : this.timelineScaleY > 200 ? 0.1 : this.timelineScaleY > 40 ? 0.5 :
                this.timelineScaleY > 20 ? 1 : this.timelineScaleY > 4 ? 5 : this.timelineScaleY > 2 ? 10 : this.timelineScaleY > 0.4 ? 50 : this.timelineScaleY > 0.2 ? 100 :
                    this.timelineScaleY > 0.04 ? 500 : this.timelineScaleY > 0.02 ? 1000 : 5000;
            let stepSmall = 10 ** ceil(log10(3 / this.timelineScaleY));
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = " #666666";
            for (let tValue = floor(this.timelineScrollY / stepSmall) * stepSmall; y > y1; tValue += stepSmall) {
                tValue = round(round(tValue / stepSmall) * stepSmall * 1e8) / 1e8;
                [, y] = this.timelineToCanvasPosition(0, tValue);
                let m = positiveMod(tValue, step);
                if (m <= 1e-8 || m >= step - 1e-8) {
                    ctx.fillRect(x1, y, 20 / 2, 1);
                    ctx.textAlign = "left";
                    ctx.fillText(`${tValue}`, x1 + 20 / 4, y - 2, 20);
                    ctx.fillRect(x2, y, -20 / 2, 1);
                    ctx.textAlign = "right";
                    ctx.fillText(`${tValue}`, x2 - 20 / 4, y - 2, 20);
                }
                else {
                    ctx.fillRect(x1, y, 20 / 5, 1);
                    ctx.fillRect(x2, y, -20 / 5, 1);
                }
            }
            if (this.hover[0] == "timeline" && this.hover[1] == "main") {
                ctx.fillStyle = " #666666";
                ctx.fillRect(this.mouseX, y1, 1, y2 - y1);
                ctx.fillRect(x1, this.mouseY, x2 - x1, 1);
            }
            let x = 0;
            step = 1;
            let newKeyframeTimeline = null;
            let newKeyframeTime = 0;
            if (this.hover[0] == "timeline" && this.hover[1] == "main" && this.hover[2] == "tValueCurve") {
                newKeyframeTimeline = this.timelines[this.hover[3]];
                newKeyframeTime = round(this.mouseTimelineX);
            }
            else if (this.hover[0] == "controlBar" && this.hover[1] == 2) {
                newKeyframeTimeline = this.getNewKeyframeTimeline();
                newKeyframeTime = this.focusTime;
            }
            let drawTValueCurve = (timeline) => {
                let tValueType = timeline.tValueType;
                ctx.beginPath();
                for (x = x1; x < x2; x += step) {
                    let [time,] = this.canvasTotimelinePosition(x, 0);
                    let tValue = safeTValue(timeline.getTValueByFrame(time), tValueType);
                    let y = max(this.timelineToCanvasPosition(0, tValue)[1], y1);
                    if (x == x1) {
                        ctx.moveTo(x, y);
                    }
                    else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.lineWidth = 3;
                ctx.strokeStyle = tValueTypeToHSL(tValueType, 70, 45);
                ctx.stroke();
                if (newKeyframeTimeline == timeline) {
                    let [x, y] = this.timelineToCanvasPosition(newKeyframeTime, safeTValue(timeline.getTValueByFrame(newKeyframeTime), timeline.tValueType));
                    this.drawKeyframe(x, y, timeline.tValueType, "preview");
                }
            };
            if (this.timelines[1]) {
                drawTValueCurve(this.timelines[this.subAxis]);
                drawTValueCurve(this.timelines[this.mainAxis]);
            }
            else if (this.timelines[0]) {
                drawTValueCurve(this.timelines[0]);
            }
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(x1, y1, x2 - x1, 18 + 18 - 1);
            ctx.fillStyle = " #666666";
            ctx.fillRect(x1, y1 + 18, x2 - x1, -1);
            ctx.fillRect(x1, y1 + 18 + 18, x2 - x1, -1);
            x = 0;
            step = 2 ** max(ceil(log2(60 / (tanim.fps * this.timelineScaleX))), 0);
            ctx.font = "12px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            for (let sec = floor(this.timelineScrollX / tanim.fps); x < x2; sec += step) {
                [x,] = this.timelineToCanvasPosition(sec * tanim.fps, 0);
                ctx.fillRect(x, y1 + 18, 1, 18);
                ctx.fillText(`${sec}`, x + 1, y1 + 18 + 18 + 1);
            }
            x = 0;
            step = this.timelineScaleX > 45 ? 1 : this.timelineScaleX > 9 ? 5 : this.timelineScaleX > 5 ? 10 : tanim.fps;
            ctx.textBaseline = "alphabetic";
            for (let frame = floor(this.timelineScrollX); x < x2; frame++) {
                [x,] = this.timelineToCanvasPosition(frame, 0);
                if (frame % step == 0) {
                    ctx.fillRect(x, y1 + 18 + 18, 1, -18 / 2);
                    ctx.fillText(`${frame}`, x + 1, y1 + 18 + 18 / 2 + 1);
                }
                else {
                    ctx.fillRect(x, y1 + 18 + 18, 1, -18 / 4);
                }
            }
            ctx.beginPath();
            ctx.fillStyle = " #666666";
            ctx.strokeStyle = " #666666";
            if (x1 < startX + 8 + 12 && startX < x2) {
                ctx.fillRect(startX - 1, y1, 2, y2 - y1);
                ctx.moveTo(startX, y1);
                ctx.lineTo(startX + 8, y1);
                ctx.lineTo(startX + 8 + 12, y1 + 18 / 2);
                ctx.lineTo(startX + 8, y1 + 18);
                ctx.lineTo(startX, y1 + 18);
            }
            if (x1 < endX && endX - 8 - 12 < x2) {
                ctx.fillRect(endX + 1, y1, -2, y2 - y1);
                ctx.moveTo(endX, y1);
                ctx.lineTo(endX - 8, y1);
                ctx.lineTo(endX - 8 - 12, y1 + 18 / 2);
                ctx.lineTo(endX - 8, y1 + 18);
                ctx.lineTo(endX, y1 + 18);
            }
            ctx.fill();
            let focusX = floor(this.timelineToCanvasPosition(this.focusTime, 0)[0]);
            if (x1 < focusX + 8 && focusX - 8 < x2) {
                let y = y1 + 18 + 18;
                ctx.beginPath();
                ctx.fillStyle = " #ffffff";
                ctx.fillRect(focusX - 1, y, 4, y2 - y);
                ctx.fillStyle = tValueTypeToHSL((_e = (_c = (_a = this.timelines[this.mainAxis]) === null || _a === void 0 ? void 0 : _a.tValueType) !== null && _c !== void 0 ? _c : (_d = this.timelines[this.subAxis]) === null || _d === void 0 ? void 0 : _d.tValueType) !== null && _e !== void 0 ? _e : "px", 50, 40);
                ctx.fillRect(focusX, y, 2, y2 - y);
                ctx.moveTo(focusX - 8, y - 10);
                ctx.lineTo(focusX, y);
                ctx.lineTo(focusX + 8, y - 10);
                ctx.fill();
            }
            if ((this.hover[1] == "mark" || this.hover[1] == "ruler") && round(this.mouseTimelineX) !== this.focusTime) {
                let mouseFocusX = floor(this.timelineToCanvasPosition(round(this.mouseTimelineX), 0)[0]);
                if (x1 < mouseFocusX + 8 && mouseFocusX - 8 < x2) {
                    let y = y1 + 18 + 18;
                    ctx.beginPath();
                    ctx.fillStyle = " #ffffff";
                    ctx.fillRect(mouseFocusX - 1, y, 3, y2 - y);
                    ctx.fillStyle = tValueTypeToHSL((_j = (_g = (_f = this.timelines[this.mainAxis]) === null || _f === void 0 ? void 0 : _f.tValueType) !== null && _g !== void 0 ? _g : (_h = this.timelines[this.subAxis]) === null || _h === void 0 ? void 0 : _h.tValueType) !== null && _j !== void 0 ? _j : "px", 50, 70);
                    ctx.fillRect(mouseFocusX, y, 1, y2 - y);
                    ctx.moveTo(mouseFocusX - 8, y - 10);
                    ctx.lineTo(mouseFocusX, y);
                    ctx.lineTo(mouseFocusX + 8, y - 10);
                    ctx.fill();
                }
            }
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(x1, y2, x2 - x1, -20);
            let scrollBlockLeft = this.timeToScrollX(this.canvasTotimelinePosition(x1, 0)[0], 0, tanim.length);
            let scrollBlockRight = this.timeToScrollX(this.canvasTotimelinePosition(x2, 0)[0], 0, tanim.length);
            if (this.mouseDragType == 12) {
                ctx.fillStyle = " #b3b3b3";
            }
            else if (this.hover[1] == "scrollX") {
                ctx.fillStyle = " #bfbfbf";
            }
            else {
                ctx.fillStyle = " #cccccc";
            }
            ctx.fillRect(scrollBlockLeft, y2, scrollBlockRight - scrollBlockLeft, -20);
            let scrollStart = this.timeToScrollX(0, 0, tanim.length);
            let scrollEnd = this.timeToScrollX(tanim.length, 0, tanim.length);
            let scrollFocus = this.timeToScrollX(this.focusTime, 0, tanim.length);
            ctx.beginPath();
            ctx.moveTo(scrollStart, y2);
            ctx.lineTo(scrollStart + 8, y2 - 20 / 2);
            ctx.lineTo(scrollStart, y2 - 20);
            ctx.moveTo(scrollEnd, y2);
            ctx.lineTo(scrollEnd - 8, y2 - 20 / 2);
            ctx.lineTo(scrollEnd, y2 - 20);
            ctx.fillStyle = " #666666";
            ctx.fill();
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(floor(scrollFocus) - 2, y2, 5, -20);
            ctx.fillStyle = tValueTypeToHSL((_o = (_l = (_k = this.timelines[this.mainAxis]) === null || _k === void 0 ? void 0 : _k.tValueType) !== null && _l !== void 0 ? _l : (_m = this.timelines[this.subAxis]) === null || _m === void 0 ? void 0 : _m.tValueType) !== null && _o !== void 0 ? _o : "px", 50, 40);
            ctx.fillRect(floor(scrollFocus) - 1, y2, 3, -20);
            ctx.fillStyle = (this.hover[1] == "scrollLeft" && this.mouseDragType == 0) ? " #cccccc" : " #ffffff";
            ctx.fillRect(x1, y2, 20, -20);
            ctx.fillStyle = (this.hover[1] == "scrollRight" && this.mouseDragType == 0) ? " #cccccc" : " #ffffff";
            ctx.fillRect(x2, y2, -20, -20);
            ctx.fillStyle = " #666666";
            ctx.fillRect(x1 + 20, y2, -1, -20);
            ctx.fillRect(x2 - 20, y2, 1, -20);
            ctx.beginPath();
            let tx = x1 + 20 / 2;
            let ty = y2 - 20 / 2;
            ctx.moveTo(tx + 3, ty - 6);
            ctx.lineTo(tx - 6, ty);
            ctx.lineTo(tx + 3, ty + 6);
            tx = x2 - 20 / 2;
            ctx.moveTo(tx - 3, ty - 6);
            ctx.lineTo(tx + 6, ty);
            ctx.lineTo(tx - 3, ty + 6);
            ctx.fillStyle = " #666666";
            ctx.fill();
            ctx.fillRect(x1, y2 - 20, x2 - x1, 1);
            ctx.restore();
        }
        drawKeyframe(x, y, tValueType, type = "default") {
            let ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x - (10 - 2), y);
            ctx.lineTo(x, y - (10 - 2));
            ctx.lineTo(x + (10 - 2), y);
            ctx.lineTo(x, y + (10 - 2));
            ctx.closePath();
            ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70, type == "default" ? 100 : 50);
            ctx.fill();
            if (type == "default") {
                ctx.strokeStyle = " #666666";
                ctx.lineWidth = 4;
                ctx.stroke();
            }
            else if (type == "preview") {
                ctx.strokeStyle = " #ffffff";
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.strokeStyle = " #999999";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.restore();
        }
        drawTValueBar(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x2 - 0.5, y1);
            ctx.lineTo(x2 - 0.5, y2);
            ctx.stroke();
            ctx.restore();
        }
        drawRightBar(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1 + 0.5, y1);
            ctx.lineTo(x1 + 0.5, y2);
            ctx.stroke();
            ctx.restore();
        }
        drawTanimList(type, x1, y1, x2, y2, hover, uiState, scroll) {
            let tanimTree = type == "tanimList" ? this.tanimTree : this.layerTree;
            let tanimFolders = type == "tanimList" ? this.tanimFolders : this.layerFolders;
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "bold " + "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.fillStyle = " #666666";
            ctx.fillText(getTranslate(type == "tanimList" ? "CQET_eTanimListTitle" : "CQET_eLayerListTitle"), x1 + 6.5, y1 + 24 / 2);
            ctx.strokeStyle = " #b3b3b3";
            for (let folderName in tanimFolders) {
                let { color, indentation, ranges } = tanimFolders[folderName];
                for (let { from, to } of ranges) {
                    let bgy1 = y1 + 24 * (from + 1 - scroll) - 0.5;
                    let bgy2 = y1 + 24 * (to + 1 - scroll) - 0.5;
                    if (bgy2 < y1 + 24)
                        continue;
                    if (bgy1 > y2)
                        continue;
                    let bgx1 = x1 + 6.5 + 12 * indentation;
                    let bgx2 = x2 - 20;
                    if (bgx2 <= bgx1)
                        continue;
                    let lbgy1 = max(bgy1, y1 + 24);
                    let lbgy2 = min(bgy2, y2);
                    ctx.fillStyle = color;
                    ctx.fillRect(bgx1, lbgy1, bgx2 - bgx1, lbgy2 - lbgy1);
                    ctx.beginPath();
                    if (to - from >= 3) {
                        ctx.moveTo(bgx1, max(bgy1, y1) + 24);
                        ctx.lineTo(bgx1, min(y2, bgy2 - 24));
                    }
                    if (bgy1 >= y1 + 24 - 1) {
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
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.lineWidth = 1;
            for (let i = 0; i <= tanimTree.length; i++) {
                if (24 * (i - scroll) < 0)
                    continue;
                if (y1 + 24 * (i + 1 - scroll) > y2)
                    break;
                let isDragStart = this.mouseDragIndex == i && (this.mouseDragType == (type == "tanimList" ? 9 : 10));
                if (hover[0] == type && hover[1] == i && uiState == 1) {
                    if (this.mouseDragType == 9 ||
                        (type == "layerList" && this.mouseDragType == 10)) {
                        if (!isDragStart) {
                            ctx.save();
                            ctx.strokeStyle = " #666666";
                            ctx.lineWidth = 5;
                            ctx.beginPath();
                            ctx.moveTo(x1 + 6.5, y1 + 24 * (i + 1 - scroll));
                            ctx.lineTo(x2 - 20, y1 + 24 * (i + 1 - scroll));
                            ctx.stroke();
                            ctx.strokeStyle = " #ffffff";
                            ctx.lineWidth = 3;
                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                    else {
                        if (tanimTree[i]) {
                            ctx.fillStyle = " #cccccc66";
                            ctx.fillRect(x1 + 6.5, y1 + 24 * (i + 1 - scroll), x2 - 20 - (x1 + 6.5), 24);
                        }
                    }
                }
                if (!tanimTree[i])
                    continue;
                if (isDragStart) {
                    ctx.fillStyle = " #cccccc66";
                    ctx.fillRect(x1 + 6.5, y1 + 24 * (i + 1 - scroll), x2 - 20 - (x1 + 6.5), 24);
                }
                if (type == "layerList" && this.layerTree[i].tanim == this.tanim) {
                    ctx.strokeStyle = " #666666";
                    ctx.strokeRect(ceil(x1) + 6.5, ceil(y1 + 24 * (i + 1 - scroll)) + 0.5, floor(x2 - 20 - x1 - 6.5), floor(24));
                }
                let buttons;
                if (hover[0] == type && hover[1] == i && this.mouseDragType == 0) {
                    buttons = (type == "tanimList" ? this.getTanimListButtons : this.getLayerListButtons)(tanimTree[i]);
                }
                else {
                    buttons = [];
                }
                for (let j = 0; j < buttons.length; j++) {
                    this.drawTanimListButton(buttons[j], x2 - 20 - 24 * (j + 0.5), y1 + 24 * (i + 1.5 - scroll), 24, 24, hover[0] == type && hover[1] == i && hover[2] == buttons[j] ? uiState : 0);
                }
                this.drawTanimListItemText(tanimTree[i], x1 + 6.5, y1 + 24 * (1 - scroll), i, x2 - 20 - buttons.length * 24 - (x1 + 6.5 + 12 * tanimTree[i].indentation));
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 0.5);
            ctx.lineTo(x2, y1 - 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawTanimListItemText({ text: text, type, indentation }, x, y, pos, maxWidth) {
            let itemY = y + 24 * (pos + 0.5);
            this.ctx.fillStyle = " #666666";
            let trimmedText;
            switch (type) {
                case 1:
                    trimmedText = this.trimText("", text, " {", maxWidth * 1.15);
                    break;
                case 2:
                    trimmedText = this.trimText("} ", text, "", maxWidth * 1.15);
                    break;
                case 3:
                    trimmedText = this.trimText("", text, " {...}", maxWidth * 1.15);
                    break;
                default:
                case 0:
                    trimmedText = this.trimText("", text, "", maxWidth * 1.15);
                    break;
            }
            this.ctx.fillText(trimmedText, x + 12 * indentation, itemY, maxWidth);
        }
        drawTanimListButton(type, x, y, w, h, uiState, color) {
            let ctx = this.ctx;
            ctx.save();
            if (uiState == 1) {
                ctx.fillStyle = " #99999966";
                ctx.fillRect(x - w / 2, y - h / 2, w, h);
            }
            ctx.strokeStyle = color !== null && color !== void 0 ? color : " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            switch (type) {
                case 1:
                    ctx.moveTo(x - 1.5, y + 5.5);
                    ctx.lineTo(x - 5.5, y + 5.5);
                    ctx.lineTo(x - 5.5, y - 6.5);
                    ctx.lineTo(x + 1.5, y - 6.5);
                    ctx.lineTo(x + 4.5, y - 3.5);
                    ctx.lineTo(x + 4.5, y - 1.5);
                    ctx.moveTo(x + 4.5, y - 2.5);
                    ctx.lineTo(x + 0.5, y - 2.5);
                    ctx.lineTo(x + 0.5, y - 6.5);
                    ctx.moveTo(x + 1.5, y + 4.5);
                    ctx.lineTo(x + 7.5, y + 4.5);
                    ctx.moveTo(x + 4.5, y + 1.5);
                    ctx.lineTo(x + 4.5, y + 7.5);
                    break;
                case 2:
                    ctx.moveTo(x - 5.5, y + 6.5);
                    ctx.lineTo(x - 5.5, y - 3.5);
                    ctx.lineTo(x + 0.5, y - 3.5);
                    ctx.lineTo(x + 2.5, y - 1.5);
                    ctx.lineTo(x + 2.5, y + 6.5);
                    ctx.lineTo(x - 5.5, y + 6.5);
                    ctx.moveTo(x - 0.5, y - 3.5);
                    ctx.lineTo(x - 0.5, y - 0.5);
                    ctx.lineTo(x + 2.5, y - 0.5);
                    ctx.moveTo(x - 1.5, y - 6.5);
                    ctx.lineTo(x - 1.5, y - 7.5);
                    ctx.lineTo(x + 4.5, y - 7.5);
                    ctx.lineTo(x + 6.5, y - 5.5);
                    ctx.lineTo(x + 6.5, y + 2.5);
                    ctx.lineTo(x + 5.5, y + 2.5);
                    ctx.moveTo(x + 3.5, y - 7.5);
                    ctx.lineTo(x + 3.5, y - 4.5);
                    ctx.lineTo(x + 6.5, y - 4.5);
                    break;
                case 3:
                case 4:
                case 5:
                    ctx.moveTo(x - 6.5, y + 6.5);
                    ctx.lineTo(x - 6.5, y + 2.5);
                    ctx.lineTo(x + 3.5, y - 7.5);
                    ctx.lineTo(x + 7.5, y - 3.5);
                    ctx.lineTo(x - 2.5, y + 6.5);
                    ctx.lineTo(x - 6.5, y + 6.5);
                    ctx.moveTo(x - 6.5, y + 3.5);
                    ctx.lineTo(x - 3.5, y + 6.5);
                    ctx.moveTo(x - 5.5, y + 1.5);
                    ctx.lineTo(x - 1.5, y + 5.5);
                    ctx.moveTo(x - 3.5, y + 3.5);
                    ctx.lineTo(x + 5.5, y - 5.5);
                    if (type == 3)
                        break;
                    ctx.moveTo(x + 2.5, y + 5.5);
                    ctx.lineTo(x + 8.5, y + 5.5);
                    if (type == 5)
                        break;
                    ctx.moveTo(x + 5.5, y + 2.5);
                    ctx.lineTo(x + 5.5, y + 8.5);
                    break;
                case 6:
                    ctx.moveTo(x - 5.5, y + 3);
                    ctx.lineTo(x - 2.5, y - 4.5);
                    ctx.lineTo(x + 0.5, y + 3);
                    ctx.moveTo(x - 4.5, y - 0.5);
                    ctx.lineTo(x - 0.5, y - 0.5);
                    ctx.moveTo(x + 3.5, y - 6.5);
                    ctx.lineTo(x + 3.5, y + 5.5);
                    ctx.moveTo(x + 1.5, y - 6.5);
                    ctx.lineTo(x + 5.5, y - 6.5);
                    ctx.moveTo(x + 1.5, y + 5.5);
                    ctx.lineTo(x + 5.5, y + 5.5);
                    break;
                case 7:
                    ctx.moveTo(x - 6.5, y - 4.5);
                    ctx.lineTo(x + 6.5, y - 4.5);
                    ctx.moveTo(x - 1.5, y - 4.5);
                    ctx.lineTo(x - 1.5, y - 6.5);
                    ctx.lineTo(x + 1.5, y - 6.5);
                    ctx.lineTo(x + 1.5, y - 4.5);
                    ctx.moveTo(x - 4.5, y - 2.5);
                    ctx.lineTo(x - 4.5, y + 6.5);
                    ctx.lineTo(x + 4.5, y + 6.5);
                    ctx.lineTo(x + 4.5, y - 2.5);
                    ctx.moveTo(x - 1.5, y - 1.5);
                    ctx.lineTo(x - 1.5, y + 3.5);
                    ctx.moveTo(x + 1.5, y - 1.5);
                    ctx.lineTo(x + 1.5, y + 3.5);
                    break;
                case 8:
                    ctx.moveTo(x - 5.5, y - 2.5);
                    ctx.lineTo(x, y + 3);
                    ctx.lineTo(x + 5.5, y - 2.5);
                    break;
                case 9:
                    ctx.moveTo(x - 5.5, y + 2.5);
                    ctx.lineTo(x, y - 3);
                    ctx.lineTo(x + 5.5, y + 2.5);
                    break;
                case 10:
                    ctx.moveTo(x + 2.5, y - 5.5);
                    ctx.lineTo(x - 3, y);
                    ctx.lineTo(x + 2.5, y + 5.5);
                    break;
            }
            ctx.stroke();
            ctx.restore();
        }
        drawKeyframeBar(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 0.5);
            ctx.lineTo(x2, y1 - 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawClose(x, y, w, h, uiState) {
            let ctx = this.ctx;
            ctx.save();
            if (uiState == 1) {
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
        drawMinimize(x, y, w, h, uiState) {
            let ctx = this.ctx;
            ctx.save();
            if (uiState == 1) {
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
        drawHeader(w, h) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #e6e6e6";
            ctx.fillRect(0, 0, w, h);
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
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
        drawHintBar(y, w, h) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #d9d9d9";
            ctx.fillRect(0, y - h, w, h);
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.fillStyle = " #333333";
            ctx.fillText(this.hint[0], 8, y - h / 2 - 10);
            ctx.fillText(this.hint[1], 8, y - h / 2 + 10);
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y - h + 0.5);
            ctx.lineTo(w, y - h + 0.5);
            ctx.stroke();
            ctx.restore();
        }
    }
    let TheTanimEditor;
    class CQEasyTanim {
        getInfo() {
            return {
                id: TheExtensionID,
                name: getTranslate("CQET_extName"),
                color1: "#d92644",
                color2: "#ad1f36",
                color3: "#82172b",
                blocks: [
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: getTranslate("CQET_buttonDoc"),
                        func: "OnClickDocButton",
                    },
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: getTranslate("CQET_buttonEditor"),
                        func: "OnClickEditorButton",
                    },
                    {
                        opcode: "BGetTanimValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetTanimValue"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            loopMode: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MLoopMode",
                            },
                            time: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            timeUnit: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTimeUnit",
                            },
                            tanimValueType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimValueType",
                            },
                        },
                    },
                    {
                        opcode: "BGetTanimInfo",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetTanimInfo"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            tanimInfoType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimInfoType",
                            },
                        },
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("CQET_labelContext"),
                    },
                    {
                        opcode: "BSetContext",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bSetContext"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            loopMode: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MLoopMode",
                            },
                            time: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            timeUnit: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTimeUnit",
                            },
                        },
                    },
                    {
                        opcode: "BGetContextValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetContextValue"),
                        arguments: {
                            tanimValueType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimValueType",
                            },
                        },
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("CQET_labelSnapshot"),
                    },
                    {
                        opcode: "BCreateSnapshot",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bCreateSnapshot"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            loopMode: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MLoopMode",
                            },
                            time: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            timeUnit: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTimeUnit",
                            },
                        },
                    },
                    {
                        opcode: "BTransitSnapshot",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bTransitSnapshot"),
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
                        opcode: "BGetSnapshotValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetSnapshotValue"),
                        arguments: {
                            snapshotIndex: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            tanimValueType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimValueType",
                            },
                        },
                    },
                    {
                        opcode: "BSetContextBySnapshot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bSetContextBySnapshot"),
                        arguments: {
                            snapshotIndex: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "BDeleteSnapshot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bDeleteSnapshot"),
                        arguments: {
                            snapshotIndex: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "BDeleteAllSnapshot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bDeleteAllSnapshot"),
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("CQET_labelUtils"),
                    },
                ],
                menus: {
                    ["MTanimName"]: {
                        acceptReporters: true,
                        items: "MGetTanimNames",
                    },
                    ["MLoopMode"]: {
                        acceptReporters: true,
                        items: [
                            {
                                text: getTranslate("CQET_mLoopMode_loop"),
                                value: "loop",
                            },
                            {
                                text: getTranslate("CQET_mLoopMode_once"),
                                value: "once",
                            },
                            {
                                text: getTranslate("CQET_mLoopMode_loopYoyo"),
                                value: "loop-yoyo",
                            },
                            {
                                text: getTranslate("CQET_mLoopMode_onceYoyo"),
                                value: "once-yoyo",
                            },
                        ],
                    },
                    ["MTimeUnit"]: {
                        acceptReporters: true,
                        items: [
                            {
                                text: getTranslate("CQET_mTimeUnit_second"),
                                value: "second",
                            },
                            {
                                text: getTranslate("CQET_mTimeUnit_frame"),
                                value: "frame",
                            },
                        ],
                    },
                    ["MTanimValueType"]: {
                        acceptReporters: true,
                        items: "MGetTanimValueTypes",
                    },
                    ["MTanimInfoType"]: {
                        acceptReporters: false,
                        items: [
                            {
                                text: getTranslate("CQET_mTanimInfoType_lengthSec"),
                                value: "lengthSec",
                            },
                            {
                                text: getTranslate("CQET_mTanimInfoType_length"),
                                value: "length",
                            },
                            {
                                text: getTranslate("CQET_mTanimInfoType_fps"),
                                value: "fps",
                            },
                        ],
                    },
                },
            };
        }
        OnClickDocButton() {
        }
        OnClickEditorButton() {
            if (!TheTanimEditor)
                TheTanimEditor = new TanimEditor();
            if (TheTanimEditor.isShow) {
                TheTanimEditor.isShow = false;
                TheTanimEditor.root.style.display = "none";
            }
            else {
                TheTanimEditor.isShow = true;
                TheTanimEditor.root.style.display = "flex";
            }
        }
        constructor() {
            vm.runtime.on("PROJECT_LOADED", () => this.OnClickEditorButton());
        }
        MGetTanimNames() {
            let tanimNames = [];
            for (let i = 0; i < TheTanimManager.tanims.length; i++) {
                let name = TheTanimManager.tanims[i].name;
                tanimNames.push({ text: name, value: name });
            }
            if (tanimNames.length == 0)
                tanimNames.push({ text: getTranslate("CQET_noTanimPleaseCreate"), value: "" });
            return tanimNames;
        }
        MGetTanimValueTypes() {
            let tanimValueTypes = [];
            for (let i = 0; i < TheTanimManager.tValueTypes.length; i++) {
                let tValueType = TheTanimManager.tValueTypes[i];
                let text;
                switch (tValueType) {
                    case "px":
                        text = getTranslate("CQET_mTanimValueType_px");
                        break;
                    case "py":
                        text = getTranslate("CQET_mTanimValueType_py");
                        break;
                    case "s":
                        text = getTranslate("CQET_mTanimValueType_s");
                        break;
                    case "sx":
                        text = getTranslate("CQET_mTanimValueType_sx");
                        break;
                    case "sy":
                        text = getTranslate("CQET_mTanimValueType_sy");
                        break;
                    case "sq":
                        text = getTranslate("CQET_mTanimValueType_sq");
                        break;
                    case "sqx":
                        text = getTranslate("CQET_mTanimValueType_sqx");
                        break;
                    case "sqy":
                        text = getTranslate("CQET_mTanimValueType_sqy");
                        break;
                    case "d":
                        text = getTranslate("CQET_mTanimValueType_d");
                        break;
                    case "cos":
                        text = getTranslate("CQET_mTanimValueType_cos");
                        break;
                    default:
                        text = tValueType;
                        break;
                }
                tanimValueTypes.push({ text: text, value: tValueType });
            }
            return tanimValueTypes;
        }
        ["BGetTanimValue"]({ tanimName, loopMode, time, timeUnit, tanimValueType }) {
            tanimName = Cast.toString(tanimName);
            time = Cast.toNumber(time);
            tanimValueType = Cast.toString(tanimValueType);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return safeTValue(null, tanimValueType);
            return safeTValue(tanim.getTValue(tanimValueType, time, timeUnit, loopMode), tanimValueType);
        }
        ["BGetTanimInfo"]({ tanimName, tanimInfoType }) {
            tanimName = Cast.toString(tanimName);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return 0;
            tanimInfoType = Cast.toString(tanimInfoType);
            switch (tanimInfoType) {
                case "lengthSec":
                    return Cast.toNumber(tanim.length / tanim.fps);
                case "length":
                    return Cast.toNumber(tanim.length);
                case "fps":
                    return Cast.toNumber(tanim.fps);
                default:
                    return 0;
            }
        }
        ["BSetContext"]({ tanimName, loopMode, time, timeUnit }) {
            tanimName = Cast.toString(tanimName);
            time = Cast.toNumber(time);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return;
            TheTanimManager.context = tanim.getSnapshot(time, timeUnit, loopMode);
        }
        ["BGetContextValue"]({ tanimValueType }) {
            tanimValueType = Cast.toString(tanimValueType);
            return safeTValue(TheTanimManager.context[tanimValueType], tanimValueType);
        }
        ["BCreateSnapshot"]({ tanimName, loopMode, time, timeUnit }) {
            tanimName = Cast.toString(tanimName);
            time = Cast.toNumber(time);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return 0;
            let snapshot = tanim.getSnapshot(time, timeUnit, loopMode);
            let index = TheTanimManager.allocateSnapshotIndex(snapshot);
            return index + 1;
        }
        ["BTransitSnapshot"]({ snapshotIndexA, snapshotIndexB, transitT }) {
            snapshotIndexA = Cast.toNumber(snapshotIndexA);
            snapshotIndexB = Cast.toNumber(snapshotIndexB);
            transitT = Cast.toNumber(transitT);
            let snapshotA = TheTanimManager.getSnapshotByIndex(snapshotIndexA - 1);
            if (snapshotA === null)
                return 0;
            let snapshotB = TheTanimManager.getSnapshotByIndex(snapshotIndexB - 1);
            if (snapshotB === null)
                return 0;
            let snapshot = TheTanimManager.transitSnapshot(snapshotA, snapshotB, clamp(transitT, 0, 1));
            let index = TheTanimManager.allocateSnapshotIndex(snapshot);
            return index + 1;
        }
        ["BGetSnapshotValue"]({ snapshotIndex, tanimValueType }) {
            snapshotIndex = Cast.toNumber(snapshotIndex);
            let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
            if (snapshot === null)
                return safeTValue(null, tanimValueType);
            tanimValueType = Cast.toString(tanimValueType);
            return safeTValue(snapshot[tanimValueType], tanimValueType);
        }
        ["BSetContextBySnapshot"]({ snapshotIndex }) {
            snapshotIndex = Cast.toNumber(snapshotIndex);
            let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
            if (snapshot === null)
                return;
            TheTanimManager.context = snapshot;
        }
        ["BDeleteSnapshot"]({ snapshotIndex }) {
            snapshotIndex = Cast.toNumber(snapshotIndex);
            TheTanimManager.recycleSnapshotIndex(snapshotIndex - 1);
        }
        ["BDeleteAllSnapshot"]() {
            TheTanimManager.recycleAllSnapshot();
        }
    }
    Scratch.extensions.register(new CQEasyTanim());
})(Scratch);

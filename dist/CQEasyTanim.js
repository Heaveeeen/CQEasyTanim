"use strict";
(function (Scratch) {
    var _a;
    const IsShowWarn = true;
    function Warn(...data) {
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
    const isGandi = vm.runtime.gandi ? true : false;
    const theExtID = "cqeasytanim";
    const translates = {
        "zh-cn": {
            ["CQEasyTanim_extName"]: "时间轴动画",
            ["CQEasyTanim_bGetTanimValue"]: "动画 [tanimName] [loopMode] 第 [time] [timeUnit] 的 [tanimValueType]",
            ["CQEasyTanim_bSetContext"]: "将语境设为 [tanimName] [loopMode] 的第 [time] [timeUnit]",
            ["CQEasyTanim_bGetContextValue"]: "语境的 [tanimValueType]",
            ["CQEasyTanim_bCreateSnapshot"]: "为动画 [tanimName] [loopMode] 的第 [time] [timeUnit] 创建快照",
            ["CQEasyTanim_bTransitSnapshot"]: "从快照 [snapshotIndexA] 到 [snapshotIndexB] 过渡，创建 [transitT] 处的快照",
            ["CQEasyTanim_bGetSnapshotValue"]: "快照 [snapshotIndex] 的 [tanimValueType]",
            ["CQEasyTanim_bSetContextBySnapshot"]: "将语境设为快照 [snapshotIndex]",
            ["CQEasyTanim_bDeleteSnapshot"]: "删除快照 [snapshotIndex]",
            ["CQEasyTanim_bDeleteAllSnapshot"]: "删除所有快照",
            ["CQEasyTanim_bGetTanimInfo"]: "动画 [tanimName] 的 [tanimInfoType]",
            ["CQEasyTanim_bGetTanimEditorInfo"]: "动画编辑器的 [tanimEditorInfoType]",
            ["mLoopMode_loop"]: "循环播放",
            ["mLoopMode_once"]: "播放一次",
            ["mLoopMode_loopYoyo"]: "循环往复",
            ["mLoopMode_onceYoyo"]: "往复一次",
            ["mTimeUnit_second"]: "秒",
            ["mTimeUnit_frame"]: "帧",
            ["mTanimValueType_px"]: "x 坐标",
            ["mTanimValueType_py"]: "y 坐标",
            ["mTanimValueType_s"]: "大小",
            ["mTanimValueType_sx"]: "x 拉伸",
            ["mTanimValueType_sy"]: "y 拉伸",
            ["mTanimValueType_sq"]: "挤压",
            ["mTanimValueType_sqx"]: "x 挤压倍数",
            ["mTanimValueType_sqy"]: "y 挤压倍数",
            ["mTanimValueType_d"]: "方向",
            ["mTanimValueType_cos"]: "造型",
            ["mTanimInfoType_lengthSec"]: "时长",
            ["mTanimInfoType_length"]: "总帧数",
            ["mTanimInfoType_fps"]: "每秒帧数",
            ["mTanimEditorInfoType_time"]: "当前帧",
            ["mTanimEditorInfoType_anim"]: "当前动画",
            ["mTanimEditorInfoType_sprite"]: "当前角色",
            ["mTanimEditorInfoType_cosPrefix"]: "造型前缀",
            ["mTanimEditorInfoType_cosName"]: "造型名称",
            ["mTanimEditorInfoType_cosSuffix"]: "造型后缀",
            ["labelContext"]: "~ 🍬动画语境 ~",
            ["labelSnapshot"]: "~ 📷动画快照 ~",
            ["labelUtils"]: "~ 👉附加功能 ~",
            ["buttonDoc"]: "📄文档",
            ["buttonEditor"]: "✏️动画编辑器",
            ["CQEasyTanim_noTanimPleaseCreate"]: "- 未创建动画 -",
        },
    };
    Scratch.translate.setup(translates);
    function getTranslate(id) {
        return Scratch.translate({ id: id, default: translates["zh-cn"][id], });
    }
    function GetSafeCommentID(base) {
        let ids = [];
        for (let i in vm.runtime.targets) {
            let t = vm.runtime.targets[i];
            for (let j in t.comments) {
                ids.push(t.comments[j].id);
            }
        }
        if (ids.indexOf(base) < 0)
            return base;
        for (let i = 2; ids.indexOf(base + i) < 0; i++)
            continue;
        return base;
    }
    function clamp(x, a, b) {
        return Math.max(a, Math.min(x, b));
    }
    function sqToSqx(sq) {
        return sq > 0 ? (100 + sq) / 100 : 100 / (100 - sq);
    }
    function sqToSqy(sq) {
        return sq > 0 ? 100 / (100 + sq) : (100 - sq) / 100;
    }
    let { exp, pow, PI, sin, sqrt } = Math;
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
    _a = InterpolationFunctions;
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
        return _a.Lerp(y1, y2, t);
    };
    InterpolationFunctions.InterLag2 = (x1, y1, x2, y2, cx, cy, x) => {
        let l1 = (y1 * (x - cx) * (x - x2)) / ((x1 - cx) * (x1 - x2));
        let l2 = (cy * (x - x1) * (x - x2)) / ((cx - x1) * (cx - x2));
        let l3 = (y2 * (x - x1) * (x - cx)) / ((x2 - x1) * (x2 - cx));
        return l1 + l2 + l3;
    };
    InterpolationFunctions.CalcBezier3 = (p1, p2, p3, p4, t) => p1 * pow(1 - t, 3) + p2 * 3 * pow(1 - t, 2) * t + p3 * 3 * (1 - t) * pow(t, 2) + p4 * pow(t, 3);
    InterpolationFunctions.InterBezier3 = (x1, y1, x2, y2, cx1, cy1, cx2, cy2, x) => {
        let f = (t) => _a.CalcBezier3(x1, cx1, cx2, x2, t);
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
        return _a.CalcBezier3(y1, cy1, cy2, y2, t);
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
    function SafeTValue(tValue, tValueType) {
        var _b;
        return (_b = tValue !== null && tValue !== void 0 ? tValue : DefaultTValues[tValueType]) !== null && _b !== void 0 ? _b : 0;
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
            var _b, _c, _d, _e, _f, _g, _h;
            let interType = left.interType;
            let { x: x1, y: y1 } = left;
            let { x: x2, y: y2 } = right;
            if (typeof y1 == "string" || typeof y2 == "string") {
                return y1;
            }
            let params = (_b = left.params) !== null && _b !== void 0 ? _b : {};
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
        getTValueByFrame(x) {
            var _b;
            if (this.keyframes.length == 0) {
                return (_b = DefaultTValues[this.tValueType]) !== null && _b !== void 0 ? _b : 0;
            }
            else if (this.keyframes.length == 1) {
                return this.keyframes[0].y;
            }
            let left;
            for (let i = this.keyframes.length - 1; i > 0; i--) {
                let point = this.keyframes[i];
                if (point.x <= x) {
                    let pre = this.keyframes[i - 1];
                    if (pre.x <= point.x) {
                        left = point;
                        break;
                    }
                }
            }
            let right;
            for (let i = 0; i < this.keyframes.length; i++) {
                let point = this.keyframes[i];
                if (point.x >= x) {
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
                    time = time % this.length * 2;
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
                    time = time % this.length;
                    break;
            }
            return time;
        }
        getTValue(tValueType, time, timeUnit, loopMode) {
            if (tValueType == "sqx" || tValueType == "sqy") {
                let sq = SafeTValue(this.getTValue("sq", time, timeUnit, loopMode), "sq");
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
                    if (this.tValueTypes.indexOf(timeline.tValueType) == -1) {
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
        getContextValue(tValueType) {
            return SafeTValue(this.context[tValueType], tValueType);
        }
        getSnapshotByIndex(index) {
            var _b;
            return (_b = this.snapshots[index]) !== null && _b !== void 0 ? _b : null;
        }
        getSnapshotValue(snapshot, tValueType) {
            return SafeTValue(snapshot[tValueType], tValueType);
        }
        transitSnapshot(snapshotA, snapshotB, t) {
            let lerp = InterpolationFunctions.Lerp;
            let result = {};
            for (let tValueType in new Set([...Object.keys(snapshotA), ...Object.keys(snapshotB)])) {
                if (tValueType == "sqx" || tValueType == "sqy") {
                    let sqa = SafeTValue(snapshotA["sq"], "sq");
                    let sqb = SafeTValue(snapshotB["sq"], "sq");
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
                    let va = SafeTValue(snapshotA[tValueType], tValueType);
                    let vb = SafeTValue(snapshotB[tValueType], tValueType);
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
    }
    function GetJSONSrcFromComment() {
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
    function GetSavedataFromJSONSrc(JSONSrc) {
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
    function AutoLoadData(isAlertError) {
        let JSONSrc = GetJSONSrcFromComment();
        let { obj: savedata, src } = GetSavedataFromJSONSrc(JSONSrc);
        let _parsedTanimManager = TanimManager.FromObject(savedata);
        if (_parsedTanimManager == null) {
            if (!isAlertError)
                return;
            let d = new Date();
            let dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
            vm.runtime.targets[0].createComment(GetSafeCommentID("_EasyTanimBackup"), null, `⚠️⚠️⚠️时间轴动画 错误⚠️⚠️⚠️
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
    vm.runtime.on("PROJECT_LOADED", () => AutoLoadData(true));
    class TanimEditor {
        constructor() {
            this.time = 0;
            this.tanim = null;
            this.sprite = null;
            this.costume = ["", "", ""];
        }
    }
    const TheTanimEditor = new TanimEditor();
    class CQEasyTanim {
        getInfo() {
            return {
                id: theExtID,
                name: getTranslate("CQEasyTanim_extName"),
                color1: "#12b322",
                color2: "#0e8c1b",
                color3: "#0a6613",
                blocks: [
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: getTranslate("buttonDoc"),
                        func: "OnClickDocButton",
                    },
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: getTranslate("buttonEditor"),
                        func: "OnClickEditorButton",
                    },
                    {
                        opcode: "BGetTanimValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQEasyTanim_bGetTanimValue"),
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
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("labelContext"),
                    },
                    {
                        opcode: "BSetContext",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQEasyTanim_bSetContext"),
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
                        text: getTranslate("CQEasyTanim_bGetContextValue"),
                        arguments: {
                            tanimValueType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimValueType",
                            },
                        },
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("labelSnapshot"),
                    },
                    {
                        opcode: "BCreateSnapshot",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQEasyTanim_bCreateSnapshot"),
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
                        text: getTranslate("CQEasyTanim_bTransitSnapshot"),
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
                        text: getTranslate("CQEasyTanim_bGetSnapshotValue"),
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
                        text: getTranslate("CQEasyTanim_bSetContextBySnapshot"),
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
                        text: getTranslate("CQEasyTanim_bDeleteSnapshot"),
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
                        text: getTranslate("CQEasyTanim_bDeleteAllSnapshot"),
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("labelUtils"),
                    },
                    {
                        opcode: "BGetTanimInfo",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQEasyTanim_bGetTanimInfo"),
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
                        opcode: "BGetTanimEditorInfo",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQEasyTanim_bGetTanimEditorInfo"),
                        arguments: {
                            tanimEditorInfoType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimEditorInfoType",
                            },
                        },
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
                                text: getTranslate("mLoopMode_loop"),
                                value: "loop",
                            },
                            {
                                text: getTranslate("mLoopMode_once"),
                                value: "once",
                            },
                            {
                                text: getTranslate("mLoopMode_loopYoyo"),
                                value: "loop-yoyo",
                            },
                            {
                                text: getTranslate("mLoopMode_onceYoyo"),
                                value: "once-yoyo",
                            },
                        ],
                    },
                    ["MTimeUnit"]: {
                        acceptReporters: true,
                        items: [
                            {
                                text: getTranslate("mTimeUnit_second"),
                                value: "second",
                            },
                            {
                                text: getTranslate("mTimeUnit_frame"),
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
                                text: getTranslate("mTanimInfoType_lengthSec"),
                                value: "lengthSec",
                            },
                            {
                                text: getTranslate("mTanimInfoType_length"),
                                value: "length",
                            },
                            {
                                text: getTranslate("mTanimInfoType_fps"),
                                value: "fps",
                            },
                        ],
                    },
                    ["MTanimEditorInfoType"]: {
                        acceptReporters: false,
                        items: [
                            {
                                text: getTranslate("mTanimEditorInfoType_time"),
                                value: "time",
                            },
                            {
                                text: getTranslate("mTanimEditorInfoType_anim"),
                                value: "anim",
                            },
                            {
                                text: getTranslate("mTanimEditorInfoType_sprite"),
                                value: "sprite",
                            },
                            {
                                text: getTranslate("mTanimEditorInfoType_cosPrefix"),
                                value: "cosPrefix",
                            },
                            {
                                text: getTranslate("mTanimEditorInfoType_cosName"),
                                value: "cosName",
                            },
                            {
                                text: getTranslate("mTanimEditorInfoType_cosSuffix"),
                                value: "cosSuffix",
                            },
                        ],
                    },
                },
            };
        }
        OnClickDocButton() {
        }
        OnClickEditorButton() {
        }
        MGetTanimNames() {
            let tanimNames = [];
            for (let i = 0; i < TheTanimManager.tanims.length; i++) {
                let name = TheTanimManager.tanims[i].name;
                tanimNames.push({ text: name, value: name });
            }
            if (tanimNames.length == 0)
                tanimNames.push({ text: getTranslate("CQEasyTanim_noTanimPleaseCreate"), value: "" });
            return tanimNames;
        }
        MGetTanimValueTypes() {
            let tanimValueTypes = [];
            for (let i = 0; i < TheTanimManager.tValueTypes.length; i++) {
                let tValueType = TheTanimManager.tValueTypes[i];
                let text;
                switch (tValueType) {
                    case "px":
                        text = getTranslate("mTanimValueType_px");
                        break;
                    case "py":
                        text = getTranslate("mTanimValueType_py");
                        break;
                    case "s":
                        text = getTranslate("mTanimValueType_s");
                        break;
                    case "sx":
                        text = getTranslate("mTanimValueType_sx");
                        break;
                    case "sy":
                        text = getTranslate("mTanimValueType_sy");
                        break;
                    case "sq":
                        text = getTranslate("mTanimValueType_sq");
                        break;
                    case "sqx":
                        text = getTranslate("mTanimValueType_sqx");
                        break;
                    case "sqy":
                        text = getTranslate("mTanimValueType_sqy");
                        break;
                    case "d":
                        text = getTranslate("mTanimValueType_d");
                        break;
                    case "cos":
                        text = getTranslate("mTanimValueType_cos");
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
            tanimName = Scratch.Cast.toString(tanimName);
            time = Scratch.Cast.toNumber(time);
            tanimValueType = Scratch.Cast.toString(tanimValueType);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return SafeTValue(null, tanimValueType);
            return SafeTValue(tanim.getTValue(tanimValueType, time, timeUnit, loopMode), tanimValueType);
        }
        ["BSetContext"]({ tanimName, loopMode, time, timeUnit }) {
            tanimName = Scratch.Cast.toString(tanimName);
            time = Scratch.Cast.toNumber(time);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return;
            TheTanimManager.context = tanim.getSnapshot(time, timeUnit, loopMode);
        }
        ["BGetContextValue"]({ tanimValueType }) {
            tanimValueType = Scratch.Cast.toString(tanimValueType);
            return SafeTValue(TheTanimManager.context[tanimValueType], tanimValueType);
        }
        ["BCreateSnapshot"]({ tanimName, loopMode, time, timeUnit }) {
            tanimName = Scratch.Cast.toString(tanimName);
            time = Scratch.Cast.toNumber(time);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return 0;
            let snapshot = tanim.getSnapshot(time, timeUnit, loopMode);
            let index = TheTanimManager.allocateSnapshotIndex(snapshot);
            return index + 1;
        }
        ["BTransitSnapshot"]({ snapshotIndexA, snapshotIndexB, transitT }) {
            snapshotIndexA = Scratch.Cast.toNumber(snapshotIndexA);
            snapshotIndexB = Scratch.Cast.toNumber(snapshotIndexB);
            transitT = Scratch.Cast.toNumber(transitT);
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
            snapshotIndex = Scratch.Cast.toNumber(snapshotIndex);
            let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
            if (snapshot === null)
                return SafeTValue(null, tanimValueType);
            tanimValueType = Scratch.Cast.toString(tanimValueType);
            return SafeTValue(snapshot[tanimValueType], tanimValueType);
        }
        ["BSetContextBySnapshot"]({ snapshotIndex }) {
            snapshotIndex = Scratch.Cast.toNumber(snapshotIndex);
            let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
            if (snapshot === null)
                return;
            TheTanimManager.context = snapshot;
        }
        ["BDeleteSnapshot"]({ snapshotIndex }) {
            snapshotIndex = Scratch.Cast.toNumber(snapshotIndex);
            TheTanimManager.recycleSnapshotIndex(snapshotIndex - 1);
        }
        ["BDeleteAllSnapshot"]() {
            TheTanimManager.recycleAllSnapshot();
        }
        ["BGetTanimInfo"]({ tanimName, tanimInfoType }) {
            tanimName = Scratch.Cast.toString(tanimName);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return 0;
            tanimInfoType = Scratch.Cast.toString(tanimInfoType);
            switch (tanimInfoType) {
                case "lengthSec":
                    return Scratch.Cast.toNumber(tanim.length / tanim.fps);
                case "length":
                    return Scratch.Cast.toNumber(tanim.length);
                case "fps":
                    return Scratch.Cast.toNumber(tanim.fps);
                default:
                    return 0;
            }
        }
        ["BGetTanimEditorInfo"]({ tanimEditorInfoType }) {
            tanimEditorInfoType = Scratch.Cast.toString(tanimEditorInfoType);
            switch (tanimEditorInfoType) {
                case "time":
                    return "";
                default:
                    return 0;
            }
        }
    }
    Scratch.extensions.register(new CQEasyTanim());
})(Scratch);

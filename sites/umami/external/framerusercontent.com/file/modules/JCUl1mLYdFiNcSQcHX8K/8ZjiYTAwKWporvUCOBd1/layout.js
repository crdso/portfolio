let o;
var s = (r) => {
    if (!o) {
        const n = r.forwardRef(({color: t = "currentColor", size: e = 24, ...i}, l) => {
            return r.createElement("svg", {ref: l, xmlns: "http://www.w3.org/2000/svg", width: e, height: e, viewBox: "0 0 24 24", fill: "none", stroke: t, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...i}, r.createElement("rect", {x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2"}), r.createElement("line", {x1: "3", y1: "9", x2: "21", y2: "9"}), r.createElement("line", {x1: "9", y1: "21", x2: "9", y2: "9"}));
        });
        n.displayName = "Layout",o = n;
    }
    return o;
};
const __FramerMetadata__ = {exports: {default: {type: "reactComponent", slots: [], annotations: {framerContractVersion: "1"}}, __FramerMetadata__: {type: "variable"}}};
export { __FramerMetadata__, s as default };
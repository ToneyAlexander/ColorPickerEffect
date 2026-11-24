const APJS = globalThis.orion['@orion/orion-sdk/EditorFramework'].APJS;

const {BasicScriptNode} = require('../BasicScriptNode');
const {
  customNode,
  component,
  input,
  output,
  serializeSceneObjectFlag,
  serializeProperty,
  label, readOnly, slider, spinBox, dropDown,
  textArea, header, showIf, tooltip, separator,
  space, groupBegin, groupEnd, disablePin,
} = require('../OrionDecorators');

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickerScriptComponent = void 0;
let PickerScriptComponent = class PickerScriptComponent extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.screenTransform = null;
        this.w = 720;
        this.h = 1280;
        this.x = 0.5;
        this.y = 0.5;
        this.z = 0.5;
        this.T_NAME = "_Custom_Float_2";
        this.U_NAME = "_Custom_Float_3";
        this.V_NAME = "_Custom_Float";
        this.SQUARE_R2 = "_Custom_Float_5";
        this.SLIDER_R2 = "_Custom_Float_5";
        this.init = true;
        this.r2 = 2;
        this.touchCb = (event) => {
            const t = event.args[0];
            const phase = t.phase;
            //TODO: Change pin modes to change the math here - current state is wonky
            // ( see onStart dot anchored position )
            if (APJS.TouchUtils.isScreenPointOnImage(t.position, this.squareImage)) {
                const pixelX = t.position.x * this.w;
                const pixelY = (1.0 - t.position.y) * this.h;
                this.x = (pixelX - this.squareTransform.anchoredPosition.x) / this.squareTransform.sizeDelta.x;
                this.y = -(pixelY - this.squareTransform.anchoredPosition.y) / this.squareTransform.sizeDelta.y;
                this.refreshColor();
                this.dot.anchoredPosition = this.getScreenPosition(t.position);
                this.sliderImage.materials[0].setFloat(this.T_NAME, this.xyz_tuv(this.y));
                this.sliderImage.materials[0].setFloat(this.U_NAME, this.xyz_tuv(this.x));
            }
            if (APJS.TouchUtils.isScreenPointOnImage(t.position, this.sliderImage)) {
                const pixelY = (1.0 - t.position.y) * this.h;
                this.z = -(pixelY - this.sliderTransform.anchoredPosition.y) / this.sliderTransform.sizeDelta.y;
                this.squareImage.materials[0].setFloat(this.V_NAME, this.xyz_tuv(this.z));
                this.refreshColor();
                this.sliderHandle.anchoredPosition = new APJS.Vector2f(this.sliderHandle.anchoredPosition.x, this.getScreenPosition(t.position).y);
            }
        };
    }
    onStart() {
        APJS.EventManager.getGlobalEmitter().on(APJS.EventType.Touch, this.touchCb, this);
        this.screenTransform = this.getSceneObject().getComponent('ScreenTransform');
    }
    onUpdate(deltaTime) {
        // null error potential - do inits here
        if (this.init && this.dot !== null && this.sliderHandle !== null) {
            this.init = false;
            const middle = this.sliderTransform.sizeDelta.y / 2.0;
            this.dot.anchoredPosition = new APJS.Vector2f(-720 / 2 + 40 + middle, 600 - middle);
            this.sliderHandle.anchoredPosition = new APJS.Vector2f(720 / 2 - 40 - 60, 600 - middle);
            this.refreshColor();
            this.sliderImage.materials[0].setFloat(this.T_NAME, this.xyz_tuv(this.x));
            this.sliderImage.materials[0].setFloat(this.U_NAME, this.xyz_tuv(this.y));
            this.squareImage.materials[0].setFloat(this.V_NAME, this.xyz_tuv(this.z));
            this.sliderImage.materials[0].setFloat(this.SQUARE_R2, this.r2);
            this.squareImage.materials[0].setFloat(this.SLIDER_R2, this.r2);
        }
    }
    getScreenPosition(normalizedPos) {
        if (!this.screenTransform)
            return new APJS.Vector2f(0.0, 0.0);
        const x = (normalizedPos.x - 0.5) * this.w;
        const y = ((1.0 - normalizedPos.y) - 0.5) * this.h;
        return new APJS.Vector2f(x, y);
    }
    refreshColor() {
        // NOTE: X and Y are U and T - order is swapped!
        const rgb = this.tuvToRgb(this.xyz_tuv(this.y), this.xyz_tuv(this.x), this.xyz_tuv(this.z));
        this.setColor(new APJS.Color(rgb.r, rgb.g, rgb.b, 1.0));
        this.displayText.text = " #" + this.hex(rgb.r) + this.hex(rgb.g) + this.hex(rgb.b);
    }
    hex(n) {
        const v = Math.trunc(n * 255);
        const str = v.toString(16).toUpperCase();
        return v < 16 ? "0" + str : str;
    }
    setColor(color) {
        this.frontImage.color = color;
        this.backImage.color = color;
    }
    getRandomColor() {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        return new APJS.Color(r, g, b, 1.0);
    }
    xyz_tuv(n) {
        // xyz range from 0 to 1
        // tuv range from -r2 to r2
        return (n * 2 - 1) * this.r2;
    }
    tuvToRgb(t, u, v) {
        const x = (t - 0.15) / 0.45;
        const y = (v - 1.2 * Math.pow(t, 2) + 0.2 * t + 0.655) / 1.84;
        const z = u / 3.6;
        const r = 28.77438370854 * x + 36.78307445559 * y - 19.69766918644 * z + 187.1436241611;
        const g = 35.38327306318 * x - 2.009931981182 * y + 47.93462563172 * z + 137.1073825503;
        const b = 36.14733717939 * x - 43.54346996173 * y - 28.50821294135 * z + 108.2241610738;
        return {
            r: this.mm(r) / 255,
            g: this.mm(g) / 255,
            b: this.mm(b) / 255
        };
    }
    mm(n) {
        return Math.max(Math.min(n, 255), 0);
    }
};
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "frontImage", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "backImage", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "displayText", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "squareImage", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "squareTransform", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "sliderImage", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "sliderTransform", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "dot", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "sliderHandle", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "squareMaterial", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "sliderMaterial", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "r2", void 0);
PickerScriptComponent = __decorate([
    component()
], PickerScriptComponent);
exports.PickerScriptComponent = PickerScriptComponent;
//TODO
//background & visualizer
/// IN THE SHADER, FLOOR OUT 0 and 255 - negatives are undefined

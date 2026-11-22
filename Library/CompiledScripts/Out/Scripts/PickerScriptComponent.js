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
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.T_NAME = "_Custom_Float_2";
        this.U_NAME = "_Custom_Float_3";
        this.V_NAME = "_Custom_Float";
        this.init = true;
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
                this.setColor(new APJS.Color(this.x, this.y, this.z, 1.0));
                this.dot.anchoredPosition = this.getScreenPosition(t.position);
                this.sliderImage.materials[0].setFloat(this.T_NAME, this.x);
                this.sliderImage.materials[0].setFloat(this.U_NAME, this.y);
            }
            if (APJS.TouchUtils.isScreenPointOnImage(t.position, this.sliderImage)) {
                const pixelY = (1.0 - t.position.y) * this.h;
                this.z = -(pixelY - this.sliderTransform.anchoredPosition.y) / this.sliderTransform.sizeDelta.y;
                this.squareImage.materials[0].setFloat(this.V_NAME, this.z);
                this.setColor(new APJS.Color(this.x, this.y, this.z, 1.0));
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
            this.dot.anchoredPosition = new APJS.Vector2f(-720 / 2 + 40, 600);
            this.sliderHandle.anchoredPosition = new APJS.Vector2f(720 / 2 - 40 - 60, 600);
            this.setColor(new APJS.Color(this.x, this.y, this.z, 1.0));
            this.sliderImage.materials[0].setFloat(this.T_NAME, this.x);
            this.sliderImage.materials[0].setFloat(this.U_NAME, this.y);
            this.squareImage.materials[0].setFloat(this.V_NAME, this.z);
        }
    }
    getScreenPosition(normalizedPos) {
        if (!this.screenTransform)
            return new APJS.Vector2f(0.0, 0.0);
        const x = (normalizedPos.x - 0.5) * this.w;
        const y = ((1.0 - normalizedPos.y) - 0.5) * this.h;
        return new APJS.Vector2f(x, y);
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
};
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "frontImage", void 0);
__decorate([
    serializeProperty
], PickerScriptComponent.prototype, "backImage", void 0);
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
PickerScriptComponent = __decorate([
    component()
], PickerScriptComponent);
exports.PickerScriptComponent = PickerScriptComponent;
//TODO
//TUV math converters
//initial condiitosn tweaking
//background & visualizer
//show text
//dot and sliderhandle UI elements

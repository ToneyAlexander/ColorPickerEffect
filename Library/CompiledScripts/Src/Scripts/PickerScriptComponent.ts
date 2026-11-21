@component()
export class PickerScriptComponent extends APJS.BasicScriptComponent {

  @serializeProperty
  public frontImage!: APJS.Image;

  @serializeProperty
  public backImage!: APJS.Image;

  @serializeProperty
  public squareImage!: APJS.Image;
  @serializeProperty
  public squareTransform!: APJS.ScreenTransform;

  @serializeProperty
  public sliderImage!: APJS.Image;
  @serializeProperty
  public sliderTransform!: APJS.ScreenTransform;

  @serializeProperty
  public dot!: APJS.ScreenTransform;
  @serializeProperty
  public sliderHandle!: APJS.ScreenTransform;

  private screenTransform: APJS.ScreenTransform | null = null;

  private w: number = 720;
  private h: number = 1280;

  private x: number = 0.0;
  private y: number = 0.0;
  private z: number = 0.0;

  private init: boolean = true;

  onStart() {
    APJS.EventManager.getGlobalEmitter().on(APJS.EventType.Touch, this.touchCb, this);

    this.screenTransform = this.getSceneObject().getComponent('ScreenTransform') as APJS.ScreenTransform;
  }

  onUpdate(deltaTime: number) {
    // null error potential - do inits here
    if (this.init && this.dot !== null && this.sliderHandle !== null) {
      this.init = false;
      this.dot.anchoredPosition = new APJS.Vector2f(-720 / 2 + 40, 600);
      this.sliderHandle.anchoredPosition = new APJS.Vector2f(720 / 2 - 40 - 60, 600);

      this.setColor(new APJS.Color(this.x, this.y, this.z, 1.0));
    }

  }

  private touchCb = (event: APJS.IEvent): void => {
    const t = event.args[0] as APJS.TouchData;
    const phase = t.phase;

    //TODO: Change pin modes to change the math here - current state is wonky
    // ( see onStart dot anchored position )
    if (APJS.TouchUtils.isScreenPointOnImage(t.position, this.squareImage)) {
      const pixelX = t.position.x * this.w;
      const pixelY = (1.0 - t.position.y) * this.h;

      this.x = (pixelX - this.squareTransform.anchoredPosition.x) / this.squareTransform.sizeDelta.x;
      this.y = -(pixelY - this.squareTransform.anchoredPosition.y - this.squareTransform.sizeDelta.y) / this.squareTransform.sizeDelta.y;

      this.setColor(new APJS.Color(this.x, this.y, this.z, 1.0));

      this.dot.anchoredPosition = this.getScreenPosition(t.position)
    }
    if (APJS.TouchUtils.isScreenPointOnImage(t.position, this.sliderImage)) {
      const pixelY = (1.0 - t.position.y) * this.h;
      this.z = -(pixelY - this.sliderTransform.anchoredPosition.y - this.sliderTransform.sizeDelta.y) / this.sliderTransform.sizeDelta.y;

      this.setColor(new APJS.Color(this.x, this.y, this.z, 1.0));

      this.sliderHandle.anchoredPosition = new APJS.Vector2f(this.sliderHandle.anchoredPosition.x, this.getScreenPosition(t.position).y)
    }
  };

  private getScreenPosition(normalizedPos: APJS.Vector2f): APJS.Vector2f {
    if (!this.screenTransform) return new APJS.Vector2f(0.0, 0.0);

    const x = (normalizedPos.x - 0.5) * this.w;
    const y = ((1.0 - normalizedPos.y) - 0.5) * this.h;

    return new APJS.Vector2f(x, y);
  }

  setColor(color: APJS.Color) {
    this.frontImage.color = color;
    this.backImage.color = color;
  }

  getRandomColor(): APJS.Color {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    return new APJS.Color(r, g, b, 1.0);
  }
}
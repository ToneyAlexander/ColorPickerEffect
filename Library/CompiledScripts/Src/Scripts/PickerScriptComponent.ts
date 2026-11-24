@component()
export class PickerScriptComponent extends APJS.BasicScriptComponent {

  @serializeProperty
  public frontImage!: APJS.Image;

  @serializeProperty
  public backImage!: APJS.Image;

  @serializeProperty
  public displayText!: APJS.Text;

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

  @serializeProperty
  public squareMaterial!: APJS.Material;
  @serializeProperty
  public sliderMaterial!: APJS.Material;

  private screenTransform: APJS.ScreenTransform | null = null;

  private w: number = 720;
  private h: number = 1280;

  private x: number = 0.5;
  private y: number = 0.5;
  private z: number = 0.5;

  private T_NAME = "_Custom_Float_2";
  private U_NAME = "_Custom_Float_3";
  private V_NAME = "_Custom_Float";

  private SQUARE_R2 = "_Custom_Float_5";
  private SLIDER_R2 = "_Custom_Float_5";

  private init: boolean = true;

  @serializeProperty
  public r2: number = 2;

  onStart() {
    APJS.EventManager.getGlobalEmitter().on(APJS.EventType.Touch, this.touchCb, this);

    this.screenTransform = this.getSceneObject().getComponent('ScreenTransform') as APJS.ScreenTransform;
  }

  onUpdate(deltaTime: number) {
    // null error potential - do inits here
    if (this.init && this.dot !== null && this.sliderHandle !== null) {
      this.init = false;

      const middle = this.sliderTransform.sizeDelta.y / 2.0
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

  private touchCb = (event: APJS.IEvent): void => {
    const t = event.args[0] as APJS.TouchData;
    const phase = t.phase;

    //TODO: Change pin modes to change the math here - current state is wonky
    // ( see onStart dot anchored position )
    if (APJS.TouchUtils.isScreenPointOnImage(t.position, this.squareImage)) {
      const pixelX = t.position.x * this.w;
      const pixelY = (1.0 - t.position.y) * this.h;

      this.x = (pixelX - this.squareTransform.anchoredPosition.x) / this.squareTransform.sizeDelta.x;
      this.y = -(pixelY - this.squareTransform.anchoredPosition.y) / this.squareTransform.sizeDelta.y;

      this.refreshColor();

      this.dot.anchoredPosition = this.getScreenPosition(t.position)

      this.sliderImage.materials[0].setFloat(this.T_NAME, this.xyz_tuv(this.y));
      this.sliderImage.materials[0].setFloat(this.U_NAME, this.xyz_tuv(this.x));
    }
    if (APJS.TouchUtils.isScreenPointOnImage(t.position, this.sliderImage)) {
      const pixelY = (1.0 - t.position.y) * this.h;
      this.z = -(pixelY - this.sliderTransform.anchoredPosition.y) / this.sliderTransform.sizeDelta.y;

      this.squareImage.materials[0].setFloat(this.V_NAME, this.xyz_tuv(this.z))

      this.refreshColor();

      this.sliderHandle.anchoredPosition = new APJS.Vector2f(this.sliderHandle.anchoredPosition.x, this.getScreenPosition(t.position).y)
    }
  };

  private getScreenPosition(normalizedPos: APJS.Vector2f): APJS.Vector2f {
    if (!this.screenTransform) return new APJS.Vector2f(0.0, 0.0);

    const x = (normalizedPos.x - 0.5) * this.w;
    const y = ((1.0 - normalizedPos.y) - 0.5) * this.h;

    return new APJS.Vector2f(x, y);
  }

  refreshColor() {
    // NOTE: X and Y are U and T - order is swapped!
    const rgb = this.tuvToRgb(this.xyz_tuv(this.y), this.xyz_tuv(this.x), this.xyz_tuv(this.z))
    this.setColor(new APJS.Color(rgb.r, rgb.g, rgb.b, 1.0));

    this.displayText.text = " #" + this.hex(rgb.r) + this.hex(rgb.g) + this.hex(rgb.b);
  }

  hex(n: number): string {
    const v = Math.trunc(n * 255)
    const str = v.toString(16).toUpperCase()
    return v < 16 ? "0" + str : str;
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

  xyz_tuv(n: number): number {
    // xyz range from 0 to 1
    // tuv range from -r2 to r2
    return (n * 2 - 1) * this.r2;
  }

  tuvToRgb(t: number, u: number, v: number) {
    const x = (t - 0.15) / 0.45
    const y = (v - 1.2 * t ** 2 + 0.2 * t + 0.655) / 1.84
    const z = u / 3.6

    const r = 28.77438370854 * x + 36.78307445559 * y - 19.69766918644 * z + 187.1436241611
    const g = 35.38327306318 * x - 2.009931981182 * y + 47.93462563172 * z + 137.1073825503
    const b = 36.14733717939 * x - 43.54346996173 * y - 28.50821294135 * z + 108.2241610738

    return {
      r: this.mm(r) / 255,
      g: this.mm(g) / 255,
      b: this.mm(b) / 255
    };
  }

  mm(n: number): number {
    return Math.max(Math.min(n, 255), 0);
  }
}

//TODO
//background & visualizer
/// IN THE SHADER, FLOOR OUT 0 and 255 - negatives are undefined
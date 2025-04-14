export default class Dialogue{
    constructor(scene, fontImageKey){
        this.scene = scene;
        this.fontImageKey = fontImageKey;
        this.manualCharMap = "  0123456789!\#$%&'()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^-` abcdefghijklmnopqrstuvwxyz{|}";
        this.drawnChars = [];
    }


    drawChar(char, x, y) {
        const index = this.manualCharMap.indexOf(char);
        if (index === -1) return; // ignore unknown chars
      
        const charImage = this.scene.add.image(x, y, this.fontImageKey, index)
        .setOrigin(0)
        .setScrollFactor(0);


        this.drawnChars.push(charImage);

      }
      
      drawText(text, x, y) {
        const spacing = 6; // tile size or desired spacing
        for (let i = 0; i < text.length; i++) {
          this.drawChar(text[i], x + i * spacing, y);
        }
      }

      clearText() {
        this.drawnChars.forEach(char => {
            if (char) char.destroy();
        });
        this.drawnChars = [];
    }







}
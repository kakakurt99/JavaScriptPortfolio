export default class Dialogue{
    constructor(scene, fontImageKey){
        this.scene = scene;
        this.fontImageKey = fontImageKey;
        this.manualCharMap = " ! #$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[ ]^_`abcdefghijklmnopqrstuvwxyz{|}";
        this.drawnChars = [];
        this.textCharacters = new Map();
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
        const chars = [];


        for (let i = 0; i < text.length; i++) {
          const index = this.manualCharMap.indexOf(text[i]);
          if (index === -1) continue;

          const charImage = this.scene.add.image(x + i * spacing, y, this.fontImageKey, index)
          .setOrigin(0)
          .setScrollFactor(0)
          .setScale(1)
          .setDepth(11);

          chars.push(charImage);
          this.drawnChars.push(charImage); //optional if you want a global clear later.
        }

        this.textCharacters.set(text, chars); //store using full string as key.
        return text; //return key for clearing later
      }

      clearText(textKey) {
        const chars = this.textCharacters.get(textKey);

        if(chars){
          chars.forEach(char => char.destroy());
          this.textCharacters.delete(textKey);
        }
    }







}
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CssColorObj } from 'src/app/common/models';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  applyInvert(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
    this.debug("GlobalService", "applyInvert");
    context!.drawImage(image, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);
    const data = imageData!.data;
  	for (var i = 0; i < data.length; i += 4) {
  		data[i]     = 255 - data[i];     // red
  		data[i + 1] = 255 - data[i + 1]; // green
  		data[i + 2] = 255 - data[i + 2]; // blue
  	}
    context!.putImageData(imageData!, 0, 0);
  }// ==============================

  applyGrayscale(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, modifier: number = 0) {
    this.debug("GlobalService", "applyGrayscale");
    context!.drawImage(image, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);
    const data = imageData!.data;
  	for (var i = 0; i < data.length; i += 4) {
  		var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
  		data[i]     = avg + modifier; // red
  		data[i + 1] = avg + modifier; // green
  		data[i + 2] = avg + modifier; // blue
  	}
    // imageData!.data.set(data);
    context!.putImageData(imageData!, 0, 0);
  }// ==============================

  applySepia(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
    this.debug("GlobalService", "applySepia");
    context!.drawImage(image, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);
    const data = imageData!.data;
  	for (var i = 0; i < data.length; i += 4) {
  		let red = data[i], green = data[i + 1], blue = data[i + 2];

  		data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
  		data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
  		data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
  	}
  	context!.putImageData(imageData, 0, 0);
  }// ==============================

  /**
   * The formula used here is found on the internet for this purpose.
   * @param red number 0-255
   * @param green number 0-255
   * @param blue number 0-255
   * @returns
   */
  calculatePixelRelativeBrightness(red: number, green: number, blue: number): number {
    return Math.sqrt(
      (red * red) * 0.299 +
      (green * green) * 0.587 +
      (blue * blue) * 0.114
    )/100;
  }// ==============================

  clearCanvas(context: CanvasRenderingContext2D, width: number, height: number) {
    // clear the canvas
    context!.clearRect(0, 0, width, height);
  }// ==============================

  /**
   * Wrapper method around console.log to output only when in debugging mode.
   * It's parameters are set up just like console.log for ease of use.
   * @param message
   * @param optionalParams
   */
  debug(message?: any, ...optionalParams: any[]): void {
    if(environment.debugging) {
      if(optionalParams.length > 0) {
        console.log("--> DEBUG:\n\t", message, optionalParams);
      } else {
        console.log("--> DEBUG:\n\t", message);
      }
      // console.log(JSON.parse(JSON.stringify(obj)))
    }// =====
  }// ==============================

  drawImage(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
    this.debug("GlobalService: drawImage");
    context!.drawImage(image, 0, 0, width, height);
  }// ==============================

  drawRect(context: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number) {
    context!.strokeStyle = color;
    context!.strokeRect(x, y, width, height);
  }// ==============================

  drawText(context: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, font: string) {
    context!.fillStyle = color;
    context!.font = font;
    context!.fillText(text, x, y);
  }// ==============================

  stringifyObject(obj: any): string {
    return JSON.parse(JSON.stringify(obj));
  }// ==============================

  availableCrayolaColors: CssColorObj[] = [
      {
          "hex": "#EFDECD",
          "name": "Almond",
          "rgb": "RGB(239, 222, 205)"
      },
      {
          "hex": "#CD9575",
          "name": "Antique Brass",
          "rgb": "RGB(205, 149, 117)"
      },
      {
          "hex": "#FDD9B5",
          "name": "Apricot",
          "rgb": "RGB(253, 217, 181)"
      },
      {
          "hex": "#78DBE2",
          "name": "Aquamarine",
          "rgb": "RGB(120, 219, 226)"
      },
      {
          "hex": "#87A96B",
          "name": "Asparagus",
          "rgb": "RGB(135, 169, 107)"
      },
      {
          "hex": "#FFA474",
          "name": "Atomic Tangerine",
          "rgb": "RGB(255, 164, 116)"
      },
      {
          "hex": "#FAE7B5",
          "name": "Banana Mania",
          "rgb": "RGB(250, 231, 181)"
      },
      {
          "hex": "#9F8170",
          "name": "Beaver",
          "rgb": "RGB(159, 129, 112)"
      },
      {
          "hex": "#FD7C6E",
          "name": "Bittersweet",
          "rgb": "RGB(253, 124, 110)"
      },
      {
          "hex": "#000000",
          "name": "Black",
          "rgb": "RGB(0, 0, 0)"
      },
      {
          "hex": "#ACE5EE",
          "name": "Blizzard Blue",
          "rgb": "RGB(172, 229, 238)"
      },
      {
          "hex": "#1F75FE",
          "name": "Blue",
          "rgb": "RGB(31, 117, 254)"
      },
      {
          "hex": "#A2A2D0",
          "name": "Blue Bell",
          "rgb": "RGB(162, 162, 208)"
      },
      {
          "hex": "#6699CC",
          "name": "Blue Gray",
          "rgb": "RGB(102, 153, 204)"
      },
      {
          "hex": "#0D98BA",
          "name": "Blue Green",
          "rgb": "RGB(13, 152, 186)"
      },
      {
          "hex": "#7366BD",
          "name": "Blue Violet",
          "rgb": "RGB(115, 102, 189)"
      },
      {
          "hex": "#DE5D83",
          "name": "Blush",
          "rgb": "RGB(222, 93, 131)"
      },
      {
          "hex": "#CB4154",
          "name": "Brick Red",
          "rgb": "RGB(203, 65, 84)"
      },
      {
          "hex": "#B4674D",
          "name": "Brown",
          "rgb": "RGB(180, 103, 77)"
      },
      {
          "hex": "#FF7F49",
          "name": "Burnt Orange",
          "rgb": "RGB(255, 127, 73)"
      },
      {
          "hex": "#EA7E5D",
          "name": "Burnt Sienna",
          "rgb": "RGB(234, 126, 93)"
      },
      {
          "hex": "#B0B7C6",
          "name": "Cadet Blue",
          "rgb": "RGB(176, 183, 198)"
      },
      {
          "hex": "#FFFF99",
          "name": "Canary",
          "rgb": "RGB(255, 255, 153)"
      },
      {
          "hex": "#1CD3A2",
          "name": "Caribbean Green",
          "rgb": "RGB(28, 211, 162)"
      },
      {
          "hex": "#FFAACC",
          "name": "Carnation Pink",
          "rgb": "RGB(255, 170, 204)"
      },
      {
          "hex": "#DD4492",
          "name": "Cerise",
          "rgb": "RGB(221, 68, 146)"
      },
      {
          "hex": "#1DACD6",
          "name": "Cerulean",
          "rgb": "RGB(29, 172, 214)"
      },
      {
          "hex": "#BC5D58",
          "name": "Chestnut",
          "rgb": "RGB(188, 93, 88)"
      },
      {
          "hex": "#DD9475",
          "name": "Copper",
          "rgb": "RGB(221, 148, 117)"
      },
      {
          "hex": "#9ACEEB",
          "name": "Cornflower",
          "rgb": "RGB(154, 206, 235)"
      },
      {
          "hex": "#FFBCD9",
          "name": "Cotton Candy",
          "rgb": "RGB(255, 188, 217)"
      },
      {
          "hex": "#FDDB6D",
          "name": "Dandelion",
          "rgb": "RGB(253, 219, 109)"
      },
      {
          "hex": "#2B6CC4",
          "name": "Denim",
          "rgb": "RGB(43, 108, 196)"
      },
      {
          "hex": "#EFCDB8",
          "name": "Desert Sand",
          "rgb": "RGB(239, 205, 184)"
      },
      {
          "hex": "#6E5160",
          "name": "Eggplant",
          "rgb": "RGB(110, 81, 96)"
      },
      {
          "hex": "#CEFF1D",
          "name": "Electric Lime",
          "rgb": "RGB(206, 255, 29)"
      },
      {
          "hex": "#71BC78",
          "name": "Fern",
          "rgb": "RGB(113, 188, 120)"
      },
      {
          "hex": "#6DAE81",
          "name": "Forest Green",
          "rgb": "RGB(109, 174, 129)"
      },
      {
          "hex": "#C364C5",
          "name": "Fuchsia",
          "rgb": "RGB(195, 100, 197)"
      },
      {
          "hex": "#CC6666",
          "name": "Fuzzy Wuzzy",
          "rgb": "RGB(204, 102, 102)"
      },
      {
          "hex": "#E7C697",
          "name": "Gold",
          "rgb": "RGB(231, 198, 151)"
      },
      {
          "hex": "#FCD975",
          "name": "Goldenrod",
          "rgb": "RGB(252, 217, 117)"
      },
      {
          "hex": "#A8E4A0",
          "name": "Granny Smith Apple",
          "rgb": "RGB(168, 228, 160)"
      },
      {
          "hex": "#95918C",
          "name": "Gray",
          "rgb": "RGB(149, 145, 140)"
      },
      {
          "hex": "#1CAC78",
          "name": "Green",
          "rgb": "RGB(28, 172, 120)"
      },
      {
          "hex": "#1164B4",
          "name": "Green Blue",
          "rgb": "RGB(17, 100, 180)"
      },
      {
          "hex": "#F0E891",
          "name": "Green Yellow",
          "rgb": "RGB(240, 232, 145)"
      },
      {
          "hex": "#FF1DCE",
          "name": "Hot Magenta",
          "rgb": "RGB(255, 29, 206)"
      },
      {
          "hex": "#B2EC5D",
          "name": "Inchworm",
          "rgb": "RGB(178, 236, 93)"
      },
      {
          "hex": "#5D76CB",
          "name": "Indigo",
          "rgb": "RGB(93, 118, 203)"
      },
      {
          "hex": "#CA3767",
          "name": "Jazzberry Jam",
          "rgb": "RGB(202, 55, 103)"
      },
      {
          "hex": "#3BB08F",
          "name": "Jungle Green",
          "rgb": "RGB(59, 176, 143)"
      },
      {
          "hex": "#FEFE22",
          "name": "Laser Lemon",
          "rgb": "RGB(254, 254, 34)"
      },
      {
          "hex": "#FCB4D5",
          "name": "Lavender",
          "rgb": "RGB(252, 180, 213)"
      },
      {
          "hex": "#FFF44F",
          "name": "Lemon Yellow",
          "rgb": "RGB(255, 244, 79)"
      },
      {
          "hex": "#FFBD88",
          "name": "Macaroni and Cheese",
          "rgb": "RGB(255, 189, 136)"
      },
      {
          "hex": "#F664AF",
          "name": "Magenta",
          "rgb": "RGB(246, 100, 175)"
      },
      {
          "hex": "#AAF0D1",
          "name": "Magic Mint",
          "rgb": "RGB(170, 240, 209)"
      },
      {
          "hex": "#CD4A4C",
          "name": "Mahogany",
          "rgb": "RGB(205, 74, 76)"
      },
      {
          "hex": "#EDD19C",
          "name": "Maize",
          "rgb": "RGB(237, 209, 156)"
      },
      {
          "hex": "#979AAA",
          "name": "Manatee",
          "rgb": "RGB(151, 154, 170)"
      },
      {
          "hex": "#FF8243",
          "name": "Mango Tango",
          "rgb": "RGB(255, 130, 67)"
      },
      {
          "hex": "#C8385A",
          "name": "Maroon",
          "rgb": "RGB(200, 56, 90)"
      },
      {
          "hex": "#EF98AA",
          "name": "Mauvelous",
          "rgb": "RGB(239, 152, 170)"
      },
      {
          "hex": "#FDBCB4",
          "name": "Melon",
          "rgb": "RGB(253, 188, 180)"
      },
      {
          "hex": "#1A4876",
          "name": "Midnight Blue",
          "rgb": "RGB(26, 72, 118)"
      },
      {
          "hex": "#30BA8F",
          "name": "Mountain Meadow",
          "rgb": "RGB(48, 186, 143)"
      },
      {
          "hex": "#C54B8C",
          "name": "Mulberry",
          "rgb": "RGB(197, 75, 140)"
      },
      {
          "hex": "#1974D2",
          "name": "Navy Blue",
          "rgb": "RGB(25, 116, 210)"
      },
      {
          "hex": "#FFA343",
          "name": "Neon Carrot",
          "rgb": "RGB(255, 163, 67)"
      },
      {
          "hex": "#BAB86C",
          "name": "Olive Green",
          "rgb": "RGB(186, 184, 108)"
      },
      {
          "hex": "#FF7538",
          "name": "Orange",
          "rgb": "RGB(255, 117, 56)"
      },
      {
          "hex": "#FF2B2B",
          "name": "Orange Red",
          "rgb": "RGB(255, 43, 43)"
      },
      {
          "hex": "#F8D568",
          "name": "Orange Yellow",
          "rgb": "RGB(248, 213, 104)"
      },
      {
          "hex": "#E6A8D7",
          "name": "Orchid",
          "rgb": "RGB(230, 168, 215)"
      },
      {
          "hex": "#414A4C",
          "name": "Outer Space",
          "rgb": "RGB(65, 74, 76)"
      },
      {
          "hex": "#FF6E4A",
          "name": "Outrageous Orange",
          "rgb": "RGB(255, 110, 74)"
      },
      {
          "hex": "#1CA9C9",
          "name": "Pacific Blue",
          "rgb": "RGB(28, 169, 201)"
      },
      {
          "hex": "#FFCFAB",
          "name": "Peach",
          "rgb": "RGB(255, 207, 171)"
      },
      {
          "hex": "#C5D0E6",
          "name": "Periwinkle",
          "rgb": "RGB(197, 208, 230)"
      },
      {
          "hex": "#FDDDE6",
          "name": "Piggy Pink",
          "rgb": "RGB(253, 221, 230)"
      },
      {
          "hex": "#158078",
          "name": "Pine Green",
          "rgb": "RGB(21, 128, 120)"
      },
      {
          "hex": "#FC74FD",
          "name": "Pink Flamingo",
          "rgb": "RGB(252, 116, 253)"
      },
      {
          "hex": "#F78FA7",
          "name": "Pink Sherbet",
          "rgb": "RGB(247, 143, 167)"
      },
      {
          "hex": "#8E4585",
          "name": "Plum",
          "rgb": "RGB(142, 69, 133)"
      },
      {
          "hex": "#7442C8",
          "name": "Purple Heart",
          "rgb": "RGB(116, 66, 200)"
      },
      {
          "hex": "#9D81BA",
          "name": "Purple Mountain's Majesty",
          "rgb": "RGB(157, 129, 186)"
      },
      {
          "hex": "#FE4EDA",
          "name": "Purple Pizzazz",
          "rgb": "RGB(254, 78, 218)"
      },
      {
          "hex": "#FF496C",
          "name": "Radical Red",
          "rgb": "RGB(255, 73, 108)"
      },
      {
          "hex": "#D68A59",
          "name": "Raw Sienna",
          "rgb": "RGB(214, 138, 89)"
      },
      {
          "hex": "#714B23",
          "name": "Raw Umber",
          "rgb": "RGB(113, 75, 35)"
      },
      {
          "hex": "#FF48D0",
          "name": "Razzle Dazzle Rose",
          "rgb": "RGB(255, 72, 208)"
      },
      {
          "hex": "#E3256B",
          "name": "Razzmatazz",
          "rgb": "RGB(227, 37, 107)"
      },
      {
          "hex": "#EE204D",
          "name": "Red",
          "rgb": "RGB(238,32 ,77 )"
      },
      {
          "hex": "#FF5349",
          "name": "Red Orange",
          "rgb": "RGB(255, 83, 73)"
      },
      {
          "hex": "#C0448F",
          "name": "Red Violet",
          "rgb": "RGB(192, 68, 143)"
      },
      {
          "hex": "#1FCECB",
          "name": "Robin's Egg Blue",
          "rgb": "RGB(31, 206, 203)"
      },
      {
          "hex": "#7851A9",
          "name": "Royal Purple",
          "rgb": "RGB(120, 81, 169)"
      },
      {
          "hex": "#FF9BAA",
          "name": "Salmon",
          "rgb": "RGB(255, 155, 170)"
      },
      {
          "hex": "#FC2847",
          "name": "Scarlet",
          "rgb": "RGB(252, 40, 71)"
      },
      {
          "hex": "#76FF7A",
          "name": "Screamin' Green",
          "rgb": "RGB(118, 255, 122)"
      },
      {
          "hex": "#9FE2BF",
          "name": "Sea Green",
          "rgb": "RGB(159, 226, 191)"
      },
      {
          "hex": "#A5694F",
          "name": "Sepia",
          "rgb": "RGB(165, 105, 79)"
      },
      {
          "hex": "#8A795D",
          "name": "Shadow",
          "rgb": "RGB(138, 121, 93)"
      },
      {
          "hex": "#45CEA2",
          "name": "Shamrock",
          "rgb": "RGB(69, 206, 162)"
      },
      {
          "hex": "#FB7EFD",
          "name": "Shocking Pink",
          "rgb": "RGB(251, 126, 253)"
      },
      {
          "hex": "#CDC5C2",
          "name": "Silver",
          "rgb": "RGB(205, 197, 194)"
      },
      {
          "hex": "#80DAEB",
          "name": "Sky Blue",
          "rgb": "RGB(128, 218, 235)"
      },
      {
          "hex": "#ECEABE",
          "name": "Spring Green",
          "rgb": "RGB(236, 234, 190)"
      },
      {
          "hex": "#FFCF48",
          "name": "Sunglow",
          "rgb": "RGB(255, 207, 72)"
      },
      {
          "hex": "#FD5E53",
          "name": "Sunset Orange",
          "rgb": "RGB(253, 94, 83)"
      },
      {
          "hex": "#FAA76C",
          "name": "Tan",
          "rgb": "RGB(250, 167, 108)"
      },
      {
          "hex": "#18A7B5",
          "name": "Teal Blue",
          "rgb": "RGB(24, 167, 181)"
      },
      {
          "hex": "#EBC7DF",
          "name": "Thistle",
          "rgb": "RGB(235, 199, 223)"
      },
      {
          "hex": "#FC89AC",
          "name": "Tickle Me Pink",
          "rgb": "RGB(252, 137, 172)"
      },
      {
          "hex": "#DBD7D2",
          "name": "Timberwolf",
          "rgb": "RGB(219, 215, 210)"
      },
      {
          "hex": "#17806D",
          "name": "Tropical Rain Forest",
          "rgb": "RGB(23, 128, 109)"
      },
      {
          "hex": "#DEAA88",
          "name": "Tumbleweed",
          "rgb": "RGB(222, 170, 136)"
      },
      {
          "hex": "#77DDE7",
          "name": "Turquoise Blue",
          "rgb": "RGB(119, 221, 231)"
      },
      {
          "hex": "#FFFF66",
          "name": "Unmellow Yellow",
          "rgb": "RGB(255, 255, 102)"
      },
      {
          "hex": "#926EAE",
          "name": "Violet (Purple)",
          "rgb": "RGB(146, 110, 174)"
      },
      {
          "hex": "#324AB2",
          "name": "Violet Blue",
          "rgb": "RGB(50, 74, 178)"
      },
      {
          "hex": "#F75394",
          "name": "Violet Red",
          "rgb": "RGB(247, 83, 148)"
      },
      {
          "hex": "#FFA089",
          "name": "Vivid Tangerine",
          "rgb": "RGB(255, 160, 137)"
      },
      {
          "hex": "#8F509D",
          "name": "Vivid Violet",
          "rgb": "RGB(143, 80, 157)"
      },
      {
          "hex": "#FFFFFF",
          "name": "White",
          "rgb": "RGB(255, 255, 255)"
      },
      {
          "hex": "#A2ADD0",
          "name": "Wild Blue Yonder",
          "rgb": "RGB(162, 173, 208)"
      },
      {
          "hex": "#FF43A4",
          "name": "Wild Strawberry",
          "rgb": "RGB(255, 67, 164)"
      },
      {
          "hex": "#FC6C85",
          "name": "Wild Watermelon",
          "rgb": "RGB(252, 108, 133)"
      },
      {
          "hex": "#CDA4DE",
          "name": "Wisteria",
          "rgb": "RGB(205, 164, 222)"
      },
      {
          "hex": "#FCE883",
          "name": "Yellow",
          "rgb": "RGB(252, 232, 131)"
      },
      {
          "hex": "#C5E384",
          "name": "Yellow Green",
          "rgb": "RGB(197, 227, 132)"
      },
      {
          "hex": "#FFAE42",
          "name": "Yellow Orange",
          "rgb": "RGB(255, 174, 66)"
      }
  ]
  availableCssColors: CssColorObj[] = [
    {
      "name": "INDIANRED",
      "hex": "#CD5C5C",
      "rgb": "RGB(205, 92, 92)",
      "families": ["red", "brown"]
    },
    {
      "name": "LIGHTCORAL",
      "hex": "#F08080",
      "rgb": "RGB(240, 128, 128)",
      "families": ["red", "pink", "coral", "light"]
    },
    {
      "name": "SALMON",
      "hex": "#FA8072",
      "rgb": "RGB(250, 128, 114)",
      "families": ["red", "pink", "orange", "salmon"]
    },
    {
      "name": "DARKSALMON",
      "hex": "#E9967A",
      "rgb": "RGB(233, 150, 122)",
      "families": ["red", "pink", "orange", "salmon", "dark"]
    },
    {
      "name": "LIGHTSALMON",
      "hex": "#FFA07A",
      "rgb": "RGB(255, 160, 122)",
      "families": ["red", "pink", "orange", "salmon", "light"]
    },
    {
      "name": "CRIMSON",
      "hex": "#DC143C",
      "rgb": "RGB(220, 20, 60)",
      "families": ["red"]
    },
    {
      "name": "RED",
      "hex": "#FF0000",
      "rgb": "RGB(255, 0, 0)",
      "families": ["red"]
    },
    {
      "name": "DARKRED",
      "hex": "#8B0000",
      "rgb": "RGB(139, 0, 0)",
      "families": ["red", "dark"]
    },
    {
      "name": "PINK",
      "hex": "#FFC0CB",
      "rgb": "RGB(255, 192, 203)",
      "families": ["pink"]
    },
    {
      "name": "LIGHTPINK",
      "hex": "#FFB6C1",
      "rgb": "RGB(255, 182, 193)",
      "families": ["pink", "light"]
    },
    {
      "name": "HOTPINK",
      "hex": "#FF69B4",
      "rgb": "RGB(255, 105, 180)",
      "families": ["pink", "hot"]
    },
    {
      "name": "DEEPPINK",
      "hex": "#FF1493",
      "rgb": "RGB(255, 20, 147)",
      "families": ["pink", "deep"]
    },
    {
      "name": "MEDIUMVIOLETRED",
      "hex": "#C71585",
      "rgb": "RGB(199, 21, 133)",
      "families": ["pink", "purple", "violet", "medium"]
    },
    {
      "name": "PALEVIOLETRED",
      "hex": "#DB7093",
      "rgb": "RGB(219, 112, 147)",
      "families": ["pink", "pale", "violet"]
    },
    {
      "name": "CORAL",
      "hex": "#FF7F50",
      "rgb": "RGB(255, 127, 80)",
      "families": ["orange", "coral"]
    },
    {
      "name": "TOMATO",
      "hex": "#FF6347",
      "rgb": "RGB(255, 99, 71",
      "families": ["orange", "red"]
    },
    {
      "name": "ORANGERED",
      "hex": "#FF4500",
      "rgb": "RGB(255, 69, 0)",
      "families": ["orange", "red"]
    },
    {
      "name": "DARKORANGE",
      "hex": "#FF8C00",
      "rgb": "RGB(255, 140, 0)",
      "families": ["orange", "dark"]
    },
    {
      "name": "ORANGE",
      "hex": "#FFA500",
      "rgb": "RGB(255, 165, 0)",
      "families": ["orange"]
    },
    {
      "name": "GOLD",
      "hex": "#FFD700",
      "rgb": "RGB(255, 215, 0)",
      "families": ["yellow"]
    },
    {
      "name": "YELLOW",
      "hex": "#FFFF00",
      "rgb": "RGB(255, 255, 0)",
      "families": ["yellow"]
    },
    {
      "name": "LIGHTYELLOW",
      "hex": "#FFFFE0",
      "rgb": "RGB(255, 255, 224)",
      "families": ["yellow", "light"]
    },
    {
      "name": "LEMONCHIFFON",
      "hex": "#FFFACD",
      "rgb": "RGB(255, 250, 205)",
      "families": ["yellow", "lemon"]
    },
    {
      "name": "LIGHTGOLDENRODYELLOW",
      "hex": "#FAFAD2",
      "rgb": "RGB(250, 250, 210)",
      "families": ["yellow", "light", "goldenrod", "tan"]
    },
    {
      "name": "PAPAYAWHIP",
      "hex": "#FFEFD5",
      "rgb": "RGB(255, 239, 213)",
      "families": ["pink", "tan"]
    },
    {
      "name": "MOCCASIN",
      "hex": "#FFE4B5",
      "rgb": "RGB(255, 228, 181)",
      "families": ["pink", "tan"]
    },
    {
      "name": "PEACHPUFF",
      "hex": "#FFDAB9",
      "rgb": "RGB(255, 218, 185)",
      "families": ["pink", "orange", "peach"]
    },
    {
      "name": "PALEGOLDENROD",
      "hex": "#EEE8AA",
      "rgb": "RGB(238, 232, 170)",
      "families": ["yellow", "tan", "pale", "goldenrod"]
    },
    {
      "name": "KHAKI",
      "hex": "#F0E68C",
      "rgb": "RGB(240, 230, 140)",
      "families": ["yellow", "tan", "khaki"]
    },
    {
      "name": "DARKKHAKI",
      "hex": "#BDB76B",
      "rgb": "RGB(189, 183, 107)",
      "families": ["yellow", "tan", "khaki", "dark"]
    },
    {
      "name": "LAVENDER",
      "hex": "#E6E6FA",
      "rgb": "RGB(230, 230, 250)",
      "families": ["purple"]
    },
    {
      "name": "THISTLE",
      "hex": "#D8BFD8",
      "rgb": "RGB(216, 191, 216)",
      "families": ["purple"]
    },
    {
      "name": "PLUM",
      "hex": "#DDA0DD",
      "rgb": "RGB(221, 160, 221)",
      "families": ["purple"]
    },
    {
      "name": "VIOLET",
      "hex": "#EE82EE",
      "rgb": "RGB(238, 130, 238)",
      "families": ["purple", "violet", "pink"]
    },
    {
      "name": "ORCHID",
      "hex": "#DA70D6",
      "rgb": "RGB(218, 112, 214)",
      "families": ["purple", "orchid"]
    },
    {
      "name": "FUCHSIA",
      "hex": "#FF00FF",
      "rgb": "RGB(255, 0, 255)",
      "families": ["purple", "pink"]
    },
    {
      "name": "MAGENTA",
      "hex": "#FF00FF",
      "rgb": "RGB(255, 0, 255)",
      "families": ["purple", "pink", "magenta"]
    },
    {
      "name": "MEDIUMORCHID",
      "hex": "#BA55D3",
      "rgb": "RGB(186, 85, 211)",
      "families": ["purple", "orchid", "medium"]
    },
    {
      "name": "MEDIUMPURPLE",
      "hex": "#9370DB",
      "rgb": "RGB(147, 112, 219)",
      "families": ["purple", "medium"]
    },
    {
      "name": "REBECCAPURPLE",
      "hex": "#663399",
      "rgb": "RGB(102, 51, 153)",
      "families": ["purple", "blue"]
    },
    {
      "name": "BLUEVIOLET",
      "hex": "#8A2BE2",
      "rgb": "RGB(138, 43, 226)",
      "families": ["purple", "blue", "violet"]
    },
    {
      "name": "DARKVIOLET",
      "hex": "#9400D3",
      "rgb": "RGB(148, 0, 211)",
      "families": ["purple", "dark", "violet"]
    },
    {
      "name": "DARKORCHID",
      "hex": "#9932CC",
      "rgb": "RGB(153, 50, 204)",
      "families": ["purple", "dark", "orchid"]
    },
    {
      "name": "DARKMAGENTA",
      "hex": "#8B008B",
      "rgb": "RGB(139, 0, 139)",
      "families": ["purple", "dark", "magenta"]
    },
    {
      "name": "PURPLE",
      "hex": "#800080",
      "rgb": "RGB(128, 0, 128)",
      "families": ["purple"]
    },
    {
      "name": "INDIGO",
      "hex": "#4B0082",
      "rgb": "RGB(75, 0, 130)",
      "families": ["purple", "blue"]
    },
    {
      "name": "SLATEBLUE",
      "hex": "#6A5ACD",
      "rgb": "RGB(106, 90, 205)",
      "families": ["purple", "blue", "slate"]
    },
    {
      "name": "DARKSLATEBLUE",
      "hex": "#483D8B",
      "rgb": "RGB(72, 61, 139)",
      "families": ["purple", "blue", "slate", "dark"]
    },
    {
      "name": "MEDIUMSLATEBLUE",
      "hex": "#7B68EE",
      "rgb": "RGB(123, 104, 238)",
      "families": ["purple", "blue", "slate", "medium"]
    },
    {
      "name": "GREENYELLOW",
      "hex": "#ADFF2F",
      "rgb": "RGB(173, 255, 47)",
      "families": ["green", "yellow"]
    },
    {
      "name": "CHARTREUSE",
      "hex": "#7FFF00",
      "rgb": "RGB(127, 255, 0)",
      "families": ["green"]
    },
    {
      "name": "LAWNGREEN",
      "hex": "#7CFC00",
      "rgb": "RGB(124, 252, 0)",
      "families": ["green"]
    },
    {
      "name": "LIME",
      "hex": "#00FF00",
      "rgb": "RGB(0, 255, 0)",
      "families": ["green"]
    },
    {
      "name": "LIMEGREEN",
      "hex": "#32CD32",
      "rgb": "RGB(50, 205, 50)",
      "families": ["green"]
    },
    {
      "name": "PALEGREEN",
      "hex": "#98FB98",
      "rgb": "RGB(152, 251, 152)",
      "families": ["green", "pale"]
    },
    {
      "name": "LIGHTGREEN",
      "hex": "#90EE90",
      "rgb": "RGB(144, 238, 144)",
      "families": ["green", "light"]
    },
    {
      "name": "MEDIUMSPRINGGREEN",
      "hex": "#00FA9A",
      "rgb": "RGB(0, 250, 154)",
      "families": ["green", "medium", "spring"]
    },
    {
      "name": "SPRINGGREEN",
      "hex": "#00FF7F",
      "rgb": "RGB(0, 255, 127)",
      "families": ["green", "spring"]
    },
    {
      "name": "MEDIUMSEAGREEN",
      "hex": "#3CB371",
      "rgb": "RGB(60, 179, 113)",
      "families": ["green", "sea", "medium"]
    },
    {
      "name": "SEAGREEN",
      "hex": "#2E8B57",
      "rgb": "RGB(46, 139, 87)",
      "families": ["green", "sea"]
    },
    {
      "name": "FORESTGREEN",
      "hex": "#228B22",
      "rgb": "RGB(34, 139, 34)",
      "families": ["green", "forest"]
    },
    {
      "name": "GREEN",
      "hex": "#008000",
      "rgb": "RGB(0, 128, 0)",
      "families": ["green"]
    },
    {
      "name": "DARKGREEN",
      "hex": "#006400",
      "rgb": "RGB(0, 100, 0)",
      "families": ["green", "dark"]
    },
    {
      "name": "YELLOWGREEN",
      "hex": "#9ACD32",
      "rgb": "RGB(154, 205, 50)",
      "families": ["green", "yellow"]
    },
    {
      "name": "OLIVEDRAB",
      "hex": "#6B8E23",
      "rgb": "RGB(107, 142, 35)",
      "families": ["green", "olive"]
    },
    {
      "name": "OLIVE",
      "hex": "#6B8E23",
      "rgb": "RGB(128, 128, 0)",
      "families": ["green", "olive"]
    },
    {
      "name": "DARKOLIVEGREEN",
      "hex": "#556B2F",
      "rgb": "RGB(85, 107, 47)",
      "families": ["green", "olive", "dark"]
    },
    {
      "name": "MEDIUMAQUAMARINE",
      "hex": "#66CDAA",
      "rgb": "RGB(102, 205, 170)",
      "families": ["green", "blue", "aquamarine", "medium"]
    },
    {
      "name": "DARKSEAGREEN",
      "hex": "#8FBC8B",
      "rgb": "RGB(143, 188, 139)",
      "families": ["green", "sea", "dark"]
    },
    {
      "name": "LIGHTSEAGREEN",
      "hex": "#20B2AA",
      "rgb": "RGB(32, 178, 170)",
      "families": ["green", "blue", "sea", "light"]
    },
    {
      "name": "DARKCYAN",
      "hex": "#008B8B",
      "rgb": "RGB(0, 139, 139)",
      "families": ["green", "blue", "cyan", "dark"]
    },
    {
      "name": "TEAL",
      "hex": "#008080",
      "rgb": "RGB(0, 128, 128)",
      "families": ["green", "blue"]
    },
    {
      "name": "AQUA",
      "hex": "#00FFFF",
      "rgb": "RGB(0, 255, 255)",
      "families": ["blue", "aqua"]
    },
    {
      "name": "CYAN",
      "hex": "#00FFFF",
      "rgb": "RGB(0, 255, 255)",
      "families": ["blue", "cyan"]
    },
    {
      "name": "LIGHTCYAN",
      "hex": "#E0FFFF",
      "rgb": "RGB(224, 255, 255)",
      "families": ["blue", "cyan", "light"]
    },
    {
      "name": "PALETURQUOISE",
      "hex": "#AFEEEE",
      "rgb": "RGB(175, 238, 238)",
      "families": ["blue", "turquoise", "pale"]
    },
    {
      "name": "AQUAMARINE",
      "hex": "#7FFFD4",
      "rgb": "RGB(127, 255, 212)",
      "families": ["blue", "aquamarine"]
    },
    {
      "name": "TURQUOISE",
      "hex": "#40E0D0",
      "rgb": "RGB(64, 224, 208)",
      "families": ["blue", "turquoise"]
    },
    {
      "name": "MEDIUMTURQUOISE",
      "hex": "#48D1CC",
      "rgb": "RGB(72, 209, 204)",
      "families": ["blue", "turquoise", "medium"]
    },
    {
      "name": "DARKTURQUOISE",
      "hex": "#00CED1",
      "rgb": "RGB(0, 206, 209)",
      "families": ["blue", "turquoise", "dark"]
    },
    {
      "name": "CADETBLUE",
      "hex": "#5F9EA0",
      "rgb": "RGB(95, 158, 160)",
      "families": ["blue", "gray"]
    },
    {
      "name": "STEELBLUE",
      "hex": "#4682B4",
      "rgb": "RGB(70, 130, 180)",
      "families": ["blue", "steel"]
    },
    {
      "name": "LIGHTSTEELBLUE",
      "hex": "#B0C4DE",
      "rgb": "RGB(176, 196, 222)",
      "families": ["blue", "steel", "light"]
    },
    {
      "name": "POWDERBLUE",
      "hex": "#B0E0E6",
      "rgb": "RGB(176, 224, 230)",
      "families": ["blue"]
    },
    {
      "name": "LIGHTBLUE",
      "hex": "#ADD8E6",
      "rgb": "RGB(173, 216, 230)",
      "families": ["blue", "light"]
    },
    {
      "name": "SKYBLUE",
      "hex": "#87CEEB",
      "rgb": "RGB(135, 206, 235)",
      "families": ["blue", "sky"]
    },
    {
      "name": "LIGHTSKYBLUE",
      "hex": "#87CEFA",
      "rgb": "RGB(135, 206, 250)",
      "families": ["blue", "sky", "light"]
    },
    {
      "name": "DEEPSKYBLUE",
      "hex": "#00BFFF",
      "rgb": "RGB(0, 191, 255)",
      "families": ["blue", "sky", "deep"]
    },
    {
      "name": "DODGERBLUE",
      "hex": "#1E90FF",
      "rgb": "RGB(30, 144, 255)",
      "families": ["blue"]
    },
    {
      "name": "CORNFLOWERBLUE",
      "hex": "#6495ED",
      "rgb": "RGB(100, 149, 237)",
      "families": ["blue"]
    },
    {
      "name": "ROYALBLUE",
      "hex": "#4169E1",
      "rgb": "RGB(65, 105, 225)",
      "families": ["blue"]
    },
    {
      "name": "BLUE",
      "hex": "#0000FF",
      "rgb": "RGB(0, 0, 255)",
      "families": ["blue"]
    },
    {
      "name": "MEDIUMBLUE",
      "hex": "#0000CD",
      "rgb": "RGB(0, 0, 205)",
      "families": ["blue", "medium"]
    },
    {
      "name": "DARKBLUE",
      "hex": "#00008B",
      "rgb": "RGB(0, 0, 139)",
      "families": ["blue", "dark"]
    },
    {
      "name": "NAVY",
      "hex": "#00008B",
      "rgb": "RGB(0, 0, 128)",
      "families": ["blue", "dark"]
    },
    {
      "name": "MIDNIGHTBLUE",
      "hex": "#191970",
      "rgb": "RGB(25, 25, 112))",
      "families": ["blue", "dark"]
    },
    {
      "name": "CORNSILK",
      "hex": "#FFF8DC",
      "rgb": "RGB(255, 248, 220)",
      "families": ["brown", "tan"]
    },
    {
      "name": "BLANCHEDALMOND",
      "hex": "#FFEBCD",
      "rgb": "RGB(255, 235, 205)",
      "families": ["brown", "tan"]
    },
    {
      "name": "BISQUE",
      "hex": "#FFE4C4",
      "rgb": "RGB(255, 228, 196)",
      "families": ["brown", "tan"]
    },
    {
      "name": "NAVAJOWHITE",
      "hex": "#FFDEAD",
      "rgb": "RGB(255, 222, 173)",
      "families": ["brown", "tan"]
    },
    {
      "name": "WHEAT",
      "hex": "#F5DEB3",
      "rgb": "RGB(245, 222, 179)",
      "families": ["brown", "tan"]
    },
    {
      "name": "BURLYWOOD",
      "hex": "#DEB887",
      "rgb": "RGB(222, 184, 135)",
      "families": ["brown", "tan"]
    },
    {
      "name": "TAN",
      "hex": "#D2B48C",
      "rgb": "RGB(210, 180, 140)",
      "families": ["brown", "tan"]
    },
    {
      "name": "ROSYBROWN",
      "hex": "#BC8F8F",
      "rgb": "RGB(188, 143, 143)",
      "families": ["brown", "tan"]
    },
    {
      "name": "SANDYBROWN",
      "hex": "#F4A460",
      "rgb": "RGB(244, 164, 96)",
      "families": ["brown", "orange"]
    },
    {
      "name": "GOLDENROD",
      "hex": "#DAA520",
      "rgb": "RGB(218, 165, 32)",
      "families": ["brown", "goldenrod", "orange"]
    },
    {
      "name": "DARKGOLDENROD",
      "hex": "#B8860B",
      "rgb": "RGB(184, 134, 11)",
      "families": ["brown", "orange", "goldenrod", "dark"]
    },
    {
      "name": "PERU",
      "hex": "#CD853F",
      "rgb": "RGB(205, 133, 63)",
      "families": ["brown", "orange"]
    },
    {
      "name": "CHOCOLATE",
      "hex": "#D2691E",
      "rgb": "RGB(210, 105, 30)",
      "families": ["brown", "orange"]
    },
    {
      "name": "SADDLEBROWN",
      "hex": "#8B4513",
      "rgb": "RGB(139, 69, 19)",
      "families": ["brown"]
    },
    {
      "name": "SIENNA",
      "hex": "#A0522D",
      "rgb": "RGB(160, 82, 45)",
      "families": ["brown"]
    },
    {
      "name": "BROWN",
      "hex": "#A52A2A",
      "rgb": "RGB(165, 42, 42)",
      "families": ["brown", "red"]
    },
    {
      "name": "MAROON",
      "hex": "#800000",
      "rgb": "RGB(128, 0, 0)",
      "families": ["brown", "red"]
    },
    {
      "name": "WHITE",
      "hex": "#FFFFFF",
      "rgb": "RGB(255, 255, 255)",
      "families": ["white"]
    },
    {
      "name": "SNOW",
      "hex": "#FFFAFA",
      "rgb": "RGB(255, 250, 250)",
      "families": ["white"]
    },
    {
      "name": "HONEYDEW",
      "hex": "#F0FFF0",
      "rgb": "RGB(240, 255, 240)",
      "families": ["white"]
    },
    {
      "name": "MINTCREAM",
      "hex": "#F5FFFA",
      "rgb": "RGB(245, 255, 250)",
      "families": ["white"]
    },
    {
      "name": "AZURE",
      "hex": "#F0FFFF",
      "rgb": "RGB(240, 255, 255)",
      "families": ["white"]
    },
    {
      "name": "ALICEBLUE",
      "hex": "#F0F8FF",
      "rgb": "RGB(240, 248, 255)",
      "families": ["white"]
    },
    {
      "name": "GHOSTWHITE",
      "hex": "#F8F8FF",
      "rgb": "RGB(248, 248, 255)",
      "families": ["white"]
    },
    {
      "name": "WHITESMOKE",
      "hex": "#F5F5F5",
      "rgb": "RGB(245, 245, 245)",
      "families": ["white"]
    },
    {
      "name": "SEASHELL",
      "hex": "#FFF5EE",
      "rgb": "RGB(255, 245, 238)",
      "families": ["white", "pink"]
    },
    {
      "name": "BEIGE",
      "hex": "#F5F5DC",
      "rgb": "RGB(245, 245, 220)",
      "families": ["white", "tan"]
    },
    {
      "name": "OLDLACE",
      "hex": "#FDF5E6",
      "rgb": "RGB(253, 245, 230)",
      "families": ["white", "tan"]
    },
    {
      "name": "FLORALWHITE",
      "hex": "#FDF5E6",
      "rgb": "RGB(253, 245, 230)",
      "families": ["white", "tan"]
    },
    {
      "name": "IVORY",
      "hex": "#FFFFF0",
      "rgb": "RGB(255, 255, 240)",
      "families": ["white", "tan"]
    },
    {
      "name": "ANTIQUEWHITE",
      "hex": "#FAEBD7",
      "rgb": "RGB(250, 235, 215)",
      "families": ["white", "tan"]
    },
    {
      "name": "LINEN",
      "hex": "#FAF0E6",
      "rgb": "RGB(250, 240, 230)",
      "families": ["white", "tan"]
    },
    {
      "name": "LAVENDERBLUSH",
      "hex": "#FFF0F5",
      "rgb": "RGB(255, 240, 245)",
      "families": ["white", "lavender", "pink"]
    },
    {
      "name": "MISTYROSE",
      "hex": "#FFE4E1",
      "rgb": "RGB(255, 228, 225)",
      "families": ["white", "pink"]
    },
    {
      "name": "GAINSBORO",
      "hex": "#DCDCDC",
      "rgb": "RGB(220, 220, 220)",
      "families": ["gray"]
    },
    {
      "name": "LIGHTGRAY",
      "hex": "#D3D3D3",
      "rgb": "RGB(211, 211, 211)",
      "families": ["gray", "light"]
    },
    {
      "name": "SILVER",
      "hex": "#C0C0C0",
      "rgb": "RGB(192, 192, 192)",
      "families": ["gray"]
    },
    {
      "name": "DARKGRAY",
      "hex": "#A9A9A9",
      "rgb": "RGB(169, 169, 169)",
      "families": ["gray", "dark"]
    },
    {
      "name": "GRAY",
      "hex": "#808080",
      "rgb": "RGB(128, 128, 128)",
      "families": ["gray"]
    },
    {
      "name": "DIMGRAY",
      "hex": "#696969",
      "rgb": "RGB(105, 105, 105)",
      "families": ["gray"]
    },
    {
      "name": "LIGHTSLATEGRAY",
      "hex": "#778899",
      "rgb": "RGB(119, 136, 153)",
      "families": ["gray", "light", "slate"]
    },
    {
      "name": "SLATEGRAY",
      "hex": "#708090",
      "rgb": "RGB(112, 128, 144)",
      "families": ["gray",  "slate"]
    },
    {
      "name": "DARKSLATEGRAY",
      "hex": "#2F4F4F",
      "rgb": "RGB(47, 79, 79)",
      "families": ["gray",  "slate", "dark"]
    },
    {
      "name": "BLACK",
      "hex": "#000000",
      "rgb": "RGB(0, 0, 0)",
      "families": ["black"]
    }
  ]
}// ==============================

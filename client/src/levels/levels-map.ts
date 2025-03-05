import level1 from "./level-1";
import level2 from "./level-2";
import level3 from "./level-3";
import level4 from "./level-4";
import level5 from "./level-5";
import level6 from "./level-6";
import level7 from "./level-7";
import level8 from "./level-8";
import level9 from "./level-9";
import level10 from "./level-10";
import LevelEditor from "./level-editor";
import levelSample from "./level-sample";

const levels = {
  "level-editor": LevelEditor,
  "level-sample": levelSample,
  "level-1": level1,
  "level-2": level2,
  "level-3": level3,
  "level-4": level4,
  "level-5": level5,
  "level-6": level6,
  "level-7": level7,
  "level-8": level8,
  "level-9": level9,
  "level-10": level10,
};

export default levels;

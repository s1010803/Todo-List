import { fileURLToPath } from 'url';
import { dirname } from 'path';  // dirname 接收一個檔案路徑為參數，回傳這個路徑所在的資料夾內部

export default function getDirname(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}


// 在 NODE.JS 中，使用 import.meta.url 會回傳 file:///Users/you/project/server/index.js
// 但在 NODE.JS 中，使用 path.join()、fs.readfile()，需要使用 /Users/you/project/server/index.js 格式
// 所以需要使用 url module 的 fileURLToPath 轉換格式
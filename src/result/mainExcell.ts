import XLSX from "xlsx";
import saveAs from "file-saver";

// SheetをWorkbookに追加する
function sheetToWorkbook(sheet: XLSX.WorkSheet) {
  const tabeName = "シフト";
  const sheets: XLSX.WorkSheet = {};
  sheets[tabeName] = sheet;
  return { SheetNames: [tabeName], Sheets: sheets };
}

// ArrayをWorkbookに変換する
function ArrayToWorkbook(data: unknown[][], opts?: XLSX.AOA2SheetOpts) {
  return sheetToWorkbook(XLSX.utils.aoa_to_sheet(data, opts));
}

// stringをArrayBufferに変換する
function stringToBuffer(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export function sheetToExcell(array1: unknown[][]) {
  // 書き込み時のオプションは以下を参照
  const writeOpts = {
    type: "binary",
  } as const;

  // ArrayをWorkbookに変換する
  const wb = ArrayToWorkbook(array1);
  const wbOut = XLSX.write(wb, writeOpts) as string;

  // WorkbookからBlobオブジェクトを生成
  const blob = new Blob([stringToBuffer(wbOut)], {
    type: "application/octet-stream",
  });

  // FileSaverのsaveAs関数で、xlsxファイルとしてダウンロード
  saveAs(blob, "希望シフト.xlsx");
}

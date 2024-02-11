import { getUsers } from "../storage";
import "./result.scss";
import { sheetToExcell } from "./mainExcell.ts";
export const array: unknown[][] = [];

const thTd = document.querySelector("#nameDate");
const users = getUsers();
const table = document.querySelector("#table");
console.log({ users });

function createTable() {
  // theadのth(名前)を作成
  const th = document.createElement("th");
  thTd?.appendChild(th);
  th.textContent = "職員名";

  if (users !== null) {
    const lastDate = new Date(2023, 11 + 1, 0).getDate();
    // theadのth(日付部分)を作成
    for (let i = 1; i < lastDate + 1; i++) {
      const th = document.createElement("th");
      thTd?.appendChild(th);
      th.textContent = `${i}`;
    }

    users.forEach((user) => {
      const tr = document.createElement("tr");
      table?.appendChild(tr);

      const td = document.createElement("td");
      td.innerHTML = user.name;
      tr.appendChild(td);

      const objArray = user.shift;
      objArray?.forEach((obj) => {
        const td = document.createElement("td");
        td.innerHTML = String(obj);
        tr.appendChild(td);
      });
    });
  }
}

export function getTable() {
  // 表の値(tdのみ)を取得して配列を作成
  const tableValue = document.querySelector<HTMLTableElement>("#table");
  if (tableValue === null) {
    return;
  }
  const thValue = [];
  let tdValue = [];
  const tdValues = [];

  // 表の値(thのみ)を取得して配列を作成
  for (let col = 0; col < tableValue.rows[0].cells.length; col++) {
    thValue.push(tableValue.rows[0].cells[col].innerHTML);
  }

  // 表の値(tdのみ)を取得して配列を作成
  for (let row = 1; row < tableValue.rows.length; row++) {
    for (let col = 0; col < tableValue.rows[row].cells.length; col++) {
      tdValue.push(tableValue.rows[row].cells[col].innerHTML);
    }
    tdValues.push(tdValue);
    tdValue = [];
  }

  // mainExcell.jsへの値を送る(Excel作成)

  array.push(thValue);
  array.push(...tdValues);

  return array;
}

createTable();
getTable();

document.querySelector("#xlsx")?.addEventListener("click", () => {
  sheetToExcell(array);
});

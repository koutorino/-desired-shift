import { getUsers, setUsers } from "../storage";
import "./user-edit.scss";

const btn = document.querySelector("button");
const table = document.querySelector("table");
const users = getUsers();
const formName = document.querySelector<HTMLFormElement>("#formName");
const formNum = document.querySelector<HTMLInputElement>("#formNum");

function createNameTable() {
  // localStorageの値を表にする。
  users?.forEach((user) => {
    const tr = document.createElement("tr");
    table?.appendChild(tr);
    const objArray = Object.entries(user);
    objArray.splice(3, 1);
    objArray.push([
      "del",
      '<button id="del"><span class="material-symbols-outlined icon">delete_forever</span></button>',
    ]);
    objArray.forEach((arr) => {
      if (arr[0] === "id") {
        return true;
      }
      const td = document.createElement("td");
      td.innerHTML = String(arr[1]);
      tr.appendChild(td);
    });
  });
}

// 職員の追加
function appnedRow() {
  if (formName == null || formNum == null) {
    return;
  }
  if (formName.value === "" || formNum.value === "") {
    alert("値を入力してから追加してください。");
    return;
  }
  const table = document.querySelector<HTMLTableElement>("#tbl");
  if (table === null) {
    return;
  }
  const count = table.rows.length;
  const row = table.insertRow(count);
  const c1 = row.insertCell(0);
  const c2 = row.insertCell(1);

  c1.innerHTML = formName.value;
  c2.innerHTML = formNum.value;
  const createBtn = document.createElement("button");
  createBtn.setAttribute("id", "del");
  const createSpan = document.createElement("span") as HTMLInputElement;
  createSpan.setAttribute("class", "material-symbols-outlined icon");
  createSpan.value = "delete_forever";
}

// 職員の削除
function deleteRow(obj: Element) {
  if (confirm("この行を解除しますか")) {
    const objTR = obj.parentNode?.parentNode as ChildNode | null | undefined;
    objTR?.remove();
  }
}

// 職員の保存
function saveUsers() {
  const tableValue = document.querySelector<HTMLTableElement>("#tbl");
  const userValue = [];
  if (table?.rows.length === undefined) {
    return;
  }
  for (let row = 1; row < table?.rows.length; row++) {
    const user = {
      id: String(crypto.randomUUID()),
      name: tableValue?.rows[row].cells[0].innerHTML ?? "",
      password: Number(tableValue?.rows[row].cells[1].innerHTML),
    };
    userValue.push(user);
  }
  setUsers(userValue);
}

createNameTable();

const delbtns = document.querySelectorAll("#del");
for (let i = 0; i < delbtns.length; i++) {
  delbtns[i].addEventListener("click", () => {
    deleteRow(delbtns[i]);
    saveUsers();
  });
}

btn?.addEventListener("click", () => {
  appnedRow();
  if (
    formName == null ||
    formNum == null ||
    formName.value === "" ||
    formNum.value === ""
  ) {
    return;
  }
  saveUsers();
  location.reload();
  formName.value = "";
  formNum.value = "";
});

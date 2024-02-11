"use strict";

import { type UserData, getUsers } from "../storage";
import "./main-form.scss";
const userDataList: UserData[] = [];

// ユーザー検索
function findUser(searchId: string, searchPassword: number) {
  const searchResult = document.getElementById("search-result");
  if (searchResult == null) {
    return;
  }
  const object = userDataList.find((data) => data.name === searchId);
  const objectName = JSON.stringify(
    userDataList.find((data) => data.name === searchId),
  );
  const objectPassword = JSON.stringify(
    userDataList.find((data) => data.password === searchPassword),
  );
  const targetData = objectName === objectPassword;

  // データがなければ、「該当者なし」と表示して終了
  if (!targetData || objectName === undefined) {
    searchResult.textContent = "名前または職員番号が違います";
    return;
  }

  // 該当データの名前を表示する
  searchResult.textContent = "ログインしました。";

  // シフトデータに移動
  const url = new URL("../input-form/index.html", location.href);

  if (object === undefined) {
    return;
  }
  url.searchParams.set("id", String(object.id));
  window.open(url.href);
}

// ログイン
document.querySelector(".log")?.addEventListener("click", () => {
  const searchIdElm = document.querySelector<HTMLInputElement>("#search-id");
  const searchId = searchIdElm?.value ?? "";
  const searchPasswordElm =
    document.querySelector<HTMLInputElement>("#search-password");
  const searchPassword = Number(searchPasswordElm?.value ?? "");
  findUser(searchId, searchPassword);
});

// 名前,職員番号
const users = getUsers();

if (users == null) {
  alert("ユーザー登録をしてください。");
  const editUrl = new URL("../input-form/index.html", location.href);
  window.open(editUrl);
}

users?.forEach((user) => {
  userDataList.push(user);
});

// optionタグに名前を追加
userDataList.forEach((deta) => {
  const select = document.querySelector("#search-id");
  if (select == null) {
    return;
  }
  const option = document.createElement("option");
  option.innerHTML = deta.name;
  select.appendChild(option);
});

// 職員編集画面への移動
document.getElementById("edit")?.addEventListener("click", function () {
  const editUrl = new URL("../user-edit/index.html", location.href);
  window.open(editUrl);
});

// 提出確認画面への移動
document.getElementById("result")?.addEventListener("click", function () {
  const resultUrl = new URL("../result/index.html", location.href);
  window.open(resultUrl);
});

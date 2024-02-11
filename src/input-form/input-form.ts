import noUiSlider, {
  PipsMode,
  type target as noUiSliderTarget,
} from "noUiSlider";
import "./input-form.scss";
import "../../node_modules/noUiSlider/dist/nouislider.min.css";
import { type UserData, getUsers, setUsers } from "../storage";
const url = new URL(window.location.href);
const addParam = url.searchParams.get("id");
const users = getUsers();
const user = users?.find((data) => data.id === addParam);
if (user == null) {
  alert("入力がありません。ユーザー登録を先に済ませてください。");
  window.open("../user-edit/index.html");
}

// 要素の取得
function renderElement(num: number) {
  const body = document.querySelector("#siteBody");

  // 各区切りの作成
  const mainForm = document.createElement("div");
  mainForm.className = "main-form";

  // 日付と時間の表示
  const result = document.createElement("div");
  result.className = "result";

  // 収集する月の日付と曜日の取得
  const day = new Date(2023, 11, num).getDay();
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const date = document.createElement("p");
  date.textContent = `12/${num} (${days[day]})`;

  // スライダーの数値を習得
  const value = document.createElement("div");
  value.setAttribute("id", `sliderValue${num}`);
  value.setAttribute("class", "required");
  console.log(value);

  // radioとスライダーをまとめたところ
  const form = document.createElement("div");
  form.className = "form";

  // radioをまとめたところ
  const rad = document.createElement("div");
  rad.className = "rad";

  // 各radio用のlabelの作成
  const label1 = document.createElement("label");
  const label2 = document.createElement("label");
  const label3 = document.createElement("label");

  // 各radioの作成
  const inputShu = document.createElement("input");
  const shuText = document.createElement("span");
  inputShu.setAttribute("type", "radio");
  inputShu.setAttribute("name", "sel");
  inputShu.className = `chek1-${num}`;
  shuText.textContent = "終日";
  const inputOff = document.createElement("input");
  const offText = document.createElement("span");
  inputOff.setAttribute("type", "radio");
  inputOff.setAttribute("name", "sel");
  inputOff.className = `chek2-${num}`;
  offText.textContent = "休み";
  const inputYuky = document.createElement("input");
  const yukyText = document.createElement("span");
  inputYuky.setAttribute("type", "radio");
  inputYuky.setAttribute("name", "sel");
  inputYuky.className = `chek3-${num}`;
  yukyText.textContent = "有給";

  // スライダー部分の作成
  const container = document.createElement("div");
  container.className = "container";
  const sliderUi = document.createElement("div");
  sliderUi.setAttribute("id", `slider${num}`);

  // 全体の要素を追加する
  body?.appendChild(mainForm);
  mainForm.appendChild(result);
  result.appendChild(date);
  result.appendChild(value);
  mainForm.appendChild(form);
  form.appendChild(rad);
  rad.appendChild(label1);
  rad.appendChild(label2);
  rad.appendChild(label3);
  label1.appendChild(inputShu);
  label1.appendChild(shuText);
  label2.appendChild(inputOff);
  label2.appendChild(offText);
  label3.appendChild(inputYuky);
  label3.appendChild(yukyText);
  form.appendChild(container);
  container.appendChild(sliderUi);

  const minVal = 8.5;
  const maxVal = 21;
  const gap = 0.5;

  // スライダー作成用jquery
  noUiSlider.create(sliderUi, {
    start: [0, 0], // 初期の範囲値
    connect: true, // 範囲を色付きのバーで結ぶ
    range: {
      min: minVal,
      max: maxVal,
    },
    step: gap,
    tooltips: true, // ハンドル上にツールチップを表示
    pips: {
      // 特定の間隔で値のマーカーを追加
      mode: PipsMode.Positions,
      values: [-5, 25, 50, 75, 100],
      density: 10,
    },
  });
}

// スライダー部分の取得
function sliderValue(num: number) {
  const slider = document.getElementById(`slider${num}`) as noUiSliderTarget;
  const valueElement = document.getElementById(`sliderValue${num}`);
  if (slider == null || valueElement == null) {
    return;
  }
  const chek1 = document.querySelector(`.chek1-${num}`);
  const chek2 = document.querySelector(`.chek2-${num}`);
  const chek3 = document.querySelector(`.chek3-${num}`);
  let min;
  let max;

  // スライダーを動かしたときに数値を変更する
  slider?.noUiSlider?.on("update", (values) => {
    min = values[0];
    max = values[1];
    valueElement.innerHTML = min + " - " + max;

    // ラジオボタンを押したときに変更される設定
    chek1?.addEventListener("change", () => {
      min = 8.5;
      max = 21.0;
      valueElement.innerHTML = min + "-" + max;
      slider?.noUiSlider?.set([min, max]);
    });

    chek2?.addEventListener("change", () => {
      min = 21.0;
      max = 21.0;
      valueElement.innerHTML = "休み";
      slider?.noUiSlider?.set([min, max]);
    });

    chek3?.addEventListener("change", () => {
      min = 21.0;
      max = 21.0;
      valueElement.innerHTML = "有給";
      slider?.noUiSlider?.set([min, max]);
    });
  });
}

let shifts: unknown[] = [];

// 希望シフトの登録（オブジェクトに）
function setLocalstorage(num: number) {
  const shift = document.querySelector(`#sliderValue${num}`)?.innerHTML;
  shifts.push(shift);
}

// エラーメッセージを表示用のspanタグを作成
function createError(elms: Element, errorMessage: string) {
  const errorSpan = document.createElement("span");
  errorSpan.classList.add("error");
  errorSpan.textContent = errorMessage;
  if (elms == null) {
    return;
  }
  elms.parentNode?.appendChild(errorSpan);
}

function saveShifts() {
  for (let i = 1; i <= lastDate; i++) {
    setLocalstorage(i);
  }

  const saveUsers: UserData[] =
    users?.map((obj) => {
      if (obj.name === user?.name) {
        return { ...obj, shift: shifts as string[] };
      }
      return obj;
    }) ?? [];

  setUsers(saveUsers);
}

function errorCheck() {
  // 未記入に対して、色を付ける
  const errorElems = document.querySelectorAll(".error");
  const requiredElems = document.querySelectorAll(".required");

  errorElems.forEach((elem) => {
    elem.remove();
  });

  // 記入していないところを探して、表示
  requiredElems.forEach((elem) => {
    const elmeValue = elem.innerHTML;
    if (elmeValue === "8.50 - 8.50") {
      createError(elem, "記入されていません");
    }
  });

  // エラーがあるところまで飛ぶ
  const errorElem = document.querySelector<HTMLElement>(".error");
  if (errorElem !== null) {
    const errorElemOffsetTop = errorElem.offsetTop;
    window.scrollTo({
      top: errorElemOffsetTop - 170,
      behavior: "smooth",
    });
    alert("未記入があります。すべて記入してください。");
    return "retrai";
  }
}

// 「ようこそ●●さん！！」
const helloNameElement = document.querySelector<HTMLElement>("#helloName");
if (helloNameElement !== null) {
  helloNameElement.textContent = "ようこそ" + user?.name + "さん！！";
}

// 当月の最終日を取得する
const lastDate = new Date(2023, 11 + 1, 0).getDate();
// 当月分繰り返し、要素を作成する
for (let i = 1; i <= lastDate; i++) {
  renderElement(i);
  sliderValue(i);
}

// 【登録】でオブジェクトの作成・保存
document.querySelector("#register")?.addEventListener("click", () => {
  const check = errorCheck();
  if (check === "retrai") {
    return;
  }
  alert("データが保存されました。");
  saveShifts();
  shifts = [];
});

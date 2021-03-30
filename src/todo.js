"use stirct";

const workWrite = document.querySelector(".work__write"),
  workInput = workWrite.querySelector("input"),
  workBtn = workWrite.querySelector("button"),
  toDoList = document.querySelector(".list"),
  complete = document.querySelector(".complete"),
  completeSpan = complete.querySelector("span"),
  progressBar = document.querySelector(".progress__bar"),
  progressValue = progressBar.querySelector(".progress__value");

let modify = false;
let previousPercent = 0;

const TODOS_LS = "toDos";

let isNumber = 1;
let toDos = [];

function paintUndo(e) {
  e.preventDefault();
  undoBtn = e.target;
  bbt = undoBtn.parentNode;
  edtiForm = bbt.parentNode;
  li = edtiForm.parentNode;
  li.removeChild(edtiForm);
  const labelInput = li.querySelector(".checkbox");
  const btn = li.querySelector("button");
  const span = li.querySelector("span");
  labelInput.style.visibility = "visible";
  btn.classList.remove("none");
  for (var i = 0; i < toDos.length; i++) {
    if (toDos[i].id === parseInt(li.id)) {
      const text = toDos[i].text;
      span.innerText = `${text}`;
    }
  }
  console.log(li);
}

function handleChange(e) {
  const checkbox = e.target;
  const label = checkbox.parentNode;
  const li = label.parentNode;
  const checked = checkbox.checked;
  for (var i = 0; i < toDos.length; i++) {
    if (toDos[i].id === parseInt(li.id)) {
      toDos[i].isChecked = checked;
    }
  }

  selectCheckedNum();
  saveToDos();
}

function paintToDo(text, target, isChecked) {
  if (modify) {
    const toDo_li = document.createElement("li");
    const toDo_span = document.createElement("span");
    const toDo_listBtn = document.createElement("button");
    const toDo_check = document.createElement("input");
    const toDo_label = document.createElement("label");

    toDo_check.setAttribute("type", "checkbox");
    toDo_check.setAttribute("class", "checkbox");
    toDo_check.checked = isChecked;
    const newId = isNumber;
    isNumber += 1;
    toDo_li.classList.add("list__item");
    toDo_span.innerText = text;
    toDo_listBtn.innerHTML = `
      <i class="fas fa-edit"></i>
      <i class="fas fa-trash-alt"></i>
    `;
    toDo_listBtn.classList.add("todo__icon");
    const delBtn = toDo_listBtn.querySelector(".fa-trash-alt");
    const editBtn = toDo_listBtn.querySelector(".fa-edit");

    delBtn.addEventListener("click", handleDelete);
    editBtn.addEventListener("click", handleDoEdit);
    toDo_check.addEventListener("change", handleChange);

    toDo_label.appendChild(toDo_check);
    toDo_label.appendChild(toDo_span);
    toDo_li.appendChild(toDo_label);
    toDo_li.appendChild(toDo_listBtn);
    toDoList.appendChild(toDo_li);

    toDo_li.id = newId;
    const toDoObj = {
      id: newId,
      text,
      isChecked,
    };

    toDos.push(toDoObj);
    saveToDos();
  } else {
    const targetList = target.parentNode;

    const toDoId = targetList.id;
    const editedBtn = targetList.querySelector("button");
    const editLabel = targetList.querySelector("label");
    const editCheck = editLabel.querySelector("input");

    editCheck.style.display = "inline-block";
    const delBtn = editedBtn.querySelector(".fa-trash-alt");
    const editBtn = editedBtn.querySelector(".fa-edit");
    delBtn.addEventListener("click", handleDelete);
    editBtn.addEventListener("click", handleDoEdit);

    editedBtn.classList.remove("none");

    for (var i = 0; i < toDos.length; i++) {
      if (toDos[i].id === parseInt(toDoId)) {
        toDos[i].text = text;
      }
    }
    console.log(target);
    // target.remove();

    saveToDos();
  }
}

function handleEditSumbit(e) {
  modify = false;
  const target = e.target;
  const removeBtn = target.querySelector(".bbt");
  const input = target.querySelector("input");
  const text = input.value;
  removeBtn.remove();
  paintToDo(text, target, "");
}

function handleDoEdit(e) {
  const editBtn = e.target.parentNode;
  const item = editBtn.parentNode;
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  const text = item.querySelector("span");
  const checked = item.querySelector(".checkbox");
  const bbt = document.createElement("button");
  bbt.setAttribute("class", "bbt");
  bbt.setAttribute("type", "submit");

  if (text.innerText === "") {
    return;
  }
  checked.style.visibility = "hidden";
  item.prepend(form);
  text.innerText = "";
  input.style.marginBottom = "5px";
  input.style.fontSize = "30px";
  input.style.height = "50px";
  input.placeholder = "EDIT YOU'R TO DO!";
  form.appendChild(input);

  input.focus();

  editBtn.classList.add("none");
  console.log(editBtn);
  bbt.innerHTML = `
      <i class="fas fa-undo"></i>
      <i class="fas fa-exchange-alt"></i>
  `;
  form.appendChild(bbt);
  const undo = bbt.querySelector(".fa-undo");
  const cc = bbt.querySelector(".fa-exchange-alt");
  editBtn.setAttribute("type", "submit");
  form.addEventListener("submit", handleEditSumbit);
  cc.addEventListener("click", handleEditSumbit);
  undo.addEventListener("click", (e) => {
    paintUndo(e);
  });
}

function handleDelete(e) {
  if (e.target.nodeName === "BUTTON") {
    return;
  }
  const target = e.target.parentNode;
  const itemSelect = target.parentNode;
  toDoList.removeChild(itemSelect);
  const cleanToDos = toDos.filter((todo) => {
    return todo.id !== parseInt(itemSelect.id);
  });
  toDos = cleanToDos;
  selectCheckedNum();
  saveToDos();
}

function saveToDos() {
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function handleSumbit(e) {
  modify = true;
  e.preventDefault();
  const text = workInput.value;
  if (text === "") {
    return alert("계획을 작성하세요!");
  }
  paintToDo(text, e);
  workInput.value = "";
}

function loadToDoList() {
  const loadedToDoList = localStorage.getItem(TODOS_LS);
  if (loadedToDoList !== null) {
    const parsedToDoList = JSON.parse(loadedToDoList);
    modify = true;
    parsedToDoList.forEach((toDo) => {
      paintToDo(toDo.text, "", toDo.isChecked);
    });
    selectCheckedNum();
  }
}

function selectCheckedNum() {
  let checkedNum = 0;
  for (var i = 0; i < toDos.length; i++) {
    if (toDos[i].isChecked === true) {
      checkedNum = checkedNum + 1;
    }
  }
  paintProgressBar(checkedNum);
}

function paintProgressBar(checkedNum) {
  let percent = 0;
  let width = previousPercent;
  if (toDos.length != 0) {
    percent = Math.round((100 * checkedNum) / toDos.length);
  }
  if (percent > previousPercent) {
    const time = setInterval(() => {
      if (width >= percent) {
        clearInterval(time);
      } else {
        width++;
        progressValue.style.width = `${width}%`;
        completeSpan.innerText = `${width}% Complete`;
      }
    }, 5);
  } else {
    const time = setInterval(() => {
      if (width <= percent) {
        clearInterval(time);
      } else {
        width--;
        progressValue.style.width = `${width}%`;
        completeSpan.innerText = `${width}% Complete`;
      }
    }, 5);
  }
  previousPercent = percent;
}

function init() {
  loadToDoList();
  workWrite.addEventListener("submit", handleSumbit);
}

init();

let allTasks = [];
let valueInput = "";
let input = null;
let editTasks = null;
let inputResult = "";

window.onload = init = async () => {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:8000/getAllTasks", {
    method: "GET",
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onClickButton = async () => {
  const resp = await fetch("http://localhost:8000/createNewTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    }),
  });

  const result = await resp.json();
  allTasks.push(result);

  valueInput = "";
  input.value = "";
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.sort((a, b) => a.isCheck - b.isCheck);

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.className = "task-checkbox";
    checkbox.onchange = () => onChangeCheckbox(index);
    container.appendChild(checkbox);

    if (editTasks === index) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = item.text;
      input.className = "input-text-task";
      input.onchange = (e) => { inputResult = e.target.value };
      container.appendChild(input);

      const imageDone = document.createElement("img");
      imageDone.src = "done.png";
      imageDone.onclick = () => saveEditFunction(index);
      container.appendChild(imageDone);

      const imageCancel = document.createElement("img");
      imageCancel.src = "return.png";
      imageCancel.onclick = () => cancelEditFunction();
      container.appendChild(imageCancel);
    } else {
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "text-task done-task" : "text-task";
      container.appendChild(text);

      const imageEdit = document.createElement("img");
      imageEdit.src = "edit.png";
      imageEdit.onclick = () => editTasksFunction(index);
      container.appendChild(imageEdit);
      if (allTasks[index].isCheck) {
        imageEdit.className = "image-edit-none";
      }

      if (item.isCheck) {
        container.className = "task-block-done";
        imageEdit.style.display = "none";
      }

      const imageDelete = document.createElement("img");
      imageDelete.src = "delete.png";
      imageDelete.onclick = () => removeTasks(item, index);
      container.appendChild(imageDelete);
    }

    content.appendChild(container);
  });
};

const onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  render();
};

const removeTasks = async (item) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${item._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
  const result = await resp.json();
  allTasks = result;
  render();
};

const editTasksFunction = (index) => {
  editTasks = index;
  const inputResult = allTasks[index];
  const { text } = inputResult;
  render();
};

const saveEditFunction = async (index) => {
  const resp = await fetch(`http://localhost:8000/updateTask?id=${allTasks[editTasks]._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ text: inputResult }),
  });
  editTasks = null;
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const cancelEditFunction = () => {
  editTasks = null;
  inputResult = "";
  render();
};
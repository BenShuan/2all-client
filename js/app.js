const SERVER_URL = "http://all-server-dev.eba-v2rg5e3t.us-east-1.elasticbeanstalk.com/api";

// ------------------------------------------------------ ACTIONS -------------------------------------------------------------

function handleNewColorSubmit(e) {
  e.preventDefault();

    const newColor = {
      id: 0,
      name: this.colorName.value,
      colorCode: this.colorCode.value,
      price: +this.price.value,
      order: +this.order.value,
      isInStock: this.isInStock.checked,
    };

  ajaxCall(
    "POST",
    SERVER_URL,
    JSON.stringify(newColor),
    successInsertColor,
    (err) => console.log("alert", err)
  );

  this.reset();
}

function handleDeleteColor(e) {
  const colorId = $(this).data("colorid");
  ajaxCall(
    "DELETE",
    SERVER_URL + "/" + colorId,
    {},
    () => successDeleteColor(colorId),
    (err) => console.log("alert", err)
  );
}

function handleUpdateColor() {
  const color = $(this).data("id");

  const form = $("#new-color")[0]

  const newColor = {
    id: color,
    name: form.colorName.value,
    colorCode: form.colorCode.value,
    price: +form.price.value,
    order: +form.order.value,
    isInStock: form.isInStock.checked,
  };

  ajaxCall("PUT", SERVER_URL + "/" + color, JSON.stringify(newColor), successUpdateColor, (err) =>
    console.log("alert", err)
  );

  $('#update-btn').hide()
  $('#save-btn').show()
  form.reset()
}

function handleEditButtun() {
  const color = $(this).data("colorid");
  ajaxCall("GET", SERVER_URL + "/" + color, {}, pupulateForm, (err) =>
    console.log("alert", err)
  );
}

const refreshColors = () => {
  ajaxCall("GET", SERVER_URL, {}, insertRows, (err) =>
    console.log("alert", err)
  );
};

// ------------------------------------------------------ CALLBACKS -------------------------------------------------------------

const successInsertColor = (ans) => {
  alert("New color has been added");
  refreshColors();
};


const successDeleteColor = (id) => {
  alert(`Color Id ${id} has been deleted`);
  refreshColors();
};

const successUpdateColor=()=>{
  alert('Color Was update')
  refreshColors()
}

// ------------------------------------------------------ UTILS -------------------------------------------------------------

const rowFormat = (color) => {
  return ` <tr >
  <td>${color.name}</td>
  <td>${color.price}</td>
  <td style="background-color:${color.colorCode} ;">${color.colorCode}</td>
  <td>${color.order}</td>
  <td>${color.isInStock}</td>
  <td>
  <input data-colorId="${color.id}" class="btn btn-edit" type="button" value="עריכה">
  <input data-colorId="${color.id}" class="btn btn-del" type="button" value="מחיקה">
  </td>
  </tr>`;
};

const insertRows = (colors) => {
  let rows = "";
  colors.sort((a, b) => a.order - b.order);
  for (let i = 0; i < colors.length; i++) {
    rows += rowFormat(colors[i]);
  }

  const cList = $("#colors-list");
  cList.html("");

  cList.append(rows);
};

const pupulateForm = (ans) => {
  $("[name=colorName]").val(ans.name);
  $("[name=colorCode]").val(ans.colorCode);
  $("[name=price]").val(ans.price);
  $("[name=order]").val(ans.order);
  $("[name=isInStock]")[0].checked = ans.isInStock;
  $("#update-btn").data("id", ans.id);
  $("#update-btn").show();
  
  $("#save-btn").hide();
};



const init = () => {
  $("#new-color").on("submit", handleNewColorSubmit);
  $("#update-btn").on("click", handleUpdateColor);
  $("#update-btn").hide()

  $(document).on("click", ".btn-del", handleDeleteColor);
  $(document).on("click", ".btn-edit", handleEditButtun);
  refreshColors();
};

$(document).ready(init);

let employeeData = [
  { id: 1, name: "John Doe", email: "johnDoe@example.com", city: "İstanbul" },
  { id: 2, name: "Jane Doe", email: "janaDoe@example.com", city: "İstanbul" },
  {
    id: 3,
    name: "Mehmet Derya Hazar",
    email: "m.derya.hazar@gmail.com",
    city: "Ankara",
  },
  { id: 4, name: "Ada Lovelace", email: "ADA@example.com", city: "London" },
];
function updateTable() {
  const tableBody = $("#employeeTable tbody");
  tableBody.empty();

  employeeData.forEach((employee) => {
    tableBody.append(`
                    <tr>
                        <td>${employee.id}</td>
                        <td>${employee.name}</td>
                        <td>${employee.email}</td>
                        <td>${employee.city}</td>
                        <td>
                            <button class="delete" data-id="${employee.id}">Delete</button>
                        </td>
                    </tr>
                `);
  });
}
function getNextId() {
  if (employeeData.length === 0) {
    return 1;
  }
  return Math.max(...employeeData.map((emp) => emp.id)) + 1;
}
$("#employeeForm").on("submit", function (event) {
  event.preventDefault();

  const firstname = $("#firstname").val();
  const lastname = $("#lastname").val();
  const email = $("#email").val();
  const city = $("#city").val();

  if (!firstname || !lastname || !email || !city) {
    alert("Please fill all fields.");
    return;
  }

  const newPerson = {
    id: getNextId(),
    name: `${firstname} ${lastname}`,
    email,
    city,
  };

  employeeData.push(newPerson);
  updateTable();

  $("#employeeForm")[0].reset();
});
$("#darkMode").on("click", function () {
  $("body").toggleClass("dark-mode");
  $("#darkMode").toggleClass("dark-mode");
  $("th").toggleClass("dark-mode");
  $("input").toggleClass("dark-mode");
  $(this).css({ transition: "background-color 0.5s", cursor: "pointer" });
});

$("#employeeForm").on("mouseenter", ".submit", function () {
  $(this).css({
    "background-color": "lightgreen",
    transition: "background-color 0.3s",
    cursor: "pointer",
  });
});

$("#employeeForm").on("mouseleave", ".submit", function () {
  $(this).css({
    "background-color": "",
  });
});

$("#employeeTable").on("mouseenter", "tr", function () {
  $(this).css({
    "background-color": "lightblue",
    transition: "background-color 0.3s",
  });
});
$("#employeeTable").on("mouseenter", ".delete", function () {
  $(this).css({
    "background-color": "red",
    transition: "background-color 0.3s",
    cursor: "pointer",
  });
});
$("#employeeTable").on("mouseleave", ".delete", function () {
  $(this).css({
    "background-color": "",
  });
});

$("#employeeTable").on("mouseleave", "tr", function () {
  $(this).css("background-color", "");
});
$("#employeeTable").on("click", ".delete", function () {
  const idToDelete = $(this).data("id");
  employeeData = employeeData.filter((employee) => employee.id !== idToDelete);
  updateTable();
});

$(document).ready(updateTable);

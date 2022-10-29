function GetDate() {
  var d = new Date();
  document.getElementById("demo").innerHTML = d.getDay();
}

var n = localStorage.getItem("date");
document.getElementById("showDate").innerHTML = n;

function getInput() {}

function SaveData() {
  var st = document.getElementById("Reason");
  localStorage.setItem("Reasons", st.value);
  write(st);
}

function ShowData() {
  var s = localStorage.getItem("Reasons");
  document.getElementById("demo").innerHTML = s;
}

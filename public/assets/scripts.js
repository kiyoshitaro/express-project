function changeTheme() {
  let s = document.getElementById("theme").value;
  let areas = document.getElementsByClassName("theme_class");
  for (area of areas) {
    h3s = area.getElementsByTagName("h3");
    for (h3 of h3s) {
      h3.style.color = s;
    }
    hrs = area.getElementsByTagName("hr");
    for (hr of hrs) {
      hr.style.borderColor = s;
    }
  }
}

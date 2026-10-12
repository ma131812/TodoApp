document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login_form");
  const btn = document.querySelector(".next_step");

  const email = document.getElementById("email");
  const pass = document.getElementById("pass");
  const serverErr = document.getElementById("serverError");

  if (!form || !btn || !email || !pass) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (!email.value.trim()) {
      alert("ایمیل الزامی است");
      email.focus();
      return false;
    }

    if (!emailRegex.test(email.value)) {
      alert("ایمیل وارد شده معتبر نیست");
      email.focus();
      return false;
    }

    if (!pass.value) {
      alert("رمز عبور الزامی است");
      pass.focus();
      return false;
    }

    if (pass.value.length < 8) {
      alert("رمز عبور باید حداقل 8 کاراکتر داشته باشد");
      pass.focus();
      return false;
    }

    return true;
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    if (serverErr) serverErr.style.display = "none";

    if (validate()) form.submit();
  });

  form.addEventListener("submit", (e) => {
    if (!validate()) e.preventDefault();
  });
});

document.querySelector(".next_step").addEventListener("click", ... submit());
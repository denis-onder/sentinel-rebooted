const $ = id => document.getElementById(id).value || "";

const register = async () => {
  const data = {
    firstName: $("first_name_input"),
    lastName: $("last_name_input"),
    email: $("email_input"),
    password: $("password_input"),
    confirmPassword: $("confirm_password_input")
  };
  const res = await fetch("/register", { method: "POST" }, data);
  const payload = await res.json();
  if (res.status !== 200) console.error(payload);
  console.log(`Registered`);
};

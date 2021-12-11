async function signupFormHandler(event) {
  event.preventDefault();

  const password = document.querySelector("#password-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();

  if (password && email) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      console.log("success");
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
}

document
  .querySelector("#signup-form")
  .addEventListener("submit", signupFormHandler);

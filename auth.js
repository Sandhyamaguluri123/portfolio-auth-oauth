(() => {
  const message = document.getElementById("message");
  const signinForm = document.getElementById("signin-form");
  const googleBtn = document.getElementById("google-btn");
  const signupBtn = document.getElementById("show-signup");

  function showMessage(text, kind = "") {
    if (!message) return;
    message.textContent = text;
    message.className = `message ${kind}`;
  }

  function setup() {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY ||
        window.SUPABASE_URL.includes("YOUR_PROJECT_ID") ||
        window.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")) {
      showMessage("Setup required: add your Supabase URL and publishable/anon key in config.js.", "error");
      return null;
    }
    return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }

  const client = setup();
  if (!client) return;

  // If a valid session already exists, go straight to the protected portfolio.
  client.auth.getSession().then(({ data, error }) => {
    if (!error && data.session) window.location.replace("portfolio.html");
  });

  signinForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submit = signinForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    showMessage("Signing in…");
    const { error } = await client.auth.signInWithPassword({ email, password });
    submit.disabled = false;
    if (error) return showMessage(error.message, "error");
    window.location.replace("portfolio.html");
  });

  signupBtn?.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!email || password.length < 6) {
      return showMessage("Enter your email and a password of at least 6 characters, then click Create an account.", "error");
    }
    showMessage("Creating account…");
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/index.html` }
    });
    if (error) return showMessage(error.message, "error");
    if (data.session) {
      showMessage("Account created. Opening your portfolio…", "success");
      window.location.replace("portfolio.html");
    } else {
      showMessage("Account created. Check your email to confirm your account, then sign in.", "success");
    }
  });

  googleBtn?.addEventListener("click", async () => {
    showMessage("Opening Google sign-in…");
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/portfolio.html` }
    });
    if (error) showMessage(error.message, "error");
  });
})();

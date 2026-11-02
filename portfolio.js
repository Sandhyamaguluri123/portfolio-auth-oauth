(() => {
  const signoutBtn = document.getElementById("signout-btn");
  const userLabel = document.getElementById("user-label");

  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY ||
      window.SUPABASE_URL.includes("YOUR_PROJECT_ID") ||
      window.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")) {
    window.location.replace("index.html");
    return;
  }

  const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  async function requireSession() {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session) {
      window.location.replace("index.html");
      return;
    }
    userLabel.textContent = `Signed in as ${data.session.user.email || "Google user"}`;
  }

  signoutBtn.addEventListener("click", async () => {
    signoutBtn.disabled = true;
    const { error } = await client.auth.signOut();
    if (error) {
      signoutBtn.disabled = false;
      userLabel.textContent = `Sign-out failed: ${error.message}`;
      return;
    }
    window.location.replace("index.html");
  });

  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) window.location.replace("index.html");
  });

  requireSession();
})();

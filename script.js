/* Chlode Event Catering Services — GitHub Pages + Supabase */
(() => {
  "use strict";
  const cfg = window.CHLODE_CONFIG || {};
  const supabaseReady = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey &&
    !cfg.supabaseUrl.includes("YOUR_") && !cfg.supabaseAnonKey.includes("YOUR_") &&
    window.supabase && window.supabase.createClient);
  const db = supabaseReady ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const $ = (id) => document.getElementById(id);
  const defaultSettings = {
    tagline: "Chlode Event Catering Services is more than willing to cater to your preferences. So as we tag you on our timeline to HAVE IT YOUR WAY!",
    phone: "09989213529",
    email: "chloedeventcateringservices@gmail.com",
    facebook_url: "https://www.facebook.com/SheenaMNA#",
    address: "",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Chlode+Event+Catering+Services",
    google_reviews_url: "https://www.google.com/maps"
  };
  let currentSettings = {...defaultSettings};
  let currentReviews = [];
  let currentUser = null;

  const cleanText = (value) => String(value ?? "").trim();
  const setText = (id, value) => { if ($(id)) $(id).textContent = value; };
  const setLink = (id, value) => { if ($(id) && value) $(id).href = value; };

  function applySettings(s) {
    currentSettings = {...defaultSettings, ...(s || {})};
    setText("phone-text", currentSettings.phone || "Contact us");
    setText("email-text", currentSettings.email || "Email us");
    setText("address-text", currentSettings.address || "View location on Google Maps");
    setLink("phone-link", currentSettings.phone ? `tel:${currentSettings.phone.replace(/[^\d+]/g, "")}` : "#contact");
    setLink("email-link", currentSettings.email ? `mailto:${currentSettings.email}` : "#contact");
    setLink("facebook-link", currentSettings.facebook_url);
    setLink("map-link", currentSettings.maps_url);
    setLink("google-reviews-link", currentSettings.google_reviews_url);
    const heroLead = document.querySelector(".hero-lead");
    if (heroLead && currentSettings.tagline) heroLead.textContent = currentSettings.tagline;
    $("edit-tagline").value = currentSettings.tagline || "";
    $("edit-phone").value = currentSettings.phone || "";
    $("edit-email").value = currentSettings.email || "";
    $("edit-facebook").value = currentSettings.facebook_url || "";
    $("edit-address").value = currentSettings.address || "";
    $("edit-maps").value = currentSettings.maps_url || "";
    $("edit-reviews").value = currentSettings.google_reviews_url || "";
  }

  function renderReviews(reviews) {
    const list = $("review-list");
    if (!reviews.length) {
      list.innerHTML = `<div class="review-loading">Customer reviews will appear here when genuine feedback is published by the owner. <br><a class="text-link" href="${escapeAttr(currentSettings.google_reviews_url || defaultSettings.google_reviews_url)}" target="_blank" rel="noopener">View the business review page ↗</a></div>`;
      return;
    }
    list.innerHTML = reviews.map(r => {
      const rating = Math.max(1, Math.min(5, Number(r.rating) || 5));
      return `<article class="review-card"><div class="review-stars" aria-label="${rating} out of 5 stars">${"★".repeat(rating)}${"☆".repeat(5-rating)}</div><blockquote>“${escapeHtml(r.review_text)}”</blockquote><strong>${escapeHtml(r.reviewer_name)}</strong><small>${escapeHtml(r.source || "Customer feedback")}</small></article>`;
    }).join("");
  }
  function escapeHtml(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function escapeAttr(v) { return escapeHtml(v).replace(/`/g, "&#96;"); }

  async function loadPublicData() {
    applySettings(defaultSettings);
    if (!db) { renderReviews([]); return; }
    const [settingsRes, reviewsRes] = await Promise.all([
      db.from("business_settings").select("*").eq("id", 1).maybeSingle(),
      db.from("customer_reviews").select("id,reviewer_name,rating,review_text,source,created_at").eq("is_published", true).order("created_at", {ascending:false}).limit(12)
    ]);
    if (!settingsRes.error && settingsRes.data) applySettings(settingsRes.data);
    if (!reviewsRes.error && reviewsRes.data) currentReviews = reviewsRes.data;
    renderReviews(currentReviews);
  }

  function setStatus(message, isError = false) {
    const el = $("admin-status");
    if (el) { el.textContent = message; el.style.color = isError ? "#a91428" : "#2f7548"; }
  }
  function setReviewStatus(message, isError = false) {
    const el = $("review-status");
    if (el) { el.textContent = message; el.style.color = isError ? "#a91428" : "#2f7548"; }
  }
  function showModal(open) {
    $("admin-modal").classList.toggle("open", open);
    $("admin-modal").setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  function renderAdminReviews() {
    const wrap = $("admin-review-list");
    if (!wrap) return;
    if (!currentReviews.length) { wrap.innerHTML = "<p class='admin-intro'>No published reviews yet.</p>"; return; }
    wrap.innerHTML = "<h3>Published feedback</h3>" + currentReviews.map(r => `<div class="admin-review-row"><strong>${escapeHtml(r.reviewer_name)}</strong> · ${Number(r.rating)}★ <button type="button" data-delete-review="${escapeAttr(r.id)}">Delete</button><br>${escapeHtml(r.review_text)}</div>`).join("");
    wrap.querySelectorAll("[data-delete-review]").forEach(btn => btn.addEventListener("click", () => deleteReview(btn.dataset.deleteReview)));
  }
  async function loadAdminData() {
    if (!db) return;
    const {data: s} = await db.from("business_settings").select("*").eq("id", 1).maybeSingle();
    if (s) applySettings(s);
    const {data: reviews} = await db.from("customer_reviews").select("id,reviewer_name,rating,review_text,source,created_at").order("created_at", {ascending:false}).limit(50);
    currentReviews = reviews || [];
    renderAdminReviews();
    renderReviews(currentReviews.filter(r => r.is_published !== false));
  }
  function updateAuthView() {
    $("admin-login-form").hidden = Boolean(currentUser);
    $("admin-dashboard").hidden = !currentUser;
    $("admin-title").innerHTML = currentUser ? "Admin <em>dashboard</em>" : "Admin <em>login</em>";
  }

  $("admin-open").addEventListener("click", (e) => { e.preventDefault(); showModal(true); updateAuthView(); });
  $("admin-close").addEventListener("click", () => showModal(false));
  $("admin-modal").addEventListener("click", e => { if (e.target === $("admin-modal")) showModal(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { showModal(false); $("lightbox").classList.remove("open"); } });

  $("admin-login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!db) { setStatus("Supabase is not configured yet. Follow SETUP.md and edit config.js.", true); return; }
    setStatus("Signing in…");
    const {data, error} = await db.auth.signInWithPassword({email: $("admin-email").value.trim(), password: $("admin-password").value});
    if (error) { setStatus(error.message, true); return; }
    currentUser = data.user;
    setStatus("Signed in successfully.");
    updateAuthView();
    await loadAdminData();
  });
  $("admin-logout").addEventListener("click", async () => {
    if (db) await db.auth.signOut();
    currentUser = null;
    updateAuthView();
    setStatus("You have signed out.");
  });

  $("business-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!db || !currentUser) return;
    const payload = {
      id: 1,
      tagline: $("edit-tagline").value.trim(),
      phone: $("edit-phone").value.trim(),
      email: $("edit-email").value.trim(),
      facebook_url: $("edit-facebook").value.trim(),
      address: $("edit-address").value.trim(),
      maps_url: $("edit-maps").value.trim(),
      google_reviews_url: $("edit-reviews").value.trim(),
      updated_at: new Date().toISOString()
    };
    const {error} = await db.from("business_settings").upsert(payload, {onConflict:"id"});
    if (error) { setStatus(`Could not save details: ${error.message}`, true); return; }
    applySettings(payload);
    setStatus("Business details saved.");
  });

  $("review-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!db || !currentUser) return;
    const payload = {
      reviewer_name: $("review-name").value.trim(),
      rating: Number($("review-rating").value),
      review_text: $("review-text").value.trim(),
      source: "Customer feedback",
      is_published: true,
      created_by: currentUser.id
    };
    const {error} = await db.from("customer_reviews").insert(payload);
    if (error) { setReviewStatus(`Could not publish: ${error.message}`, true); return; }
    $("review-form").reset();
    setReviewStatus("Review published.");
    await loadAdminData();
  });
  async function deleteReview(id) {
    if (!db || !currentUser || !confirm("Delete this review from the website?")) return;
    const {error} = await db.from("customer_reviews").delete().eq("id", id);
    if (error) { setReviewStatus(error.message, true); return; }
    await loadAdminData();
  }

  $("inquiry-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      "Hello Chlode Event Catering Services! I would like to ask for a quotation.",
      "",
      `Name: ${f.get("name")}`,
      `Contact number: ${f.get("contact")}`,
      `Event date: ${f.get("date") || "Not decided yet"}`,
      `Celebration: ${f.get("event")}`,
      `Estimated guests: ${f.get("guests")}`,
      `Venue / city: ${f.get("venue") || "To be confirmed"}`,
      `Preferences: ${f.get("message") || "I'd like to discuss the options."}`
    ].join("\n");
    const messengerUrl = currentSettings.facebook_url;
    const mailto = `mailto:${encodeURIComponent(currentSettings.email || defaultSettings.email)}?subject=${encodeURIComponent("Event Catering Inquiry")}&body=${encodeURIComponent(body)}`;
    const chooseMessenger = confirm("OK to open the owner's Facebook page to message them. Cancel to open an email draft instead.");
    if (chooseMessenger) window.open(messengerUrl, "_blank", "noopener");
    else window.location.href = mailto;
    alert("Your inquiry details are prepared. Please paste the message into Messenger or review and send the email draft.");
  });

  $("menu-toggle").addEventListener("click", () => {
    const nav = $("main-nav");
    const open = nav.classList.toggle("open");
    $("menu-toggle").setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("#main-nav a").forEach(a => a.addEventListener("click", () => $("main-nav").classList.remove("open")));
  document.querySelectorAll(".gallery-item").forEach(btn => btn.addEventListener("click", () => {
    $("lightbox-image").src = btn.dataset.full;
    $("lightbox").classList.add("open");
    $("lightbox").setAttribute("aria-hidden", "false");
  }));
  $("lightbox-close").addEventListener("click", () => { $("lightbox").classList.remove("open"); $("lightbox").setAttribute("aria-hidden", "true"); });
  $("lightbox").addEventListener("click", e => { if (e.target === $("lightbox")) $("lightbox").classList.remove("open"); });
  $("year").textContent = new Date().getFullYear();

  if (db) {
    db.auth.getSession().then(({data}) => {
      currentUser = data.session?.user || null;
      updateAuthView();
    });
    db.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      updateAuthView();
    });
  } else updateAuthView();
  loadPublicData();
})();

// ---------- Mobile nav ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
});

// ---------- Field validation helpers ----------
function setFieldError(fieldEl, message) {
  const errorEl = fieldEl.querySelector('.error-msg');
  if (message) {
    fieldEl.classList.add('invalid');
    if (errorEl) errorEl.textContent = message;
  } else {
    fieldEl.classList.remove('invalid');
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ---------- Login form ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const emailField = document.getElementById('login-email-field');
    const emailInput = document.getElementById('login-email');
    if (!isEmail(emailInput.value.trim())) {
      setFieldError(emailField, 'Enter a valid email address.');
      valid = false;
    } else {
      setFieldError(emailField, null);
    }

    const pwField = document.getElementById('login-password-field');
    const pwInput = document.getElementById('login-password');
    if (pwInput.value.length < 6) {
      setFieldError(pwField, 'Password must be at least 6 characters.');
      valid = false;
    } else {
      setFieldError(pwField, null);
    }

    if (valid) {
      const banner = document.getElementById('login-success');
      banner.classList.add('show');
      banner.textContent = 'Signed in. Taking you to your dashboard \u2026';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
    }
  });
}

// ---------- Register form ----------
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameField = document.getElementById('reg-name-field');
    const nameInput = document.getElementById('reg-name');
    if (nameInput.value.trim().length < 2) {
      setFieldError(nameField, 'Enter your name.');
      valid = false;
    } else {
      setFieldError(nameField, null);
    }

    const emailField = document.getElementById('reg-email-field');
    const emailInput = document.getElementById('reg-email');
    if (!isEmail(emailInput.value.trim())) {
      setFieldError(emailField, 'Enter a valid email address.');
      valid = false;
    } else {
      setFieldError(emailField, null);
    }

    const pwField = document.getElementById('reg-password-field');
    const pwInput = document.getElementById('reg-password');
    if (pwInput.value.length < 6) {
      setFieldError(pwField, 'Password must be at least 6 characters.');
      valid = false;
    } else {
      setFieldError(pwField, null);
    }

    const confirmField = document.getElementById('reg-confirm-field');
    const confirmInput = document.getElementById('reg-confirm');
    if (confirmInput.value !== pwInput.value || confirmInput.value === '') {
      setFieldError(confirmField, 'Passwords do not match.');
      valid = false;
    } else {
      setFieldError(confirmField, null);
    }

    if (valid) {
      const banner = document.getElementById('register-success');
      banner.classList.add('show');
      banner.textContent = 'Account created. Taking you to sign in \u2026';
      setTimeout(() => { window.location.href = 'login.html'; }, 800);
    }
  });
}

// ---------- Dashboard: filter tabs + row delete (demo data, in-memory only) ----------
const filterTabs = document.querySelectorAll('.filter-tabs button');
if (filterTabs.length) {
  const rows = document.querySelectorAll('.post-table tbody tr');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const status = tab.dataset.status;
      rows.forEach((row) => {
        if (status === 'all' || row.dataset.status === status) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.row-actions [data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      row.style.opacity = '0';
      row.style.transition = 'opacity 0.2s ease';
      setTimeout(() => row.remove(), 200);
    });
  });
}

// ---------- Create blog: live preview + word count ----------
const editorTitle = document.getElementById('post-title');
const editorBody = document.getElementById('post-body');
const editorTag = document.getElementById('post-tag');

if (editorBody) {
  const previewTitle = document.getElementById('preview-title');
  const previewBody = document.getElementById('preview-body');
  const previewTag = document.getElementById('preview-tag');
  const previewEmpty = document.getElementById('preview-empty');
  const wordCountEl = document.getElementById('word-count');

  function updatePreview() {
    const title = editorTitle.value.trim();
    const body = editorBody.value.trim();
    const tag = editorTag.value.trim();

    if (!title && !body) {
      previewEmpty.style.display = 'block';
      previewTitle.parentElement.style.display = 'none';
    } else {
      previewEmpty.style.display = 'none';
      previewTitle.parentElement.style.display = 'block';
      previewTitle.textContent = title || 'Untitled post';
      previewBody.textContent = body || 'Start writing to see your draft take shape here.';
      previewTag.textContent = tag ? tag.toUpperCase() : 'UNTAGGED';
    }

    const words = body.length ? body.trim().split(/\s+/).length : 0;
    wordCountEl.textContent = words + (words === 1 ? ' word' : ' words');
  }

  [editorTitle, editorBody, editorTag].forEach((el) => el && el.addEventListener('input', updatePreview));
  updatePreview();
}

const createForm = document.getElementById('create-blog-form');
if (createForm) {
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const titleField = document.getElementById('post-title-field');
    if (editorTitle.value.trim().length < 3) {
      setFieldError(titleField, 'Give your post a title (3+ characters).');
      valid = false;
    } else {
      setFieldError(titleField, null);
    }

    const bodyField = document.getElementById('post-body-field');
    if (editorBody.value.trim().length < 20) {
      setFieldError(bodyField, 'Write at least a few sentences before publishing.');
      valid = false;
    } else {
      setFieldError(bodyField, null);
    }

    if (valid) {
      const banner = document.getElementById('create-success');
      banner.classList.add('show');
      banner.textContent = 'Post saved. Redirecting to your dashboard \u2026';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    }
  });
}

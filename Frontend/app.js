// Change this to your deployed API URL after deployment
const API_URL = 'http://https://portfolio-api-9mr5.onrender.com/api/portfolio';

const form = document.getElementById('portfolio-form');
const tableBody = document.getElementById('table-body');
const messageBox = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

const fields = ['owner_name', 'title', 'bio', 'skills', 'email', 'website_url', 'location'];

let records = [];

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type;
  setTimeout(() => { messageBox.className = ''; messageBox.textContent = ''; }, 4000);
}

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// READ: load and show all records
async function loadRecords() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to load records');
    records = await res.json();
    renderTable();
  } catch (err) {
    tableBody.innerHTML = '<tr><td colspan="8">Could not load data. Is the API running?</td></tr>';
    showMessage(err.message, 'error');
  }
}

function renderTable() {
  if (records.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8">No records yet.</td></tr>';
    return;
  }
  tableBody.innerHTML = records.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${escapeHtml(r.owner_name)}</td>
      <td>${escapeHtml(r.title)}</td>
      <td>${escapeHtml(r.skills)}</td>
      <td>${escapeHtml(r.email)}</td>
      <td>${r.website_url ? `<a href="${escapeHtml(r.website_url)}" target="_blank" rel="noopener">Visit</a>` : ''}</td>
      <td>${escapeHtml(r.location)}</td>
      <td class="row-actions">
        <button class="btn-edit" data-action="edit" data-id="${r.id}">Edit</button>
        <button class="btn-delete" data-action="delete" data-id="${r.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function getFormData() {
  const data = {};
  fields.forEach(f => { data[f] = document.getElementById(f).value.trim(); });
  return data;
}

function resetForm() {
  form.reset();
  document.getElementById('record-id').value = '';
  formTitle.textContent = 'Add a portfolio';
  submitBtn.textContent = 'Add portfolio';
  cancelBtn.style.display = 'none';
}

// CREATE or UPDATE
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('record-id').value;
  const data = getFormData();

  try {
    const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');

    showMessage(id ? 'Record updated' : 'Record created', 'success');
    resetForm();
    await loadRecords();
  } catch (err) {
    showMessage(err.message, 'error');
  }
});

// Edit and Delete buttons (event delegation)
tableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;

  if (btn.dataset.action === 'edit') {
    const record = records.find(r => String(r.id) === id);
    if (!record) return;
    fields.forEach(f => { document.getElementById(f).value = record[f] || ''; });
    document.getElementById('record-id').value = record.id;
    formTitle.textContent = `Edit portfolio #${record.id}`;
    submitBtn.textContent = 'Save changes';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btn.dataset.action === 'delete') {
    if (!confirm('Delete this record?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Delete failed');
      showMessage('Record deleted', 'success');
      await loadRecords();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  }
});

cancelBtn.addEventListener('click', resetForm);

loadRecords();

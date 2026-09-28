const API_URL = "http://localhost:5288/api/Salud";

// ─── TOAST ───────────────────────────────────
function showToast(msg, type = "success") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = `toast ${type === "error" ? "error" : ""} show`;
    setTimeout(() => t.classList.remove("show"), 3000);
}

// ─── CARGAR MEDICAMENTOS ──────────────────────
async function cargarMeds() {
    const container = document.getElementById("lista-meds");
    try {
        const res  = await fetch(API_URL);
        if (!res.ok) throw new Error("Error del servidor");
        const data = await res.json();
        container.innerHTML = "";

        if (!data.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💊</div>
                    <h3>Sin medicamentos hoy</h3>
                    <p>Agrega tu primer recordatorio arriba</p>
                </div>`;
            return;
        }

        data.forEach(m => {
            const hora = formatHora(m.horario);
            container.innerHTML += `
                <div class="med-card ${m.tomado ? "done" : ""}" id="med-${m.id}">
                    <span class="med-icon">💊</span>
                    <h3>${escapeHTML(m.nombre)}</h3>
                    <p>${escapeHTML(m.dosis)} · ${hora}</p>
                    <button
                        class="btn-status ${m.tomado ? "done" : "pending"}"
                        onclick="toggleEstado(${m.id}, this)">
                        ${m.tomado ? "✅ Tomado" : "🔔 Pendiente"}
                    </button>
                </div>`;
        });
    } catch (err) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>No se pudo conectar</h3>
                <p>Verifica que el servidor esté activo en ${API_URL}</p>
            </div>`;
        console.error("Error al cargar:", err);
    }
}

// ─── AGREGAR MEDICAMENTO ──────────────────────
async function agregarMedicamento() {
    const nombre  = document.getElementById("nombre").value.trim();
    const dosis   = document.getElementById("dosis").value.trim();
    const horario = document.getElementById("horario").value;

    if (!nombre || !dosis || !horario) {
        showToast("⚠️ Completa todos los campos", "error");
        return;
    }

    const btn = document.querySelector(".btn-search");
    btn.textContent = "Guardando…";
    btn.disabled = true;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, dosis, horario, tomado: false }),
        });
        if (!res.ok) throw new Error();

        // Limpiar campos
        document.getElementById("nombre").value  = "";
        document.getElementById("dosis").value   = "";
        document.getElementById("horario").value = "";

        showToast("✅ Medicamento agregado correctamente");
        await cargarMeds();
    } catch {
        showToast("❌ Error al guardar. Intenta de nuevo.", "error");
    } finally {
        btn.textContent = "+ Agregar";
        btn.disabled = false;
    }
}

// ─── TOGGLE ESTADO ────────────────────────────
async function toggleEstado(id, btnEl) {
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "PUT" });
        if (!res.ok) throw new Error();
        await cargarMeds();
        showToast("Estado actualizado");
    } catch {
        showToast("❌ Error al actualizar", "error");
    }
}

// ─── HAMBURGER MENU ───────────────────────────
function toggleMenu() {
    const links = document.querySelector(".nav-links");
    const isOpen = links.style.display === "flex";
    links.style.cssText = isOpen
        ? ""
        : `display:flex; flex-direction:column; position:absolute;
           top:72px; left:0; right:0; background:white; padding:20px 7%;
           border-bottom:1px solid var(--border); gap:6px; z-index:300;`;
}

// ─── HELPERS ──────────────────────────────────
function escapeHTML(str) {
    return String(str)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function formatHora(h) {
    if (!h) return "—";
    const [hour, min] = h.split(":");
    const hNum = parseInt(hour);
    const ampm = hNum >= 12 ? "PM" : "AM";
    const h12  = hNum % 12 || 12;
    return `${h12}:${min} ${ampm}`;
}

// ─── INIT ─────────────────────────────────────
cargarMeds();
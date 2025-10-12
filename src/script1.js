document.addEventListener("DOMContentLoaded", () => {
      const toggle = document.createElement("button");
      toggle.className = "navbar-toggle";
      toggle.innerHTML = "☰";
      document.querySelector(".navbar").prepend(toggle);

      toggle.addEventListener("click", () => {
        const menu = document.querySelector(".navbar div:last-child");
        menu.classList.toggle("active");
        toggle.innerHTML = menu.classList.contains("active") ? "✕" : "☰";
      });
});




// Load the modal into this page dynamically
fetch("modal.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("modal-container").innerHTML = html;
    setupGlobalModal();
  });

function setupGlobalModal() {
  const modal = document.getElementById("global-modal");
  const closeBtn = modal.querySelector(".close-modal-btn");

  // Handle ALL modal open buttons
  document.querySelectorAll(".open-modal-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // stops <a> from reloading page
      modal.style.display = "flex";
    });
  });

  // Close modal when clicking X
  closeBtn.onclick = () => modal.style.display = "none";

  // Close modal when clicking outside
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  const categorySelect = document.getElementById('category');
  const customInput = document.getElementById('custom-category');

  categorySelect.addEventListener('change', () => {
    if (categorySelect.value === 'other') {
      customInput.style.display = 'block';
    } else {
      customInput.style.display = 'none';
    }
  });

}



import {initializeDashboard} from './dashboard-script.js'
import {loadRecords} from './record-script.js'

// logic for the hamburger menu 
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


// Load modal when user clic the open-modal-btn only 
document.querySelectorAll(".open-modal-btn").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const modalContainer = document.getElementById("modal-container");

    // Load modal only if not already loaded
    if (!document.getElementById("global-modal")) {
      const res = await fetch("modal.html");
      const html = await res.text();
      modalContainer.innerHTML = html;
      setupGlobalModal();
    }

    
    document.getElementById("global-modal").style.display = "flex";
  });
});

function setupGlobalModal() {
  const modal = document.getElementById("global-modal");
  const closeBtn = modal.querySelector(".close-modal-btn");
  const select = modal.querySelector("#category");
  const customInput = modal.querySelector("#custom-category");
  const form = modal.querySelector("form");

  // function for the alerts 
  function showAlert(message, type = 'success') {
    // Remove any existing alert
    const oldAlert = modal.querySelector('.alert');
    if (oldAlert) oldAlert.remove();

    // Create the alert div
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = message;

    // Insert alert before the form
    modal.querySelector('.modal-content').insertBefore(alertDiv, form);

    // Auto remove after 3 seconds
    setTimeout(() => alertDiv.remove(), 3000);
  }

  // Handle "Other" option when user wants custom category
  select.addEventListener("change", () => {
    if (select.value === "other") {
      customInput.style.display = "block";
      customInput.required = true; 
      
    } else {
      customInput.style.display = "none";
      customInput.required = false;
      customInput.value = "";
    }
  });


  let dictData = { }


  // { id: "rec_0001", 
  // description: "Lunch at cafeteria", 
  //  or title amount: 12.50, //
  //  or duration/pages for other themes category: "Food",
  // or tag date: "2025-09-29", createdAt: "...", updatedAt: "..." }


  // Basic regex validation for the form 
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const desc = form.querySelector("#description").value.trim();
    const amount = form.querySelector("#amount").value.trim();
    const category = form.querySelector("#category")
    const date = form.querySelector("#date")

    let flag = true

    // Regex patterns
    const descRegex = /^[A-Za-z\s]{3,}$/; // any data that is greater than 3 characters is valid
    const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // any number followed by a . but the characters must be 1 or 2 but its optional

    if (!descRegex.test(desc)) {
      const error_message = document.querySelector("#hint-desc")
      error_message.textContent = "Description must be at least 3 letters"
      error_message.style.color = "red"
      flag = false
      return;
    }

    if (!amountRegex.test(amount) || parseFloat(amount) <= 0) {
      const error_message_amount = document.querySelector("#amount")
      error_message_amount.textContent = "Please enter a valid positive number for amount."
      error_message_amount.style.color = "red"
      flag = false
      return;
    }

    //if (!desc.value.length == 0 && !amount.value.length ==0 && )
    
    function createRecord ( id, description, amount, category, date, createdAt ) {
      return { 
        id,
        description,
        amount,
        category,
        date,
        createdAt: createdAt || new Date().toISOString() 

      };
    }

    // Initialize or load existing records
    let records = JSON.parse(localStorage.getItem('records')) || [];

    // Function to add new record from user input
    function addRecordFromUser(description, amount, category, date) {
      // Generate unique ID
      const newId = `rec_${String(records.length + 1).padStart(4, '0')}`;
      
      // Create new record
      const newRecord = createRecord(
        newId,
        description,
        parseFloat(amount),
        category,
        date,
        new Date().toISOString()
      );
      
      // Add to records array
      records.push(newRecord);
      
      // Save to localStorage
      saveToLocalStorage();
      
      return newRecord;
    }

    // Save to localStorage
    function saveToLocalStorage() {
      localStorage.setItem('records', JSON.stringify(records));
    }

    // Load from localStorage
    function loadFromLocalStorage() {
      const stored = localStorage.getItem('records');
      records = stored ? JSON.parse(stored) : [];
      console.log(records)
      return records;
    }

    // Clear all records
    function clearRecords() {
      records = [];
      localStorage.removeItem('records');
    }

    if (flag) {

      addRecordFromUser(desc,amount,category.value,date.value)
    }


    showAlert("Record saved successfully!", "success");
    initializeDashboard();
    loadRecords();


    form.reset();

    setTimeout(() => {
      modal.style.display = "none";
    }, 2500);
    
  });

  // Close modal
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}





const tableBody = document.querySelector("table tbody");

// Load all records currently in the local storage
function loadFromLocalStorage() {
    const stored = localStorage.getItem("records");
    return stored ? JSON.parse(stored) : [];
}

function saveToLocalStorage(records) {
    localStorage.setItem("records", JSON.stringify(records));
}

function loadTable() {
    const tableBody = document.querySelector("table tbody");

    let records = loadFromLocalStorage();
    
    // If table body doesn't exist, exit early
    if (!tableBody) {
        console.error("Table body not found");
        return;
    }

    // Clear existing rows
    tableBody.innerHTML = '';
 
    

    // If no records, show empty message
    if (records.length === 0) {
        const emptyRow = tableBody.insertRow();
        const emptyCell = emptyRow.insertCell();
        emptyCell.colSpan = 5;
        emptyCell.textContent = 'No records found';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '40px';
        emptyCell.style.color = 'var(--muted-foreground)';
        emptyCell.style.fontStyle = 'italic';
        return;
    }

    // Add each record as a row
    for (let record of records) {
        const newRow = tableBody.insertRow();
        
        // Add cells for each data field
        const dateCell = newRow.insertCell();
        const descriptionCell = newRow.insertCell();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const actionsCell = newRow.insertCell();

        // Fill cells with data
        dateCell.textContent = formatDate(record.date);
        descriptionCell.textContent = record.description || 'No description';
        categoryCell.textContent = record.category || 'Uncategorized';
        
        // Format amount with currency
        const baseCurrency = localStorage.getItem("baseCurrency") || "$";
        amountCell.textContent = `${baseCurrency}${parseFloat(record.amount || 0).toFixed(2)}`;
        amountCell.style.fontWeight = '500';

        // Add action buttons
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-row';
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pen open-modal-btn';
        editIcon.style.cursor = 'pointer';
        editIcon.style.color = 'var(--primary)';
        editIcon.title = 'Edit record';
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash';
        deleteIcon.style.cursor = 'pointer';
        deleteIcon.style.color = 'var(--destructive)';
        deleteIcon.title = 'Delete record';

        // Add event listeners for actions
        editIcon.addEventListener('click', () => editRecord(record.id));
        deleteIcon.addEventListener('click', () => deleteRecord(record.id));

        actionDiv.appendChild(editIcon);
        actionDiv.appendChild(deleteIcon);
        actionsCell.appendChild(actionDiv);
    }
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'No date';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString; // Return original if parsing fails
    }
}

// Function to delete a record
function deleteRecord(recordId) {
    if (confirm('Are you sure you want to delete this record?')) {
        let records = loadFromLocalStorage();
        records = records.filter(record => record.id !== recordId);
        saveToLocalStorage(records);
        loadTable(); 
    }
}

// Function to edit a record
function editRecord(recordId) {
    openModal(recordId);
}

// Modal Creation 
function createGlobalModal(recordId = null) {
    const modal = document.createElement("div");
    modal.id = "global-modal";
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Close button
    const closeBtn = document.createElement("span");
    closeBtn.className = "close-modal-btn";
    closeBtn.innerHTML = "&times;";

    // Heading
    const heading = document.createElement("h2");
    heading.textContent = recordId ? "Edit Record" : "Add New Record";

    // Form
    const form = document.createElement("form");

    // Description Field 
    const labelDesc = document.createElement("label");
    labelDesc.setAttribute("for", "description");
    labelDesc.innerHTML = 'Description <span style="color:red">*</span>';
    const inputDesc = document.createElement("input");
    inputDesc.type = "text";
    inputDesc.id = "description";
    inputDesc.name = "description";
    inputDesc.required = true;
    inputDesc.placeholder = "e.g., Groceries";
    const hintDesc = document.createElement("p");
    hintDesc.id = "hint-desc";
    hintDesc.textContent = "Minimum 3 characters";

    // Amount Field
    const labelAmount = document.createElement("label");
    labelAmount.setAttribute("for", "amount");
    labelAmount.innerHTML = 'Amount <span style="color:red">*</span>';
    const inputAmount = document.createElement("input");
    inputAmount.type = "number";
    inputAmount.id = "amount";
    inputAmount.name = "amount";
    inputAmount.required = true;
    inputAmount.placeholder = "0.00";
    inputAmount.step = "0.01";
    inputAmount.min = "0";
    const hintAmount = document.createElement("p");
    hintAmount.className = "hint-amount";
    hintAmount.textContent = "Enter a positive number";

    // Category Field 
    const labelCategory = document.createElement("label");
    labelCategory.setAttribute("for", "category");
    labelCategory.innerHTML = 'Category <span style="color:red">*</span>';

    const selectCategory = document.createElement("select");
    selectCategory.id = "category";
    selectCategory.name = "category";

    const categories = [
        "food",
        "book",
        "transport",
        "entertainment",
        "fees",
        "other",
    ];
    categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        selectCategory.appendChild(option);
    });

    const customCategory = document.createElement("input");
    customCategory.type = "text";
    customCategory.id = "custom-category";
    customCategory.placeholder = "Enter custom category";
    customCategory.style.display = "none";

    // Date Field
    const labelDate = document.createElement("label");
    labelDate.setAttribute("for", "date");
    labelDate.innerHTML = 'Date <span style="color:red">*</span>';
    const inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.id = "date";
    inputDate.name = "date";
    inputDate.required = true;
    const hintDate = document.createElement("p");
    hintDate.className = "hint";
    hintDate.textContent = "Format: YYYY-MM-DD";

    // Hidden field for record ID
    const recordIdInput = document.createElement("input");
    recordIdInput.type = "hidden";
    recordIdInput.id = "record-id";
    recordIdInput.value = recordId || '';

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "form-buttons";

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.textContent = recordId ? "Update Record" : "Save Record";

    buttonContainer.appendChild(saveBtn);

    // Assemble form
    form.append(
        labelDesc,
        inputDesc,
        hintDesc,
        labelAmount,
        inputAmount,
        hintAmount,
        labelCategory,
        selectCategory,
        customCategory,
        labelDate,
        inputDate,
        hintDate,
        recordIdInput,
        buttonContainer
    );

    // Assemble modal
    modalContent.append(closeBtn, heading, form);
    modal.appendChild(modalContent);
    document.getElementById("modal-container").appendChild(modal);

    // Behavior
    closeBtn.addEventListener("click", () => closeModal(modal));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
    });

    // Show custom category field when "Other" is selected
    selectCategory.addEventListener("change", () => {
        if (selectCategory.value === "other") {
            customCategory.style.display = "block";
            customCategory.required = true;
        } else {
            customCategory.style.display = "none";
            customCategory.required = false;
        }
    });

    // Load record data if editing
    if (recordId) {
        loadRecordData(recordId, inputDesc, inputAmount, selectCategory, customCategory, inputDate);
    }

    // Form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        saveRecord(form, modal);
    });

    return modal;
}

// Load record data into form for editing
function loadRecordData(recordId, descInput, amountInput, categorySelect, customCategoryInput, dateInput) {
    const records = loadFromLocalStorage();
    const record = records.find(r => r.id === recordId);
    
    if (record) {
        descInput.value = record.description || '';
        amountInput.value = record.amount || '';
        
        // Set category
        if (record.category && !categorySelect.querySelector(`option[value="${record.category}"]`)) {
            // Custom category
            categorySelect.value = "other";
            customCategoryInput.style.display = "block";
            customCategoryInput.value = record.category;
        } else {
            categorySelect.value = record.category || 'food';
        }
        
        // Format date for input[type="date"]
        if (record.date) {
            const date = new Date(record.date);
            dateInput.value = date.toISOString().split('T')[0];
        }
    }
}

// Save record (both new and edit)
function saveRecord(form, modal) {
    const recordId = document.getElementById("record-id").value;
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const categorySelect = document.getElementById("category");
    const customCategory = document.getElementById("custom-category");
    const date = document.getElementById("date").value;

    // Validate required fields
    if (!description || !amount || !date) {
        alert("Please fill in all required fields");
        return;
    }

    // Determine category
    let category = categorySelect.value;
    if (category === "other" && customCategory.value.trim()) {
        category = customCategory.value.trim();
    }

    let records = loadFromLocalStorage();
    
    if (recordId) {
        // Update existing record
        const recordIndex = records.findIndex(r => r.id === recordId);
        if (recordIndex !== -1) {
            records[recordIndex] = {
                ...records[recordIndex],
                description,
                amount,
                category,
                date
            };
        }
    } else {
        // Create new record
        const newRecord = {
            id: Date.now().toString(),
            description,
            amount,
            category,
            date
        };
        records.push(newRecord);
    }

    saveToLocalStorage(records);
    
    // Show success message
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-success";
    alertDiv.textContent = recordId ? "Record updated successfully!" : "Record saved successfully!";
    modal.querySelector(".modal-content").insertBefore(alertDiv, form);
    
    setTimeout(() => {
        closeModal(modal);
        loadTable();
    }, 1200);
}

// Modal Helpers
function openModal(recordId = null) {
    // Close any existing modal
    const existingModal = document.getElementById("global-modal");
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = createGlobalModal(recordId);
    modal.style.display = "flex";
}

function closeModal(modal) {
    modal.style.display = "none";
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 300);
}

// Enhanced Search with Regex
function setupSearch() {
    const searchInput = document.getElementById('search');
    const searchSpan = document.querySelector('#search-div span');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim();
            filterTable(searchTerm, searchSpan);
        });
    }
}

// Safe Regex Compiler
function safeRegexCompile(pattern, caseInsensitive = false) {
    try {
        const flags = caseInsensitive ? 'gi' : 'g';
        return new RegExp(pattern, flags);
    } catch (error) {
        return null;
    }
}

// Highlight text with matches
function highlightText(text, regex) {
    if (!regex) return text;
    
    return text.replace(regex, (match) => {
        return `<mark>${match}</mark>`;
    });
}

// Filter table with regex search and highlighting
function filterTable(searchTerm, statusSpan) {
    const rows = tableBody.getElementsByTagName('tr');
    let regex = null;
    let errorMessage = '';

    // Clear previous status
    statusSpan.textContent = '';
    statusSpan.className = '';

    if (searchTerm) {
        // Test for predefined patterns
        if (searchTerm === 'cents') {
            regex = safeRegexCompile('\\.\\d{2}\\b');
        } else if (searchTerm === 'beverage') {
            regex = safeRegexCompile('(coffee|tea)', true);
        } else if (searchTerm === 'duplicate') {
            regex = safeRegexCompile('\\b(\\w+)\\s+\\1\\b');
        } else {
            // Try to compile as custom regex
            regex = safeRegexCompile(searchTerm, true);
        }

        if (!regex) {
            errorMessage = 'Invalid regex pattern';
            statusSpan.textContent = errorMessage;
            statusSpan.style.color = 'var(--destructive)';
        } else {
            statusSpan.textContent = `Pattern: ${regex}`;
            statusSpan.style.color = 'var(--success)';
        }
    }

    let visibleCount = 0;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        
        // Skip if this is the empty state row
        if (cells.length === 1) {
            rows[i].style.display = searchTerm ? 'none' : '';
            if (!searchTerm) visibleCount++;
            continue;
        }
        
        let found = !searchTerm; // Show all if no search term
        
        if (searchTerm && regex) {
            found = false;
            
            // Check each cell except actions
            for (let j = 0; j < cells.length - 1; j++) {
                const originalText = cells[j].textContent;
                if (regex.test(originalText)) {
                    found = true;
                    
                    // Highlight matches
                    const highlightedHTML = highlightText(originalText, regex);
                    if (highlightedHTML !== originalText) {
                        cells[j].innerHTML = highlightedHTML;
                    }
                } else {
                    // Reset to original text if no match
                    cells[j].textContent = originalText;
                }
            }
        } else if (searchTerm && !regex) {
            // Simple text search as fallback
            found = false;
            for (let j = 0; j < cells.length - 1; j++) {
                if (cells[j].textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                    found = true;
                    break;
                }
            }
        }
        
        rows[i].style.display = found ? '' : 'none';
        if (found) visibleCount++;
    }

    // Update search status
    if (searchTerm && !errorMessage) {
        statusSpan.textContent += ` | Found: ${visibleCount} record(s)`;
    }
}

// Sorting functionality
function setupSorting() {
    const headers = document.querySelectorAll('thead th');
    
    headers.forEach((header, index) => {
        if (index < 4) { // Only make Date, Description, Category, Amount sortable
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                sortTable(index, header);
            });
        }
    });
}

function sortTable(columnIndex, header) {
    const records = loadFromLocalStorage();
    if (records.length === 0) return;

    // Remove existing sort indicators
    document.querySelectorAll('thead th').forEach(th => {
        th.textContent = th.textContent.replace(' ↑', '').replace(' ↓', '');
    });

    // Get current header text without sort indicator
    const baseText = header.textContent.replace(' ↑', '').replace(' ↓', '');
    
    // Determine sort direction
    let direction = 'asc';
    if (header.textContent.includes(' ↑')) {
        direction = 'desc';
    } else if (header.textContent.includes(' ↓')) {
        direction = 'asc';
    }

    // Sort records
    records.sort((a, b) => {
        let valueA, valueB;

        switch (columnIndex) {
            case 0: // Date
                valueA = new Date(a.date);
                valueB = new Date(b.date);
                break;
            case 1: // Description
                valueA = a.description?.toLowerCase() || '';
                valueB = b.description?.toLowerCase() || '';
                break;
            case 2: // Category
                valueA = a.category?.toLowerCase() || '';
                valueB = b.category?.toLowerCase() || '';
                break;
            case 3: // Amount
                valueA = parseFloat(a.amount) || 0;
                valueB = parseFloat(b.amount) || 0;
                break;
            default:
                return 0;
        }

        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Update header with sort indicator
    header.textContent = baseText + (direction === 'asc' ? ' ↑' : ' ↓');

    saveToLocalStorage(records);
    loadTable();
    
    // Reapply current search filter if any
    const searchInput = document.getElementById('search');
    if (searchInput && searchInput.value) {
        filterTable(searchInput.value, document.querySelector('#search-div span'));
    }
}

// Add event listener for "Add New Record" button
function setupAddRecordButton() {
    const addButton = document.querySelector('.open-modal-btn');
    if (addButton) {
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
}

export function loadRecords() {
    setTimeout(() => {
    loadTable();
    setupSearch();
    setupSorting();
    setupAddRecordButton()},100)
}
// Initialize everything when page loads
document.addEventListener('DOMContentLoaded',loadRecords)
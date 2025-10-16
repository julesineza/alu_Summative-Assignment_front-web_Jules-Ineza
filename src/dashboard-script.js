
// variable definition 
const total_records = document.querySelector("#total_records");
const total_spent = document.querySelector("#total_spent");
const remaining_html = document.querySelector("#remaining");
const cap_status = document.querySelector("#subtitle_remainig")
const topCategory_html = document.querySelector(".category-name");
const topCategoryAmount = document.querySelector(".category-amount");
const category_percentage =document.querySelector(".category-percentage")
const budget_status_text = document.querySelector("#budget-status")
const message_progress_bar = document.querySelector("#message_progress_bar")
const progress_fill = document.querySelector(".progress-fill")
const weeklyChartBars = document.querySelectorAll('.chart-bar');

// load all records currently in the local storage
function loadFromLocalStorage() {
    const stored = localStorage.getItem("records");
    records = stored ? JSON.parse(stored) : [];
    return records;
}

// get track and status message of the budget 
function getTrack (html_div) {
    let total = getTotalSpent();
    let spendingCap = localStorage.getItem("spendingCap");
    let amount = spendingCap-total

    if (total > spendingCap) {
        html_div.textContent = "Over Budget"
        html_div.style.color = "red"
    }
    else {
        html_div.textContent = "Within budget"
        html_div.style.color = "green"
    }

}


function getTotalRecords() {
    let records = loadFromLocalStorage();
    total_records.textContent = records.length || "0";
    }

    function getTotalSpent() {
    let records = loadFromLocalStorage();
    let total = 0;
    for (let record of records) {
        if (record.amount !== null && record.amount !== undefined) {
        total = total + record.amount;
        }
    }
    return total;
    //total_spent.textContent = total.toLocaleString("en");
}

// function to get remainig amount of the spending Cap
function getRemaining() {
    let total = getTotalSpent();
    let spendingCap = localStorage.getItem("spendingCap");
    let amount = spendingCap-total

    // call get track to get the status 
    getTrack(cap_status)

    remaining_html.textContent =
        amount.toLocaleString("en") || "[remainig]";
}

// top catory most spent on
function getTopCategory() {
    let records = loadFromLocalStorage();
    let stats = {};

    for (let item of records) {
        let cat = item.category;
        if (!stats[cat]) {
        stats[cat] = { count: 0, total: 0 };
        }
        stats[cat].count += 1;
        stats[cat].total += item.amount;
    }

    let topCategory = null;
    let maxCount = 0;
    console.log(stats)

    for (let cat in stats) {
        if (stats[cat].count > maxCount) {
        maxCount = stats[cat].total;
        topCategory = cat;
        }
    }
    topCategory_html.textContent = topCategory;
    topCategoryAmount.textContent = maxCount.toLocaleString("en");
}

// for getting the [Top Category Percent]% of total spending
function getStats() {
    let records = loadFromLocalStorage();
    const stats = {};
    let totalSpending = 0;

    for (const item of records) {
        if (!item.category) continue;
        const cat = item.category.trim();
        const amount = Number(item.amount) || 0;

        totalSpending += amount;
        if (!stats[cat]) stats[cat] = 0;
        stats[cat] += amount;
    }

    // Find top category by total amount
    let topCategory = null;
    let topTotal = 0;

    for (const cat in stats) {
        if (stats[cat] > topTotal) {
        topCategory = cat;
        topTotal = stats[cat];
        }
    }

    // Calculate percent
    const percent = totalSpending ? ((topTotal / totalSpending) * 100).toFixed(2) : 0;

    category_percentage.textContent= percent + "%"
}

// function for the progress bar 
function progressBar() {
    getTrack(budget_status_text);
    let total = getTotalSpent();
    let spendingCap = parseFloat(localStorage.getItem("spendingCap")) || 0;
    let amount = spendingCap - total;
    const baseCurrency = localStorage.getItem("baseCurrency") || "$";
    
    // Calculate progress percentage
    let progressPercent = 0;
    if (spendingCap > 0) {
        progressPercent = (total / spendingCap) * 100;
        // Cap at 100% if over budget
        progressPercent = Math.min(progressPercent, 100);
    }

    // Update progress bar width
    if (progress_fill) {
        progress_fill.style.width = progressPercent + "%";
        
        // Change color based on progress
        if (progressPercent >= 100) {
            progress_fill.style.backgroundColor = "#ef4444"; // Red when over budget
        } else if (progressPercent >= 80) {
            progress_fill.style.backgroundColor = "#f59e0b"; // Orange when close to limit
        } else {
            progress_fill.style.backgroundColor = "#10b981"; // Green when within budget
        }
    }

    // Update the progress percentage in the subtitle
    const progressSubtitle = document.querySelector(".stats-subtitle");
    if (progressSubtitle) {
        progressSubtitle.textContent = progressPercent.toFixed(1) + "% of cap";
    }

    if (amount < 1) {
        amount = 0;
    }
    message_progress_bar.textContent = "You have " + amount.toLocaleString("en") + baseCurrency + " " + "remaining";
}

// function to calculate weekly spending
function getWeeklySpending() {
    let records = loadFromLocalStorage();
    const weeklyData = {
        'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 
        'Fri': 0, 'Sat': 0, 'Sun': 0
    };

    // Get dates for the last 7 days
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    records.forEach(record => {
        if (!record.date) return;
        
        const recordDate = new Date(record.date);
        
        // Check if record is from the last 7 days
        if (recordDate >= lastWeek && recordDate <= today) {
            const dayName = getDayName(recordDate);
            const amount = Number(record.amount) || 0;
            weeklyData[dayName] += amount;
        }
    });

    return weeklyData;
}

// Helper function to get day name
function getDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

// Function to update the chart visually
function updateWeeklyChart() {
    const weeklyData = getWeeklySpending();
    const amounts = Object.values(weeklyData);
    const maxAmount = Math.max(...amounts, 1); 
    
    weeklyChartBars.forEach(bar => {
        const day = bar.getAttribute('data-day');
        const amount = weeklyData[day] || 0;
        const percentage = (amount / maxAmount) * 100;
        
        // Update bar height
        bar.style.height = Math.max(percentage, 4) + '%'; // Minimum 4% for visibility
        
        const baseCurrency = localStorage.getItem("baseCurrency") || "$";
        bar.setAttribute('data-amount', `${baseCurrency}${amount.toFixed(2)}`);
         
        if (amount > 0) {
            const intensity = Math.min(percentage / 100, 1);
            const blueValue = 100 + Math.floor(155 * intensity);
            bar.style.background = `linear-gradient(to top, ##1B3C53, rgb(96 165 250 / ${0.5 + intensity * 0.5}))`;
        }
    });

    animateChartBars();
}

// Function to animate bars on when page load
function animateChartBars() {
    weeklyChartBars.forEach((bar, index) => {
        bar.style.transform = 'scaleY(0)';
        bar.style.opacity = '0';
        
        setTimeout(() => {
            bar.style.transition = 'all 0.5s ease';
            bar.style.transform = 'scaleY(1)';
            bar.style.opacity = '1';
        }, index * 100);
    });
}

function initChartTooltips() {
    weeklyChartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    });
}


function initializeDashboard() {
    getTotalRecords();
    getRemaining();
    total_spent.textContent = getTotalSpent().toLocaleString("en");
    getTopCategory();
    getStats();
    progressBar();
    updateWeeklyChart(); 
    initChartTooltips();
}

// initialization
initializeDashboard();


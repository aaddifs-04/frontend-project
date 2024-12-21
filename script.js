// Analytics: Fetch and Render Fraud Analytics
function renderFraudAnalytics() {
    const loadingElement = document.getElementById("loading");

    fetch("/api/analytics")
        .then(response => response.json())
        .then(data => {
            loadingElement.style.display = "none";

            const labels = data.labels; // e.g., ["Jan", "Feb", "Mar"]
            const fraudCounts = data.fraudCounts; // e.g., [5, 10, 15]

            const ctx = document.getElementById("fraudChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Fraud Cases",
                            data: fraudCounts,
                            borderColor: "rgba(75, 192, 192, 1)",
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderWidth: 2,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: "Monthly Fraud Cases Overview",
                        },
                    },
                },
            });
        })
        .catch(error => {
            console.error("Error fetching analytics data:", error);
            loadingElement.innerText = "Failed to load data.";
        });
}

// Document Upload and Authentication
function handleFileUpload() {
    const fileInput = document.getElementById("fileUpload");
    const uploadStatus = document.getElementById("uploadStatus");

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        uploadStatus.innerText = "File uploaded successfully!";
                        uploadStatus.style.color = "green";
                    } else {
                        uploadStatus.innerText = "File upload failed.";
                        uploadStatus.style.color = "red";
                    }
                })
                .catch(error => {
                    console.error("Error during file upload:", error);
                    uploadStatus.innerText = "Error uploading file.";
                    uploadStatus.style.color = "red";
                });
        } else {
            uploadStatus.innerText = "No file selected.";
            uploadStatus.style.color = "red";
        }
    });
}

// Navigation Highlighting
function highlightActiveNav() {
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Initialize Page-Specific Scripts
document.addEventListener("DOMContentLoaded", () => {
    // Highlight navigation link
    highlightActiveNav();

    // Initialize analytics if on analytics page
    if (document.getElementById("fraudChart")) {
        renderFraudAnalytics();
    }

    // Initialize file upload if on upload page
    if (document.getElementById("fileUpload")) {
        handleFileUpload();
    }
});

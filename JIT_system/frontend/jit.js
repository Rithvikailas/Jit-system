document.addEventListener("DOMContentLoaded", function() {
    let currentPage = 1;
    const itemsPerPage = 5;
    let totalItems = 0; // Total items fetched from the server

    fetchMaterials();

    function fetchMaterials() {
        fetch('/api/materials')  // Use the same API endpoint as Production Line to get the same data
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("Unexpected data format:", data);
                    return;
                }

                totalItems = data.length; // Total number of items
                renderTable(data);
                updatePaginationControls();
            })
            .catch(error => console.error('Error fetching materials:', error));
    }

    function renderTable(data) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

        const tableBody = document.querySelector('#jitTable tbody');
        tableBody.innerHTML = '';  // Clear previous table rows

        paginatedData.forEach(material => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${material.line || 'N/A'}</td>
                <td>${material.workOrderNumber || 'N/A'}</td>
                <td>${material.materialPartNumber || 'N/A'}</td>
                <td>${material.quantity || '-'}</td>
                <td>${material.description || '-'}</td>
                <td>
                    <button onclick="deleteMaterial('${material._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;

        // Disable previous button if on the first page
        document.getElementById("prevPageBtn").disabled = (currentPage === 1);
        // Disable next button if on the last page
        document.getElementById("nextPageBtn").disabled = (currentPage === totalPages);
    }

    document.getElementById("prevPageBtn").addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            fetchMaterials();
        }
    });

    document.getElementById("nextPageBtn").addEventListener("click", function() {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            fetchMaterials();
        }
    });

    window.deleteMaterial = function(id) {
        fetch(`/api/materials/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => fetchMaterials())
            .catch(error => console.error('Error deleting material:', error));
    };

    function refreshTable() {
        fetchMaterials();
    }

    // Set up interval to refresh the table every 5 seconds
    setInterval(refreshTable, 5000);

    // Initial fetch
    fetchMaterials();
});

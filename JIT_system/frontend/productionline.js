const materialsPerPage = 5;
let currentPage = 1;
let totalMaterials = 0;

document.getElementById('materialForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const line = document.getElementById('line').value;
    const workOrderNumber = document.getElementById('workOrderNumber').value;
    const materialPartNumber = document.getElementById('materialPartNumber').value;
    const quantity = document.getElementById('quantity').value;
    const description = document.getElementById('description').value;

    fetch('/api/materials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            line,
            workOrderNumber,
            materialPartNumber,
            quantity,
            description
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Material added:', data);
        alert('Material successfully added!');
        document.getElementById('materialForm').reset();
        fetchMaterials(); // Refresh the table after new material is added
    })
    .catch(error => {
        console.error('Error adding material:', error);
        alert('Failed to add material. Please try again.');
    });
});

function fetchMaterials() {
    fetch('/api/materials')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Unexpected data format');
            }

            totalMaterials = data.length;
            const startIndex = (currentPage - 1) * materialsPerPage;
            const endIndex = startIndex + materialsPerPage;
            const paginatedMaterials = data.slice(startIndex, endIndex);

            const tableBody = document.querySelector('#materialTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows
            

            paginatedMaterials.forEach(material => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${material.line}</td>
                    <td>${material.workOrderNumber}</td>
                    <td>${material.materialPartNumber}</td>
                    <td>${material.quantity ? material.quantity : '-'}</td>
                    <td>${material.description ? material.description : '-'}</td>
                    <td>
                        <button class="${material.status === 'Sent' ? 'Received' : 'Delete'}" onclick="handleReceived('${material._id}', '${material.status}')">
                            ${material.status === 'Sent' ? 'Received' : 'Delete'}
                        </button>
                    </td>

                    
                </td>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            updatePaginationInfo();
        })
        .catch(error => {
            console.error('Error fetching materials:', error);
            alert('Failed to fetch materials. Please try again.');
        });
}

function handleReceived(id, status) {
    if (status === 'Sent') {
        // If status is 'Sent', perform delete operation for 'Received' button
        fetch(`/api/materials/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => {
                alert('Material marked as received and deleted.');
                fetchMaterials();  // Refresh the table to remove the deleted row
            })
            .catch(error => console.error('Error deleting material:', error));
    } else {
        // If status is not 'Sent', treat it as 'Delete' and delete the material
        fetch(`/api/materials/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => {
                alert('Material deleted successfully.');
                fetchMaterials();  // Refresh the table after deletion
            })
            .catch(error => console.error('Error deleting material:', error));
    }
}


function updatePaginationInfo() {
    const totalPages = Math.ceil(totalMaterials / materialsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMaterials();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(totalMaterials / materialsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        fetchMaterials();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    fetchMaterials(); // Fetch and display materials when the page loads
    function refreshTable() {
        fetchMaterials();
    }
    
    // Set up interval to refresh the table every 5 seconds
    setInterval(refreshTable, 5000);
});


window.deleteMaterial = function(id) {
    fetch(`/api/materials/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(() => {
            fetchMaterials(); // Refresh the table after deletion
        })
        .catch(error => console.error('Error deleting material:', error));
    };



    
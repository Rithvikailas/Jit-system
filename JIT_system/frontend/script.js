document.addEventListener("DOMContentLoaded", function() {
    fetchMaterials();

    function fetchMaterials() {
        fetch('/api/materials')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#materialTable tbody');
                tableBody.innerHTML = '';
                data.materials.forEach(material => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${material.name}</td>
                        <td>${material.quantity !== undefined && material.quantity !== null ? material.quantity : 'N/A'}</td>
                        <td>${material.urgency}</td>
                        <td>
                            <button onclick="acceptMaterial('${material._id}')">Accept</button>
                            <button onclick="deleteMaterial('${material._id}')">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching materials:', error));
    }

    window.acceptMaterial = function(id) {
        fetch(`/api/materials/${id}/accept`, { method: 'PATCH' })
            .then(response => response.json())
            .then(() => fetchMaterials())
            .catch(error => console.error('Error accepting material:', error));
    }

    window.deleteMaterial = function(id) {
        fetch(`/api/materials/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => fetchMaterials())
            .catch(error => console.error('Error deleting material:', error));
    }
});

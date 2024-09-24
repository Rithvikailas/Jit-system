document.addEventListener("DOMContentLoaded", function() {
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalItems = 0; // Total items fetched from the server
    let initialUserInteraction = false; 

    // Add a reference to the audio file
    const successAudio = new Audio('sound/test1.mp3');  // Ensure the path is correct

    function ensureUserInteraction() {
        if (!initialUserInteraction) {
            document.body.addEventListener('click', () => {
                initialUserInteraction = true;
            }, { once: true });
        }
    }

    fetchMaterials();

    function fetchMaterials() {
        fetch('/api/materials')  // Use the same API endpoint as Production Line to get the same data
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("Unexpected data format:", data);
                    return;
                }

                const previousTotalItems = totalItems;
                totalItems = data.length; // Total number of items

                // Only update the table and play sound if new data is added (not removed)
                if (totalItems > previousTotalItems) {
                    renderTable(data);
                    if (initialUserInteraction) {
                        successAudio.play();  // Play the sound if user interacted with the page
                    }
                } else if (totalItems < previousTotalItems) {
                    renderTable(data);  // Just update the table without playing the sound
                }

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
            const isSent = localStorage.getItem(`material_${material._id}`) === 'sent';
            const buttonText = isSent ? 'Sent' : 'Send';
            const buttonDisabled = isSent ? 'disabled' : '';
            const buttonClass = material.status === isSent ? 'Sent' : 'Send';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${material.line || 'N/A'}</td>
                <td>${material.workOrderNumber || 'N/A'}</td>
                <td>${material.materialPartNumber || 'N/A'}</td>
                <td>${material.quantity || '-'}</td>
                <td>${material.description || '-'}</td>
                <td>
                    <button class="${buttonClass}" id="sendBtn-${material._id}" ${buttonDisabled} onclick="sendMaterial('${material._id}')">${buttonText}</button>
                    
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

    window.sendMaterial = function(id) {
        ensureUserInteraction(); // Ensure user interaction before playing sound
        fetch(`/api/materials/send/${id}`, { method: 'PUT' })
            .then(response => response.json())
            .then(() => {
                localStorage.setItem(`material_${id}`, 'sent'); // Store the state in localStorage
                fetchMaterials();  // Refresh the table
                const button = document.getElementById(`sendBtn-${id}`);
                if (button) {
                    button.textContent = 'Sent';  // Update button text to "Sent"
                    button.disabled = true; // Disable the button after it is marked as "Sent"
                }
            })
            .catch(error => console.error('Error sending material:', error));
    };

    const stopSoundBtn = document.getElementById("stopSoundBtn");
    stopSoundBtn.addEventListener("click", function() {
        successAudio.pause();
        successAudio.currentTime = 0;
    });

    // Function to refresh the table
    function refreshTable() {
        fetchMaterials();
    }

    // Set up interval to refresh the table every 5 seconds
    setInterval(refreshTable, 5000);

    // Initial fetch
    fetchMaterials();
});

document.addEventListener('DOMContentLoaded', function () {

    const districtDivisionData = {};
    const tooltip = createTooltip();

    // Load Divisional CSV data
    fetch('./data/district-division-data.csv')
        .then(response => response.text())
        .then(data => {
            const csvRows = data.split('\n').slice(1); // Skip the header

            csvRows.forEach(row => {
                const [divisionName, districtName, divisionNumber, districtNumber] = row.split(',').map(cell => cell.trim().replace(/"/g, ''));
                if (!districtDivisionData[districtNumber]) {
                    districtDivisionData[districtNumber] = { districtName, divisions: {} };
                }
                districtDivisionData[districtNumber].divisions[divisionNumber] = divisionName;
            });
            console.log('District Division Data:', districtDivisionData);

            // Load Divisional Result SVG
            return fetch('./maps/map-divisions.svg');
        })
        .then(response => response.text())
        .then(svg => {
            document.getElementById('divisional-result').innerHTML = svg;
            console.log('Divisional SVG loaded.');

            // Create tooltips for Divisional Result tab
            createDivisionTooltips(districtDivisionData, tooltip);
        })
        .catch(error => {
            console.error('Error loading division data:', error);
        });
});

function createDivisionTooltips(districtDivisionData, tooltip) {
    document.querySelectorAll('#divisional-result path').forEach(path => {
        const districtNumber = path.getAttribute('districtNumber');
        const divisionNumber = path.getAttribute('divisionNumber');
        if (districtDivisionData[districtNumber] && districtDivisionData[districtNumber].divisions[divisionNumber]) {
            const districtName = districtDivisionData[districtNumber].districtName;
            const divisionName = districtDivisionData[districtNumber].divisions[divisionNumber];
            path.setAttribute('title', `${divisionName} (${districtName})`);

            // Add hover effect
            path.addEventListener('mousemove', function(event) {
                tooltip.innerHTML = `${divisionName} (${districtName})`; // Set tooltip text
                tooltip.style.left = (event.pageX + 10) + 'px'; // Position tooltip
                tooltip.style.top = (event.pageY + 10) + 'px';
                tooltip.style.display = 'block'; // Show tooltip
            });

            path.addEventListener('mouseout', function() {
                tooltip.style.display = 'none'; // Hide tooltip
            });
        }
    });

    // Initialize Bootstrap tooltips for Divisional Result
    const tooltipTriggerListDivisional = document.querySelectorAll('#divisional-result path');
    tooltipTriggerListDivisional.forEach(path => {
        new bootstrap.Tooltip(path, {
            trigger: 'hover',
            placement: 'top'
        });
    });
}

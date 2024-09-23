document.addEventListener('DOMContentLoaded', function () {

    const districtData = {};
    const tooltip = createTooltip();

    // Load District CSV data
    fetch('./data/district-data.csv')
        .then(response => response.text())
        .then(data => {
            const csvRows = data.split('\n').slice(1); // Skip the header

            csvRows.forEach(row => {
                const [districtName, districtNumber] = row.split(',').map(cell => cell.trim().replace(/"/g, ''));
                if (districtNumber) {
                    districtData[districtNumber] = districtName;
                }
            });
            console.log('District Data:', districtData);

            // Load District Result SVG
            return fetch('./maps/map-districts.svg');
        })
        .then(response => response.text())
        .then(svg => {
            document.getElementById('district-result').innerHTML = svg;
            console.log('District SVG loaded.');

            // Create tooltips for District Result tab
            createDistrictTooltips(districtData, tooltip);
        })
        .catch(error => {
            console.error('Error loading district data:', error);
        });
});

function createTooltip() {
    const tooltip = document.createElement('div'); // Create tooltip element
    tooltip.id = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
}

function createDistrictTooltips(districtData, tooltip) {
    document.querySelectorAll('#district-map path').forEach(path => {
        const districtNumber = path.getAttribute('districtNumber');
        if (districtData[districtNumber]) {
            const districtName = districtData[districtNumber];
            path.setAttribute('title', districtName);

            // Add hover effect
            path.addEventListener('mousemove', function(event) {
                tooltip.innerHTML = districtName; // Set tooltip text
                tooltip.style.left = (event.pageX + 10) + 'px'; // Position tooltip
                tooltip.style.top = (event.pageY + 10) + 'px';
                tooltip.style.display = 'block'; // Show tooltip
            });

            path.addEventListener('mouseout', function() {
                tooltip.style.display = 'none'; // Hide tooltip
            });
        }
    });

    // Initialize Bootstrap tooltips for District Result
    const tooltipTriggerListDistrict = document.querySelectorAll('#district-map path');
    tooltipTriggerListDistrict.forEach(path => {
        new bootstrap.Tooltip(path, {
            trigger: 'hover',
            placement: 'top'
        });
    });
}

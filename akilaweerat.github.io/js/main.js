$(document).ready(function() {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Load item details if we're on the item details page
    if (window.location.pathname.includes('item-details.html')) {
        // Get item data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        
        // For demonstration, we'll use sample data
        // In a real application, this would fetch data from a server
        const item = {
            title: urlParams.get('title') || "No Title Available",
            description: urlParams.get('description') || "No description available",
            price: `LKR ${urlParams.get('price') || "0"}`,
            seller: {
                name: urlParams.get('seller_name') || "Not Available",
                contact: urlParams.get('seller_contact') || "Not Available",
                location: urlParams.get('seller_location') || "Not Available"
            }
        };

        // Update the page with item details
        $('#itemTitle').text(item.title);
        $('#itemDescription').text(item.description);
        $('#itemPrice').text(item.price);

        // Update seller information
        $('#sellerName').html(`<i class="fas fa-user me-2"></i>Seller Name: ${item.seller.name}`);
        $('#sellerContact').html(`<i class="fas fa-phone me-2"></i>Contact: ${item.seller.contact}`);
        $('#sellerLocation').html(`<i class="fas fa-map-marker-alt me-2"></i>Location: ${item.seller.location}`);
    }

    // Handle image preview
    $('#images').on('change', function(e) {
        const files = e.target.files;
        const previewContainer = $('.image-preview');
        previewContainer.empty();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewContainer.append(`
                        <img src="${e.target.result}" alt="Preview" class="img-thumbnail">
                    `);
                }
                reader.readAsDataURL(file);
            }
        }
    });

    // Handle form submission
    $('#adForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            title: $('#title').val(),
            category: $('#category').val(),
            price: $('#price').val(),
            description: $('#description').val(),
            contact: $('#contact').val(),
            images: $('#images')[0].files
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Posting...');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Add the new listing to the featured listings section
            addListingToPage(formData);
            
            // Reset form
            this.reset();
            $('.image-preview').empty();
            
            // Show success message
            showAlert('success', 'Your ad has been posted successfully!');
            
            // Reset button
            submitBtn.prop('disabled', false).text(originalText);
        }, 1500);
    });

    // Form validation
    function validateForm(data) {
        if (!data.title || !data.category || !data.price || !data.description || !data.contact) {
            showAlert('danger', 'Please fill in all required fields');
            return false;
        }

        if (data.price <= 0) {
            showAlert('danger', 'Please enter a valid price');
            return false;
        }

        if (data.contact.length < 10) {
            showAlert('danger', 'Please enter a valid contact number');
            return false;
        }

        return true;
    }

    // Add listing to the page
    function addListingToPage(data) {
        const listingHtml = `
            <div class="col-md-4">
                <div class="card listing-card">
                    <img src="${data.images.length > 0 ? URL.createObjectURL(data.images[0]) : 'images/placeholder.jpg'}" 
                         class="card-img-top" alt="${data.title}">
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <p class="card-text">${data.description.substring(0, 100)}...</p>
                        <p class="listing-price">LKR ${parseInt(data.price).toLocaleString()}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${data.category}</small>
                            <button class="btn btn-sm btn-outline-primary">Contact Seller</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#featuredListings').prepend(listingHtml);
    }

    // Show alert message
    function showAlert(type, message) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        $('.container').first().prepend(alertHtml);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            $('.alert').alert('close');
        }, 5000);
    }

    // Category card click handler
    $('.category-card').on('click', function() {
        const category = $(this).find('h5').text().toLowerCase();
        $('#category').val(category);
        $('html, body').animate({
            scrollTop: $('#post-ad').offset().top - 100
        }, 500);
    });

    // Search functionality
    $('.navbar form').on('submit', function(e) {
        e.preventDefault();
        const searchTerm = $(this).find('input').val().toLowerCase();
        
        // Filter listings based on search term
        $('.listing-card').each(function() {
            const title = $(this).find('.card-title').text().toLowerCase();
            const description = $(this).find('.card-text').text().toLowerCase();
            const category = $(this).find('.text-muted').text().toLowerCase();
            
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                category.includes(searchTerm)) {
                $(this).closest('.col-md-4').show();
            } else {
                $(this).closest('.col-md-4').hide();
            }
        });
    });
}); 
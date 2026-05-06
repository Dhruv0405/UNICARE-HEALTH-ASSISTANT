// Exercise section collapsible functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetList = document.getElementById(targetId);
            
            // Toggle active class for the clicked header
            this.classList.toggle('active');
            
            // Toggle active class for the exercise list
            if (targetList.classList.contains('active')) {
                targetList.classList.remove('active');
            } else {
                targetList.classList.add('active');
            }
        });
    });
    
    /* Remove default opening of the first category
    // Open the first category by default
    if (categoryHeaders.length > 0) {
        categoryHeaders[0].click();
    }
    */
}); 
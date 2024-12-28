// scripts.js

// Register User
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const response = await fetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await response.json();
  alert(result.message || 'Registration successful');
});

//Login User
// Login form script
document.addEventListener('DOMContentLoaded', () => {
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Call the API
            const response = await fetch('http://localhost:3000/api/users/login', {
              method: 'POST',
              headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            // Log response status and body content
            console.log('Response Status:', response.status);
            console.log('Response Data:', data);

            if (response.ok) {
                // If response is OK (200), show success message
                successMessage.textContent = 'Login successful! Redirecting...';
                successMessage.style.display = 'block';

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                // Handle the error response (non-200 status)
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            // Handle errors
            console.error('Login error:', error);

            errorMessage.textContent = error.message || 'An unexpected error occurred. Please try again.';
            errorMessage.style.display = 'block';
        }
    });
}
});


// Logout
function logout() {
  sessionStorage.removeItem('userId');
  location.href = '/login';
}

// Load Profile Details
if (location.pathname === '/profile') {
const userId = sessionStorage.getItem('userId');
if (!userId) {
  // If userId is not found, redirect to login page
  location.href = '/login';
} else {
  // Fetch user profile data if userId exists
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById('userName').textContent = data.name;
      document.getElementById('userEmail').textContent = data.email;
    });
}
}


// Load Products
if (location.pathname === '/products') {
  fetch('/api/products')
    .then((res) => res.json())
    .then((products) => {
      const productList = document.getElementById('productList');
      products.forEach((product) => {
        const item = document.createElement('div');
        item.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <button onclick="viewProduct('${product._id}')">View Details</button>
        `;
        productList.appendChild(item);
      });
    });
}

// View Product Details
function viewProduct(productId) {
  location.href = `/productDetails.html?id=${productId}`;
}

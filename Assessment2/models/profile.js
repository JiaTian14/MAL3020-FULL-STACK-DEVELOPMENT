// Fetch User Details
document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('http://127.0.0.1:5501/api/user');
      const user = await response.json();
      if (user) {
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  });
  
  // Update User Profile
  async function updateProfile() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://127.0.0.1:5501/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  }
  
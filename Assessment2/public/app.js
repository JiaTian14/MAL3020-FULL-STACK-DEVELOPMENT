document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/products')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const contentDiv = document.getElementById('content');
      if (data.length > 0) {
        const productList = document.createElement('ul');
        data.forEach((product) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${product.name}: $${product.price}`;
          productList.appendChild(listItem);
        });
        contentDiv.appendChild(productList);
      } else {
        contentDiv.textContent = 'No products available.';
      }
    })
    .catch((err) => {
      console.error('Error fetching products:', err);
      document.getElementById('content').textContent = 'Error loading products.';
    });
});

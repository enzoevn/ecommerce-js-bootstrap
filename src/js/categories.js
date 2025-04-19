export async function loadCategories() {
    try {
      const response = await fetch('./src/templates/categories.html');
      if (!response.ok) {
        throw new Error('Failed to load products.html');
      }
      const html = await response.text();
      console.log(html);
      document.querySelector('#app').innerHTML = html;
    } catch (error) {
      console.error(error);
      document.querySelector('#app').innerHTML = '<p>Error al cargar la página.</p>';
    }
  }
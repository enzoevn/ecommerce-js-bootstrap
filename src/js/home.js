export async function loadHome() {
    try {
      const response = await fetch('./src/templates/home.html');
      if (!response.ok) {
        throw new Error('Failed to load home.html');
      }
      const html = await response.text();
      console.log(html);
      document.querySelector('#app').innerHTML = html;
    } catch (error) {
      console.error(error);
      document.querySelector('#app').innerHTML = '<p>Error al cargar la página.</p>';
    }
  }
// Global scope
let page = 1; 
let filteredRepositories;
let perPage = 10;

// Function to fetch GitHub repositories
async function fetchRepositories() {
  const username = document.getElementById('username').value;
  const repositoriesList = document.getElementById('repositories-list');
  const loader = document.getElementById('loader');
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const perPage = document.getElementById('perPage').value || 10;

  try {
    loader.style.display = 'block'; // Show loader

    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repositories = await response.json();
    
    // for filter oftion
    document.getElementById('search-container').style.display = 'block';
    document.getElementById('pagination-container').style.display = 'block';
    

    filteredRepositories = repositories
      .filter(repo => repo.name.toLowerCase().includes(searchQuery));

    const totalPages = Math.ceil(filteredRepositories.length / perPage);

    repositoriesList.innerHTML = '<h2>Repositories:</h2>';
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    filteredRepositories
      .slice(startIndex, endIndex)
      .forEach(repo => {
        repositoriesList.innerHTML += `
          <div class="repository">
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description'}</p>
            <p><strong>Topics:</strong> ${repo.topics.join(', ') || 'No topics'}</p>
          </div>`;
      });

    // page numbers
    if (totalPages > 1) {
      document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
    } else {
      document.getElementById('page-info').textContent = '';
    }

  } catch (error) {
    console.error('Error fetching repositories:', error);
    repositoriesList.innerHTML = '<p style="color: red;">Error fetching repositories. Please check the username.</p>';
  } finally {
    loader.style.display = 'none'; // Hide loader
  }
}
// for changing no
function changePage(direction) {
  const totalPages = Math.ceil(filteredRepositories.length / perPage);
  let newPage;

  if (direction === 'prev') {
    newPage = page - 1;
  } else if (direction === 'next') {
    newPage = page + 1;
  }

  if (newPage >= 1 && newPage <= totalPages) {
    page = newPage;
    fetchRepositories();
  }
}


const baseUrl = 'https://sprint-mission-api.vercel.app/articles';

// Get articles
export function getArticleList(page = 1, pageSize = 100, keyword) {
    const url = new URL(baseUrl);
    const params = {
        page,
        pageSize,
        keyword
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GET Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error(`GET Error fetching article list:`, error));
}

// Get a single article
export function getArticle(id) {
    fetch(`${baseUrl}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GET Single Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error(`GET Signle Error fetching article:`, error));
}

//post a new article
export function postArticle(title, content, image) {
    fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                image
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`POST Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error=> console.error('Error posting article:', error));
}

// // Patch an article
export function patchArticle(id, updates) {
    fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorInfo => {
                    throw new Error(`PATCH Error: ${response.statusText}, Details: ${JSON.stringify(errorInfo)}`);
                });
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error updating article:', error));
}

//Delete an article
export function deleteArticle(id) {
    fetch(`${baseUrl}/${id}`, { 
        method: 'DELETE' 
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`DELETE Error: ${response.statusText}`);
            }
            then(data => console.log(data))
        })
        .catch(error => console.error('Error deleting article:', error));
}
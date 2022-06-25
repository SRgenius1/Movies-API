const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
      'Content-type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});
// UTILS.
const lazyLoading = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
});



// HELPERS

function createMovies(movies, container, lazyLoad = false) {
    container.innerHTML = '';

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img': 'src', 
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
            );
            
            movieImg.addEventListener('error', () => {
                movieImg.setAttribute('src',
                 'https://scontent.fclo1-3.fna.fbcdn.net/v/t39.30808-6/290580643_561856428927003_3327869155580496967_n.jpg?stp=dst-jpg_s720x720&_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeG-MSIQDUHGHh5Oybb7AX2lle0rPug5_NqV7Ss-6Dn82m1S7dvFoJ0RdTg9NY9OqmYy4YjvOb6YtToxFRGTUBqq&_nc_ohc=voVDOk8twBkAX-9Z2yJ&_nc_ht=scontent.fclo1-3.fna&oh=00_AT-7VmcI_YvLqCicbB2sQasLIwY1gZULzZw1cr9gYlslcA&oe=62BC0199');
            });

        
        if(lazyLoad) {
            lazyLoading.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategories (categories,container) {
    container.innerHTML = '';

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = '#category=' + category.id + '-' + category.name;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

// LLAMADOS ALA API
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day');
    const movies =  data.results;

    createMovies(movies, trendingMoviesPreviewList, true);
};


async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;
    createCategories(categories, categoriesPreviewList);
};


async function getMoviesByCategory(id) {
    const {data} = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies =  data.results;

    createMovies(movies, genericSection, true);
};

async function getMoviesBySearch(query) {
    const {data} = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies =  data.results;

    createMovies(movies, genericSection);
};

async function getTrendingMovies() {
    const {data} = await api('trending/movie/day');
    const movies =  data.results;

    createMovies(movies, genericSection);
};

async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
    180deg, 
    rgba(0, 0, 0, 0.35) 19.27%, 
    rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})`;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;  
    
    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesById(id);
};

async function getRelatedMoviesById (id) {
    const { data } = await api('movie/' + id + "/similar");
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
};
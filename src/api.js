const TMDB_API_KEY = "c38e100606db9b29daa9c485d2f5aec6"; // Extracted from legacy
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const IMAGE_ORIGINAL_URL = "https://image.tmdb.org/t/p/original";

export const API = {
    isKeyMissing() {
        return TMDB_API_KEY === "YOUR_API_KEY_HERE" || !TMDB_API_KEY;
    },

    getImageUrl(path, original = false) {
        if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
        return original ? `${IMAGE_ORIGINAL_URL}${path}` : `${IMAGE_BASE_URL}${path}`;
    },

    async fetchWithErrorHandling(endpoint) {
        const separator = endpoint.includes('?') ? '&' : '?';
        const rawUrl = `${BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}&language=en-US`;
        // TMDB natively supports CORS. Free proxies often block production domains (Vercel/Netlify).
        const targetUrl = rawUrl;

        try {
            const response = await fetch(targetUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Fetch failed for ${endpoint}:`, error);
            throw error;
        }
    },

    async getTrendingMovies() {
        try {
            const data = await this.fetchWithErrorHandling('/trending/movie/day');
            return data.results || [];
        } catch (e) { return []; }
    },

    async getTopRatedMovies(page = 1) {
        try {
            const data = await this.fetchWithErrorHandling(`/movie/top_rated?page=${page}`);
            return data.results || [];
        } catch (e) { return []; }
    },

    async getNowPlayingMovies() {
        try {
            const data = await this.fetchWithErrorHandling('/movie/now_playing');
            return data.results || [];
        } catch (e) { return []; }
    },

    async searchMovies(query, page = 1) {
        if (!query) return [];
        try {
            const data = await this.fetchWithErrorHandling(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
            return data.results || [];
        } catch (e) { return []; }
    },

    async multiSearch(query, page = 1) {
        if (!query) return { results: [], total_pages: 1 };
        try {
            return await this.fetchWithErrorHandling(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
        } catch (e) { return { results: [], total_pages: 1 }; }
    },

    async getMovieDetails(id) {
        try {
            return await this.fetchWithErrorHandling(`/movie/${id}?append_to_response=videos,credits,reviews,release_dates,images,similar,recommendations,watch/providers`);
        } catch (e) { return null; }
    },

    async getTVDetails(id) {
        try {
            return await this.fetchWithErrorHandling(`/tv/${id}?append_to_response=videos,credits,reviews,images,similar,recommendations,watch/providers`);
        } catch (e) { return null; }
    },

    async getSeasonDetails(tvId, seasonNumber) {
        try {
            return await this.fetchWithErrorHandling(`/tv/${tvId}/season/${seasonNumber}?append_to_response=videos`);
        } catch (e) { return null; }
    },

    async getEpisodeDetails(tvId, seasonNumber, episodeNumber) {
        try {
            return await this.fetchWithErrorHandling(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?append_to_response=images,credits,videos`);
        } catch (e) { return null; }
    },

    async getTrendingTV() {
        try {
            const data = await this.fetchWithErrorHandling('/trending/tv/day');
            return data.results || [];
        } catch (e) { return []; }
    },

    async getCredits(id, type = 'movie') {
        try {
            return await this.fetchWithErrorHandling(`/${type}/${id}/credits`);
        } catch (e) { return null; }
    },

    async getByGenre(type, genreId, page = 1, sortBy = 'popularity.desc') {
        try {
            const data = await this.fetchWithErrorHandling(`/discover/${type}?with_genres=${genreId}&page=${page}&sort_by=${sortBy}`);
            return data;
        } catch (e) { return { results: [], total_pages: 1 }; }
    },

    async getTrendingPeople() {
        try {
            const data = await this.fetchWithErrorHandling('/trending/person/week');
            return data.results || [];
        } catch (e) { return []; }
    },

    async getPersonDetails(id) {
        try {
            return await this.fetchWithErrorHandling(`/person/${id}?append_to_response=movie_credits,tv_credits,external_ids`);
        } catch (e) { return null; }
    }
};

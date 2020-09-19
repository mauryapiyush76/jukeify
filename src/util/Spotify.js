const clientId = '';
const redirectUri = 'http://jukeify-react.surge.sh';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for an access token match
        // window.location.href gives the current window url
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },
    async search(term) {
        if (accessToken === undefined) {
            this.getAccessToken();
        }
        try {
            let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                let jsonResponse = await response.json();
                let tracks = jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    preview: track.preview_url
                }));
                return tracks;
            }
        } catch (error) {
            console.log(error);
        }
    },

    async savePlaylist(name, trackUris) {
        if (accessToken === undefined) {
            this.getAccessToken();
        }
        if (name === undefined || trackUris === undefined) {
            return;
        } else {
            let userId = await this.findUserId();
            let playlistID;
            fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ name: name })
            }).then(response => { return response.json() }
            ).then(playlist => {
                playlistID = playlist.id;
                this.addTracks(playlistID, trackUris, userId);
            });
        }
    },
    addTracks(playlistID, trackUris, userId) {
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ uris: trackUris })
        });
    },
    findUserId() {
        if (accessToken === undefined) {
            this.getAccessToken();
        }
        let userId;
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        ).then(response => { return response.json() }
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return userId;
        });
    }
};

export default Spotify;
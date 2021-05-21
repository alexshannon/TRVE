let uat;
const clientID = '417dd198ea4245caae240a7365d89f02'
let redirectURI;

//determines if we're on dev or prod, and sets URI accordingly
if(window.location.href === 'http://localhost:3000/'){
    redirectURI = 'http://localhost:3000/'
}
else {
    redirectURI = 'https://trve.netlify.app/'
}


export const Spotify = {
    getAccessToken(){
        if(uat){
            return uat;
        }
        //check for uat match
        const accessToken = window.location.href.match(/access_token=([^&]*)/)
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/)
        if(accessToken && expiryTime){
            uat = accessToken
            const expiresIn = Number(expiryTime[1])
            //clears params, grabs new token when expires
            window.setTimeout(() => uat = '', expiresIn * 1000)
            window.history.pushState('Access Token', null, '/')
            return uat;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessURL
        }
    },
    search(term, searchCount){
        let searchURL = `https://api.spotify.com/v1/search?type=track&q=${term}&offset=${searchCount * 20}&limit=20`
        const accessToken = Spotify.getAccessToken();
        return fetch(searchURL, 
        { headers: {
            Authorization: `Bearer ${accessToken[1]}`
        }}).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                artistID: track.artists[0].id,
                album: track.album.name,
                uri: track.uri,
                popularity: track.popularity,
                image: track.album.images[0].url,
                genre: '',
            }));
        })
    },
    savePlaylist(playlistTracks, playlistName){
        if(!playlistTracks.length || !playlistName){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        let userID;
        return fetch('https://api.spotify.com/v1/me', {headers: {Authorization: `Bearer ${accessToken[1]}`}}).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userID = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: {Authorization: `Bearer ${accessToken[1]}`},
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: {Authorization: `Bearer ${accessToken[1]}`},
                    method: 'POST',
                    body: JSON.stringify({ uris: playlistTracks })
                })
            })
        })
    }
}
export const SpotifyMethods = {
    Spotify
}

export default SpotifyMethods;
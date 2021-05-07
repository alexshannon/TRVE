let uat;
const redirectURI = 'https://trve.netlify.app/'
const clientID = '417dd198ea4245caae240a7365d89f02'

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
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        { headers: {
            Authorization: `Bearer ${accessToken[1]}`
        }}).then(response => {
            return response.json();
        }).then(jsonResponse => {
            //console.log(jsonResponse)
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                artistID: track.artists[0].id,
                album: track.album.name,
                genre: '',
                uri: track.uri,
                popularity: track.popularity
            }));
        })
    },
    genreSearch(id){
        const accessToken = Spotify.getAccessToken();
        fetch(`https://api.spotify.com/v1/artists/${id}`, {headers: {Authorization: `Bearer ${accessToken[1]}`}}).then(response => {
            return response.json();
        }).then(jsonResponse => {
            let genre = jsonResponse.genres[0]
            return genre
        })
    },

    savePlaylist(playlistTracks, playlistName){
        if(!playlistTracks.length || !playlistName){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        //const headers = { headers: {Authorization: `Bearer ${accessToken[1]}`}}
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

export default Spotify;
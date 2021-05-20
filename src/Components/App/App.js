/* eslint-disable no-loop-func */
import './App.css';
import React from 'react'
import {SearchBar} from '../SearchBar/SearchBar'
import {SearchResults} from '../SearchResults/SearchResults'
import {Playlist} from '../Playlist/Playlist'
import {SpotifyMethods} from '../../util/Spotify';


class App extends React.Component {

  constructor(props){
    super(props);

    this.state = { 
      SearchResults: [],
      playlistName:  'My Playlist',
      playlistTracks: [],
      trackURIs: []
    };
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }
  search(searchTerm){
    SpotifyMethods.Spotify.search(searchTerm).then(searchResults => {
      const access = SpotifyMethods.Spotify.getAccessToken()
      //fetches and populates the genreArray
      let counter = 0;
      for(const track in searchResults){
        fetch(`https://api.spotify.com/v1/artists/${searchResults[track].artistID}`, {headers: {Authorization: `Bearer ${access[1]}`}}).then(response => {
            return response.json();
          }).then(jsonResponse => {
              let tempArray = [];
              let genres = jsonResponse.genres
              for(const genre in genres){
                tempArray.push(genres[genre])
              }
              if(tempArray.length > 0){
                searchResults[track].genre = tempArray
                counter ++;
              } else {
                searchResults[track].genre = ['none']
                counter ++;
              }
              if(counter === searchResults.length){
                this.genreSort(searchResults)
              }
          })
        }
        
    })
  }
  genreSort(results){
    const unpopularTracks = [];
    const metalTracks = []
    for(const track in results){
      let matched = false;
      for(const genre in results[track].genre){
        let currentGenre = results[track].genre[genre]
        if(currentGenre.includes('metal')){
          if(!matched){
            metalTracks.push(results[track])
            matched = true;
          }
        }
      }
    }
    //investigate seperating this out to it's own function to reduce complexity
    if(metalTracks.length > 0){
      for(const track in metalTracks){
        if(metalTracks[track].popularity < 99){
          unpopularTracks.push(metalTracks[track])
        }
      }
    } else{
      const noResultTracks = [{id: "none", name: "Poser Alert", artist: "No Metal results", artistID: "a", album: "Try again with better taste", popularity: -666}]
      this.setState({SearchResults: noResultTracks})
    }

    //split these off to be it's own function
    if(unpopularTracks.length > 0){
      this.setState({SearchResults: unpopularTracks})
    }
    else {
      const poserTracks = [{id: "loser", name: "Poser Alert", artist: "Results Too Popular", artistID: "a", album: "Get Better Taste", popularity: -666}]
      this.setState({SearchResults: poserTracks})
    }
  }
  savePlaylist(){
    const uris = this.state.playlistTracks.map(track => track.uri)
    this.setState({trackURIs: uris})
    SpotifyMethods.Spotify.savePlaylist(uris, this.state.playlistName).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        trackURIs: []
      })
    })
  }
  addTrack(track){
    let tracks = this.state.playlistTracks
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    } 
      tracks.push(track)
      this.setState({ playlistTracks: tracks })
    }
  removeTrack(track){
    let tracks = this.state.playlistTracks
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks })
  }
  updatePlaylistName(name){
      this.setState({ playlistName: name })
  }
  render(){
    return (     
    <div>
      <h1>TR<span className="highlight">V</span>E</h1>
      <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults SearchResults={this.state.SearchResults}
                          onAdd={this.addTrack}/>
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} 
                    onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
        </div>
      </div>
    </div>)
  }
}

export default App;

import './App.css';
import React from 'react'
import {SearchBar} from '../SearchBar/SearchBar'
import {SearchResults} from '../SearchResults/SearchResults'
import {Playlist} from '../Playlist/Playlist'
import {Spotify} from '../../util/Spotify';


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
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({SearchResults: searchResults})
    })
    
  }
  savePlaylist(){
    const uris = this.state.playlistTracks.map(track => track.uri)
    this.setState({trackURIs: uris})
    Spotify.savePlaylist(uris, this.state.playlistName).then(() => {
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

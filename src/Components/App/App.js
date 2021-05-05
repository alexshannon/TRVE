import './App.css';
import React from 'react'
import {SearchBar} from '../SearchBar/SearchBar'
import {SearchResults} from '../SearchResults/SearchResults'
import {Playlist} from '../Playlist/Playlist'

class App extends React.Component {

  constructor(props){
    super(props);

    this.state = { 
      SearchResults: 
      [{name: 'name1', artist: 'artist1', album: 'album1', uri: 1, id: 1}, 
      {name: 'name2', artist: 'artist2', album: 'album2', uri: 2, id: 2}, 
      {name: 'name3', artist: 'artist3', album: 'album3', uri: 3, id: 3}, 
      {name: 'name4', artist: 'artist4', album: 'album4', uri: 4, id: 4}, 
      {name: 'name5', artist: 'artist5', album: 'album5', uri: 5, id: 5}, 
      {name: 'name6', artist: 'artist6', album: 'album6', uri: 6, id: 6}],
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
    console.log(searchTerm)
  }
  savePlaylist(){
    const uris = this.state.playlistTracks.map(track => track.uri)
    this.setState({trackURIs: uris})
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

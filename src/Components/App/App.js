import './App.css';
import React from 'react'
import {SearchBar} from '../SearchBar/SearchBar'
import {SearchResults} from '../SearchResults/SearchResults'
import {Playlist} from '../Playlist/Playlist'

class App extends React.Component {

  constructor(props){
    super(props);

    this.state = { 
      SearchResults: [{name: 'name1', artist: 'artist1', album: 'album1', id: 1}, 
      {name: 'name2', artist: 'artist2', album: 'album2', id: 2}, 
      {name: 'name3', artist: 'artist3', album: 'album3', id: 3}],
      playlistName:  'My Playlist',
      playlistTracks: [{name: 'name4', artist: 'artist4', album: 'album4', id: 1}, 
      {name: 'name5', artist: 'artist5', album: 'album5', id: 2}, 
      {name: 'name6', artist: 'artist6', album: 'album6', id: 3}]

    }

  }

  render(){
    return (     
    <div>
      <h1>TR<span className="highlight">V</span>E</h1>
      <div className="App">
        <SearchBar />
        <div className="App-playlist">
          <SearchResults SearchResults={this.state.SearchResults}/>
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
        </div>
      </div>
    </div>)
  }
}

export default App;

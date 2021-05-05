import React from 'react'
import './Playlist.css'
import {Tracklist} from '../TrackList/Tracklist'

export class Playlist extends React.Component{
    constructor(props){
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.save = this.save.bind(this)
    }
    handleNameChange(event){
        let newName = event.target.value;
        this.props.onNameChange(newName);
    }
    save(){
        if(this.props.playlistName !== ''){
            this.props.onSave()
        } else {
            console.log('Name must not be empty!')
        }
    }

    render(){
        return(
            <div className="Playlist">
                <input defaultValue={'New Playlist'} onChange={this.handleNameChange}/>
                <Tracklist tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.save}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}
import React from 'react'
import './Tracklist.css'
import {Track} from '../Track/Track'

export class Tracklist extends React.Component{
    render(){
        return(
            <div className="TrackList">
               <Track tracks={this.props.SearchResults}/>
            </div>
        )
    }
}
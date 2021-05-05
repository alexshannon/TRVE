import React from 'react'
import './SearchResults.css'
import {Tracklist} from '../TrackList/Tracklist'

export class SearchResults extends React.Component {
    render(){
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <Tracklist tracks={this.props.SearchResults} onAdd={this.props.onAdd} isRemoval={false}/>
            </div>
        )
    }
}
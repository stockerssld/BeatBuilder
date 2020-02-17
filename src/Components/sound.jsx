import React, {useState} from 'react'
import Axios from 'axios'
import Sound from 'react-sound'

export default function SoundReact(porps){
    
    const [client, setClient]=useState('YOUR_CLIENT_ID')

    const prepareUrl=(url)=> {
        // Attach client id to stream url
        return `${url}?client_id=${this.client_id}`
    }

    return(
        <div classNam="scotch_music">
            <Sound
            url={this.prepareUrl(this.state.track.stream_url)}
            playStatus={this.state.playStatus}
            onPlaying={this.handleSongPlaying.bind(this)}
            playFromPosition={this.state.playFromPosition}
            onFinishedPlaying={this.handleSongFinished.bind(this)}/>
        </div>  
    )
}
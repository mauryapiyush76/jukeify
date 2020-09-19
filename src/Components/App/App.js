import React from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import SearchBar from '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        // {
        //   name: 'name1',
        //   artist: 'artist1',
        //   album: 'album1',
        //   id: 1
        // },
        // {
        //   name: 'name1',
        //   artist: 'artist1',
        //   album: 'album1',
        //   id: 2
        // },
        // {
        //   name: 'name1',
        //   artist: 'artist1',
        //   album: 'album1',
        //   id: 3
        // }
      ],
      playlistName: 'My Playlist',
      playlistTracks: [
        // {
        //   name: 'PlayListname1',
        //   artist: 'Playlistartist1',
        //   album: 'PlayListalbum1',
        //   id: 4
        // },
        // {
        //   name: 'PlayListname1',
        //   artist: 'Playlistartist1',
        //   album: 'PlayListalbum1',
        //   id: 5
        // },
        // {
        //   name: 'PlayListname1',
        //   artist: 'Playlistartist1',
        //   album: 'PlayListalbum1',
        //   id: 6
        // }
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  // to add track from search result to playlist
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    //alert("this method works");
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    //console.log(term);
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    });
  }

  render() {
    return (
      <div>
        <h1>J<span className="highlight">uke</span>ify</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default App;

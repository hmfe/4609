import React from 'react';
import './App.css';

import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import Button from './components/Button';

class App extends React.Component {
  
  state = {
    searchHistory: []
  }

  addSearchToHistory = search => {
    let newSearchHistory = this.state.searchHistory;
    newSearchHistory.push(search);
    this.setState({ searchHistory: newSearchHistory });
  }

  clearSearchHistory = () => {
    this.setState({ searchHistory: [] });
  }

  removeSearchHistoryEntry = index => {
    let newSearchHistory = this.state.searchHistory;
    newSearchHistory.splice(index, 1);
    this.setState({ searchHistory: newSearchHistory });
  }

  render() {
    return (
      <div className="container">
        <SearchBar addSearchToHistory={this.addSearchToHistory} />
        <SearchHistory 
          searchHistory={this.state.searchHistory}
          clearSearchHistory={this.clearSearchHistory}
          removeSearchHistoryEntry={this.removeSearchHistoryEntry}
        />
        <Button />
      </div>
    );
  }
}

export default App;

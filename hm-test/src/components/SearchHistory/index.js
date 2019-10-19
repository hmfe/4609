import React from 'react';

import './style.css';

class SearchHistory extends React.Component {

	render() {

		const { searchHistory } = this.props;

		let historicalSearches;

		if(searchHistory) {
			historicalSearches = searchHistory.map((search, index) => {
				return (
					<li key={index}>
						<span className="history-search-text">{search.text}</span>
						<div>
							<time dateTime={formatDate(search.date)}>{formatDate(search.date)}</time>
							<button 
								className="link-button remove-btn"
								aria-label="Remove"
								onClick={(index) => this.props.removeSearchHistoryEntry(index)}>X</button>
						</div>
					</li>
				)
			})
		}
		return (
			<>
				<div className="search-history-top">
					<h2>Search History</h2>
					<button 
						className="link-button"
						onClick={this.props.clearSearchHistory}>
						Clear search history
					</button>
				</div>
				<ul className="search-history">
					{historicalSearches}
				</ul>
			</>
		)
	}
}

function formatDate(date) {
	
	const year = date.getFullYear();
	const month = date.getMonth() + 1; 		//The count for month starts at 0
	let day = date.getDate() 
	day = day < 10 ? '0'+day : day;

	let hours = date.getHours();
	let minutes = date.getMinutes();
	
	const ampm = hours >= 12 ? 'PM' : 'AM';
	
	hours = hours % 12;
	minutes = minutes < 10 ? '0'+minutes : minutes;

	return `${year}-${month}-${day}, ${hours}:${minutes} ${ampm}`; 
}

export default SearchHistory;
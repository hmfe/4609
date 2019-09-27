import React from 'react';
import axios from 'axios';

import './style.css';

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const apiUrl = `https://www.googleapis.com/books/v1/volumes?key=${googleApiKey}`;

const KEY_CODES = {
	TAB: 9,
	ENTER: 13,
	UP_ARROW: 38,
	DOWN_ARROW: 40
}

class SearchBar extends React.Component {

	state = {
		userInput: '',
		suggestions: [],
		activeSuggestion: 0, //The list item the user has highlighted
		showSuggestions: false
	}

	// Function called when the user types 
	onChange = e => {
		const userInput = e.currentTarget.value;
		this.setState({ userInput: userInput });

		if(userInput.length > 0) {
			const url = `${apiUrl}&q=${userInput}`;
			// Call the api and search for the inputed text
			axios.get(url).then(results => {
				//Extract the title for each element in the returned results
				if(results.data.items && results.data.items.length !== 0) {
					const suggestions = results.data.items.map(item => {
						return item.volumeInfo.title; 
					});
					//Update the state with the new results
					this.setState({ suggestions: suggestions, showSuggestions: true });
				}
			})	
		}
		else {
			//Reset the suggestions if the search input is empty
			this.setState({ suggestions: [] });
		}
	}

	// Function for handling when the user navigates in the suggestion list
	onKeyDown = e => {
		const { activeSuggestion, suggestions} = this.state;
		const { addSearchToHistory } = this.props;

		//User pressed the tab key
		if(e.keyCode === KEY_CODES.TAB) {
			//Move the selected item one step down
			if(activeSuggestion === suggestions.length - 1) return;
			this.setState({ activeSuggestion: activeSuggestion + 1 });
		}

		//User pressed the enter key
		if(e.keyCode === KEY_CODES.ENTER) {
			const selectedSuggestion = suggestions[activeSuggestion];
			
			//Don't add empty selections
			if(!selectedSuggestion || selectedSuggestion === '') return;

			//Add the selected suggestion to the historical searches
			const searchHistoryObj = {
				text: selectedSuggestion,
				date: new Date()
			}
			addSearchToHistory(searchHistoryObj);	
			//Set the user input to the selected item
			this.setState({
				activeSuggestion: 0,
				userInput: selectedSuggestion,
				showSuggestions: false
			});
		}

		//User pressed the up arrow
		else if(e.keyCode === KEY_CODES.UP_ARROW) {
			//Don't decrement if the first suggestion is active
			if(activeSuggestion === 0) return;
			this.setState({ activeSuggestion: activeSuggestion - 1 });
		}

		//User pressed the down arrow
		else if(e.keyCode === KEY_CODES.DOWN_ARROW) {
			//Don't increment if the last suggestion is active
			if(activeSuggestion === suggestions.length - 1) return;
			this.setState({ activeSuggestion: activeSuggestion + 1 });
		}

	}

	// Function called when user clicks one of the suggestions
	onClick = e => {
		const { addSearchToHistory } = this.props;
		const selectedText = e.currentTarget.innerText;
		
		//Add the selected suggestion to the historical searches
		const searchHistoryObj = {
			text: selectedText,
			date: new Date()
		}
		addSearchToHistory(searchHistoryObj);	

		this.setState({
			activeSuggestion: 0,
			suggestions: [],
			showSuggestions: false,
			userInput: selectedText
		})
	}


	render() {

		const { userInput, suggestions, 
			activeSuggestion, showSuggestions } = this.state;
		
		//Create the suggestions list component
		let suggestionList;

		//Only show suggestions if user has typed anything
		if(userInput && showSuggestions) {
			if(suggestions.length > 0) {
				let suggestionListComponents = suggestions.map((suggestion, index) => {
					let className;
	
					if(index === activeSuggestion) {
						className = "suggestion-active";
					}
	
					return (
						<li
							className={className}
							key={index}
							tabIndex={index}
							onClick={this.onClick}
						>
							{suggestion}
						</li>
					)
				});
	
				suggestionList = (
					<ul className="suggestion-list">
						{suggestionListComponents}
					</ul>
				)
			}	
		}

		return (
			<>
				<input 
					type="search"
					maxLength="200"
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					value={this.state.userInput}
				/>
				{suggestionList}
			</>	
		)
	}
}

export default SearchBar;
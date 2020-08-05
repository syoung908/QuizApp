/**
 * SearchBar.
 *
 * Text search bar component for the Homepage. Allows for the user to search
 * quizzes using key terms or tags.
 *
 * @module  SearchBar
 * @file    This file defines the style and components for the SearchBar 
 *          component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';

import {useSearchStore} from "../../stores/searchStore";
import {useObserver} from "mobx-react";

export default function SearchBar() {
  const searchStore = useSearchStore();

  // Handles any user input events from the user.
  const handleChange = (event) => {
    searchStore.searchText = event.target.value;
  }

  // Clears the search bar and queries all quizzes instead
  const clearSearchBar = () => {
    searchStore.searchText = "";
    searchStore.fetchQuizzes();
  }

  // Performs query when enter is pressed
  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.target.blur();
      searchStore.fetchQuizzes();
    } 
  }

  return useObserver(() => (
    <TextField
      id="searchbar"
      label="Search"
      variant="outlined"
      size="small"
      fullWidth
      value={searchStore.searchText}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={clearSearchBar}
            >
              {searchStore.searchText === "" ? null : <CloseIcon/>}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  ));
}

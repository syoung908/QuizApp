import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';

import {useSearchStore} from "../../stores/searchStore";
import {useObserver} from "mobx-react";

export default function SearchBar(props) {
  const searchStore = useSearchStore();

  const handleChange = (event) => {
    searchStore.searchText = event.target.value;
  }

  const clearSearchBar = () => {
    searchStore.searchText = "";
    props.fetchQuizzes();
  }

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.target.blur();
      props.fetchQuizzes();
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

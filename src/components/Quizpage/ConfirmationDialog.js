/**
 * ConfirmationDialog.
 *
 * Quizpage component popup that is displayed when the user submits their quiz 
 * with questions unanswered. It allows the user to confirm their choice with 
 * this popup window.
 *
 * @module  ConfirmationDialog
 * @file    This file defines the style and components for the 
 *          ConfirmationDialog component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from "react";
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {useSnackbar} from 'notistack';
import snackbarSettings from '../../clientUtil/snackbarSettings';

import {useObserver} from "mobx-react";
import {useQuizStore} from '../../stores/quizStore';

const StyledButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#344955',
      color: 'white',
    },
  },
})(Button);

export default function ConfirmationDialog() {
  const quizStore = useQuizStore();
  const {enqueueSnackbar, } = useSnackbar();

  // Callback for submit button
  const handleSubmit = () => {
    quizStore.warningDialog = false;
    quizStore.submitAnswers()
    .then(err => {
      if (err) enqueueSnackbar(`${err}`, snackbarSettings('error'));
    });
  };

  // Callback for cancel button
  const handleClose = () => {
    quizStore.warningDialog = false;
  };

  return useObserver(() => (
    <Dialog
      open={quizStore.warningDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Submit With Questions Unanswered?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          There are {quizStore.remaining} questions that have not been answered. <br/>
          Unanswered questions will be counted as incorrect. <br/>
          Would you like to submit anyway?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <StyledButton 
          onClick={handleClose} 
          color="primary"
          size={"large"}
        >
          Cancel
        </StyledButton>
        <StyledButton 
          onClick={handleSubmit} 
          color="primary" 
          size={"large"} 
          autoFocus
        >
          Submit
        </StyledButton>
      </DialogActions>
    </Dialog>
  ));
}
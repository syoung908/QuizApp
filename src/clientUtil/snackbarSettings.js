/**
 * Notistack snackbar settings
 *
 * Defines the settings to be used with the snackbar notification system.
 *
 * @module  snackbarSettings
 * @file    Defines the settings to be used with the snackbar notification 
 *          system.
 * @author  syoung908
 * @since   1.0.0
 * @version 1.0.0
 */

export default function snackbarSettings(variant) {
  return({
    variant: variant,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    autoHideDuration: 10000,
  });
}
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
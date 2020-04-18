/**
 * @type App.ExWindow
 */
const exWindow = window;
const canShowSaveDialog = () => exWindow.showSaveDialog !== undefined;
const canShowOpenDialog = () => exWindow.showOpenDialog !== undefined;
/**
 * Displays a modal Open Dialog box.
 *
 * This function is not available in server mode.
 *
 * @see https://www.electronjs.org/docs/api/dialog#dialogshowsavedialogbrowserwindow-options
 * @param {Electron.OpenDialogOptions} options the dialog option
 * @returns Promise<Electron.OpenDialogReturnValue|Error>
 */
const showOpenDialog = (options) => {
  if (canShowOpenDialog()) {
    return exWindow.showOpenDialog(options);
  }
  return Promise.reject(new Error('dialog not suppprted in browser'));
};

/**
 * Displays a modal Save Dialog box.
 *
 * This function is not available in server mode.
 *
 * @see https://www.electronjs.org/docs/api/dialog#dialogshowsavedialogbrowserwindow-options
 * @param {Electron.OpenDialogOptions} options the dialog option
 * @returns Promise<Electron.OpenDialogReturnValue|Error>
 */
const showSaveDialog = (options) => {
  if (canShowSaveDialog()) {
    return exWindow.showSaveDialog(options);
  }
  return Promise.reject(new Error('dialog not suppprted in browser'));
};

export default {
  canShowSaveDialog,
  showSaveDialog,
  canShowOpenDialog,
  showOpenDialog
};

/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function useFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ 'webfontloader')

  webFontLoader.load({
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap'],

      // families: ['Roboto:100,300,400,500,700,900&display=swap', 'Google Sans:100,300,400,500,700,900&display=swap']
    },
  })
}

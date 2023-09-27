export class Constants {
  public static readonly logFileName: string = 'Dopamine.log'


  public static readonly previewApplicationTag: string = 'preview'
  public static readonly releaseCandidateApplicationTag: string = 'rc'
  public static readonly columnValueDelimiter: string = ';'

  public static readonly albumSizeInPixels: number = 120
  public static readonly itemMarginInPixels: number = 8
  public static readonly longListLoadDelayMilliseconds: number = 500
  public static readonly shortListLoadDelayMilliseconds: number = 50
  public static readonly albumsRedrawDelayMilliseconds: number = 150
  public static readonly searchDelayMilliseconds: number = 500
  public static readonly playlistSaveDelayMilliseconds: number = 3000
  public static readonly semanticZoomInDelayMilliseconds: number = 100
  public static readonly semanticZoomOutDelayMilliseconds: number = 100

  public static readonly cachedCoverArtMaximumSize: number = 360
  public static readonly cachedCoverArtJpegQuality: number = 80

  public static readonly externalCoverArtPatterns: string[] = [
    'front.png',
    'front.jpg',
    'front.jpeg',
    'cover.png',
    'cover.jpg',
    'cover.jpeg',
    'folder.png',
    'folder.jpg',
    'folder.jpeg',
    '%filename%.png',
    '%filename%.jpg',
    '%filename%.jpeg',
  ]

  public static readonly alphabeticalHeaders: string[] = [
    '#',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]

  public static artistsTabLabel: string = 'artists'
  public static genresTabLabel: string = 'genres'
  public static albumsTabLabel: string = 'albums'
  public static tracksTabLabel: string = 'tracks'
  public static playlistsTabLabel: string = 'playlists'
  public static foldersTabLabel: string = 'folders'

  // Transparent 1x1 Gif to avoid broken image icons.
  // See: https://stackoverflow.com/questions/22051573/how-to-hide-image-broken-icon-using-only-css-html/29111371
  public static emptyImage: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  public static readonly removablePrefixes: string[] = ['the', 'le', 'les', 'a', 'and']

}

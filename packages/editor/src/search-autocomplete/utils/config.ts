export interface DefaultTheme {
  height?: string
  border?: string
  borderRadius?: string
  backgroundColor?: string
  boxShadow?: string
  hoverBackgroundColor?: string
  color?: string
  fontSize?: string
  fontFamily?: string
  iconColor?: string
  lineColor?: string
  placeholderColor?: string
  zIndex?: number
  clearIconMargin?: string
  searchIconMargin?: string
}

const defaultTheme: DefaultTheme = {
  height: '44px',
  border: '1px solid #dfe1e5',
  borderRadius: '4px',
  backgroundColor: 'white',
  boxShadow: 'none',
  hoverBackgroundColor: '#eee',
  color: '#212121',
  fontSize: '16px',
  fontFamily: 'Arial',
  iconColor: '#fff',
  lineColor: 'rgb(232, 234, 237)',
  placeholderColor: '#fff',
  zIndex: 0,
  clearIconMargin: '3px 10px 0 0',
  searchIconMargin: '0 0 0 8px'
}

export { defaultTheme }
import Main from "./components/Main"
import Home from "./components/Nav"
import { ThemeProvider } from "./components/Theme-provider"
const App = () => {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Home/>
        <Main/>
      </ThemeProvider>
    </div>
  )
}

export default App

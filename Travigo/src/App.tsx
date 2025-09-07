import Home from "./components/Home"
import { ThemeProvider } from "./components/Theme-provider"
const App = () => {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Home/>
      </ThemeProvider>
    </div>
  )
}

export default App

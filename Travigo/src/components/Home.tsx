import { ModeToggle } from "./Mode-toggle"
import { Button } from "./ui/button"

const Home = () => {
  return (
    <div>
      <Button variant ="outline" size="lg">
        Hello
      </Button>
      <ModeToggle/>
    </div>
  )
}

export default Home

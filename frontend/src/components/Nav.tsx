import { ModeToggle } from "./Mode-toggle"
import { Button } from "./ui/button"
import { Globe } from "lucide-react"
const Nav = () => {
  return (
  <nav className="flex flex-row justify-between align-center text-center">
    <div className="logo ml-[8px] mt-[16px] flex flex-row gap-2">
      <Globe className="w-w-8 h-8 text-blue-400 ml-[10px]"/>
      <span className="text-white font-bold text-2xl tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
        TRAVIGO
      </span>
    </div>
    <div className="flex flex-row gap-5 mt-[16px] justify-center mr-[10px]">
      <Button variant ="outline" size="lg">
        Chat AI
      </Button>
      <Button variant ="outline" size="lg">
        About
      </Button><Button variant ="outline" size="lg">
        Contact
      </Button>
      <ModeToggle/>
    </div>
  </nav>
  )
}

export default Nav

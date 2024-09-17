import LoginPanel from '../components/LoginPanel'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold mb-8">Log in to Moons&apos; Tools.</h1>
      <LoginPanel Destination="/pokedex"/>
    </div>
  )
}
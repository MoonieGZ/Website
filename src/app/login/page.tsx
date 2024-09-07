import LoginPanel from "../components/LoginPanel"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold mb-8">Please log in with your PFQ account.</h1>
      <LoginPanel Destination="/pokedex" />
      <br />
      <p className="text-sm text-gray-500"><i>Note: This will only work with Staff accounts.</i></p>
    </div>
  )
}
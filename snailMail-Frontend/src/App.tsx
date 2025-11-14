import './App.css'
import TransportMode from './components/TransportMode'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">SnailMail Transport Modes</h1>
        <p className="app-subtitle">Choose your delivery method - the slower, the better!</p>
      </header>

      <div className="transport-grid">
        <TransportMode
          type="walking"
          speed="5 km/h"
          description="The classic approach. Your message walks to its destination, one step at a time."
        />

        <TransportMode
          type="swimming"
          speed="3 km/h"
          description="For water-based delivery. Your message swims across rivers, lakes, and oceans."
        />

        <TransportMode
          type="pigeon"
          speed="80 km/h"
          description="Air mail at its finest! A trusty pigeon carries your message through the skies."
        />

        <TransportMode
          type="rock-climbing"
          speed="1 km/h"
          description="The most adventurous route. Your message climbs mountains to reach its destination."
        />
      </div>

      <footer className="app-footer">
        <p>Because sometimes, anticipation is better than instant gratification.</p>
      </footer>
    </div>
  )
}

export default App

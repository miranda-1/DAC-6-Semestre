// Rede de segurança: se algo quebrar, mostra uma tela para recomeçar em vez de uma página branca.
import { Component, type ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  restart = () => {
    try {
      localStorage.removeItem('oficina-do-usuario-ao-criador')
    } catch {
      /* ignora */
    }
    location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid min-h-dvh place-items-center bg-paper p-6 text-ink">
        <div className="max-w-md text-center">
          <h1 className="text-5xl">Ops! Algo deu errado.</h1>
          <p className="mt-3 text-black/65">Acontece até com quem programa há anos. Vamos recomeçar a oficina do zero.</p>
          <button type="button" className="btn-accent mt-6 px-6 py-3 text-lg" onClick={this.restart}>
            ↺ Recomeçar
          </button>
          <p className="mt-6 font-mono text-xs text-black/40">{this.state.error.message}</p>
        </div>
      </div>
    )
  }
}

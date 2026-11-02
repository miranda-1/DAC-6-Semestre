// Conteúdo da "Minha lista" de cada tema (os cartões do site, que a turma marca com estrela).
import type { ThemeId } from './data'

export interface Item {
  title: string
  text: string
}

export const CONTENT: Record<Exclude<ThemeId, 'none'>, Item[]> = {
  games: [
    { title: 'Minecraft', text: 'Construa qualquer coisa, bloco por bloco.' },
    { title: 'Roblox', text: 'Milhares de jogos feitos pela comunidade.' },
    { title: 'Mario Kart', text: 'Corrida maluca para jogar com os amigos.' },
    { title: 'Stardew Valley', text: 'Uma fazendinha relaxante.' },
    { title: 'Among Us', text: 'Descubra quem é o impostor.' },

  ],
  musica: [
    { title: 'Playlist do recreio', text: 'Para animar o intervalo.' },
    { title: 'Hits da semana', text: 'O que está tocando em todo lugar.' },
    { title: 'Rap nacional', text: 'Rimas que contam histórias.' },
    { title: 'Para estudar', text: 'Música calma para focar.' },
    { title: 'Clássicos do rock', text: 'Guitarras que atravessam gerações.' },

  ],
  esportes: [
    { title: 'Turma A', text: '3 vitórias · 9 pontos' },
    { title: 'Turma B', text: '2 vitórias, 1 empate · 7 pontos' },
    { title: 'Turma C', text: '2 vitórias · 6 pontos' },
    { title: 'Turma D', text: '1 vitória, 1 empate · 4 pontos' },
    { title: 'Turma E', text: '1 empate · 1 ponto' },

  ],
  filmes: [
    { title: 'Animação', text: 'Desenhos que encantam todas as idades.' },
    { title: 'Super-heróis', text: 'Poderes, vilões e muita ação.' },
    { title: 'Comédia', text: 'Para rir até a barriga doer.' },
    { title: 'Aventura', text: 'Mapas, tesouros e viagens.' },
    { title: 'Mistério', text: 'Quem será o culpado?' },

  ],
  espaco: [
    { title: 'Júpiter', text: 'O maior planeta do Sistema Solar.' },
    { title: 'Saturno', text: 'Famoso pelos anéis de gelo e rocha.' },
    { title: 'Urano', text: 'Gira deitado, de lado.' },
    { title: 'Netuno', text: 'Tem os ventos mais fortes.' },
    { title: 'Terra', text: 'O único com vida que conhecemos.' },

  ],
}

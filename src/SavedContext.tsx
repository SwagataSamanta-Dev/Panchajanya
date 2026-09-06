import { createContext, useContext, useState, type ReactNode } from 'react'

type SavedCtx = {
  saved: number[]
  toggle: (id: number) => void
  isSaved: (id: number) => boolean
}

const Ctx = createContext<SavedCtx>({ saved: [], toggle: () => {}, isSaved: () => false })

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<number[]>([1, 3, 11, 13, 6])
  const toggle = (id: number) =>
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const isSaved = (id: number) => saved.includes(id)
  return <Ctx.Provider value={{ saved, toggle, isSaved }}>{children}</Ctx.Provider>
}

export const useSaved = () => useContext(Ctx)

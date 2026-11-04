"use client"

import { useSyncExternalStore } from "react"

// Solved-question ids live only in this browser. Every read and write is
// guarded, so private windows or blocked storage just mean no saved progress.
const KEY = "cse211-solved-v1"
const listeners = new Set<() => void>()
let cache: Set<string> | null = null

function read(): Set<string> {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(KEY)
    cache = new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    cache = new Set()
  }
  return cache
}

function write(next: Set<string>) {
  cache = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    // Storage unavailable: keep the in-memory copy for this visit.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

const EMPTY = new Set<string>()

export function useSolved() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function toggleSolved(id: string) {
  const next = new Set(read())
  if (next.has(id)) next.delete(id)
  else next.add(id)
  write(next)
}

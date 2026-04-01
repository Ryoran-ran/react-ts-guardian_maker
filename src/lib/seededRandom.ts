export class SeededRandom {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0 || 1
  }

  next(): number {
    let x = this.state
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    this.state = x >>> 0
    return this.state
  }

  nextFloat(): number {
    return this.next() / 0xffffffff
  }

  nextInt(min: number, max: number): number {
    const low = Math.ceil(min)
    const high = Math.floor(max)
    return Math.floor(this.nextFloat() * (high - low + 1)) + low
  }

  pick<T>(items: readonly T[]): T {
    return items[this.nextInt(0, items.length - 1)]
  }
}

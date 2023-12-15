export function keysToCamelCase<T extends Record<string, any>>(obj: T): KeysToCamelCase<T> {
  const newObj: any = {}
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(
      /([-_][a-z])/g,
      $1 => $1.charAt(1).toUpperCase(),
    )
    newObj[newKey] = obj[key]
  })
  return newObj
}

export function filterKeys<T extends Record<string, any>, K extends Array<keyof T>>(obj: T, keys: K) {
  const result: Partial<T> = {}
  const keysSet = new Set(keys)
  for (const key in obj) {
    if (!keysSet.has(key)) {
      result[key] = obj[key]
    }
  }
  return result as Omit<T, K[number]>
}

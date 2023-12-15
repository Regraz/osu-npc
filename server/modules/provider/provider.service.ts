import { provider } from '../provider/provider.db'

export async function loadProvider<K extends keyof ProviderDataMap>(
  providerId: K,
  keyId: string,
) {
  const data = await db.query.provider.findFirst({
    where: (provider, { eq, and }) =>
      and(
        eq(provider.providerId, providerId),
        eq(provider.keyId, keyId),
      ),
  })
  return data && {
    ...data,
    data: data.data as ProviderDataMap[K],
  }
}

export async function updateProvider<K extends keyof ProviderDataMap>(
  providerId: K,
  keyId: string,
  data: ProviderDataMap[K],
) {
  const now = new Date()
  await db.insert(provider)
    .values({
      keyId,
      providerId,
      data,
      updateAt: now,
    })
    .onConflictDoUpdate({
      target: provider.keyId,
      set: {
        data,
        updateAt: now,
      },
    })
}

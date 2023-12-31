<script setup lang="ts">
import { useFuse } from '@vueuse/integrations/useFuse'
import { UserRole } from '~/gql/graphql'

const [DefineSongCard, SongCard] = createReusableTemplate<{ song: Song }>()

const query = gql(`
  query fetchSongs{
    songs {
      id
      title
      artist
      url
      votes {
        user {
          id
          name
        }
      }
    }
  }
`)

const voteMutation = gql(`
  mutation voteSong($songId: ID!) {
    voteSong(songId: $songId) {
      song {
        id
        title
        artist
        url
        votes {
          user {
            id
            name
          }
        }
      }
    }
  }
`)

const unvoteMutation = gql(`
  mutation unvoteSong($songId: ID!) {
    unvoteSong(songId: $songId) {
      song {
        id
        title
        artist
        url
        votes {
          user {
            id
            name
          }
        }
      }
    }
  }
`)

const nominateAndVoteMutation = gql(`
  mutation nominateAndVote(
    $artist: String!
    $title: String!
    $url: String!
  ) {
    nominateAndVoteSong(
      songArtist: $artist
      songTitle: $title
      songUrl: $url
    ) {
      song {
        id
        title
        artist
        url
        votes {
          user {
            id
            name
          }
        }
      }
    }
  }
`)

const removeSongAdminMutation = gql(`
  mutation removeSongAdmin($songIds: [ID!]!) {
    removeSong(songIds: $songIds) {
      id
      title
      artist
      url
      votes {
        user {
          id
          name
        }
      }
    }
  }
`)

const { user } = useAuth()
const { raceState } = useRace()
const toast = useToast()
const { t } = useLocales()

useSeoMeta({
  title: t('vote.title'),
})

const adding = ref(false)
const title = ref('')
const artist = ref('')
const url = ref('')
const isConfirmed = ref(false)

const verifyInput = computed(() => {
  if (!user.value) {
    return false
  }
  if (title.value === '') {
    return false
  }
  if (adding.value) {
    if (artist.value === '' || url.value === '') {
      return false
    }
    if (!isConfirmed.value) {
      return false
    }
  }
  return true
})

const { data } = await useAsyncData(() => useQuery(query))
const { results: songsSearch } = useFuse(title, data.value?.songs ?? [], {
  fuseOptions: {
    keys: ['title', 'artist'],
  },
})
type Song = NonNullable<typeof data.value>['songs'][number]

const songs = computed<Song[]>(() => {
  if (title.value !== '') {
    return songsSearch.value.map(({ item }) => item)
  }
  return data.value?.songs
    .filter(song => song.votes.length !== 0)
    .toSorted((a, b) => b.votes.length - a.votes.length) ?? []
})

const songVoted = computed<Song[]>(() => {
  const userId = user.value?.id
  if (!userId) {
    return []
  }
  return data.value?.songs.filter(song =>
    song.votes.some(item =>
      userId === item.user.id,
    ),
  ) ?? []
})

const voteDisabled = computed(() => {
  if (!user.value) {
    return true
  }
  if (
    (user.value.voteSlots ?? 0)
    - songVoted.value.length === 0
  ) {
    return true
  }
  return false
})

function updateSong(song: Song) {
  if (!data.value?.songs) {
    return
  }

  const index = data.value.songs.findIndex(({ id }) => id === song.id)
  if (index !== undefined && index !== -1) {
    data.value.songs.splice(index, 1, song)
  }
  else {
    data.value.songs.push(song)
  }
}

async function voteSong(songId: string) {
  try {
    const res = await useMutation(voteMutation, {
      songId,
    })

    if (res?.voteSong?.song) {
      updateSong(res.voteSong?.song)
      toast.add({
        title: t('vote.toast.voteSuccess.title'),
        description: res.voteSong.song.title,
        color: 'green',
      })
    }
    else {
      throw new Error('Unknown error')
    }
  }
  catch (error) {
    toast.add({
      title: t('vote.toast.voteFailed.title'),
      description: t('vote.toast.voteFailed.description', {
        error: (error as Error).message,
      }),
      color: 'red',
    })
  }
}

async function unvoteSong(songId: string) {
  try {
    const res = await useMutation(unvoteMutation, {
      songId,
    })

    if (res?.unvoteSong?.song) {
      updateSong(res.unvoteSong?.song)
      toast.add({
        title: t('vote.toast.unvoteSuccess.title'),
        description: res.unvoteSong.song.title,
        color: 'green',
      })
    }
    else {
      throw new Error('Unknown error')
    }
  }
  catch (error) {
    toast.add({
      title: t('vote.toast.unvoteFailed.title'),
      description: t('vote.toast.unvoteFailed.description', {
        error: (error as Error).message,
      }),
      color: 'red',
    })
  }
}

async function nominateAndVoteSong(artist: string, title: string, url: string) {
  try {
    const res = await useMutation(nominateAndVoteMutation, {
      artist,
      title,
      url,
    })
    if (res?.nominateAndVoteSong?.song) {
      updateSong(res.nominateAndVoteSong?.song)
      adding.value = false
      toast.add({
        title: t('vote.toast.nominateSuccess.title'),
        description: res.nominateAndVoteSong.song.title,
        color: 'green',
      })
    }
    else {
      throw new Error('Unknown error')
    }
  }
  catch (error) {
    toast.add({
      title: t('vote.toast.nominateFailed.title'),
      description: t('vote.toast.nominateFailed.description', {
        error: (error as Error).message,
      }),
      color: 'red',
    })
  }
}

// admin only
async function removeSongAdmin(songId: string) {
  try {
    const res = await useMutation(removeSongAdminMutation, {
      songIds: [songId],
    })
    if (res?.removeSong.length === 1) {
      const index = data.value?.songs.findIndex(({ id }) => id === songId)
      if (index !== undefined && index !== -1) {
        data.value?.songs.splice(index, 1)
      }
      toast.add({
        title: 'Remove song success',
        description: res.removeSong[0].title,
        color: 'green',
      })
    }
    else {
      throw new Error('Unknown error')
    }
  }
  catch (error) {
    toast.add({
      title: 'Failed to remove song',
      description: `Failed when removing song: ${(error as Error).message}`,
      color: 'red',
    })
  }
}
</script>

<template>
  <DefineSongCard v-slot="{ song }">
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <div class="flex justify-between gap-2">
          <div class="flex-col">
            <h2 class="card-title">
              {{ song.title }}
            </h2>
            <p>
              <span class="opacity-50 select-none">by: </span>
              {{ song.artist }}
            </p>
          </div>
          <NuxtLink
            class="btn btn-ghost btn-sm btn-circle"
            :href="song.url" target="_blank"
          >
            <Icon name="material-symbols:open-in-new" class="w-5 h-5" />
          </NuxtLink>
        </div>

        <h3 class="font-bold">
          {{ $t('vote.card.votedTitle') }}
        </h3>
        <div class="grid gap-2">
          <p v-if="song.votes.length === 0" class="opacity-50 select-none">
            {{ $t('vote.card.votedEmptyHit') }}
          </p>
          <div
            v-for="vote, index in song.votes" :key="index"
            class="badge badge-outline"
            :class="{
              'badge-primary': vote.user.id === user?.id,
            }"
          >
            {{ vote.user.name ?? '?' }}
          </div>
        </div>
        <div v-if="user" class="card-actions justify-end">
          <template v-if="user?.role.includes(UserRole.Staff)">
            <button
              class="btn btn-ghost"
              @click="removeSongAdmin(song.id)"
            >
              ADMIN: Remove Song
            </button>
            <div class="flex-1" />
          </template>

          <button
            v-if="song.votes.some(item =>
              user!.id === item.user.id,
            )"
            class="btn btn-error"
            @click="unvoteSong(song.id)"
          >
            {{ $t('vote.card.actions.unvote') }}
          </button>
          <button
            v-else
            class="btn btn-primary"
            :disabled="voteDisabled"
            @click="voteSong(song.id)"
          >
            {{ $t('vote.card.actions.vote') }}
          </button>
        </div>
      </div>
    </div>
  </DefineSongCard>

  <div>
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div role="tablist" class="tabs tabs-boxed">
          <button
            role="tab"
            class="tab"
            :class="{
              'tab-active': !adding,
            }"
            @click="adding = !adding"
          >
            {{ $t('vote.tab.search') }}
          </button>
          <button
            role="tab"
            class="tab"
            :class="{
              'tab-active': adding,
            }"
            @click="adding = !adding"
          >
            {{ $t('vote.tab.new') }}
          </button>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">
              {{ $t('vote.form.title') }}
            </span>
          </label>
          <div class="join flex">
            <input v-model="title" class="join-item flex-1 input input-bordered">
            <button v-if="title && !adding" class="join-item btn btn-error" @click="title = ''">
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <template v-if="adding">
          <div class="form-control">
            <label class="label">
              <span class="label-text">
                {{ $t('vote.form.artist') }}
              </span>
            </label>
            <input v-model="artist" class="input input-bordered">
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">
                {{ $t('vote.form.url') }}
              </span>
            </label>
            <input v-model="url" class="input input-bordered">
          </div>
          <div class="form-control">
            <label class="label cursor-pointer gap-4">
              <span class="label-text">
                {{ $t('vote.form.confirm', { count: songs.length }) }}
              </span>
              <input v-model="isConfirmed" type="checkbox" :checked="false" class="checkbox checkbox-primary">
            </label>
          </div>
          <div class="card-actions">
            <button
              v-if="user"
              class="btn btn-primary btn-block"
              :disabled="!verifyInput || voteDisabled"
              @click="nominateAndVoteSong(artist, title, url)"
            >
              {{ $t('vote.form.submit') }}
            </button>
            <LoginButton v-else class="btn btn-primary btn-block" />
          </div>
        </template>
      </div>
    </div>
    <div v-if="voteDisabled" role="alert" class="alert alert-info mt-4 shadow-lg">
      <Icon name="mdi:alert-circle-outline" class="w-5 h-5" />
      <span v-if="user?.voteSlots">
        {{ $t('vote.alert.voteRunOut', { count: user?.voteSlots ?? 0 }) }}
      </span>
      <span v-else>
        {{ $t('vote.alert.voteNoSlot') }}
      </span>
    </div>
    <div v-if="raceState !== 'voting'" role="alert" class="alert alert-warning mt-4 shadow-lg">
      <Icon name="mdi:alert-circle-outline" class="w-5 h-5" />
      <span>{{ $t('vote.alert.voteClosed') }}</span>
    </div>

    <div class="grid">
      <div v-if="songVoted.length > 0">
        <h2 class="mt-8 text-2xl font-bold">
          {{ $t('vote.titleVoted') }}
          <span class="badge badge-outline badge-secondary">
            {{ songVoted.length }} / {{ user?.voteSlots ?? 0 }}
          </span>
        </h2>

        <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 md:gap-6 xl:gap-8">
          <SongCard v-for="song in songVoted" :key="song.id" :song="song" />
        </div>
      </div>
      <div :class="{ '-order-1': title }">
        <h2 class="mt-8 text-2xl font-bold">
          {{ title ? $t('vote.titleSearchResult') : $t('vote.titleSongList') }}
        </h2>

        <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 md:gap-6 xl:gap-8">
          <SongCard v-for="song in songs" :key="song.id" :song="song" />
        </div>
      </div>
    </div>
  </div>
</template>

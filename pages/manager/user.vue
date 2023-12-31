<script lang="ts" setup>
import { UserRole } from '~/gql/graphql'

definePageMeta({
  middleware: ['protected'],
})

const { auth, user } = useAuth()
const toast = useToast()

const allowed = computed(() => {
  return auth.value.state === 'authenticated' && auth.value.user.role.includes(UserRole.Staff)
})

if (process.client) {
  await until(auth).toMatch(v => v.state === 'authenticated')
  if (!allowed.value) {
    navigateTo('/')
  }
}

const query = gql(`
  query findUser($name: String!) {
    user(name: $name) {
      id
      name
      avatar
      role
      disabled
      votes {
        song {
          title
        }
      }
      nominatedSongs {
        title
      }
    }
  }
`)

const banUserMutation = gql(`
  mutation banUser($userId: ID!) {
    banUser(userId: $userId) {
      id
      name
      disabled
    }
  }
`)

const unbanUserMutation = gql(`
  mutation unbanUser($userId: ID!) {
    unbanUser(userId: $userId) {
      id
      name
      disabled
    }
  }
`)

const giveUserRoleMutation = gql(`
  mutation giveUserRole($userId: ID!, $role: UserRole!) {
    giveUserRole(userId: $userId, role: $role) {
      id
      name
      role
    }
  }
`)

const removeUserRoleMutation = gql(`
  mutation removeUserRole($userId: ID!, $role: UserRole!) {
    removeUserRole(userId: $userId, role: $role) {
      id
      name
      role
    }
  }
`)

const nameInput = ref('')
const name = ref('')
const { data } = useAsyncData(async () => {
  if (!allowed.value || !name.value) {
    return null
  }
  return await useQuery(query, {
    name: name.value,
  })
}, {
  watch: [
    name,
  ],
})

async function banSelectedUser(userId: string) {
  if (!allowed.value || data.value?.user?.id !== userId) {
    return
  }
  const updated = await useMutation(banUserMutation, {
    userId: data.value.user.id,
  })
  if (updated?.banUser?.disabled !== true) {
    toast.add({
      title: 'Failed',
      description: `Failed when banning user: ${data.value.user.name}`,
      color: 'red',
    })
    return
  }

  data.value.user.disabled = updated?.banUser?.disabled
}

async function unbanSelectedUser(userId: string) {
  if (!allowed.value || data.value?.user?.id !== userId) {
    return
  }
  const updated = await useMutation(unbanUserMutation, {
    userId: data.value.user.id,
  })
  if (updated?.unbanUser?.disabled !== false) {
    toast.add({
      title: 'Failed',
      description: `Failed when unbanning user: ${data.value.user.name}`,
      color: 'red',
    })
    return
  }

  data.value.user.disabled = updated?.unbanUser?.disabled
}

async function giveUserRole(userId: string, role: UserRole) {
  if (!allowed.value || data.value?.user?.id !== userId) {
    return
  }
  const updated = await useMutation(giveUserRoleMutation, {
    userId: data.value.user.id,
    role,
  })
  if (!updated?.giveUserRole?.role.includes(role)) {
    toast.add({
      title: 'Failed',
      description: `Failed when giving user(${data.value.user.name}) role: ${role.toString()}`,
      color: 'red',
    })
    return
  }

  data.value.user.role = updated.giveUserRole?.role
}

async function removeUserRole(userId: string, role: UserRole) {
  if (!allowed.value || data.value?.user?.id !== userId) {
    return
  }
  const updated = await useMutation(removeUserRoleMutation, {
    userId: data.value.user.id,
    role,
  })
  if (!updated?.removeUserRole?.role || updated.removeUserRole.role.includes(role)) {
    toast.add({
      title: 'Failed',
      description: `Failed when removing user(${data.value.user.name}) role: ${role.toString()}`,
      color: 'red',
    })
    return
  }

  data.value.user.role = updated.removeUserRole?.role
}
</script>

<template>
  <div v-if="allowed">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="form-control">
          <label class="label">
            <span class="label-text">
              Search User
            </span>
          </label>
          <div class="join flex">
            <input v-model="nameInput" class="join-item flex-1 input input-bordered">
            <button v-if="nameInput" class="join-item btn btn-error" @click="nameInput = ''">
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="card-actions">
          <button
            class="btn btn-primary btn-block"
            :disabled="nameInput === ''"
            @click="name = nameInput"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <div v-if="data?.user" class="card bg-base-100 shadow-lg mt-4">
      <div class="card-body">
        <div class="flex w-full m-4">
          <div class="avatar">
            <div class="w-16 h-16 rounded-full">
              <img v-if="data.user.avatar" :src="data.user.avatar">
            </div>
          </div>
          <div class="flex flex-col justify-center gap-1 flex-1 px-4 w-0">
            <div>
              <NuxtLink :to="`https://osu.ppy.sh/u/${data.user.name}`" class="card-title break-all">
                {{ data.user.name }}
              </NuxtLink>
            </div>

            <p class="flex gap-2">
              <span class="select-none font-bold">
                ID:
              </span>
              <span>
                {{ data.user.id }}
              </span>
            </p>

            <div class="flex gap-2 items-center">
              <span class="select-none font-bold">
                Role:
              </span>
              <div
                v-for="role in data.user.role"
                :key="role"
                class="badge badge-primary badge-outline"
              >
                {{ role }}
              </div>
            </div>
          </div>
        </div>

        <h2 class="mt-8 text-xl font-bold">
          Role
        </h2>
        <div class="card-actions">
          <button
            v-if="!data.user.role.includes(UserRole.Staff)"
            class="btn btn-primary btn-block"
            @click="giveUserRole(data.user.id, UserRole.Staff)"
          >
            Give Staff Role
          </button>
          <button
            v-if="data.user.role.includes(UserRole.Staff)"
            class="btn btn-error btn-block"
            :disabled="user?.id === data.user.id"
            @click="removeUserRole(data.user.id, UserRole.Staff)"
          >
            Remove Staff Role
          </button>

          <button
            v-if="!data.user.role.includes(UserRole.Judge)"
            class="btn btn-primary btn-block"
            @click="giveUserRole(data.user.id, UserRole.Judge)"
          >
            Give Judge Role
          </button>
          <button
            v-if="data.user.role.includes(UserRole.Judge)"
            class="btn btn-error btn-block"
            @click="removeUserRole(data.user.id, UserRole.Judge)"
          >
            Remove Judge Role
          </button>

          <button
            v-if="!data.user.role.includes(UserRole.Contestant)"
            class="btn btn-primary btn-block"
            @click="giveUserRole(data.user.id, UserRole.Contestant)"
          >
            Give Contestant Role
          </button>
          <button
            v-if="data.user.role.includes(UserRole.Contestant)"
            class="btn btn-error btn-block"
            @click="removeUserRole(data.user.id, UserRole.Contestant)"
          >
            Remove Contestant Role
          </button>
        </div>

        <h2 class="mt-8 text-xl font-bold">
          Ban User
        </h2>
        <div class="card-actions">
          <button
            v-if="!data.user.disabled"
            class="btn btn-error btn-block"
            :disabled="user?.id === data.user.id"
            @click="banSelectedUser(data.user.id)"
          >
            Ban User
          </button>
          <button
            v-else
            class="btn btn-primary btn-block"
            @click="unbanSelectedUser(data.user.id)"
          >
            Unban User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

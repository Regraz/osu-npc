<script setup lang="ts">
const { logout } = useAuthWritable()
const { user } = useAuth()
const { toggleDark, darkBtnIcon } = useDarkMode()

const [DefineNavList, ReuseNavList] = createReusableTemplate()

const { isVotingOpened, isSubmittingOpened, isResultOpened } = useRace()
</script>

<template>
  <DefineNavList>
    <ul>
      <li
        :class="{
          disabled: !isVotingOpened,
        }"
      >
        <NuxtLink
          :href="isVotingOpened ? { name: 'vote' } : undefined"
          :class="{
            active: $route.name === 'vote',
          }"
        >
          <Icon
            name="mdi:vote-outline"
            size="18"
          />
          {{ $t('general.navbar.vote') }}
        </NuxtLink>
      </li>
      <li
        :class="{
          disabled: !isSubmittingOpened,
        }"
      >
        <a>
          <Icon
            name="iconoir:submit-document"
            size="18"
          />
          {{ $t('general.navbar.submit') }}
        </a>
      </li>
      <li
        :class="{
          disabled: !isResultOpened,
        }"
      >
        <a>
          <Icon
            name="mdi:chess-king"
            size="18"
          />
          {{ $t('general.navbar.result') }}
        </a>
      </li>
    </ul>
  </DefineNavList>
  <div class="bg-base text-base-content sticky top-0 z-30 flex w-full bg-opacity-90 backdrop-blur shadow-sm">
    <div class="navbar">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <Icon name="mdi:menu" size="24" class="h-5 w-5" />
          </div>
          <ReuseNavList tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40" />
        </div>
        <NuxtLink class="btn btn-ghost text-xl" to="/">
          {{ $t('general.title') }}
        </NuxtLink>
      </div>

      <div class="navbar-center hidden lg:flex">
        <ReuseNavList class="menu menu-horizontal px-1" />
      </div>

      <div class="navbar-end">
        <button class="btn btn-ghost" @click="toggleDark">
          <Icon
            :name="darkBtnIcon"
            size="24"
          />
        </button>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost">
            <div class="avatar">
              <div v-if="user?.avatar" class="w-6 rounded-full">
                <img :src="user.avatar">
              </div>
              <Icon v-else name="mdi:dots-horizontal" size="24" class="h-6 w-6" />
            </div>
          </label>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
            <li v-if="user">
              <button @click="logout">
                {{ $t('general.signOut') }}
              </button>
            </li>
            <li v-else>
              <LoginButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

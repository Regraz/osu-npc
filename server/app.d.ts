/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./utils/lucia').Auth
  type DatabaseUserAttributes = Omit<
    import('./modules/user/user.db').DatabaseUser,
    'id'
  >
  type DatabaseSessionAttributes = Omit<
    import('./modules/user/user.db').DatabaseUserSession,
      'id' | 'user_id' | 'active_expires' | 'idle_expires'
  >
}

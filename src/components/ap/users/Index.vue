<script>
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { state } from '../../../app';
import UserView from './UserView';
import UserForm from './UserForm';

function search(user, query) {
  const lquery = query.toLowerCase();
  if (user.name.toLowerCase().indexOf(lquery) !== -1) {
    return true;
  }

  if (user.bio.toLowerCase().indexOf(lquery) !== -1) {
    return true;
  }

  return false;
}

export default {
  components: {
    UserView,
    UserForm,
  },
  data: () => ({
    query: '',
    adding: false,
  }),
  subscriptions() {
    this.filterChange$ = new ReplaySubject();
    this.filterChange$.next(null);

    return {
      currentUser: state.user,
      users: Observable
            .combineLatest(
              state.users,
              this.filterChange$,
            )
            .map(streams => streams[0])
            .map(users => users.filter((user) => {
              if (!this.query) {
                return true;
              }

              return search(user, this.query);
            })),
    };
  },
};
</script>

<template>
  <div class="userlist">
    <div class="userlist__filters">
      <input type="text" v-model="query" placeholder="Search here" />
    </div>
    <div class="userlist__list">
      <div class="userlist__list-item userlist__list-item_add">
        <div class="center"  v-if="currentUser.role === 'admin' && !adding">
          <button @click.prevent="adding = true">Add User</button>
        </div>
        <user-form class="track-form_inline" v-if="adding" @saved="adding = false" @cancel="adding = false"></user-form>
      </div>
      <user-view
        class="userlist__list-item"
        v-for="user in users"
        :key="user.id"
        v-bind="{ user }"
      ></user-view>
    </div>
  </div>
</template>

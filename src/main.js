import Vue from 'vue';
import VueRouter from 'vue-router';
import VueYouTubeEmbed from 'vue-youtube-embed';
import VueRx from 'vue-rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'; // Disposable if using RxJS4
import { Subject } from 'rxjs/Subject'; // required for domStreams option

// statics
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromEvent';

// methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

import App from './App';
import { router } from './router';

Vue.use(VueRouter);
Vue.use(VueYouTubeEmbed);
Vue.use(VueRx, {
  Observable,
  Subscription,
  Subject,
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
});

import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/reservation",
    name: "Reservation",
    component: () =>
      import(/* webpackChunkName: "reservation" */ "../views/Reservation.vue"),
  },
  {
    path: "/clubs",
    name: "ClubOverview",
    component: () =>
      import(/* webpackChunkName: "clubs" */ "../views/ClubOverview.vue"),
  },
  {
    path: "/clubs/:name",
    name: "Clubpage",
    component: () =>
      import(/* webpackChunkName: "clubpage" */ "../views/Clubpage.vue"),
  },
];

const router: VueRouter = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;

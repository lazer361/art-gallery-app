import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import GalleryView from '../views/GalleryView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'gallery',
    component: GalleryView,
    meta: {
      title: 'Art Gallery',
      description: 'Тестовое задание Framework Team'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Page Not Found',
      description: 'Страница, которую вы ищете, не существует !'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

const updateMetaTags = (title: string, description: string) => {
  document.title = title

  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', description)
}

router.beforeEach((to, _from, next) => {
  const title = (to.meta.title as string) || 'Art Gallery'
  const description = (to.meta.description as string) || 'Explore our art collection'

  updateMetaTags(title, description)
  next()
})

router.onError((error, to) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('Navigation error:', {
      error,
      route: to
    })
  }

  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.href = to.fullPath
  }
})

export default router

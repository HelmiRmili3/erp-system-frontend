import { createRouter, createWebHistory } from 'vue-router'

import RegisterView from '@/views/Auth/RegisterView.vue'
import LoginView from '@/views/Auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/admin/home'
    },

    {
      path: '/auth',
      name: 'Auth',
      children: [
        {
          path: 'register',
          name: 'Register',
          component: RegisterView,
          meta: {
            guest: true
          }
        },
        {
          path: 'login',
          name: 'Login',
          component: LoginView,
          meta: {
            guest: true
          }
        },
        {
          path: 'verify-email',
          name: 'VerifyEmail',
          component: () => import('../views/Auth/VerifyEmailView.vue'),
          meta: {
            guest: true
          }
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: () => import('../views/Auth/ForgotPasswordView.vue'),
          meta: {
            guest: true
          }
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: () => import('../views/Auth/ResetPasswordView.vue'),
          meta: {
            guest: true
          }
        }
      ]
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: {
        requiresAuth: true,
        requiresLoading: true
      },
      redirect: '/admin/home',
      children: [
        {
          path: 'home',
          name: 'AdminDashboardHome',
          component: () => import('@/views/admin/AdminDashboardHome.vue')
        },
        {
          path: 'categories',
          name: 'AdminDashboardCategory',
          children: [
            {
              path: '',
              name: 'AdminDashboardCategories',
              component: () => import('@/views/admin/AdminDashboardCategories.vue')
            },
            {
              path: ':id/categories',
              name: 'AdminDashboardSubCategories',
              component: () => import('@/views/admin/AdminDashboardSubCategories.vue')
            }
          ]
        },
        {
          path: 'configurations',
          name: 'AdminDashboardConfigurations',
          component: () => import('@/views/admin/AdminDashboardConfiguration.vue')
        }
      ]
    }
  ]
})
export default router

import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/NotFound.vue'

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
    // {
    //   path: '/admin',
    //   name: 'AdminDashboard',
    //   component: () => import('@/views/admin/AdminDashboardView.vue'),
    //   meta: {
    //     requiresAuth: true,
    //     requiresLoading: true
    //   },
    //   redirect: '/admin/home',
    //   children: [
    //     {
    //       path: 'home',
    //       name: 'AdminDashboardHome',
    //       component: () => import('@/views/admin/AdminDashboardHome.vue')
    //     },
    //     {
    //       path: 'absences',
    //       name: 'Absences',
    //       children: [
    //         {
    //           path: '/absences',
    //           name: 'AdminDashboardCategories',
    //           component: () => import('@/views/admin/AdminDashboardCategories.vue')
    //         }
    //         // {
    //         //   path: ':id/categories',
    //         //   name: 'AdminDashboardSubCategories',
    //         //   component: () => import('@/views/admin/AdminDashboardSubCategories.vue')
    //         // }
    //       ]
    //     },
    //     {
    //       path: 'attendances',
    //       name: 'Attendances',
    //       children: [
    //         {
    //           path: '',
    //           name: '/all',
    //           component: () => import('@/views/admin/AdminDashboardCategories.vue')
    //         }
    //         // {
    //         //   path: ':id/categories',
    //         //   name: 'AdminDashboardSubCategories',
    //         //   component: () => import('@/views/admin/AdminDashboardSubCategories.vue')
    //         // }
    //       ]
    //     }
    //     // {
    //     //   path: 'configurations',
    //     //   name: 'AdminDashboardConfigurations',
    //     //   component: () => import('@/views/admin/AdminDashboardConfiguration.vue')
    //     // }
    //   ]
    // }
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
          path: 'users',
          name: 'AdminDashboardUsers',
          component: () => import('@/views/admin/AdminDashboardUsers.vue'),
          meta: {
            roles: ['Administrator']
          }
        },
        {
          path: 'absences',
          name: 'AdminDashboardAbsences',
          component: () => import('@/views/admin/AdminDashboardAbsences.vue'),
          meta: {
            roles: ['Employee']
          }
        },
        // {
        //   path: 'attendances',
        //   name: 'Attendances',
        //   component: () => import('@/views/admin/attendances.vue')
        // },
        // {
        //   path: 'contracts',
        //   name: 'Contracts',
        //   component: () => import('@/views/admin/Contracts.vue')
        // },
        // {
        //   path: 'certifications',
        //   name: 'Certifications',
        //   component: () => import('@/views/admin/Certifications.vue')
        // },
        // {
        //   path: 'expenses',
        //   name: 'Expenses',
        //   component: () => import('@/views/admin/Expenses.vue')
        // },
        // {
        //   path: 'payrolls',
        //   name: 'Payrolls',
        //   component: () => import('@/views/admin/Payrolls.vue')
        // },
        {
          path: 'roles',
          name: 'AdminDashboardRoles',
          component: () => import('@/views/admin/AdminDashboardRoles.vue'),
          meta: {
            roles: ['Administrator'],
            permissions: ['Roles.View']
          }
        },
        {
          path: 'permissions',
          name: 'AdminDashboardPermissions',
          component: () => import('@/views/admin/AdminDashboardPermissions.vue'),
          meta: {
            roles: ['Administrator']
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
export default router

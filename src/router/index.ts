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
      path: '/me',
      name: '/meHome',
      redirect: '/me/home'
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
            roles: ['Administrator']
          }
        },
        {
          path: 'attendances',
          name: 'AdminAttendances',
          component: () => import('@/views/admin/AdminDashboardAttendances.vue'),
          meta: {
            roles: ['Administrator']
          }
        },
        {
          path: 'contracts',
          name: 'AdminContracts',
          component: () => import('@/views/admin/AdminDashboardContracts.vue'),
          meta: {
            roles: ['Administrator']
          }
        },
        {
          path: 'certifications',
          name: 'AdminCertifications',
          component: () => import('@/views/admin/AdminDashboardCertifications.vue'),
          meta: {
            roles: ['Administrator']
          }
        },
        {
          path: 'expenses',
          name: 'AdminExpenses',
          component: () => import('@/views/admin/AdminDashboardExpenses.vue'),
          meta: {
            roles: ['Administrator']
          }
        },
        {
          path: 'payrolls',
          name: 'AdminPayrolls',
          component: () => import('@/views/admin/AdminDashboardPayroll.vue'),
          meta: {
            roles: ['Administrator']
          }
        },
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
      path: '/me',
      name: 'EmployeeDashboard',
      component: () => import('@/views/me/EmployeeDashboardView.vue'),
      meta: {
        requiresAuth: true,
        requiresLoading: true
      },
      redirect: '/me/home',
      children: [
        {
          path: 'home',
          name: 'EmployeeDashboardHome',
          component: () => import('@/views/me/EmployeeDashboardHome.vue')
        },
        {
          path: 'absences',
          name: 'EmployeeAbsencesView',
          component: () => import('@/views/me/EmployeeAbsencesView.vue'),
          meta: {
            roles: ['Employee']
          }
        },
        {
          path: 'attendances',
          name: 'EmployeeAttendancesView',
          component: () => import('@/views/me/EmployeeAttendancesView.vue'),
          meta: {
            roles: ['Employee']
          }
        },
        {
          path: 'contracts',
          name: 'EmployeeContractsView',
          component: () => import('@/views/me/EmployeeContractsView.vue'),
          meta: {
            roles: ['Employee']
          }
        },
        {
          path: 'certifications',
          name: 'EmployeeCertificationsView',
          component: () => import('@/views/me/EmployeeCertificationsView.vue'),
          meta: {
            roles: ['Employee']
          }
        },
        {
          path: 'expenses',
          name: 'EmployeeExpensesView',
          component: () => import('@/views/me/EmployeeExpensesView.vue'),
          meta: {
            roles: ['Employee']
          }
        },
        {
          path: 'payrolls',
          name: 'EmployeePayrollsView',
          component: () => import('@/views/me/EmployeePayrollView.vue'),
          meta: {
            roles: ['Employee']
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

import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    breadcrumb: false,
    hidden: true
  },

  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index'),
    hidden: true
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: '/home',
        meta: { title: 'Home', icon: 'link' }
      }
    ]
  },

  {
    path: '/material',
    component: Layout,
    redirect: '/material/video',
    name: 'material',
    meta: { title: '素材库', icon: 'table' },
    children: [
      {
        path: 'video',
        component: () => import('@/views/material/videopage/index'),
        name: 'VideoLibrary',
        meta: { title: '视频', icon: 'video' }
      },
      {
        path: 'image',
        component: () => import('@/views/material/imagepage/index'),
        name: 'ImageLibrary',
        meta: { title: '图片', icon: 'image' }
      }
    ]
  },

  {
    path: '/database',
    redirect: '/database/video',
    component: Layout,
    hidden: false,
    alwaysShow: true,
    name: 'dataset',
    meta: { title: '数据集', icon: 'table' },
    children: [
      {
        path: 'video',
        component: () => import('@/views/dataset/videodata/index'),
        name: 'VideoDataset',
        meta: { title: '视频数据集', icon: 'video' }
      }
    ]
  },

  {
    path: '/deepfake',
    component: Layout,
    redirect: '/deepfake/detection',
    hidden: false,
    meta: {
      title: 'DF检测',
      icon: 'deepfake'
    },
    children: [
      {
        path: 'detection',
        component: () => import('@/views/deepfake/detection/index'),
        name: 'DeepfakeDetection',
        meta: { title: 'Detection' }
      },
      {
        path: 'result',
        component: () => import('@/views/deepfake/result/index'),
        name: 'DeepfakeDetectionResult',
        meta: { title: 'Result' }
      },
      {
        path: 'status',
        component: () => import('@/views/deepfake/status/index'),
        name: 'DeepfakeDetectionStatus',
        meta: {
          title: 'status'
        }
      },
      {
        path: 'image',
        component: () => import('@/views/deepfake/image/index'),
        name: 'ImageDetection',
        meta: { title: 'ImageDetection' }
      }
    ]
  },

  {
    path: '/trace',
    component: Layout,
    redirect: '/trace/method',
    hidden: false,
    meta: {
      title: '社交溯源',
      icon: 'example'
    },
    children: [
      {
        path: 'method',
        component: () => import('@/views/trace/method/index'),
        name: 'Trace',
        meta: { title: 'Trace' }
      },
      {
        path: 'result',
        component: () => import('@/views/trace/result/index'),
        name: 'TraceResult',
        meta: { title: 'Result' }
      },
      {
        path: 'status',
        component: () => import('@/views/trace/status/index'),
        name: 'TraceStatus',
        meta: {
          title: 'status'
        }
      }
    ]
  },

  {
    path: '/forgery',
    component: Layout,
    redirect: '/forgery/detection',
    hidden: false,
    meta: {
      title: '通用篡改检测',
      icon: 'example'
    },
    children: [
      {
        path: 'detection',
        component: () => import('@/views/forgery/detection/index'),
        name: 'ForgeryDetection',
        meta: { title: 'ForgeryDetection' }
      },
      {
        path: 'result',
        component: () => import('@/views/forgery/result/index'),
        name: 'ForgeryResult',
        meta: { title: 'Result' }
      },
      {
        path: 'status',
        component: () => import('@/views/forgery/status/index'),
        name: 'ForgeryStatus',
        meta: {
          title: 'status'
        }
      },
      {
        path: 'image',
        component: () => import('@/views/forgery/image/index'),
        name: 'ForgeryDetectionAll',
        meta: { title: 'ForgeryDetectionAll' }
      }
    ]
  },

  {
    path: '/adversarial',
    component: Layout,
    redirect: '/adversarial/detection',
    hidden: false,
    meta: {
      title: '对抗检测',
      icon: 'example'
    },
    children: [
      {
        path: 'detection',
        component: () => import('@/views/adversarial/detection/index'),
        name: 'AdeversarialDetection',
        meta: { title: 'AdversarialDetection' }
      },
      {
        path: 'result',
        component: () => import('@/views/adversarial/result/index'),
        name: 'AdversarialResult',
        meta: { title: 'Result' }
      },
      {
        path: 'status',
        component: () => import('@/views/adversarial/status/index'),
        name: 'AdversarialStatus',
        meta: {
          title: 'status'
        }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

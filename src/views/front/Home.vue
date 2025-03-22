<template>
  <div class="container mx-auto px-4">
    <!-- 轮播图 -->
    <div class="carousel w-full h-[500px] rounded-box overflow-hidden mb-8">
      <div v-for="(slide, index) in slides" 
        :key="index" 
        :class="['carousel-item relative w-full', { 'hidden': currentSlide !== index }]"
      >
        <img :src="slide.image" class="w-full object-cover" :alt="slide.title" />
        <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <button 
            @click.prevent="prevSlide" 
            class="btn btn-circle btn-ghost"
          >❮</button>
          <button 
            @click.prevent="nextSlide" 
            class="btn btn-circle btn-ghost"
          >❯</button>
        </div>
        <!-- 轮播图文本 -->
        <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-base-300/90 to-transparent">
          <h2 class="text-3xl font-bold mb-2">{{ slide.title }}</h2>
          <p class="text-lg">{{ slide.description }}</p>
        </div>
      </div>

      <!-- 轮播图指示器 -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        <button 
          v-for="(_, index) in slides" 
          :key="index"
          @click="currentSlide = index"
          :class="[
            'w-3 h-3 rounded-full transition-colors',
            currentSlide === index ? 'bg-primary' : 'bg-base-300'
          ]"
        ></button>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="mb-12">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">服装分类</h2>
          <p class="text-base-content/70">选择您需要的服装类型</p>
        </div>
        <div class="stats bg-base-200 shadow-lg">
          <div class="stat">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div class="stat-title">总商品</div>
            <div class="stat-value text-primary">{{ totalItems }}</div>
            <div class="stat-desc">所有分类商品总数</div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="`/clothing?category=${category.id}`"
          class="card bg-base-100 hover:bg-base-200 shadow-md hover:shadow-xl transition-all duration-300 group"
        >
          <figure class="px-6 pt-6 pb-2 transition-transform duration-300 group-hover:scale-110">
            <img :src="category.icon" class="w-20 h-20 object-contain" :alt="category.name" />
          </figure>
          <div class="card-body items-center text-center p-4">
            <h3 class="card-title text-lg mb-2 group-hover:text-primary transition-colors">{{ category.name }}</h3>
            <div class="flex items-center gap-2">
              <div class="badge badge-primary badge-lg">{{ category.count }}</div>
              <span class="text-base-content/70 text-sm">件商品</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 热门服装 -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">热门服装</h2>
        <router-link to="/clothing" class="btn btn-primary btn-outline">
          查看更多
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="item in hotClothing" 
          :key="item.id"
          class="card bg-base-100 hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <figure class="px-4 pt-4">
            <img :src="item.image" class="rounded-xl aspect-[3/4] object-cover" :alt="item.name" />
          </figure>
          <div class="card-body p-4">
            <h3 class="card-title text-lg">{{ item.name }}</h3>
            <div class="flex items-center gap-2">
              <div class="badge badge-lg">¥{{ item.price }}/天</div>
              <div class="badge badge-ghost">已租{{ item.rentCount }}次</div>
            </div>
            <div class="card-actions justify-end mt-2">
              <router-link :to="`/clothing/${item.id}`" class="btn btn-primary btn-sm">立即预订</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 租赁流程 -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">租赁流程</h2>
          <p class="text-base-content/70">简单四步，轻松租赁</p>
        </div>
      </div>

      <!-- 步骤时间线 -->
      <div class="relative mb-16">
        <div class="flex justify-between items-center relative">
          <div v-for="(step, index) in rentalSteps" :key="index" 
            class="flex-1 relative"
            @mouseenter="previewStep = index"
            @mouseleave="previewStep = currentStep"
          >
            <!-- 步骤数字 -->
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="relative">
                <div class="absolute inset-0 bg-primary rounded-full transform transition-transform duration-300"
                  :class="[
                    currentStep === index ? 'scale-100' : 'scale-75',
                    previewStep === index ? 'scale-100' : ''
                  ]"
                ></div>
                <div class="relative w-12 h-12 flex items-center justify-center font-bold text-xl text-primary-content">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
            <!-- 连接线 -->
            <div v-if="index < rentalSteps.length - 1" 
              class="absolute top-0 left-[calc(50%+1.5rem)] right-0 h-[3px] bg-base-300"
            >
              <div class="absolute inset-0 bg-primary transform origin-left transition-transform duration-500"
                :class="[
                  currentStep > index ? 'scale-x-100' : 'scale-x-0',
                  previewStep > index ? 'scale-x-100' : ''
                ]"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- 步骤内容 -->
        <div class="flex justify-between mt-16">
          <div v-for="(step, index) in rentalSteps" :key="index" 
            class="flex-1 px-4 text-center transform transition-all duration-300"
            :class="[
              currentStep === index ? 'scale-105' : 'scale-100',
              previewStep === index ? 'scale-105' : ''
            ]"
          >
            <div class="font-bold text-lg mb-2">{{ step.title }}</div>
            <div class="text-sm text-base-content/70">{{ step.subtitle }}</div>
          </div>
        </div>
      </div>

      <!-- 步骤详情预览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(step, index) in rentalSteps" 
          :key="index"
          class="card bg-base-100 transition-all duration-300 cursor-pointer transform hover:scale-105"
          :class="[
            currentStep === index ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-xl',
            previewStep === index ? 'ring-2 ring-primary/50' : ''
          ]"
          @click="currentStep = index"
          @mouseenter="previewStep = index"
          @mouseleave="previewStep = currentStep"
        >
          <div class="card-body p-6">
            <div class="flex items-center gap-4 mb-4">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors duration-300"
                :class="[
                  currentStep === index || previewStep === index 
                    ? 'bg-primary text-primary-content' 
                    : 'bg-base-200 text-base-content'
                ]"
              >
                {{ index + 1 }}
              </div>
              <h3 class="card-title text-lg">{{ step.title }}</h3>
            </div>
            <div class="space-y-3">
              <div class="badge badge-primary">{{ step.subtitle }}</div>
              <p class="text-base-content/80">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务特色 -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">服务特色</h2>
          <p class="text-base-content/70">为什么选择我们</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
          <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="card-title">品质保证</h3>
            </div>
            <p class="text-base-content/80">所有服装经过专业清洗消毒，确保卫生安全，让您穿着放心。</p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
          <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="card-title">准时配送</h3>
            </div>
            <p class="text-base-content/80">专业物流配送，确保按时送达，让您的活动准时开始。</p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
          <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="card-title">优惠价格</h3>
            </div>
            <p class="text-base-content/80">合理的租赁价格，让您以最实惠的价格体验高品质服装。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户评价 -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">用户评价</h2>
          <p class="text-base-content/70">听听他们怎么说</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img src="https://picsum.photos/100/100?random=1" alt="avatar" />
                </div>
              </div>
              <div>
                <h3 class="font-bold">张小姐</h3>
                <div class="flex text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-base-content/80">"服装质量非常好，面试穿的西装很合身，给人很专业的感觉，价格也很实惠。"</p>
            <div class="card-actions justify-end mt-4">
              <div class="badge badge-ghost">面试西装</div>
              <div class="badge badge-primary">5星好评</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img src="https://picsum.photos/100/100?random=2" alt="avatar" />
                </div>
              </div>
              <div>
                <h3 class="font-bold">王先生</h3>
                <div class="flex text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-base-content/80">"配送很及时，衣服也很干净整洁，客服态度特别好，有问题都能及时解答。"</p>
            <div class="card-actions justify-end mt-4">
              <div class="badge badge-ghost">商务装</div>
              <div class="badge badge-primary">优质服务</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img src="https://picsum.photos/100/100?random=3" alt="avatar" />
                </div>
              </div>
              <div>
                <h3 class="font-bold">李女士</h3>
                <div class="flex text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-base-content/80">"参加朋友婚礼租了一件礼服，款式很新颖，朋友都说很漂亮，以后还会继续光顾。"</p>
            <div class="card-actions justify-end mt-4">
              <div class="badge badge-ghost">礼服</div>
              <div class="badge badge-primary">回头客</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 当前显示的轮播图索引
const currentSlide = ref(0)

// 切换到上一张
const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
}

// 切换到下一张
const nextSlide = () => {
  currentSlide.value = currentSlide.value === slides.value.length - 1 ? 0 : currentSlide.value + 1
}

// 自动轮播
let autoplayInterval: number | null = null

const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    nextSlide()
  }, 5000) // 每5秒切换一次
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

// 组件挂载时启动自动轮播
onMounted(() => {
  startAutoplay()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoplay()
})

// 轮播图数据
const slides = ref([
  {
    image: 'https://yize.ecel.cloud:9000/source/lry/cefcfc59cbb0f29393262de0606a7f70.jpg',
    title: '春季新品上市',
    description: '多款时尚单品，助您打造完美形象'
  },
  {
    image: 'https://yize.ecel.cloud:9000/source/lry/a034759e5396e497268c9320b290b1c1.jpeg',
    title: '商务正装专区',
    description: '面试、商务场合的最佳选择'
  },
  {
    image: 'https://yize.ecel.cloud:9000/source/lry/42697d22b65c2e0ed6d841bd20b83a5f.jpeg',
    title: '特惠活动',
    description: '新用户首单立减50元'
  }
])

// 分类数据
const categories = ref([
  { id: 1, name: '连衣裙', icon: 'https://yize.ecel.cloud:9000/source/lry/tongzhuang.png', count: 128 },
  { id: 2, name: '男装', icon: 'https://yize.ecel.cloud:9000/source/lry/nanzhuang.png', count: 86 },
  { id: 3, name: '女装', icon: 'https://yize.ecel.cloud:9000/source/lry/nvzhuang.png', count: 95 },
  { id: 4, name: '童装', icon: 'https://yize.ecel.cloud:9000/source/lry/tongzhuang.png', count: 64 }
])

// 计算总商品数
const totalItems = computed(() => {
  return categories.value.reduce((total, category) => total + category.count, 0)
})

// 热门服装数据
const hotClothing = ref([
  {
    id: 1,
    name: '黑色商务西装',
    price: 99,
    image: 'https://yize.ecel.cloud:9000/source/lry/detail_back.jpg',
    rentCount: 256
  },
  {
    id: 2,
    name: '白色蕾丝连衣裙',
    price: 69,
    image: 'https://yize.ecel.cloud:9000/source/lry/detail_back.jpg',
    rentCount: 188
  },
  {
    id: 3,
    name: '驼色风衣',
    price: 79,
    image: 'https://yize.ecel.cloud:9000/source/lry/detail_back.jpg',
    rentCount: 142
  },
  {
    id: 4,
    name: '格纹西装套装',
    price: 129,
    image: 'https://yize.ecel.cloud:9000/source/lry/detail_back.jpg',
    rentCount: 98
  }
])

// 更新租赁流程数据
const rentalSteps = ref([
  {
    title: '选择服装',
    subtitle: '在线选购',
    description: '可以根据场合、风格、尺码等条件筛选，支持收藏和加入购物车'
  },
  {
    title: '提交订单',
    subtitle: '确认租赁时间，支付押金',
    description: '支持支付宝、微信支付，押金金额视服装价值而定'
  },
  {
    title: '收取服装',
    subtitle: '快递配送到家或自提',
    description: '支持预约配送时间，提供专业的衣物防尘袋包装'
  },
  {
    title: '归还服装',
    subtitle: '按时归还，退还押金',
    description: '支持快递寄回或门店归还，验收无误后退还押金'
  }
])

// 添加当前选中的步骤
const currentStep = ref(0)

// 在 script setup 中添加
const previewStep = ref(0)
</script>

